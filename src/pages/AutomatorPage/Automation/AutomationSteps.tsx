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
                      x={step.data.x}
                      y={step.data.y}
                      index={index}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'click')
                    return <AutomationCard.Click
                      key={id}
                      position={position}
                      button={step.data.button}
                      currentStepId={step.id}
                      index={index}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'write')
                    return <AutomationCard.Write
                      key={id}
                      position={position}
                      readFrom={step.data.readFrom}
                      currentStepId={step.id}
                      text={step.data.text}
                      index={index}
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
                      currentStepId={step.id}
                      index={index}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'sleep')
                    return <AutomationCard.Sleep
                      key={id}
                      position={position}
                      currentStepId={step.id}
                      time={step.data.time}
                      index={index}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  // statements

                  if (type === 'cycle')
                    return <AutomationCard.Cycle
                      key={id}
                      position={position}
                      saveItemsAs={step.data.saveItemsAs}
                      iterable={step.data.iterable}
                      steps={step.data.steps}
                      currentStepId={step.id}
                      index={index}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  if (type === 'conditional')
                    return <AutomationCard.Conditional
                      key={id}
                      position={position}
                      condition={step.data.condition}
                      steps={step.data.steps}
                      currentStepId={step.id}
                      index={index}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />

                  // variables

                  if (type === 'setVariable')
                    return <AutomationCard.SetVariable
                      key={id}
                      position={position}
                      saveAs={step.data.saveAs}
                      value={step.data.value}
                      currentStepId={step.id}
                      index={index}
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
