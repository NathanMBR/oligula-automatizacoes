import * as tauriLogger from 'tauri-plugin-log-api'

export const handleCatchError = (error: unknown, message?: string) => {
  if (message)
    tauriLogger.error(message)

  if (error instanceof Error)
    tauriLogger.error(error.message)

  else if (typeof error === 'string')
    tauriLogger.error(error)

  else if (typeof error === 'object')
    tauriLogger.error(JSON.stringify(error))

  else
    tauriLogger.error('Unknown error')
}
