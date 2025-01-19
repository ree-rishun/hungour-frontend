const createHeader = () => {
  return {
    Accept: 'application/json,text/plain'
  }
}
export default (resource) => {
  const url = `${process.env.VUE_APP_BASE_URL}${resource}`
  return {
    /**
     * Getメソッド
     * @param {Object} params クエリパラメータ
     * @returns レスポンス
     */
    async get(params) {
      const headers = createHeader()
      return await repository.get(url, {
        params,
        headers
      })
    },
    /**
     * Postメソッド
     * @param {Object} body リクエストボディ
     * @returns レスポンス
     */
    async post(body) {
      const headers = createHeader()
      return await repository.post(url, body, {
        headers
      })
    },
    /**
     * Putメソッド
     * @param {Object} body リクエストボディ
     * @param {Object} options オプション {needsAccessToken, timeout, signal}
     * @returns レスポンス
     */
    async put(body) {
      const headers = createHeader()
      return await repository.put(url, body, {
        headers
      })
    },
    /**
     * Deleteメソッド
     * @param {Object} data リクエストデータ
     * @param {Object} options オプション {needsAccessToken, timeout, signal}
     * @returns レスポンス
     */
    async delete(data) {
      const headers = createHeader()
      return await repository.delete(url, {
        headers,
        data
      })
    }
  }
}
