import { apiClient } from './apiClient.js'
import { useStoreLiff } from '@/store/liff.store.js'

export const postReserve = async (
  shops,
  departureTime,
  partySize,
  seatType,
  currentLocation,
) => {
  const liffStore = useStoreLiff()
  const profile = await liffStore.getProfile()
  return await apiClient.post(
    '/api/reserves/',
    {
      user_id: profile.userId,
      shops: shops,
      departure_time: departureTime,
      party_size: partySize,
      seat_type: seatType,
      current_location: currentLocation,
    }
  )
}

export const postStartReserve = async (
  reserveId,
  shops,
) => {
  return await apiClient.post(
    `/api/reserves/${reserveId}/start`,
    {
      shops: shops,
    }
  )
}

export const getReserve = async (
  reserveId,
) => {
  return await apiClient.get(
    `/api/reserves/${reserveId}/`
  )
}
