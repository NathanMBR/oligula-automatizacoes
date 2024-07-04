import {
  useEffect,
  useState
} from 'react'
import { appWindow } from '@tauri-apps/api/window'

import {
  Navbar,
  Header
} from '../../layouts'
import { AutomationProvider } from '../../providers'

import { Automation } from './Automation'
import { NewStep } from './NewStep'
import { AutomationStore } from './AutomationStore'
import { RunAutomation } from './RunAutomation'

export type AutomatorPageParams = {
  expandedStepId: string
}

export const AutomatorPage = () => {
  const [isNewStepOpen, setIsNewStepOpen] = useState(false)

  useEffect(() => {
    appWindow.setTitle('Oligula Automatizações | Automatizador')
  }, [])

  return (
    <AutomationProvider>
      <Navbar selectedOption='Automatizador'>
        <Header>
          <Automation setIsNewStepOpen={setIsNewStepOpen} />

          <RunAutomation />

          <AutomationStore />

          <NewStep
            isOpen={isNewStepOpen}
            onClose={() => setIsNewStepOpen(false)}
          />
        </Header>
      </Navbar>
    </AutomationProvider>
  )
}
