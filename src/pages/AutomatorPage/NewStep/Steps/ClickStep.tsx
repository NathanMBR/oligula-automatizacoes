import {
  useContext,
  useState
} from 'react'
import { Select } from '@mantine/core'

import type {
  ClickStepData,
  StepData
} from '../../../../types'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

export type ClickStepProps = {
  onClose: () => void
  editingStep: StepData | null
}

export const ClickStep = (props: ClickStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const [mouseButton, setMouseButton] = useState<ClickStepData['data']['button']>(editingStep?.type === 'click' ? editingStep.data.button : 'left')

  const {
    addStep,
    editStep
  } = useContext(AutomationContext)

  const parentId = useParentId()

  const addClickStep = () => {
    const clickStepPayload: ClickStepData = {
      id: editingStep?.id || generateRandomID(),
      type: 'click',
      data: {
        button: mouseButton
      }
    }

    if (editingStep)
      editStep(editingStep.id, clickStepPayload)
    else
      addStep(clickStepPayload, parentId)

    onClose()
  }

  return (
    <>
      <Select
        label='Botão do mouse'
        checkIconPosition='right'
        value={mouseButton}
        allowDeselect={false}
        onChange={value => setMouseButton(String(value) as ClickStepData['data']['button'])}
        data={[
          {
            value: 'left',
            label: 'Esquerdo'
          },

          {
            value: 'right',
            label: 'Direito'
          },

          {
            value: 'middle',
            label: 'Meio'
          }
        ]}
      />

      <StepFinishFooter
        addStep={addClickStep}
        allowFinish
      />
    </>
  )
}
