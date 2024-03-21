import { getStorage } from '../config'
import { setStorage } from '../config'

export const getTableConfiguration = (tableId, defaultConfig) => {
  // check xem localStorage đã có tableConfiguration chưa
  let tableConfiguration = getStorage('tableConfiguration')

  if (!JSON.parse(tableConfiguration)) {
    // chưa có thì set default ={}
    tableConfiguration = JSON.stringify({})
    setStorage('tableConfiguration', tableConfiguration)
  }

  tableConfiguration = JSON.parse(tableConfiguration)

  if (!tableConfiguration[tableId]) {
    // Chưa có thì set mặc định: limit người dùng tự định nghĩa, hidden columns = []
    const limit = defaultConfig && defaultConfig.limit ? defaultConfig.limit : 5
    const hiddenColumns = defaultConfig && defaultConfig.hiddenColumns ? defaultConfig.hiddenColumns : []

    tableConfiguration = { ...tableConfiguration, [tableId]: { limit, hiddenColumns } }
    setStorage('tableConfiguration', JSON.stringify(tableConfiguration))
  }

  return tableConfiguration[tableId]
}

export const setTableConfiguration = (tableId, config) => {
  let tableConfiguration = JSON.parse(getStorage('tableConfiguration'))

  tableConfiguration = { ...tableConfiguration, [tableId]: config }
  setStorage('tableConfiguration', JSON.stringify(tableConfiguration))
}
