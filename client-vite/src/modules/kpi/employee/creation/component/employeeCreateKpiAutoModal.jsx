import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../../common-components'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions'
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions'

const formatDate = (date) => {
  const d = new Date(date)
  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) {
    month = `0${month}`
  }

  if (day.length < 2) {
    day = `0${day}`
  }

  return [month, year].join('-')
}

/** Thay đổi ngày tháng */
const convertMMYYtoYYMM = (value) => {
  return `${value.slice(3, 7)}-${value.slice(0, 2)}`
}

function EmployeeCreateKpiAutoModal(props) {
  const { translate, user, createKpiUnit, department } = props
  const { organizationalUnit, organizationalUnitId, month, childrenOrganizationalUnit } = props

  const [employeeImportancesState, setEmployeeImportancesState] = useState(null)
  const [state, setState] = useState({
    date: null,
    idUnit: null,
    employees: {},
    employeeIds: [],
    formula: '(employeePoint * progressPoint * resultPoint) / 10000'
  })
  const { employees, employeeIds, idUnit, date, formula } = state

  const handleClickCheck = (id) => {
    const employee = employees
    const employeeIds = []
    employee[id].check = !employee[id].check
    for (const key in employee) {
      if (employee[key].check) {
        employeeIds.push(employee[key].id)
      }
    }
    setState({
      ...state,
      employees: employee,
      employeeIds
    })
  }

  const handleChangeFormula = (e) => {
    setState({
      ...state,
      formula: e.target.value
    })
  }

  const handleSubmit = () => {
    const data = {
      employees: employeeIds,
      approver: localStorage.getItem('userId'),
      month,
      organizationalUnit: organizationalUnitId,
      formula
    }

    props.createEmployeeKpiSetAuto(data)
  }

  const isFormValidated = () => {
    let error
    if (employeeImportancesState && employeeImportancesState.length !== 0) {
      error = employeeImportancesState.filter((item) => !item?.status)
    }

    return error?.length !== 0
  }

  useEffect(() => {
    if (idUnit && date) {
      props.getCurrentKPIUnit(localStorage.getItem('currentRole'), idUnit, date)
      props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: [idUnit], callApi: true })
    }
  }, [idUnit, date])

  // Get data employee
  useEffect(() => {
    if (createKpiUnit?.currentKPI) {
      const employeeOfUnit = {}
      const employeeIds = []
      for (const item of createKpiUnit.currentKPI.employeeImportances) {
        employeeOfUnit[item?.employee?.id] = {
          id: item?.employee?.id,
          name: item?.employee?.name,
          check: true
        }
        employeeIds.push(item?.employee?.id)
      }
      setState({
        ...state,
        employees: employeeOfUnit,
        employeeIds
      })
    }
  }, [createKpiUnit])
  return (
    <DialogModal
      modalID='employee-create-kpi-auto'
      isLoading={false}
      formID='form-employee-create-kpi-auto'
      title='Tự động thiết lập KPI nhân viên'
      msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
      msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
      func={handleSubmit}
      hasNote={false}
      disableSubmit={false}
    >
      {/* Form khởi tạo KPI đơn vị */}
      <form
        id='form-employee-create-kpi-auto'
        onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}
      >
        <div className='row' style={{ marginBottom: 10 }}>
          <div className='col-md-12'>
            {/** Công thức tính của mẫu công việc */}
            <div className=''>
              <label className='control-label' htmlFor='inputFormula'>
                Công thức tính tỉ lệ hoàn thành KPI
              </label>
              <br />
              <input
                style={{ width: '100%', margin: '10px 0px' }}
                type='text'
                className='form-control'
                id='inputFormula'
                placeholder='(employeePoint * progressPoint * resultPoint) / 10000'
                value={formula}
                onChange={handleChangeFormula}
              />
              <div>
                <span style={{ fontWeight: 800 }}> Ví dụ: </span>
                (employeePoint * progressPoint * resultPoint) / 10000
              </div>
              <div>
                <span style={{ fontWeight: 800 }}>Tham số:</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>employeePoint</span> - Điểm đánh giá nhân viên
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>progressPoint</span> - Điểm quá trình
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>resultPoint</span> - Điểm kết quả
              </div>
            </div>
          </div>
        </div>
        {idUnit && date && !createKpiUnit.currentKPI ? (
          <div>Đơn vị chưa thiết lập KPI</div>
        ) : (
          <div>
            <label className='control-label' htmlFor='inputFormula' style={{ marginBottom: 10 }}>
              Danh sách nhân viên{' '}
            </label>
            <br />
            <table className='table table-hover table-bordered'>
              <thead>
                <tr>
                  <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}>
                    {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}
                  </th>
                  <th title={translate('kpi.evaluation.employee_evaluation.name')}>
                    {translate('kpi.evaluation.employee_evaluation.name')}
                  </th>
                  {/* <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}</th> */}
                  <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}>Chọn</th>
                </tr>
              </thead>
              <tbody>
                {employees &&
                  Object.values(employees).map((item, index) => (
                    <tr key={organizationalUnitId + index}>
                      <td style={{ width: '20px' }}>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type='checkbox'
                          checked={employees[item.id].check}
                          onClick={() => {
                            handleClickCheck(item.id)
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  const { user, createKpiUnit, department } = state
  return { user, createKpiUnit, department }
}
const actions = {
  getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
  createEmployeeKpiSetAuto: DashboardEvaluationEmployeeKpiSetAction.createEmployeeKpiSetAuto,
  getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
  getAllEmployeeKpiSetOfUnitByIds: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds
}

const connectedEmployeeCreateKpiAutoModal = connect(mapState, actions)(withTranslate(EmployeeCreateKpiAutoModal))
export { connectedEmployeeCreateKpiAutoModal as EmployeeCreateKpiAutoModal }
