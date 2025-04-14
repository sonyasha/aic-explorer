import axios from 'axios'

import { ArtTypeApiResponse } from '../types/arttype'

const BASE_URL: string = 'https://api.artic.edu/api/v1/artwork-types'

export const fetchArtTypes = async (page: number = 1): Promise<ArtTypeApiResponse> => {
  const params: object = {
    page,
    limit: 20,
    fields: 'id,title,aat_id',
  }

  const response = await axios.get<ArtTypeApiResponse>(BASE_URL, { params })
  return response.data
}
