import {
  Box,
  Center,
  Image,
  Stack,
  Title
} from '@mantine/core'
import { appWindow } from '@tauri-apps/api/window'
import { useEffect } from 'react'

import { Navbar } from '../../layouts'

import classes from './HomePage.module.css'

export const HomePage = () => {
  useEffect(() => {
    appWindow.setTitle('Oligula Automatizações | Início')
  }, [])

  return (
    <Navbar>
      <Center h='95vh'>
        <Stack gap={32} justify='space-between'>
          <Title order={1} ta='center'>Oligula Automatizações</Title>
          <Box className={classes.logoContainer}>
            <Image
              src='logo-redonda-oligula.png'
              alt='Logo Oligula Redonda'
              className={classes.logo}
            />
          </Box>
        </Stack>
      </Center>
    </Navbar>
  )
}
