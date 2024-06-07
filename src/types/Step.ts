export type MoveStepData = {
  type: 'move'
  data: {
    x: number
    y: number
  }
}

export type ClickStepData = {
  type: 'click'
  data: {
    button: 'left' | 'right' | 'middle'
  }
}

export type WriteStepData = {
  type: 'write'
  data: {
    text: string
    readFrom: string
  }
}

export type ReadFileStepData = {
  type: 'readFile'
  data: {
    filename: string
    saveAs: string
  }
}

export type ParseStringStepData = {
  type: 'parseString'
  data: {
    parseString: string
    readFrom: string
    divider: string
    saveAs: string
  }
}

type ActionUnion =
  MoveStepData |
  ClickStepData |
  WriteStepData |
  ReadFileStepData |
  ParseStringStepData

export interface CycleStepData {
  type: 'cycle'
  data: {
    iterable: string
    steps: Array<ActionUnion | CycleStepData>
  }
}

type StepUnion =
  ActionUnion |
  CycleStepData

export type StepData = {
  id: number
} & StepUnion

export const StepTypesTitles: Record<StepData['type'], string> = {
  move: 'Mover o mouse',
  click: 'Clicar com o mouse',
  write: 'Inserir dado',
  readFile: 'Ler dados de um arquivo',
  parseString: 'Dividir texto',
  cycle: 'Repetir passos para vários valores'
}
