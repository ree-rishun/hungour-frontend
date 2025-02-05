
// 現在地の取得
export const getLocation = async () => {
  const position = await getLocationPrev()
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  }
}
const getLocationPrev = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        err => {
          errMessage.value = '不明なエラーが発生しました'
          if (err.code === err.PERMISSION_DENIED) {
            errMessage.value = '位置情報の取得が許可されていません'
          }
          if (err.code === err.POSITION_UNAVAILABLE) {
            errMessage.value = '位置情報を取得できませんでした'
          }
          if (err.code === err.TIMEOUT) {
            errMessage.value = '位置情報の取得にタイムアウトしました'
          }
        }
      )
    } else {
      errMessage.value = 'Geolocation API がサポートされていません'
    }
  })
}

// 短縮住所の組立
export const buildShortAddress = (data) => {
  const area = data.address_components.find(component =>
    component.types.includes("administrative_area_level_1")
  )

  if (area?.long_name ?? null) {
    const index = data.formatted_address.indexOf(area.long_name)
    if (index) {
      return data.formatted_address.slice(index + area.long_name.length)
    }
  }

  // 区以下の要素をフィルタリングするタイプ
  const targetTypes = [
    'locality',               // 区
    'sublocality_level_2',    // 地域名（例: 歌舞伎町）
    'sublocality_level_3',    // 丁目（例: １丁目）
    'sublocality_level_4',    // 丁番（例: ４）
    'premise'                 // 建物名や施設名（例: １）
  ]

  // 条件に一致する要素を順番に取得
  const filteredComponents = data.address_components.filter(component =>
    component.types.some(type => targetTypes.includes(type))
  )

  // 各要素の long_name を連結して住所を生成
  return filteredComponents
    .reverse()
    .map(component => component.long_name)
    .join('')
}
