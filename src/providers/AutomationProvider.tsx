import {
  createContext,
  useState,
  type PropsWithChildren
} from 'react'

import type {
  StepData,
  Variables
} from '../types'

export type AutomationData = {
  stageIndex: number
  setStageIndex: (index: number) => void

  steps: Array<StepData>
  addStep: (step: StepData, parentId: StepData['id']) => void
  removeStep: (id: StepData['id']) => void
  getStep: (id: StepData['id']) => StepData | undefined
  getStepPositionString: (id: StepData['id']) => string
  setSteps: (newSteps: Array<StepData>) => void
  editStep: (id: StepData['id'], editedStep: StepData) => void

  variables: Variables
  getVariable: (name: string) => Variables[string] | undefined
  setVariable: (name: string, value: Variables[string]) => void
  hasVariable: (name: string) => boolean
  listVariables: () => Array<string>
  deleteVariable: (name: string) => void
  deleteVariablesByStepId: (id: number) => void
  setVariables: (newVariables: Variables) => void
}

const defaultAutomationData: AutomationData = {
  stageIndex: 0,
  setStageIndex: () => {},

  steps: [],
  addStep: () => {},
  removeStep: () => {},
  getStep: () => undefined,
  getStepPositionString: () => '',
  setSteps: () => {},
  editStep: () => {},

  variables: {},
  getVariable: () => undefined,
  setVariable: () => {},
  hasVariable: () => false,
  listVariables: () => [],
  deleteVariable: () => {},
  deleteVariablesByStepId: () => {},
  setVariables: () => {}
}

export const AutomationContext = createContext(defaultAutomationData)

export type AutomationProviderProps = Required<PropsWithChildren>

