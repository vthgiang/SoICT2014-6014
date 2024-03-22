import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'
import { SelectBox } from '../../../../common-components/index'

import { performTaskAction } from './../redux/actions'

function CollaboratedWithOrganizationalUnits(props) {
  const [state, setState] = useState({
    isAssigned: false,
    responsibleEmployees: undefined,
    consultedEmployees: undefined,
    accountableEmployees: undefined,

    employeeCollaboratedWithUnit: {
      isAssigned: false,
      responsibleEmployees: undefined,
      consultedEmployees: undefined,
      accountableEmployees: undefined
    },

    unitId: undefined,
    editCollaboratedTask: false
  })
  const { task, translate } = props
  const {
    editCollaboratedTask,
    employeeCollaboratedWithUnit,
    employeeSelectBox,
    unitId,
    responsibleEmployees,
    consultedEmployees,
    accountableEmployees,
    isAssigned
  } = state

  useEffect(() => {
    props.getTaskLog(props.performtasks.task._id)
  }, [props.performtasks.task.logs])

  if (props.unitId !== state.unitId) {
    // Xử lý nhân viên tham gia công việc phối hợp đơn vị
    let responsibleEmployees = [],
      consultedEmployees = [],
      accountableEmployees = [],
      isAssigned = false
    let employeeSelectBox = props.employeeSelectBox && props.employeeSelectBox.value
    let task = props.task

    if (employeeSelectBox && employeeSelectBox.length !== 0) {
      if (task) {
        if (task.responsibleEmployees && task.responsibleEmployees.length !== 0) {
          task.responsibleEmployees
            .filter((item) => {
              let temp = employeeSelectBox.filter((employee) => employee.value === item._id)
              if (temp && temp.length !== 0) return true
            })
            .map((item) => {
              if (item) {
                responsibleEmployees.push(item._id)
              }
            })

          task.consultedEmployees
            .filter((item) => {
              let temp = employeeSelectBox.filter((employee) => employee.value === item._id)
              if (temp && temp.length !== 0) return true
            })
            .map((item) => {
              if (item) {
                consultedEmployees.push(item._id)
              }
            })
          task.accountableEmployees
            .filter((item) => {
              let temp = employeeSelectBox.filter((employee) => employee.value === item._id)
              if (temp && temp.length !== 0) return true
            })
            .map((item) => {
              if (item) {
                accountableEmployees.push(item._id)
              }
            })
        }

        if (task.collaboratedWithOrganizationalUnits && task.collaboratedWithOrganizationalUnits.length !== 0) {
          let currentUnit = task.collaboratedWithOrganizationalUnits.filter((item) => {
            if (item.organizationalUnit && item.organizationalUnit._id === props.employeeSelectBox.id) {
              return true
            }
          })
          if (currentUnit && currentUnit[0]) {
            isAssigned = currentUnit[0].isAssigned
          }
        }
      }
    }

    setState({
      ...state,
      unitId: props.unitId,
      employeeSelectBox: props.employeeSelectBox,
      task: props.task,

      isAssigned: isAssigned,
      responsibleEmployees: responsibleEmployees,
      consultedEmployees: consultedEmployees,
      accountableEmployees: accountableEmployees,

      employeeCollaboratedWithUnit: {
        isAssigned: isAssigned,
        responsibleEmployees: responsibleEmployees,
        consultedEmployees: consultedEmployees,
        accountableEmployees: accountableEmployees
      }
    })
  }

  /** Xác nhận phân công công việc */
  const handleCheckBoxAssigned = () => {
    setState({
      ...state,
      isAssigned: !state.isAssigned
    })
  }

  /** Chỉnh sửa người tham gia */
  const handleCancelEditCollaboratedTask = () => {
    const { employeeCollaboratedWithUnit } = state
    setState({
      ...state,
      editCollaboratedTask: false,
      responsibleEmployees: employeeCollaboratedWithUnit?.responsibleEmployees,
      consultedEmployees: employeeCollaboratedWithUnit?.consultedEmployees,
      accountableEmployees: employeeCollaboratedWithUnit?.accountableEmployees,
      isAssigned: employeeCollaboratedWithUnit?.isAssigned
    })
  }

  /** Chọn người thực hiện cho công việc phối hợp với đơn vị khác */
  const handleChangeResponsibleCollaboratedTask = (value) => {
    setState({
      ...state,
      responsibleEmployees: value
    })
  }

  /** Chọn người hỗ trợ cho công việc phối hợp với đơn vị khác */
  const handleChangeConsultedCollaboratedTask = (value) => {
    setState({
      ...state,
      consultedEmployees: value
    })
  }

  /** Chọn người phê duyệt cho công việc phối hợp với đơn vị khác */
  const handleChangeAccountableCollaboratedTask = (value) => {
    setState({
      ...state,
      accountableEmployees: value
    })
  }

  /** Lưu thay đổi nhân viên tham gia công việc phối hợp với đơn vị khác */
  const saveCollaboratedTask = (taskId) => {
    const { employeeCollaboratedWithUnit, responsibleEmployees, consultedEmployees, accountableEmployees, isAssigned, unitId } = state

    let newEmployeeCollaboratedWithUnit = {
      unitId: unitId,
      isAssigned: isAssigned,
      oldResponsibleEmployees: employeeCollaboratedWithUnit?.responsibleEmployees,
      oldConsultedEmployees: employeeCollaboratedWithUnit?.consultedEmployees,
      oldAccountableEmployees: employeeCollaboratedWithUnit?.accountableEmployees,
      responsibleEmployees: responsibleEmployees,
      consultedEmployees: consultedEmployees,
      accountableEmployees: accountableEmployees
    }

    props.editEmployeeCollaboratedWithOrganizationalUnits(taskId, newEmployeeCollaboratedWithUnit)

    setState({
      ...state,
      editCollaboratedTask: false,
      employeeCollaboratedWithUnit: {
        ...state.employeeCollaboratedWithUnit,
        isAssigned: isAssigned,
        responsibleEmployees: responsibleEmployees,
        consultedEmployees: consultedEmployees,
        accountableEmployees: accountableEmployees
      }
    })
  }

  let responsibleEmployeesOfUnit, consultedEmployeesOfUnit, accountableEmployeesOfUnit
  if (employeeCollaboratedWithUnit) {
    if (employeeCollaboratedWithUnit?.responsibleEmployees?.length > 0 && task?.responsibleEmployees?.length > 0) {
      responsibleEmployeesOfUnit = task.responsibleEmployees.filter((item) => {
        if (employeeCollaboratedWithUnit.responsibleEmployees.includes(item._id)) {
          return true
        }
      })
    }
    if (employeeCollaboratedWithUnit?.consultedEmployees?.length > 0 && task?.consultedEmployees?.length > 0) {
      consultedEmployeesOfUnit = task.consultedEmployees.filter((item) => {
        if (employeeCollaboratedWithUnit.consultedEmployees.includes(item._id)) {
          return true
        }
      })
    }

    if (employeeCollaboratedWithUnit?.accountableEmployees?.length > 0 && task?.accountableEmployees?.length > 0) {
      accountableEmployeesOfUnit = task.accountableEmployees.filter((item) => {
        if (employeeCollaboratedWithUnit.accountableEmployees.includes(item._id)) {
          return true
        }
      })
    }
  }

  return (
    <React.Fragment>
      {task && employeeSelectBox && employeeSelectBox.length !== 0 && (
        <div className='description-box'>
          <h4>
            {translate('task.task_management.role_in_collaborated_unit')} {employeeSelectBox && employeeSelectBox.text}
          </h4>

          {editCollaboratedTask ? (
            <div>
              <label>
                <input
                  type='checkbox'
                  title={translate('task.task_process.export_info')}
                  onClick={() => handleCheckBoxAssigned()}
                  checked={isAssigned}
                />
                <strong>{translate('task.task_management.confirm_assigned')}</strong>
              </label>
              <div className='form-group no-line-height'>
                <label>{translate('task.task_management.responsible')}</label>
                <SelectBox
                  id={`multiSelectResponsibleEmployee${unitId}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={employeeSelectBox && employeeSelectBox.value}
                  onChange={handleChangeResponsibleCollaboratedTask}
                  value={responsibleEmployees}
                  multiple={true}
                />
              </div>
              <div className='form-group no-line-height'>
                <label>{translate('task.task_management.accountable')}</label>
                <SelectBox
                  id={`multiSelectAccountableEmployee${unitId}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={employeeSelectBox && employeeSelectBox.value}
                  onChange={handleChangeAccountableCollaboratedTask}
                  value={accountableEmployees}
                  multiple={true}
                />
              </div>
              <div className='form-group no-line-height'>
                <label>{translate('task.task_management.consulted')}</label>
                <SelectBox
                  id={`multiSelectConsultedEmployee${unitId}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={employeeSelectBox && employeeSelectBox.value}
                  onChange={handleChangeConsultedCollaboratedTask}
                  value={consultedEmployees}
                  multiple={true}
                />
              </div>
            </div>
          ) : (
            <div>
              {/* Đã/Chưa xác nhận phân công công việc*/}
              {employeeCollaboratedWithUnit && employeeCollaboratedWithUnit.isAssigned ? (
                <strong>
                  <a className='fa fa-check' style={{ color: 'green' }}></a> {translate('task.task_management.confirm_assigned_success')}
                </strong>
              ) : (
                <strong>
                  <a className='fa fa-exclamation-triangle' style={{ color: 'red' }}></a>{' '}
                  {translate('task.task_management.confirm_assigned_failure')}
                </strong>
              )}
              <br />

              {/* Người thực hiện */}
              <strong>{translate('task.task_management.responsible')}:</strong>
              {employeeCollaboratedWithUnit &&
              employeeCollaboratedWithUnit.responsibleEmployees &&
              employeeCollaboratedWithUnit.responsibleEmployees.length !== 0 ? (
                <span>
                  {responsibleEmployeesOfUnit &&
                    responsibleEmployeesOfUnit.length !== 0 &&
                    responsibleEmployeesOfUnit.map((item, index) => {
                      let seperator = index !== 0 ? ', ' : ''
                      if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                        // tìm thấy item._id
                        return (
                          <span key={index}>
                            <strike>
                              {seperator}
                              {item.name}
                            </strike>
                          </span>
                        )
                      } else {
                        return (
                          <span key={index}>
                            {seperator}
                            {item.name}
                          </span>
                        )
                      }
                    })}
                </span>
              ) : (
                <span>{translate('task.task_management.task_empty_employee')}</span>
              )}
              <br />

              {/* Người phê duyệt */}
              <strong>{translate('task.task_management.accountable')}:</strong>
              {employeeCollaboratedWithUnit?.accountableEmployees?.length > 0 ? (
                <span>
                  {accountableEmployeesOfUnit &&
                    accountableEmployeesOfUnit.length !== 0 &&
                    accountableEmployeesOfUnit.map((item, index) => {
                      let seperator = index !== 0 ? ', ' : ''
                      if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                        // tìm thấy item._id
                        return (
                          <span key={index}>
                            <strike>
                              {seperator}
                              {item.name}
                            </strike>
                          </span>
                        )
                      } else {
                        return (
                          <span key={index}>
                            {seperator}
                            {item.name}
                          </span>
                        )
                      }
                    })}
                </span>
              ) : (
                <span>{translate('task.task_management.task_empty_employee')}</span>
              )}
              <br />

              {/* Người tư vấn */}
              <strong>{translate('task.task_management.consulted')}:</strong>
              {employeeCollaboratedWithUnit &&
              employeeCollaboratedWithUnit.consultedEmployees &&
              employeeCollaboratedWithUnit.consultedEmployees.length !== 0 ? (
                <span>
                  {consultedEmployeesOfUnit &&
                    consultedEmployeesOfUnit.length !== 0 &&
                    consultedEmployeesOfUnit.map((item, index) => {
                      let seperator = index !== 0 ? ', ' : ''
                      if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                        // tìm thấy item._id
                        return (
                          <span key={index}>
                            <strike>
                              {seperator}
                              {item.name}
                            </strike>
                          </span>
                        )
                      } else {
                        return (
                          <span key={index}>
                            {seperator}
                            {item.name}
                          </span>
                        )
                      }
                    })}
                </span>
              ) : (
                <span>{translate('task.task_management.task_empty_employee')}</span>
              )}
            </div>
          )}

          {editCollaboratedTask ? (
            <div class='row'>
              <div className='col-xs-6'>
                <button type='button' className={`btn btn-danger btn-block`} onClick={() => handleCancelEditCollaboratedTask()}>
                  Hủy
                </button>
              </div>
              <div className='col-xs-6'>
                <button type='button' className={`btn btn-success btn-block`} onClick={() => saveCollaboratedTask(task._id)}>
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 7 }}>
              <button
                className={`btn btn-block btn-default`}
                onClick={() =>
                  setState((state) => {
                    return { ...state, editCollaboratedTask: true }
                  })
                }
                title='Chỉnh sửa'
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  )
}

function mapState(state) {
  const { performtasks } = state
  return { performtasks }
}

const actions = {
  editEmployeeCollaboratedWithOrganizationalUnits: performTaskAction.editEmployeeCollaboratedWithOrganizationalUnits,
  getTaskLog: performTaskAction.getTaskLog
}

const connectedCollaboratedWithOrganizationalUnits = connect(mapState, actions)(withTranslate(CollaboratedWithOrganizationalUnits))
export { connectedCollaboratedWithOrganizationalUnits as CollaboratedWithOrganizationalUnits }
