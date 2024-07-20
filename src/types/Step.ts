/* eslint-disable no-use-before-define */
export type StepDefaultData = {
  id: number
}

export type StepData =
  MoveStepData |
  ClickStepData |
  WriteStepData |
  ParseStringStepData |
  SleepStepData |
  CycleStepData |
  ConditionalStepData |
  SetVariableStepData |
  DestructVariableStepData

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

export type ConditionalStepConditionOperator =
  'equal' |
  'notEqual' |
  'greaterThan' |
  'lesserThan' |
  'greaterOrEqualThan' |
  'lesserOrEqualThan'

type ConditionalStepConditionSide = {
  origin: 'variable'
  readFrom: string
} | {
  origin: 'value'
  value: string
}

type ConditionalStepCondition = {
  leftSide: ConditionalStepConditionSide
  operator: ConditionalStepConditionOperator
  rightSide: ConditionalStepConditionSide
}

export type ConditionalStepData = StepDefaultData & {
  type: 'conditional'
  data: {
    condition: ConditionalStepCondition
    steps: Array<StepData>
  }
}

// variables

export type SetVariableStepData = StepDefaultData & {
  type: 'setVariable'
  data: {
    value: string
    saveAs: string
  }
}

export type DestructVariableStepData = StepDefaultData & {
  type: 'destructVariable'
  data: {
    readFrom: string
    index: number
    saveAs: string
  }
}
