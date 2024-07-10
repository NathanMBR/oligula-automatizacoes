import {
  type Icon,
  IconMouse2,
  IconPointer,
  IconPencil,
  IconFileText,
  IconScissors,
  IconHourglass,
  IconRotateClockwise
} from '@tabler/icons-react'

import type { StepData } from '../../types'

export type StepTypesModel = Record<StepData['type'], {
  title: string
  icon: Icon
}>

export const StepTypes = {
  // actions
  move: {
    title:'Mover o mouse',
    icon: IconMouse2
  },

  click: {
    title: 'Clicar com o mouse',
    icon: IconPointer
  },

  write: {
    title:'Inserir dado',
    icon: IconPencil
  },

  readFile: {
    title: 'Ler dados de um arquivo',
    icon: IconFileText
  },

  parseString: {
    title: 'Dividir texto',
    icon: IconScissors
  },

  sleep: {
    title: 'Esperar',
    icon: IconHourglass
  },

  // statements
  cycle: {
    title: 'Repetir passos para vários valores',
    icon: IconRotateClockwise
  }
} as const satisfies StepTypesModel
