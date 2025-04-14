import './Sidebar.css'

import { useEffect, useState } from 'react'

import { fetchArtTypes } from '../../api/artwork_types_api'
import { ArtType } from '../../types/arttype'

const Sidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>()
  const [artTypes, setArtTypes] = useState<ArtType[]>([])

  useEffect(() => {
    setArtTypes([])

    const loadArtTypes = async () => {
      const cachedTypes = localStorage.getItem('artTypes')
      if (cachedTypes) {
        const { data, timestamp } = JSON.parse(cachedTypes)
        const now = Date.now()
        const oneDay = 1000 * 60 * 60 * 24

        if (now - timestamp < oneDay) {
          console.log('Using cached data')
          setSelectedCategory(data[0].id)
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

      setSelectedCategory(sortedTypes[0].id)
      setArtTypes(sortedTypes)
      return
    }
    loadArtTypes()
  }, [])

  useEffect(() => {
    console.log('selectedCategory', selectedCategory)
  }, [selectedCategory])

  return (
    <aside className="sidebar">
      <h2>Categories</h2>
      <ul>
        {artTypes.map((cat) => (
          <li
            key={cat.id}
            className={selectedCategory === cat.id ? 'active' : ''}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.title}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
