import {
  useContext,
  useState
} from 'react'
import { NumberInput } from '@mantine/core'

import type {
  SleepStepData,
  StepDefaultData
} from '../../../../types'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

type SleepStepPayload = SleepStepData & StepDefaultData
export type SleepStepProps = {
  onClose: () => void
  editingStep: SleepStepPayload | null
}

export const SleepStep = (props: SleepStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const [timeInMs, setTimeInMs] = useState(editingStep?.data.time || 0)

  const {
    addStep,
    editStep
  } = useContext(AutomationContext)

  const parentId = useParentId()

  const ONE_SECOND_IN_MS = 1000
  const MAX_TIME_IN_SECONDS = 1000
  const MAX_TIME = MAX_TIME_IN_SECONDS * ONE_SECOND_IN_MS

  const allowFinish = !Number.isNaN(timeInMs) && timeInMs > 0

  const addSleepStep = () => {
    const sleepStepPayload: SleepStepPayload = {
      id: editingStep?.id || generateRandomID(),
      type: 'sleep',
      data: {
        time: timeInMs
      }
    }

    if (editingStep)
      editStep(editingStep.id, sleepStepPayload)
    else
      addStep(sleepStepPayload, parentId)

    onClose()
  }

  return (
    <>
      <NumberInput
        label='Tempo (em segundos)'
        clampBehavior='strict'
        decimalSeparator=','
        allowNegative={false}
        allowDecimal={true}
        decimalScale={2}
        min={0}
        max={MAX_TIME}
        value={timeInMs / ONE_SECOND_IN_MS}
        onChange={value => setTimeInMs(Number(value) * ONE_SECOND_IN_MS)}
      />

      <StepFinishFooter
        allowFinish={allowFinish}
        addStep={addSleepStep}
      />
    </>
  )
}
