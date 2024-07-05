import {
  Button,
  Grid
} from '@mantine/core'
import {
  IconPlus,
  IconTrash
} from '@tabler/icons-react'
import {
  useContext,
  useEffect
} from 'react'
import { useParams } from 'react-router-dom'

import {
  AutomationContext,
  HeaderContext
} from '../../../providers'
import type { StepData } from '../../../types'

import { AutomationSteps } from './AutomationSteps'
import { StepTypes } from '../StepTypes'
import type { AutomatorPageParams } from '../AutomatorPage'

export type AutomationProps = {
  setIsNewStepOpen: (value: boolean) => void
}

export const Automation = (props: AutomationProps) => {
  const { setIsNewStepOpen } = props

  const {
    steps: contextSteps,
    getStep,
    getStepPositionString,
    setSteps,
    setVariables
  } = useContext(AutomationContext)
  const { setPageSubtitle } = useContext(HeaderContext)

  const { expandedStepId: rawExpandedStepId } = useParams<AutomatorPageParams>()
  const expandedStepId = Number(rawExpandedStepId)

  const loadExpandedStep = (id: StepData['id']) => {
    /* eslint-disable no-console */
    if (Number.isNaN(id)) {
      console.error(`Unexpected Error: Expected valid step id (got ${rawExpandedStepId})`)
      return null
    }

    if (id < 0)
      return null

    const step = getStep(id)
    if (!step) {
      console.error(`Unexpected Error: Step with id ${id} not found`)
      return null
    }
    /* eslint-enable no-console */

    return step
  }

  const getChildrenSteps = (step: StepData | null) => {
    if (!step)
      return null

    if (!('steps' in step.data)) {
      // eslint-disable-next-line no-console
      console.error(`Unexpected Error: Step with id ${step.id} has no children steps`)
      return null
    }

    return step.data.steps
  }

  const steps = getChildrenSteps(loadExpandedStep(expandedStepId)) || contextSteps

  useEffect(() => {
    const step = loadExpandedStep(expandedStepId)
    if (!step)
      return setPageSubtitle('Passos iniciais')

    const stepPosition = getStepPositionString(step.id)

    setPageSubtitle(`Passo ${stepPosition}: ${StepTypes[step.type].title}`)
  }, [rawExpandedStepId])

  return (
    <>
      <Grid mb='md'>
        <Grid.Col span={11}>
          <Button
            variant='default'
            leftSection={<IconPlus />}
            onClick={() => setIsNewStepOpen(true)}
            fullWidth
          >
            Adicionar passo
          </Button>
        </Grid.Col>

        <Grid.Col span={1}>
          <Button
            color='red'
            onClick={() => {
              setSteps([])
              setVariables({})
            }}
            disabled={steps.length === 0}
            fullWidth
          >
            <IconTrash />
          </Button>
        </Grid.Col>
      </Grid>

      <AutomationSteps steps={steps} />
    </>
  )
}
