export interface ArtType {
  id: number
  title: string
  aat_id: number
}

export interface ArtTypeApiResponse {
  data: ArtType[]
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
    next_url: string | null
    prev_url: string | null
  }
}
