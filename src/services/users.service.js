import { apiClient } from './apiClient.js'
import { useStoreLiff } from '@/store/liff.store.js'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import {firebaseConfig} from '../config/firebase-config'
import {initializeApp} from 'firebase/app'

export const userSignin = async (
  userId,
  iconUrl,
  displayName,
) => {
   const res = await apiClient.post(
    '/users/signin',
    {
      user_id: userId,
      icon_url: iconUrl,
      display_name: displayName,
    }
  )
  const auth = getAuth()
  await signInWithCustomToken(auth, res.data.token)
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
