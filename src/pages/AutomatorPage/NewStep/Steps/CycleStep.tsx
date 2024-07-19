import {
  useContext,
  useState
} from 'react'
import { Stack } from '@mantine/core'
import { IconVariable } from '@tabler/icons-react'

import type {
  CycleStepData,
  StepData
} from '../../../../types'
import {
  ClearableTextInput,
  VariableSelect
} from '../../../../components'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

export type CycleStepProps = {
  onClose: () => void
  editingStep: StepData | null
}

export const CycleStep = (props: CycleStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const {
    addStep,
    editStep,

    listVariablesWithData,
    getVariable,
    setVariable
  } = useContext(AutomationContext)

  const variables = listVariablesWithData({ type: 'list' })
  const parentId = useParentId()

  const [selectedVariable, setSelectedVariable] = useState(editingStep?.type === 'cycle' ? editingStep.data.iterable : variables[0]?.[0] || '')
  const [saveItemsAs, setSaveItemsAs] = useState(editingStep?.type === 'cycle' ? editingStep.data.saveItemsAs : '')
  const [variableError, setVariableError] = useState('')

  const allowFinish =
    selectedVariable !== '' &&
    saveItemsAs.length > 0 &&
    variableError === ''

  const addCycleStep = () => {
    const saveAsVariable = getVariable(saveItemsAs)
    if (saveAsVariable) {
      const alreadyExistentVariableErrorMessage = 'Nome de variável já utilizado'

      if (!editingStep)
        return setVariableError(alreadyExistentVariableErrorMessage)

      if (saveAsVariable.ownerId !== editingStep.id)
        return setVariableError(alreadyExistentVariableErrorMessage)
    }

    const id = editingStep?.id || generateRandomID()

    const cycleStepPayload: CycleStepData = {
      id,
      type: 'cycle',
      data: {
        saveItemsAs,
        iterable: selectedVariable,
        steps: editingStep && 'steps' in editingStep.data
          ? editingStep.data.steps
          : []
      }
    }

    if (editingStep)
      editStep(editingStep.id, cycleStepPayload)
    else
      addStep(cycleStepPayload, parentId)

    setVariable(saveItemsAs, {
      ownerId: id,
      type: 'value',
      value: null
    })

    onClose()
  }

  return (
    <>
      <Stack justify='space-between'>
        <VariableSelect
          label='Selecionar variável do tipo lista'
          variables={variables}
          value={selectedVariable}
          onChange={value => setSelectedVariable(value)}
        />

        <ClearableTextInput
          label='Salvar cada item como'
          placeholder='Digite o nome da variável em que cada item será salvo'
          value={saveItemsAs}
          error={variableError}
          leftSection={<IconVariable stroke={1.5} />}
          onChange={text => {
            setSaveItemsAs(text)
            setVariableError('')
          }}
        />
      </Stack>

      <StepFinishFooter
        allowFinish={allowFinish}
        addStep={addCycleStep}
      />
    </>
  )
}
