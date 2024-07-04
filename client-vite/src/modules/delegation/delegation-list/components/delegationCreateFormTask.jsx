import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel, SelectBox, DatePicker, TimePicker } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'
import { DelegationActions } from '../redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { DelegationFormValidator } from './delegationFormValidator'
import './selectLink.css'
import dayjs from 'dayjs'
import { generateCode } from '../../../../helpers/generateCode'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { getStorage } from '../../../../config'
import { PolicyActions } from '../../../super-admin/policy-delegation/redux/actions'
import { performTaskAction } from '../../../task/task-perform/redux/actions'

function DelegationCreateFormTask(props) {
  const [state, setState] = useState({
    name: '',
    description: '',
    nameError: {
      message: undefined,
      status: true
    },
    delegateTaskRoles: '',
    delegatee: '',
    delegateDuration: {
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '11:30 PM'
    },
    showChooseRevoke: false,
    delegationStart: '',
    delegationEnd: '',
    unitMembers: [],
    selectDelegateTaskRoles: false,
    policy: '',
    delegateObject: '',
    roles: []
  })
  const {
    taskId,
    delegateObject,
    delegateObjectName,
    name,
    description,
    nameError,
    delegateTaskRoles,
    delegatee,
    delegateDuration,
    showChooseLinks,
    showChooseRevoke,
    errorDelegateTaskRoles,
    errorDelegatee,
    delegateLinks,
    allPrivileges,
    delegationEnd,
    validLinks,
    selectDelegateTaskRoles,
    errorOnDelegateLinks,
    unitMembers,
    policy,
    errorDelegatePolicy,
    roles,
    errorDelegateTask
  } = state

  const { translate, performtasks, auth, user, policyDelegation, tasks } = props

  const ROLE = {
    RESPONSIBLE: { name: translate('task.task_management.responsible'), value: 'responsible' },
    ACCOUNTABLE: { name: translate('task.task_management.accountable'), value: 'accountable' },
    CONSULTED: { name: translate('task.task_management.consulted'), value: 'consulted' },
    CREATOR: { name: translate('task.task_management.creator'), value: 'creator' },
    INFORMED: { name: translate('task.task_management.informed'), value: 'informed' }
  }

  // useEffect(() => {
  //     if (props.taskId) {
  //         props.getTaskById(props.taskId); // props.id // đổi thành nextProps.id để lấy dữ liệu về sớm hơn
  //     }
  // }, [props.taskId])

  // useEffect(() => {

  //     if (tasks?.task) {
  //         let task = tasks.task; /// chú ý: cần check thêm trường hợp quy trình có lấy dữ liệu ở performTasks hay ko

  //         // if (task?.organizationalUnit) props.getChildrenOfOrganizationalUnits(task.organizationalUnit._id);

  //         let roles = [];
  //         if (task) {
  //             let userId = getStorage("userId");
  //             let tmp = task.responsibleEmployees.find(item => item._id === userId);
  //             if (tmp) {
  //                 roles.push(ROLE.RESPONSIBLE);
  //             }

  //             tmp = task.accountableEmployees && task.accountableEmployees.find(item => item._id === userId);
  //             if (tmp) {
  //                 roles.push(ROLE.ACCOUNTABLE);
  //             }

  //             tmp = task.consultedEmployees && task.consultedEmployees.find(item => item._id === userId);
  //             if (tmp) {
  //                 roles.push(ROLE.CONSULTED);
  //             }

  //             tmp = task.informedEmployees && task.informedEmployees.find(item => item._id === userId);
  //             if (tmp) {
  //                 roles.push(ROLE.INFORMED);
  //             }

  //         }
  //         setState({
  //             ...state,
  //             taskId: props.taskId,
  //             roles: roles,
  //             delegateObjectName: props.taskName,

  //         });
  //     }

  // }, [tasks?.task])

  useEffect(() => {
    if (name == '') {
      window.$(`#modal-create-delegation-hooks-Task`).on('shown.bs.modal', regenerateTimeAndCode)
      return () => {
        window.$(`#modal-create-delegation-hooks-Task`).unbind('shown.bs.modal', regenerateTimeAndCode)
      }
    }
  }, [])

  useEffect(() => {
    if (tasks?.task) {
      const { task } = tasks /// chú ý: cần check thêm trường hợp quy trình có lấy dữ liệu ở performTasks hay ko

      // if (task?.organizationalUnit) props.getChildrenOfOrganizationalUnits(task.organizationalUnit._id);

      const roles = []
      if (task) {
        const userId = getStorage('userId')
        let tmp = task.responsibleEmployees.find((item) => item._id === userId)
        if (tmp) {
          roles.push(ROLE.RESPONSIBLE)
        }

        tmp = task.accountableEmployees && task.accountableEmployees.find((item) => item._id === userId)
        if (tmp) {
          roles.push(ROLE.ACCOUNTABLE)
        }

        tmp = task.consultedEmployees && task.consultedEmployees.find((item) => item._id === userId)
        if (tmp) {
          roles.push(ROLE.CONSULTED)
        }

        tmp = task.informedEmployees && task.informedEmployees.find((item) => item._id === userId)
        if (tmp) {
          roles.push(ROLE.INFORMED)
        }
      }
      setState({
        ...state,
        roles
      })
    }
  }, [tasks?.task])

  useEffect(() => {
    setState({
      ...state,
      delegateObject: tasks.tasksbyuser?.expire[0]?.task?._id
    })
  }, [])

  useEffect(() => {
    if (delegateObject) {
      props.getTaskById(delegateObject) // props.id // đổi thành nextProps.id để lấy dữ liệu về sớm hơn
    }
  }, [delegateObject])

  // useEffect(() => {
  //     props.getTasksByUser({ type: "user", organizationUnitId: null })
  // }, [])

  const roundToNearestHour = (date) => {
    date.setMinutes(date.getMinutes() + 30)
    date.getMinutes() >= 30 ? date.setMinutes(30, 0, 0) : date.setMinutes(0, 0, 0)

    return date
  }

  const regenerateTimeAndCode = () => {
    const currentTime = formatTime(roundToNearestHour(new Date()))
    const code = generateCode('UQCV')
    const result = ValidationHelper.validateName(translate, code, 6, 255)

    setState((state) => {
      return {
        ...state,
        delegateDuration: {
          ...state.delegateDuration,
          startTime: currentTime
        },
        name: code,
        nameError: result
      }
    })
  }

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (
      !nameError.status ||
      !validateDelegatee(state.delegatee, false) ||
      !validateDelegateTaskRoles(state.delegateTaskRoles, false) ||
      (showChooseRevoke && !ValidationHelper.validateEmpty(translate, delegateDuration.endDate).status) ||
      !ValidationHelper.validateEmpty(translate, delegateDuration.startDate).status ||
      !validateDelegatePolicy(state.policy, false) ||
      !validateDelegateTask(state.delegateObject, false)
    ) {
      return false
    }
    return true
  }

  useEffect(() => {
    props.getPolicies()
  }, [])

  // Nhận giá trị từ component cha

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    const data = {
      name,
      description,
      delegateTaskRoles,
      delegator: auth.user._id,
      delegatee,
      startDate: convertDateTimeSave(delegateDuration.startDate, delegateDuration.startTime),
      endDate: delegationEnd != '' ? convertDateTimeSave(delegateDuration.endDate, delegateDuration.endTime) : null,
      policy,
      delegateObject
    }
    if (isFormValidated() && name) {
      return props.createTaskDelegation([data])
    }
  }

  const chooseRevoke = (event) => {
    setState({
      ...state,
      showChooseRevoke: event.target.checked
    })
  }

  const handleDelegateTaskRoles = (value) => {
    validateDelegateTaskRoles(value, true)
  }

  const validateDelegateTaskRoles = (value, willUpdateState) => {
    let msg

    const { translate } = props
    if (!value || value.length == 0) {
      msg = translate('manage_delegation.no_blank_delegate_role')
    }
    if (willUpdateState) {
      setState({
        ...state,
        delegateTaskRoles: value,
        errorDelegateTaskRoles: msg,
        selectDelegateTaskRoles: true
      })
    }
    return msg === undefined
  }

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handleDelegationName = (e) => {
    const { value } = e.target
    const result = ValidationHelper.validateName(translate, value, 6, 255)

    setState({
      ...state,
      name: value,
      nameError: result
    })
  }

  /**
   * Hàm xử lý khi mô tả ví dụ thay đổi
   * @param {*} e
   */
  const handleDelegationDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
  }

  // DS toàn bộ user theo cơ cấu tổ chức
  useEffect(() => {
    props.getAllUserInAllUnitsOfCompany()
  }, [])

  // DS toàn bộ user thuộc department và children department

  let usersInUnitsOfCompany
  if (user && user.usersInUnitsOfCompany) {
    usersInUnitsOfCompany = user.usersInUnitsOfCompany
    // if (delegateTaskRoles != "") {
    //     let selectedRoleUnit = user.organizationalUnitsOfUser.find(item =>
    //         item.managers.find(manager => manager === delegateTaskRoles) === delegateTaskRoles
    //         || item.deputyManagers.find(deputyManager => deputyManager === delegateTaskRoles) === delegateTaskRoles
    //         || item.employees.find(employee => employee === delegateTaskRoles) === delegateTaskRoles);

    //     usersInUnitsOfCompany = usersInUnitsOfCompany.filter(unit => unit.id == selectedRoleUnit._id || unit.parent == selectedRoleUnit._id)
    // }
  }

  const allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany)

  const handleDelegatee = (value) => {
    validateDelegatee(value[0], true)
  }

  const handleDelegatePolicy = (value) => {
    validateDelegatePolicy(value[0], true)
  }

  const validateDelegatePolicy = (value, willUpdateState) => {
    let msg
    const { translate } = props
    if (!value) {
      msg = translate('manage_delegation.no_blank_delegate_policy')
    }
    if (willUpdateState) {
      setState({
        ...state,
        policy: value,
        errorDelegatePolicy: msg
      })
    }
    return msg === undefined
  }

  const handleDelegateTask = (value) => {
    console.log("xxx", value)
    validateDelegateTask(value[0], true)
  }

  const validateDelegateTask = (value, willUpdateState) => {
    let msg
    const { translate } = props
    if (!value) {
      msg = translate('manage_delegation.no_blank_delegate_task')
    }

    if (willUpdateState) {
      setState({
        ...state,
        delegateObject: value,
        errorDelegateTask: msg
      })
    }
    return msg === undefined
  }

  const validateDelegatee = (value, willUpdateState) => {
    let msg
    const { translate } = props
    if (!value) {
      msg = translate('manage_delegation.no_blank_delegatee')
    }
    if (willUpdateState) {
      setState({
        ...state,
        delegatee: value,
        errorDelegatee: msg
      })
    }
    return msg === undefined
  }

  const handleChangeTaskStartDate = (value) => {
    validateTaskStartDate(value, true)
  }
  const validateTaskStartDate = (value, willUpdateState = true) => {
    const { translate } = props
    const { delegateDuration } = state
    let msg = DelegationFormValidator.validateTaskStartDate(value, delegateDuration.endDate, translate)
    const startDate = convertDateTime(value, delegateDuration.startTime)
    const endDate = convertDateTime(delegateDuration.endDate, delegateDuration.endTime)

    if (startDate >= endDate) {
      msg = translate('task.task_management.add_err_end_date')
    }
    if (willUpdateState) {
      setState({
        ...state,
        delegateDuration: {
          ...state.delegateDuration,
          startDate: value,
          errorOnStartDate: msg
        },
        delegationStart: startDate
      })
      delegateDuration.startDate = value
      delegateDuration.errorOnStartDate = msg
      if (!msg && delegateDuration.endDate) {
        setState({
          ...state,
          delegateDuration: {
            ...state.delegateDuration,
            errorOnEndDate: msg
          }
        })
      }
    }
    return msg === undefined
  }

  const handleStartTimeChange = (value) => {
    const { translate } = props
    const startDate = convertDateTime(state.delegateDuration.startDate, value)
    const endDate = convertDateTime(state.delegateDuration.endDate, state.delegateDuration.endTime)
    let err
    let resetErr

    if (value.trim() === '') {
      err = translate('task.task_management.add_err_empty_end_date')
    } else if (startDate >= endDate) {
      err = translate('task.task_management.add_err_end_date')
      resetErr = undefined
    }
    setState({
      ...state,
      delegateDuration: {
        ...state.delegateDuration,
        startTime: value,
        errorOnStartDate: err,
        errorOnEndDate: resetErr
      },
      delegationStart: startDate
    })
  }

  const handleEndTimeChange = (value) => {
    const { translate } = props
    const startDate = convertDateTime(state.delegateDuration.startDate, state.delegateDuration.startTime)
    const endDate = convertDateTime(state.delegateDuration.endDate, value)
    let err
    let resetErr

    // if (value.trim() === "") {
    //     err = translate('task.task_management.add_err_empty_end_date');
    // }
    // else
    if (startDate >= endDate) {
      err = translate('task.task_management.add_err_end_date')
      resetErr = undefined
    }
    setState({
      ...state,
      delegateDuration: {
        ...state.delegateDuration,
        endTime: value,
        errorOnEndDate: err,
        errorOnStartDate: resetErr
      },
      delegationEnd: endDate
    })
  }

  const handleChangeTaskEndDate = (value) => {
    validateTaskEndDate(value, true)
  }

  const validateTaskEndDate = (value, willUpdateState = true) => {
    const { translate } = props
    const { delegateDuration } = state
    let msg = DelegationFormValidator.validateDelegationEndDate(delegateDuration.startDate, value, translate)
    const endDate = convertDateTime(value, delegateDuration.endTime)
    console.log(endDate)
    const startDate = convertDateTime(delegateDuration.startDate, delegateDuration.startTime)

    if (startDate >= endDate) {
      msg = translate('task.task_management.add_err_end_date')
    }
    if (willUpdateState) {
      setState({
        ...state,
        delegateDuration: {
          ...state.delegateDuration,
          endDate: value,
          errorOnEndDate: msg
        }
      })
      delegateDuration.endDate = value
      delegateDuration.errorOnEndDate = msg
      if (!msg && delegateDuration.startDate) {
        setState({
          ...state,
          delegateDuration: {
            ...delegateDuration,
            errorOnStartDate: msg
          }
        })
      }
    }
    setState({
      ...state,
      delegationEnd: endDate
    })
    return msg === undefined
  }

  const convertDateTime = (date, time) => {
    const splitter = date.split('-')
    const strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss')
  }

  const convertDateTimeSave = (date, time) => {
    const splitter = date.split('-')
    const strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return new Date(strDateTime)
  }

  // convert ISODate to String hh:mm AM/PM
  const formatTime = (date) => {
    return dayjs(date).format('h:mm A')
  }

  const formatDate = (date) => {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) month = `0${month}`
    if (day.length < 2) day = `0${day}`
    return [day, month, year].join('-')
  }

  return (
    <DialogModal
      modalID='modal-create-delegation-hooks-Task'
      formID='modal-create-delegation-hooks-Task'
      title={translate('manage_delegation.task_delegation_title_add')}
      msg_success={translate('manage_delegation.add_success')}
      msg_failure={translate('manage_delegation.add_fail')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={50}
    >
      <form id='modal-create-delegation-hooks-Task' onSubmit={() => save(translate('manage_delegation.add_success'))}>
        {/* <div className="row form-group">
                        <div style={{ marginBottom: "0px" }} className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group`}>
                            <label>{translate('manage_delegation.delegateObjectName')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={delegateObjectName} disabled></input>
                        </div>

                    </div> */}

        <div className='row form-group'>
          {/* Chọn công việc ủy quyền */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegateTask === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegateTaskName')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-delegate-task-create'
              className='form-control select2'
              style={{ width: '100%' }}
              items={tasks.tasksbyuser.expire
                .map((e) => e.task)
                .concat(tasks.tasksbyuser.deadlineincoming.map((d) => d.task))
                .map((task) => {
                  return { value: task ? task._id : null, text: task ? task.name : '' }
                })}
              onChange={handleDelegateTask}
              multiple={false}
              value={delegateObject}
              options={{ placeholder: translate('manage_delegation.choose_delegateObjectName') }}
            />
            <ErrorLabel content={errorDelegateTask} />
          </div>
        </div>

        <div className='row form-group'>
          {/* Tên ủy quyền */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${nameError.status ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.name')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={name} onChange={handleDelegationName} />
            <ErrorLabel content={nameError.message} />
          </div>
          {/* Mô tả ủy quyền */}
          <div style={{ marginBottom: '0px' }} className='col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group'>
            <label>{translate('manage_delegation.delegation_description')}</label>
            <input type='text' className='form-control' value={description} onChange={handleDelegationDescription} />
          </div>
        </div>

        <div className='row form-group'>
          {/* Chọn vai trò */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegateTaskRoles === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegate_task_role')}
              <span className='text-red'>*</span>
            </label>
            {roles && (
              <SelectBox
                id='select-task-role-create'
                className='form-control select2'
                style={{ width: '100%' }}
                items={roles.map((role) => {
                  return { value: role.value, text: role.name }
                })}
                multiple
                options={{ placeholder: translate('manage_delegation.choose_task_role') }}
                onChange={handleDelegateTaskRoles}
              />
            )}
            <ErrorLabel content={errorDelegateTaskRoles} />
          </div>
        </div>

        <div className='row form-group'>
          {/* Chọn người nhận */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegatee === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegate_receiver')}
              <span className='text-red'>*</span>
            </label>
            {allUnitsMember && (
              <SelectBox
                id='select-delegate-receiver-create-task'
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember.map(
                  (unit) => (unit = { text: unit.text, value: unit.value.filter((user) => user.value != auth.user._id) })
                )}
                onChange={handleDelegatee}
                multiple={false}
                value={delegatee}
                options={{ placeholder: translate('manage_delegation.choose_delegatee') }}
              />
            )}
            <ErrorLabel content={errorDelegatee} />
          </div>
        </div>

        {selectDelegateTaskRoles && (
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-ms-12 col-xs-12'>
              <form style={{ marginBottom: '5px' }}>
                <input type='checkbox' id='delegateRevoke-Task' name='delegateRevoke-Task' onChange={chooseRevoke} />
                <label htmlFor='delegateRevoke-Task'>&nbsp;{translate('manage_delegation.choose_revoke')}</label>
              </form>
            </div>
          </div>
        )}
        <div className='row form-group'>
          <div
            style={{ marginBottom: '0px' }}
            className={`${showChooseRevoke ? 'col-lg-6 col-md-6' : 'col-lg-12 col-md-12'} col-ms-12 col-xs-12 form-group ${delegateDuration.errorOnStartDate === undefined ? '' : 'has-error'}`}
          >
            <label className='control-label'>
              {translate('manage_delegation.start_date')}
              <span className='text-red'>*</span>
            </label>
            <DatePicker
              id='datepicker1create-task'
              dateFormat='day-month-year'
              value={delegateDuration.startDate}
              onChange={handleChangeTaskStartDate}
              pastDate={false}
            />
            <TimePicker
              id='time-picker-1create-task'
              refs='time-picker-1'
              value={delegateDuration.startTime}
              onChange={handleStartTimeChange}
              minuteStep={30}
            />
            <ErrorLabel content={delegateDuration.errorOnStartDate} />
          </div>
          {showChooseRevoke && (
            <div
              style={{ marginBottom: '0px' }}
              className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${delegateDuration.errorOnEndDate === undefined ? '' : 'has-error'}`}
            >
              <label className='control-label'>{translate('manage_delegation.end_date')}</label>
              <DatePicker
                id='datepicker2create-task'
                value={delegateDuration.endDate}
                onChange={handleChangeTaskEndDate}
                pastDate={false}
              />
              <TimePicker
                id='time-picker-2create-task'
                refs='time-picker-2'
                value={delegateDuration.endTime}
                onChange={handleEndTimeChange}
                minuteStep={30}
              />
              <ErrorLabel content={delegateDuration.errorOnEndDate} />
            </div>
          )}
        </div>

        <div className='row form-group'>
          {/* Chọn chính sách ủy quyền */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegatePolicy === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegate_policy')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-delegate-policy-create-task'
              className='form-control select2'
              style={{ width: '100%' }}
              items={policyDelegation.listPaginate
                // .filter((p) => p.delegateType == 'Task')
                .map((policy) => {
                  return { value: policy ? policy._id : null, text: policy ? policy.name : '' }
                })}
              value={policy}
              onChange={handleDelegatePolicy}
              multiple={false}
              options={{ placeholder: translate('manage_delegation.choose_delegate_policy') }}
            />
            <ErrorLabel content={errorDelegatePolicy} />
          </div>
        </div>
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  const { auth, user, policyDelegation, performtasks, tasks } = state
  return { auth, user, policyDelegation, performtasks, tasks }
}

const actions = {
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  getPolicies: PolicyActions.getPolicies,
  getTaskById: performTaskAction.getTaskById,
  createTaskDelegation: DelegationActions.createTaskDelegation
}

const connectedDelegationCreateFormTask = connect(mapState, actions)(withTranslate(DelegationCreateFormTask))
export { connectedDelegationCreateFormTask as DelegationCreateFormTask }
