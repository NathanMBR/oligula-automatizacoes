import {
  Button,
  Group
} from '@mantine/core'
import { useContext } from 'react'

import { AutomationContext } from '../../../providers'

export type StepFinishFooterProps = {
  allowFinish: boolean
  addStep: () => void
}

export const StepFinishFooter = (props: StepFinishFooterProps) => {
  const {
    allowFinish,
    addStep
  } = props

  const {
    setStageIndex,

    editingStep
  } = useContext(AutomationContext)

  return (
    <Group justify='end' mt='md'>
      <Button variant='default' onClick={() => setStageIndex(0)}>Voltar</Button>

      <Button disabled={!allowFinish} onClick={addStep}>
        {
          editingStep
            ? 'Editar'
            : 'Adicionar'
        }
      </Button>
    </Group>
  )
}
