import { appWindow } from '@tauri-apps/api/window'
import { useEffect } from 'react'

import {
  Navbar,
  Header
} from '../../layouts'

import { Automation } from './Automation'
import { NewStep } from './NewStep'
import { AutomationStore } from './AutomationStore'
import { RunAutomation } from './RunAutomation'

export type AutomatorPageParams = {
  expandedStepId: string
}

export const AutomatorPage = () => {
  useEffect(() => {
    appWindow.setTitle('Oligula Automatizações | Automatizador')
  }, [])

  return (
    <Navbar selectedOption='Automatizador'>
      <Header>
        <Automation />

        <RunAutomation />

        <AutomationStore />

        <NewStep />
      </Header>
    </Navbar>
  )
}
