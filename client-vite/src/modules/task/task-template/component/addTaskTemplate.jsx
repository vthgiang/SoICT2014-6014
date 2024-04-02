import React, { Component, useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskTemplateActions } from '../redux/actions'
import { InformationForm } from '../component/informationsTemplate'
import { ActionForm } from '../component/actionsTemplate'
import { SelectBox, ErrorLabel, QuillEditor } from '../../../../common-components'
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper'
import { TaskTemplateFormValidator } from './taskTemplateFormValidator'
import { getStorage } from '../../../../config'
import ValidationHelper from '../../../../helpers/validationHelper'

import parse from 'html-react-parser'

function AddTaskTemplate(props) {
  let userId = getStorage('userId')

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
    showMore: props.isProcess ? false : true,
    currentRole: localStorage.getItem('currentRole')
  })

  useEffect(() => {
    // props.getDepartment(); // => user.organizationalUnitsOfUser
    // props.getAllUserOfCompany(); // => user.usercompanys
    props.getRoleSameDepartment(localStorage.getItem('currentRole')) // => user.roledepartments
    props.getDepartmentsThatUserIsManager() // => department.departmentsThatUserIsManager
    props.getAllUserInAllUnitsOfCompany() // => user.usersInUnitsOfCompany
  }, [])

  const handleTaskTemplateName = (e) => {
    let { value } = e.target
    let { isProcess, translate } = props
    isProcess && props.handleChangeName(value)
    let { message } = ValidationHelper.validateName(translate, value, 1, 255)
    let { newTemplate } = state
    newTemplate.name = value
    newTemplate.errorOnName = message
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  //for analysis
  const handleTaskTempLateClassName = (value) => {
    let singleValue = value[0]; // SelectBox một lựa chọn
    let { newTemplate } = state;
    newTemplate.class = singleValue
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    });
    // props.handleChangeClassName(singleValue)
  }

  // handleTaskTemplateDesc = (e) => {
  //     let { value } = e.target;
  //     let { isProcess, translate } = props
  //     isProcess && props.handleChangeName(value);
  //     let { message } = ValidationHelper.validateName(translate, value, 1, 255);
  //     let { newTemplate } = state;
  //     newTemplate.description = value;
  //     newTemplate.errorDescription = message;
  //     props.onChangeTemplateData(newTemplate);
  //     setState({ newTemplate });
  // }

  const handleTaskTemplateDesc = (value, imgs) => {
    setState((state) => {
      return {
        ...state,
        newTemplate: {
          ...state.newTemplate,
          description: value
        }
      }
    })

    props.onChangeTemplateData(state.newTemplate)
  }

  const handleTaskTemplateFormula = (event) => {
    let value = event.target.value
    validateTaskTemplateFormula(value, true)
  }

  const validateTaskTemplateFormula = (value, willUpdateState = true) => {
    let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value)

    if (willUpdateState) {
      state.newTemplate.formula = value
      state.newTemplate.errorOnFormula = msg
      setState((state) => {
        return {
          ...state
        }
      })
    }
    props.onChangeTemplateData(state.newTemplate)
    return msg === undefined
  }

  const handleTaskTemplateNumberOfDaysTaken = (event) => {
    let value = event.target.value
    validateTaskTemplateNumberOfDaysTaken(value, true)
  }

  const validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateNumberInputMin(props.translate, value, 0)

    if (willUpdateState) {
      state.newTemplate.numberOfDaysTaken = value
      state.newTemplate.errorOnNumberOfDaysTaken = message
      setState((state) => {
        return {
          ...state
        }
      })
    }
    props.onChangeTemplateData(state.newTemplate)
    return message === undefined
  }

  const handleChangeTaskPriority = (e) => {
    let { newTemplate } = state
    let { value } = e.target
    newTemplate.priority = value
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateUnit = (value) => {
    let singleValue = value[0] // SelectBox một lựa chọn
    if (validateTaskTemplateUnit(singleValue, true)) {
      const { department } = props
      if (department !== undefined && department.departmentsThatUserIsManager !== undefined) {
        // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
        let dept = department.departmentsThatUserIsManager.find((item) => item._id === singleValue)
        if (dept) {
          props.getRoleSameDepartment(dept.managers)
        }
      }
    }
  }

  const validateTaskTemplateUnit = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)
    let newData = {
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

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          newTemplate: newData
        }
      })
      props.onChangeTemplateData(newData)
    }
    return message === undefined
  }

  const handleChangeCollaboratedWithOrganizationalUnits = (value) => {
    let { newTemplate } = state
    newTemplate.collaboratedWithOrganizationalUnits = value
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateRead = (value) => {
    let { newTemplate } = state
    newTemplate.readByEmployees = value
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateResponsible = (value) => {
    let { newTemplate } = state
    newTemplate.responsibleEmployees = value
    props.isProcess && props.handleChangeResponsible(value)
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateAccountable = async (value) => {
    let { newTemplate } = state
    newTemplate.accountableEmployees = value
    props.isProcess && props.handleChangeAccountable(value)
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateConsult = (value) => {
    let { newTemplate } = state
    newTemplate.consultedEmployees = value
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateInform = (value) => {
    let { newTemplate } = state
    newTemplate.informedEmployees = value
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskActionsChange = (data) => {
    let { newTemplate } = state
    newTemplate.taskActions = data
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskInformationsChange = (data) => {
    let { newTemplate } = state
    newTemplate.taskInformations = data
    props.onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  useEffect(() => {
    const { department, user } = props
    const { newTemplate } = state

    // dùng cho chức năng tạo task process
    if (props.isProcess && props.id !== state.id) {
      let { info, listOrganizationalUnit } = props

      let defaultUnit
      if (user && user.organizationalUnitsOfUser)
        defaultUnit = user.organizationalUnitsOfUser.find(
          (item) => item.manager === state.currentRole || item.deputyManager === state.currentRole || item.employee === state.currentRole
        )
      if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
        // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
        defaultUnit = user.organizationalUnitsOfUser[0]
      }

      setState((state) => {
        return {
          ...state,
          id: props.id,
          newTemplate: {
            organizationalUnit: info && info.organizationalUnit ? info.organizationalUnit : defaultUnit?._id,
            collaboratedWithOrganizationalUnits:
              info && info.collaboratedWithOrganizationalUnits ? info.collaboratedWithOrganizationalUnits : [],
            name: info && info.name ? info.name : '',
            responsibleEmployees: info && info.responsibleEmployees ? info.responsibleEmployees : [],
            accountableEmployees: info && info.accountableEmployees ? info.accountableEmployees : [],
            consultedEmployees: info && info.consultedEmployees ? info.consultedEmployees : [],
            informedEmployees: info && info.informedEmployees ? info.informedEmployees : [],
            description: info && info.description ? info.description : '',
            quillDescriptionDefault: info && info.description ? info.description : '',
            creator: info && info.creator ? info.creator : getStorage('userId'),
            numberOfDaysTaken: info && info.numberOfDaysTaken ? info.numberOfDaysTaken : '',
            formula: info && info.formula ? info.formula : '',
            priority: info && info.priority ? info.priority : 3,
            taskActions: info && info.taskActions ? info.taskActions : [],
            taskInformations: info && info.taskInformations ? info.taskInformations : []
          },
          showMore: props.isProcess ? false : true
        }
      })
    }
  }, [props.id]) // JSON.stringify(state.newTemplate)

  //dùng cho chức năng lưu task thành template
  useEffect(() => {
    if (props.savedTaskAsTemplate && props.savedTaskId !== state.savedTaskId) {
      setState((state) => {
        return {
          ...state,
          savedTaskId: props.savedTaskId,
          id: props.savedTaskId,
          savedTaskAsTemplate: props.savedTaskAsTemplate,
          newTemplate: {
            organizationalUnit: props.savedTaskItem.organizationalUnit._id,
            collaboratedWithOrganizationalUnits: props.savedTaskItem.collaboratedWithOrganizationalUnits.map(
              (e) => e.organizationalUnit._id
            ),
            name: props.savedTaskItem.name,
            // readByEmployees: props.savedTaskItem.readByEmployees,
            responsibleEmployees: props.savedTaskItem.responsibleEmployees.map((e) => e._id),
            accountableEmployees: props.savedTaskItem.accountableEmployees.map((e) => e._id),
            consultedEmployees: props.savedTaskItem.consultedEmployees.map((e) => e._id),
            informedEmployees: props.savedTaskItem.informedEmployees.map((e) => e._id),
            description: props.savedTaskItem.description,
            quillDescriptionDefault: props.savedTaskItem.description,
            // numberOfDaysTaken: props.savedTaskItem.numberOfDaysTaken,
            formula: props.savedTaskItem.formula,
            priority: props.savedTaskItem.priority,
            taskActions: props.savedTaskItem.taskActions.map((e) => {
              return {
                mandatory: e.mandatory,
                name: e.name ? e.name : e.description,
                description: e.description
              }
            }),
            taskInformations: props.savedTaskItem.taskInformations.map((e) => {
              return {
                filledByAccountableEmployeesOnly: e.filledByAccountableEmployeesOnly,
                code: e.code,
                name: e.name,
                description: e.description,
                type: e.type,
                extra: e.extra
              }
            }),
            creator: getStorage('userId')
          }
        }
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
    if (!props.isProcess && newTemplate.organizationalUnit === '' && user?.organizationalUnitsOfUser) {
      // Tìm unit mà currentRole của user đang thuộc về
      let defaultUnit = user.organizationalUnitsOfUser.find(
        (item) =>
          item.managers.includes(state.currentRole) ||
          item.deputyManagers.includes(state.currentRole) ||
          item.employees.includes(state.currentRole)
      )

      if (defaultUnit) {
        setState((state) => {
          return {
            ...state,
            newTemplate: {
              ...state.newTemplate,
              organizationalUnit: defaultUnit._id
            }
          }
        })
        // props.getChildrenOfOrganizationalUnits(defaultUnit._id); // => user.usersOfChildrenOrganizationalUnit
        // Sẽ cập nhật lại state nên không cần render
      }
    }
  }, [props.savedTaskId, props?.user.isLoading, props.isProcess]) // JSON.stringify(state.newTemplate) , props?.user.isLoading

  const clickShowMore = () => {
    setState((state) => {
      return {
        ...state,
        showMore: !state.showMore
      }
    })
  }

  var units,
    taskActions,
    taskInformations,
    listRole,
    usercompanys,
    userdepartments,
    departmentsThatUserIsManager,
    listRoles = []
  const { savedTaskAsTemplate, newTemplate, showMore, accountableEmployees, responsibleEmployees, id } = state
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
    for (let x in listRole) {
      listRoles.push(Object.values(listRole[x].managers))
      listRoles.push(Object.values(listRole[x].deputyManagers))
      listRoles.push(Object.values(listRole[x].employees))
    }
    listRole = []
    for (let x in listRoles) {
      for (let i in listRoles[x]) {
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
  var usersInUnitsOfCompany
  if (user && user.usersInUnitsOfCompany) {
    usersInUnitsOfCompany = user.usersInUnitsOfCompany
  }

  var allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany)
  // let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

  return (
    <React.Fragment>
      {/**Form chứa các thông tin của 1 task template */}

      <div className='row'>
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/**Tên mẫu công việc */}
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
          <div className={`form-group`} >
            <label className="control-label">Lớp công việc <span style={{ color: "red" }}>*</span></label>
            {props.analysisData.class && <SelectBox
              id={`class-name-select-box-${id}`}
              className="form-control select2"
              style={{ width: "100%" }}
              items={
                [
                  { value: 1, text: 'Loại 1: Chịu ảnh hưởng bởi con người' },
                  { value: 2, text: 'Loại 2: Chịu ảnh hưởng bởi con người và thiết bị' },
                  { value: 3, text: 'Loại 3: Chịu ảnh hưởng của sản phẩm và thiết bị' },
                  { value: 4, text: 'Loại 4: Chịu ảnh hưởng của môi trường' },

                ]
              }
              value={newTemplate.class}
              onChange={handleTaskTempLateClassName}
              multiple={false}

            />}
          </div>

          {/**Đơn vị(phòng ban) của Task template*/}
          <div
            className={`form-group ${state.newTemplate.errorOnUnit === undefined ? '' : 'has-error'}`}
            style={{ marginLeft: 0, marginRight: 0 }}
          >
            <label className='control-label'>{translate('task_template.unit')}</label>
            {usersInUnitsOfCompany !== undefined && newTemplate.organizationalUnit !== '' && (
              <SelectBox
                id={`unit-select-box-${id}`}
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
          </div>

          {/* Chọn đơn vị phối hợp công việc */}
          {usersInUnitsOfCompany && (
            <div className='form-group'>
              <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
              <SelectBox
                id={`multiSelectUnitThatHaveCollaboratedTemplate-${id}`}
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
                multiple={true}
              />
            </div>
          )}
        </div>

        {/**Những Role có quyền xem mẫu công việc này*/}
        {!isProcess && (
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <div className={`form-group ${state.newTemplate.errorOnRead === undefined ? '' : 'has-error'}`}>
              <label className='control-label'>{translate('task_template.permission_view')} </label>
              {listRoles && (
                <SelectBox
                  id={`read-select-box-${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listRoles.map((x) => {
                    return { value: x._id, text: x.name }
                  })}
                  value={newTemplate.readByEmployees}
                  onChange={handleTaskTemplateRead}
                  multiple={true}
                  options={{ placeholder: `${translate('task_template.permission_view')}` }}
                />
              )}
              {/* <ErrorLabel content={state.newTemplate.errorOnRead} /> */}
            </div>
          </div>
        )}

        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/**Độ ưu tiên mẫu công việc */}
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

        {/* Mô tả công việc */}
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          <div className={`form-group`}>
            <label className='control-label'>{translate('task.task_management.detail_description')}</label>
            <QuillEditor
              id={`task-template-add-modal-quill-${id}`}
              table={false}
              embeds={false}
              getTextData={handleTaskTemplateDesc}
              maxHeight={80}
              quillValueDefault={newTemplate.quillDescriptionDefault}
              placeholder={translate('task_template.description')}
            />
          </div>
        </div>
      </div>
      {/* </div> */}

      <div className='row'>
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/**Người chịu trách nhiệm mẫu công việc */}
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
                multiple={true}
                options={{ placeholder: `${translate('task_template.performer')}` }}
              />
            )}
          </div>
          {/**Người phê duyệt mẫu công việc */}
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
                multiple={true}
                options={{ placeholder: `${translate('task_template.approver')}` }}
              />
            )}
          </div>

          {showMore && (
            <div>
              {/**Người tư vấn trong mẫu công việc */}
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
                    multiple={true}
                    options={{ placeholder: `${translate('task_template.consultant')}` }}
                  />
                )}
              </div>
              {/**Người quan sát mẫu công việc */}
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
                    multiple={true}
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
                {/**Số ngày hoàn thành công việc dự kiến */}
                <div className={`form-group ${state.newTemplate.errorOnNumberOfDaysTaken === undefined ? '' : 'has-error'}`}>
                  <label className='control-label' htmlFor='inputNumberOfDaysTaken'>
                    {translate('task_template.numberOfDaysTaken')}
                  </label>
                  <input
                    type='number'
                    className='form-control'
                    id='inputNumberOfDaysTaken'
                    value={newTemplate.numberOfDaysTaken}
                    placeholder={'Nhập số ngày hoàn thành dự kiến'}
                    onChange={handleTaskTemplateNumberOfDaysTaken}
                  />
                  <ErrorLabel content={state.newTemplate.errorOnNumberOfDaysTaken} />
                </div>
              </div>
            )}
            <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
              {/**Công thức tính của mẫu công việc */}
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
          {/**Các hoạt động trong mẫu công việc */}
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <ActionForm initialData={taskActions} onDataChange={handleTaskActionsChange} savedTaskAsTemplate={savedTaskAsTemplate} />
          </div>
          {/**Các thông tin cần có mẫu công việc */}
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <InformationForm
              initialData={taskInformations}
              onDataChange={handleTaskInformationsChange}
              savedTaskAsTemplate={savedTaskAsTemplate}
            />
          </div>
        </div>
      )}

      {isProcess && (
        <div>
          <a style={{ cursor: 'pointer' }} onClick={clickShowMore}>
            {showMore ? (
              <span>
                Show less <i className='fa fa-angle-double-up'></i>
              </span>
            ) : (
              <span>
                Show more <i className='fa fa-angle-double-down'></i>
              </span>
            )}
          </a>
          <br />
        </div>
      )}
    </React.Fragment>
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
