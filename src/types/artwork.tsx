export interface SimpleArtWork {
  id: number
  title: string
  date_display: string
  artist_display: string
  image_id: string
}

export interface ArtWorkApiResponse {
  data: SimpleArtWork[]
  info: {
    license_text: string
    license_links: string[]
    version: string
  }
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
    next_url: string | null
    prev_url: string | null
  }
  config: {
    iiif_url: string
    website_url: string
  }
}

export interface ArtWork {
  id: number
  is_boosted: boolean
  title: string
  alt_titles: string[]
  has_not_been_viewed_much: boolean
  date_display: string
  artist_display: string
  place_of_origin: string
  description: string
  dimensions: string
  medium_display: string

  image_id: string

  publication_history: string
  exhibition_history: string
  provenance_text: string

  artwork_type_title: string
  department_title: string
  artist_title: string
  style_title: string
  classification_title: string
  material_titles: string[]
  technique_titles: string[]
}

export interface SingleArtWorkAPIResponse {
  data: ArtWork
  info: {
    license_text: string
    license_links: string[]
    version: string
  }
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
    next_url: string | null
    prev_url: string | null
  }
  config: {
    iiif_url: string
    website_url: string
  }
}
