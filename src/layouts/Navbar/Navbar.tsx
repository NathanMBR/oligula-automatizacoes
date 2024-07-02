import {
  AppShell,
  Box,
  Code,
  Group,
  Text
} from '@mantine/core'
import {
  type PropsWithChildren,
  useContext
} from 'react'
import { Link } from 'react-router-dom'

import {
  PreloadContext,
  HeaderContext
} from '../../providers'

import {
  type NavbarItemsLabels,
  navbarItems
} from './navbarItems'
import { ThemeSwitch } from './ThemeSwitch'
import { Settings } from './Settings'

import classes from './Navbar.module.css'

export type NavbarProps = {
  selectedOption?: NavbarItemsLabels
} & Required<PropsWithChildren>

export const Navbar = (props: NavbarProps) => {
  const {
    children,
    selectedOption
  } = props

  const preloadData = useContext(PreloadContext)
  const {
    setPageTitle,
    setPageSubtitle
  } = useContext(HeaderContext)

  return (
    <AppShell
      padding='md'
      navbar={{
        breakpoint: 'sm',
        width: 300
      }}
    >
      <AppShell.Navbar>
        <nav className={classes.navbar}>
          <div className={classes.navbarMain}>
            <Group className={classes.header} justify='space-between'>
              <Link to='/' onClick={() => {
                setPageTitle('')
                setPageSubtitle('')
              }} className={classes.headerLink}>
                <Text size='lg'>Oligula Automatizações</Text>
              </Link>
              <Code fw={700}>{preloadData.app.version}</Code>
            </Group>

            {
              navbarItems.map(
                item => <Box
                  key={item.label}
                  my='xs'
                >
                  <Link
                    to={item.link}
                    className={classes.link}
                    data-active={item.label === selectedOption || undefined}
                    onClick={
                      item.label === selectedOption
                        ? undefined
                        : () => {
                          setPageTitle(item.label)

                          if (item.label === 'Automatizador')
                            return setPageSubtitle('Passos iniciais')

                          setPageSubtitle('')
                        }
                    }
                  >
                    <item.icon className={classes.linkIcon} stroke={1.5} />
                    <Text size='sm'>{item.label}</Text>
                  </Link>
                </Box>
              )
            }
          </div>

          <Group justify='center'>
            <ThemeSwitch />

            <Link
              to='/settings'
              onClick={() => {
                setPageTitle('Configurações')
                setPageSubtitle('')
              }}
            >
              <Settings />
            </Link>
          </Group>
        </nav>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
