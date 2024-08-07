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
  clearSteps: (fromId?: StepData['id']) => void
  reorderSteps: (sourceIndex: number, destinationIndex: number, stepId?: StepData['id']) => void

  isAddingStep: boolean
  setIsAddingStep: (isAddingStep: boolean) => void

  editingStep: StepData | null
  setEditingStep: (step: StepData | null) => void

  variables: Variables
  getVariable: (name: string) => Variables[string] | undefined
  setVariable: (name: string, value: Variables[string]) => void
  hasVariable: (name: string) => boolean
  listVariables: (filter?: Partial<Variables[string]>) => Array<string>
  listVariablesWithData: (filter?: Partial<Variables[string]>) => Array<[string, Variables[string]]>
  deleteVariable: (name: string) => void
  deleteVariablesByStepId: (id: number) => void
  setVariables: (newVariables: Variables) => void
  clearVariables: () => void
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
  clearSteps: () => {},
  reorderSteps: () => {},

  isAddingStep: false,
  setIsAddingStep: () => {},

  editingStep: null,
  setEditingStep: () => {},

  variables: {},
  getVariable: () => undefined,
  setVariable: () => {},
  hasVariable: () => false,
  listVariables: () => [],
  listVariablesWithData: () => [],
  deleteVariable: () => {},
  deleteVariablesByStepId: () => {},
  setVariables: () => {},
  clearVariables: () => {}
}

export const AutomationContext = createContext(defaultAutomationData)

export type AutomationProviderProps = Required<PropsWithChildren>

export const AutomationProvider = (props: AutomationProviderProps) => {
  const { children } = props

  const [stageIndex, setStageIndex] = useState(defaultAutomationData.stageIndex)
  const [steps, setSteps] = useState(defaultAutomationData.steps)
  const [variables, setVariables] = useState(defaultAutomationData.variables)
  const [isAddingStep, setIsAddingStep] = useState(defaultAutomationData.isAddingStep)
  const [editingStep, setEditingStep] = useState(defaultAutomationData.editingStep)

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

  const clearSteps: AutomationData['clearSteps'] = fromStepId => {
    if (!fromStepId)
      return setSteps([])

    const getNewStepsRecursively = (stepsToSearch: Array<StepData>, id: typeof fromStepId): Array<StepData> => {
      const stepsCopy = JSON.parse(JSON.stringify(stepsToSearch)) as Array<StepData>

      for (let i = 0; i < stepsCopy.length; i++) {
        const searchStep = stepsCopy[i]!

        if (!('steps' in searchStep.data))
          continue

        if (searchStep.id === id) {
          Object.assign(stepsCopy[i]!.data, { steps: [] })
          return stepsCopy
        }

        Object.assign(stepsCopy[i]!.data, { steps: getNewStepsRecursively(searchStep.data.steps, id) })
      }

      return stepsCopy
    }

    const newSteps = getNewStepsRecursively(steps, fromStepId)
    setSteps(newSteps)
  }

  const reorderSteps: AutomationData['reorderSteps'] = (sourceIndex, destinationIndex, stepId) => {
    const getNewStepsRecursively = (stepsToSearch: Array<StepData>): Array<StepData> => {
      const stepsCopy = JSON.parse(JSON.stringify(stepsToSearch)) as Array<StepData>

      if (!stepId || Number.isNaN(stepId) || stepId < 0) {
        const removedSteps = stepsCopy.splice(sourceIndex, 1)
        stepsCopy.splice(destinationIndex, 0, ...removedSteps)
        return stepsCopy
      }

      const newSteps: Array<StepData> = []

      for (const step of stepsCopy) {
        if (!('steps' in step.data)) {
          newSteps.push(step)
          continue
        }

        if (step.id === stepId) {
          const removedSteps = stepsCopy.splice(sourceIndex, 1)
          stepsCopy.splice(destinationIndex, 0, ...removedSteps)
          continue
        }

        const newChildrenSteps = getNewStepsRecursively(step.data.steps)
        step.data.steps = newChildrenSteps
        newSteps.push(step)
      }

      return newSteps
    }

    const newSteps = getNewStepsRecursively(steps)
    setSteps(newSteps)
  }

  const getVariable: AutomationData['getVariable'] = name => variables[name.toLowerCase()]

  const setVariable: AutomationData['setVariable'] = (name, value) => setVariables(currentVariables => ({ ...currentVariables, [name.toLowerCase()]: value }))

  const hasVariable: AutomationData['hasVariable'] = name => name.toLowerCase() in variables

  const listVariables: AutomationData['listVariables'] = filter => {
    if (!filter || Object.keys(filter).length <= 0)
      return Object.keys(variables)

    type VariableDataKey = keyof Variables[string]
    return Object.entries(variables)
      .filter(([_variableName, variableValue]) => Object.keys(filter)
        .every(filterKey => filter[filterKey as VariableDataKey] === variableValue[filterKey as VariableDataKey])
      )
      .map(([variableName]) => variableName)
  }

  const listVariablesWithData: AutomationData['listVariablesWithData'] = filter => {
    if (!filter || Object.keys(filter).length <= 0)
      return Object.entries(variables)

    type VariableDataKey = keyof Variables[string]

    return Object.entries(variables)
      .filter(([_variableName, variableValue]) => Object.keys(filter)
        .every(filterKey => filter[filterKey as VariableDataKey] === variableValue[filterKey as VariableDataKey])
      )
  }

  const deleteVariable: AutomationData['deleteVariable'] = name => setVariables(currentVariables => {
    const newVariables = { ...currentVariables }
    delete newVariables[name.toLowerCase()]
    return newVariables
  })

  const deleteVariablesByStepId: AutomationData['deleteVariablesByStepId'] = id => {
    setVariables(currentVariables => {
      const newVariables = { ...currentVariables }

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
        return currentVariables

      deleteVariablesByStepIdRecursively(step)

      return newVariables
    })
  }

  const clearVariables: AutomationData['clearVariables'] = () => setVariables({})

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
    clearSteps,
    reorderSteps,

    isAddingStep,
    setIsAddingStep,

    editingStep,
    setEditingStep,

    variables,
    getVariable,
    setVariable,
    hasVariable,
    listVariables,
    listVariablesWithData,
    deleteVariable,
    deleteVariablesByStepId,
    setVariables,
    clearVariables
  }

  return (
    <AutomationContext.Provider value={automationData}>
      {children}
    </AutomationContext.Provider>
  )
}
