import {
  Modal,
  Tabs
} from '@mantine/core'
import {
  useContext,
  useState
} from 'react'
import { IconFile } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'

import { FAB } from '../../../components'
import { AutomationContext } from '../../../providers'

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

      <Modal
        size='lg'
        title='Carregar / Salvar automação'
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        overlayProps={{ blur: 2.5 }}
        centered
      >
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
      </Modal>
    </>
  )
}
