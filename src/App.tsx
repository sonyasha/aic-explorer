import './App.css'

import { Route, Routes } from 'react-router-dom'

import Artwork from './pages/artwork'
import Home from './pages/home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/art/:id" element={<Artwork />} />
    </Routes>
  )
}

export default App
