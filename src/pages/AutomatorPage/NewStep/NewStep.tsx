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
  ReadFileStep,
  ParseStringStep,
  SleepStep,

  // statements
  CycleStep
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

  const modalTitle = editingStep ? 'Editar passo' : 'Novo passo'

  return (
    <Modal
      size='lg'
      title={modalTitle}
      opened={isAddingStep}
      onClose={handleClose}
      overlayProps={{ blur: 2.5 }}
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
                editingStep={editingStep?.type === 'move' ? editingStep : null}
              />
              : null
          }

          {
            stepType === 'click'
              ? <ClickStep
                onClose={handleClose}
                editingStep={editingStep?.type === 'click' ? editingStep : null}
              />
              : null
          }

          {
            stepType === 'write'
              ? <WriteStep
                onClose={handleClose}
                editingStep={editingStep?.type === 'write' ? editingStep : null}
              />
              : null
          }

          {
            stepType === 'readFile'
              ? <ReadFileStep
                onClose={handleClose}
                editingStep={editingStep?.type === 'readFile' ? editingStep : null}
              />
              : null
          }

          {
            stepType === 'parseString'
              ? <ParseStringStep
                onClose={handleClose}
                editingStep={editingStep?.type === 'parseString' ? editingStep : null}
              />
              : null
          }

          {
            stepType === 'sleep'
              ? <SleepStep
                onClose={handleClose}
                editingStep={editingStep?.type === 'sleep' ? editingStep : null}
              />
              : null
          }

          {/* statements */}

          {
            stepType === 'cycle'
              ? <CycleStep
                onClose={handleClose}
                editingStep={editingStep?.type === 'cycle' ? editingStep : null}
              />
              : null
          }
        </Stepper.Step>
      </Stepper>
    </Modal>
  )
}
