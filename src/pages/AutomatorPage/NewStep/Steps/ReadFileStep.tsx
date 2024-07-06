import {
  FileInput,
  Loader,
  TextInput
} from '@mantine/core'
import {
  IconFileText,
  IconVariable
} from '@tabler/icons-react'
import {
  useContext,
  useState
} from 'react'

import type {
  ReadFileStepData,
  StepDefaultData
} from '../../../../types'
import { AutomationContext } from '../../../../providers'
import { generateRandomID } from '../../../../helpers'
import { useParentId } from '../../../../hooks'

import { StepFinishFooter } from '../StepFinishFooter'

type ReadFileStepPayload = ReadFileStepData & StepDefaultData
export type ReadFileStepProps = {
  onClose: () => void
  editingStep: ReadFileStepPayload | null
}

export const ReadFileStep = (props: ReadFileStepProps) => {
  const {
    onClose,
    editingStep
  } = props

  const [filename, setFilename] = useState(editingStep?.data.filename || '')
  const [saveAs, setSaveAs] = useState(editingStep?.data.saveAs || '')
  const [fileContent, setFileContent] = useState('')
  const [variableError, setVariableError] = useState('')
  const [isReadingFile, setIsReadingFile] = useState(false)

  const parentId = useParentId()

  const {
    addStep,
    editStep,

    hasVariable,
    setVariable
  } = useContext(AutomationContext)

  const allowFinish =
    filename.length > 0 &&
    saveAs.length > 0 &&
    !isReadingFile &&
    variableError === ''

  /* eslint-disable no-console */
  const handleFileChange = (file: File | null) => {
    if (!file)
      return

    setFilename(file.name)

    setIsReadingFile(true)
    file
      .text()
      .then(fileText => setFileContent(fileText))
      .catch(console.error)
      .finally(() => setIsReadingFile(false))
  }
  /* eslint-enable no-console */

  const addReadFileStep = () => {
    if (hasVariable(saveAs))
      return setVariableError('Nome de variável já utilizado')

    const id = editingStep?.id || generateRandomID()

    const readFileStepPayload: ReadFileStepPayload = {
      id,
      type: 'readFile',
      data: {
        filename: filename,
        saveAs: saveAs
      }
    }

    if (editingStep)
      editStep(editingStep.id, readFileStepPayload)
    else
      addStep(readFileStepPayload, parentId)

    setVariable(saveAs, {
      ownerId: id,
      value: fileContent
    })

    onClose()
  }

  return (
    <>
      <FileInput
        label='Selecione o arquivo'
        placeholder='Clique para selecionar'
        pb='lg'
        disabled={isReadingFile}
        onChange={handleFileChange}
        leftSection={isReadingFile ? <Loader size={16}/> : <IconFileText stroke={1.5} />}
        clearable
      />

      <TextInput
        label='Salvar como'
        placeholder='Digite o nome da variável em que o texto será salvo'
        error={variableError}
        leftSection={<IconVariable stroke={1.5} />}
        onChange={
          event => {
            setSaveAs(event.currentTarget.value)
            setVariableError('')
          }
        }
      />

      <StepFinishFooter
        addStep={addReadFileStep}
        allowFinish={allowFinish}
      />
    </>
  )
}
