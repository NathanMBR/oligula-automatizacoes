import {
  Button,
  Group,
  Switch,
  Text
} from '@mantine/core'
import {
  useContext,
  useState
} from 'react'

import { PreloadContext } from '../../../providers'

export type AvailableBodyProps = {
  handleClose: () => void
  handleUpdate: () => void
}

export const AvailableBody = (props: AvailableBodyProps) => {
  const {
    handleClose,
    handleUpdate
  } = props

  const { app } = useContext(PreloadContext)

  const [avoidUpdateMessage, setAvoidUpdateMessage] = useState(false)

  return (
    <>
      <Text>Uma nova versão está disponível.</Text>
      <Text fw={500}>Você gostaria de baixá-la?</Text>

      <Switch
        label='Não exibir esta notificação novamente'
        mt='md'
        checked={avoidUpdateMessage}
        onChange={event => {
          setAvoidUpdateMessage(event.target.checked)
        }}
      />

      <Group mt='xl' justify='flex-end'>
        <Button
          variant='default'
          onClick={() => {
            if (avoidUpdateMessage)
              return app.settings.set({ showUpdateNotification: false })
                .then(handleClose)

            handleClose()
          }}
        >
          Não
        </Button>

        <Button onClick={handleUpdate}>Sim</Button>
      </Group>
    </>
  )
}
