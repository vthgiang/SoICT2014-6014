import { getStorage, setStorage } from '../config'

export const getTableConfiguration = (tableId, defaultConfig = {}) => {
  // Check if localStorage has tableConfiguration
  let tableConfiguration = getStorage('tableConfiguration')

  if (!tableConfiguration) {
    // If not, initialize it with an empty object
    tableConfiguration = {}
    setStorage('tableConfiguration', JSON.stringify(tableConfiguration))
  } else {
    tableConfiguration = JSON.parse(tableConfiguration)
  }

  // If the specific table configuration does not exist, set the default configuration
  if (!tableConfiguration[tableId]) {
    const limit = defaultConfig.limit || 5
    const hiddenColumns = defaultConfig.hiddenColumns || []

    tableConfiguration[tableId] = { limit, hiddenColumns }
    setStorage('tableConfiguration', JSON.stringify(tableConfiguration))
  }

  return tableConfiguration[tableId]
}

export const setTableConfiguration = (tableId, config) => {
  let tableConfiguration = getStorage('tableConfiguration')

  if (!tableConfiguration) {
    tableConfiguration = {}
  } else {
    tableConfiguration = JSON.parse(tableConfiguration)
  }

  tableConfiguration[tableId] = config
  setStorage('tableConfiguration', JSON.stringify(tableConfiguration))
}
