import {
  Button,
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
import {
  path,
  shell
} from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'

import {
  Header,
  Navbar
} from '../../layouts'
import { PreloadContext } from '../../providers'
import { UpdateModal } from '../../components'
import { IconLogs } from '@tabler/icons-react'

export const SettingsPage = () => {
  const { app } = useContext(PreloadContext)

  const [showUpdateNotification, setShowUpdateNotification] = useState(app.settings.data.showUpdateNotification)
  const [timeBetweenStepsInMs, setTimeBetweenStepsInMs] = useState(app.settings.data.timeBetweenStepsInMs)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const ONE_SECOND_IN_MS = 1_000

  const portugueseNumberFormatter = new Intl.NumberFormat('pt-br')

  const handleLogsFolderOpening = async () => {
    const logsFolderPath = await path.appLogDir()

    await shell.open(logsFolderPath)
  }

  useEffect(() => {
    appWindow.setTitle('Oligula Automatizações | Configurações')
  }, [])

  return (
    <Navbar>
      <Header>
        <Stack gap='lg'>
          <Fieldset legend='Atualizações' p='lg'>
            <Stack gap='xl'>
              <Stack gap='xs'>
                <Text size='sm'>Atualizar versão do programa</Text>

                <Button
                  w='fit-content'
                  variant='default'
                  onClick={() => setIsUpdateModalOpen(true)}
                  disabled={!app.update.available}
                >
                  {app.update.available ? 'Atualizar versão' : 'Versão atualizada'}
                </Button>
              </Stack>

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
            </Stack>
          </Fieldset>

          <Fieldset legend='Automatizador' p='lg'>
            <Stack gap='md'>
              <Text size='sm'>Tempo entre execução de cada passo</Text>

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
            </Stack>
          </Fieldset>

          <Fieldset legend='Logs' p='lg'>
            <Button leftSection={<IconLogs size={20} stroke={1.5} />} onClick={handleLogsFolderOpening}>Abrir pasta de logs</Button>
          </Fieldset>
        </Stack>

        <UpdateModal
          isOpenExternally={isUpdateModalOpen}
          setIsOpenExternally={setIsUpdateModalOpen}
        />
      </Header>
    </Navbar>
  )
}
