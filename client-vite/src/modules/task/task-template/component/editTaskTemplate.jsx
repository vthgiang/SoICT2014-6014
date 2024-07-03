import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskTemplateActions } from '../redux/actions'
import { ActionForm } from './actionsTemplate'
import { SelectBox, ErrorLabel, QuillEditor } from '../../../../common-components'
import { TaskTemplateFormValidator } from './taskTemplateFormValidator'
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper'
import { InformationForm } from './informationsTemplate'
import { getStorage } from '../../../../config'
import ValidationHelper from '../../../../helpers/validationHelper'
import { createUnitKpiActions } from '../../../kpi/organizational-unit/creation/redux/actions'

function EditTaskTemplate(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    editingTemplate: {
      organizationalUnit: '',
      name: '',
      readByEmployees: [],
      responsibleEmployees: [],
      accountableEmployees: [],
      consultedEmployees: [],
      informedEmployees: [],
      description: '',
      numberOfDaysTaken: '',
      formula: '',
      priority: 3,
      taskActions: [],
      taskInformations: [],
      isMappingTask: false,
      listMappingTask: []
    },
    showMore: !props.isProcess
  })
  const dispatch = useDispatch()
  const createKpiUnit = useSelector((selector) => selector.createKpiUnit)

  useEffect(() => {
    dispatch(createUnitKpiActions.getKPIParent({ roleId: localStorage.getItem('currentRole') }))
  }, [])

  useEffect(() => {
    // get department of current user
    props.getDepartment()
    // lấy tất cả nhân viên của công ty
    props.getAllUserOfCompany()
    // Lấy tất cả vai trò cùng phòng ban
    props.getRoleSameDepartment(localStorage.getItem('currentRole'))
    // Lấy tất cả các role là manager
    props.getDepartmentsThatUserIsManager()
    // Lấy tất cả nhân viên trong công ty
    props.getAllUserInAllUnitsOfCompany()
  }, [])

  useEffect(() => {
    if (props.taskTemplateId !== state.taskTemplateId) {
      const editingTemplate = {
        ...props.taskTemplate,
        quillDescriptionDefault: props.taskTemplate?.description
      }

      setState((state) => {
        return {
          ...state,
          taskTemplateId: props.taskTemplateId,
          editingTemplate,
          errorOnName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
          errorOnDescription: undefined,
          errorOnRead: undefined,
          errorOnFormula: undefined,
          errorOnUnit: undefined,
          showActionForm: undefined
        }
      })
    }
  }, [props.taskTemplateId])

  useEffect(() => {
    // dùng cho công việc có quy trình
    if (props.isProcess && props.id !== state.id) {
      const { info } = props
      setState((state) => {
        return {
          ...state,
          id: props.id,
          editingTemplate: {
            organizationalUnit: info && info.organizationalUnit?._id ? info.organizationalUnit._id : info.organizationalUnit,
            collaboratedWithOrganizationalUnits:
              info && info.collaboratedWithOrganizationalUnits
                ? info.collaboratedWithOrganizationalUnits.map((item) => {
                    if (typeof item === 'object') {
                      return item._id
                    }
                    return item
                  })
                : [],
            name: info && info.name ? info.name : '',
            readByEmployees: info.readByEmployees,
            responsibleEmployees:
              info && info.responsibleEmployees
                ? info.responsibleEmployees.map((item) => {
                    if (typeof item === 'object') {
                      return item._id
                    }
                    return item
                  })
                : [],
            accountableEmployees:
              info && info.accountableEmployees
                ? info.accountableEmployees.map((item) => {
                    if (typeof item === 'object') {
                      return item._id
                    }
                    return item
                  })
                : [],
            consultedEmployees:
              info && info.consultedEmployees
                ? info.consultedEmployees.map((item) => {
                    if (typeof item === 'object') {
                      return item._id
                    }
                    return item
                  })
                : [],
            informedEmployees:
              info && info.informedEmployees
                ? info.informedEmployees.map((item) => {
                    if (typeof item === 'object') {
                      return item._id
                    }
                    return item
                  })
                : [],
            description: info && info.description ? info.description : '',
            quillDescriptionDefault: info && info.description ? info.description : '',
            creator: info && info.creator ? info.creator : getStorage('userId'),
            numberOfDaysTaken: info && info.numberOfDaysTaken ? info.numberOfDaysTaken : '',
            formula: info && info.formula ? info.formula : '',
            priority: info && info.priority ? info.priority : 3,
            taskActions: info && info.taskActions ? info.taskActions : [],
            taskInformations: info && info.taskInformations ? info.taskInformations : []
          },
          showMore: !props.isProcess,
          showActionForm: true
        }
      })
      props.getDepartment()
      const { user } = props
      let defaultUnit
      if (user && user.organizationalUnitsOfUser)
        defaultUnit = user.organizationalUnitsOfUser.find(
          (item) => item.manager === state.currentRole || item.deputyManager === state.currentRole || item.employee === state.currentRole
        )
      if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
        // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
        defaultUnit = user.organizationalUnitsOfUser[0]
      }
      // props.getChildrenOfOrganizationalUnits(defaultUnit && defaultUnit._id);
    }
  }, [props.id])

  useEffect(() => {
    // là dạng mẫu công việc
    if (props.isTaskTemplate && props.taskTemplateId !== state.taskTemplateId) {
      setState({
        ...state,
        taskTemplateId: props.taskTemplateId,
        editingTemplate: {
          _id: props.taskTemplate._id,
          organizationalUnit: props.taskTemplate.organizationalUnit,
          collaboratedWithOrganizationalUnits: props.taskTemplate.collaboratedWithOrganizationalUnits,
          name: props.taskTemplate.name,
          readByEmployees: props.taskTemplate.readByEmployees,
          responsibleEmployees: props.taskTemplate.responsibleEmployees,
          accountableEmployees: props.taskTemplate.accountableEmployees,
          consultedEmployees: props.taskTemplate.consultedEmployees,
          informedEmployees: props.taskTemplate.informedEmployees,
          description: props.taskTemplate.description,
          quillDescriptionDefault: props.taskTemplate.description,
          numberOfDaysTaken: props.taskTemplate.numberOfDaysTaken,
          formula: props.taskTemplate.formula,
          priority: props.taskTemplate.priority,
          taskActions: props.taskTemplate.taskActions,
          taskInformations: props.taskTemplate.taskInformations,
          isMappingTask: props.taskTemplate.isMappingTask,
          listMappingTask: props.taskTemplate.listMappingTask
        },
        showActionForm: true
      })
    }

    // Khi truy vấn lấy các đơn vị mà user là manager đã có kết quả, và thuộc tính đơn vị của editingTemplate chưa được thiết lập
    else if (editingTemplate.organizationalUnit === '' && department.departmentsThatUserIsManager) {
      // Tìm unit mà currentRole của user đang thuộc về
      const defaultUnit = department.departmentsThatUserIsManager.find(
        (item) =>
          item.managers.includes(state.currentRole) ||
          item.deputyManagers.includes(state.currentRole) ||
          item.employees.includes(state.currentRole)
      )

      if (defaultUnit) {
        setState((state) => {
          return {
            ...state,
            editingTemplate: {
              ...state.editingTemplate,
              organizationalUnit: defaultUnit._id
            }
          }
        })
        // props.getChildrenOfOrganizationalUnits(defaultUnit._id);
        // Sẽ cập nhật lại state nên không cần render
      }
    }
  }, [props.taskTemplateId])

  const validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateNumberInputMin(props.translate, value, 0)

    if (willUpdateState) {
      const { editingTemplate } = state
      editingTemplate.numberOfDaysTaken = value
      editingTemplate.errorOnNumberOfDaysTaken = message
      setState({
        ...state,
        editingTemplate
      })
    }
    props.onChangeTemplateData(state.editingTemplate)
    return message === undefined
  }

  const handleTaskTemplateFormula = (event) => {
    const { value } = event.target
    validateTaskTemplateFormula(value, true)
  }

  const validateTaskTemplateFormula = (value, willUpdateState = true) => {
    const msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value)

    if (willUpdateState) {
      const { editingTemplate } = state
      editingTemplate.formula = value
      editingTemplate.errorOnFormula = msg
      setState({
        ...state,
        editingTemplate
      })
    }
    props.onChangeTemplateData(state.editingTemplate)
    return msg == undefined
  }

  /**
   * Xử lý form lớn tasktemplate
   */
  // const isTaskTemplateFormValidated = () => {
  //   if (!state.editingTemplate._id) return false
  //   const result =
  //     validateTaskTemplateRead(state.editingTemplate.readByEmployees, false) &&
  //     validateTaskTemplateName(state.editingTemplate.name, false) &&
  //     validateTaskTemplateDesc(state.editingTemplate.description, false) &&
  //     validateTaskTemplateFormula(state.editingTemplate.formula, false) &&
  //     validateTaskTemplateUnit(state.editingTemplate.organizationalUnit, false)
  //   return result
  // }

  const handleTaskTemplateName = (event) => {
    const { value } = event.target
    props.isProcess && props.handleChangeName(value)
    validateTaskTemplateName(value, true)
  }

  const validateTaskTemplateName = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateName(props.translate, value)

    if (willUpdateState) {
      state.editingTemplate.name = value
      state.editingTemplate.errorOnName = message
      setState((state) => {
        return {
          ...state
        }
      })
    }
    props.onChangeTemplateData(state.editingTemplate)
    return message == undefined
  }

  const handleTaskTemplateDesc = (value, imgs) => {
    validateTaskTemplateDesc(value, true)
  }

  const validateTaskTemplateDesc = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      const { editingTemplate } = state
      editingTemplate.description = value
      editingTemplate.errorOnDescription = message
      setState({
        ...state,
        editingTemplate
      })
    }
    props.onChangeTemplateData(state.editingTemplate)
    return message == undefined
  }

  const handleTaskTemplateNumberOfDaysTaken = (event) => {
    const { value } = event.target
    validateTaskTemplateNumberOfDaysTaken(value, true)
  }

  const handleChangeTaskPriority = (event) => {
    const { editingTemplate } = state
    editingTemplate.priority = event.target.value
    setState({
      ...state,
      editingTemplate
    })
    props.onChangeTemplateData(state.editingTemplate)
  }

  const handleTaskTemplateUnit = (value) => {
    const singleValue = value[0] // SelectBox một lựa chọn
    if (validateTaskTemplateUnit(singleValue, true)) {
      const { department } = props

      if (department !== undefined && department.departmentsThatUserIsManager !== undefined) {
        // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
        const dept = department.departmentsThatUserIsManager.find((item) => item._id === singleValue)
        if (dept) {
          // props.getChildrenOfOrganizationalUnits(singleValue);
          props.getRoleSameDepartment(dept.manager)
        }
      }
    }
  }

  const validateTaskTemplateUnit = (value, willUpdateState = true) => {
    let msg

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          editingTemplate: {
            // update lại unit, và reset các selection phía sau
            ...state.editingTemplate,
            organizationalUnit: value,
            collaboratedWithOrganizationalUnits: [],
            errorOnUnit: msg,
            readByEmployees: [],
            responsibleEmployees: [],
            accountableEmployees: [],
            consultedEmployees: [],
            informedEmployees: []
          }
        }
      })
    }
    props.onChangeTemplateData(state.editingTemplate)
    return msg == undefined
  }

  const handleChangeCollaboratedWithOrganizationalUnits = (value) => {
    setState((state) => {
      return {
        ...state,
        editingTemplate: {
          // update lại name,description và reset các selection phía sau
          ...state.editingTemplate,
          collaboratedWithOrganizationalUnits: value
        }
      }
    })
    props.onChangeTemplateData(state.editingTemplate)
  }

  const handleTaskTemplateRead = (value) => {
    validateTaskTemplateRead(value, true)
  }

  const validateTaskTemplateRead = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateArrayLength(props.translate, value)

    if (willUpdateState) {
      const { editingTemplate } = state
      editingTemplate.readByEmployees = value
      editingTemplate.errorOnRead = message
      setState({
        ...state,
        editingTemplate
      })
    }
    props.onChangeTemplateData(state.editingTemplate)
    return message == undefined
  }

  const handleTaskTemplateResponsible = (value) => {
    const { editingTemplate } = state
    editingTemplate.responsibleEmployees = value
    setState({
      ...state,
      editingTemplate
    })
    props.isProcess && props.handleChangeResponsible(value)
    props.onChangeTemplateData(state.editingTemplate)
  }

  const handleTaskTemplateAccountable = (value) => {
    const { editingTemplate } = state
    editingTemplate.accountableEmployees = value
    setState({
      ...state,
      editingTemplate
    })
    props.isProcess && props.handleChangeAccountable(value)
    props.onChangeTemplateData(state.editingTemplate)
  }

  const handleTaskTemplateConsult = (value) => {
    const { editingTemplate } = state
    editingTemplate.consultedEmployees = value
    setState({
      ...state,
      editingTemplate
    })
    props.onChangeTemplateData(state.editingTemplate)
  }

  const handleTaskTemplateInform = (value) => {
    const { editingTemplate } = state
    editingTemplate.informedEmployees = value

    setState({
      ...state,
      editingTemplate
    })
    props.onChangeTemplateData(state.editingTemplate)
  }

  const handleTaskActionsChange = (data) => {
    const { editingTemplate } = state
    const change = { ...state.editingTemplate, taskActions: data }
    // console.log(change);
    // console.log(data);
    setState((state) => {
      return {
        ...state,
        editingTemplate: {
          ...editingTemplate,
          taskActions: data
        }
      }
    })
    props.onChangeTemplateData(change)
  }

  const handleTaskInformationsChange = (data) => {
    const { editingTemplate } = state
    const change = { ...state.editingTemplate, taskInformations: data }
    setState((state) => {
      return {
        ...state,
        editingTemplate: {
          ...editingTemplate,
          taskInformations: data
        }
      }
    })
    props.onChangeTemplateData(change)
  }

  const clickShowMore = () => {
    setState((state) => {
      return {
        ...state,
        showMore: !state.showMore
      }
    })
  }

  let listRole
  let listRoles = []
  var { editingTemplate, id, showMore, taskTemplateId } = state

  const { department, user, translate } = props
  const { isProcess } = props

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

  const handleIsShowMappingTaskTemplates = ($event) => {
    const checkValue = $event.target.checked
    setState((prevState) => ({
      ...prevState,
      editingTemplate: {
        ...prevState.editingTemplate,
        isMappingTask: checkValue
      }
    }))
  }
  return (
    <>
      {/** Form chứa thông tin của mẫu công việc đang sửa */}
      <div className='row'>
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/** Tên mẫu công việc này */}
          <div className={`form-group ${state.editingTemplate.errorOnName === undefined ? '' : 'has-error'}`}>
            <label className='control-label'>
              {translate('task_template.tasktemplate_name')} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type='Name'
              className='form-control'
              placeholder={translate('task_template.tasktemplate_name')}
              value={editingTemplate.name}
              onChange={handleTaskTemplateName}
            />
            <ErrorLabel content={state.editingTemplate.errorOnName} />
          </div>

          {/** Đơn vị của mẫu công việc */}
          <div className={`form-group ${editingTemplate.errorOnUnit === undefined ? '' : 'has-error'}`}>
            <label className='control-label'>
              {translate('task_template.unit')} <span style={{ color: 'red' }}>*</span>
            </label>
            {usersInUnitsOfCompany !== undefined && editingTemplate.organizationalUnit !== '' && (
              <SelectBox
                id={`edit-unit-select-box-${editingTemplate._id}-${editingTemplate._id}-${id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={usersInUnitsOfCompany.map((x) => {
                  return { value: x.id, text: x.department }
                })}
                onChange={handleTaskTemplateUnit}
                value={editingTemplate.organizationalUnit}
                multiple={false}
              />
            )}
            <ErrorLabel content={state.editingTemplate.errorOnUnit} />
          </div>

          {/* Chọn đơn vị phối hợp công việc */}
          {usersInUnitsOfCompany && (
            <div className='form-group'>
              <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
              <SelectBox
                id='editMultiSelectUnitThatHaveCollaboratedTemplate'
                lassName='form-control select2'
                style={{ width: '100%' }}
                items={usersInUnitsOfCompany
                  .filter((item) => String(item.id) !== String(editingTemplate.organizationalUnit))
                  .map((x) => {
                    return { text: x.department, value: x.id }
                  })}
                options={{ placeholder: translate('kpi.evaluation.dashboard.select_units') }}
                onChange={handleChangeCollaboratedWithOrganizationalUnits}
                value={editingTemplate.collaboratedWithOrganizationalUnits}
                multiple
              />
            </div>
          )}
        </div>

        {!isProcess && (
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            {/** Role có quyền xem mẫu công việc này */}
            <div className={`form-group ${state.editingTemplate.errorOnRead === undefined ? '' : 'has-error'}`}>
              <label className='control-label'>
                {translate('task_template.permission_view')} <span style={{ color: 'red' }}>*</span>
              </label>
              {listRole && editingTemplate.readByEmployees && (
                <SelectBox
                  id={`edit-read-select-box-${editingTemplate._id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listRoles.map((x) => {
                    return { value: x._id, text: x.name }
                  })}
                  onChange={handleTaskTemplateRead}
                  value={editingTemplate.readByEmployees}
                  multiple
                  options={{ placeholder: `${translate('task_template.permission_view')}` }}
                />
              )}
              <ErrorLabel content={state.editingTemplate.errorOnRead} />
            </div>
          </div>
        )}

        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/** Độ ưu tiên mẫu công việc này */}
          <div className='form-group'>
            <label className='control-label'>{translate('task.task_management.priority')}</label>
            <select className='form-control' value={editingTemplate.priority} onChange={handleChangeTaskPriority}>
              <option value={5}>{translate('task.task_management.urgent')}</option>
              <option value={4}>{translate('task.task_management.high')}</option>
              <option value={3}>{translate('task.task_management.standard')}</option>
              <option value={2}>{translate('task.task_management.average')}</option>
              <option value={1}>{translate('task.task_management.low')}</option>
            </select>
          </div>
        </div>

        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          {/** Mô tả mẫu công việc này */}
          <div className={`form-group `}>
            <label className='control-label' htmlFor='inputDescriptionTaskTemplate'>
              {translate('task_template.description')} <span style={{ color: 'red' }}>*</span>
            </label>
            <QuillEditor
              id={`input-description-task-template-${props.taskTemplateId}`}
              table={false}
              embeds={false}
              getTextData={handleTaskTemplateDesc}
              maxHeight={80}
              quillValueDefault={editingTemplate.quillDescriptionDefault}
              placeholder={translate('task_template.description')}
            />
          </div>
        </div>
      </div>

      <div className='row'>
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          <div className='form-group'>
            {/** Người thực hiện mẫu công việc này */}
            <label className='control-label'>{translate('task_template.performer')}</label>
            {allUnitsMember && editingTemplate.responsibleEmployees && (
              <SelectBox
                id={
                  isProcess
                    ? `edit-responsible-select-box-${editingTemplate._id}-${id}`
                    : `edit-responsible-select-box-${editingTemplate._id}`
                }
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember}
                onChange={handleTaskTemplateResponsible}
                value={editingTemplate.responsibleEmployees}
                multiple
                options={{ placeholder: `${translate('task_template.performer')}` }}
              />
            )}
          </div>
          <div className='form-group'>
            {/** Người phê duyệt mẫu công việc này */}
            <label className='control-label'>{translate('task_template.approver')}</label>
            {allUnitsMember && editingTemplate.accountableEmployees && (
              <SelectBox
                id={
                  isProcess
                    ? `edit-accountable-select-box-${editingTemplate._id}-${id}`
                    : `edit-accountable-select-box-${editingTemplate._id}`
                }
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember}
                onChange={handleTaskTemplateAccountable}
                value={editingTemplate.accountableEmployees}
                multiple
                options={{ placeholder: `${translate('task_template.approver')}` }}
              />
            )}
          </div>
          <div className='form-group'>
            {/** Người hỗ trọ mẫu công việc này */}
            <label className='control-label'>{translate('task_template.consultant')}</label>
            {allUnitsMember && editingTemplate.consultedEmployees && (
              <SelectBox
                id={
                  isProcess ? `edit-consulted-select-box-${editingTemplate._id}-${id}` : `edit-consulted-select-box-${editingTemplate._id}`
                }
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember}
                onChange={handleTaskTemplateConsult}
                value={editingTemplate.consultedEmployees}
                multiple
                options={{ placeholder: `${translate('task_template.consultant')}` }}
              />
            )}
          </div>
          <div className='form-group'>
            {/** Người quan sát mẫu công việc này */}
            <label className='control-label'>{translate('task_template.observer')}</label>
            {allUnitsMember && editingTemplate.informedEmployees && (
              <SelectBox
                id={isProcess ? `edit-informed-select-box-${editingTemplate._id}-${id}` : `edit-informed-select-box-${editingTemplate._id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember}
                onChange={handleTaskTemplateInform}
                multiple
                value={editingTemplate.informedEmployees}
                options={{ placeholder: `${translate('task_template.observer')}` }}
              />
            )}
          </div>
        </div>

        {showMore && (
          <div>
            {isProcess && (
              <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
                {/** Số ngày hoàn thành công việc dự kiến */}
                <div className={`form-group ${state.editingTemplate.errorOnNumberOfDaysTaken === undefined ? '' : 'has-error'}`}>
                  <label className='control-label' htmlFor='inputNumberOfDaysTaken'>
                    {translate('task_template.numberOfDaysTaken')}
                  </label>
                  <input
                    type='number'
                    className='form-control'
                    id='inputNumberOfDaysTaken'
                    value={editingTemplate.numberOfDaysTaken}
                    placeholder='Nhập số ngày hoàn thành dự kiến'
                    onChange={handleTaskTemplateNumberOfDaysTaken}
                  />
                  <ErrorLabel content={state.editingTemplate.errorOnNumberOfDaysTaken} />
                </div>
              </div>
            )}

            <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
              {/** Công thức tính điểm mẫu công việc này */}
              <div className={`form-group ${state.editingTemplate.errorOnFormula === undefined ? '' : 'has-error'}`}>
                <label className='control-label' htmlFor='inputFormula'>
                  {translate('task_template.formula')}
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='inputFormula'
                  placeholder='progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100'
                  value={editingTemplate.formula}
                  onChange={handleTaskTemplateFormula}
                />
                <ErrorLabel content={state.editingTemplate.errorOnFormula} />

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
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            {/** Các hoạt động mẫu công việc này */}
            <ActionForm initialData={editingTemplate.taskActions} onDataChange={handleTaskActionsChange} type={`edit-${taskTemplateId}`} />
          </div>

          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            {/** Các hoạt động mẫu công việc này */}
            <InformationForm
              initialData={editingTemplate.taskInformations}
              onDataChange={handleTaskInformationsChange}
              type={`edit-${taskTemplateId}`}
            />
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

      {createKpiUnit?.parent && (
        <div className='row'>
          <div className='form-check form-switch col-sm-12 pb-[16px]'>
            <input
              className='form-check-input'
              type='checkbox'
              role='switch'
              id='flexSwitchCheckDefault'
              checked={editingTemplate.isMappingTask}
              onChange={handleIsShowMappingTaskTemplates}
            />
            <label className='form-check-label' htmlFor='flexSwitchCheckDefault'>
              Ánh xạ mẫu công việc ra tập các công việc
            </label>
          </div>
          {/* {isShowMappingTaskTemplates && (
            <MappingTaskTemplateIntoListTasks isProcess={isProcess} onChangeListMappingTask={onChangeListMappingTask} />
          )} */}
        </div>
      )}
    </>
  )
}

function mapState(state) {
  const { department, user, tasktemplates } = state
  return { department, user, tasktemplates }
}

const actionCreators = {
  getTaskTemplate: taskTemplateActions.getTaskTemplateById,
  editTaskTemplate: taskTemplateActions.editTaskTemplate,
  addNewTemplate: taskTemplateActions.addTaskTemplate,
  getDepartment: UserActions.getDepartmentOfUser,
  getAllUserOfCompany: UserActions.getAllUserOfCompany,
  getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
  getRoleSameDepartment: UserActions.getRoleSameDepartment,
  getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
}
const connectedEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(EditTaskTemplate))
export { connectedEditTaskTemplate as EditTaskTemplate }
