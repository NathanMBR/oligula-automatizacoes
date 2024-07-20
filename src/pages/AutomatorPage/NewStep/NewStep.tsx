import {
  Modal,
  Stepper
} from '@mantine/core'
import {
  useContext,
  useEffect,
  useState
} from 'react'

import { AutomationContext } from '../../../providers'
import type { StepData } from '../../../types'

import {
  // actions
  MoveStep,
  ClickStep,
  WriteStep,
  ParseStringStep,
  SleepStep,

  // statements
  CycleStep,
  ConditionalStep,

  // variables
  SetVariableStep,
  DestructVariableStep
} from './Steps'
import { TypeSelection } from './TypeSelection'

export const NewStep = () => {
  const {
    isAddingStep,
    setIsAddingStep,

    editingStep,

    stageIndex,
    setStageIndex
  } = useContext(AutomationContext)

  const [stepType, setStepType] = useState<StepData['type']>(editingStep?.type || 'move')

  const handleClose = () => setIsAddingStep(false)

  useEffect(() => {
    if (isAddingStep && !editingStep) {
      setStageIndex(0)
      setStepType('move')
    }
  }, [isAddingStep])

  useEffect(() => {
    if (editingStep)
      setStepType(editingStep.type)
  }, [editingStep])

  return (
    <Modal
      size='lg'
      opened={isAddingStep}
      onClose={handleClose}
      overlayProps={{ blur: 2.5 }}
      title={editingStep ? 'Editar passo' : 'Novo passo'}
      centered
    >
      <Stepper active={stageIndex}>
        <Stepper.Step label='Selecionar tipo'>
          <TypeSelection
            stepType={stepType}
            setStepType={setStepType}
          />
        </Stepper.Step>

        <Stepper.Step label='Inserir dados'>
          {/* actions */}

          {
            stepType === 'move'
              ? <MoveStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }

          {
            stepType === 'click'
              ? <ClickStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }

          {
            stepType === 'write'
              ? <WriteStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }

          {
            stepType === 'parseString'
              ? <ParseStringStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }

          {
            stepType === 'sleep'
              ? <SleepStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }

          {/* statements */}

          {
            stepType === 'cycle'
              ? <CycleStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }

          {
            stepType === 'conditional'
              ? <ConditionalStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }

          {/* variables */}

          {
            stepType === 'setVariable'
              ? <SetVariableStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }

          {
            stepType === 'destructVariable'
              ? <DestructVariableStep
                onClose={handleClose}
                editingStep={editingStep}
              />
              : null
          }
        </Stepper.Step>
      </Stepper>
    </Modal>
  )
}
