import { translate } from "react-redux-multilingual/lib/utils"

// Function format ngày hiện tại thành dạnh mm-yyyy
export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }

  if (day.length < 2) {
    day = '0' + day
  }

  return [month, year].join('-')
}
export function formatDate2(date, monthYear = false) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }

  if (day.length < 2) {
    day = '0' + day
  }

  if (monthYear === true) {
    return [month, year].join('-')
  } else {
    return [day, month, year].join('-')
  }
}

export const getListAssetTypes = (listAssets) => {
  let listAssetTypes = []
  listAssets.forEach((asset) => {
    const { assetType } = asset
    assetType.forEach((assetTypeItem) => {
      const { _id, typeName, typeNumber } = assetTypeItem
      if (!listAssetTypes || !listAssetTypes.find((item) => item.value === _id)) {
        listAssetTypes.push({
          text: typeName,
          value: _id,
          typeNumber: typeNumber,
        })
      }
    })
  })
  return listAssetTypes
}

export const convertGroupAsset = (group, translate) => {
  if (group === 'building') {
    return translate('asset.dashboard.building')
  } else if (group === 'vehicle') {
    return translate('asset.asset_info.vehicle')
  } else if (group === 'machine') {
    return translate('asset.dashboard.machine')
  } else if (group === 'other') {
    return translate('asset.dashboard.other')
  } else return null
}

export const getListAssetGroups = (listAssets, translate) => {
  let listAssetGroups = []
  listAssets.forEach((asset) => {
    const { group } = asset
    if (!listAssetGroups || !listAssetGroups.find((item) => item.value === group)) {
      listAssetGroups.push({
        text: convertGroupAsset(group, translate),
        value: group
      })
    }
  })
  return listAssetGroups
}

/**
 * {text: gorupNmae, value: {text: tên thiết bị, value: _id thiet bi}}
 * 
 */

export const getAssetSelectBoxItems = (listAssets, translate) => {
  let listAssetSelectBoxItems = []
  listAssets.forEach((asset) => {
    const { group } = asset
    if (!listAssetSelectBoxItems || !listAssetSelectBoxItems.find((item) => item.groupValue === group)) {
      listAssetSelectBoxItems.push({
        text: convertGroupAsset(group, translate),
        groupValue: group,
        value: []
      })
    }
  })

  listAssets.forEach((asset) => {
    const { _id, group, assetName, code } = asset
    const listAssetWithGroupItem = listAssetSelectBoxItems.find((item) => item.groupValue === group)
    if (listAssetWithGroupItem) {
      listAssetWithGroupItem.value.push({
        text: `${assetName} (${code})`,
        value: _id
      })
    }
  })

  return listAssetSelectBoxItems  

}

export const convertAssetIdToAssetName = (listAssetsByGroup, assetId) => {
  if (!listAssetsByGroup) return ''
  for (let group of listAssetsByGroup) {
    const assetList = group.value
    for (let asset of assetList) {
      if (asset.value === assetId) {
        const assetName = asset.text
        return assetName
      }
    }
  }
  return 'NO_NAME'
}

export const getListAssetIDsFromAssetGroups = (listAssetGroups) => {
  let listAssetsFromGroups = []
  listAssetGroups.forEach((item) => {
    const listAssets = item.listAssets
    listAssetsFromGroups.push(...listAssets)
  })
  return listAssetsFromGroups
}

export const getListAssetFromIds = (listAssetIds, listAssets) => {
  if (!listAssetIds || !listAssetIds?.length)
    return []

  return listAssets.filter((item) => {
    return listAssetIds?.includes(item._id)
  })
}
export const getCapacityOptions = (listCapacities) => {
  return listCapacities.map((capacity) => {
    return {
      value: capacity.key,
      text: capacity.name,
      options: capacity.values
    }
  })
}

export const getListCapacityValues = (capacityType, listCapacityOptions) => {
  if (!listCapacityOptions || !listCapacityOptions?.length)
    return []
  return listCapacityOptions.find((item) => (item.value) === capacityType).options.map((option) => {
    return {
      value: option.value,
      text: option.key
    }
  })
}

export const getCapacityKeyText = (key, listCapacityOptions, translate) => {
  let capacity = listCapacityOptions.find((item) => item.value === key)
  if (capacity) {
    return capacity?.text
  }
  return 'NO_NAME'
}

export const getCapacityValueText = (key, value, listCapacityOptions, translate) => {
  let capacity = listCapacityOptions.find((item) => item.value === key)
  if (!capacity || !capacity?.options) {
    return 'NO_TEXT'
  }
  const options = capacity?.options
  const valueItem = options?.find((item) => item.value === value)
  return valueItem?.key
}

export const getAssetTypeFromTypeId = (id, listAssetTypes, translate) => {
  const assetType = listAssetTypes.find((item) => item.value === id)
  if (!assetType) {
    return 'NO_NAME'
  } else {
    return assetType.text
  }
}

export const getAssetCapaciyNameFromValue = (value, listCapacityOptions, translate) => {
  const assetCapacity = listCapacityOptions.find((item) => item.value === value)
  if (!assetCapacity) {
    return 'NO_NAME'
  } else {
    return assetCapacity.text
  }
}

export const getOptionTextFromValueInSelectBoxItems = (value, listOptions, translate) => {
  const optionItem = listOptions.find((item) => item.value === value)
  if (!optionItem) {
    return 'NO_TEXT_NAME'
  } else {
    return optionItem.text
  }
}

