import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Group,
  Stack,
  Text
} from '@mantine/core'
import {
  IconEdit,
  IconMaximize,
  IconMaximizeOff,
  IconTrash
} from '@tabler/icons-react'
import type {
  ReactElement,
  ReactNode
} from 'react'
import { useNavigate } from 'react-router-dom'
import { Draggable } from '@hello-pangea/dnd'

import type {
  MoveStepData,
  ClickStepData,
  WriteStepData,
  ReadFileStepData,
  ParseStringStepData,
  SleepStepData,
  CycleStepData,
  ConditionalStepData,
  StepData,
  ConditionalStepConditionOperator
} from '../../../../types'
import { ensureCharactersLimit } from '../../../../helpers'

import { StepTypes } from '../../StepTypes'
import { MinorSteps } from './MinorSteps'

type AutomationCardPropsBase = {
  icon: ReactElement
  position: number | string
  title: string
  label?: ReactNode
  currentStepId: StepData['id']
  index: number
  onEdit: () => void
  onRemove: () => void
}

type AutomationCardPropsWithoutSteps = AutomationCardPropsBase & {
  steps?: never
}

type AutomationCardPropsWithSteps = AutomationCardPropsBase & {
  steps: Array<StepData>
}

export type AutomationCardProps =
  AutomationCardPropsWithoutSteps |
  AutomationCardPropsWithSteps

const AutomationCardBase = (props: AutomationCardProps) => {
  const {
    icon,
    position,
    title,
    label,
    currentStepId,
    index,

    steps,

    onEdit,
    onRemove
  } = props

  const navigate = useNavigate()

  const actionIconProps = {
    variant: 'subtle',
    color: 'gray'
  }

  const iconProps = {
    stroke: 1.5
  }

  return (
    <Draggable draggableId={String(currentStepId)} index={index}>
      {provided => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          withBorder
        >
          <Card.Section py='sm' inheritPadding>
            <Group justify='space-between'>
              <Group>
                {icon}

                <Divider orientation='vertical' />

                <Stack gap={1}>
                  <Text fw={500} size='lg'>Passo {position}: {title}</Text>

                  {
                    typeof label === 'string'
                      ? <Text size='sm'>{label}</Text>
                      : label || null
                  }

                  <MinorSteps steps={steps} />
                </Stack>
              </Group>

              <Group>
                {
                  steps
                    ? <ActionIcon {...actionIconProps} onClick={() => navigate(`/automator/${currentStepId}`)}>
                      <IconMaximize {...iconProps} />
                    </ActionIcon>
                    : <ActionIcon {...actionIconProps} disabled>
                      <IconMaximizeOff {...iconProps} />
                    </ActionIcon>
                }

                <ActionIcon {...actionIconProps} onClick={onEdit}>
                  <IconEdit {...iconProps} />
                </ActionIcon>

                <ActionIcon {...actionIconProps} onClick={onRemove}>
                  <IconTrash {...iconProps} />
                </ActionIcon>
              </Group>
            </Group>
          </Card.Section>
        </Card>
      )}
    </Draggable>
  )
}

export namespace AutomationCard {
  const MAX_CHAR_LIMITS = {
    BADGE: 30,
    QUOTE: 50
  }

  const ONE_SECOND_IN_MS = 1000

  // actions

  export const Move = (props: Pick<AutomationCardProps, 'position' | 'onEdit' | 'currentStepId' | 'index' | 'onRemove'> & MoveStepData['data']) => <AutomationCardBase
    icon={<StepTypes.move.icon />}
    title={StepTypes.move.title}
    position={props.position}
    currentStepId={props.currentStepId}
    index={props.index}
    onEdit={props.onEdit}
    onRemove={props.onRemove}
    label={`para a posição x: ${props.x}, y: ${props.y}`}
  />

  export const Click = (props: Pick<AutomationCardProps, 'position' | 'onEdit' | 'currentStepId' | 'index' | 'onRemove'> & ClickStepData['data']) => {
    const {
      position,
      button,
      onEdit,
      onRemove
    } = props

    const MouseButtons: Record<typeof button, string> = {
      left: 'esquerdo',
      right: 'direito',
      middle: 'do meio'
    }

    return (
      <AutomationCardBase
        icon={<StepTypes.click.icon />}
        title={StepTypes.click.title}
        position={position}
        currentStepId={props.currentStepId}
        index={props.index}
        onEdit={onEdit}
        onRemove={onRemove}
        label={`usando o botão ${MouseButtons[button]}`}
      />
    )
  }

  export const Write = (props: Pick<AutomationCardProps, 'position' | 'onEdit' | 'currentStepId' | 'index' | 'onRemove'> & WriteStepData['data']) => <AutomationCardBase
    icon={<StepTypes.write.icon />}
    title={StepTypes.write.title}
    position={props.position}
    currentStepId={props.currentStepId}
    index={props.index}
    onEdit={props.onEdit}
    onRemove={props.onRemove}
    label={
      <Group gap={4}>
        <Text size='sm' style={{ overflow: 'hidden' }}>Escrever {
          props.text.length > 0
            ? <i>&quot;{ensureCharactersLimit(props.text, 100)}&quot;</i>
            : <>o conteúdo armazenado em <Badge color='orange'>{ensureCharactersLimit(props.readFrom, MAX_CHAR_LIMITS.BADGE)}</Badge></>
        }</Text>
      </Group>
    }
  />

