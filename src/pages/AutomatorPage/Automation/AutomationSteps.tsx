import { Stack } from '@mantine/core'
import { useContext } from 'react'

import { AutomationContext } from '../../../providers'
import type { StepData } from '../../../types'

import { AutomationCard } from './AutomationCard'

export type AutomationStepsProps = {
  steps: Array<StepData>
}

export const AutomationSteps = (props: AutomationStepsProps) => {
  const {
    steps
  } = props

  const {
    getStepPositionString,
    deleteVariablesByStepId,
    removeStep,

    setIsAddingStep,

    setEditingStep,

    setStageIndex
  } = useContext(AutomationContext)

  return <Stack mb={80}>
    {
      steps.map(step => {
        const {
          id,
          type
        } = step

        const position = getStepPositionString(id)
        const onEdit = () => {
          setIsAddingStep(true)
          setEditingStep(step)
          setStageIndex(1)
        }

        const onRemove = () => {
          deleteVariablesByStepId(id)
          removeStep(id)
        }

        if (type === 'move')
          return <AutomationCard.Move
            key={id}
            position={position}
            x={step.data.x}
            y={step.data.y}
            onEdit={onEdit}
            onRemove={onRemove}
          />

        if (type === 'click')
          return <AutomationCard.Click
            key={id}
            position={position}
            button={step.data.button}
            onEdit={onEdit}
            onRemove={onRemove}
          />

        if (type === 'write')
          return <AutomationCard.Write
            key={id}
            position={position}
            text={step.data.text}
            readFrom={step.data.readFrom}
            onEdit={onEdit}
            onRemove={onRemove}
          />

        if (type === 'readFile')
          return <AutomationCard.ReadFile
            key={id}
            position={position}
            filename={step.data.filename}
            saveAs={step.data.saveAs}
            onEdit={onEdit}
            onRemove={onRemove}
          />

        if (type === 'parseString')
          return <AutomationCard.ParseString
            key={id}
            position={position}
            parseString={step.data.parseString}
            readFrom={step.data.readFrom}
            divider={step.data.divider}
            saveAs={step.data.saveAs}
            onEdit={onEdit}
            onRemove={onRemove}
          />

        if (type === 'cycle')
          return <AutomationCard.Cycle
            key={id}
            position={position}
            currentStep={{ id: step.id, type: step.type }}
            saveItemsAs={step.data.saveItemsAs}
            iterable={step.data.iterable}
            steps={step.data.steps}
            onEdit={onEdit}
            onRemove={onRemove}
          />
      })
    }
  </Stack>
}
