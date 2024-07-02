import {
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom'

import {
  HomePage,
  NotFoundPage,
  SettingsPage,
  AutomatorPage
  // InmetroSealGeneratorPage,
  // SpreadsheetFormatterPage
} from '../pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />
  },

  {
    path: '/settings',
    element: <SettingsPage />
  },

  {
    path: '/automator/:expandedStepId',
    element: <AutomatorPage />
  }

  // {
  //   path: '/inmetro-seal-generator',
  //   element: <InmetroSealGeneratorPage />
  // },

  // {
  //   path: '/spreadsheet-formatter',
  //   element: <SpreadsheetFormatterPage />
  // }
])

export const ReactRouterProvider = () => {
  return (
    <RouterProvider router={router} />
  )
}
