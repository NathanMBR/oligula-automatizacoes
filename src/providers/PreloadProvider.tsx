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
  process
} from '@tauri-apps/api'
import type { UnlistenFn } from '@tauri-apps/api/event'

/* eslint-disable no-console */
const defaultPreloadData = {
  app: {
    version: 'unknown',
    configDir: ''
  },

  update: {
    status: 'DONE' as updater.UpdateStatus,
    available: false,
    unlisten: null as UnlistenFn | null,
    execute: async () => {
      try {
        const { shouldUpdate } = await updater.checkUpdate()
        if (!shouldUpdate)
          return

        await updater.installUpdate()
        await process.relaunch()
      } catch (error) {
        console.error('Failed to execute update:')
        console.error(error)
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

  const [appVersion, setAppVersion] = useState(defaultPreloadData.app.version)
  const [appConfigDir, setAppConfigDir] = useState(defaultPreloadData.app.configDir)

  const [updateStatus, setUpdateStatus] = useState<updater.UpdateStatus>('DONE')
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateUnlisten, setUpdateUnlisten] = useState<UnlistenFn | null>(null)

  /* eslint-disable no-console */
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
      const { shouldUpdate } = await updater.checkUpdate()

      const unlistenUpdateEvents = await updater.onUpdaterEvent(event => {
        const {
          status,
          error
        } = event

        setUpdateStatus(status)

        if (error) {
          console.error('Failed to listen for update events:')
          console.error(error)
        }
      })

      setUpdateAvailable(shouldUpdate)
      setUpdateUnlisten(unlistenUpdateEvents)
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
      app: {
        version: appVersion,
        configDir: appConfigDir
      },

      update: {
        status: updateStatus,
        available: updateAvailable,
        unlisten: updateUnlisten,
        execute: defaultPreloadData.update.execute
      }
    }}>
      {children}
    </PreloadContext.Provider>
  )
}
