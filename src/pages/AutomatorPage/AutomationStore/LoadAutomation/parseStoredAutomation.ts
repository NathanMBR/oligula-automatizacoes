import { StepTypes } from '../../StepTypes'
import type { StoredAutomation } from '../StoredAutomation'

const validateSteps = (steps: unknown): boolean => {
  if (!Array.isArray(steps))
    return false

  for (const step of steps) {
    if (
      typeof step !== 'object' ||
      step === null ||
      Array.isArray(step)
    )
      return false

    if (!('type' in step))
      return false

    if (typeof step.type !== 'string')
      return false

    if (!(step.type in StepTypes))
      return false

    if (!('data' in step))
      return false

    if (
      typeof step.data !== 'object' ||
      step.data === null ||
      Array.isArray(step.data)
    )
      return false

    const stepType = step.type as keyof typeof StepTypes

    if (stepType === 'move') {
      if (!('x' in step.data))
        return false

      if (typeof step.data.x !== 'number')
        return false

      if (Number.isNaN(step.data.x))
        return false

      if (!('y' in step.data))
        return false

      if (typeof step.data.y !== 'number')
        return false

      if (Number.isNaN(step.data.y))
        return false
    }

    else if (stepType === 'click') {
      if (!('button' in step.data))
        return false

      const validButtons = [
        'left',
        'right',
        'middle'
      ]

      if (typeof step.data.button !== 'string')
        return false

      if (!validButtons.includes(step.data.button))
        return false
    }

    else if (stepType === 'write') {
      if (!('text' in step.data))
        return false

      if (typeof step.data.text !== 'string')
        return false

      if (!('readFrom' in step.data))
        return false

      if (typeof step.data.readFrom !== 'string')
        return false
    }

    else if (stepType === 'readFile') {
      if (!('filename' in step.data))
        return false

      if (typeof step.data.filename !== 'string')
        return false

      if (!('saveAs' in step.data))
        return false

      if (typeof step.data.saveAs !== 'string')
        return false
    }

    else if (stepType === 'parseString') {
      if (!('parseString' in step.data))
        return false

      if (typeof step.data.parseString !== 'string')
        return false

      if (!('readFrom' in step.data))
        return false

      if (typeof step.data.readFrom !== 'string')
        return false

      if (!('divider' in step.data))
        return false

      if (typeof step.data.divider !== 'string')
        return false

      if (!('saveAs' in step.data))
        return false

      if (typeof step.data.saveAs !== 'string')
        return false
    }

    else if (stepType === 'cycle') {
      if (!('iterable' in step.data))
        return false

      if (typeof step.data.iterable !== 'string')
        return false

      if (!('saveItemsAs' in step.data))
        return false

      if (typeof step.data.saveItemsAs !== 'string')
        return false

      if (!('steps' in step.data))
        return false

      if (!validateSteps(step.data.steps))
        return false
    }

    else
      return false
  }

  return true
}

export const parseStoredAutomation = (rawStoredAutomation: string): StoredAutomation | null => {
  try {
    if (!rawStoredAutomation)
      return null

    const storedAutomation = JSON.parse(rawStoredAutomation) as StoredAutomation
    if (Array.isArray(storedAutomation))
      return null

    const hasMeta = 'meta' in storedAutomation
    if (!hasMeta)
      return null

    const hasData = 'data' in storedAutomation
    if (!hasData)
      return null

    if (
      typeof storedAutomation.meta !== 'object' ||
      storedAutomation.meta === null ||
      Array.isArray(storedAutomation.meta)
    )
      return null

    if (
      typeof storedAutomation.data !== 'object' ||
      storedAutomation.data === null ||
      Array.isArray(storedAutomation.data)
    )
      return null

    const hasSteps = 'steps' in storedAutomation.data
    if (!hasSteps)
      return null

    const areStepsValid = validateSteps(storedAutomation.data.steps)
    if (!areStepsValid)
      return null

    const hasVariables = 'variables' in storedAutomation.data
    if (!hasVariables)
      return null

    if (
      typeof storedAutomation.data.variables !== 'object' ||
      storedAutomation.data.variables === null ||
      Array.isArray(storedAutomation.data.variables)
    )
      return null

    const variables = Object.values(storedAutomation.data.variables)
    for (const variable of variables) {
      if (
        typeof variable !== 'object' ||
          variable === null ||
          Array.isArray(variable)
      )
        return null

      if (!('ownerId' in variable))
        return null

      if (typeof variable.ownerId !== 'number')
        return null

      if (Number.isNaN(variable.ownerId))
        return null

      if (!('value' in variable))
        return null
    }

    return storedAutomation
  } catch (_error) {
    return null
  }
}
