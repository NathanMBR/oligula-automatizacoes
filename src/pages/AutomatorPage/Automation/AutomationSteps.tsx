import {
  Box,
  Stack
} from '@mantine/core'
import { Droppable } from '@hello-pangea/dnd'
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

  return (
    <Droppable droppableId='automation-steps' direction='vertical'>
      {
        provided => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            <Stack mb={80}>
              {
                steps.map((step, index)=> {
                  const {
                    id,
                    type
                  } = step

                  // actions

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
                      currentStepId={step.id}
                      index={index}
                      x={step.data.x}
                      y={step.data.y}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'click')
                    return <AutomationCard.Click
                      key={id}
                      position={position}
                      currentStepId={step.id}
                      index={index}
                      button={step.data.button}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'write')
                    return <AutomationCard.Write
                      key={id}
                      position={position}
                      currentStepId={step.id}
                      index={index}
                      text={step.data.text}
                      readFrom={step.data.readFrom}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'parseString')
                    return <AutomationCard.ParseString
                      key={id}
                      position={position}
                      currentStepId={step.id}
                      index={index}
                      parseString={step.data.parseString}
                      readFrom={step.data.readFrom}
                      divider={step.data.divider}
                      saveAs={step.data.saveAs}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'sleep')
                    return <AutomationCard.Sleep
                      key={id}
                      position={position}
                      currentStepId={step.id}
                      index={index}
                      time={step.data.time}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  // statements

                  if (type === 'cycle')
                    return <AutomationCard.Cycle
                      key={id}
                      position={position}
                      currentStepId={step.id}
                      index={index}
                      saveItemsAs={step.data.saveItemsAs}
                      iterable={step.data.iterable}
                      steps={step.data.steps}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'conditional')
                    return <AutomationCard.Conditional
                      key={id}
                      position={position}
                      currentStepId={step.id}
                      index={index}
                      condition={step.data.condition}
                      steps={step.data.steps}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />
                })
              }

              {provided.placeholder}
            </Stack>
          </Box>
        )
      }
    </Droppable>
  )
}
