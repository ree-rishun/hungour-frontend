import { apiClient } from './apiClient.js'
import { useStoreLiff } from '@/store/liff.store.js'

export const userSignin = async (
  userId,
  iconUrl,
  displayName,
) => {
  return await apiClient.post(
    '/users/signin',
    {
      user_id: userId,
      icon_url: iconUrl,
      display_name: displayName,
    }
  )
}

export const activateUser = async (
  reserveName,
  tel,
) => {
  const liffStore = useStoreLiff()
  const profile = await liffStore.getProfile()
  return await apiClient.post(
    '/users/activate',
    {
      user_id: profile.userId,
      reserve_name: reserveName,
      tel: tel,
    }
  )
}
