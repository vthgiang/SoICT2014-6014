import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DeleteNotification, PaginateBar } from '../../../../../common-components'
// import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { TransportDepartmentCreateForm } from '../components/transportDepartmentCreateForm'
import { TransportDepartmentDetails } from './transportDepartmentDetails'

import { transportDepartmentActions } from '../redux/actions'
function TransportDepartmentManagementTable(props) {
  let { listTransportDepartments } = props

  const [currentDepartment, setCurrentDepartment] = useState()

  useEffect(() => {
    props.getAllTransportDepartments({ page: 1, limit: 100 })
  }, [])

  const handleShowDetailBusinessDepartment = (businessDepartment) => {
    console.log(businessDepartment, ' okkkkkk')
    setCurrentDepartment(businessDepartment)
    window.$('#modal-department-details').modal('show')
  }

  const getManager = (businessDepartment) => {
    let res = ''
    if (businessDepartment && businessDepartment.type && businessDepartment.type.length !== 0) {
      let role1 = businessDepartment.type.filter((r) => Number(r.roleTransport) === 1)
      if (role1 && role1.length !== 0) {
        if (role1[0].roleOrganizationalUnit && role1[0].roleOrganizationalUnit.length !== 0) {
          role1[0].roleOrganizationalUnit.map((organizationalUnit) => {
            if (organizationalUnit.users && organizationalUnit.users.length !== 0) {
              organizationalUnit.users.map((item, index) => {
                if (index !== 0) {
                  res += ', '
                }
                res += item.userId?.name
              })
            }
          })
        }
      }
    }
    return res
  }

  const handleDelete = (id) => {
    console.log(id)
    props.deleteTransportDepartment(id)
  }

  return (
    <React.Fragment>
      <div className='box-body qlcv'>
        <TransportDepartmentCreateForm />
        <TransportDepartmentDetails currentDepartment={currentDepartment} />
        {/* <table id={tableId} className="table table-striped table-bordered table-hover"> */}
        <table id={'tableId'} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>{'STT'}</th>
              <th>{'Tên đơn vị'}</th>
              <th>{'Trưởng đơn vị'}</th>
              <th>{'Vai trò'}</th>
              {/* <th style={{ width: "120px", textAlign: "center" }}>
                                    {translate("table.action")}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={["STT", "Tên đơn vị", "Trưởng đơn vị", "Vai trò"]}
                                        setLimit={this.setLimit}
                                    />
                                </th> */}
            </tr>
          </thead>
          <tbody>
            {listTransportDepartments &&
              listTransportDepartments.length !== 0 &&
              listTransportDepartments.map((businessDepartment, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{businessDepartment.organizationalUnit ? businessDepartment.organizationalUnit.name : '---'}</td>
                  <td>{getManager(businessDepartment)}</td>
                  {/* <td>{roleConvert[businessDepartment.role]}</td> */}
                  <td style={{ textAlign: 'center' }}>
                    <a
                      style={{ width: '5px' }}
                      title={'Xem chi tiết'}
                      onClick={() => {
                        handleShowDetailBusinessDepartment(businessDepartment)
                      }}
                    >
                      <i className='material-icons'>view_list</i>
                    </a>
                    <DeleteNotification
                      // content={translate('manage_example.delete')}
                      content={'Xóa đơn vị vận chuyển '}
                      data={{
                        id: businessDepartment?._id,
                        info: businessDepartment?.organizationalUnit?.name
                      }}
                      func={handleDelete}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  // console.log(state);
  const { transportDepartment } = state
  const listTransportDepartments = state?.transportDepartment?.lists
  return { listTransportDepartments, transportDepartment }
}

const actions = {
  getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
  deleteTransportDepartment: transportDepartmentActions.deleteTransportDepartment
}

const connectedTransportDepartmentManagementTable = connect(mapState, actions)(withTranslate(TransportDepartmentManagementTable))
export { connectedTransportDepartmentManagementTable as TransportDepartmentManagementTable }
