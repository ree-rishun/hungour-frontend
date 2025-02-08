import { apiClient } from './apiClient.js'

// 現在地の住所文字列取得
export const getGeocode = async (location) => {
  return await apiClient.get(
    `/geocode/?lat=${location.lat}&lng=${location.lng}`,
  )
}
