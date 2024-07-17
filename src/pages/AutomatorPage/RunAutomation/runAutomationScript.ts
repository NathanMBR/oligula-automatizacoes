import { invoke } from '@tauri-apps/api'

import {
  MouseButton,
  type Variables
} from '../../../types'
import {
  ensureCharactersLimit,
  sleep
} from '../../../helpers'
import type { AutomationData } from '../../../providers'

export type RunAutomationData = Pick<AutomationData, 'steps' | 'variables'> & {
  globalTimeBetweenStepsInMs: number
}

/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
export const runAutomationScript = async (data: RunAutomationData) => {
  const {
    globalTimeBetweenStepsInMs,
    steps,
    variables
  } = data

  const hasVariable = (name: string) => name.toLowerCase() in variables
  const getVariable = (name: string) => variables[name.toLowerCase()]
  const setVariable = (name: string, value: Variables[string]) => {
    variables[name.toLowerCase()] = value
  }

  for (const step of steps) {
    if (globalTimeBetweenStepsInMs > 0)
      await sleep(globalTimeBetweenStepsInMs)

    // actions

    if (step.type === 'move') {
      console.log(`Running step "move" to position x: ${step.data.x}, y: ${step.data.y}`)

      await invoke('move_mouse_to', { position: step.data })
      continue
    }

    if (step.type === 'click') {
      console.log(`Running step "click" with button ${step.data.button}`)

      await invoke('click', { button: MouseButton[step.data.button] })
      continue
    }

    if (step.type === 'write') {
      const textToWrite = step.data.text.length <= 0 && hasVariable(step.data.readFrom)
        ? getVariable(step.data.readFrom)!.value
        : step.data.text

      if (typeof textToWrite !== 'string')
        return console.error(`Unexpected Error: Variable "${step.data.readFrom}" isn't a text (got ${typeof textToWrite})`)

      console.log(`Running step "write" with text "${ensureCharactersLimit(textToWrite, 50)}"`)

      await invoke('write', { text: textToWrite })

      continue
    }

    if (step.type === 'parseString') {
      const {
        parseString,
        readFrom,
        divider,
        saveAs
      } = step.data

      let textToParse: string

      if (parseString.length > 0)
        textToParse = parseString
      else {
        if (!hasVariable(readFrom))
          return console.error(`Unexpected Error: Variable "${readFrom}" not found`)

        const variable = getVariable(readFrom)!
        if (typeof variable.value !== 'string')
          return console.error(`Unexpected Error: Variable "${readFrom}" isn't a text (got ${typeof variable.value})`)

        textToParse = variable.value
      }

      console.log(`Running step "parseString" with divider "${ensureCharactersLimit(divider, 50)}" and text "${ensureCharactersLimit(textToParse, 50)}"`)

      const parsedText = textToParse.split(divider)
      setVariable(saveAs, {
        ownerId: step.id,
        value: parsedText
      })

      continue
    }

    if (step.type === 'sleep') {
      console.log(`Running step "sleep" during ${step.data.time} ms`)

      if (step.data.time > 0)
        await sleep(step.data.time)

      continue
    }

    // statements

    if (step.type === 'cycle') {
      const iterable = getVariable(step.data.iterable)
      if (!iterable)
        return console.error(`Unexpected Error: Variable "${step.data.iterable}" not found`)

      if (!Array.isArray(iterable.value))
        return console.error(`Unexpected Error: Variable "${step.data.iterable}" isn't a list (got ${typeof iterable.value})`)

      console.log(`Running step "cycle" with iterable "${step.data.iterable}"`)

      for (const item of iterable.value) {
        const newVariable = {
          ownerId: step.id,
          value: item
        }

        await runAutomationScript({
          globalTimeBetweenStepsInMs,
          steps: step.data.steps,
          variables: {
            ...variables,
            [step.data.saveItemsAs]: newVariable
          }
        })
      }

      continue
    }

    if (step.type === 'conditional') {
      console.log('Running step "conditional"')

      const {
        leftSide,
        operator,
        rightSide
      } = step.data.condition

      let leftValue = leftSide.origin === 'value'
        ? leftSide.value
        : getVariable(leftSide.readFrom)?.value

      let rightValue = rightSide.origin === 'value'
        ? rightSide.value
        : getVariable(rightSide.readFrom)?.value

      const numberOnlyConditionOperators: Array<typeof operator> = [
        'greaterThan',
        'lesserThan',
        'greaterOrEqualThan',
        'lesserOrEqualThan'
      ]

      if (numberOnlyConditionOperators.includes(operator)) {
        leftValue = Number(leftValue)
        rightValue = Number(rightValue)
      }

      type ResolverFn = (leftValue: any, rightValue: any) => boolean
      const operatorResolvers: Record<typeof operator, ResolverFn> = {
        equal: (left, right) => left === right,
        notEqual: (left, right) => left !== right,
        greaterThan: (left, right) => left > right,
        lesserThan: (left, right) => left < right,
        greaterOrEqualThan: (left, right) => left >= right,
        lesserOrEqualThan: (left, right) => left <= right
      }

      const operatorResolver = operatorResolvers[operator]
      const shouldExecuteConditionalSteps = operatorResolver(leftValue, rightValue)
      if (!shouldExecuteConditionalSteps)
        continue

      await runAutomationScript({
        globalTimeBetweenStepsInMs,
        steps: step.data.steps,
        variables
      })
    }
  }
}
/* eslint-enable no-console */
/* eslint-enable no-await-in-loop */
