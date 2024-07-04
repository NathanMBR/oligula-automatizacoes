import {
  Card,
  Center,
  Loader,
  ScrollArea,
  Stack,
  Text
} from '@mantine/core'
import {
  useEffect,
  useState
} from 'react'
import { fs } from '@tauri-apps/api'

import { parseStoredAutomation } from './parseStoredAutomation'
import type { StoredAutomation } from '../StoredAutomation'

export const LoadAutomation = () => {
  const { BaseDirectory } = fs

  type StoredAutomationWithFilename = StoredAutomation & {
    meta: {
      filename: string
    }
  }

  const [isLoading, setIsLoading] = useState(true)
  const [automations, setAutomations] = useState<Array<StoredAutomationWithFilename>>([])

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

        const storedAutomations = await fs.readDir(
          'automations',
          {
            recursive: true,
            dir: BaseDirectory.AppData
          }
        )

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
        /* eslint-disable no-console */
        console.error('Failed to load stored automations:', error)
        console.error(error)
        /* eslint-enable no-console */
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
        automations.length >= 0
          ? <ScrollArea
            h={spacingHeight}
            scrollHideDelay={250}
            scrollbarSize={5}
          >
            <Stack>
              {
                automations.map(
                  automation => <Card key={automation.meta.filename}>
                    <Text size='lg' fw={700}>{automation.meta.title}</Text>
                    <Text size='sm'>Arquivo <i>&ldquo;{automation.meta.filename}&rdquo;</i></Text>
                    <Text size='sm'>{automation.data.steps.length} {automation.data.steps.length === 1 ? 'passo' : 'passos'}</Text>
                    <Text size='xs' fs='italic' c='grey'>{formatDateAndTime(new Date(automation.meta.createdAt))}</Text>
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
