import parse from 'html-react-parser'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { Comment, DatePicker, SelectBox, ToolTip } from '../../../../../common-components'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions'
import { ModalCopyKPIUnit } from '../../management/component/organizationalUnitKpiCopyModal'
import { createUnitKpiActions } from '../redux/actions'
import { EmployeeImportancesModal } from './employeeImportancesModal'
import { OrganizationalUnitImportancesModal } from './organizationalUnitImportancesModal'
import { OrganizationalUnitKpiAddTargetModal } from './organizationalUnitKpiAddTargetModal'
import { OrganizationalUnitKpiCreateModal } from './organizationalUnitKpiCreateModal'
import { OrganizationalUnitKpiEditTargetModal } from './organizationalUnitKpiEditTargetModal'
import AllocationToOrganizationalUnit from './kpi-allocation/allocationToOrganizationalUnit'

const convertTargetKpi = (target, unit) => {
  return target ? `${new Intl.NumberFormat().format(target)} (${unit})` : 'Hoàn thành mục tiêu'
}

const formatDate = (date) => {
  const d = new Date(date)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  const year = d.getFullYear()
  return [month, year].join('-')
}

function OrganizationalUnitKpiCreate(props) {
  const translate = useTranslate()
  const { type, selectBoxAllUnit } = props
  const dispatch = useDispatch()

  const dashboardEvaluationEmployeeKpiSet = useSelector((state) => state.dashboardEvaluationEmployeeKpiSet)
  const createKpiUnit = useSelector((state) => state.createKpiUnit)
  const user = useSelector((state) => state.user)
  const department = useSelector((state) => state.department)

  const d = new Date()
  const currentMonth = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()

  const [state, setState] = useState({
    defaultDate: [currentMonth, year].join('-'),
    organizationalUnit: null,
    organizationalUnitId: null,
    month: [year, currentMonth].join('-'),
    infoSearch: {
      organizationalUnit: null,
      organizationalUnitId: null,
      month: [year, currentMonth].join('-')
    },
    adding: false,
    editing: false,
    submitted: false,
    currentRole: localStorage.getItem('currentRole'),
    userId: localStorage.getItem('userId'),
    subUnits: []
  })

  const {
    id,
    organizationalUnitId,
    month,
    selectBoxUnit,
    currentRole,
    organizationalUnit,
    defaultDate,
    organizationalUnitKpi,
    infoSearch
    // subUnits
  } = state

  /** Hàm khởi tạo select box chọn đơn vị */
  const setSelectBoxOrganizationalUnit = () => {
    const childrenOrganizationalUnit = []
    const queue = []
    const currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit

    if (currentOrganizationalUnit) {
      childrenOrganizationalUnit.push(currentOrganizationalUnit)
      queue.push(currentOrganizationalUnit)
      while (queue.length > 0) {
        const v = queue.shift()
        if (v.children) {
          for (let i = 0; i < v.children.length; i++) {
            const u = v.children[i]
            queue.push(u)
            childrenOrganizationalUnit.push(u)
          }
        }
      }
    }

    setState((prevState) => ({
      ...prevState,
      organizationalUnit: childrenOrganizationalUnit?.[0],
      organizationalUnitId: childrenOrganizationalUnit?.[0]?.id,
      selectBoxUnit: childrenOrganizationalUnit,
      infoSearch: {
        ...prevState.infoSearch,
        organizationalUnitId: childrenOrganizationalUnit?.[0]?.id,
        organizationalUnit: childrenOrganizationalUnit?.[0]
      }
    }))
  }

  useEffect(() => {
    if (type !== 'for-admin') {
      dispatch(DepartmentActions.getDepartmentsThatUserIsManager())
      dispatch(DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem('currentRole')))
      dispatch(UserActions.getDepartmentOfUser())
      dispatch(createUnitKpiActions.getCurrentKPIUnit(localStorage.getItem('currentRole')))
      dispatch(createUnitKpiActions.getKPIParent({ roleId: localStorage.getItem('currentRole') }))
    }
  }, [type])

  useEffect(() => {
    if (type !== 'for-admin') {
      if (organizationalUnitId && !dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit) {
        setState((prevState) => ({ ...prevState, organizationalUnitId: null }))
      }

      if (!organizationalUnitId && dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit) {
        setSelectBoxOrganizationalUnit()
      }
    }
  }, [organizationalUnitId, dashboardEvaluationEmployeeKpiSet, type])

  // Trường hợp Admin truy cập
  useEffect(() => {
    if (type === 'for-admin' && selectBoxAllUnit && !organizationalUnitId) {
      setState((prevState) => ({
        ...prevState,
        organizationalUnit: selectBoxAllUnit?.[0],
        organizationalUnitId: selectBoxAllUnit?.[0]?.id,
        selectBoxUnit: selectBoxAllUnit,
        infoSearch: {
          ...prevState.infoSearch,
          organizationalUnitId: selectBoxAllUnit?.[0]?.id,
          organizationalUnit: selectBoxAllUnit?.[0]
        }
      }))

      dispatch(createUnitKpiActions.getCurrentKPIUnit(null, selectBoxAllUnit?.[0]?.id))
    }
  })

  const cancelKPIUnit = (event, idKpiUnit, status) => {
    event.preventDefault()
    Swal.fire({
      title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_cancel_approve'),
      type: 'success',
      showCancelButton: true,
      cancelButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel'),
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
    }).then((res) => {
      if (res.value) {
        dispatch(createUnitKpiActions.editKPIUnit(idKpiUnit, { status }, 'edit-status'))
      }
    })
  }

  const approveKPIUnit = (event, currentStatus, currentKPI, status) => {
    event.preventDefault()
    const totalWeight = currentKPI.kpis.map((item) => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)
    if (currentStatus === 1) {
      Swal.fire({
        title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approve_already'),
        type: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      })
    } else if (totalWeight === 100) {
      Swal.fire({
        title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approve'),
        type: 'success',
        showCancelButton: true,
        cancelButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel'),
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      }).then((res) => {
        if (res.value) {
          dispatch(createUnitKpiActions.editKPIUnit(currentKPI._id, { status }, 'edit-status'))
        }
      })
    } else {
      Swal.fire({
        title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_not_enough_weight'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      })
    }
  }

  const deleteKPI = (status, id) => {
    if (status === 1) {
      Swal.fire({
        title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approving'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      })
    } else {
      Swal.fire({
        title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_delete_success'),
        type: 'success',
        showCancelButton: true,
        cancelButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel'),
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      }).then((res) => {
        if (res.value) {
          dispatch(createUnitKpiActions.deleteKPIUnit(id))
        }
      })
    }
  }

  const deleteTargetKPIUnit = (status, id, organizationalUnitKpiSetId) => {
    if (status === 1) {
      Swal.fire({
        title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approving'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      })
    } else {
      Swal.fire({
        title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_kpi'),
        type: 'success',
        showCancelButton: true,
        cancelButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel'),
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      }).then((res) => {
        if (res.value) {
          dispatch(createUnitKpiActions.deleteTargetKPIUnit(id, organizationalUnitKpiSetId))
        }
      })
    }
  }

  const handleSelectOrganizationalUnit = (value) => {
    const organizationalUnitValue = selectBoxUnit.filter((item) => item.id === value[0])

    setState({
      ...state,
      organizationalUnitId: value[0],
      infoSearch: {
        ...state.infoSearch,
        organizationalUnitId: value[0],
        organizationalUnit: organizationalUnitValue?.[0]
      }
    })
  }

  const handleChangeDate = (value) => {
    let month = value
    if (value !== '') {
      month = `${value.slice(3, 7)}-${value.slice(0, 2)}`
    }

    setState({
      ...state,
      infoSearch: {
        ...state.infoSearch,
        month
      }
    })
  }

  const handleSearchData = () => {
    setState({
      ...state,
      month: infoSearch?.month,
      organizationalUnitId: infoSearch?.organizationalUnitId,
      organizationalUnit: infoSearch?.organizationalUnit
    })

    if (infoSearch?.organizationalUnitId && infoSearch?.month && infoSearch?.month !== '') {
      dispatch(createUnitKpiActions.getCurrentKPIUnit(currentRole, infoSearch?.organizationalUnitId, infoSearch?.month))
      dispatch(
        createUnitKpiActions.getKPIParent({
          roleId: currentRole,
          organizationalUnitId: infoSearch?.organizationalUnitId,
          month: infoSearch?.month
        })
      )
    }
  }

  const checkEmittingPermission = (currentUnit) => {
    const parentUnit = currentUnit?.parent || currentUnit?.parent_id
    const parentKpi = createKpiUnit?.parent

    if (!parentUnit) return true
    if (!parentKpi) return false
    return parentKpi.status === 1
  }

  const swalOfUnitKpi = (typeButton) => {
    switch (typeButton) {
      case 'add_target':
        return Swal.fire({
          title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.add_new_target.activated'),
          type: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đồng ý'
        })
      case 'edit':
        return Swal.fire({
          title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.activated'),
          type: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đồng ý'
        })
      case 'delete':
        return Swal.fire({
          title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.activated'),
          type: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đồng ý'
        })
      case 'edit_employee_importance':
        return Swal.fire({
          title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance_activated'),
          type: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đồng ý'
        })
      case 'edit_organizational_unit_importance':
        return Swal.fire({
          title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_importance_activated'),
          type: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đồng ý'
        })
      default:
        return null
    }
  }

  const handleEditOrganizationalUnitKPi = (organizationalUnitKpiId, organizationalUnitKpi, organizationalUnitKpiSet) => {
    setState({
      ...state,
      id: organizationalUnitKpiId,
      organizationalUnitKpi
    })

    if (organizationalUnitKpiSet && organizationalUnitKpiSet.status === 1) {
      swalOfUnitKpi('edit')
    } else {
      window.$(`#editTargetKPIUnit`).modal('show')
    }
  }

  const swalEdittingPermission = () => {
    const parentKpi = createKpiUnit && createKpiUnit.parent
    if (!parentKpi) {
      Swal.fire({
        title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_initialize_organiztional_unit_kpi'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      })
    } else {
      Swal.fire({
        title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_activate_organiztional_unit_kpi'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
      })
    }
  }

  let unitList
  let currentKPI
  let organizationalUnitKpiLoading
  let organizationalUnitsOfUserLoading
  let childrenOrganizationalUnitLoading

  const parentKpi = createKpiUnit && createKpiUnit.parent

  if (dashboardEvaluationEmployeeKpiSet) {
    childrenOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
  }

  if (user) {
    organizationalUnitsOfUserLoading = user.organizationalUnitsOfUserLoading
    unitList = user.organizationalUnitsOfUser
  }

  if (createKpiUnit) {
    currentKPI = createKpiUnit.currentKPI
    organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading
  }

  let listUnitOfUser
  let listIdOfExistUnit = []

  if (department) {
    listUnitOfUser = department.departmentsThatUserIsManager
  }

  const listOrganizationalUnitCopy = selectBoxUnit?.filter((item) => {
    return (
      (organizationalUnit?.parent_id && item?.parent_id === organizationalUnit?.parent_id) || item?.id === organizationalUnit?.parent_id
    )
  })

  if (listOrganizationalUnitCopy?.length > 0) {
    listIdOfExistUnit = listOrganizationalUnitCopy.map((item) => item?.id)
  }

  if (!listIdOfExistUnit?.includes(createKpiUnit?.parent?.organizationalUnit?._id) && listOrganizationalUnitCopy) {
    const parentKPI = createKpiUnit?.parent?.organizationalUnit

    if (parentKPI) {
      listOrganizationalUnitCopy.push({
        ...parentKPI,
        id: parentKPI?._id
      })
      listIdOfExistUnit.push(parentKPI?._id)
    }
  }

  if (listUnitOfUser?.length > 0 && listOrganizationalUnitCopy) {
    listUnitOfUser.forEach((item) => {
      if (item?.parent === organizationalUnit?.parent_id && !listIdOfExistUnit?.includes(item?._id)) {
        listOrganizationalUnitCopy.push({
          ...item,
          id: item?._id
        })
        listIdOfExistUnit.push(item?._id)
      }
    })
  }

  const isHavingOrganizationalUnits = () => {
    return (
      <div className='box-body'>
        <h4>Bạn chưa có đơn vị</h4>
      </div>
    )
  }

  const renderComponent = () => {
    return (
      <section>
        <div className='qlcv' style={{ marginLeft: '-5px' }}>
          {selectBoxUnit && (
            <div className='form-inline'>
              <div className='form-group'>
                <label style={{ width: 'auto' }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                <SelectBox
                  id='organizationalUnitSelectBoxInOrganizationalUnitKpi'
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={selectBoxUnit.map((item) => {
                    return { value: item.id, text: item.name }
                  })}
                  multiple={false}
                  onChange={handleSelectOrganizationalUnit}
                  value={organizationalUnitId}
                />
              </div>

              <div className='form-group'>
                <label style={{ width: 'auto' }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                <DatePicker
                  id='monthInOrganizationalUnitKpi'
                  dateFormat='month-year'
                  value={defaultDate}
                  onChange={handleChangeDate}
                  disabled={false}
                />
              </div>

              <button type='button' className='btn btn-success' onClick={handleSearchData}>
                {translate('kpi.general.show')}
              </button>
            </div>
          )}
        </div>

        <div className='box'>
          {currentKPI ? (
            <>
              <div className='box-body'>
                <OrganizationalUnitKpiEditTargetModal
                  id={id}
                  organizationalUnitKpi={organizationalUnitKpi}
                  organizationalUnit={currentKPI.organizationalUnit}
                />
                <div style={{ marginLeft: '-10px' }}>
                  {/* Xóa KPI tháng */}
                  <a className='btn btn-app' onClick={() => deleteKPI(currentKPI.status, currentKPI._id)} title='Xóa KPI tháng'>
                    <i className='fa fa-trash' style={{ fontSize: '16px' }} />
                    {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.delete')}
                  </a>

                  {/* Kich hoạt KPI tháng */}
                  {currentKPI.status === 0 ? (
                    <a
                      className='btn btn-app'
                      onClick={
                        checkEmittingPermission(currentKPI && currentKPI.organizationalUnit)
                          ? (event) => approveKPIUnit(event, currentKPI.status, currentKPI, 1)
                          : () => swalEdittingPermission()
                      }
                    >
                      <i className='fa fa-rocket' style={{ fontSize: '16px' }} />
                      {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.approve')}
                    </a>
                  ) : (
                    <a
                      className='btn btn-app'
                      onClick={
                        checkEmittingPermission(currentKPI && currentKPI.organizationalUnit)
                          ? (event) => cancelKPIUnit(event, currentKPI._id, 0)
                          : () => swalEdittingPermission()
                      }
                    >
                      <i className='fa fa-lock' style={{ fontSize: '16px' }} />
                      {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel_approve')}
                    </a>
                  )}

                  {/* Thêm mục tiêu */}
                  {checkEmittingPermission(currentKPI && currentKPI.organizationalUnit) ? (
                    <span>
                      {currentKPI.status === 1 ? (
                        <a className='btn btn-app' onClick={() => swalOfUnitKpi('add_target')}>
                          <i className='fa fa-plus-circle' style={{ fontSize: '16px' }} />
                          {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.add_target')}
                        </a>
                      ) : (
                        <span>
                          <a
                            className='btn btn-app'
                            data-toggle='modal'
                            data-target='#modal-add-target'
                            data-backdrop='static'
                            data-keyboard='false'
                          >
                            <i className='fa fa-plus-circle' style={{ fontSize: '16px' }} />
                            {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.add_target')}
                          </a>
                          <OrganizationalUnitKpiAddTargetModal
                            organizationalUnitKpiSetId={currentKPI._id}
                            organizationalUnit={currentKPI.organizationalUnit}
                          />
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>
                      <a className='btn btn-app' onClick={() => swalEdittingPermission()}>
                        <i className='fa fa-plus-circle' style={{ fontSize: '16px' }} />
                        {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.add_target')}
                      </a>
                    </span>
                  )}

                  {/* Chỉnh sửa độ quan trọng của nhân viên */}
                  {checkEmittingPermission(currentKPI && currentKPI.organizationalUnit) ? (
                    <span>
                      {currentKPI.status === 1 ? (
                        <a className='btn btn-app' onClick={() => swalOfUnitKpi('edit_employee_importance')}>
                          <i className='fa fa-child' style={{ fontSize: '16px' }} />
                          {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}
                        </a>
                      ) : (
                        <span>
                          <a
                            className='btn btn-app'
                            data-toggle='modal'
                            data-target='#employee-importances'
                            data-backdrop='static'
                            data-keyboard='false'
                          >
                            <i className='fa fa-child' style={{ fontSize: '16px' }} />
                            {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}
                          </a>
                          <EmployeeImportancesModal
                            organizationalUnit={currentKPI.organizationalUnit}
                            organizationalUnitId={currentKPI.organizationalUnit && currentKPI.organizationalUnit._id}
                            month={month}
                          />
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>
                      <a className='btn btn-app' onClick={() => swalEdittingPermission()}>
                        <i className='fa fa-child' style={{ fontSize: '16px' }} />
                        {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}
                      </a>
                    </span>
                  )}

                  {/* Chỉnh sửa độ quan trọng của đơn vị con */}
                  {selectBoxUnit?.filter((item) => item?.id === currentKPI?.organizationalUnit?._id)?.[0]?.children && (
                    <span>
                      {checkEmittingPermission(currentKPI && currentKPI.organizationalUnit) ? (
                        <span>
                          {currentKPI.status === 1 ? (
                            <a className='btn btn-app' onClick={() => swalOfUnitKpi('edit_organizational_unit_importance')}>
                              <i className='fa fa-university' style={{ fontSize: '16px' }} />
                              {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_importance')}
                            </a>
                          ) : (
                            <span>
                              <a
                                className='btn btn-app'
                                data-toggle='modal'
                                data-target='#organizational-unit-importances'
                                data-backdrop='static'
                                data-keyboard='false'
                              >
                                <i className='fa fa-university' style={{ fontSize: '16px' }} />
                                {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_importance')}
                              </a>
                              <OrganizationalUnitImportancesModal
                                organizationalUnit={selectBoxUnit?.filter((item) => item?.id === currentKPI?.organizationalUnit?._id)?.[0]}
                                organizationalUnitId={currentKPI.organizationalUnit && currentKPI.organizationalUnit._id}
                                month={month}
                              />
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>
                          <a className='btn btn-app' onClick={() => swalEdittingPermission()}>
                            <i className='fa fa-university' style={{ fontSize: '16px' }} />
                            {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_importance')}
                          </a>
                        </span>
                      )}
                    </span>
                  )}

                  {/* Phân bổ KPI phòng ban xuống kpi đơn vị */}
                  {selectBoxUnit?.filter((item) => item?.id === currentKPI?.organizationalUnit?._id)?.[0]?.children && (
                    <span>
                      {checkEmittingPermission(currentKPI && currentKPI.organizationalUnit) ? (
                        <span>
                          {currentKPI.status === 1 ? (
                            <a className='btn btn-app' onClick={() => swalOfUnitKpi('edit_organizational_unit_importance')}>
                              <i className='fa fa-university' style={{ fontSize: '16px' }} />
                              {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_kpi_allocation')}
                            </a>
                          ) : (
                            <span>
                              <a
                                className='btn btn-app'
                                data-toggle='modal'
                                data-target='#allocation-kpi-into-unit'
                                data-backdrop='static'
                                data-keyboard='false'
                              >
                                <i className='fa fa-pie-chart' style={{ fontSize: '16px' }} />
                                {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_kpi_allocation')}
                              </a>
                              <AllocationToOrganizationalUnit month={month} currentKPI={currentKPI} />
                              {/* <OrganizationalUnitImportancesModal
                                organizationalUnit={selectBoxUnit?.filter((item) => item?.id === currentKPI?.organizationalUnit?._id)?.[0]}
                                organizationalUnitId={currentKPI.organizationalUnit && currentKPI.organizationalUnit._id}
                                month={month}
                              /> */}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>
                          <a className='btn btn-app' onClick={() => swalEdittingPermission()}>
                            <i className='fa fa-university' style={{ fontSize: '16px' }} />
                            {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.organizational_unit_kpi_allocation')}
                          </a>
                        </span>
                      )}
                    </span>
                  )}

                  {/* Phân bổ KPI phòng ban xuống cá nhân và task */}
                </div>

                <div className=''>
                  <h4 style={{ display: 'inline-block', fontWeight: '600' }}>
                    KPI {currentKPI.organizationalUnit ? currentKPI.organizationalUnit.name : 'Đơn vị đã bị xóa'} {formatDate(month)}
                  </h4>

                  <div className='form-group'>
                    <span>
                      {currentKPI.kpis.reduce((sum) => sum + 1, 0)}{' '}
                      {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target')} -&nbsp;
                      {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight_total')} &nbsp;
                      {currentKPI.kpis.map((item) => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100
                    </span>
                    {currentKPI.kpis.map((item) => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ? (
                      <span className='text-danger' style={{ fontWeight: 'bold' }}>
                        {' '}
                        - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_satisfied')}{' '}
                      </span>
                    ) : (
                      <span className='text-success' style={{ fontWeight: 'bold' }}>
                        {' '}
                        - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.satisfied')}{' '}
                      </span>
                    )}
                    {currentKPI.status === 1 ? (
                      <span className='text-success' style={{ fontWeight: 'bold' }}>
                        {' '}
                        - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.approved')}
                      </span>
                    ) : (
                      <span className='text-danger' style={{ fontWeight: 'bold' }}>
                        {' '}
                        - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_approved')}
                      </span>
                    )}
                  </div>

                  {/* Bảng các mục tiêu của KPI */}
                  <table className='table table-bordered table-striped table-hover'>
                    <thead>
                      <tr>
                        <th title='Số thứ tự' style={{ width: '40px' }}>
                          {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}
                        </th>
                        <th title='Tên mục tiêu'>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target_name')}</th>
                        {currentKPI?.organizationalUnit?.parent && (
                          <th title='Mục tiêu cha'>
                            {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.parents_target')}
                          </th>
                        )}
                        <th title='Tiêu chí đánh giá'>
                          {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.evaluation_criteria')}
                        </th>
                        <th title='Chỉ tiêu'>Chỉ tiêu</th>
                        <th title='Trọng số' className='col-sort-number' style={{ width: '100px' }}>
                          {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight')}
                        </th>
                        <th style={{ width: '100px' }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentKPI.kpis.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td title={item.name}>{item.name}</td>
                          {currentKPI?.organizationalUnit?.parent && <td title={item?.parent?.name}>{item?.parent?.name}</td>}
                          <td title={parse(item.criteria)}>{parse(item.criteria)}</td>
                          <td title={item.target}>{convertTargetKpi(item.target, item.unit)}</td>
                          <td title={item.weight}>{item.weight}</td>
                          <td>
                            <a
                              className='edit'
                              title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.edit')}
                              data-toggle='modal'
                              data-backdrop='static'
                              data-keyboard='false'
                              onClick={
                                checkEmittingPermission(currentKPI && currentKPI.organizationalUnit)
                                  ? () => handleEditOrganizationalUnitKPi(item._id, item, currentKPI)
                                  : () => swalEdittingPermission()
                              }
                            >
                              <i className='material-icons'></i>
                            </a>

                            {item.type === 0 ? (
                              <a
                                href='#abc'
                                className='delete'
                                title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.delete_title')}
                                onClick={
                                  checkEmittingPermission(currentKPI && currentKPI.organizationalUnit)
                                    ? () => deleteTargetKPIUnit(currentKPI.status, item._id, currentKPI._id)
                                    : () => swalEdittingPermission()
                                }
                              >
                                <i className='material-icons'></i>
                              </a>
                            ) : (
                              <ToolTip
                                type='icon_tooltip'
                                materialIcon='help'
                                dataTooltip={[translate('kpi.organizational_unit.create_organizational_unit_kpi_set.content')]}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className='row'
                style={{ display: 'flex', flex: 'no-wrap', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <div className='col-xs-12 col-sm-12 col-md-6'>
                  <Comment
                    data={currentKPI}
                    comments={currentKPI.comments}
                    createComment={(dataId, data) => props.createComment(dataId, data)}
                    editComment={(dataId, commentId, data) => props.editComment(dataId, commentId, data)}
                    deleteComment={(dataId, commentId) => props.deleteComment(dataId, commentId)}
                    createChildComment={(dataId, commentId, data) => props.createChildComment(dataId, commentId, data)}
                    editChildComment={(dataId, commentId, childCommentId, data) =>
                      props.editChildComment(dataId, commentId, childCommentId, data)
                    }
                    deleteChildComment={(dataId, commentId, childCommentId) => props.deleteChildComment(dataId, commentId, childCommentId)}
                    deleteFileComment={(fileId, commentId, dataId) => props.deleteFileComment(fileId, commentId, dataId)}
                    deleteFileChildComment={(fileId, commentId, childCommentId, dataId) =>
                      props.deleteFileChildComment(fileId, commentId, childCommentId, dataId)
                    }
                    downloadFile={(path, fileName) => props.downloadFile(path, fileName)}
                  />
                </div>
              </div>
            </>
          ) : (
            organizationalUnitKpiLoading &&
            (childrenOrganizationalUnitLoading || type === 'for-admin') && (
              <div className='box-body'>
                <div style={{ marginLeft: '-10px' }}>
                  <div>
                    {/* Khởi tạo KPI */}
                    {checkEmittingPermission(organizationalUnit) ? (
                      <span>
                        <a
                          className='btn btn-app'
                          data-toggle='modal'
                          data-target='#startKPIUnit'
                          data-backdrop='static'
                          data-keyboard='false'
                        >
                          <i className='fa fa-calendar-plus-o' style={{ fontSize: '16px' }} />
                          {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.initialize_kpi_newmonth')}{' '}
                          {formatDate(month)}
                        </a>
                        <OrganizationalUnitKpiCreateModal organizationalUnit={organizationalUnit} month={month} />
                      </span>
                    ) : (
                      // Cảnh báo đơn vị cha chưa kích hoạt KPI
                      <a
                        className='btn btn-app'
                        data-toggle='modal'
                        data-backdrop='static'
                        data-keyboard='false'
                        onClick={() => swalEdittingPermission()}
                      >
                        <i className='fa fa-calendar-plus-o' style={{ fontSize: '16px' }} />
                        {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.initialize_kpi_newmonth')}{' '}
                        {formatDate(month)}
                      </a>
                    )}

                    {/* Sao chép mục tiêu từ KPI đơn vị cha */}
                    {checkEmittingPermission(organizationalUnit) ? (
                      <span>
                        <a
                          className='btn btn-app'
                          data-toggle='modal'
                          data-target={`#copy-old-kpi-to-new-time-${parentKpi?._id ?? 'unit'}`}
                          data-backdrop='static'
                          data-keyboard='false'
                        >
                          <i className='fa fa-copy' style={{ fontSize: '16px' }} />
                          {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.copy_kpi_unit')}
                        </a>
                        <ModalCopyKPIUnit
                          kpiId={parentKpi?._id ?? 'unit'}
                          idunit={organizationalUnit?.id}
                          organizationalUnitSelect={listOrganizationalUnitCopy}
                          kpiunit={parentKpi}
                          editMonth
                          monthDefault={month}
                          type='copy-parent-kpi-to-unit'
                        />
                      </span>
                    ) : (
                      (organizationalUnit?.parent || organizationalUnit?.parent_id) && (
                        <span>
                          <a className='btn btn-app' onClick={() => swalEdittingPermission()}>
                            <i className='fa fa-copy' style={{ fontSize: '16px' }} />
                            {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.copy_kpi_unit')}
                          </a>
                        </span>
                      )
                    )}

                    {/* Sử dụng mẫu KPI */}
                    <span>
                      <a className='btn btn-app' href='/template-kpi-unit'>
                        <i className='fa fa-sticky-note-o' style={{ fontSize: '16px' }} />
                        Sử dụng mẫu KPI
                      </a>
                    </span>
                  </div>
                </div>
                <h4 style={{ display: 'inline-block', fontWeight: '600' }}>KPI {organizationalUnit && organizationalUnit.name}</h4>
                <p>
                  {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_initialize')} {formatDate(month)}
                </p>
              </div>
            )
          )}
        </div>
      </section>
    )
  }

  return (unitList && unitList.length !== 0) || type === 'for-admin'
    ? renderComponent()
    : organizationalUnitsOfUserLoading && isHavingOrganizationalUnits()
}

export default OrganizationalUnitKpiCreate
