import { Stack } from '@mantine/core'
import {
  useContext,
  useState
} from 'react'
import { IconVariable } from '@tabler/icons-react'

import type {
  SetVariableStepData,
  StepData
} from '../../../../types'
import {
  ClearableTextArea,
  ClearableTextInput
} from '../../../../components'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

export type SetVariableStepProps = {
  onClose: () => void
  editingStep: StepData | null
}

export const SetVariableStep = (props: SetVariableStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const {
    addStep,
    editStep,

    getVariable,
    setVariable
  } = useContext(AutomationContext)

  const parentId = useParentId()

  const [saveAs, setSaveAs] = useState(editingStep?.type === 'setVariable' ? editingStep.data.saveAs : '')
  const [value, setValue] = useState(editingStep?.type === 'setVariable' ? editingStep.data.value : '')
  const [saveAsError, setSaveAsError] = useState('')

  const allowFinish =
    saveAs !== '' &&
    value !== '' &&
    saveAsError === ''

  const addSetVariableStep = () => {
    const saveAsVariable = getVariable(saveAs)
    if (saveAsVariable) {
      const alreadyExistentVariableErrorMessage = 'Nome de variável já utilizado'

      if (!editingStep)
        return setSaveAsError(alreadyExistentVariableErrorMessage)

      if (saveAsVariable.ownerId !== editingStep.id)
        return setSaveAsError(alreadyExistentVariableErrorMessage)
    }

    const id = editingStep?.id || generateRandomID()

    const setVariableStepPayload: SetVariableStepData = {
      id,
      type: 'setVariable',
      data: {
        saveAs,
        value
      }
    }

    if (editingStep)
      editStep(editingStep.id, setVariableStepPayload)
    else
      addStep(setVariableStepPayload, parentId)

    setVariable(saveAs, {
      ownerId: id,
      value
    })

    onClose()
  }

  return (
    <>
      <Stack justify='space-between'>
        <ClearableTextInput
          label='Nome da variável'
          placeholder='Insira o nome da variável'
          value={saveAs}
          error={saveAsError}
          leftSection={<IconVariable stroke={1.5} />}
          onChange={newSaveAs => {
            setSaveAs(newSaveAs)
            setSaveAsError('')
          }}
        />

        <ClearableTextArea
          label='Valor da variável'
          placeholder='Insira o valor da variável'
          value={value}
          onChange={newValue => setValue(newValue)}
          withFileButton
        />
      </Stack>

      <StepFinishFooter
        allowFinish={allowFinish}
        addStep={addSetVariableStep}
      />
    </>
  )
}
