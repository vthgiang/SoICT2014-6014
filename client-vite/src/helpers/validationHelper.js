export const REGEX = {
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  SPECIAL_CHARACTER: /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/
}

export default class ValidationHelper {
  /**----------------------
   * CÁC PHƯƠNG THỨC CẤP 1
   */

  /**
   * Xác thực xem giá trị nhập vào có rỗng không?
   * @param {*} value giá trị cần xác thực
   */
  static validateEmpty = (translate, value) => {
    if (!value || value?.toString()?.replace(/\s/g, '') === '') return { status: false, message: translate('general.validate.empty_error') }
    return { status: true }
  }

  /**
   * Xác thực giá trị có chứa ký tự đặc biệt hay không?
   * @param {*} value giá trị cần xác thực
   */
  static validateInvalidCharacter = (translate, value) => {
    if (!REGEX.SPECIAL_CHARACTER.test(value)) return { status: false, message: translate('general.validate.invalid_character_error') }
    return { status: true }
  }

  /**
   * Kiểm tra độ dài của giá trị có hợp lệ
   * @param {*} value giá trị cần xác thực
   * @param {*} min số ký tự tối thiểu
   * @param {*} max số ký tụ tối đa
   */
  static validateLength = (translate, value, min = 4, max = 1024) => {
    if (value?.length < min || value?.length > max)
      return { status: false, message: translate('general.validate.length_error', { min, max }) }
    return { status: true }
  }

  /**
   * Kiểm tra giá trị phải có số ký tự tối thiểu
   * @param {*} value giá trị nhập vào
   * @param {*} min số ký tự tối thiểu
   */
  static validateMinimumLength = (translate, value, min = 4) => {
    if (value?.length < min) return { status: false, message: translate('general.validate.minimum_length_error', { min }) }
    return { status: true }
  }

  /**
   * Kiểm tra giá trị phải có số ký tự tối đa
   * @param {*} value giá trị nhập vào
   * @param {*} max số ký tự tối đa
   */
  static validateMaximumLength = (translate, value, max = 1024) => {
    if (value?.length > max) return { status: false, message: translate('general.validate.maximum_length_error', { max }) }
    return { status: true }
  }

  /**
   * Kiểm tra giá trị min
   * @param {*} value giá trị nhập vào
   * @param {*} min giá trị min
   */
  static validateNumberInputMin = (translate, value, min = 0) => {
    let validation = this.validateEmpty(translate, value)

    if (!validation.status) {
      return validation
    }

    if (value >= min) {
      return {
        status: true
      }
    } else {
      return {
        status: false,
        message: translate('general.validate.number_input_error_min', { min })
      }
    }
  }

  /**
   * Kiểm tra giá trị max
   * @param {*} value giá trị nhập vào
   * @param {*} max giá trị max
   */
  static validateNumberInputMax = (translate, value, max = 100) => {
    let validation = this.validateEmpty(translate, value)

    if (!validation.status) {
      return validation
    }

    if (value <= max) {
      return {
        status: true
      }
    } else {
      return {
        status: false,
        message: translate('general.validate.number_input_error_max', { max })
      }
    }
  }

  /**
   * Kiểm tra giá trị là số trong khoảng
   * @param {*} value giá trị nhập vào
   * @param {*} max giá trị max
   * @param {*} min giá trị min
   */
  static validateNumberInput = (translate, value, min = 0, max = 100) => {
    let validation = this.validateEmpty(translate, value)

    if (!validation.status) {
      return validation
    }

    if (value <= max && value >= min) {
      return {
        status: true
      }
    } else {
      return {
        status: false,
        message: translate('general.validate.number_input_error', { min, max })
      }
    }
  }

  /**
   * Kiểm tra giá trị phải có số ký tự tối đa
   * @param {*} value giá trị nhập vào
   * @param {*} max số ký tự tối đa
   */
  static validateArrayLength = (translate, value) => {
    if (value?.length === 0) return { status: false, message: translate('general.validate.empty_error') }
    return { status: true }
  }

  /**-------------------------------
   * CÁC PHƯƠNG THỨC CẤP 2
   */

  /**
   * Kiểm tra tên hợp lệ
   * @param {*} name Tên cần xác thực
   * @param {*} min số ký tự tối thiểu
   * @param {*} max số ký tự tối đa
   */
  static validateName = (translate, name, min = 4, max = 255) => {
    let result = this.validateEmpty(translate, name)
    if (!result.status) return result

    result = this.validateLength(translate, name, min, max)
    if (!result.status) return result

    return { status: true }
  }

  /**
   * Kiểm tra mô tả hợp lệ
   * @param {*} description mô tả
   */
  static validateDescription = (translate, description) => {
    let result = this.validateEmpty(translate, description)
    if (!result.status) return result

    return { status: true }
  }

  /**
   * Kiểm tra email hợp lệ
   * @param {*} email email
   */
  static validateEmail = (translate, email) => {
    let result = this.validateEmpty(translate, email)
    if (!result.status) return result

    if (!REGEX.EMAIL.test(email)) return { status: false, message: translate('general.validate.invalid_error') }

    return { status: true }
  }

  /**
   * Kiểm tra mật khẩu hợp lệ
   * @param {*} password mật khẩu nhập vào
   * @param {*} min số ký tự tối thiểu
   * @param {*} max số ký tự tối đa
   */
  static validatePassword = (translate, password, min = 6, max = 30) => {
    let result = this.validateEmpty(translate, password)
    if (!result.status) return result

    result = this.validateLength(translate, password, min, max)
    if (!result.status) return result

    return { status: true }
  }

  /**
   * Kiểm tra mã không chứa ký tự đặc biệt
   * @param {*} code mã
   */
  static validateCode = (translate, code) => {
    let result = this.validateEmpty(translate, code)
    if (!result.status) return result

    result = this.validateInvalidCharacter(translate, code)
    if (!result.status) return result

    return { status: true }
  }

  /**
   * Kiểm tra giá trị ô input chỉ nhập số và không được bỏ trống
   * @param {*} value giá trị nhập vào
   */
  static validateNumericInputMandatory = (translate, value) => {
    if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/)) return { status: false, message: 'Không được bỏ trống và chỉ được điền số' }
    return { status: true }
  }

  /**
   * Kiểm tra tên công việc có bị trùng với những công việc đã có không và không được bỏ trống
   * @param {*} value giá trị nhập vào
   */
  static validateTaskName = (translate, value, listTasks) => {
    if (!value) return { status: false, message: 'Không được bỏ trống' }
    const findTaskItem = listTasks?.find((item) => item.name === value.trim())
    if (findTaskItem) return { status: false, message: 'Không được trùng tên công việc đã có' }
    return { status: true }
  }
}
