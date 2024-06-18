export default class ProjectModuleValidationHelper {
  /**
   * Xác thực xem giá trị nhập vào có rỗng không?
   * @param {*} value giá trị cần xác thực
   */
  static validateEmpty = (translate, value) => {
    if (!value || value?.toString()?.replace(/\s/g, '') === '') return { status: false, message: translate('general.validate.empty_error') }
    return { status: true }
  }

  /**
   * Xác thực xem 1 yêu cầu về tài sản của đáp ứng được không
   * @param {*} currentRequireAsset // Yêu cầu về tài sản
   * @param {*} listAssetInProject // Danh sách tài sản được gán cho project
   */
  static validateRequireAsset(translate, currentRequireAsset, listAssetInProject) {
    if (!listAssetInProject || !listAssetInProject?.length) {
      return {
        status: false,
        // TODO: add translate
        message: 'Không có tài nguyên nào tham gia vào dự án!'
      }
    }

    if (!currentRequireAsset) {
      return {
        status: true
      }
    }

    const { currentAssetType, currentAssetNumber, currentAssetCapacity } = currentRequireAsset
    const listAssetsWithType = listAssetInProject.filter((item) => item.assetType.some((type) => type._id === currentAssetType) && item.capacityValue >= currentAssetCapacity)
    if (!listAssetsWithType || !listAssetsWithType?.length || listAssetsWithType?.length < currentAssetNumber) {
      return {
        status: false,
        // TODO: update translate
        message: "Không có đủ tài nguyên như yêu cầu trong dự án, điều chỉnh lại số lượng, năng lực cho phù hợp"
      }
    }

    return {
      status: true
    }
  }

  /**
   * Xác thực xem 1 yêu cầu về nhân lực với danh sách nhân viên hiện có có nhân viên nào đáp ứng được
   * @param {*} currentRequireAssignee // Yêu cầu về tài sản
   * @param {*} currentCapacityType // Năng lực nhân viên hiện tại (loại năng lực) chuẩn bị thêm
   * @param {*} currentCapacityValue // Năng lực nhân viên hiện tại (giá trị năng lực) chuẩn bị thêm
   * @param {*} listEmployeesInProject // Danh sách nhân viên trong dự án
   */
  static validateRequireAssignee(translate, currentCapacityType, currentCapacityValue, currentRequireAssignee, listEmployeesInProject) {
    let checkHasEmployeeWithCurrentCapacityToAdd = listEmployeesInProject.some((employee) => {
      const capacities = employee.capacities
      if (!capacities || !capacities?.length) {
        return false
      }
      for (const capacityItem of capacities) {
        if (capacityItem.key === currentCapacityType && Number(capacityItem.value) >= Number(currentCapacityValue)) {
          return true;
        }
      }
      return false
    })
    if (!checkHasEmployeeWithCurrentCapacityToAdd) {
      return {
        status: false,
        // TODO update translate
        message: 'Trong dự án không có nhân viên nào có thể đáp ứng về giá trị năng lực này, điều chỉnh lại giá trị năng lực yêu cầu cho phù hợp!'
      }
    }

    const newCurrentRequireAssignee = {
      ...currentRequireAssignee,
      [currentCapacityType]: Number(currentCapacityValue)
    }
    let checkHasEmployeeWithCurrentRequireAssignee = listEmployeesInProject.some((employee) => {
      const capacities = employee.capacities
      if (!capacities || !capacities?.length) {
        return false
      }
      for (let key in newCurrentRequireAssignee) {
        const capacityValueTarget = Number(newCurrentRequireAssignee[key])
        const capacityOfEmployee = capacities.find((item) => item.key === key)
        if (!capacityOfEmployee) {
          return false
        }
        if (Number(capacityOfEmployee.value) < capacityValueTarget) {
          return false
        }
      }

      return true
    })
    if (!checkHasEmployeeWithCurrentRequireAssignee) {
      return {
        status: false,
        // TODO update translate
        message: 'Trong dự án không có nhân viên nào có thể đáp ứng về bộ năng lực yêu cầu nếu thêm yêu cầu năng lực hiện tại, hãy điều chỉnh yêu cầu năng lực cho hợp lý.'
      }
    }
    return {
      status: true
    }
  }

  /**
   * Kiểm tra giá trị là số trong khoảng
   * @param {*} value giá trị nhập vào
   * @param {*} max giá trị max
   * @param {*} min giá trị min
   */
  static validateTaskWeight = (translate, value, min = 0, max = 100) => {
    let validation = this.validateEmpty(translate, value)

    if (!validation.status) {
      return validation
    }
  
    if (value < max && value > 0) {
      return {
        status: true
      }
    } else {
      return {
        status: false,
        // TODO: udpate translate
        message: translate('general.validate.number_input_error', { min, max })
      }
    }
  }

  /**
   * Kiểm tra mã công việc có bị trùng với những công việc đã có không và không được bỏ trống
   * @param {*} value giá trị nhập vào (code)
   */
  static validateTaskCode = (translate, value, listTasks) => {
    if (!value) return { status: false, message: 'Không được bỏ trống' }
    const findTaskItem = listTasks?.find((item) => item.code === value.trim())
    if (findTaskItem) return { status: false, message: 'Không được trùng mã công việc đã có' }
    return { status: true }
  }
}
