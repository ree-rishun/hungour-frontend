import { apiClient } from './apiClient.js'

export const userSignin = async (
  userId,
  iconUrl,
  displayName,
) => {
  return await apiClient.post(
    '/api/users/signin',
    {
      user_id: userId,
      icon_url: iconUrl,
      display_name: displayName,
    }
  )
}
