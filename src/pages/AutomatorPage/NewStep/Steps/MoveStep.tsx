import {
  Button,
  Divider,
  Group,
  NumberInput,
  Stack,
  Text
} from '@mantine/core'
import {
  IconAlertCircle,
  IconPlayerRecordFilled
} from '@tabler/icons-react'
import {
  invoke,
  notification,
  path,
  window as tauriWindow
} from '@tauri-apps/api'
import {
  useContext,
  useState
} from 'react'

import type {
  MousePosition,
  MoveStepData,
  StepDefaultData
} from '../../../../types'
import {
  checkMousePositionEquality,
  generateRandomID,
  sleep
} from '../../../../helpers'
import { AutomationContext } from '../../../../providers'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

const MOUSE_SAMPLES = 5
const SLEEP_TIME_IN_MS = 1_000

type MoveStepPayload = MoveStepData & StepDefaultData
export type MoveStepProps = {
  onClose: () => void
  editingStep: MoveStepPayload | null
}

export const MoveStep = (props: MoveStepProps) => {
  const {
    onClose,
    editingStep
  } = props
  const { appWindow } = tauriWindow

  const [mousePosition, setMousePosition] = useState(editingStep?.data || { x: -1, y: -1 })
  const [isCapturingMousePosition, setIsCapturingMousePosition] = useState(false)
  const [positionError, setPositionError] = useState('')

  const {
    addStep,
    editStep
  } = useContext(AutomationContext)

  const parentId = useParentId()

  const allowFinish =
    !Number.isNaN(mousePosition.x) &&
    !Number.isNaN(mousePosition.y) &&
    mousePosition.x >= 0 &&
    mousePosition.y >= 0 &&
    !isCapturingMousePosition &&
    !positionError

  const handleMousePositionCapture = async () => {
    const mousePositions: Array<MousePosition> = []

    setIsCapturingMousePosition(true)
    await appWindow.minimize()

    /* eslint-disable no-await-in-loop */
    while (mousePositions.length < MOUSE_SAMPLES || !checkMousePositionEquality(mousePositions)) {
      await sleep(SLEEP_TIME_IN_MS)

      if (mousePositions.length >= MOUSE_SAMPLES)
        mousePositions.shift()

      const mousePosition = await invoke<MousePosition>('get_mouse_position')
      mousePositions.push(mousePosition)
    }
    /* eslint-enable no-await-in-loop */

    const capturedMousePosition = mousePositions[0]!
    setMousePosition(capturedMousePosition)
    setPositionError('')

    const isWindowMinimized = await appWindow.isMinimized()
    if (isWindowMinimized) {
      const isNotificationPermissionGranted = await notification.isPermissionGranted()
      if (isNotificationPermissionGranted) {
        const icon = await path.resolveResource('128x128.png')

        notification.sendNotification({
          title: 'Captura do mouse concluída',
          body: `Posição X: ${capturedMousePosition.x}, Y: ${capturedMousePosition.y}`,
          icon
        })
      }

      await appWindow.unminimize()
    }

    setIsCapturingMousePosition(false)
  }

  const addMoveStep = async () => {
    const isPositionValid = await invoke<boolean>(
      'check_mouse_position',
      { position: mousePosition }
    )

    if (!isPositionValid)
      return setPositionError('Posição fora dos limites da tela')

    const moveStepPayload: MoveStepPayload = {
      id: editingStep?.id || generateRandomID(),
      type: 'move',
      data: mousePosition
    }

    if (editingStep)
      editStep(editingStep.id, moveStepPayload)
    else
      addStep(moveStepPayload, parentId)

    onClose()
  }

  return (
    <>
      <Stack justify='space-between'>
        <Group grow>
          <NumberInput
            label='Posição X'
            placeholder='(vazio)'
            clampBehavior='strict'
            min={0}
            allowDecimal={false}
            allowNegative={false}
            error={!!positionError}
            value={mousePosition.x >= 0 ? mousePosition.x : undefined}
            onChange={value => {
              setMousePosition({ ...mousePosition, x: Number(value) })
              setPositionError('')
            }}
          />

          <NumberInput
            label='Posição Y'
            placeholder='(vazio)'
            clampBehavior='strict'
            min={0}
            allowDecimal={false}
            allowNegative={false}
            error={!!positionError}
            value={mousePosition.y >= 0 ? mousePosition.y : undefined}
            onChange={value => {
              setMousePosition({ ...mousePosition, y: Number(value) })
              setPositionError('')
            }}
          />
        </Group>

        {
          positionError
            ? <Group justify='center' gap={8}>
              <IconAlertCircle size={16} color='var(--mantine-color-error)' />

              <Text
                fw={500}
                size='sm'
                ta='center'
                c='var(--mantine-color-error)'
              >{positionError}</Text>
            </Group>
            : null
        }

        <Divider label='ou' />

        <Button
          variant='default'
          onClick={handleMousePositionCapture}
          disabled={isCapturingMousePosition}
        >
          {
            isCapturingMousePosition
              ? <Group gap={4}>
                <IconPlayerRecordFilled color='#f00' size={20} />
                <span>Capturando...</span>
              </Group>
              : <>
                Capturar posição do mouse
              </>
          }
        </Button>

        <Text size='xs' ta='center'>
          Ao iniciar a captura, o programa será minimizado. <br />
          Movimente o mouse até o local desejado e não o mova até que o programa conclua a captura.
        </Text>
      </Stack>

      <StepFinishFooter
        allowFinish={allowFinish}
        addStep={addMoveStep}
      />
    </>
  )
}
