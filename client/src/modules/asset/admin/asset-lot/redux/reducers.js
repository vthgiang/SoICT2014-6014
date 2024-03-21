import { stat } from 'fs'
import { AssetLotConstants } from './constants'

const initState = {
  isLoading: false,
  totalList: 0,
  listAssetLots: [], // render table
  error: '',
  listAssets: [], //danh sách tài sản trong lô
  assetLot: {
    //thông tin lô tài sản (khi thêm tài sản )
    code: '',
    assetName: '',
    assetType: '',
    group: '',
    total: 0,
    price: 0,
    supplier: '',
    purchaseDate: null,
    warrantyExpirationDate: null,

    status: '',
    typeRegisterForUse: '',

    //khấu hao của các tài sản trong lô là giống nhau
    cost: null,
    usefulLife: null,
    residualValue: null,
    startDepreciation: null,
    depreciationType: null
  },
  // listAssetsDetail: [], // danh sách tài sản trong lô (dùng xem chi tiết)
  currentRow: {},
  listAssetCreates: []
}

export function assetLotManager(state = initState, action) {
  switch (action.type) {
    case AssetLotConstants.GETALL_REQUEST:
    case AssetLotConstants.GETALL_SUCCESS:
      if (action.payload !== undefined) {
        return {
          ...state,
          listAssetLots: action.payload.data,
          totalList: action.payload.totalList,
          isLoading: false
        }
      } else {
        return { ...state }
      }
    case AssetLotConstants.GETALL_FAILURE:

    case AssetLotConstants.CREATE_ASSETLOT_REQUEST:

    case AssetLotConstants.CREATE_ASSETLOT_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          isLoading: false,
          listAssetLots: [...action.payload.assetLot, ...state.listAssetLots],
          listAssets: []
        }
      } else {
        return { ...state, isLoading: false }
      }

    case AssetLotConstants.CREATE_ASSETLOT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        assetLotCodeError: action.payload,
        listAssets: []
      }

    case AssetLotConstants.UPDATE_ASSETLOT_REQUEST:
    case AssetLotConstants.UPDATE_ASSETLOT_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          isLoading: false,
          listAssetLots: [...action.payload[0], state.listAssetLots.filter((item) => item._id !== action.payload[0]._id)]
        }
      } else {
        return { ...state, isLoading: false }
      }

    case AssetLotConstants.UPDATE_ASSETLOT_FAILURE:
      return {
        ...state,
        isLoading: false
      }

    case AssetLotConstants.DELETE_ASSETLOT_REQUEST:
      return {
        ...state,
        isLoading: true,
        assetLotCodeError: []
      }
    case AssetLotConstants.DELETE_ASSETLOT_SUCCESS:
      return {
        ...state,
        listAssetLots: state.listAssetLots.filter((assetLot) => !action.assetLotIds.includes(assetLot?._id)),
        isLoading: false
      }
    case AssetLotConstants.DELETE_ASSETLOT_FAILURE:

    case AssetLotConstants.GET_ASSET_LOT_INFOR_REQUEST:
    case AssetLotConstants.GET_ASSET_LOT_INFOR_SUCCESS:
      if (action.payload) {
        return {
          ...state,
          isLoading: false,
          assetLot: action.payload.assetLot,
          listAssets: action.payload.listAssets
        }
      } else {
        return { ...state, isLoading: false }
      }
    case AssetLotConstants.GET_ASSET_LOT_INFOR_FAILURE:

    case AssetLotConstants.UPDATE_LIST_ASSETS_ACTION:
      if (action.edit) {
        return {
          ...state,
          listAssets: action.listAssets
          //isLoading: false,
        }
      } else {
        return {
          ...state,
          listAssetCreates: action.listAssets
        }
      }

    case AssetLotConstants.UPDATE_ASSET_LOT_ACTION:
      return {
        ...state,
        assetLot: action.assetLot
      }

    case AssetLotConstants.PUT_ASSETLOT_CURRENT_ROW:
      return { ...state, currentRow: action.currentRow }
    default:
      return state
  }
}
