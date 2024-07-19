import {
  Divider,
  Fieldset,
  Stack
} from '@mantine/core'
import {
  useContext,
  useState
} from 'react'
import { IconVariable } from '@tabler/icons-react'

import type {
  ParseStringStepData,
  StepData
} from '../../../../types'
import {
  ClearableTextInput,
  ClearableTextArea,
  VariableSelect
} from '../../../../components'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

export type ParseStringStepProps = {
  onClose: () => void
  editingStep: StepData | null
}

export const ParseStringStep = (props: ParseStringStepProps) => {
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

  const variables = listVariablesWithData({ type: 'value' })
  const parentId = useParentId()

  const [parseText, setParseText] = useState(editingStep?.type === 'parseString' ? editingStep.data.parseString : '')
  const [selectedVariable, setSelectedVariable] = useState(editingStep?.type === 'parseString' ? editingStep.data.readFrom : variables[0]?.[0] || '')
  const [separatorText, setSeparatorText] = useState(editingStep?.type === 'parseString' ? editingStep.data.divider : '')
  const [saveAs, setSaveAs] = useState(editingStep?.type === 'parseString' ? editingStep.data.saveAs : '')
  const [variableError, setVariableError] = useState('')

  const allowFinish =
    (parseText !== '' || selectedVariable !== '') &&
    separatorText !== '' &&
    saveAs !== '' &&
    variableError === ''

  const addParseStringStep = () => {
    const saveAsVariable = getVariable(saveAs)
    if (saveAsVariable) {
      const alreadyExistentVariableErrorMessage = 'Nome de variável já utilizado'

      if (!editingStep)
        return setVariableError(alreadyExistentVariableErrorMessage)

      if (saveAsVariable.ownerId !== editingStep.id)
        return setVariableError(alreadyExistentVariableErrorMessage)
    }

    const id = editingStep?.id || generateRandomID()

    const parseStringStepPayload: ParseStringStepData = {
      id,
      type: 'parseString',
      data: {
        parseString: parseText,
        readFrom: selectedVariable,
        divider: separatorText,
        saveAs
      }
    }

    if (editingStep)
      editStep(editingStep.id, parseStringStepPayload)
    else
      addStep(parseStringStepPayload, parentId)

    setVariable(saveAs, {
      ownerId: id,
      type: 'list',
      value: null
    })

    onClose()
  }

  return (
    <>
      <Stack justify='space-between'>
        <Fieldset legend='Texto a dividir'>
          <Stack>
            <ClearableTextArea
              label='Inserir texto manualmente'
              placeholder='Insira o texto a ser dividido'
              rows={6}
              value={parseText}
              onChange={text => setParseText(text)}
              withFileButton
            />

            <Divider label='ou' />

            <VariableSelect
              label='Inserir texto de uma variável'
              variables={variables}
              value={selectedVariable}
              onChange={value => setSelectedVariable(value)}
            />
          </Stack>
        </Fieldset>

        <ClearableTextArea
          label='Texto separador'
          placeholder='Insira o texto separador'
          rows={2}
          value={separatorText}
          onChange={text => setSeparatorText(text)}
        />

        <ClearableTextInput
          label='Salvar como'
          placeholder='Digite o nome da variável em que o texto será salvo'
          value={saveAs}
          error={variableError}
          leftSection={<IconVariable stroke={1.5} />}
          onChange={
            text => {
              setSaveAs(text)
              setVariableError('')
            }
          }
        />
      </Stack>

      <StepFinishFooter
        allowFinish={allowFinish}
        addStep={addParseStringStep}
      />
    </>
  )
}
