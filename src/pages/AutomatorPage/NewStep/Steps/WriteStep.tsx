import {
  Divider,
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
import {
  ClearableTextArea,
  VariableSelect
} from '../../../../components'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
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

    listVariablesWithData
  } = useContext(AutomationContext)

  const variables = listVariablesWithData({ type: 'value' })
  const parentId = useParentId()

  const [writeText, setWriteText] = useState(editingStep?.type === 'write' ? editingStep.data.text : '')
  const [selectedVariable, setSelectedVariable] = useState(editingStep?.type === 'write' ? editingStep.data.readFrom : variables[0]?.[0] || '')

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
        <ClearableTextArea
          label='Escrever texto manual'
          placeholder='Digite o dado a ser inserido'
          value={writeText}
          onChange={text => setWriteText(text)}
          withFileButton
        />

        <Divider label='ou' />

        <VariableSelect
          label='Escrever texto armazenado em uma variável'
          variables={variables}
          value={selectedVariable}
          onChange={value => setSelectedVariable(value)}
        />
      </Stack>

      <StepFinishFooter
        addStep={addWriteStep}
        allowFinish={writeText.length > 0 || selectedVariable !== ''}
      />
    </>
  )
}
