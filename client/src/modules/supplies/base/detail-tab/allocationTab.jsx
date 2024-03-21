import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { getPropertyOfValue } from '../../../../helpers/stringMethod'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { AllocationDetail } from '../../admin/allocation-history/components/AllocationDetail'

function AllocationTab(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    id: null
  })

  // Function format dữ liệu Date thành string
  const formatDate = (date, monthYear = false) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    if (monthYear === true) {
      return [month, year].join('-')
    } else {
      return [day, month, year].join('-')
    }
  }

  if (prevProps.id !== props.id) {
    setState({
      ...state,
      id: props.id,
      allocationHistory: props.allocationHistory
    })
    setPrevProps(props)
  }

  const { id } = props
  const { translate, user, department, suppliesReducer } = props
  const { currentRow } = state

  var userList = user.list,
    departmentList = department.list
  // Bắt sự kiện click xem thông tin cấp phát
  const handleView = async (value) => {
    await setState({
      ...state,
      currentRow: value
    })
    window.$('#modal-view-allocation').modal('show')
  }

  return (
    <div id={id} className='tab-pane'>
      <div className='box-body qlcv'>
        {/* Bảng hoa don */}
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>{translate('supplies.allocation_management.date')}</th>
              <th style={{ width: '20%' }}>{translate('supplies.allocation_management.quantity')}</th>
              <th style={{ width: '25%' }}>{translate('supplies.allocation_management.allocationToOrganizationalUnit')}</th>
              <th style={{ width: '20%' }}>{translate('supplies.allocation_management.allocationToUser')}</th>
              <th style={{ width: '20%', textAlign: 'center' }}>{translate('table.action')}</th>
            </tr>
          </thead>
          <tbody>
            {suppliesReducer.listAllocation &&
              suppliesReducer.listAllocation.length !== 0 &&
              suppliesReducer.listAllocation.map((x, index) => (
                <tr key={index}>
                  <td>{x.date ? formatDate(x.date) : ''}</td>
                  <td>{x.quantity}</td>
                  <td>{getPropertyOfValue(x.allocationToOrganizationalUnit, 'name', false, departmentList)}</td>
                  <td>{getPropertyOfValue(x.allocationToUser, 'email', false, userList)}</td>
                  <td>
                    <a
                      className='edit text-green'
                      style={{ width: '5px' }}
                      title={translate('manage_example.detail_info_example')}
                      onClick={() => handleView(x)}
                    >
                      <i className='material-icons'>visibility</i>
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(!suppliesReducer.listAllocation || suppliesReducer.listAllocation.length === 0) && (
          <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        {/* </fieldset> */}
        {/* Form xem thông tin cấp phát */}
        {currentRow && (
          <AllocationDetail
            _id={currentRow._id}
            supplies={currentRow.supplies}
            allocationToOrganizationalUnit={currentRow.allocationToOrganizationalUnit}
            quantity={currentRow.quantity}
            allocationToUser={currentRow.allocationToUser}
            date={currentRow.date}
          />
        )}
      </div>
    </div>
  )
}

function mapState(state) {
  const { auth, user, department, suppliesReducer } = state
  return { auth, user, department, suppliesReducer }
}

const actionCreators = {
  getUser: UserActions.get,
  getAllDepartments: DepartmentActions.get
}

const allocationTab = connect(mapState, actionCreators)(withTranslate(AllocationTab))
export { allocationTab as AllocationTab }
