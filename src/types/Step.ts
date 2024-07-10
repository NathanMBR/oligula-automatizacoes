/* eslint-disable no-use-before-define */
export type StepDefaultData = {
  id: number
}

export type StepData = StepDefaultData & (
  MoveStepData |
  ClickStepData |
  WriteStepData |
  ReadFileStepData |
  ParseStringStepData |
  SleepStepData |
  CycleStepData
)

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

export type SleepStepData = {
  type: 'sleep'
  data: {
    time: number
  }
}

export type CycleStepData = {
  type: 'cycle'
  data: {
    iterable: string
    saveItemsAs: string
    steps: Array<StepData>
  }
}
