import {
  Divider,
  Fieldset,
  Group,
  Select,
  Stack
} from '@mantine/core'
import {
  type Icon,
  IconCheck,
  IconEqual,
  IconEqualNot,
  IconMathGreater,
  IconMathLower,
  IconMathEqualGreater,
  IconMathEqualLower
} from '@tabler/icons-react'
import {
  useContext,
  useState
} from 'react'

import type {
  ConditionalStepConditionOperator,
  ConditionalStepData,
  StepData
} from '../../../../types'
import {
  ClearableTextInput,
  VariableSelect
} from '../../../../components'
import { AutomationContext } from '../../../../providers'
import { useParentId } from '../../../../hooks'
import { generateRandomID } from '../../../../helpers'

import { StepFinishFooter } from '../StepFinishFooter'

export type ConditionalStepProps = {
  onClose: () => void
  editingStep: StepData | null
}

export const ConditionalStep = (props: ConditionalStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const {
    addStep,
    editStep,

    listVariablesWithData
  } = useContext(AutomationContext)

  const variables = listVariablesWithData()
  const parentId = useParentId()

  const initialState = {
    leftSide: {
      value: editingStep?.type === 'conditional' && editingStep.data.condition.leftSide.origin === 'value'
        ? editingStep.data.condition.leftSide.value
        : '',

      variable: editingStep?.type === 'conditional' && editingStep.data.condition.leftSide.origin === 'variable'
        ? editingStep.data.condition.leftSide.readFrom
        : variables[0]?.[0] || ''
    },

    operator: (editingStep?.type === 'conditional'
      ? editingStep.data.condition.operator
      : 'equal') satisfies ConditionalStepConditionOperator,

    rightSide: {
      value: editingStep?.type === 'conditional' && editingStep.data.condition.rightSide.origin === 'value'
        ? editingStep.data.condition.rightSide.value
        : '',

      variable: editingStep?.type === 'conditional' && editingStep.data.condition.rightSide.origin === 'variable'
        ? editingStep.data.condition.rightSide.readFrom
        : variables[0]?.[0] || ''
    }
  }

  const [conditionLeftSideValue, setConditionLeftSideValue] = useState(initialState.leftSide.value)
  const [conditionLeftSideSelectedVariable, setConditionLeftSideSelectedVariable] = useState(initialState.leftSide.variable)
  const [conditionOperator, setConditionOperator] = useState(initialState.operator)
  const [conditionRightSideValue, setConditionRightSideValue] = useState(initialState.rightSide.value)
  const [conditionRightSideSelectedVariable, setConditionRightSideSelectedVariable] = useState(initialState.rightSide.variable)

  const [leftSideValueNumberError, setLeftSideValueNumberError] = useState('')
  const [rightSideValueNumberError, setRightSideValueNumberError] = useState('')

  const allowFinish =
    (!!conditionLeftSideValue || !!conditionLeftSideSelectedVariable) &&
    !!conditionOperator &&
    (!!conditionRightSideValue || !!conditionRightSideSelectedVariable)

  const iconProps = {
    size: 18,
    stroke: 1.5
  }

  const operatorSelectData: {
    icons: Record<ConditionalStepConditionOperator, Icon>
    options: Array<{
      value: ConditionalStepConditionOperator
      label: string
    }>
  } = {
    icons: {
      equal: IconEqual,
      notEqual: IconEqualNot,
      greaterThan: IconMathGreater,
      lesserThan: IconMathLower,
      greaterOrEqualThan: IconMathEqualGreater,
      lesserOrEqualThan: IconMathEqualLower
    },

    options: [
      {
        value: 'equal',
        label: 'Igual a'
      },

      {
        value: 'notEqual',
        label: 'Diferente de'
      },

      {
        value: 'greaterThan',
        label: 'Maior que'
      },

      {
        value: 'lesserThan',
        label: 'Menor que'
      },

      {
        value: 'greaterOrEqualThan',
        label: 'Maior ou igual a'
      },

      {
        value: 'lesserOrEqualThan',
        label: 'Menor ou igual a'
      }
    ]
  }

  const SelectedOperatorIcon = operatorSelectData.icons[conditionOperator]

  const addConditionalStep = () => {
    const id = editingStep?.id || generateRandomID()

    const numberOnlyConditionOperators: Array<ConditionalStepConditionOperator> = [
      'greaterThan',
      'lesserThan',
      'greaterOrEqualThan',
      'lesserOrEqualThan'
    ]

    if (numberOnlyConditionOperators.includes(conditionOperator)) {
      const invalidNumberMessage = 'Para o operador escolhido, o valor deve ser um número válido'

      const leftSideValueNumber = Number(conditionLeftSideValue)
      const rightSideValueNumber = Number(conditionRightSideValue)

      let hasError = false

      if (conditionLeftSideValue.length > 0 && Number.isNaN(leftSideValueNumber)) {
        setLeftSideValueNumberError(invalidNumberMessage)
        hasError = true
      }

      if (conditionRightSideValue.length > 0 && Number.isNaN(rightSideValueNumber)) {
        setRightSideValueNumberError(invalidNumberMessage)
        hasError = true
      }

      if (hasError)
        return
    }

    const conditionalStepPayload: ConditionalStepData = {
      id,
      type: 'conditional',
      data: {
        steps: editingStep && 'steps' in editingStep.data
          ? editingStep?.data.steps
          : [],

        condition: {
          leftSide: conditionLeftSideValue.length > 0
            ? {
              origin: 'value',
              value: conditionLeftSideValue
            }
            : {
              origin: 'variable',
              readFrom: conditionLeftSideSelectedVariable
            },

          operator: conditionOperator,

          rightSide: conditionRightSideValue.length > 0
            ? {
              origin: 'value',
              value: conditionRightSideValue
            }
            : {
              origin: 'variable',
              readFrom: conditionRightSideSelectedVariable
            }
        }
      }
    }

    if (editingStep)
      editStep(editingStep.id, conditionalStepPayload)
    else
      addStep(conditionalStepPayload, parentId)

    onClose()
  }

  return (
    <>
      <Stack justify='space-between'>
        <Fieldset legend='Primeiro valor'>
          <Stack>
            <ClearableTextInput
              label='Inserir valor manualmente'
              placeholder='Insira o primeiro valor a ser comparado'
              error={leftSideValueNumberError}
              value={conditionLeftSideValue}
              onChange={
                value => {
                  setLeftSideValueNumberError('')
                  setConditionLeftSideValue(value)
                }
              }
            />

            <Divider label='ou' />

            <VariableSelect
              label='Inserir valor de uma variável'
              variables={variables}
              value={conditionLeftSideSelectedVariable}
              onChange={value => setConditionLeftSideSelectedVariable(value)}
            />
          </Stack>
        </Fieldset>

        <Select
          label='Operador da comparação'
          checkIconPosition='right'
          leftSection={<SelectedOperatorIcon {...iconProps} />}
          data={operatorSelectData.options}
          allowDeselect={false}
          value={conditionOperator}
          onChange={value => setConditionOperator((value as ConditionalStepConditionOperator | null) || initialState.operator)}
          renderOption={renderOptions => {
            const { option, checked } = renderOptions

            const OptionIcon = operatorSelectData.icons[option.value as ConditionalStepConditionOperator]

            return <Group flex={1} gap='xs'>
              <OptionIcon {...iconProps} />
              {option.label}
              {checked ? <IconCheck {...iconProps} style={{ marginInlineStart: 'auto' }} /> : null}
            </Group>
          }}
        />

        <Fieldset legend='Segundo valor'>
          <Stack>
            <ClearableTextInput
              label='Inserir valor manualmente'
              placeholder='Insira o segundo valor a ser comparado'
              error={rightSideValueNumberError}
              value={conditionRightSideValue}
              onChange={value => {
                setRightSideValueNumberError('')
                setConditionRightSideValue(value)
              }}
            />

            <Divider label='ou' />

            <VariableSelect
              label='Inserir valor de uma variável'
              variables={variables}
              value={conditionRightSideSelectedVariable}
              onChange={value => setConditionRightSideSelectedVariable(value)}
            />
          </Stack>
        </Fieldset>
      </Stack>

      <StepFinishFooter
        allowFinish={allowFinish}
        addStep={addConditionalStep}
      />
    </>
  )
}
