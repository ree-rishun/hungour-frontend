import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 環境変数からベースURLを取得
  timeout: 10000,
})