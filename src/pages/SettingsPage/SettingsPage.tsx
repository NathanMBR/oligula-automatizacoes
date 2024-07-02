import {
  Fieldset,
  Switch
} from '@mantine/core'
import {
  useContext,
  useState
} from 'react'

import {
  Header,
  Navbar
} from '../../layouts'
import { PreloadContext } from '../../providers'

export const SettingsPage = () => {
  const { app } = useContext(PreloadContext)

  const [showUpdateNotification, setShowUpdateNotification] = useState(app.settings.showUpdateNotification)

  return (
    <Navbar>
      <Header>
        <Fieldset legend='Atualizações' p='lg'>
          <Switch
            label='Exibir notificação sobre atualizações'
            checked={showUpdateNotification}
            onChange={
              event => {
                setShowUpdateNotification(event.target.checked)

                app.setSetting('showUpdateNotification', event.target.checked)
                  .then(success => {
                    if (!success)
                      setShowUpdateNotification(!event.target.checked)
                  })
              }
            }
          />
        </Fieldset>
      </Header>
    </Navbar>
  )
}
