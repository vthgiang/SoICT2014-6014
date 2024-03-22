import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import { generateCode } from '../../../../../helpers/generateCode'
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate'
import ValidationHelper from '../../../../../helpers/validationHelper'

import { transportDepartmentActions } from '../redux/actions'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'

function TransportDepartmentCreateForm(props) {
  let { allDepartments, transportDepartment } = props

  // Chứa 2 giá trị 2 trường nhập vào và lỗi
  const [formState, setFormState] = useState({
    _id: ''
  })

  const [formRoleUnit1, setFormRoleUnit1] = useState({
    roleId: []
  })

  const [formRoleUnit2, setFormRoleUnit2] = useState({
    roleId: []
  })

  const [formRoleUnit3, setFormRoleUnit3] = useState({
    roleId: []
  })

  const [selectedOrganizationalUnit, setSelectedOrganizationalUnit] = useState({})

  const save = () => {
    let data = {
      organizationalUnit: formState._id,
      type: [
        {
          roleTransport: 1,
          roleOrganizationalUnit: formRoleUnit1.roleId
        },
        {
          roleTransport: 2,
          roleOrganizationalUnit: formRoleUnit2.roleId
        },
        {
          roleTransport: 3,
          roleOrganizationalUnit: formRoleUnit3.roleId
        }
      ]
    }
    props.createTransportDepartment(data)
  }
  /**
   * Xác thực form
   */
  const isFormValidated = () => {
    // if (formState._id!=="" && formState.value!=="title") return true;
    if (formRoleUnit1?.roleId?.length !== 0 && formRoleUnit2?.roleId?.length !== 0 && formRoleUnit3?.roleId?.length !== 0) return true
    else return false
  }
  const getListDepartmentArr = () => {
    let listDepartmentArr = [
      {
        value: '',
        text: '---Chọn đơn vị---'
      }
    ]
    allDepartments &&
      allDepartments.length !== 0 &&
      allDepartments.map((item, index) => {
        let flag = true
        console.log(transportDepartment)
        if (transportDepartment && transportDepartment.lists && transportDepartment.lists.length !== 0) {
          console.log('okkkkkkkkkkkkkkkkkkkkkkkkkkk')
          transportDepartment.lists.map((item2) => {
            console.log(item2, ' plll')
            if (!flag) return
            if (String(item2.organizationalUnit?._id) === String(item._id)) {
              flag = false
            }
          })
        }
        if (flag) {
          listDepartmentArr.push({
            value: item._id,
            text: item.name
          })
        }
      })
    return listDepartmentArr
  }

  const handleOrganizationalUnitChange = (value) => {
    setFormState({
      ...formState,
      _id: value[0]
    })
    setFormRoleUnit1()
    setFormRoleUnit2()
    setFormRoleUnit3()
    let selectedUnit = allDepartments.filter((r) => String(r._id) === String(value[0]))
    if (selectedUnit && selectedUnit.length !== 0) {
      setSelectedOrganizationalUnit(selectedUnit[0])
    } else {
      setSelectedOrganizationalUnit({})
    }
    console.log(selectedUnit)
  }

  const handleRole1Change = (value) => {
    let listUser = []
    if (value && value.length !== 0) {
      value.map((roleId) => {
        let list = getListUserByRoleId(roleId).listUserByRole
        if (list && list.length !== 0) {
          listUser = listUser.concat(list)
        }
      })
    }
    setFormRoleUnit1({
      ...formRoleUnit1,
      roleId: value,
      users: listUser
    })
  }

  const handleRole2Change = (value) => {
    let listUser = []
    if (value && value.length !== 0) {
      value.map((roleId) => {
        let list = getListUserByRoleId(roleId).listUserByRole
        if (list && list.length !== 0) {
          listUser = listUser.concat(list)
        }
      })
    }
    setFormRoleUnit2({
      ...formRoleUnit2,
      roleId: value,
      users: listUser
    })
  }

  const handleRole3Change = (value) => {
    let listUser = []
    if (value && value.length !== 0) {
      value.map((roleId) => {
        let list = getListUserByRoleId(roleId).listUserByRole
        if (list && list.length !== 0) {
          listUser = listUser.concat(list)
        }
      })
    }
    setFormRoleUnit3({
      ...formRoleUnit3,
      roleId: value,
      users: listUser
    })
  }

  const getListValueRole = () => {
    let res = []
    if (selectedOrganizationalUnit) {
      if (selectedOrganizationalUnit.managers && selectedOrganizationalUnit.managers.length !== 0) {
        selectedOrganizationalUnit.managers.map((item) => {
          res.push({
            value: item._id,
            text: item.name
          })
        })
      }
      if (selectedOrganizationalUnit.deputyManagers && selectedOrganizationalUnit.deputyManagers.length !== 0) {
        selectedOrganizationalUnit.deputyManagers.map((item) => {
          res.push({
            value: item._id,
            text: item.name
          })
        })
      }
      if (selectedOrganizationalUnit.employees && selectedOrganizationalUnit.employees.length !== 0) {
        selectedOrganizationalUnit.employees.map((item) => {
          res.push({
            value: item._id,
            text: item.name
          })
        })
      }
    }
    if (!(res && res.length !== 0)) {
      res = []
      // res.push({
      //     value: "title",
      //     text: "Không có vai trò"
      // })
    }
    return res
  }

  const getListUserByRoleId = (roleId) => {
    let listUserByRole = []
    let currentRole
    if (selectedOrganizationalUnit) {
      if (selectedOrganizationalUnit.managers && selectedOrganizationalUnit.managers.length !== 0) {
        selectedOrganizationalUnit.managers.map((item) => {
          if (String(item._id) === String(roleId)) {
            currentRole = item
          }
        })
      }
      if (selectedOrganizationalUnit.deputyManagers && selectedOrganizationalUnit.deputyManagers.length !== 0) {
        selectedOrganizationalUnit.deputyManagers.map((item) => {
          if (String(item._id) === String(roleId)) {
            currentRole = item
          }
        })
      }
      if (selectedOrganizationalUnit.employees && selectedOrganizationalUnit.employees.length !== 0) {
        selectedOrganizationalUnit.employees.map((item) => {
          if (String(item._id) === String(roleId)) {
            currentRole = item
          }
        })
      }
    }
    if (currentRole && currentRole.users && currentRole.users.length !== 0) {
      currentRole.users.map((user) => {
        listUserByRole.push(user.userId)
      })
    }
    return { listUserByRole, currentRole }
  }

  useEffect(() => {
    props.getAllDepartments()
  }, [])

  return (
    <React.Fragment>
      <ButtonModal
        // onButtonCallBack={handleClickCreateCode}
        modalID={'modal-create-transport-deparment'}
        button_name={'Thêm cấu hình đơn vị'}
        title={'Thêm cấu hình đơn vị'}
      />
      <DialogModal
        modalID='modal-create-transport-deparment'
        isLoading={false}
        formID='form-create-transport-requirements'
        title={'Phân vai trò đơn vị vận chuyển'}
        msg_success={'success'}
        msg_failure={'fail'}
        func={save}
        disableSubmit={!isFormValidated()}
        size={50}
        maxWidth={500}
      >
        <form id='form-create-business-department'>
          <div className={`form-group`}>
            <label>
              {'Đơn vị'}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`select-organizational-unit-create-for-transport-department`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={formState._id}
              items={getListDepartmentArr()}
              onChange={handleOrganizationalUnitChange}
              multiple={false}
            />
            {/* <ErrorLabel content={organizationalUnitError} /> */}
          </div>
          <div className={`form-group`}>
            {/* <div className="box box-solid"> */}
            <label>
              {'Vai trò phê duyệt yêu cầu, tạo kế hoạch vận chuyển'}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`select-role-for-transport-department-1`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={''}
              items={getListValueRole()}
              onChange={handleRole1Change}
              multiple={true}
            />
            {formRoleUnit1 && formRoleUnit1.users && formRoleUnit1.users.length !== 0 && (
              <table id={`select-role-for-transport-department-1`} className='table table-striped table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                  </tr>
                </thead>
                <tbody>
                  {formRoleUnit1.users.map(
                    (item, index) =>
                      item && (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            )}
            {/* <ErrorLabel content={roleError} /> */}
            {/* </div> */}

            {/* <div className="box box-solid"> */}
            <label>
              {'Vai trò giám sát thực hiện kế hoạch vận chuyển'}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`select-role-for-transport-department-2`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={''}
              items={getListValueRole()}
              onChange={handleRole2Change}
              multiple={true}
            />
            {formRoleUnit2 && formRoleUnit2.users && formRoleUnit2.users.length !== 0 && (
              <table id={`select-role-for-transport-department-2`} className='table table-striped table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                  </tr>
                </thead>
                <tbody>
                  {formRoleUnit2.users.map(
                    (item, index) =>
                      item && (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            )}
            {/* <ErrorLabel content={roleError} /> */}
            {/* </div> */}

            {/* <div className="box box-solid"> */}
            <label>
              {'Vai trò nhân viên tham gia vận chuyển'}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`select-role-for-transport-department-3`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={''}
              items={getListValueRole()}
              onChange={handleRole3Change}
              multiple={true}
            />
            {formRoleUnit3 && formRoleUnit3.users && formRoleUnit3.users.length !== 0 && (
              <table id={`select-role-for-transport-department-1`} className='table table-striped table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                  </tr>
                </thead>
                <tbody>
                  {formRoleUnit3.users.map(
                    (item, index) =>
                      item && (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            )}
            {/* <ErrorLabel content={roleError} /> */}
            {/* </div> */}
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const allDepartments = state.department?.list
  const { transportDepartment } = state
  return { allDepartments, transportDepartment }
}

const actions = {
  getAllDepartments: DepartmentActions.get,
  createTransportDepartment: transportDepartmentActions.createTransportDepartment
}

const connectedTransportDepartmentCreateForm = connect(mapState, actions)(withTranslate(TransportDepartmentCreateForm))
export { connectedTransportDepartmentCreateForm as TransportDepartmentCreateForm }
