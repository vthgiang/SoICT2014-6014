import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox, DatePicker, ErrorLabel, QuillEditor } from '../../../../common-components'
import { CrmCareActions } from '../redux/action'
import { formatFunction } from '../../common/index'
import ValidationHelper from '../../../../helpers/validationHelper'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
function EditCareForm(props) {
  const { crm, user, careEditId, translate } = props
  useEffect(() => {
    props.getCare(careEditId)
  }, [props.careEditId])

  // Lấy nhân viên trong đơn vị hiện tại
  let employees
  if (user.usersOfChildrenOrganizationalUnit) {
    employees = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit)
  }

  let listCareTypes
  // Lấy hình thức chắm sóc khách hàng
  if (crm.careTypes) {
    listCareTypes = crm.careTypes.list.map((o) => ({ value: o._id, text: o.name }))
  }

  // Lấy danh sách khách hàng
  let listCustomers
  if (crm.customers) {
    listCustomers = crm.customers.list.map((o) => ({ value: o._id, text: o.name }))
  }

  const [careEditting, setCareEditting] = useState({ id: undefined })
  if (!crm.cares.isLoading && crm.cares.careById && careEditting.id != crm.cares.careById._id) {
    async function getData() {
      const care = crm.cares.careById
      const newCareEditting = {
        id: care._id,
        customerCareStaffs: care.customerCareStaffs ? care.customerCareStaffs.map((o) => o._id) : [],
        customer: care.customer ? [care.customer._id] : '',
        name: care.name ? care.name : '',
        description: care.description ? care.description : '',
        customerCareTypes: care.customerCareTypes ? care.customerCareTypes.map((o) => o._id) : [],
        status: care.status ? care.status : '',
        startDate: care.startDate ? formatFunction.formatDate(care.startDate) : '',
        endDate: care.endDate ? formatFunction.formatDate(care.endDate) : '',
        quillValueDefault: care.description ? care.description : '',
        crmUnit: care.crmUnit ? care.crmUnit : ''
      }
      await setCareEditting(newCareEditting)
    }
    getData()
  }

  /**
   * Hàm xử lý khi người chăm sóc khách hàng thay đổi
   * @param {*} value
   */
  const handleChangeCaregiver = async (value) => {
    let newCareEditting = {
      ...careEditting,
      customerCareStaffs: value
    }

    await setCareEditting(newCareEditting)
    // let { message } = ValidationHelper.validateEmpty(translate, value);
    // newCareEditting = {
    //     ...careEditting,
    //     caregiverError: message
    // }
    // await setCareEditting(newCareEditting);
  }

  /**
   * Hàm xử lý khi khách hàng được chăm sóc thay đổi
   * @param {*} value
   */
  const handleChangeCustomer = async (value) => {
    let newCareEditting = {
      ...careEditting,
      customer: value[0]
    }

    await setCareEditting(newCareEditting)
    // let { message } = ValidationHelper.validateEmpty(translate, value);
    // newCareEditting = {
    //     ...careEditting,
    //     customerError: message
    // }
    // await setCareEditting(newCareEditting);
  }

  /**
   * Hàm xử lý khi tên công việc chăm sóc khách hàng thay đổi
   * @param {*} e
   */
  const handleChangeName = async (e) => {
    const { value } = e.target
    let newCareEditting = {
      ...careEditting,
      name: value
    }

    await setCareEditting(newCareEditting)
    // let { message } = ValidationHelper.validateName(translate, value, 4, 255);
    // newCareEditting = {
    //     ...careEditting,
    //     nameError: message
    // }
    // await setCareEditting(newCareEditting);
  }

  /**
   * Hàm xử lý khi mô tả công việc chăm sóc khách  hàng thay đổi
   * @param {*} e
   * @param {*} editor
   */
  const handleChangeDescription = async (data, imgs) => {
    let newCareEditting = {
      ...careEditting,
      description: data
    }

    await setCareEditting(newCareEditting)
  }

  /**
   * Hàm xử lý khi hình thức chăm sóc thay đổi
   * @param {*} value
   */
  const handleChangeCareType = async (value) => {
    let newCareEditting = {
      ...careEditting,
      customerCareTypes: value
    }

    await setCareEditting(newCareEditting)
  }

  /**
   * Hàm xử lý khi ngày bắt đầu thực hiện công việc thay đổi
   * @param {*} value
   */
  const handleChangeStartDate = async (value) => {
    let newCareEditting = {
      ...careEditting,
      startDate: value
    }

    await setCareEditting(newCareEditting)
  }

  /**
   * Hàm xử lý khi ngày kết thúc công việc thay đổi
   * @param {*} value
   */

  const handleChangeEndDate = async (value) => {
    let newCareEditting = {
      ...careEditting,
      endDate: parseInt(value[0])
    }
    await setCareEditting(newCareEditting)
  }

  const save = () => {
    props.editCare(careEditId, careEditting)
    // props.getCares({limit:10,page:0});
  }

  //validate error message
  let { caregiverError, customerError, nameError, descriptionError, careTypeError, statusError, startDateError } = {}

  const items = ['Chưa thưc hiện', 'Đang thực hiện', 'Đã hoàn thành', 'Đã quá hạn', 'Hoàn thành quá hạn']
  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-crm-care-edit`}
        isLoading={crm.cares.isLoading}
        formID='modal-crm-care-edit'
        title={translate('crm.care.edit')}
        size={75}
        func={save}
        // disableSubmit={!this.isFormValidated()}
      >
        {careEditting && (
          <div>
            {/* Form chỉnh sửa khách hàng mới */}
            <form id={`modal-crm-care-edit-${careEditId}`}>
              {/* Nhân viên phụ trách */}
              <div className={`form-group ${!caregiverError ? '' : 'has-error'}`}>
                <label>
                  {translate('crm.care.caregiver')}
                  <span className='text-red'>*</span>
                </label>
                {careEditting.customerCareStaffs && employees && (
                  <SelectBox
                    id={`caregiver-care-edit-care-staff-${careEditId}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={employees}
                    value={careEditting.customerCareStaffs}
                    onChange={handleChangeCaregiver}
                    multiple={true}
                  />
                )}
                <ErrorLabel content={caregiverError} />
              </div>

              {/* Khách hàng được chăm sóc */}
              <div className={`form-group ${!customerError ? '' : 'has-error'}`}>
                <label>
                  {translate('crm.care.customer')}
                  <span className='text-red'>*</span>
                </label>
                {listCustomers && (
                  <SelectBox
                    id={`customer-care-edit-customer-${careEditId}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={listCustomers}
                    value={[careEditting.customer]}
                    onChange={handleChangeCustomer}
                    multiple={true}
                  />
                )}
                <ErrorLabel content={customerError} />
              </div>

              {/* Tên công việc */}
              <div className={`form-group ${!nameError ? '' : 'has-error'}`}>
                <label>
                  {translate('crm.care.name')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={careEditting.name ? careEditting.name : ''}
                  onChange={handleChangeName}
                />
                <ErrorLabel content={nameError} />
              </div>

              {/* Mô tả công việc chăm sóc */}
              <div className='form-group'>
                <label>
                  {translate('crm.care.description')}
                  <span className='text-red'>*</span>
                </label>
                <QuillEditor
                  id={'editCare'}
                  getTextData={handleChangeDescription}
                  quillValueDefault={careEditting.quillValueDefault}
                  table={false}
                />
                <ErrorLabel content={descriptionError} />
              </div>

              {/* Loại hình chăm sóc khách hàng */}
              <div className={`form-group ${!careTypeError ? '' : 'has-error'}`}>
                <label>
                  {translate('crm.care.careType')}
                  <span className='text-red'>*</span>
                </label>
                {careEditting.customerCareTypes && listCareTypes && (
                  <SelectBox
                    id={`customer-careType-edit-care-type-${careEditId}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={listCareTypes}
                    value={careEditting.customerCareTypes}
                    onChange={handleChangeCareType}
                    multiple={true}
                  />
                )}
                <ErrorLabel content={careTypeError} />
              </div>

              {/* Trạng thái công việc */}
              <div className={`form-group ${!statusError ? '' : 'has-error'}`}>
                <label style={{ marginRight: '10px' }}>{translate('crm.care.status')} : </label>
                {items[careEditting.status]}
                <ErrorLabel content={statusError} />
              </div>

              {/* Thời gian thực hiện */}
              <div className={`form-group ${!startDateError ? '' : 'has-error'}`}>
                <label>
                  {translate('crm.care.startDate')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker
                  id={`startDate-care-edit-start-date-${careEditId}`}
                  value={careEditting.startDate ? careEditting.startDate : ''}
                  onChange={handleChangeStartDate}
                  disabled={false}
                />
                <ErrorLabel content={startDateError} />
              </div>

              {/* Thời gian kết thúc */}
              <div className='form-group'>
                <label>{translate('crm.care.endDate')}</label>
                <DatePicker
                  id={`endDate-care-edit-end-date${careEditId}`}
                  value={careEditting.endDate ? careEditting.endDate : ''}
                  onChange={handleChangeEndDate}
                  disabled={false}
                />
              </div>
            </form>
          </div>
        )}
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { crm, user } = state
  return { crm, user }
}

const mapDispatchToProps = {
  getCare: CrmCareActions.getCare,
  editCare: CrmCareActions.editCare,
  getCares: CrmCareActions.getCares
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditCareForm))
