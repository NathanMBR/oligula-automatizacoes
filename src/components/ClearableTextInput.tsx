import {
  CloseButton,
  TextInput,
  Transition
} from '@mantine/core'
import type { ReactNode } from 'react'

export type ClearableTextInputProps = {
  label: string
  placeholder?: string
  value: string
  error?: string
  onChange: (value: string) => void
  leftSection?: ReactNode
}

export const ClearableTextInput = (props: ClearableTextInputProps) => {
  const {
    label,
    placeholder,
    value,
    error,
    onChange,
    leftSection
  } = props

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={event => onChange(event.currentTarget.value)}
      error={error}
      leftSection={leftSection}
      rightSection={
        <Transition mounted={value.length > 0} transition='fade'>
          {styles => <CloseButton style={styles} onClick={() => onChange('')} />}
        </Transition>
      }
    />
  )
}
