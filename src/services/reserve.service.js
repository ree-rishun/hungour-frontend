import { apiClient } from './apiClient.js'

export const postReserve = async (
  shops,
) => {
  return await apiClient.post(
    '/api/reserves/',
    {
      user_id: 'test',
      shops: shops,
    }
  )
}
