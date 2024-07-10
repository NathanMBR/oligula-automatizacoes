/* eslint-disable no-use-before-define */
export type StepDefaultData = {
  id: number
}

export type StepData =
  MoveStepData |
  ClickStepData |
  WriteStepData |
  ReadFileStepData |
  ParseStringStepData |
  SleepStepData |
  CycleStepData

// actions

export type MoveStepData = StepDefaultData & {
  type: 'move'
  data: {
    x: number
    y: number
  }
}

export type ClickStepData = StepDefaultData & {
  type: 'click'
  data: {
    button: 'left' | 'right' | 'middle'
  }
}

export type WriteStepData = StepDefaultData & {
  type: 'write'
  data: {
    text: string
    readFrom: string
  }
}

export type ReadFileStepData = StepDefaultData & {
  type: 'readFile'
  data: {
    filename: string
    saveAs: string
  }
}

export type ParseStringStepData = StepDefaultData & {
  type: 'parseString'
  data: {
    parseString: string
    readFrom: string
    divider: string
    saveAs: string
  }
}

export type SleepStepData = StepDefaultData & {
  type: 'sleep'
  data: {
    time: number
  }
}

// statements

export type CycleStepData = StepDefaultData & {
  type: 'cycle'
  data: {
    iterable: string
    saveItemsAs: string
    steps: Array<StepData>
  }
}
