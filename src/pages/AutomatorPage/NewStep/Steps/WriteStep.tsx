import {
  Divider,
  Select,
  Stack
} from '@mantine/core'
import {
  useContext,
  useState
} from 'react'

import type {
  StepData,
  WriteStepData
} from '../../../../types'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { ClearableTextInput } from '../../../../components'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

export type WriteStepProps = {
  onClose: () => void
  editingStep: StepData | null
}

export const WriteStep = (props: WriteStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const {
    addStep,
    editStep,

    listVariables
  } = useContext(AutomationContext)

  const variables = listVariables()

  const [writeText, setWriteText] = useState(editingStep?.type === 'write' ? editingStep.data.text : '')
  const [selectedVariable, setSelectedVariable] = useState(editingStep?.type === 'write' ? editingStep.data.readFrom : variables[0] || '')

  const parentId = useParentId()

  const noVariablesError = variables.length <= 0
    ? 'Desativado (não há variáveis disponíveis)'
    : null

  const manualInputError = writeText.length > 0
    ? 'Desativado (dado manual inserido; remova-o para ativar)'
    : null

  const selectError = noVariablesError || manualInputError || ''

  const addWriteStep = () => {
    const writeStepPayload: WriteStepData = {
      id: editingStep?.id || generateRandomID(),
      type: 'write',
      data: {
        text: writeText,
        readFrom: selectedVariable
      }
    }

    if (editingStep)
      editStep(editingStep.id, writeStepPayload)
    else
      addStep(writeStepPayload, parentId)

    onClose()
  }

  return (
    <>
      <Stack justify='space-between'>
        <ClearableTextInput
          label='Inserir dado manual'
          placeholder='Digite o dado a ser inserido'
          value={writeText}
          onChange={text => setWriteText(text)}
        />

        <Divider label='ou' />

        <Select
          label='Inserir dado de uma variável'
          checkIconPosition='right'
          data={variables}
          error={selectError}
          allowDeselect={false}
          value={selectedVariable}
          disabled={selectError !== ''}
          onChange={value => setSelectedVariable(String(value))}
        />
      </Stack>

      <StepFinishFooter
        addStep={addWriteStep}
        allowFinish={writeText.length > 0 || selectedVariable !== ''}
      />
    </>
  )
}
