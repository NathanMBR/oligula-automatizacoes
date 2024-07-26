import { invoke } from '@tauri-apps/api'
import * as tauriLogger from 'tauri-plugin-log-api'

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
      tauriLogger.trace(`Running step "move" to position x: ${step.data.x}, y: ${step.data.y}`)

      await invoke('move_mouse_to', { position: step.data })
      continue
    }

    if (step.type === 'click') {
      tauriLogger.trace(`Running step "click" with button ${step.data.button}`)

      await invoke('click', { button: MouseButton[step.data.button] })
      continue
    }

    if (step.type === 'write') {
      const textToWrite = step.data.text.length <= 0 && hasVariable(step.data.readFrom)
        ? getVariable(step.data.readFrom)!.value
        : step.data.text

      if (typeof textToWrite !== 'string')
        return tauriLogger.error(`Unexpected Error: Variable "${step.data.readFrom}" isn't a text (got ${typeof textToWrite})`)

      tauriLogger.trace(`Running step "write" with text "${ensureCharactersLimit(textToWrite, 50)}"`)

      if (!textToWrite.includes('\n')) {
        await invoke('write', { text: textToWrite })
        continue
      }

      const lines = textToWrite.split('\n')
      for (const line of lines) {
        if (lines.indexOf(line) > 0)
          await invoke('write', { text: '\n' })

        if (line.length > 0)
          await invoke('write', { text: line })
      }
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
          return tauriLogger.error(`Unexpected Error: Variable "${readFrom}" not found`)

        const variable = getVariable(readFrom)!
        if (typeof variable.value !== 'string')
          return tauriLogger.error(`Unexpected Error: Variable "${readFrom}" isn't a text (got ${typeof variable.value})`)

        textToParse = variable.value
      }

      tauriLogger.trace(`Running step "parseString" with divider "${ensureCharactersLimit(divider, 50)}" and text "${ensureCharactersLimit(textToParse, 50)}"`)

      const parsedText = textToParse.split(divider)
      setVariable(saveAs, {
        ownerId: step.id,
        type: 'list',
        value: parsedText
      })

      continue
    }

    if (step.type === 'sleep') {
      tauriLogger.trace(`Running step "sleep" during ${step.data.time} ms`)

      if (step.data.time > 0)
        await sleep(step.data.time)

      continue
    }

    if (step.type === 'pressKeyboard') {
      tauriLogger.trace(`Running step "pressKeyboard" for key "${step.data.keyName}, with code "${step.data.keyCode}"`)

      /* eslint-disable camelcase */
      await invoke('press_key_combination',
        {
          combination: {
            hold_ctrl: step.data.holdCtrl,
            hold_shift: step.data.holdShift,
            hold_alt: step.data.holdAlt,
            key_code: step.data.keyCode,
            key_name: step.data.keyName,
            use_unicode: step.data.keyName.length === 1
          }
        }
      )
      /* eslint-enable camelcase */

      continue
    }

    // statements

    if (step.type === 'cycle') {
      const iterable = getVariable(step.data.iterable)
      if (!iterable)
        return tauriLogger.error(`Unexpected Error: Variable "${step.data.iterable}" not found`)

      if (!Array.isArray(iterable.value))
        return tauriLogger.error(`Unexpected Error: Variable "${step.data.iterable}" isn't a list (got ${typeof iterable.value})`)

      tauriLogger.trace(`Running step "cycle" with iterable "${step.data.iterable}"`)

      for (const item of iterable.value) {
        const newVariable: Variables[string] = {
          ownerId: step.id,
          type: 'value',
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
      tauriLogger.trace('Running step "conditional"')

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

      continue
    }

    // variables

    if (step.type === 'setVariable') {
      tauriLogger.trace(`Running step "setVariable" with variable name "${step.data.saveAs}" and value "${step.data.value}"`)

      setVariable(step.data.saveAs, {
        ownerId: step.id,
        type: 'value',
        value: step.data.value
      })

      continue
    }

    if (step.type === 'destructVariable') {
      tauriLogger.trace(`Running step "destructVariable" with list variable "${step.data.readFrom}", index "${step.data.index}" and value variable "${step.data.saveAs}"`)

      const variable = getVariable(step.data.readFrom)
      if (!variable)
        return tauriLogger.error(`Unexpected Error: Variable "${step.data.readFrom}" not found`)

      if (variable.type !== 'list' || !Array.isArray(variable.value))
        return tauriLogger.error(`Unexpected Error: Variable "${step.data.readFrom}" isn't a list (got ${typeof variable.value})`)

      const destructuredValue = variable.value[step.data.index]

      setVariable(step.data.saveAs, {
        ownerId: step.id,
        type: 'value',
        value: destructuredValue
      })

      continue
    }
  }
}
/* eslint-enable no-await-in-loop */
