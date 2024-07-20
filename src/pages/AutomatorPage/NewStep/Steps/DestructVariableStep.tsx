import {
  useContext,
  useState
} from 'react'
import {
  NumberInput,
  Stack
} from '@mantine/core'
import { IconVariable } from '@tabler/icons-react'

import type {
  DestructVariableStepData,
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

export type DestructVariableStepProps = {
  onClose: () => void
  editingStep: StepData | null
}

export const DestructVariableStep = (props: DestructVariableStepProps) => {
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

  const [readFrom, setReadFrom] = useState(editingStep?.type === 'destructVariable' ? editingStep.data.readFrom : variables[0]?.[0] || '')
  const [index, setIndex] = useState(editingStep?.type === 'destructVariable' ? editingStep.data.index : 0)
  const [saveAs, setSaveAs] = useState(editingStep?.type === 'destructVariable' ? editingStep.data.saveAs : '')
  const [saveAsError, setSaveAsError] = useState('')

  const allowFinish =
    readFrom !== '' &&
    saveAs !== '' &&
    saveAsError === ''

  const addDestructVariableStep = () => {
    const saveAsVariable = getVariable(saveAs)
    if (saveAsVariable) {
      const alreadyExistentVariableErrorMessage = 'Nome de variável já utilizado'

      if (!editingStep)
        return setSaveAsError(alreadyExistentVariableErrorMessage)

      if (saveAsVariable.ownerId !== editingStep.id)
        return setSaveAsError(alreadyExistentVariableErrorMessage)
    }

    const id = editingStep?.id || generateRandomID()

    const destructVariableStepPayload: DestructVariableStepData = {
      id,
      type: 'destructVariable',
      data: {
        readFrom,
        index,
        saveAs
      }
    }

    if (editingStep)
      editStep(editingStep.id, destructVariableStepPayload)
    else
      addStep(destructVariableStepPayload, parentId)

    setVariable(saveAs, {
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
          label='Selecionar variável do tipo lista lista'
          noVariablesErrorMessage='Desativado (não há variáveis do tipo lista disponíveis)'
          variables={variables}
          value={readFrom}
          onChange={variable => setReadFrom(variable || '')}
        />

        <NumberInput
          label='Posição da variável lista a ser obtida'
          clampBehavior='strict'
          allowDecimal={false}
          allowNegative={false}
          value={index}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          onChange={value => setIndex(Number(value) || 0)}
        />

        <ClearableTextInput
          label='Salvar como'
          placeholder='Digite o nome da variável em que o valor da posição será salvo'
          leftSection={<IconVariable stroke={1.5} />}
          error={saveAsError}
          value={saveAs}
          onChange={text => {
            setSaveAs(text)
            setSaveAsError('')
          }}
        />
      </Stack>

      <StepFinishFooter
        allowFinish={allowFinish}
        addStep={addDestructVariableStep}
      />
    </>
  )
}
