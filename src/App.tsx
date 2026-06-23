import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import { useThemeStore } from './store/useThemeStore'

function App() {
  // Initialize theme from persisted storage on mount
  useThemeStore();

  return <RouterProvider router={router} />
}

export default App
