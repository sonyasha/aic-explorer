import axios from 'axios'

import { ArtWorkApiResponse, SimpleArtWork } from '../types/artwork'

const artWorkKeys = [
  'id',
  'title',
  'date_display',
  'artist_display',
  'image_id',
] as const satisfies (keyof SimpleArtWork)[]

export const fetchArtWorks = async (
  page: number = 1,
  artWorkType: number | null = null,
  limit: number = 20
): Promise<ArtWorkApiResponse> => {
  const baseUrl = `https://api.artic.edu/api/v1/artworks`
  const filters = `page=${page}&limit=${limit}&fields=${artWorkKeys.join(',')}`

  if (artWorkType === null) {
    const response = await axios.get<ArtWorkApiResponse>(`${baseUrl}?${filters}`)
    return response.data
  }
  const searchUrl = `${baseUrl}/search/?query[match][artwork_type_id]=${artWorkType}&${filters}`
  const response = await axios.get<ArtWorkApiResponse>(searchUrl)
  return response.data
}