  export const ReadFile = (props: Pick<AutomationCardProps, 'position' | 'onEdit' | 'currentStepId' | 'index' | 'onRemove'> & ReadFileStepData['data']) => <AutomationCardBase
    icon={<StepTypes.readFile.icon />}
    title={StepTypes.readFile.title}
    position={props.position}
    currentStepId={props.currentStepId}
    index={props.index}
    onEdit={props.onEdit}
    onRemove={props.onRemove}
    label={
      <Group gap={4}>
        <Text size='sm'>do arquivo <i>&quot;{ensureCharactersLimit(props.filename, MAX_CHAR_LIMITS.QUOTE)}&quot;</i>, e armazenar como</Text> <Badge>{ensureCharactersLimit(props.saveAs, MAX_CHAR_LIMITS.BADGE)}</Badge>
      </Group>
    }
  />

  export const ParseString = (props: Pick<AutomationCardProps, 'position' | 'onEdit' | 'currentStepId' | 'index' | 'onRemove'> & ParseStringStepData['data']) => <AutomationCardBase
    icon={<StepTypes.parseString.icon />}
    title={StepTypes.parseString.title}
    position={props.position}
    currentStepId={props.currentStepId}
    index={props.index}
    onEdit={props.onEdit}
    onRemove={props.onRemove}
    label={
      <Group gap={4}>
        <Text size='sm'>
          {
            props.parseString.length > 0
              ? <>Dividir <i>&quot;{ensureCharactersLimit(props.parseString, MAX_CHAR_LIMITS.QUOTE)}&quot;</i></>
              : <>armazenado em <Badge color='orange'>{props.readFrom}</Badge></>
          }
        </Text>

        <Text size='sm'>por <i>&quot;{ensureCharactersLimit(props.divider, MAX_CHAR_LIMITS.BADGE)}&quot;</i>, e salvar em <Badge>{ensureCharactersLimit(props.saveAs, MAX_CHAR_LIMITS.BADGE)}</Badge></Text>
      </Group>
    }
  />

  export const Sleep = (props: Required<Pick<AutomationCardProps, 'position' | 'onEdit' | 'currentStepId' | 'index' | 'onRemove'>> & SleepStepData['data']) => <AutomationCardBase
    icon={<StepTypes.sleep.icon />}
    title={StepTypes.sleep.title}
    position={props.position}
    currentStepId={props.currentStepId}
    index={props.index}
    onEdit={props.onEdit}
    onRemove={props.onRemove}
    label={`durante ${(props.time / ONE_SECOND_IN_MS).toString().split('.').join(',')} segundo${props.time / ONE_SECOND_IN_MS === 1 ? '' : 's'}`}
  />

  // statements

  export const Cycle = (props: Required<Pick<AutomationCardProps, 'position' | 'onEdit' | 'currentStepId' | 'index' | 'onRemove'>> & CycleStepData['data']) => <AutomationCardBase
    icon={<StepTypes.cycle.icon />}
    title={StepTypes.cycle.title}
    steps={props.steps}
    position={props.position}
    currentStepId={props.currentStepId}
    index={props.index}
    onEdit={props.onEdit}
    onRemove={props.onRemove}
    label={
      <Text size='sm'>
        armazenados na variável <Badge color='orange'>{ensureCharactersLimit(props.iterable, MAX_CHAR_LIMITS.BADGE)}</Badge>,
        e atribuir cada um à variável <Badge color='pink'>{ensureCharactersLimit(props.saveItemsAs, MAX_CHAR_LIMITS.BADGE)}</Badge>
      </Text>
    }
  />

  export const Conditional = (props: Required<Pick<AutomationCardProps, 'position' | 'onEdit' | 'currentStepId' | 'index' | 'onRemove'>> & ConditionalStepData['data']) => {
    const ConditionOperatorLabels: Record<ConditionalStepConditionOperator, string> = {
      equal: 'igual a',
      notEqual: 'diferente d',
      greaterThan: 'maior que ',
      lesserThan: 'menor que ',
      greaterOrEqualThan: 'maior ou igual a',
      lesserOrEqualThan: 'menor ou igual a'
    }

    const conditionLeftSide = props.condition.leftSide.origin === 'value'
      ? <>
        o valor <i>&quot;{ensureCharactersLimit(props.condition.leftSide.value, MAX_CHAR_LIMITS.QUOTE)}&quot;</i>
      </>
      : <>
        o valor da variável <Badge color='orange'>{ensureCharactersLimit(props.condition.leftSide.readFrom, MAX_CHAR_LIMITS.BADGE)}</Badge>
      </>

    const conditionRightSide = props.condition.rightSide.origin === 'value'
      ? <>
        o valor <i>&quot;{ensureCharactersLimit(props.condition.rightSide.value, MAX_CHAR_LIMITS.QUOTE)}&quot;</i>
      </>
      : <>
        o valor da variável <Badge color='orange'>{ensureCharactersLimit(props.condition.rightSide.readFrom, MAX_CHAR_LIMITS.BADGE)}</Badge>
      </>

    return (
      <AutomationCardBase
        icon={<StepTypes.conditional.icon />}
        title={StepTypes.conditional.title}
        position={props.position}
        currentStepId={props.currentStepId}
        steps={props.steps}
        index={props.index}
        onEdit={props.onEdit}
        onRemove={props.onRemove}
        label={
          <>
            <Text size='sm'>caso {conditionLeftSide} seja {ConditionOperatorLabels[props.condition.operator]}{conditionRightSide}</Text>
          </>
        }
      />
    )
  }
}
