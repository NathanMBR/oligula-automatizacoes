import { invoke } from '@tauri-apps/api'

import { sleep } from '../../../helpers'
import { MouseButton } from '../../../types'
import type { AutomationData } from '../../../providers'

export type RunAutomationData = Pick<
  AutomationData,
  'steps' |
  'variables' |
  'hasVariable' |
  'getVariable' |
  'setVariable'
> & {
  globalTimeBetweenStepsInMs: number
}

/* eslint-disable no-await-in-loop */
export const runAutomationScript = async (data: RunAutomationData) => {
  const {
    globalTimeBetweenStepsInMs,
    steps,
    variables,
    hasVariable,
    getVariable,
    setVariable
  } = data

  for (const step of steps) {
    await sleep(globalTimeBetweenStepsInMs)

    if (step.type === 'move') {
      await invoke('move_mouse_to', { position: step.data })
      continue
    }

    if (step.type === 'click') {
      await invoke('click', { button: MouseButton[step.data.button] })
      continue
    }

    if (step.type === 'write') {
      const textToWrite = step.data.text.length <= 0 && hasVariable(step.data.readFrom)
        ? getVariable(step.data.readFrom)!.value
        : step.data.text

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
      /* eslint-disable no-console */
      const iterable = getVariable(step.data.iterable)
      if (!iterable) {
        console.error(`Unexpected Error: Variable "${step.data.iterable}" not found`)
        return
      }

      if (!Array.isArray(iterable.value)) {
        console.error(`Unexpected Error: Variable "${step.data.iterable}" isn't a list (got ${typeof iterable.value})`)
        return
      }
      /* eslint-enable no-console */

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
          },
          hasVariable,
          getVariable,
          setVariable
        })
      }

      continue
    }
  }
}
/* eslint-enable no-await-in-loop */
