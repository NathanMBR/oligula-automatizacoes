import {
  MantineProvider,
  PreloadProvider,
  HeaderProvider,
  AutomationProvider,
  ReactRouterProvider
} from './providers'
import { UpdateModal } from './components'

import '@mantine/core/styles.css'

export const App = () => {
  return (
    <MantineProvider>
      <PreloadProvider>
        <HeaderProvider>
          <AutomationProvider>
            <ReactRouterProvider />

            <UpdateModal />
          </AutomationProvider>
        </HeaderProvider>
      </PreloadProvider>
    </MantineProvider>
  )
}
