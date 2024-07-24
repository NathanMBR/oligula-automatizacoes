import {
  ActionIcon,
  Modal,
  Tabs,
  Tooltip
} from '@mantine/core'
import {
  IconFile,
  IconFolder
} from '@tabler/icons-react'
import {
  useContext,
  useState
} from 'react'
import { useParams } from 'react-router-dom'
import {
  path,
  shell
} from '@tauri-apps/api'

import { FAB } from '../../../components'
import { AutomationContext } from '../../../providers'
import { handleCatchError } from '../../../helpers'

import { LoadAutomation } from './LoadAutomation'
import { SaveAutomation } from './SaveAutomation'
import type { AutomatorPageParams } from '../AutomatorPage'

export const AutomationStore = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [tabOption, setTabOption] = useState<'load' | 'save'>('load')

  const { steps } = useContext(AutomationContext)

  const { expandedStepId: rawExpandedStepId } = useParams<AutomatorPageParams>()
  const expandedStepId = Number(rawExpandedStepId)

  const isHidden =
    Number.isNaN(expandedStepId) ||
    expandedStepId !== -1

  const openSchemasFolder = async () => {
    try {
      const appDataDir = await path.appDataDir()
      const automationSchemasDir = await path.join(appDataDir, 'automations')

      await shell.open(automationSchemasDir)
    } catch (error) {
      handleCatchError(error, 'Failed to open schemas folder:')
    }
  }

  return (
    <>
      <FAB
        hidden={isHidden}
        icon={<IconFile stroke={1.5} />}
        ActionIconProps={{ variant: 'filled', disabled: isHidden }}
        onClick={() => {
          setTabOption('load')
          setIsOpen(true)
        }}
      />

      <Modal.Root
        size='lg'
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        centered
      >
        <Modal.Overlay blur={2.5} />

        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Carregar / Salvar automação</Modal.Title>

            <Tooltip
              label='Abrir local de salvamento'
              position='right'
              withArrow
            >
              <ActionIcon
                ml='xs'
                variant='subtle'
                color='rgb(255, 255, 255)'
                onClick={openSchemasFolder}
              >
                <IconFolder stroke={1} />
              </ActionIcon>
            </Tooltip>

            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body>
            <Tabs value={tabOption}>
              <Tabs.List mb='sm' grow>
                <Tabs.Tab
                  value='load'
                  onClick={() => setTabOption('load')}
                >
                  Carregar
                </Tabs.Tab>
                <Tabs.Tab
                  value='save'
                  disabled={steps.length <= 0}
                  onClick={() => setTabOption('save')}
                >
                  Salvar
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value='load'>
                <LoadAutomation handleClose={() => setIsOpen(false)} />
              </Tabs.Panel>

              <Tabs.Panel value='save'>
                <SaveAutomation handleClose={() => setIsOpen(false)} />
              </Tabs.Panel>
            </Tabs>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  )
}
