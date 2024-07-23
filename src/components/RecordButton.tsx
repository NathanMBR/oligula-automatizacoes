import {
  type ButtonProps,
  Button,
  Group
} from '@mantine/core'
import { IconPlayerRecordFilled } from '@tabler/icons-react'

export type RecordButtonProps = {
  children: string
  isRecording: boolean
  buttonProps?: ButtonProps
  onClick?: () => void
}

export const RecordButton = (props: RecordButtonProps) => {
  const {
    children,
    isRecording,
    buttonProps,
    onClick
  } = props

  return (
    <Button
      {...buttonProps}
      variant='default'
      onClick={onClick}
      disabled={isRecording}
    >
      {
        isRecording
          ? <Group gap={4}>
            <IconPlayerRecordFilled color='#f00' size={20} />
            <span>Capturando...</span>
          </Group>
          : <>
            {children}
          </>
      }
    </Button>
  )
}
