import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import { useThemeStore } from './store/useThemeStore'

function App() {
  // Initialize theme from persisted storage on mount
  useThemeStore()

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-['Inter']">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
