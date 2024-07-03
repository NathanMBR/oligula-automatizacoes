import { appWindow } from '@tauri-apps/api/window'
import { useEffect } from 'react'

import {
  Navbar,
  Header
} from '../../layouts'

export const InmetroSealGeneratorPage = () => {
  useEffect(() => {
    appWindow.setTitle('Oligula Automatizações | Gerador de selo Inmetro')
  }, [])

  return (
    <Navbar selectedOption='Gerador de selo Inmetro'>
      <Header>
        <p>Teste</p>
      </Header>
    </Navbar>
  )
}
