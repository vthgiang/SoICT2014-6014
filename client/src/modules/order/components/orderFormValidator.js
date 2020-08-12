import { VALIDATOR } from "../../../helpers/validator";

export const orderFormValidator = {
  validateOrderCode,
  validateOrderQuantity,
  validateOrderAmount,
};

function validateOrderCode(value) {
  let msg = undefined;
  if (value.trim() === "") {
    msg = "Code không được để trống";
  } else if (value.length < 4) {
    msg = "Code không ít hơn 4 ký tự";
  } else if (value.length > 30) {
    msg = "Code không nhiều hơn 30 ký tự";
  } else if (!VALIDATOR.isValidName(value)) {
    msg = "Code không chứa ký tự đặc biệt";
  }
  return msg;
}

function validateOrderQuantity(value) {
  let msg = undefined;
  if (value === null) {
    msg = "Số lượng không được để trống";
  } else if (value < 1) {
    msg = "Ít nhất phải có 1 sản phẩm cho đơn này";
  }
  return msg;
}

function validateOrderAmount(value) {
  let msg = undefined;
  if (value === null) {
    msg = "Tổng tiền không được để trống";
  } else if (value < 0) {
    msg = "Giá tiền không thể nhỏ hơn 0";
  }
  return msg;
}
