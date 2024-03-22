import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CrmCustomerActions } from '../redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { DialogModal } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'
import { formatFunction } from '../../common/index'
import { getStorage } from '../../../../config'

import GeneralTabEditForm from './generalTabEditForm'
import FileTabEditForm from './fileTabEditForm'
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter'
import './customer.css'
import EditCustomerStatusForm from './editCustomerStatusForm'

function CrmCustomerEdit(props) {
  const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 }
  const currentRole = getStorage('currentRole')
  let dataStatus = DATA_STATUS.NOT_AVAILABLE
  const [editingCustomer, setEdittingCustomer] = useState({})
  const { user, crm, customerIdEdit, translate, auth } = props
  const [statusChangeHistory, setStatusChangeHistory] = useState({})
  useEffect(() => {
    async function initData() {
      const customer = crm.customers.customerById
      console.log('VAO EFFECT', crm)
      if (customer) {
        const newEditingCustomer = {
          ...customer,
          loaded: true,
          owner: customer.owner ? customer.owner.map((o) => o._id) : [],
          code: customer.code ? customer.code : '',
          name: customer.name ? customer.name : '',
          customerType: customer.customerType ? parseInt(customer.customerType) : '',
          company: customer.company ? customer.company : '',
          represent: customer.represent ? customer.represent : '',
          gender: customer.gender ? customer.gender : '',
          taxNumber: customer.taxNumber ? customer.taxNumber : '',

          customerSource: customer.customerSource ? customer.customerSource : '',
          companyEstablishmentDate: customer.companyEstablishmentDate ? formatFunction.formatDate(customer.companyEstablishmentDate) : '',
          birthDate: customer.birthDate ? formatFunction.formatDate(customer.birthDate) : '',
          telephoneNumber: customer.telephoneNumber ? customer.telephoneNumber : '',
          mobilephoneNumber: customer.mobilephoneNumber ? customer.mobilephoneNumber : '',
          email: customer.email ? customer.email : '',
          email2: customer.email2 ? customer.email2 : '',

          status: customer.status ? customer.status : [], //.map(o => o._id)
          group: customer.group ? customer.group._id : '',
          address: customer.address ? customer.address : '',
          address2: customer.address2 ? customer.address2 : '',
          location: customer.location ? customer.location : '',
          website: customer.website ? customer.website : '',
          note: customer.note ? customer.note : '',
          linkedIn: customer.linkedIn ? customer.linkedIn : '',

          statusHistories:
            customer.statusHistories && customer.statusHistories.length > 0
              ? customer.statusHistories.map((o) => ({
                  createdAt: o.createdAt,
                  oldValue: o.oldValue ? o.oldValue : null,
                  newValue: o.newValue,
                  createdBy: o.createdBy,
                  description: o.description ? o.description : ''
                }))
              : [],
          files: customer.files ? customer.files : []
        }
        await setEdittingCustomer(newEditingCustomer)
        dataStatus = 1
      }
    }
    initData()
  }, [crm])

  useEffect(() => {
    props.getCustomer(props.customerIdEdit)

    if (user.organizationalUnitsOfUser) {
      let getCurrentUnit = user.organizationalUnitsOfUser.find(
        (item) => item.managers[0] === currentRole || item.deputyManagers[0] === currentRole || item.employees[0] === currentRole
      )

      // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
      if (getCurrentUnit) {
        props.getChildrenOfOrganizationalUnits(getCurrentUnit._id)
      }
    }
  }, [customerIdEdit])

  /**
   * hàm set các giá trị lấy từ component con vào state
   * @param {*} name
   * @param {*} value
   */
  const myCallBack = async (name, value) => {
    const newEditingCustomer = {
      ...editingCustomer,
      [name]: value
    }
    console.log('newEditingCustomer', newEditingCustomer)
    await setEdittingCustomer(newEditingCustomer)
  }

  /**
   * Hàm kiểm tra validate
   */
  const isFormValidated = () => {
    const { name, taxNumber } = editingCustomer

    if (!ValidationHelper.validateName(translate, name).status || !ValidationHelper.validateInvalidCharacter(translate, taxNumber).status)
      return false
    return true
  }

  const handleChangeStatus = (value) => {
    setStatusChangeHistory(value)
    console.log(value)
  }

  const save = async () => {
    let formData
    let newEditingCustomer = { ...editingCustomer }
    if (statusChangeHistory.newStatus) {
      // lấy trạng thái cũ của khách hàng
      const oldStatus = editingCustomer.status
      // lấy trạng thái mới
      const { newStatus, description } = statusChangeHistory

      //lấy danh sách trạng thái khách hàng trước khi edit (lịch sử cũ)
      let { statusHistories } = editingCustomer
      console.log('history', statusHistories)

      const getDateTime = new Date()

      // Lưu lại lịch sủ thay đổi trạng thái
      if (oldStatus[0]._id != newStatus[0]) {
        console.log('CŨ', oldStatus[0]._id)
        console.log('Mới', newStatus[0])

        statusHistories = [
          ...statusHistories,
          {
            oldValue: oldStatus[0]._id,
            newValue: newStatus[0],
            createdAt: getDateTime,
            createdBy: auth.user._id,
            description: description
          }
        ]
        newEditingCustomer = { ...editingCustomer, statusHistories, status: [newStatus] }
      }
    }
    // setEdittingCustomer(newEditingCustomer);

    formData = convertJsonObjectToFormData(newEditingCustomer)
    if (newEditingCustomer.files) {
      newEditingCustomer.files.forEach((o) => {
        formData.append('fileAttachment', o.fileUpload)
      })
    }

    if (isFormValidated) {
      props.editCustomer(customerIdEdit, formData)
    }
  }

  console.log('editnow', editingCustomer)
  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-crm-customer-edit'
        isLoading={crm.customers.isLoading}
        formID='form-crm-customer-edit'
        title={translate('crm.customer.edit')}
        size={75}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa khách hàng  */}
        <div className='nav-tabs-custom'>
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a href='#customer-general-edit-form' data-toggle='tab'>
                Chỉnh sửa thông tin khách hàng{' '}
              </a>
            </li>
            <li>
              <a href='#customer-fileAttachment' data-toggle='tab'>
                Tài liệu liên quan
              </a>
            </li>
          </ul>
          <div className='tab-content'>
            {/* Tab thông tin chung */}
            {editingCustomer.loaded && (
              <GeneralTabEditForm
                id={'customer-general-edit-form'}
                callBackFromParentEditForm={myCallBack}
                editingCustomer={editingCustomer}
                customerIdEdit={customerIdEdit}
                handleChangeStatusCallBack={handleChangeStatus}
              />
            )}
            {/* Tab chỉnh sửa trạng thái */}
            {/* {
                                editingCustomer && dataStatus === 3 &&
                                <div>
                                   <EditCustomerStatusForm/>
                                </div>
                            } */}

            {/* Tab file liên quan đến khách hàng */}
            {editingCustomer != {} && (
              <FileTabEditForm
                id='customer-fileAttachment'
                files={editingCustomer.files}
                customerIdEdit={customerIdEdit}
                callBackFromParentEditForm={myCallBack}
              />
            )}
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { crm, auth, user } = state
  return { crm, auth, user }
}

const mapDispatchToProps = {
  getCustomer: CrmCustomerActions.getCustomer,
  editCustomer: CrmCustomerActions.editCustomer,

  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerEdit))
