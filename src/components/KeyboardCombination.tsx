import { Group, Kbd } from '@mantine/core'

export type KeyboardCombinationProps = {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  keyName: string // calling it just 'key' would conflict with react key prop for lists
}

export const KeyboardCombination = (props: KeyboardCombinationProps) => {
  const {
    ctrl,
    shift,
    alt,
    keyName
  } = props

  return (
    <Group gap='xs' justify='center'>
      {
        ctrl
          ? <>
            <Kbd>Ctrl</Kbd>

            {
              shift || alt || keyName !== ''
                ? '+'
                : null
            }
          </>
          : null
      }

      {
        shift
          ? <>
            <Kbd>Shift</Kbd>

            {
              alt || keyName !== ''
                ? '+'
                : null
            }
          </>
          : null
      }

      {
        alt
          ? <>
            <Kbd>Alt</Kbd>

            {
              keyName !== ''
                ? '+'
                : null
            }
          </>
          : null
      }

      {
        !!keyName
          ? <Kbd>
            {
              keyName.length === 1
                ? keyName.toUpperCase()
                : keyName
            }
          </Kbd>
          : null
      }
    </Group>
  )
}
