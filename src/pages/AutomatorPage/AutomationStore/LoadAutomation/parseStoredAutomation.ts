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

    if (!('id' in step))
      return false

    if (typeof step.id !== 'number')
      return false

    if (step.id < 0)
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

    // actions

    if (stepType === 'move') {
      if (!('x' in step.data))
        return false

      if (typeof step.data.x !== 'number')
        return false

      if (!Number.isSafeInteger(step.data.x))
        return false

      if (step.data.x < 0)
        return false

      if (!('y' in step.data))
        return false

      if (typeof step.data.y !== 'number')
        return false

      if (!Number.isSafeInteger(step.data.y))
        return false

      if (step.data.y < 0)
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

    else if (stepType === 'sleep') {
      if (!('time' in step.data))
        return false

      if (typeof step.data.time !== 'number')
        return false

      if (!Number.isSafeInteger(step.data.time))
        return false

      if (step.data.time < 0)
        return false
    }

    else if (stepType === 'pressKeyboard') {
      if (!('holdCtrl' in step.data))
        return false

      if (typeof step.data.holdCtrl !== 'boolean')
        return false

      if (!('holdShift' in step.data))
        return false

      if (typeof step.data.holdShift !== 'boolean')
        return false

      if (!('holdAlt' in step.data))
        return false

      if (typeof step.data.holdAlt !== 'boolean')
        return false

      if (!('keyCode' in step.data))
        return false

      if (typeof step.data.keyCode !== 'number')
        return false

      if (!Number.isSafeInteger(step.data.keyCode))
        return false

      if (step.data.keyCode < 0)
        return false

      if (!('keyName' in step.data))
        return false

      if (typeof step.data.keyName !== 'string')
        return false
    }

    // statements

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

    else if (stepType === 'conditional') {
      const validOperators = [
        'equal',
        'notEqual',
        'greaterThan',
        'lesserThan',
        'greaterOrEqualThan',
        'lesserOrEqualThan'
      ]

      const validateSide = (side: unknown): boolean => {
        if (!side)
          return false

        if (typeof side !== 'object')
          return false

        if (Array.isArray(side))
          return false

        if (!('origin' in side))
          return false

        if (typeof side.origin !== 'string')
          return false

        if (side.origin === 'variable') {
          if (!('readFrom' in side))
            return false

          if (typeof side.readFrom !== 'string')
            return false
        }

        else if (side.origin === 'value') {
          if (!('value' in side))
            return false

          if (typeof side.value !== 'string')
            return false
        }

        else
          return false

        return true
      }

      if (!('condition' in step.data))
        return false

      if (typeof step.data.condition !== 'object')
        return false

      if (Array.isArray(step.data.condition))
        return false

      if (!('leftSide' in step.data.condition))
        return false

      if (!validateSide(step.data.condition.leftSide))
        return false

      if (!('operator' in step.data.condition))
        return false

      if (typeof step.data.condition.operator !== 'string')
        return false

      if (!validOperators.includes(step.data.condition.operator))
        return false

      if (!('rightSide' in step.data.condition))
        return false

      if (!validateSide(step.data.condition.rightSide))
        return false

      if (!('steps' in step.data))
        return false

      if (!validateSteps(step.data.steps))
        return false
    }

    // variables

    else if (stepType === 'setVariable') {
      if (!('saveAs' in step.data))
        return false

      if (typeof step.data.saveAs !== 'string')
        return false

      if (!('value' in step.data))
        return false

      if (typeof step.data.value !== 'string')
        return false
    }

    else if (stepType === 'destructVariable') {
      if (!('readFrom' in step.data))
        return false

      if (typeof step.data.readFrom !== 'string')
        return false

      if (!('index' in step.data))
        return false

      if (typeof step.data.index !== 'number')
        return false

      if (!Number.isSafeInteger(step.data.index))
        return false

      if (step.data.index < 0)
        return false

      if (!('saveAs' in step.data))
        return false

      if (typeof step.data.saveAs !== 'string')
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

      if (variable.ownerId < 0)
        return null

      if (!('value' in variable))
        return null
    }

    return storedAutomation
  } catch (_error) {
    return null
  }
}
