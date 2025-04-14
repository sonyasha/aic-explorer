import './Sidebar.css'

import { useEffect, useState } from 'react'

import { fetchArtTypes } from '../../api/artwork_types_api'
import { ArtType } from '../../types/arttype'

const Sidebar = () => {
  const [selectedType, setSelectedType] = useState<number>()
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
            setSelectedType(data[0].id)
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

        setSelectedType(sortedTypes[0].id)
        setArtTypes(sortedTypes)
        return
      } catch (err) {
        console.error('Failed to fetch art types:', err)
        setError('Failed to load art types. Please try again later.')
      }
    }
    loadArtTypes()
  }, [])

  useEffect(() => {
    console.log('selectedType', selectedType)
  }, [selectedType])

  return (
    <aside className="sidebar">
      <h2>Artwork Types</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {artTypes.map((artType) => (
          <li
            key={artType.id}
            className={selectedType === artType.id ? 'active' : ''}
            onClick={() => setSelectedType(artType.id)}
          >
            {artType.title}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
