import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../../common-components'

import { PurchaseRequestActions } from '../../../admin/purchase-request/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'
import { getFormatDateFromTime } from '../../../../../helpers/stringMethod'
import ValidationHelper from '../../../../../helpers/validationHelper'

function PurchaseRequestEditForm(props) {
  const [state, setState] = useState({
    status: 'waiting_approval'
  })
  const [prevProps, setPrevProps] = useState({
    _id: null
  })

  const { _id, translate, purchaseRequest, user, auth, department } = props
  const {
    recommendNumber,
    dateCreate,
    proponent,
    suppliesName,
    suppliesDescription,
    supplier,
    total,
    unit,
    estimatePrice,
    approver,
    status,
    note,
    recommendUnits,
    files,
    errorOnSupplies,
    errorOnSuppliesDescription,
    errorOnTotal,
    errorOnUnit,
    errorOnRecommendNumber
  } = state

  var userlist = user.list
  const departmentlist = department.list && department.list.map((obj) => ({ value: obj._id, text: obj.name }))

  if (prevProps._id !== props._id) {
    setState((state) => {
      return {
        ...state,
        _id: props._id,
        recommendNumber: props.recommendNumber,
        dateCreate: getFormatDateFromTime(props.dateCreate, 'dd-mm-yyyy'),
        proponent: props.proponent,
        suppliesName: props.suppliesName,
        suppliesDescription: props.suppliesDescription,
        supplier: props.supplier,
        total: props.total,
        unit: props.unit,
        estimatePrice: props.estimatePrice,
        approver: approver,
        status: props.status,
        note: props.note,
        files: props.files,
        recommendUnits: props.recommendUnits ? props.recommendUnits.map((obj) => obj._id) : [],
        errorOnSupplies: undefined,
        errorOnTotal: undefined,
        errorOnUnit: undefined
      }
    })
    setPrevProps(props)
  }

  useEffect(() => {
    props.getRoleSameDepartment(localStorage.getItem('currentRole'))
    props.getAllDepartments()
  }, [])

  // Bắt sự kiện thay đổi mã phiếu
  const handleRecommendNumberChange = (e) => {
    let value = e.target.value
    validateRecommendNumber(value, true)
  }
  const validateRecommendNumber = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnRecommendNumber: message,
          recommendNumber: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Ngày lập"
  const handleDateCreateChange = (value) => {
    setState((state) => {
      return {
        ...state,
        dateCreate: value
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi người đề nghị
   */
  const handleProponentChange = (value) => {
    setState((state) => {
      return {
        ...state,
        proponent: value[0]
      }
    })
  }

  // Bắt sự kiện thay đổi "Vật tư đề nghị mua"
  const handleSuppliesChange = (e) => {
    let value = e.target.value
    validateSupplies(value, true)
  }
  const validateSupplies = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnSupplies: message,
          suppliesName: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Mô tảVật tư đề nghị mua"
  const handleSuppliesDescriptionChange = (e) => {
    let value = e.target.value
    validateSuppliesDescription(value, true)
  }
  const validateSuppliesDescription = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnSuppliesDescription: message,
          suppliesDescription: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Nhà cung cấp"
  const handleSupplierChange = (e) => {
    let value = e.target.value
    setState((state) => {
      return {
        ...state,
        supplier: value
      }
    })
  }

  // Bắt sự kiện thay đổi "Số lượng"
  const handleTotalChange = (e) => {
    let value = e.target.value
    validateTotal(value, true)
  }
  const validateTotal = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnTotal: message,
          total: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Đơn vị tính"
  const handleUnitChange = (e) => {
    let value = e.target.value
    validateUnit(value, true)
  }
  const validateUnit = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnUnit: message,
          unit: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Giá trị dự tính"
  const handleEstimatePriceChange = (e) => {
    let value = e.target.value
    setState((state) => {
      return {
        ...state,
        estimatePrice: value
      }
    })
  }

  //Bắt sự kiện thay đổi "Người phê duyệt"
  const handleApproverChange = (value) => {
    setState((state) => {
      return {
        ...state,
        approver: value[0]
      }
    })
  }

  // Bắt sự kiện thay đổi "Trạng thái"
  const handleStatusChange = (value) => {
    setState((state) => {
      return {
        ...state,
        status: value[0]
      }
    })
  }

  // Bắt sự kiện thay đổi "Ghi chú"
  const handleNoteChange = (e) => {
    let value = e.target.value
    setState((value) => {
      return {
        ...state,
        note: value
      }
    })
  }

  const handleRecommendUnits = (value) => {
    setState((state) => {
      return {
        ...state,
        recommendUnits: value
      }
    })
  }

  const handleChangeFile = (file) => {
    let newFiles = [],
      oldFiles = [],
      recommendFiles
    if (file) {
      file.forEach((obj) => {
        if (obj.urlFile) {
          newFiles = [...newFiles, obj]
        } else {
          oldFiles = [...oldFiles, obj]
        }
      })
    }

    if (newFiles && newFiles.length > 0) {
      recommendFiles = newFiles.map((x) => ({
        url: x.urlFile,
        fileUpload: x.fileUpload
      }))
    }

    setState((state) => {
      return {
        ...state,
        recommendFiles,
        oldFiles
      }
    })
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    const { recommendNumber, suppliesName, total, unit } = state

    let result = validateSupplies(suppliesName, false) && validateTotal(total, false) && validateUnit(unit, false)

    return result
  }

  const save = () => {
    let { dateCreate, recommendFiles, oldFiles, files } = state
    let slitDateCreate, dateCreateConvert
    if (dateCreate) {
      slitDateCreate = dateCreate.split('-')
      dateCreateConvert = new Date([slitDateCreate[2], slitDateCreate[1], slitDateCreate[0]].join('-'))
    }
    if (!recommendFiles && !oldFiles) {
      oldFiles = files
    }

    let dataToSubmit = { ...state, oldFiles, dateCreate: dateCreateConvert, approver: [props.auth.user._id] }
    if (isFormValidated()) {
      let formData = convertJsonObjectToFormData(dataToSubmit)
      if (recommendFiles) {
        recommendFiles.forEach((obj) => {
          formData.append('recommendFiles', obj.fileUpload)
        })
      }
      return props.updatePurchaseRequest(state._id, formData)
    }
  }

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-edit-purchaserequestmanage'
        isLoading={purchaseRequest.isLoading}
        formID='form-edit-purchaserequestmanage'
        title={translate('asset.manage_recommend_procure.edit_recommend_card')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa phiếu đăng ký mua sắm tài sản */}
        <form className='form-group' id='form-edit-purchaserequest'>
          <div className='col-md-12'>
            <div className='col-sm-6'>
              {/* Mã phiếu */}
              <div className={`form-group`}>
                <label>{translate('supplies.purchase_request.recommendNumber')}</label>
                <input
                  type='text'
                  className='form-control'
                  name='recommendNumber'
                  value={recommendNumber ? recommendNumber : ''}
                  onChange={handleRecommendNumberChange}
                />
              </div>

              {/* Ngày lập */}
              <div className='form-group'>
                <label>
                  {translate('supplies.purchase_request.dateCreate')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker id={`edit_start_date${_id}`} value={dateCreate} onChange={handleDateCreateChange} />
              </div>

              {/* Người đề nghị */}
              <div className={`form-group`}>
                <label>{translate('supplies.purchase_request.proponent')}</label>
                <div>
                  <div id='proponentBox'>
                    <SelectBox
                      id={`proponent${_id}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={userlist.map((x) => {
                        return { value: x._id, text: x.name + ' - ' + x.email }
                      })}
                      onChange={handleProponentChange}
                      value={proponent ? proponent._id : null}
                      multiple={false}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Đơn vị đề nghị */}
              <div className={`form-group`}>
                <label>{translate('supplies.purchase_request.recommendUnits')}</label>
                <div>
                  <div id='recommend_units'>
                    {recommendUnits && (
                      <SelectBox
                        id={`add-recommend_units${_id}`}
                        className='form-control select2'
                        style={{ width: '100%' }}
                        items={departmentlist}
                        onChange={handleRecommendUnits}
                        value={recommendUnits}
                        multiple={true}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Vật tư đề nghị mua */}
              <div className={`form-group ${!errorOnSupplies ? '' : 'has-error'}`}>
                <label>
                  {translate('supplies.purchase_request.suppliesName')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='suppliesName'
                  value={suppliesName ? suppliesName : ''}
                  onChange={handleSuppliesChange}
                  autoComplete='off'
                  placeholder='Vật tư đề nghị mua'
                />
                <ErrorLabel content={errorOnSupplies} />
              </div>

              {/* Nhà cung cấp */}
              <div className='form-group'>
                <label>{translate('supplies.purchase_request.supplier')}</label>
                <input
                  type='text'
                  className='form-control'
                  name='supplier'
                  value={supplier ? supplier : ''}
                  onChange={handleSupplierChange}
                />
              </div>

              {/* Mô tả Vật tư đề nghị mua */}
              <div className={`form-group ${errorOnSuppliesDescription === undefined ? '' : 'has-error'}`}>
                <label>{translate('supplies.purchase_request.suppliesDescription')}</label>
                <textarea
                  className='form-control'
                  rows='3'
                  name='suppliesDescription'
                  value={suppliesDescription ? suppliesDescription : ''}
                  onChange={handleSuppliesDescriptionChange}
                  autoComplete='off'
                  placeholder='Vật tư đề nghị mua'
                ></textarea>
                <ErrorLabel content={errorOnSuppliesDescription} />
              </div>
            </div>

            <div className='col-sm-6'>
              {/* Số lượng */}
              <div className={`form-group ${errorOnTotal === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('supplies.purchase_request.total')}
                  <span className='text-red'>*</span>
                </label>
                <input type='number' className='form-control' name='total' value={total ? total : ''} onChange={handleTotalChange} />
                <ErrorLabel content={errorOnTotal} />
              </div>

              {/* Đơn vị tính */}
              <div className={`form-group ${!errorOnUnit ? '' : 'has-error'}`}>
                <label>
                  {translate('supplies.purchase_request.unit')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='unit'
                  value={unit ? unit : ''}
                  onChange={handleUnitChange}
                  autoComplete='off'
                  placeholder='Đơn vị tính'
                />
                <ErrorLabel content={errorOnUnit} />
              </div>

              {/* Giá trị dự tính */}
              <div className='form-group'>
                <label>{translate('supplies.purchase_request.estimatePrice')} (VNĐ)</label>
                <input
                  type='number'
                  className='form-control'
                  name='estimatePrice'
                  value={estimatePrice ? estimatePrice : ''}
                  onChange={handleEstimatePriceChange}
                />
              </div>

              {/* Người phê duyệt */}
              <div className={`form-group`}>
                <label>{translate('supplies.purchase_request.approver')}</label>
                <div>
                  <div id='approver'>
                    <SelectBox
                      id={`approver${_id}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={userlist.map((x) => {
                        return { value: x._id, text: x.name + ' - ' + x.email }
                      })}
                      onChange={handleApproverChange}
                      value={approver}
                      multiple={true}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Trạng thái */}
              <div className='form-group'>
                <label>{translate('supplies.purchase_request.status')}</label>
                <SelectBox
                  id={`status${_id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={status}
                  items={[
                    { value: 'approved', text: translate('asset.usage.approved') },
                    { value: 'waiting_for_approval', text: translate('asset.usage.waiting_approval') },
                    { value: 'disapproved', text: translate('asset.usage.not_approved') }
                  ]}
                  onChange={handleStatusChange}
                />
              </div>

              {/* Ghi chú */}
              <div className='form-group'>
                <label>{translate('supplies.purchase_request.note')}</label>
                <textarea className='form-control' rows='3' name='note' value={note ? note : ''} onChange={handleNoteChange}></textarea>
              </div>

              {/* tài liệu đính kèm */}
              <div className='form-group'>
                <label>{translate('supplies.purchase_request.files')}</label>
                <UploadFile multiple={true} onChange={handleChangeFile} files={files} sendDataAfterDelete={true} />
              </div>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { purchaseRequest, user, auth, department } = state
  return { purchaseRequest, user, auth, department }
}

const actionCreators = {
  getUser: UserActions.get,
  updatePurchaseRequest: PurchaseRequestActions.updatePurchaseRequest,
  getRoleSameDepartment: UserActions.getRoleSameDepartment,
  getAllDepartments: DepartmentActions.get
}

const editPurchaseRequestManager = connect(mapState, actionCreators)(withTranslate(PurchaseRequestEditForm))
export { editPurchaseRequestManager as PurchaseRequestEditForm }
