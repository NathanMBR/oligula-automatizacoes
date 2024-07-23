import {
  Fieldset,
  Group,
  Kbd,
  Stack
} from '@mantine/core'
import {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import type {
  PressKeyboardStepData,
  StepData
} from '../../../../types'
import {
  KeyboardCombination,
  RecordButton
} from '../../../../components'
import { AutomationContext } from '../../../../providers'
import { useParentId } from '../../../../hooks'
import { generateRandomID } from '../../../../helpers'

import { StepFinishFooter } from '../StepFinishFooter'

export type PressKeyboardStepProps = {
  onClose: () => void
  editingStep: StepData | null
}

export const PressKeyboardStep = (props: PressKeyboardStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const {
    addStep,
    editStep
  } = useContext(AutomationContext)

  const [keyCode, setKeyCode] = useState(editingStep?.type === 'pressKeyboard' ? editingStep.data.keyCode : -1)
  const [keyName, setKeyName] = useState(editingStep?.type === 'pressKeyboard' ? editingStep.data.keyName : '')
  const [holdCtrl, setHoldCtrl] = useState(editingStep?.type === 'pressKeyboard' ? editingStep.data.holdCtrl : false)
  const [holdShift, setHoldShift] = useState(editingStep?.type === 'pressKeyboard' ? editingStep.data.holdShift : false)
  const [holdAlt, setHoldAlt] = useState(editingStep?.type === 'pressKeyboard' ? editingStep.data.holdAlt : false)
  const [isRecording, setIsRecording] = useState(false)

  const parentId = useParentId()

  const allowFinish =
  keyCode >= 0 &&
  !isRecording

  const keysToIgnore = [
    'Control',
    'Shift',
    'Alt',
    'Meta'
  ]

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault()

    const {
      keyCode: pressedKeyCode,
      key: pressedKeyName,
      ctrlKey,
      shiftKey,
      altKey
    } = event

    if (keysToIgnore.includes(pressedKeyName))
      return

    setKeyCode(pressedKeyCode)
    setKeyName(pressedKeyName)
    setHoldCtrl(ctrlKey)
    setHoldShift(shiftKey)
    setHoldAlt(altKey)
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    event.preventDefault()

    const { key: releasedKeyName } = event

    if (keysToIgnore.includes(releasedKeyName))
      return

    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)

    setIsRecording(false)
  }, [])

  const handleKeyboardRecording = () => {
    setIsRecording(true)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  }

  const addPressKeyboardStep = () => {
    const pressKeyboardStepPayload: PressKeyboardStepData = {
      id: editingStep?.id || generateRandomID(),
      type: 'pressKeyboard',
      data: {
        holdCtrl,
        holdShift,
        holdAlt,
        keyCode,
        keyName
      }
    }

    if (editingStep)
      editStep(editingStep.id, pressKeyboardStepPayload)
    else
      addStep(pressKeyboardStepPayload, parentId)

    onClose()
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <>
      <Stack justify='space-between'>
        <Fieldset legend='Teclas'>
          <Group gap='xs' justify='center'>
            {
              keyCode < 0
                ? <Kbd>
                  {
                    isRecording
                      ? 'Pressione uma tecla, ou uma combinação de teclas...'
                      : 'Inicie a captura no botão abaixo'
                  }
                </Kbd>
                : null
            }

            <KeyboardCombination
              ctrl={holdCtrl}
              shift={holdShift}
              alt={holdAlt}
              keyName={keyName}
            />
          </Group>
        </Fieldset>

        <RecordButton
          isRecording={isRecording}
          onClick={handleKeyboardRecording}
          buttonProps={{ fullWidth: true }}
        >
          Capturar teclas do teclado
        </RecordButton>
      </Stack>

      <StepFinishFooter
        allowFinish={allowFinish}
        addStep={addPressKeyboardStep}
      />
    </>
  )
}
