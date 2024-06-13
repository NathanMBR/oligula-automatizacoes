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
  addStep: (step: StepData) => void
  removeStep: (id: StepData['id']) => void
  getStep: (id: StepData['id']) => StepData | undefined
  getStepPositionString: (id: StepData['id']) => string

  variables: Variables
  getVariable: (name: string) => Variables[string] | undefined
  setVariable: (name: string, value: Variables[string]) => void
  hasVariable: (name: string) => boolean
  listVariables: () => Array<string>
  deleteVariable: (name: string) => void
  deleteVariablesByStepId: (id: number) => void
}

const defaultAutomationData: AutomationData = {
  stageIndex: 0,
  setStageIndex: () => {},

  steps: [
    {
      id: 1,
      type: 'cycle',
      data: {
        iterable: 'list',
        saveItemsAs: 'item',
        steps: [
          {
            id: 4,
            type: 'move',
            data: {
              x: 1280,
              y: 540
            }
          },

          {
            id: 5,
            type: 'click',
            data: {
              button: 'left'
            }
          },

          {
            id: 6,
            type: 'write',
            data: {
              text: 'write test',
              readFrom: ''
            }
          },

          {
            id: 2,
            type: 'cycle',
            data: {
              iterable: 'item',
              saveItemsAs: 'subitem',
              steps: [
                {
                  id: 3,
                  type: 'write',
                  data: {
                    text: '',
                    readFrom: 'subitem'
                  }
                },

                {
                  id: 2345678,
                  type: 'cycle',
                  data: {
                    iterable: 'any',
                    saveItemsAs: 'any2',
                    steps: []
                  }
                }
              ]
            }
          },

          {
            id: 60,
            type: 'write',
            data: {
              text: 'write test',
              readFrom: ''
            }
          }
        ]
      }
    },

    {
      id: 999,
      type: 'write',
      data: {
        text: 'write test',
        readFrom: ''
      }
    },

    {
      id: 998,
      type: 'cycle',
      data: {
        iterable: 'no-steps',
        saveItemsAs: 'item-no-steps',
        steps: []
      }
    },

    {
      id: 300,
      type: 'write',
      data: {
        text: '',
        readFrom: 'subitem'
      }
    },

    {
      id: 301,
      type: 'write',
      data: {
        text: '',
        readFrom: 'subitem'
      }
    }
  ],
  addStep: () => {},
  removeStep: () => {},
  getStep: () => undefined,
  getStepPositionString: () => '',

  variables: {
    list: {
      ownerId: 0,
      value: ['Lorem', 'ipsum', 'dolor', 'sit', 'amet']
    }
  },
  getVariable: () => undefined,
  setVariable: () => {},
  hasVariable: () => false,
  listVariables: () => [],
  deleteVariable: () => {},
  deleteVariablesByStepId: () => {}
}

export const AutomationContext = createContext(defaultAutomationData)

export type AutomationProviderProps = Required<PropsWithChildren>

export const AutomationProvider = (props: AutomationProviderProps) => {
  const { children } = props

  const [stageIndex, setStageIndex] = useState(defaultAutomationData.stageIndex)
  const [steps, setSteps] = useState(defaultAutomationData.steps)
  const [variables, setVariables] = useState(defaultAutomationData.variables)

  const addStep: AutomationData['addStep'] = step => setSteps([...steps, step])
  const removeStep: AutomationData['removeStep'] = id => {
    type RecursionResult = {
      success: true
      steps: Array<StepData>
    } | {
      success: false
    }

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

        if ('steps' in step.data) {
          const childrenStepsRemoveResult = removeStepRecursively(step.data.steps)
          if (!childrenStepsRemoveResult.success)
            continue

          Object.assign(stepsCopy[i]!.data, { steps: childrenStepsRemoveResult.steps })
          return {
            success: true,
            steps: stepsCopy
          }
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

        if ('steps' in step.data) {
          const foundStep = findStepRecursively(step.data.steps)
          if (foundStep)
            return foundStep
        }
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

        if ('steps' in step.data) {
          const partialPosition = getStepPositionStringRecursively(step.data.steps)
          if (partialPosition === '')
            continue

          positionString += `${index + 1}.${partialPosition}`
          return positionString
        }
      }

      return positionString
    }

    return getStepPositionStringRecursively(steps)
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

    variables,
    getVariable,
    setVariable,
    hasVariable,
    listVariables,
    deleteVariable,
    deleteVariablesByStepId
  }

  return (
    <AutomationContext.Provider value={automationData}>
      {children}
    </AutomationContext.Provider>
  )
}
