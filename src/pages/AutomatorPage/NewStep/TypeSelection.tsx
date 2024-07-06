import {
  Button,
  Group,
  Select
} from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { useContext } from 'react'

import type { StepData } from '../../../types'
import { AutomationContext } from '../../../providers'

import { StepTypes } from '../StepTypes'

export type TypeSelectionProps = {
  stepType: StepData['type']
  setStepType: (value: StepData['type']) => void
}

export const TypeSelection = (props: TypeSelectionProps) => {
  const {
    stepType,
    setStepType
  } = props

  const {
    setIsAddingStep,

    setStageIndex
  } = useContext(AutomationContext)

  const typeCategories = {
    actions: [
      'move',
      'click',
      'write',
      'readFile',
      'parseString'
    ],

    statements: [
      'cycle'
    ]
  } satisfies Record<string, Array<StepData['type']>>

  const selectedType = StepTypes[stepType]

  const iconProps = {
    size: 18,
    stroke: 1.5
  }

  return (
    <>
      <Select
        label='Selecione o tipo'
        checkIconPosition='right'
        maxDropdownHeight={300}
        allowDeselect={false}
        value={stepType}
        leftSection={<selectedType.icon {...iconProps} />}
        onChange={value => setStepType(value as StepData['type'])}
        data={[
          {
            group: 'Ações',
            items: typeCategories.actions.map(type => ({ value: type, label: StepTypes[type].title }))
          },

          {
            group: 'Condicionais / Repetições',
            items: typeCategories.statements.map(type => ({ value: type, label: StepTypes[type].title }))
          }
        ]}
        renderOption={renderOptions => {
          const { option, checked } = renderOptions

          const Icon = StepTypes[option.value as keyof typeof StepTypes].icon

          return <Group flex={1} gap='xs'>
            {<Icon {...iconProps} />}
            {option.label}
            {checked ? <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} /> : null}
          </Group>
        }}
      />

      <Group justify='end' mt='md'>
        <Button variant='default' onClick={() => setIsAddingStep(false)}>Cancelar</Button>
        <Button onClick={() => setStageIndex(1)}>Próximo</Button>
      </Group>
    </>
  )
}
