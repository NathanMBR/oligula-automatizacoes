import type {
  StepData,
  Variables
} from '../../../types'

export type StoredAutomation = {
  meta: {
    title: string
    createdAt: string
  }

  data: {
    steps: Array<StepData>
    variables: Variables
  }
}
