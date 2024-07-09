import { invoke } from '@tauri-apps/api'

import {
  MouseButton,
  type Variables
} from '../../../types'
import { sleep } from '../../../helpers'
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
    await sleep(globalTimeBetweenStepsInMs)

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
        return console.log(`Unexpected Error: Variable "${step.data.readFrom}" isn't a text (got ${typeof textToWrite})`)

      console.log(`Running step "write" with text "${textToWrite.length <= 50 ? textToWrite : textToWrite.slice(0, 50)}"`)

      await invoke('write', { text: textToWrite })

      continue
    }

    if (step.type === 'readFile')
      continue

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
          throw new Error(`Variável "${readFrom}" não encontrada`)

        const variable = getVariable(readFrom)!
        if (typeof variable.value !== 'string')
          throw new Error(`Variável "${readFrom}" não é um texto`)

        textToParse = variable.value
      }

      const parsedText = textToParse.split(divider)
      setVariable(saveAs, {
        ownerId: step.id,
        value: parsedText
      })

      continue
    }

    if (step.type === 'cycle') {
      const iterable = getVariable(step.data.iterable)
      if (!iterable) {
        console.error(`Unexpected Error: Variable "${step.data.iterable}" not found`)
        return
      }

      if (!Array.isArray(iterable.value)) {
        console.error(`Unexpected Error: Variable "${step.data.iterable}" isn't a list (got ${typeof iterable.value})`)
        return
      }

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
  }
}
/* eslint-enable no-console */
/* eslint-enable no-await-in-loop */
