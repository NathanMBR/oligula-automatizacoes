type VariableData = {
  ownerId: number
  type: 'value' | 'list'
  value: unknown
}

export type Variables = Record<string, VariableData>
