import {
  IconCheck,
  IconSquareAsterisk,
  IconSquareNumber1
} from '@tabler/icons-react'
import {
  Group,
  Select
} from '@mantine/core'
import { useContext } from 'react'

import { AutomationContext } from '../providers'
import type { Variables } from '../types'

export type VariableSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  variables: Array<[string, Variables[string]]>

  manualInput?: boolean
  noVariablesErrorMessage?: string
  manualInputErrorMessage?: string
}

export const VariableSelect = (props: VariableSelectProps) => {
  const {
    label,
    value,
    onChange,
    variables,
    manualInput,
    noVariablesErrorMessage,
    manualInputErrorMessage
  } = props

  const { variables: contextVariables } = useContext(AutomationContext)

  const selectedVariableData = contextVariables[value]

  const noVariablesError = variables.length <= 0
    ? (noVariablesErrorMessage || 'Desativado (não há variáveis disponíveis)')
    : null

  const manualInputError = manualInput
    ? (manualInputErrorMessage || 'Desativado (dado manual inserido; remova-o para ativar)')
    : null

  const selectError =
    noVariablesError ||
    manualInputError ||
    ''

  const iconProps = {
    size: 18,
    stroke: 1.5
  }

  const selectedVariableIcon = selectedVariableData
    ? (
      selectedVariableData.type === 'value'
        ? <IconSquareNumber1 {...iconProps} />
        : <IconSquareAsterisk {...iconProps} />
    ) : undefined

  return (
    <Select
      checkIconPosition='right'
      label={label}
      value={value}
      error={selectError}
      allowDeselect={false}
      disabled={selectError !== ''}
      leftSection={selectedVariableIcon}
      data={variables.map(([variableKey]) => variableKey)}
      onChange={newVariable => onChange(newVariable || '')}
      renderOption={renderOptions => {
        const { option, checked } = renderOptions

        const variableOptionData = contextVariables[option.value]!

        const icon = variableOptionData.type === 'value'
          ? <IconSquareNumber1 {...iconProps} />
          : <IconSquareAsterisk {...iconProps} />

        return <Group flex={1} gap='xs'>
          {icon}
          {option.label}
          {
            checked
              ? <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />
              : null
          }
        </Group>
      }}
    />
  )
}
