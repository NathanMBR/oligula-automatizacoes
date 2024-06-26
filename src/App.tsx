import {
  MantineProvider,
  PreloadProvider,
  HeaderProvider,
  ReactRouterProvider
} from './providers'
import { UpdateModal } from './components'

import '@mantine/core/styles.css'

export const App = () => {
  return (
    <MantineProvider>
      <PreloadProvider>
        <HeaderProvider>
          <ReactRouterProvider />

          <UpdateModal />
        </HeaderProvider>
      </PreloadProvider>
    </MantineProvider>
  )
}
