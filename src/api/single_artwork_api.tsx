import axios from 'axios'

import { ArtWork, SingleArtWorkAPIResponse } from '../types/artwork'

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

export const fetchSingleArtWork = async (artWorkId: string): Promise<SingleArtWorkAPIResponse> => {
  const artworkUrl = `https://api.artic.edu/api/v1/artworks/${artWorkId}?&fields=${artWorkKeys.join(',')}`
  const response = await axios.get<SingleArtWorkAPIResponse>(artworkUrl)
  return response.data
}
