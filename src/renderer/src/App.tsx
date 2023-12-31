import { Outlet } from 'react-router-dom'
import Navbar from '@renderer/components/common/Navbar'

function App(): JSX.Element {
  return (
    <div className="flex h-full w-full border bg-gray-100">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default App
