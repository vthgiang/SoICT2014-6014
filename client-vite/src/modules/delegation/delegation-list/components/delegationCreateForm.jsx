import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel, SelectBox, DatePicker, TimePicker, SelectMulti } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'
import { DelegationActions } from '../redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { DelegationFormValidator } from './delegationFormValidator'
import './selectLink.css'
import dayjs from 'dayjs'
import { generateCode } from '../../../../helpers/generateCode'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { PolicyActions } from '../../../super-admin/policy-delegation/redux/actions'

function DelegationCreateForm(props) {
  // Khởi tạo state
  const [state, setState] = useState({
    name: '',
    description: '',
    nameError: {
      message: undefined,
      status: true
    },
    delegateObject: '',
    delegatee: '',
    delegateDuration: {
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '11:30 PM'
    },
    showChooseLinks: false,
    showChooseRevoke: false,
    delegationStart: '',
    delegationEnd: '',
    delegateLinks: null,
    allPrivileges: true,
    validLinks: [],
    unitMembers: [],
    selectDelegateRole: false,
    errorOnDelegateLinks: undefined,
    policy: ''
  })

  const { translate, delegation, auth, user, policyDelegation, role, link, page, perPage } = props
  const {
    name,
    description,
    nameError,
    delegateObject,
    delegatee,
    delegateDuration,
    showChooseLinks,
    showChooseRevoke,
    errorDelegateRole,
    errorDelegatee,
    delegateLinks,
    allPrivileges,
    delegationEnd,
    validLinks,
    selectDelegateRole,
    errorOnDelegateLinks,
    unitMembers,
    errorDelegatePolicy,
    policy
  } = state

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (
      !nameError.status ||
      !validateDelegateRole(state.delegateObject, false) ||
      !validateDelegatee(state.delegatee, false) ||
      (showChooseRevoke && !ValidationHelper.validateEmpty(translate, delegateDuration.endDate).status) ||
      !ValidationHelper.validateEmpty(translate, delegateDuration.startDate).status ||
      !validateDelegatePolicy(state.policy, false) ||
      (showChooseLinks && delegateLinks == null)
    ) {
      return false
    }
    return true
  }

  useEffect(() => {
    window.$(`#modal-create-delegation-hooks-Role`).on('shown.bs.modal', regenerateTimeAndCode)
    return () => {
      window.$(`#modal-create-delegation-hooks-Role`).unbind('shown.bs.modal', regenerateTimeAndCode)
    }
  }, [])

  useEffect(() => {
    props.getPolicies()
  }, [])

  const roundToNearestHour = (date) => {
    date.setMinutes(date.getMinutes() + 30)
    date.getMinutes() >= 30 ? date.setMinutes(30, 0, 0) : date.setMinutes(0, 0, 0)

    return date
  }

  const regenerateTimeAndCode = () => {
    const currentTime = formatTime(roundToNearestHour(new Date()))
    const code = generateCode('UQVT')
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

  // const regenerateCode = () => {
  //     let code = generateCode("UQVT");
  //     setState((state) => ({
  //         ...state,
  //         name: code,
  //     }));
  //     let result = ValidationHelper.validateName(translate, code, 6, 255);
  //     setState({
  //         ...state,
  //         name: code,
  //         nameError: result
  //     })
  // }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    const data = {
      name,
      description,
      delegateObject,
      delegator: auth.user._id,
      delegatee,
      showChooseLinks,
      startDate: convertDateTimeSave(delegateDuration.startDate, delegateDuration.startTime),
      endDate: delegationEnd != '' ? convertDateTimeSave(delegateDuration.endDate, delegateDuration.endTime) : null,
      delegateLinks: showChooseLinks
        ? delegateLinks.concat(validLinks.filter((link) => link.url == '/home' || link.url == '/notifications').map((l) => l._id))
        : null,
      allPrivileges: !showChooseLinks ? true : validLinks.length - 2 == delegateLinks.length,
      policy
    }
    if (isFormValidated() && name) {
      props.createDelegation([data])
    }
  }

  const chooseLinks = (event) => {
    setState({
      ...state,
      showChooseLinks: event.target.checked,
      allPrivileges: !event.target.checked,
      errorOnDelegateLinks: undefined
    })
  }

  const chooseRevoke = (event) => {
    setState({
      ...state,
      showChooseRevoke: event.target.checked
    })
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
    if (delegateObject != '') {
      const selectedRoleUnit = user.organizationalUnitsOfUser.find(
        (item) =>
          item.managers.find((manager) => manager === delegateObject) === delegateObject ||
          item.deputyManagers.find((deputyManager) => deputyManager === delegateObject) === delegateObject ||
          item.employees.find((employee) => employee === delegateObject) === delegateObject
      )

      usersInUnitsOfCompany = usersInUnitsOfCompany.filter((unit) => unit.id == selectedRoleUnit._id || unit.parent == selectedRoleUnit._id)
    }
  }

  const allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany)

  const handleDelegateRole = (value) => {
    validateDelegateRole(value[0], true)
  }

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

  const validateDelegateRole = (value, willUpdateState) => {
    let msg

    const { translate } = props
    if (!value) {
      msg = translate('manage_delegation.no_blank_delegate_role')
    }
    if (willUpdateState) {
      // Array id delegate role và parents
      const selectedRoleAndParents = role.list
        .filter((role) => role._id == value)[0]
        ?.parents.map((p) => p._id)
        .concat(value)

      // Lọc link ko có policies
      const linksOfDelegateRole = link.list.filter(
        (link) =>
          link.roles.filter((role) => role.policies.length > 0).length == 0 &&
          link.roles.map((role) => role.roleId._id).some((r) => selectedRoleAndParents?.includes(r))
      )

      setState({
        ...state,
        delegateObject: value,
        errorDelegateRole: msg,
        validLinks: linksOfDelegateRole.sort((a, b) => (a.category > b.category ? 1 : -1)),
        delegatee: '',
        // unitMembers: unitMems,
        selectDelegateRole: true
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

  const handleDelegateLinksChange = (value) => {
    let msg
    if (showChooseLinks && value.length === 0) {
      value = null
      msg = translate('manage_delegation.not_select_link')
    }

    setState({
      ...state,
      delegateLinks: value,
      errorOnDelegateLinks: msg
    })
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

  return (
    <DialogModal
      modalID='modal-create-delegation-hooks-Role'
      isLoading={delegation.isLoading}
      formID='form-create-delegation-hooks-Role'
      title={translate('manage_delegation.add_role_delegation_title')}
      msg_success={translate('manage_delegation.add_success')}
      msg_failure={translate('manage_delegation.add_fail')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={50}
    >
      <form id='form-create-delegation-hooks-Role' onSubmit={() => save(translate('manage_delegation.add_success'))}>
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
            className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${errorDelegateRole === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegate_role')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-delegate-role-create'
              className='form-control select2'
              style={{ width: '100%' }}
              items={auth.user.roles
                .filter((role) => {
                  return (
                    role.roleId &&
                    role.roleId.name !== 'Super Admin' &&
                    role.roleId.type.name !== 'Root' &&
                    (!role.delegation || role.delegation.length == 0)
                  )
                })
                .map((role) => {
                  return { value: role && role.roleId ? role.roleId._id : null, text: role && role.roleId ? role.roleId.name : '' }
                })}
              onChange={handleDelegateRole}
              multiple={false}
              options={{ placeholder: translate('manage_delegation.choose_delegate_role') }}
            />
            <ErrorLabel content={errorDelegateRole} />
          </div>

          {/* Chọn người nhận */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${errorDelegatee === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegate_receiver')}
              <span className='text-red'>*</span>
            </label>
            {allUnitsMember && (
              <SelectBox
                id='select-delegate-receiver-create'
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember.map(
                  (unit) => (unit = { text: unit.text, value: unit.value.filter((user) => user.value != auth.user._id) })
                )}
                onChange={handleDelegatee}
                multiple={false}
                options={{ placeholder: translate('manage_delegation.choose_delegatee') }}
              />
            )}
            <ErrorLabel content={errorDelegatee} />
          </div>
        </div>
        {selectDelegateRole && (
          <div className='row form-group'>
            <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 ${errorOnDelegateLinks === undefined ? '' : 'has-error'}`}>
              <div className='row'>
                <div className='col-lg-6 col-md-6 col-ms-6 col-xs-6'>
                  <form style={{ marginBottom: '5px' }}>
                    <input type='checkbox' id='delegateLinks' name='delegateLinks' onChange={chooseLinks} />
                    <label htmlFor='delegateLinks'>&nbsp;{translate('manage_delegation.choose_links')}</label>
                  </form>
                </div>
                <div className='col-lg-6 col-md-6 col-ms-6 col-xs-6'>
                  <form style={{ marginBottom: '5px' }}>
                    <input type='checkbox' id='delegateRevoke' name='delegateRevoke' onChange={chooseRevoke} />
                    <label htmlFor='delegateRevoke'>&nbsp;{translate('manage_delegation.choose_revoke')}</label>
                  </form>
                </div>
              </div>

              {showChooseLinks && (
                <SelectMulti
                  id='multiSelectDelegateLinks'
                  multiple='multiple'
                  options={{
                    nonSelectedText: translate('manage_delegation.choose_delegate_links'),
                    allSelectedText: translate('manage_delegation.select_all_links'),
                    enableFilter: true
                  }}
                  onChange={handleDelegateLinksChange}
                  value={delegateLinks || []}
                  items={validLinks
                    .filter((link) => link.url != '/home' && link.url != '/notifications')
                    .map((link) => {
                      return { value: link ? link._id : null, text: link ? `${link.category} - ${link.url} - ${link.description}` : '' }
                    })}
                />
              )}
              <ErrorLabel content={errorOnDelegateLinks} />
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
              id='datepicker1'
              dateFormat='day-month-year'
              value={delegateDuration.startDate}
              onChange={handleChangeTaskStartDate}
              pastDate={false}
            />
            <TimePicker
              id='time-picker-1'
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
              <DatePicker id='datepicker2' value={delegateDuration.endDate} onChange={handleChangeTaskEndDate} pastDate={false} />
              <TimePicker
                id='time-picker-2'
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
              id='select-delegate-policy-create'
              className='form-control select2'
              style={{ width: '100%' }}
              items={policyDelegation.listPaginate
                // .filter((p) => p.delegateType == 'Role')
                .map((policy) => {
                  return { value: policy ? policy._id : null, text: policy ? policy.name : '' }
                })}
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
  const { auth, user, policyDelegation, link, role, delegation } = state
  return { auth, user, policyDelegation, delegation, link, role }
}

const actions = {
  createDelegation: DelegationActions.createDelegation,
  getDelegations: DelegationActions.getDelegations,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  getPolicies: PolicyActions.getPolicies
}

const connectedDelegationCreateForm = connect(mapState, actions)(withTranslate(DelegationCreateForm))
export { connectedDelegationCreateForm as DelegationCreateForm }
