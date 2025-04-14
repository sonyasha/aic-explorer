import './Sidebar.css'

import { useEffect, useState } from 'react'

import { fetchArtTypes } from '../../api/artwork_types_api'
import { ArtType } from '../../types/arttype'

interface SidebarProps {
  selectedType: number | null
  onSelectType: React.Dispatch<React.SetStateAction<number | null>>
}

const Sidebar: React.FC<SidebarProps> = ({ selectedType, onSelectType }) => {
  const [artTypes, setArtTypes] = useState<ArtType[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setArtTypes([])

    const loadArtTypes = async () => {
      try {
        const cachedTypes = localStorage.getItem('artTypes')
        if (cachedTypes) {
          const { data, timestamp } = JSON.parse(cachedTypes)
          const now = Date.now()
          const oneDay = 1000 * 60 * 60 * 24

          if (now - timestamp < oneDay) {
            onSelectType(data[0].id)
            setArtTypes(data)
            return
          }
        }

        let page: number = 1
        let allData: ArtType[] = []

        const firstPage = await fetchArtTypes(page)
        const totalPages = firstPage.pagination.total_pages

        allData = [...firstPage.data]

        while (page < totalPages) {
          page++
          const nextPage = await fetchArtTypes(page)
          allData.push(...nextPage.data)
        }
        const sortedTypes = allData.sort((a, b) => a.title.localeCompare(b.title))

        localStorage.setItem('artTypes', JSON.stringify({ data: allData, timestamp: Date.now() }))

        onSelectType(sortedTypes[0].id)
        setArtTypes(sortedTypes)
        return
      } catch (err) {
        console.error('Failed to fetch art types:', err)
        setError('Failed to load art types. Please try again later.')
      }
    }
    loadArtTypes()
  }, [])

  return (
    <aside className="aic-sidebar-conainer">
      <h2>Artwork Types</h2>
      {error && <p className="aic-sidebar-error">{error}</p>}
      <ul>
        {artTypes.map((artType) => (
          <li
            key={artType.id}
            className={selectedType === artType.id ? 'active' : ''}
            onClick={() => onSelectType(artType.id)}
          >
            {artType.title}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
