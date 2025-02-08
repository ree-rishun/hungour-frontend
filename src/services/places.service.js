import { apiClient, API_URL } from './apiClient.js'

// 飲食店一覧の検索
export const getPlaces = async (
  location,
  minRating,
  text = '居酒屋',
) => {
  return await apiClient.post(
    '/places/',
    {
      text: text,
      lat: location.lat,
      lng: location.lng,
      radius: 10000,
      min_rating: minRating,
      open_now: true,
      include_pure_service_area_businesses: true,
      departure_in_minutes: 5,
    }
  )
}

export const getPlacesPhoto = (r) => {
  return `${API_URL}/places/photos?name=${r}`
}
