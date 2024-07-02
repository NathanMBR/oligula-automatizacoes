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
  updater,
  process,
  os,
  fs
} from '@tauri-apps/api'

type AppSettingsData = {
  showUpdateNotification: boolean
  timeBetweenStepsInMs: number
}

/* eslint-disable no-console */
const defaultPreloadData = {
  os: {
    type: 'unknown' as os.OsType | 'unknown'
  },

  app: {
    version: 'unknown',
    settings: {
      data: {
        showUpdateNotification: true,
        timeBetweenStepsInMs: 1000
      } as AppSettingsData,
      set: async (_data: Partial<AppSettingsData>): Promise<boolean> => Promise.resolve(false)
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
}
/* eslint-enable no-console */

export const PreloadContext = createContext(defaultPreloadData)

export type PreloadProviderProps = Required<PropsWithChildren>

export const PreloadProvider = (props: PreloadProviderProps) => {
  const { children } = props
  const { BaseDirectory } = fs

  const [isLoading, setIsLoading] = useState(false)

  const [OsType, setOsType] = useState(defaultPreloadData.os.type)

  const [appVersion, setAppVersion] = useState(defaultPreloadData.app.version)
  const [appSettingsData, setAppSettingsData] = useState<AppSettingsData>(defaultPreloadData.app.settings.data)

  const [appUpdateAvailable, setAppUpdateAvailable] = useState(false)

  const CONFIG_FILE = 'settings.json'

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

  const loadSettings = async () => {
    try {
      const doesDirExist = await fs.exists('', { dir: BaseDirectory.AppConfig })
      if (!doesDirExist)
        await fs.createDir('', { dir: BaseDirectory.AppConfig, recursive: true })

      const doesConfigFileExist = await fs.exists(CONFIG_FILE, { dir: BaseDirectory.AppConfig })
      if (!doesConfigFileExist) {
        console.log('Generating default settings file...')

        await fs.writeTextFile(
          {
            path: CONFIG_FILE,
            contents: JSON.stringify(defaultPreloadData.app.settings, null, 2)
          },

          {
            dir: fs.BaseDirectory.AppConfig
          }
        )

        console.log('Settings file generated successfully!')

        return
      }

      console.log('Loading existent settings file...')

      const rawSettings = await fs.readTextFile(CONFIG_FILE, { dir: BaseDirectory.AppConfig })
      const settings = JSON.parse(rawSettings) as AppSettingsData
      setAppSettingsData(settings)
    } catch (error) {
      console.error('Failed to load app settings data:')
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

      setAppUpdateAvailable(shouldUpdate)
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
        loadSettings(),
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
        settings: {
          data: appSettingsData,
          set: async data => {
            try {
              const settings = {
                ...defaultPreloadData.app.settings.data,
                ...data
              }

              setAppSettingsData(settings)

              await fs.writeTextFile(
                {
                  path: CONFIG_FILE,
                  contents: JSON.stringify(settings, null, 2)
                },

                {
                  dir: BaseDirectory.AppConfig
                }
              )

              return true
            } catch (error) {
              /* eslint-disable no-console */
              console.error('Failed to set app settings:')
              console.error(error)
              /* eslint-enable no-console */

              return false
            }
          }
        },
        update: {
          available: appUpdateAvailable,
          execute: defaultPreloadData.app.update.execute
        }
      }
    }}>
      {children}
    </PreloadContext.Provider>
  )
}
