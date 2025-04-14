import './home.css'

import { useState } from 'react'

import Gallery from '../../components/Gallery'
import Sidebar from '../../components/Sidebar'

const Home = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null)
  return (
    <div className="aic-home-container">
      <h1>Home</h1>
      <div className="aic-home-body-container">
        <Sidebar selectedType={selectedType} onSelectType={setSelectedType} />
        <Gallery selectedType={selectedType} />
      </div>
    </div>
  )
}

export default Home
