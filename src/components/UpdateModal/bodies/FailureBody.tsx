import {
  Alert,
  Button,
  Code,
  Group,
  Text
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useContext } from 'react'

import { PreloadContext } from '../../../providers'

export type FailureBodyProps = {
  handleClose: () => void
}

export const FailureBody = (props: FailureBodyProps) => {
  const { handleClose } = props

  const { os } = useContext(PreloadContext)
  const isLinux = os.type === 'Linux'

  return (
    <>
      <Text mb='xl'>Um erro inesperado ocorreu durante a atualização.</Text>

      {
        isLinux
          ? <Alert
            title='Nota sobre o Linux'
            color='yellow'
            icon={<IconInfoCircle />}
          >
            <Text mb='xs'>A atualização automática não está disponível caso tenha instalado este aplicativo pelo pacote <Code>.deb</Code>.</Text>
            <Text>Caso este seja o seu caso, baixe a atualização manualmente do repositório do GitHub, ou considere mudar para a versão <Code>AppImage</Code>.</Text>
          </Alert>
          : null
      }

      <Group mt='md' justify='flex-end'>
        <Button onClick={handleClose}>Fechar</Button>
      </Group>
    </>
  )
}
