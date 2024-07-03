import {
  Fieldset,
  Slider,
  Stack,
  Switch,
  Text
} from '@mantine/core'
import {
  useContext,
  useEffect,
  useState
} from 'react'
import { appWindow } from '@tauri-apps/api/window'

import {
  Header,
  Navbar
} from '../../layouts'
import { PreloadContext } from '../../providers'

export const SettingsPage = () => {
  const { app } = useContext(PreloadContext)

  const [showUpdateNotification, setShowUpdateNotification] = useState(app.settings.data.showUpdateNotification)
  const [timeBetweenStepsInMs, setTimeBetweenStepsInMs] = useState(app.settings.data.timeBetweenStepsInMs)

  const ONE_SECOND_IN_MS = 1_000

  const portugueseNumberFormatter = new Intl.NumberFormat('pt-br')

  useEffect(() => {
    appWindow.setTitle('Oligula Automatizações | Configurações')
  }, [])

  return (
    <Navbar>
      <Header>
        <Stack gap='lg'>
          <Fieldset legend='Atualizações' p='lg'>
            <Switch
              label='Exibir notificação sobre atualizações'
              checked={showUpdateNotification}
              onChange={
                event => {
                  setShowUpdateNotification(event.target.checked)

                  app.settings.set({ showUpdateNotification: event.target.checked })
                    .then(success => {
                      if (!success)
                        setShowUpdateNotification(!event.target.checked)
                    })
                }
              }
            />
          </Fieldset>

          <Fieldset legend='Automatizador' p='lg'>
            <Text size='sm' mb='sm'>Tempo entre execução de cada passo</Text>
            <Slider
              size='sm'
              mb='md'
              value={timeBetweenStepsInMs}
              defaultValue={timeBetweenStepsInMs}
              min={0 * ONE_SECOND_IN_MS}
              max={10 * ONE_SECOND_IN_MS}
              step={0.1 * ONE_SECOND_IN_MS}
              label={ms => `${portugueseNumberFormatter.format(ms / ONE_SECOND_IN_MS)} s`}
              onChange={ms => setTimeBetweenStepsInMs(ms)}
              onChangeEnd={ms => app.settings.set({ timeBetweenStepsInMs: ms })}
              marks={[
                { value: 0 * ONE_SECOND_IN_MS, label: '0 s' },
                { value: 1 * ONE_SECOND_IN_MS, label: '1 s' },
                { value: 2.5 * ONE_SECOND_IN_MS, label: '2,5 s' },
                { value: 5 * ONE_SECOND_IN_MS, label: '5 s' },
                { value: 7.5 * ONE_SECOND_IN_MS, label: '7,5 s' },
                { value: 10 * ONE_SECOND_IN_MS, label: '10 s' }
              ]}
            />
          </Fieldset>
        </Stack>
      </Header>
    </Navbar>
  )
}
