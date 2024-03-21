import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'

import { UserActions } from '../../../../super-admin/user/redux/actions'
import { createKpiSetActions } from '../redux/actions'

import { DialogModal, SelectBox } from '../../../../../../src/common-components'
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper'

var translate = ''
function ModalCreateEmployeeKpiSet(props) {
  var translate = props.translate
  const [state, setState] = useState({
    _id: null,
    employeeKpiSet: {
      organizationalUnit: '',
      approver: null,
      month: ''
    },
    adding: false
  })

  const { createKpiUnit } = props
  const { _id, employeeKpiSet, organizationalUnit, managers } = state
  let parentKpi

  useEffect(() => {
    props.getAllUserSameDepartment(localStorage.getItem('currentRole'))
  }, [])

  useEffect(() => {
    setState({
      ...state,
      employeeKpiSet: {
        ...state.employeeKpiSet,
        organizationalUnit: props?.organizationalUnit?._id,
        month: props.month,
        approver: props.managers?.[1]?.value?.[0]?.value ? props.managers?.[1]?.value?.[0]?.value : props.managers?.[0]?.value?.[0]?.value
      },
      managers: props.managers,
      organizationalUnit: props.organizationalUnit,
      month: props.month
    })
  }, [props.managers, props?.organizationalUnit?._id, props.month])

  /**Thay đổi người phê duyệt */
  const handleApproverChange = (value) => {
    setState({
      ...state,
      employeeKpiSet: {
        ...state.employeeKpiSet,
        approver: value[0]
      }
    })
  }

  /**Gửi request khởi tạo tập KPI cá nhân mới */
  const handleCreateEmployeeKpiSet = async () => {
    const { employeeKpiSet } = state

    if (employeeKpiSet.approver) {
      //&& employeeKpiSet.creator
      props.createEmployeeKpiSet(employeeKpiSet)
      window.$('#createEmployeeKpiSet').modal('hide')
    }
  }

  function formatDate(date) {
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

    return [month, year].join('-')
  }

  if (createKpiUnit) {
    parentKpi = createKpiUnit?.currentKPI?.kpis
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID='createEmployeeKpiSet'
        isLoading={false}
        formID='formCreateEmployeeKpiSet'
        title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.initialize_kpi_set')}
        msg_success={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.success')}
        msg_failure={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.failure')}
        func={handleCreateEmployeeKpiSet}
      >
        <form
          className='form-group'
          id='formCreateEmployeeKpiSet'
          onSubmit={() => handleCreateEmployeeKpiSet(translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.success'))}
        >
          {/* Tên đơn vị */}
          <div className='form-group'>
            <label className='col-sm-2'>
              {translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.organizational_unit')}
            </label>
            <label className='col-sm-10' style={{ fontWeight: '400', marginLeft: '-2.5%' }}>
              {organizationalUnit && organizationalUnit.name}
            </label>
          </div>

          {/* Tháng */}
          <div className='form-group'>
            <label className='col-sm-2'>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.month')}</label>
            {formatDate(employeeKpiSet.month)}
          </div>

          {/**Chọn người phê duyệt tập KPI này */}
          {managers && (
            <div className='col-sm-12 form-group'>
              <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
              <SelectBox
                id={`createEmployeeKpiSet${_id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={managers}
                multiple={false}
                onChange={handleApproverChange}
                value={employeeKpiSet?.approver}
              />
            </div>
          )}
          <div className='col-sm-12 form-group'>
            <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.default_target')}</label>
            <ul>
              {parentKpi?.length > 0 &&
                parentKpi.filter((item) => item?.type !== 0).map((item) => <li key={item?._id}>{item?.name} (5)</li>)}
            </ul>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}
function mapState(state) {
  const { user, createKpiUnit, department, createEmployeeKpiSet } = state
  return { user, createKpiUnit, department, createEmployeeKpiSet }
}

const actionCreators = {
  getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
  createEmployeeKpiSet: createKpiSetActions.createEmployeeKpiSet
}

const connectedModalCreateEmployeeKpiSet = connect(mapState, actionCreators)(withTranslate(ModalCreateEmployeeKpiSet))
export { connectedModalCreateEmployeeKpiSet as ModalCreateEmployeeKpiSet }
