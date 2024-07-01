import {
  Button,
  Group,
  Text
} from '@mantine/core'

export type AvailableBodyProps = {
  handleClose: () => void
  handleUpdate: () => void
}

export const AvailableBody = (props: AvailableBodyProps) => {
  const {
    handleClose,
    handleUpdate
  } = props

  return (
    <>
      <Text>Uma nova versão está disponível.</Text>
      <Text fw={500}>Você gostaria de baixá-la?</Text>

      <Group mt='md' justify='flex-end'>
        <Button
          variant='default'
          onClick={handleClose}
        >
          Não
        </Button>

        <Button onClick={handleUpdate}>Sim</Button>
      </Group>
    </>
  )
}
