import {
  Modal,
  Title,
  Transition
} from '@mantine/core'
import {
  useContext,
  useState,
  type ReactElement
} from 'react'

import { PreloadContext } from '../../providers'

import { AvailableBody } from './AvailableBody'
import { UpdatingBody } from './UpdatingBody'
import { SuccessBody } from './SuccessBody'
import { FailureBody } from './FailureBody'

export type UpdateModalProps = {
  isOpenExternally?: boolean
  setIsOpenExternally?: (isOpen: boolean) => void
}

export const UpdateModal = (props: UpdateModalProps) => {
  type UpdateState =
    'AVAILABLE' |
    'UPDATING' |
    'SUCCESS' |
    'FAILURE'

  const {
    isOpenExternally = false,
    setIsOpenExternally
  } = props

  const { app } = useContext(PreloadContext)

  const [isOpen, setIsOpen] = useState(app.update.available && app.settings.data.showUpdateNotification)
  const [updateState, setUpdateState] = useState<UpdateState>('AVAILABLE')

  const handleClose = () => {
    if (setIsOpenExternally)
      setIsOpenExternally(false)

    setIsOpen(false)
  }

  const handleUpdate = () => {
    setUpdateState('UPDATING')

    app.update.execute()
      .then(success => setUpdateState(success ? 'SUCCESS' : 'FAILURE'))
  }

  const isUpdating = updateState === 'UPDATING'

  const modalBodies: Record<UpdateState, ReactElement> = {
    AVAILABLE: <AvailableBody
      handleClose={handleClose}
      handleUpdate={handleUpdate}
    />,

    UPDATING: <UpdatingBody />,

    SUCCESS: <SuccessBody handleClose={handleClose} />,

    FAILURE: <FailureBody handleClose={handleClose} />
  }

  return (
    <Modal.Root
      opened={isOpen || isOpenExternally}
      onClose={handleClose}
      closeOnEscape={!isUpdating}
      closeOnClickOutside={!isUpdating}
      centered
    >
      <Modal.Overlay blur={2.5} />

      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <Title order={3}>Atualização disponível</Title>
          </Modal.Title>

          <Transition mounted={!isUpdating}>
            {
              styles => <Modal.CloseButton style={styles} disabled={isUpdating} />
            }
          </Transition>
        </Modal.Header>

        <Modal.Body>
          {
            modalBodies[updateState]
          }
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}
