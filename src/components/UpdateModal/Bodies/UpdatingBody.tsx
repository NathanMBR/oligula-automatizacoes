import {
  Button,
  Group,
  Loader,
  Text
} from '@mantine/core'

export const UpdatingBody = () => {
  return (
    <>
      <Text>Baixando atualização...</Text>

      <Group mt='md' justify='flex-end'>
        <Button
          variant='default'
          disabled
        >
          Não
        </Button>

        <Button disabled>
          <Loader size={20} />
        </Button>
      </Group>
    </>
  )
}
