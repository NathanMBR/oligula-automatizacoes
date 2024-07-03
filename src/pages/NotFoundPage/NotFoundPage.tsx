import {
  Button,
  Group,
  Container,
  Title,
  Text
} from '@mantine/core'
import { appWindow } from '@tauri-apps/api/window'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Navbar } from '../../layouts'
import { NotFoundIllustration } from './NotFoundIllustration'

import classes from './NotFoundPage.module.css'

export const NotFoundPage = () => {
  useEffect(() => {
    appWindow.setTitle('Oligula Automatizações')
  }, [])

  return (
    <Navbar>
      <Container className={classes.root}>
        <div className={classes.inner}>
          <NotFoundIllustration className={classes.image} />
          <div className={classes.content}>
            <Title className={classes.title}>Não encontrado</Title>
            <Text c="dimmed" size="lg" ta="center" className={classes.description} style={{ marginTop: 32, marginBottom: 48 }}>
              A seção que você tentou acessar não foi encontrada.
            </Text>
            <Group justify="center">
              <Link to='/'>
                <Button size="md">Voltar ao início</Button>
              </Link>
            </Group>
          </div>
        </div>
      </Container>
    </Navbar>
  )
}
