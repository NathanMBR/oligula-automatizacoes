import {
  useContext,
  useState
} from 'react'
import { useParams } from 'react-router-dom'
import { IconSettingsAutomation } from '@tabler/icons-react'
import { Loader } from '@mantine/core'

import {
  AutomationContext,
  PreloadContext
} from '../../../providers'
import { FAB } from '../../../components'

import { runAutomationScript } from './runAutomationScript'
import type { AutomatorPageParams } from '../AutomatorPage'

export const RunAutomation = () => {
  const automationPayload = useContext(AutomationContext)
  const { app } = useContext(PreloadContext)

  const [isRunningAutomation, setIsRunningAutomation] = useState(false)

  const { expandedStepId: rawExpandedStepId } = useParams<AutomatorPageParams>()
  const expandedStepId = Number(rawExpandedStepId)

  const isHidden =
    automationPayload.steps.length <= 0 ||
    Number.isNaN(expandedStepId) ||
    expandedStepId !== -1

  const isDisabled = isHidden || isRunningAutomation

  const handleAutomationRun = () => {
    /* eslint-disable no-console */
    setIsRunningAutomation(true)

    runAutomationScript({
      ...automationPayload,
      globalTimeBetweenStepsInMs: app.settings.data.timeBetweenStepsInMs
    })
      .catch(console.error)
      .finally(() => setIsRunningAutomation(false))
    /* eslint-enable no-console */
  }

  return (
    <FAB
      hidden={isHidden}
      onClick={handleAutomationRun}
      ActionIconProps={{ variant: 'filled', disabled: isDisabled }}
      icon={
        isRunningAutomation
          ? <Loader size={20} color='rgb(255, 255, 255, 1)' />
          : <IconSettingsAutomation stroke={1.5} />
      }
    />
  )
}
