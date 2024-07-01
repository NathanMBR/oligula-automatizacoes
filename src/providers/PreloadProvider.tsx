import {
  createContext,
  useState,
  useEffect,
  type PropsWithChildren
} from 'react'
import {
  Center,
  Loader
} from '@mantine/core'
import {
  app,
  path,
  updater,
  process,
  os
} from '@tauri-apps/api'

/* eslint-disable no-console */
const defaultPreloadData = {
  os: {
    type: 'unknown' as os.OsType | 'unknown'
  },

  app: {
    version: 'unknown',
    configDir: ''
  },

  update: {
    available: false,
    execute: async () => {
      try {
        const { shouldUpdate } = await updater.checkUpdate()
        if (!shouldUpdate)
          return false

        await updater.installUpdate()
        await process.relaunch()

        return true
      } catch (error) {
        console.error('Failed to execute update:')
        console.error(error)

        return false
      }
    }
  }
}
/* eslint-enable no-console */

export const PreloadContext = createContext(defaultPreloadData)

export type PreloadProviderProps = Required<PropsWithChildren>

export const PreloadProvider = (props: PreloadProviderProps) => {
  const { children } = props

  const [isLoading, setIsLoading] = useState(false)

  const [OsType, setOsType] = useState(defaultPreloadData.os.type)

  const [appVersion, setAppVersion] = useState(defaultPreloadData.app.version)
  const [appConfigDir, setAppConfigDir] = useState(defaultPreloadData.app.configDir)

  const [updateAvailable, setUpdateAvailable] = useState(false)

  /* eslint-disable no-console */
  const loadOsType = async () => {
    try {
      const currentOsType = await os.type()
      setOsType(currentOsType)
    } catch (error) {
      console.error('Failed to load OS type:')
      console.error(error)
    }
  }

  const loadVersion = async () => {
    try {
      const version = await app.getVersion()
      setAppVersion(version)
    } catch (error) {
      console.error('Failed to load app version:')
      console.error(error)
    }
  }

  const loadConfigPath = async () => {
    try {
      const configDir = await path.configDir()
      setAppConfigDir(configDir)
    } catch (error) {
      console.error('Failed to load app config path:')
      console.error(error)
    }
  }

  const checkUpdate = async () => {
    try {
      console.log('Checking for updates...')

      const {
        shouldUpdate,
        manifest
      } = await updater.checkUpdate()

      if (!shouldUpdate)
        return console.log('No updates found.')

      console.log('Found update!')
      if (manifest) {
        console.log(`Version: ${manifest.version}`)
        console.log(`Release date: ${manifest.date}`)
      }

      setUpdateAvailable(shouldUpdate)
    } catch (error) {
      console.error('Failed to check for updates:')
      console.error(error)
    }
  }
  /* eslint-enable no-console */

  useEffect(
    () => {
      setIsLoading(true)

      Promise.all([
        loadOsType(),
        loadVersion(),
        loadConfigPath(),
        checkUpdate()
      ])
        .finally(() => setIsLoading(false))
    },
    []
  )

  if (isLoading)
    return (
      <Center h='100vh'>
        <Loader />
      </Center>
    )

  return (
    <PreloadContext.Provider value={{
      os: {
        type: OsType
      },

      app: {
        version: appVersion,
        configDir: appConfigDir
      },

      update: {
        available: updateAvailable,
        execute: defaultPreloadData.update.execute
      }
    }}>
      {children}
    </PreloadContext.Provider>
  )
}
