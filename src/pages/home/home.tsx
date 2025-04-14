import './home.css'
import '../../styles/shared.css'

import { useState } from 'react'

import Gallery from '../../components/Gallery'
import Sidebar from '../../components/Sidebar'

const Home = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="aic-home-container">
      <div className="aic-header">
        Header and filter divs to be added later
        <button className="aic-sidebar-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
          ☰
        </button>
      </div>
      <div className="aic-home-body-container">
        <Sidebar
          selectedType={selectedType}
          onSelectType={setSelectedType}
          visible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <Gallery selectedType={selectedType} />
      </div>
    </div>
  )
}

export default Home
