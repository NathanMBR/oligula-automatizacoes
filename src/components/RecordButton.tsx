import {
  Button,
  Group
} from '@mantine/core'
import { IconPlayerRecordFilled } from '@tabler/icons-react'

export type RecordButtonProps = {
  children: string
  isRecording: boolean
  onClick?: () => void
}

export const RecordButton = (props: RecordButtonProps) => {
  const {
    children,
    isRecording,
    onClick
  } = props

  return (
    <Button
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
