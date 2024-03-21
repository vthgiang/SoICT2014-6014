import { ValidationHelper } from '../../../../../helpers/validationHelper'

export const UsageFormValidator = {
  validateStartDate, // ngày bắt đầu sử dụng
  validateEndDate, // ngày kết thúc sử dụng
  validateUsedByUser, // người sử dụng
  validateDescription
}

function validateUsedByUser(value, translate) {
  let msg = ValidationHelper.validateEmpty(translate, value)

  return msg?.message
}
function validateStartDate(value, translate) {
  let msg = ValidationHelper.validateEmpty(translate, value)

  return msg?.message
}

function validateEndDate(value, translate) {
  let msg = ValidationHelper.validateEmpty(translate, value)

  return msg?.message
}

// Function kiểm tra nội dung
function validateDescription(value, translate) {
  let msg = ValidationHelper.validateEmpty(translate, value)

  return msg?.message
}
