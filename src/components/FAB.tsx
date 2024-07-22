import {
  type ActionIconProps as MantineActionIconProps,
  ActionIcon,
  Affix,
  Paper,
  Transition
} from '@mantine/core'
import type { ReactElement } from 'react'

type Position = {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export type FABProps = {
  onClick?: () => void
  icon: ReactElement
  hidden?: boolean
  position?: Position
  ActionIconProps?: MantineActionIconProps
}

export const FAB = (props: FABProps) => {
  const {
    onClick,
    icon,
    hidden,
    position = {},
    ActionIconProps = {}
  } = props

  const defaultPosition: Position = {
    bottom: 32,
    right: 32
  }

  const defaultActionIconProps: MantineActionIconProps = {
    variant: 'default',
    size: 'xl',
    radius: 'xl'
  }

  return (
    <Affix
      position={{ ...defaultPosition, ...position }}
      onClick={onClick}
    >
      <Transition
        transition='slide-up'
        timingFunction='ease'
        duration={400}
        mounted={!hidden}
      >
        {
          transitionStyle => <Paper
            shadow='sm'
            radius={ActionIconProps.radius || defaultActionIconProps.radius}
            style={transitionStyle}
          >
            <ActionIcon {...defaultActionIconProps} {...ActionIconProps}>
              {icon}
            </ActionIcon>
          </Paper>
        }
      </Transition>
    </Affix>
  )
}
