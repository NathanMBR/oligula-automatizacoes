import {
  Select,
  Stack
} from '@mantine/core'
import {
  useContext,
  useState
} from 'react'
import { IconVariable } from '@tabler/icons-react'

import type {
  CycleStepData,
  StepDefaultData
} from '../../../../types'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { ClearableTextInput } from '../../../../components'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

type CycleStepPayload = CycleStepData & StepDefaultData
export type CycleStepProps = {
  onClose: () => void
  editingStep: CycleStepPayload | null
}

export const CycleStep = (props: CycleStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const {
    addStep,
    editStep,

    listVariables,
    hasVariable,
    setVariable,
    deleteVariablesByStepId
  } = useContext(AutomationContext)

  const parentId = useParentId()

  const variables = listVariables()

  const [selectedVariable, setSelectedVariable] = useState(editingStep?.data.iterable || variables[0] || '')
  const [saveItemsAs, setSaveItemsAs] = useState(editingStep?.data.saveItemsAs || '')
  const [variableError, setVariableError] = useState('')

  const noVariablesError = variables.length <= 0
    ? 'Desativado (não há variáveis disponíveis)'
    : null

  const selectError = noVariablesError || ''

  const allowFinish =
    selectedVariable !== '' &&
    saveItemsAs.length > 0 &&
    variableError === ''

  const addCycleStep = () => {
    if (editingStep)
      deleteVariablesByStepId(editingStep.id)

    if (hasVariable(saveItemsAs))
      return setVariableError('Nome de variável já utilizado')

    const id = editingStep?.id || generateRandomID()

    const cycleStepPayload: CycleStepPayload = {
      id,
      type: 'cycle',
      data: {
        iterable: selectedVariable,
        steps: editingStep?.data.steps || [],
        saveItemsAs
      }
    }

    if (editingStep)
      editStep(editingStep.id, cycleStepPayload)
    else
      addStep(cycleStepPayload, parentId)

    setVariable(saveItemsAs, {
      ownerId: id,
      value: null
    })

    onClose()
  }

  return (
    <>
      <Stack justify='space-between'>
        <Select
          label='Selecionar variável do tipo lista'
          checkIconPosition='right'
          data={variables}
          error={selectError}
          allowDeselect={false}
          value={selectedVariable}
          disabled={selectError !== ''}
          onChange={value => setSelectedVariable(String(value))}
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
