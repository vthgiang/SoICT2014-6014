import React, { useEffect, useState } from 'react'
import { useTranslate, withTranslate } from 'react-redux-multilingual'
import { connect, useDispatch } from 'react-redux'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { InformationForm } from './informationsTemplate'
import { ActionForm } from './actionsTemplate'
import { SelectBox, ErrorLabel, QuillEditor } from '../../../../common-components'
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper'
import { TaskTemplateFormValidator } from './taskTemplateFormValidator'
import { getStorage } from '../../../../config'
import ValidationHelper from '../../../../helpers/validationHelper'
import MappingTaskTemplateIntoListTasks from './mappingTaskTemplateIntoListTasks'
import { createUnitKpiActions } from '../../../kpi/organizational-unit/creation/redux/actions'
import { taskTemplateActions } from '../redux/actions'

function AddTaskTemplate({
  isProcess,
  handleChangeName,
  onChangeTemplateData,
  getRoleSameDepartment,
  handleChangeResponsible,
  handleChangeAccountable,
  id,
  user,
  info,
  savedTaskAsTemplate,
  savedTaskId,
  savedTaskItem,
  getDepartment,
  onChangeListMappingTask,
  onChangeIsMappingTask
}) {
  const userId = getStorage('userId')
  const dispatch = useDispatch()
  const translate = useTranslate()

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
    showMore: !isProcess,
    currentRole: localStorage.getItem('currentRole')
  })

  const [isShowMappingTaskTemplates, setIsShowMappingTaskTemplates] = useState(false)

  const handleIsShowMappingTaskTemplates = ($event) => {
    setIsShowMappingTaskTemplates($event.target.checked)
    onChangeIsMappingTask($event.target.checked)
  }

  useEffect(() => {
    dispatch(UserActions.getRoleSameDepartment(localStorage.getItem('currentRole')))
    dispatch(DepartmentActions.getDepartmentsThatUserIsManager())
    dispatch(UserActions.getAllUserInAllUnitsOfCompany())
    dispatch(createUnitKpiActions.getKPIParent({ roleId: localStorage.getItem('currentRole') }))
  }, [dispatch])

  const handleTaskTemplateName = (e) => {
    const { value } = e.target
    if (isProcess) handleChangeName(value)
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
    const { newTemplate } = state
    newTemplate.name = value
    newTemplate.errorOnName = message
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

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

    onChangeTemplateData(state.newTemplate)
  }

  const handleTaskTemplateFormula = (event) => {
    const { value } = event.target
    validateTaskTemplateFormula(value, true)
  }

  const validateTaskTemplateFormula = (value, willUpdateState = true) => {
    const msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value)

    if (willUpdateState) {
      state.newTemplate.formula = value
      state.newTemplate.errorOnFormula = msg
      setState((state) => {
        return {
          ...state
        }
      })
    }
    onChangeTemplateData(state.newTemplate)
    return msg === undefined
  }

  const handleTaskTemplateNumberOfDaysTaken = (event) => {
    const { value } = event.target
    validateTaskTemplateNumberOfDaysTaken(value, true)
  }

  const validateTaskTemplateNumberOfDaysTaken = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateNumberInputMin(translate, value, 0)

    if (willUpdateState) {
      state.newTemplate.numberOfDaysTaken = value
      state.newTemplate.errorOnNumberOfDaysTaken = message
      setState((state) => {
        return {
          ...state
        }
      })
    }
    onChangeTemplateData(state.newTemplate)
    return message === undefined
  }

  const handleChangeTaskPriority = (e) => {
    const { newTemplate } = state
    const { value } = e.target
    newTemplate.priority = value
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateUnit = (value) => {
    const singleValue = value[0] // SelectBox một lựa chọn
    if (validateTaskTemplateUnit(singleValue, true)) {
      const { department } = props
      if (department !== undefined && department.departmentsThatUserIsManager !== undefined) {
        // Khi đổi department, cần lấy lại dữ liệu cho các selectbox (ai được xem, các vai trò)
        const dept = department.departmentsThatUserIsManager.find((item) => item._id === singleValue)
        if (dept) {
          getRoleSameDepartment(dept.managers)
        }
      }
    }
  }

  const validateTaskTemplateUnit = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(translate, value)
    const newData = {
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
      onChangeTemplateData(newData)
    }
    return message === undefined
  }

  const handleChangeCollaboratedWithOrganizationalUnits = (value) => {
    const { newTemplate } = state
    newTemplate.collaboratedWithOrganizationalUnits = value
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateRead = (value) => {
    const { newTemplate } = state
    newTemplate.readByEmployees = value
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateResponsible = (value) => {
    const { newTemplate } = state
    newTemplate.responsibleEmployees = value
    isProcess && handleChangeResponsible(value)
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateAccountable = async (value) => {
    const { newTemplate } = state
    newTemplate.accountableEmployees = value
    isProcess && handleChangeAccountable(value)
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateConsult = (value) => {
    const { newTemplate } = state
    newTemplate.consultedEmployees = value
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskTemplateInform = (value) => {
    const { newTemplate } = state
    newTemplate.informedEmployees = value
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskActionsChange = (data) => {
    const { newTemplate } = state
    newTemplate.taskActions = data
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  const handleTaskInformationsChange = (data) => {
    const { newTemplate } = state
    newTemplate.taskInformations = data
    onChangeTemplateData(newTemplate)
    setState({
      ...state,
      newTemplate
    })
  }

  useEffect(() => {
    // dùng cho chức năng tạo task process
    if (isProcess && id !== state.id) {
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
          id,
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
          showMore: !isProcess
        }
      })
    }
  }, [id]) // JSON.stringify(state.newTemplate)

  // dùng cho chức năng lưu task thành template
  useEffect(() => {
    if (savedTaskAsTemplate && savedTaskId !== state.savedTaskId) {
      setState((state) => {
        return {
          ...state,
          savedTaskId,
          id: savedTaskId,
          savedTaskAsTemplate,
          newTemplate: {
            organizationalUnit: savedTaskItem.organizationalUnit._id,
            collaboratedWithOrganizationalUnits: savedTaskItem.collaboratedWithOrganizationalUnits.map((e) => e.organizationalUnit._id),
            name: savedTaskItem.name,
            // readByEmployees: savedTaskItem.readByEmployees,
            responsibleEmployees: savedTaskItem.responsibleEmployees.map((e) => e._id),
            accountableEmployees: savedTaskItem.accountableEmployees.map((e) => e._id),
            consultedEmployees: savedTaskItem.consultedEmployees.map((e) => e._id),
            informedEmployees: savedTaskItem.informedEmployees.map((e) => e._id),
            description: savedTaskItem.description,
            quillDescriptionDefault: savedTaskItem.description,
            // numberOfDaysTaken: savedTaskItem.numberOfDaysTaken,
            formula: savedTaskItem.formula,
            priority: savedTaskItem.priority,
            taskActions: savedTaskItem.taskActions.map((e) => {
              return {
                mandatory: e.mandatory,
                name: e.name ? e.name : e.description,
                description: e.description
              }
            }),
            taskInformations: savedTaskItem.taskInformations.map((e) => {
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
      getDepartment() // => user.organizationalUnitsOfUser
    }

    // Khi truy vấn lấy các đơn vị mà user là manager đã có kết quả, và thuộc tính đơn vị của newTemplate chưa được thiết lập
    if (!isProcess && newTemplate.organizationalUnit === '' && user?.organizationalUnitsOfUser) {
      // Tìm unit mà currentRole của user đang thuộc về
      const defaultUnit = user.organizationalUnitsOfUser.find(
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
      }
    }
  }, [savedTaskId, user.isLoading, isProcess]) // JSON.stringify(state.newTemplate) , props?.user.isLoading

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
  const { newTemplate } = state

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

  let usersInUnitsOfCompany
  if (user && user.usersInUnitsOfCompany) {
    usersInUnitsOfCompany = user.usersInUnitsOfCompany
  }

  const allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany)

  return (
    <>
      <div className='row'>
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          <div className={`form-group ${state.newTemplate.errorOnName === undefined ? '' : 'has-error'}`}>
            <label className='control-label'>
              {translate('task_template.name')} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type='Name'
              className='form-control'
              placeholder={translate('task_template.name')}
              value={state.newTemplate.name}
              onChange={handleTaskTemplateName}
            />
            <ErrorLabel content={state.newTemplate.errorOnName} />
          </div>

          {/* <div className='form-group'>
            <label className='control-label'>
              Lớp công việc <span style={{ color: 'red' }}>*</span>
            </label>
            {props.analysisData.class && (
              <SelectBox
                id={`class-name-select-box-${id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={[
                  { value: 1, text: 'Loại 1: Chịu ảnh hưởng bởi con người' },
                  { value: 2, text: 'Loại 2: Chịu ảnh hưởng bởi con người và thiết bị' },
                  { value: 3, text: 'Loại 3: Chịu ảnh hưởng của sản phẩm và thiết bị' },
                  { value: 4, text: 'Loại 4: Chịu ảnh hưởng của môi trường' }
                ]}
                value={newTemplate.class}
                onChange={handleTaskTempLateClassName}
                multiple={false}
              />
            )}
          </div> */}

          <div
            className={`form-group ${state.newTemplate.errorOnUnit === undefined ? '' : 'has-error'}`}
            style={{ marginLeft: 0, marginRight: 0 }}
          >
            <label className='control-label'>{translate('task_template.unit')}</label>
            {user.usersInUnitsOfCompany !== undefined && state.newTemplate.organizationalUnit !== '' && (
              <SelectBox
                id={`unit-select-box-${state.id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={user.usersInUnitsOfCompany.map((x) => ({ value: x.id, text: x.department }))}
                value={state.newTemplate.organizationalUnit}
                onChange={handleTaskTemplateUnit}
                multiple={false}
              />
            )}
          </div>

          {user.usersInUnitsOfCompany && (
            <div className='form-group'>
              <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
              <SelectBox
                id={`multiSelectUnitThatHaveCollaboratedTemplate-${state.id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={user.usersInUnitsOfCompany
                  .filter((item) => String(item.id) !== String(state.newTemplate.organizationalUnit))
                  .map((x) => ({ text: x.department, value: x.id }))}
                options={{ placeholder: translate('kpi.evaluation.dashboard.select_units') }}
                onChange={handleChangeCollaboratedWithOrganizationalUnits}
                value={state.newTemplate.collaboratedWithOrganizationalUnits}
                multiple
              />
            </div>
          )}
        </div>

        {!isProcess && (
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <div className={`form-group ${state.newTemplate.errorOnRead === undefined ? '' : 'has-error'}`}>
              <label className='control-label'>{translate('task_template.permission_view')} </label>
              {listRoles && (
                <SelectBox
                  id={`read-select-box-${state.id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listRoles.map((x) => ({ value: x._id, text: x.name }))}
                  value={state.newTemplate.readByEmployees}
                  onChange={handleTaskTemplateRead}
                  multiple
                  options={{ placeholder: translate('task_template.permission_view') }}
                />
              )}
            </div>
          </div>
        )}

        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          <div className='form-group'>
            <label className='control-label'>{translate('task.task_management.priority')}</label>
            <select className='form-control' value={state.newTemplate.priority} onChange={handleChangeTaskPriority}>
              <option value={5}>{translate('task.task_management.urgent')}</option>
              <option value={4}>{translate('task.task_management.high')}</option>
              <option value={3}>{translate('task.task_management.standard')}</option>
              <option value={2}>{translate('task.task_management.average')}</option>
              <option value={1}>{translate('task.task_management.low')}</option>
            </select>
          </div>
        </div>

        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          <div className='form-group'>
            <label className='control-label'>{translate('task.task_management.detail_description')}</label>
            <QuillEditor
              id={`task-template-add-modal-quill-${state.id}`}
              table={false}
              embeds={false}
              getTextData={handleTaskTemplateDesc}
              maxHeight={80}
              quillValueDefault={state.newTemplate.quillDescriptionDefault}
              placeholder={translate('task_template.description')}
            />
          </div>
        </div>
      </div>

      <div className='row'>
        <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
          <div className='form-group'>
            <label className='control-label'>{translate('task_template.performer')}</label>
            {allUnitsMember && (
              <SelectBox
                id={isProcess ? `responsible-select-box-${state.id}` : 'responsible-select-box'}
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember}
                value={state.newTemplate.responsibleEmployees}
                onChange={handleTaskTemplateResponsible}
                multiple
                options={{ placeholder: translate('task_template.performer') }}
              />
            )}
          </div>
          <div className='form-group'>
            <label className='control-label'>{translate('task_template.approver')}</label>
            {allUnitsMember && (
              <SelectBox
                id={isProcess ? `accountable-select-box-${state.id}` : 'accountable-select-box'}
                className='form-control select2'
                style={{ width: '100%' }}
                items={allUnitsMember}
                value={state.newTemplate.accountableEmployees}
                onChange={handleTaskTemplateAccountable}
                multiple
                options={{ placeholder: translate('task_template.approver') }}
              />
            )}
          </div>

          {state.showMore && (
            <>
              <div className='form-group'>
                <label className='control-label'>{translate('task_template.consultant')}</label>
                {allUnitsMember && (
                  <SelectBox
                    id={isProcess ? `consulted-select-box-${state.id}` : 'consulted-select-box'}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={allUnitsMember}
                    value={state.newTemplate.consultedEmployees}
                    onChange={handleTaskTemplateConsult}
                    multiple
                    options={{ placeholder: translate('task_template.consultant') }}
                  />
                )}
              </div>
              <div className='form-group'>
                <label className='control-label'>{translate('task_template.observer')}</label>
                {allUnitsMember && (
                  <SelectBox
                    id={isProcess ? `informed-select-box-${state.id}` : 'informed-select-box'}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={allUnitsMember}
                    value={state.newTemplate.informedEmployees}
                    onChange={handleTaskTemplateInform}
                    multiple
                    options={{ placeholder: translate('task_template.observer') }}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {state.showMore && (
          <>
            {isProcess && (
              <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
                <div className={`form-group ${state.newTemplate.errorOnNumberOfDaysTaken === undefined ? '' : 'has-error'}`}>
                  <label className='control-label' htmlFor='inputNumberOfDaysTaken'>
                    {translate('task_template.numberOfDaysTaken')}
                  </label>
                  <input
                    type='number'
                    className='form-control'
                    id='inputNumberOfDaysTaken'
                    value={state.newTemplate.numberOfDaysTaken}
                    placeholder='Nhập số ngày hoàn thành dự kiến'
                    onChange={handleTaskTemplateNumberOfDaysTaken}
                  />
                  <ErrorLabel content={state.newTemplate.errorOnNumberOfDaysTaken} />
                </div>
              </div>
            )}
            <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
              <div className={`form-group ${state.newTemplate.errorOnFormula === undefined ? '' : 'has-error'}`}>
                <label className='control-label' htmlFor='inputFormula'>
                  {translate('task_template.formula')}
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='inputFormula'
                  placeholder='progress / (daysUsed / totalDays) - (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions)) * 100'
                  value={state.newTemplate.formula}
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
          </>
        )}
      </div>

      {state.showMore && (
        <div className='row'>
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <ActionForm
              initialData={state.newTemplate.taskActions}
              onDataChange={handleTaskActionsChange}
              savedTaskAsTemplate={state.savedTaskAsTemplate}
            />
          </div>
          <div className={`${isProcess ? 'col-lg-12' : 'col-sm-6'}`}>
            <InformationForm
              initialData={state.newTemplate.taskInformations}
              onDataChange={handleTaskInformationsChange}
              savedTaskAsTemplate={state.savedTaskAsTemplate}
            />
          </div>
        </div>
      )}

      {isProcess && (
        <div>
          <a style={{ cursor: 'pointer' }} onClick={clickShowMore}>
            {state.showMore ? (
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

      <div className='row'>
        <div className='form-check form-switch col-sm-12 pb-[16px]'>
          <input
            className='form-check-input'
            type='checkbox'
            role='switch'
            id='flexSwitchCheckDefault'
            checked={isShowMappingTaskTemplates}
            onChange={handleIsShowMappingTaskTemplates}
          />
          <label className='form-check-label' htmlFor='flexSwitchCheckDefault'>
            Ánh xạ mẫu công việc ra tập các công việc
          </label>
        </div>
        {isShowMappingTaskTemplates && (
          <MappingTaskTemplateIntoListTasks isProcess={isProcess} onChangeListMappingTask={onChangeListMappingTask} />
        )}
      </div>
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
  getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
  getRoleSameDepartment: UserActions.getRoleSameDepartment,
  getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
}
const connectedAddTaskTemplate = connect(mapState, actionCreators)(withTranslate(AddTaskTemplate))
export { connectedAddTaskTemplate as AddTaskTemplate }