export const AutomationProvider = (props: AutomationProviderProps) => {
  const { children } = props

  const [stageIndex, setStageIndex] = useState(defaultAutomationData.stageIndex)
  const [steps, setSteps] = useState(defaultAutomationData.steps)
  const [variables, setVariables] = useState(defaultAutomationData.variables)

  type RecursionResult = {
    success: true
    steps: Array<StepData>
  } | {
    success: false
  }

  const addStep: AutomationData['addStep'] = (step, parentId) => {
    if (parentId < 0)
      return setSteps([...steps, step])

    const getNewStepsRecursively = (stepsToSearch: Array<StepData>): RecursionResult => {
      const stepsCopy = JSON.parse(JSON.stringify(stepsToSearch)) as Array<StepData>

      for (let i = 0; i < stepsCopy.length; i++) {
        const searchStep = stepsCopy[i]!

        if (!('steps' in searchStep.data))
          continue

        if (searchStep.id === parentId) {
          Object.assign(
            stepsCopy[i]!.data,

            {
              steps: [
                ...searchStep.data.steps,
                step
              ]
            }
          )

          return {
            success: true,
            steps: stepsCopy
          }
        }

        const childrenStepsAddResult = getNewStepsRecursively(searchStep.data.steps)
        if (!childrenStepsAddResult.success)
          continue

        Object.assign(stepsCopy[i]!.data, { steps: childrenStepsAddResult.steps })
        return {
          success: true,
          steps: stepsCopy
        }
      }

      return {
        success: false
      }
    }

    const recursionResult = getNewStepsRecursively(steps)
    if (recursionResult.success)
      setSteps(recursionResult.steps)
  }

  const removeStep: AutomationData['removeStep'] = id => {
    const removeStepRecursively = (stepsToSearch: Array<StepData>): RecursionResult => {
      const stepsCopy = JSON.parse(JSON.stringify(stepsToSearch)) as Array<StepData>

      for (let i = 0; i < stepsCopy.length; i++) {
        const step = stepsCopy[i]!

        if (step.id === id) {
          stepsCopy.splice(i, 1)
          return {
            success: true,
            steps: stepsCopy
          }
        }

        if (!('steps' in step.data))
          continue

        const childrenStepsRemoveResult = removeStepRecursively(step.data.steps)
        if (!childrenStepsRemoveResult.success)
          continue

        Object.assign(stepsCopy[i]!.data, { steps: childrenStepsRemoveResult.steps })

        return {
          success: true,
          steps: stepsCopy
        }
      }

      return {
        success: false
      }
    }

    const removeStepResult = removeStepRecursively(steps)
    if (removeStepResult.success)
      setSteps(removeStepResult.steps)
  }

  const getStep: AutomationData['getStep'] = id => {
    const findStepRecursively = (stepsToSearch: Array<StepData>): StepData | undefined => {
      for (const step of stepsToSearch) {
        if (step.id === id)
          return step

        if (!('steps' in step.data))
          continue

        const foundStep = findStepRecursively(step.data.steps)
        if (foundStep)
          return foundStep
      }

      return undefined
    }

    return findStepRecursively(steps)
  }

  const getStepPositionString: AutomationData['getStepPositionString'] = id => {
    const getStepPositionStringRecursively = (stepsToSearch: Array<StepData>): string => {
      let positionString = ''

      for (const [index, step] of stepsToSearch.entries()) {
        if (step.id === id) {
          positionString += `${index + 1}`
          return positionString
        }

        if (!('steps' in step.data))
          continue

        const partialPosition = getStepPositionStringRecursively(step.data.steps)
        if (partialPosition === '')
          continue

        positionString += `${index + 1}.${partialPosition}`
        return positionString
      }

      return positionString
    }

    return getStepPositionStringRecursively(steps)
  }

  const editStep: AutomationData['editStep'] = (id, editedStep) => {
    const getNewStepsRecursively = (stepsToSearch: Array<StepData>): RecursionResult => {
      const stepsCopy = JSON.parse(JSON.stringify(stepsToSearch)) as Array<StepData>

      for (let i = 0; i < stepsCopy.length; i++) {
        const searchStep = stepsCopy[i]!

        if (searchStep.id === id) {
          stepsCopy[i] = editedStep
          return {
            success: true,
            steps: stepsCopy
          }
        }

        if (!('steps' in searchStep.data))
          continue

        const childrenStepsEditResult = getNewStepsRecursively(searchStep.data.steps)
        if (!childrenStepsEditResult.success)
          continue

        Object.assign(stepsCopy[i]!.data, { steps: childrenStepsEditResult.steps })

        return {
          success: true,
          steps: stepsCopy
        }
      }

      return {
        success: false
      }
    }

    const recursionResult = getNewStepsRecursively(steps)
    if (recursionResult.success)
      setSteps(recursionResult.steps)
  }

  const getVariable: AutomationData['getVariable'] = name => variables[name.toLowerCase()]

  const setVariable: AutomationData['setVariable'] = (name, value) => setVariables({ ...variables, [name.toLowerCase()]: value })

  const hasVariable: AutomationData['hasVariable'] = name => name.toLowerCase() in variables

  const listVariables: AutomationData['listVariables'] = () => Object.keys(variables)

  const deleteVariable: AutomationData['deleteVariable'] = name => {
    const newVariables = { ...variables }
    delete newVariables[name.toLowerCase()]
    setVariables(newVariables)
  }

  const deleteVariablesByStepId: AutomationData['deleteVariablesByStepId'] = id => {
    const newVariables = { ...variables }

    const deleteVariablesByStepIdRecursively = (step: StepData): void => {
      const { data } = step

      if ('saveAs' in data)
        delete newVariables[data.saveAs.toLowerCase()]

      if ('saveItemsAs' in data)
        delete newVariables[data.saveItemsAs.toLowerCase()]

      if ('steps' in data)
        data.steps.forEach(deleteVariablesByStepIdRecursively)
    }

    const step = getStep(id)
    if (!step)
      return

    deleteVariablesByStepIdRecursively(step)

    setVariables(newVariables)
  }

  const automationData: AutomationData = {
    stageIndex,
    setStageIndex,

    steps,
    addStep,
    removeStep,
    getStep,
    getStepPositionString,
    setSteps,
    editStep,

    variables,
    getVariable,
    setVariable,
    hasVariable,
    listVariables,
    deleteVariable,
    deleteVariablesByStepId,
    setVariables
  }

  return (
    <AutomationContext.Provider value={automationData}>
      {children}
    </AutomationContext.Provider>
  )
}
