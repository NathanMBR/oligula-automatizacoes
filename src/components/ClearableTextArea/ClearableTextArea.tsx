import {
  Box,
  Button,
  CloseButton,
  FileButton,
  Group,
  Loader,
  Text,
  Textarea,
  Tooltip,
  Transition
} from '@mantine/core'
import {
  useState,
  type ReactNode
} from 'react'
import { IconFileText } from '@tabler/icons-react'

export type ClearableTextAreaProps = {
  label: string
  description?: string
  placeholder?: string
  value: string
  error?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  rows?: number
  onChange: (value: string) => void
  leftSection?: ReactNode
  disabled?: boolean
  withAsterisk?: boolean
  withFileButton?: boolean
}

export const ClearableTextArea = (props: ClearableTextAreaProps) => {
  const {
    label,
    description,
    placeholder,
    value,
    error,
    resize,
    rows = 4,
    onChange,
    leftSection,
    disabled,
    withAsterisk,
    withFileButton
  } = props

  const [isReadingFile, setIsReadingFile] = useState(false)

  return (
    <Box>
      <Group justify='space-between' align='flex-end' mb={5}>
        <Text component='label' size='sm' fw={500}>
          {label}
        </Text>

        {
          withFileButton
            ? <FileButton
              disabled={isReadingFile}
              onChange={file => {
              /* eslint-disable no-console */
                if (!file)
                  return

                setIsReadingFile(true)

                file.text()
                  .then(fileText => onChange(fileText))
                  .catch(console.error)
                  .finally(() => setIsReadingFile(false))
              /* eslint-enable no-console */
              }}
            >
              {
                props => <Tooltip
                  label='Importar de arquivo'
                  position='left'
                  withArrow
                >
                  <Button
                    variant='default'
                    size='compact-md'
                    {...props}
                  >
                    {
                      isReadingFile
                        ? <Loader size={16} />
                        : <IconFileText size={20} />
                    }
                  </Button>
                </Tooltip>
              }
            </FileButton>
            : null
        }
      </Group>

      <Textarea
        value={value}
        error={error}
        rows={rows}
        resize={resize}
        disabled={disabled}
        description={description}
        placeholder={placeholder}
        leftSection={leftSection}
        withAsterisk={withAsterisk}
        onChange={event => onChange(event.currentTarget.value)}
        rightSection={
          <Transition transition='fade' mounted={value.length > 0}>
            {
              style => <CloseButton
                mr={4}
                style={style}
                onClick={() => onChange('')}
              />
            }
          </Transition>
        }
      />
    </Box>
  )
}
