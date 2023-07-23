import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import App from './App'
import ImgBackgroundRemoval from './pages/ImgBackgroundRemoval'
import ImgFixRestoration from './pages/ImgFixRestoration'

export default function Router() {
  return (
    <BrowserRouter>
      {/* 使用 Routes 替换曾经的 Switch */}
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="img-fix-restoration" element={<ImgFixRestoration />} />
          <Route
            path="img-background-removal"
            element={<ImgBackgroundRemoval />}
          />
          <Route path="/" element={<Navigate to="img-fix-restoration" />} />
        </Route>
        <Route path="*" element={<Navigate to="/img-fix-restoration" />} />
      </Routes>
    </BrowserRouter>
  )
}
