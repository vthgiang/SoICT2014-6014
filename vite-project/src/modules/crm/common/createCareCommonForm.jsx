import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonModal, DatePicker, DialogModal, QuillEditor, SelectBox } from '../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import { CrmCustomerActions } from '../customer/redux/actions'
import { CrmCareTypeActions } from '../careType/redux/action'
import { UserActions } from '../../super-admin/user/redux/actions'
import { connect } from 'react-redux'
import getEmployeeSelectBoxItems from '../../task/organizationalUnitHelper'
import { CrmCareActions } from '../care/redux/action'
import { getData } from '.'

CreateCareCommonForm.propTypes = {}

function CreateCareCommonForm(props) {
  const { translate, type, customerId, crm, user, role, auth } = props
  const { careTypes } = crm
  const [customer, setCustomer] = useState()
  const [newCustomerCare, setNewCustomerCare] = useState({})
  useEffect(() => {
    props.getCustomer(customerId)
    // props.getAllEmployeeOfUnitByRole(localStorage.getItem('currentRole'));
    // props.getDepartment();
  }, [customerId])

  //lay danh sach nhan vien
  let unitMembers
  if (user.usersOfChildrenOrganizationalUnit) {
    unitMembers = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit)
  }

  //lay thong tin nguoi dung hien tai cho selectbox
  let userSelectBox
  if (auth && auth.user) userSelectBox = { value: auth.user._id, text: auth.user.name }

  let listCareTypes
  // Lấy hình thức chắm sóc khách hàng
  if (careTypes) {
    listCareTypes = careTypes.list.map((o) => ({ value: o._id, text: o.name }))
  }

  /**
   * ham xu ly khi nguoi phu trach thay doi
   */
  const handleChangeCustomerCareStaff = async (value) => {
    const newCustomerCareInput = { ...newCustomerCare, customerCareStaffs: value }
    await setNewCustomerCare(newCustomerCareInput)
  }
  /**
   * ham xu ly khi ten hoat dong CSKH thay doi
   */
  const handleChangeName = async (e) => {
    const value = e.target.value
    const newCustomerCareInput = { ...newCustomerCare, name: value }
    await setNewCustomerCare(newCustomerCareInput)
  }

  /**
   * ham xu ly khi loai hoat dong thay doi
   */
  const handleChangeCareType = async (value) => {
    const newCustomerCareInput = { ...newCustomerCare, customerCareTypes: value }
    await setNewCustomerCare(newCustomerCareInput)
  }
  /**
   * ham xu ly khi do uu tien thay doi
   */
  const handleChangePriority = async (value) => {
    const newCustomerCareInput = { ...newCustomerCare, priority: value[0] }
    await setNewCustomerCare(newCustomerCareInput)
  }
  /**
   * ham xu ly khi thoi gian bat dau thay doi
   */
  const handleChangeStartDate = async (value) => {
    const newCustomerCareInput = { ...newCustomerCare, startDate: value }
    await setNewCustomerCare(newCustomerCareInput)
  }
  /**
   * ham xu ly khi loai hoat dong thay doi
   */
  const handleChangeEndDate = async (value) => {
    const newCustomerCareInput = { ...newCustomerCare, endDate: value }
    await setNewCustomerCare(newCustomerCareInput)
  }
  /**
   * Hàm xử lý khi mô tả công việc chăm sóc khách  hàng thay đổi
   * @param {*} data
   */
  const handleChangeDescription = async (data, imgs) => {
    const newCustomerCareInput = { ...newCustomerCare, description: data }
    await setNewCustomerCare(newCustomerCareInput)
  }

  const save = () => {
    const newCustomerCareInput = { ...newCustomerCare, customer: customerId }
    console.log('input', newCustomerCareInput)
    props.createCare(newCustomerCareInput)
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-crm-care-common-create'
        formID='form-crm-care-common-create'
        title={translate('crm.care.add')}
        func={save}
        size={75}
        // disableSubmit={!this.isFormValidated()}
      >
        <form id='form-crm-care-create'>
          {/* Nhân viên phụ trách */}
          <div className={`form-group`}>
            <label>{translate('crm.care.caregiver')}</label>
            {unitMembers && userSelectBox && (
              <SelectBox
                id={`caregiver-care`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={getData.getRole(role) == 'employee' ? [userSelectBox] : unitMembers[0].value}
                onChange={handleChangeCustomerCareStaff}
                multiple={true}
                options={{ placeholder: translate('crm.care.caregiver') }}
              />
            )}
            {/* <ErrorLabel content={groupCodeError} /> */}
          </div>

          {/* Khách hàng được chăm sóc */}
          {type == 1 ? (
            <div className={`form-group`}>
              <label style={{ marginRight: '10px' }}>{translate('crm.care.customer')}:</label>
              {crm.customers.customerById && <strong> {crm.customers.customerById.name} </strong>}
              {/* <ErrorLabel content={groupCodeError} /> */}
            </div>
          ) : (
            <div className={`form-group`}>
              <label style={{ marginRight: '10px' }}>{'Nhóm khách hàng'}:</label>
              {<span>Nhóm khách hàng bán buôn</span>}
              {/* <ErrorLabel content={groupCodeError} /> */}
            </div>
          )}
          {/* Tên công việc */}
          <div className={`form-group`}>
            <label>{translate('crm.care.name')}</label>
            <input type='text' className='form-control' onChange={handleChangeName} />
            {/* <ErrorLabel content={groupNameError} /> */}
          </div>

          {/* Mô tả công việc chăm sóc */}
          <div className='form-group'>
            <label>{translate('crm.care.description')}</label>
            <QuillEditor id={'createCommonCare'} getTextData={handleChangeDescription} table={false} />
          </div>

          {/* Loại hình chăm sóc khách hàng */}
          <div className='form-group'>
            <label>{translate('crm.care.careType')}</label>
            {listCareTypes && (
              <SelectBox
                id={`customer-careType`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={listCareTypes}
                // value={newCare.careType ? newCare.careType : []}
                onChange={handleChangeCareType}
                multiple={false}
                options={{ placeholder: translate('crm.care.careType') }}
              />
            )}
          </div>
          {/* Độ ưu tiên */}
          <div className='form-group'>
            <label>{'Độ ưu tiên: '}</label>
            <SelectBox
              id={`status-care`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: '', text: '---Chọn---' },
                { value: 1, text: 'Ưu tiên thấp' },
                { value: 2, text: 'Ưu tiên tiêu chuẩn' },
                { value: 3, text: 'Ưu tiên cao' }
              ]}
              //    value={newCare.status ? newCare.status : ''}
              onChange={handleChangePriority}
              multiple={false}
            />
          </div>

          {/* Thời gian thực hiện */}
          <div className='form-group'>
            <label>{translate('crm.care.startDate')}</label>
            <DatePicker
              id='startDate-form-care'
              //   value={newCare.startDate ? newCare.startDate : ''}
              onChange={handleChangeStartDate}
              disabled={false}
            />
          </div>

          {/* Thời gian kết thúc */}
          <div className='form-group'>
            <label>{translate('crm.care.endDate')}</label>
            <DatePicker
              id='endDate-form-care'
              // value={newCare.endDate ? newCare.endDate : ''}
              onChange={handleChangeEndDate}
              disabled={false}
            />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}
function mapStateToProps(state) {
  const { crm, auth, user, role } = state
  return { crm, auth, user, role }
}

const mapDispatchToProps = {
  getCustomer: CrmCustomerActions.getCustomer,
  editCustomer: CrmCustomerActions.editCustomer,

  // getDepartment: UserActions.getDepartmentOfUser,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
  createCare: CrmCareActions.createCare
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateCareCommonForm))
