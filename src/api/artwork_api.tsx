import axios from 'axios'

import { ArtWork, ArtWorkApiResponse } from '../types/artwork'

const artWorkKeys = [
  'id',
  'is_boosted',
  'title',
  'alt_titles',
  'has_not_been_viewed_much',
  'date_display',
  'artist_display',
  'place_of_origin',
  'description',
  'dimensions',
  'medium_display',
  'image_id',
  'publication_history',
  'exhibition_history',
  'provenance_text',
  'artwork_type_title',
  'department_title',
  'artist_title',
  'style_title',
  'classification_title',
  'material_titles',
  'technique_titles',
] as const satisfies (keyof ArtWork)[]

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
