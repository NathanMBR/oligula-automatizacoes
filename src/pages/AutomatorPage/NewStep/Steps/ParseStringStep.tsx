import {
  Divider,
  Fieldset,
  Select,
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
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { ClearableTextInput } from '../../../../components'
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

    listVariables,
    hasVariable,
    setVariable
  } = useContext(AutomationContext)

  const variables = listVariables()

  const [parseText, setParseText] = useState(editingStep?.type === 'parseString' ? editingStep.data.parseString : '')
  const [selectedVariable, setSelectedVariable] = useState(editingStep?.type === 'parseString' ? editingStep.data.readFrom : variables[0] || '')
  const [separatorText, setSeparatorText] = useState(editingStep?.type === 'parseString' ? editingStep.data.divider : '')
  const [saveAs, setSaveAs] = useState(editingStep?.type === 'parseString' ? editingStep.data.saveAs : '')
  const [variableError, setVariableError] = useState('')

  const parentId = useParentId()

  const allowFinish =
    (parseText !== '' || selectedVariable !== '') &&
    separatorText !== '' &&
    saveAs !== '' &&
    variableError === ''

  const noVariablesError = variables.length <= 0
    ? 'Desativado (não há variáveis disponíveis)'
    : null

  const manualInputError = parseText.length > 0
    ? 'Desativado (dado manual inserido; remova-o para ativar)'
    : null

  const selectError = noVariablesError || manualInputError || ''

  const addParseStringStep = () => {
    if (hasVariable(saveAs))
      return setVariableError('Nome de variável já utilizado')

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
      value: null
    })

    onClose()
  }

  return (
    <>
      <Stack justify='space-between'>
        <Fieldset legend='Texto a dividir'>
          <Stack>
            <ClearableTextInput
              label='Inserir texto manualmente'
              placeholder='Insira o texto a ser dividido'
              value={parseText}
              onChange={text => setParseText(text)}
            />

            <Divider label='ou' />

            <Select
              label='Inserir texto de uma variável'
              checkIconPosition='right'
              data={variables}
              error={selectError}
              allowDeselect={false}
              value={selectedVariable}
              disabled={selectError !== ''}
              onChange={value => setSelectedVariable(String(value))}
            />
          </Stack>
        </Fieldset>

        <ClearableTextInput
          label='Texto separador'
          placeholder='Insira o texto separador'
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
