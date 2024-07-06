import {
  Button,
  Code,
  Text,
  TextInput
} from '@mantine/core'
import {
  useContext,
  useState
} from 'react'
import { fs } from '@tauri-apps/api'

import { AutomationContext } from '../../../providers'
import { slugifyText } from '../../../helpers'

import type { StoredAutomation } from './StoredAutomation'

export type SaveAutomationProps = {
  handleClose: () => void
}

export const SaveAutomation = (props: SaveAutomationProps) => {
  const { handleClose } = props
  const { BaseDirectory } = fs

  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState(false)

  const {
    steps,
    variables
  } = useContext(AutomationContext)

  const defaultFilename = 'automation'
  const slugifiedTitle = slugifyText(title)
  const filename = slugifiedTitle || defaultFilename

  const handleFileSave = async () => {
    const filenameWithFormat = `${filename}.json`
    const filePath = `automations/${filenameWithFormat}`

    const doesFileAlreadyExist = await fs.exists(filePath, { dir: BaseDirectory.AppData })
    if (doesFileAlreadyExist)
      return setTitleError(true)

    const storedAutomation: StoredAutomation = {
      meta: {
        title: title || 'Sem título',
        createdAt: new Date().toISOString()
      },

      data: {
        steps,
        variables
      }
    }

    await fs.writeTextFile(
      { path: filePath, contents: JSON.stringify(storedAutomation, null, 2) },
      { dir: BaseDirectory.AppData }
    )

    handleClose()
  }

  return (
    <>
      <TextInput
        value={title}
        error={titleError}
        label='Título'
        placeholder='Digite um título'
        onChange={event => {
          setTitle(event.target.value)

          if (titleError)
            setTitleError(false)
        }}
      />

      {
        titleError
          ? <Text
            size='xs'
            mt='xs'
            c='var(--mantine-color-error)'
          >
            O arquivo <Code>{filename}.json</Code> já existe
          </Text>
          : <Text
            size='xs'
            mt='xs'
          >
            O arquivo será salvo como <Code>{filename}.json</Code>
          </Text>
      }

      <Button
        mt='md'
        onClick={handleFileSave}
        fullWidth
      >
        Salvar
      </Button>
    </>
  )
}
