import {
  ActionIcon,
  Box,
  Card,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text
} from '@mantine/core'
import {
  IconTrash,
  IconUpload
} from '@tabler/icons-react'
import {
  useContext,
  useEffect,
  useState
} from 'react'
import { fs } from '@tauri-apps/api'

import { AutomationContext } from '../../../../providers'
import { handleCatchError } from '../../../../helpers'

import { parseStoredAutomation } from './parseStoredAutomation'
import type { StoredAutomation } from '../StoredAutomation'

type StoredAutomationWithFilename = StoredAutomation & {
  meta: {
    filename: string
  }
}

type LoadAutomationProps = {
  handleClose: () => void
}

export const LoadAutomation = (props: LoadAutomationProps) => {
  const { handleClose } = props
  const { BaseDirectory } = fs

  const [isLoading, setIsLoading] = useState(true)
  const [automations, setAutomations] = useState<Array<StoredAutomationWithFilename>>([])

  const {
    setSteps,
    setVariables
  } = useContext(AutomationContext)

  const spacingHeight = 256

  const formatDateAndTime = (date: Date) => {
    const dateFormatter = new Intl.DateTimeFormat('pt-br', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    const timeFormatter = new Intl.DateTimeFormat('pt-br', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    return `Salvo em ${dateFormatter.format(date)} às ${timeFormatter.format(date)}`
  }

  const setAutomation = (index: number) => {
    const automation = automations[index]

    if (!automation)
      return

    setSteps(automation.data.steps)
    setVariables(automation.data.variables)
    handleClose()
  }

  const deleteAutomation = (filename: string) => {
    fs.removeFile(`automations/${filename}`, { dir: BaseDirectory.AppData })
      .then(() => {
        const updatedAutomations = automations.filter(automation => automation.meta.filename !== filename)

        setAutomations(updatedAutomations)
      })
  }

  useEffect(() => {
    const loadStoredAutomations = async () => {
      try {
        const doesPathExists = await fs.exists('automations', { dir: BaseDirectory.AppData })
        if (!doesPathExists)
          await fs.createDir(
            'automations',
            {
              recursive: true,
              dir: BaseDirectory.AppData
            }
          )

        // reads both files and directories - needs to be filtered
        const storedAutomationsRaw = await fs.readDir(
          'automations',
          {
            recursive: false,
            dir: BaseDirectory.AppData
          }
        )

        const storedAutomations = storedAutomationsRaw.filter(storedAutomation => !('children' in storedAutomation))

        const rawAutomations = await Promise.all(
          storedAutomations.map(
            automation => fs.readTextFile(automation.path)
          )
        )

        const automations = rawAutomations
          .map((rawAutomation, index) => {
            const automation = parseStoredAutomation(rawAutomation)
            if (automation === null)
              return null

            return {
              ...automation,
              meta: {
                ...automation.meta,
                filename: storedAutomations[index]!.name!
              }
            }
          })
          .filter(automation => automation !== null)
          .sort(
            (previous, next) => new Date(previous!.meta.createdAt).getTime() - new Date(next!.meta.createdAt).getTime()
          ) as Array<StoredAutomationWithFilename>

        setAutomations(automations)
      } catch (error) {
        handleCatchError(error, 'Failed to load stored automations:')
      }
    }

    loadStoredAutomations()
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading)
    return <Center h={spacingHeight}>
      <Loader size={20} />
    </Center>

  return (
    <>
      {
        automations.length > 0
          ? <ScrollArea
            h={spacingHeight}
            scrollHideDelay={250}
            scrollbarSize={5}
          >
            <Stack>
              {
                automations.map(
                  (automation, index) => <Card key={automation.meta.filename}>
                    <Group justify='space-between'>
                      <Box>
                        <Text size='lg' fw={700}>{automation.meta.title}</Text>
                        <Text size='sm'>Arquivo <i>&ldquo;{automation.meta.filename}&rdquo;</i></Text>
                        <Text size='sm'>{automation.data.steps.length} {automation.data.steps.length === 1 ? 'passo' : 'passos'}</Text>
                        <Text size='xs' fs='italic' c='grey'>{formatDateAndTime(new Date(automation.meta.createdAt))}</Text>
                      </Box>

                      <Group>
                        <ActionIcon
                          color='gray'
                          variant='subtle'
                          onClick={() => setAutomation(index)}
                        >
                          <IconUpload size={20} stroke={1.5} />
                        </ActionIcon>

                        <ActionIcon
                          color='gray'
                          variant='subtle'
                          onClick={() => deleteAutomation(automation.meta.filename)}
                        >
                          <IconTrash size={20} stroke={1.5} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                )
              }
            </Stack>
          </ScrollArea>
          : <Center h={spacingHeight}>
            <Text c='grey'>Nenhuma automação salva</Text>
          </Center>
      }
    </>
  )
}
