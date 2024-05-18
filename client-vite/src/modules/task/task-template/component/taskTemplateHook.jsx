import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskTemplateActions } from '../redux/actions'
import { InformationForm } from './informationsTemplate'
import { ActionForm } from './actionsTemplate'
import { SelectBox, ErrorLabel } from '../../../../common-components'
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper'
import { TaskTemplateFormValidator } from './taskTemplateFormValidator'
import { getStorage } from '../../../../config'
import ValidationHelper from '../../../../helpers/validationHelper'

function AddTaskTemplate(props) {
  const userId = getStorage('userId')
  const [state, setState] = useState({
    newTemplate: {
      organizationalUnit: '',
      name: '',
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      description: '',
      creator: userId,
      numberOfDaysTaken: '',
      formula: '',
      priority: 3,
      taskActions: [],
      taskInformations: []
    },
    showMore: !props.isProcess,
    currentRole: localStorage.getItem('currentRole')
  })

  useEffect(() => {
    // props.getDepartment(); // => user.organizationalUnitsOfUser
    // props.getAllUserOfCompany(); // => user.usercompanys
    props.getRoleSameDepartment(localStorage.getItem('currentRole')) // => user.roledepartments
    props.getDepartmentsThatUserIsManager() // => department.departmentsThatUserIsManager
    props.getAllUserInAllUnitsOfCompany() // => user.usersInUnitsOfCompany
  }, [])

  useEffect(() => {
    const { department, user } = props
    const { newTemplate } = state

    if (props.isProcess && props.id) {
      const { info, listOrganizationalUnit } = props
      setState({
        ...state,
        id: props.id,
        newTemplate: {
          organizationalUnit: info && info.organizationalUnit ? info.organizationalUnit : '',
          collaboratedWithOrganizationalUnits:
            info && info.collaboratedWithOrganizationalUnits ? info.collaboratedWithOrganizationalUnits : [],
          name: info && info.name ? info.name : '',
          responsibleEmployees: info && info.responsibleEmployees ? info.responsibleEmployees : [],
          accountableEmployees: info && info.accountableEmployees ? info.accountableEmployees : [],
          consultedEmployees: info && info.consultedEmployees ? info.consultedEmployees : [],
          informedEmployees: info && info.informedEmployees ? info.informedEmployees : [],
          description: info && info.description ? info.description : '',
          creator: info && info.creator ? info.creator : getStorage('userId'),
          numberOfDaysTaken: info && info.numberOfDaysTaken ? info.numberOfDaysTaken : '',
          formula: info && info.formula ? info.formula : '',
          priority: info && info.priority ? info.priority : 3,
          taskActions: info && info.taskActions ? info.taskActions : [],
          taskInformations: info && info.taskInformations ? info.taskInformations : []
        },
        showMore: !props.isProcess
      })

      let defaultUnit
      if (user && user.organizationalUnitsOfUser)
        defaultUnit = user.organizationalUnitsOfUser.find(
          (item) => item.manager === state.currentRole || item.deputyManager === state.currentRole || item.employee === state.currentRole
        )
      if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
        // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
        defaultUnit = user.organizationalUnitsOfUser[0]
      }
    }

    if (!user.organizationalUnitsOfUser) {
      props.getDepartment() // => user.organizationalUnitsOfUser
    }

    // Khi truy vấn lấy các đơn vị mà user là manager đã có kết quả, và thuộc tính đơn vị của newTemplate chưa được thiết lập
    if (newTemplate.organizationalUnit === '' && user.organizationalUnitsOfUser) {
      // Tìm unit mà currentRole của user đang thuộc về
      const defaultUnit = user.organizationalUnitsOfUser.find(
        (item) =>
          item.managers.includes(state.currentRole) ||
          item.deputyManagers.includes(state.currentRole) ||
          item.employees.includes(state.currentRole)
      )

      if (defaultUnit) {
        setState({
          ...state,
          newTemplate: {
            ...state.newTemplate,
            organizationalUnit: defaultUnit._id
          }
        })
      }
    }
  }, [props.id, props.user.organizationalUnitsOfUser])

  /** Submit new template in data */
  const handleSubmit = async (event) => {
    const { newTemplate } = state
    const { department, user, translate, tasktemplates, isProcess } = props

    const listRoles = []
    if (user.roledepartments) {
      const listRole = user.roledepartments
      for (const x in listRole.employees) listRoles.push(listRole.employees[x])
    }
    if (state.readByEmployees.length === 0) {
      state.newTemplate.readByEmployees = listRoles
      await setState({
        ...state
      })
    }

    props.addNewTemplate(newTemplate)
    window.$('#addTaskTemplate').modal('hide')
  }

  /**
   * Xử lý form lớn tasktemplate
   */
  const isTaskTemplateFormValidated = () => {
    const result =
      validateTaskTemplateUnit(state.newTemplate.organizationalUnit, false) &&
      validateTaskTemplateRead(state.newTemplate.readByEmployees, false) &&
      validateTaskTemplateName(state.newTemplate.name, false) &&
      validateTaskTemplateDescription(state.newTemplate.description, false) &&
      validateTaskTemplateFormula(state.newTemplate.formula, false)
    return result
  }
  const handleTaskTemplateName = (event) => {
    const { value } = event.target
    const { isProcess } = props
    isProcess && props.handleChangeName(value)
    validateTaskTemplateName(value, true)
  }

  const validateTaskTemplateName = async (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateName(props.translate, value)

    if (willUpdateState) {
      state.newTemplate.name = value
      state.newTemplate.errorOnName = message
      setState({
        ...state
      })
    }
    // console.log('stst', state.newTemplate);
    props.onChangeTemplateData(state.newTemplate)
    return message === undefined
  }

  const handleTaskTemplateDesc = (event) => {
    const { value } = event.target
    validateTaskTemplateDescription(value, true)
  }

  const validateTaskTemplateDescription = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      state.newTemplate.description = value
      // state.newTemplate.errorOnDescription = msg;
      setState({
        ...state
      })
    }
    props.onChangeTemplateData(state.newTemplate)
    return message === undefined
  }

  const handleTaskTemplateFormula = (event) => {
    const { value } = event.target
    validateTaskTemplateFormula(value, true)
  }

  const validateTaskTemplateFormula = (value, willUpdateState = true) => {
    const msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value)

    if (willUpdateState) {
      state.newTemplate.formula = value
      // state.newTemplate.errorOnFormula = msg;
      setState({
        ...state
      })
    }
    props.onChangeTemplateData(state.newTemplate)
    return msg === undefined
  }

  const handleTaskTemplateNumberOfDaysTaken = (event) => {
    const { value } = event.target
    validateTaskTemplateNumberOfDaysTaken(value, true)
  }

  const validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateNumberInputMin(props.translate, value, 0)

    if (willUpdateState) {
      state.newTemplate.numberOfDaysTaken = value
      state.newTemplate.errorOnNumberOfDaysTaken = message
      setState({
        ...state
      })
    }
    props.onChangeTemplateData(state.newTemplate)
    return message === undefined
  }

  const handleChangeTaskPriority = (event) => {
    state.newTemplate.priority = event.target.value
    setState({
      ...state
    })
    props.onChangeTemplateData(state.newTemplate)
  }

  const handleTaskTemplateUnit = (value) => {
    const singleValue = value[0] // SelectBox một lựa chọn
    if (validateTaskTemplateUnit(singleValue, true)) {
      const { department } = props
      if (department !== undefined && department.departmentsThatUserIsManager !== undefined) {
        // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
        const dept = department.departmentsThatUserIsManager.find((item) => item._id === singleValue)
        if (dept) {
          console.log('oooo', dept)
          // props.getChildrenOfOrganizationalUnits(singleValue);
          props.getRoleSameDepartment(dept.managers)
        }
      }
    }
  }

  const validateTaskTemplateUnit = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        newTemplate: {
          // update lại unit, và reset các selection phía sau
          ...state.newTemplate,
          organizationalUnit: value,
          collaboratedWithOrganizationalUnits: [],
          errorOnUnit: message,
          readByEmployees: [],
          responsibleEmployees: [],
          accountableEmployees: [],
          consultedEmployees: [],
          informedEmployees: []
        }
      })
    }
    props.onChangeTemplateData(state.newTemplate)
    return message === undefined
  }

  const handleChangeCollaboratedWithOrganizationalUnits = (value) => {
    setState({
      ...state,
      newTemplate: {
        // update lại name,description và reset các selection phía sau
        ...state.newTemplate,
        collaboratedWithOrganizationalUnits: value
      }
    })
    props.onChangeTemplateData(state.newTemplate)
  }

  const handleTaskTemplateRead = (value) => {
    validateTaskTemplateRead(value, true)
  }

  const validateTaskTemplateRead = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateArrayLength(props.translate, value)

    if (willUpdateState) {
      const { newTemplate } = state
      newTemplate.readByEmployees = value
      newTemplate.errorOnRead = message
      setState({
        ...state,
        newTemplate
      })
    }
    props.onChangeTemplateData(state.newTemplate)
    return message === undefined
  }

  const handleTaskTemplateResponsible = (value) => {
    const { newTemplate } = state
    newTemplate.responsibleEmployees = value
    setState({
      ...state,
      newTemplate
    })
    props.isProcess && props.handleChangeResponsible(value)
    props.onChangeTemplateData(state.newTemplate)
  }

  const handleTaskTemplateAccountable = async (value) => {
    const { newTemplate } = state
    newTemplate.accountableEmployees = value
    await setState({
      ...state,
      newTemplate
    })
    props.isProcess && props.handleChangeAccountable(value)
    props.onChangeTemplateData(state.newTemplate)
  }

  const handleTaskTemplateConsult = (value) => {
    const { newTemplate } = state
    newTemplate.consultedEmployees = value
    setState({
      ...state,
      newTemplate
    })
    props.onChangeTemplateData(state.newTemplate)
  }

  const handleTaskTemplateInform = (value) => {
    const { newTemplate } = state
    newTemplate.informedEmployees = value
    setState({
      ...state,
      newTemplate
    })
    props.onChangeTemplateData(state.newTemplate)
  }

  const handleTaskActionsChange = (data) => {
    const { newTemplate } = state
    setState({
      ...state,
      newTemplate: {
        ...newTemplate,
        taskActions: data
      }
    })

    props.onChangeTemplateData(state.newTemplate)
  }

  const handleTaskInformationsChange = (data) => {
    const { newTemplate } = state
    setState({
      ...state,
      newTemplate: {
        ...newTemplate,
        taskInformations: data
      }
    })
    props.onChangeTemplateData(state.newTemplate)
  }

  const clickShowMore = () => {
    setState({
      ...state,
      showMore: !state.showMore
    })
  }

  let units
  let taskActions
  let taskInformations
  let listRole
  let usercompanys
  let userdepartments
  let departmentsThatUserIsManager
  let listRoles = []
  const { newTemplate, showMore, accountableEmployees, responsibleEmployees, id } = state
  const { department, user, translate, tasktemplates, isProcess } = props
  if (newTemplate.taskActions) taskActions = newTemplate.taskActions
  if (newTemplate.taskInformations) taskInformations = newTemplate.taskInformations

  if (user.organizationalUnitsOfUser) {
    units = user.organizationalUnitsOfUser
  }
  if (department.departmentsThatUserIsManager) {
    departmentsThatUserIsManager = department.departmentsThatUserIsManager
  }
  if (user.usersInUnitsOfCompany) {
    listRole = user.usersInUnitsOfCompany
    for (const x in listRole) {
      listRoles.push(Object.values(listRole[x].managers))
      listRoles.push(Object.values(listRole[x].deputyManagers))
      listRoles.push(Object.values(listRole[x].employees))
    }
    listRole = []
    for (const x in listRoles) {
      for (const i in listRoles[x]) {
        if (listRole.indexOf(listRoles[x][i]) === -1) {
          listRole = listRole.concat(listRoles[x][i])
        }
      }
    }
    listRoles = listRole
  }
  // if (user.usercompanys) usercompanys = user.usercompanys;
  if (user.userdepartments) userdepartments = user.userdepartments

  // var usersOfChildrenOrganizationalUnit;
  // if (user && user.usersOfChildrenOrganizationalUnit) {
  //     usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
  // }
  let usersInUnitsOfCompany
  if (user && user.usersInUnitsOfCompany) {
    usersInUnitsOfCompany = user.usersInUnitsOfCompany
  }

  const allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany)
  // let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

  return (
    <>
      {/** Form chứa các thông tin của 1 task template */}

      <div className='row'>
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/** Tên mẫu công việc */}
          <div className={`form-group ${state.newTemplate.errorOnName === undefined ? '' : 'has-error'}`}>
            <label className='control-label'>
              {translate('task_template.name')} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type='Name'
              className='form-control'
              placeholder={translate('task_template.name')}
              value={newTemplate.name}
              onChange={handleTaskTemplateName}
            />
            <ErrorLabel content={state.newTemplate.errorOnName} />
          </div>

          {/** Đơn vị(phòng ban) của Task template */}
          <div
            className={`form-group ${state.newTemplate.errorOnUnit === undefined ? '' : 'has-error'}`}
            style={{ marginLeft: 0, marginRight: 0 }}
          >
            <label className='control-label'>
              {translate('task_template.unit')}{' '}
              <span style={{ color: 'red' }}>
                {' '}
                <span style={{ color: 'red' }}>*</span>
              </span>
            </label>
            {usersInUnitsOfCompany !== undefined && newTemplate.organizationalUnit !== '' && (
              <SelectBox
                id='unit-select-box'
                className='form-control select2'
                style={{ width: '100%' }}
                items={usersInUnitsOfCompany.map((x) => {
                  return { value: x.id, text: x.department }
                })}
                value={newTemplate.organizationalUnit}
                onChange={handleTaskTemplateUnit}
                multiple={false}
              />
            )}
            <ErrorLabel content={newTemplate.errorOnUnit} />
          </div>

          {/* Chọn đơn vị phối hợp công việc */}
          {usersInUnitsOfCompany && (
            <div className='form-group'>
              <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
              <SelectBox
                id='multiSelectUnitThatHaveCollaboratedTemplate'
                lassName='form-control select2'
                style={{ width: '100%' }}
                items={usersInUnitsOfCompany
                  .filter((item) => String(item.id) !== String(newTemplate.organizationalUnit))
                  .map((x) => {
                    return { text: x.department, value: x.id }
                  })}
                options={{ placeholder: translate('kpi.evaluation.dashboard.select_units') }}
                onChange={handleChangeCollaboratedWithOrganizationalUnits}
                value={newTemplate.collaboratedWithOrganizationalUnits}
                multiple
              />
            </div>
          )}
        </div>

        {/** Những Role có quyền xem mẫu công việc này */}
        {!isProcess && (
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <div className={`form-group ${state.newTemplate.errorOnRead === undefined ? '' : 'has-error'}`}>
              <label className='control-label'>{translate('task_template.permission_view')} </label>
              {listRoles && (
                <SelectBox
                  id='read-select-box'
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listRoles.map((x) => {
                    return { value: x._id, text: x.name }
                  })}
                  value={newTemplate.readByEmployees}
                  onChange={handleTaskTemplateRead}
                  multiple
                  options={{ placeholder: `${translate('task_template.permission_view')}` }}
                />
              )}
              {/* <ErrorLabel content={state.newTemplate.errorOnRead} /> */}
            </div>
          </div>
        )}

        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/** Độ ưu tiên mẫu công việc */}
          <div className='form-group'>
            <label className='control-label'>{translate('task.task_management.priority')}</label>
            <select className='form-control' value={newTemplate.priority} onChange={handleChangeTaskPriority}>
              <option value={5}>{translate('task.task_management.urgent')}</option>
              <option value={4}>{translate('task.task_management.high')}</option>
              <option value={3}>{translate('task.task_management.standard')}</option>
              <option value={2}>{translate('task.task_management.average')}</option>
              <option value={1}>{translate('task.task_management.low')}</option>
            </select>
          </div>
        </div>

        {/** Mô tả mẫu công việc */}
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/* <div className={`form-group ${state.newTemplate.errorOnDescription === undefined ? "" : "has-error"}`} > */}
          <div className='form-group'>
            <label className='control-label' htmlFor='inputDescriptionTaskTemplate' style={{ width: '100%', textAlign: 'left' }}>
              {translate('task_template.description')}
            </label>
            <textarea
              rows={5}
              type='Description'
              className='form-control'
              id='inputDescriptionTaskTemplate'
              name='description'
              placeholder={translate('task_template.description')}
              value={newTemplate.description}
              onChange={handleTaskTemplateDesc}
            />
            {/* <ErrorLabel content={state.newTemplate.errorOnDescription} /> */}
          </div>
        </div>
      </div>
      {/* </div> */}

      <div className='row'>
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/** Người chịu trách nhiệm mẫu công việc */}
          <div className='form-group'>
            <label className='control-label'>{translate('task_template.performer')}</label>
            {allUnitsMember && (
              <SelectBox
                id={isProcess ? `responsible-select-box-${id}` : 'responsible-select-box'}
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember}
                value={newTemplate.responsibleEmployees}
                onChange={handleTaskTemplateResponsible}
                multiple
                options={{ placeholder: `${translate('task_template.performer')}` }}
              />
            )}
          </div>
          {/** Người phê duyệt mẫu công việc */}
          <div className='form-group'>
            <label className='control-label'>{translate('task_template.approver')}</label>
            {allUnitsMember && (
              <SelectBox
                id={isProcess ? `accountable-select-box-${id}` : 'accountable-select-box'}
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember}
                value={newTemplate.accountableEmployees}
                onChange={handleTaskTemplateAccountable}
                multiple
                options={{ placeholder: `${translate('task_template.approver')}` }}
              />
            )}
          </div>

          {showMore && (
            <div>
              {/** Người tư vấn trong mẫu công việc */}
              <div className='form-group'>
                <label className='control-label'>{translate('task_template.consultant')}</label>
                {allUnitsMember && (
                  <SelectBox
                    id={isProcess ? `consulted-select-box-${id}` : 'consulted-select-box'}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={allUnitsMember}
                    value={newTemplate.consultedEmployees}
                    onChange={handleTaskTemplateConsult}
                    multiple
                    options={{ placeholder: `${translate('task_template.consultant')}` }}
                  />
                )}
              </div>
              {/** Người quan sát mẫu công việc */}
              <div className='form-group'>
                <label className='control-label'>{translate('task_template.observer')}</label>
                {allUnitsMember && (
                  <SelectBox
                    id={isProcess ? `informed-select-box-${id}` : 'informed-select-box'}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={allUnitsMember}
                    value={newTemplate.informedEmployees}
                    onChange={handleTaskTemplateInform}
                    multiple
                    options={{ placeholder: `${translate('task_template.observer')}` }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {showMore && (
          <div>
            {isProcess && (
              <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
                {/** Số ngày hoàn thành công việc dự kiến */}
                <div className={`form-group ${state.newTemplate.errorOnNumberOfDaysTaken === undefined ? '' : 'has-error'}`}>
                  <label className='control-label' htmlFor='inputNumberOfDaysTaken'>
                    {translate('task_template.numberOfDaysTaken')}
                  </label>
                  <input
                    type='number'
                    className='form-control'
                    id='inputNumberOfDaysTaken'
                    value={newTemplate.numberOfDaysTaken}
                    placeholder='Nhập số ngày hoàn thành dự kiến'
                    onChange={handleTaskTemplateNumberOfDaysTaken}
                  />
                  <ErrorLabel content={state.newTemplate.errorOnNumberOfDaysTaken} />
                </div>
              </div>
            )}
            <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
              {/** Công thức tính của mẫu công việc */}
              <div className={`form-group ${state.newTemplate.errorOnFormula === undefined ? '' : 'has-error'}`}>
                <label className='control-label' htmlFor='inputFormula'>
                  {translate('task_template.formula')}
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='inputFormula'
                  placeholder='progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100'
                  value={newTemplate.formula}
                  onChange={handleTaskTemplateFormula}
                />
                <ErrorLabel content={state.newTemplate.errorOnFormula} />

                <br />
                <div>
                  <span style={{ fontWeight: 800 }}>Ví dụ: </span>progress / (daysUsed / totalDays) - (numberOfFailedActions /
                  (numberOfFailedActions + numberOfPassedActions)) * 100
                </div>
                <br />
                <div>
                  <span style={{ fontWeight: 800 }}>{translate('task_template.parameters')}:</span>
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>daysOverdue</span> - Thời gian quá hạn (ngày)
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>daysUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>totalDays</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>averageActionRating</span> - Trung bình điểm đánh giá (rating) hoạt động của công việc
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>numberOfFailedActions</span> - Số hoạt động không đạt (rating &lt; 5)
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>numberOfPassedActions</span> - Số hoạt động đạt (rating &ge; 5)
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>p1, p2,...</span> - Thông tin công việc kiểu số có trong mẫu
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showMore && (
        <div className='row'>
          {/** Các hoạt động trong mẫu công việc */}
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <ActionForm initialData={taskActions} onDataChange={handleTaskActionsChange} />
          </div>
          {/** Các thông tin cần có mẫu công việc */}
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <InformationForm initialData={taskInformations} onDataChange={handleTaskInformationsChange} />
          </div>
        </div>
      )}

      {isProcess && (
        <div>
          <a style={{ cursor: 'pointer' }} onClick={clickShowMore}>
            {showMore ? (
              <span>
                Show less <i className='fa fa-angle-double-up' />
              </span>
            ) : (
              <span>
                Show more <i className='fa fa-angle-double-down' />
              </span>
            )}
          </a>
          <br />
        </div>
      )}
    </>
  )
}

function mapState(state) {
  const { department, user, tasktemplates } = state
  const adding = state.tasktemplates
  return { adding, department, user, tasktemplates }
}

const actionCreators = {
  addNewTemplate: taskTemplateActions.addTaskTemplate,
  getDepartment: UserActions.getDepartmentOfUser,
  // getAllUserOfCompany: UserActions.getAllUserOfCompany,
  getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
  getRoleSameDepartment: UserActions.getRoleSameDepartment,
  getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager,
  // getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
}
const connectedAddTaskTemplate = connect(mapState, actionCreators)(withTranslate(AddTaskTemplate))
export { connectedAddTaskTemplate as AddTaskTemplate }
