import { TABs } from "./tab.const";

const fakeUnitCostList = [
  { text: 'VND', value: 'VND' },
  { text: 'USD', value: 'USD' }
]
const fakeUnitTimeList = [
  { text: 'Ngày', value: 'days' },
  { text: 'Giờ', value: 'hours' }
]
const fakeProjectTypeList = [
  { text: 'QLDA dạng đơn giản', value: 1 },
  { text: 'QLDA phương pháp CPM', value: 2 }
]

const fakeAssetRequireTypes = [
  { text: 'Bắt buộc', value: 'obligatory' },
  { text: 'Tùy chọn', value: 'optional' }
]

const TASK_ACTION_TYPE = {
  ADD_TYPE: 'ADD_TYPE',
  RESET_TYPE: "RESET_TYPE",
  DELETE_TYPE: "DELETE_TYPE",
  CANCEL_TYPE: "CANCEL_TYPE",
  EDIT_TYPE: "EDIT_TYPE"
}

const DEFAULT_VALUE = 1
const assetCapacities = [
  {
    text: "Bình thường",
    value: 1,
  },
  {
    text: "Tốt",
    value: 2,
  },
  {
    text: "Rất tốt",
    value: 3,
  }
]

export {
  TABs,
  fakeProjectTypeList,
  fakeUnitCostList,
  fakeUnitTimeList,
  TASK_ACTION_TYPE,
  DEFAULT_VALUE,
  assetCapacities,
  fakeAssetRequireTypes
}