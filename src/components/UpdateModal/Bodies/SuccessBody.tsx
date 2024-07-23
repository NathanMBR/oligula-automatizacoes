import {
  Button,
  Group,
  Text
} from '@mantine/core'

export type SuccessBodyProps = {
  handleClose: () => void
}

export const SuccessBody = (props: SuccessBodyProps) => {
  const { handleClose } = props

  return (
    <>
      <Text>Atualização concluída com sucesso!</Text>
      <Text>Por favor, <span style={{ fontWeight: 'bold' }}>reinicie o aplicativo</span> para aplicar a atualização.</Text>

      <Group mt='md' justify='flex-end'>
        <Button onClick={handleClose}>Fechar</Button>
      </Group>
    </>
  )
}
