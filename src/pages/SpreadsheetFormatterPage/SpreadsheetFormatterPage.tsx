import { appWindow } from '@tauri-apps/api/window'
import { useEffect } from 'react'

import {
  Navbar,
  Header
} from '../../layouts'

export const SpreadsheetFormatterPage = () => {
  useEffect(() => {
    appWindow.setTitle('Oligula Automatizações | Formatador de planilhas')
  }, [])

  return (
    <Navbar selectedOption='Formatador de planilhas'>
      <Header>
        <p>Teste</p>
      </Header>
    </Navbar>
  )
}
