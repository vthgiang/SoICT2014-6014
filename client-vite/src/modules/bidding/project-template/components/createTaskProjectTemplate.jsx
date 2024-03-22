/**
 * Dùng tạm cho việc tạo task cho mẫu dự án
 * vì chưa phân chia là tạo cv cho dự án CPM hay là dự án đơn giản
 */

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ErrorLabel, SelectBox } from '../../../../common-components'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import ValidationHelper from '../../../../helpers/validationHelper'
import { convertUserIdToUserName, getListDepartments } from './functionHelper'
import { checkIfHasCommonItems, getSalaryFromUserId, numberWithCommas } from '../../../task/task-management/component/functionHelpers'
import { getStorage } from '../../../../config'
import { withTranslate } from 'react-redux-multilingual'
import { ViewTaskProjectTemplateInGantt } from './viewTaskProjectTemplateInGantt'

export const CreateTaskProjectTemplate = (props) => {
  const { translate, taskInProjectTemplate, userSelectOptions, respEmployeesWithUnit, user, taskList } = props
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
  const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
  const arrPrirority = [
    { value: '5', text: translate('task.task_management.urgent') },
    { value: '4', text: translate('task.task_management.high') },
    { value: '3', text: translate('task.task_management.standard') },
    { value: '2', text: translate('task.task_management.average') },
    { value: '1', text: translate('task.task_management.low') }
  ]
  const fakeUnitCostList = [
    { text: 'VND', value: 'VND' },
    { text: 'USD', value: 'USD' }
  ]
  const fakeUnitTimeList = [
    { text: 'Ngày', value: 'days' },
    { text: 'Giờ', value: 'hours' }
  ]
  const initTaskData = {
    code: '',
    name: '',
    description: '',
    priority: 3,
    responsibleEmployees: [],
    accountableEmployees: [],
    consultedEmployees: [],
    informedEmployees: [],
    // creator: getStorage("userId"),
    // organizationalUnit: "",
    collaboratedWithOrganizationalUnits: [],
    preceedingTasks: [],
    // followingTasks: [],
    estimateNormalTime: '',
    estimateOptimisticTime: '',
    estimateNormalCost: '',
    estimateMaxCost: '',
    estimateAssetCost: 1000000,
    estimateHumanCost: '',
    actorsWithSalary: [],
    totalResWeight: 80,
    totalAccWeight: 20,
    currentResWeightArr: [],
    currentAccWeightArr: [],
    currentLatestStartDate: '',
    currentEarliestEndDate: ''
  }
  const [optionUsers, setOptionUsers] = useState(userSelectOptions)
  const [id, setId] = useState(props.id)
  const [tasks, setTasks] = useState(taskList ?? [])
  const [prjGeneralInfo, setPrjGeneralInfo] = useState({
    projectNameError: undefined,
    projectName: '',
    projectType: 2,
    description: '',
    startDate: '',
    endDate: '',
    projectManager: [],
    responsibleEmployees: [],
    currenceUnit: fakeUnitCostList[0].value,
    unitOfTime: fakeUnitTimeList[0].value,
    estimatedCost: ''
  })
  const [isTable, setIsTable] = useState(true)
  const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState(respEmployeesWithUnit)
  const EDIT_TYPE = 'EDIT_TYPE',
    ADD_TYPE = 'ADD_TYPE' // , RESET_TYPE = "RESET_TYPE", DELETE_TYPE = "DELETE_TYPE", CANCEL_TYPE = "CANCEL_TYPE";
  const [state, setState] = useState({
    type: ADD_TYPE,
    currentTask: initTaskData,
    currentIndex: null
  })

  useEffect(() => {
    setTasks(taskList ?? [])
    setId(props.id)
    setPrjGeneralInfo(props.projectDetail)
  }, [props.id, JSON.stringify(props.projectDetail)])

  useEffect(() => {
    setResponsibleEmployeesWithUnit(respEmployeesWithUnit)
  }, [JSON.stringify(respEmployeesWithUnit)])

  useEffect(() => {
    setOptionUsers(userSelectOptions)
  }, [JSON.stringify(userSelectOptions)])

  useEffect(() => {
    props.setTasksInfo(tasks)
  }, [JSON.stringify(tasks)])

  const handleChange = (e) => {
    let { name, value } = e?.target

    setState({
      ...state,
      currentTask: {
        ...state.currentTask,
        [name]: value
      }
    })
  }

  const handleChangeTotalResWeight = (e) => {
    let { name, value } = e?.target

    setState({
      ...state,
      currentTask: {
        ...state.currentTask,
        totalResWeight: Number(value),
        totalAccWeight: 100 - Number(value)
      }
    })
  }

  const handleChangeEstimateNormalTime = (e) => {
    let { name, value } = e?.target

    setState({
      ...state,
      currentTask: {
        ...state.currentTask,
        estimateNormalTime: Number(value),
        estimateOptimisticTime: Number(value) === 1 ? 0 : Number(value) === 2 ? 1 : Number(value) - 2
      }
    })
  }

  const handleChangeEstimateOptimisticTime = (e) => {
    let { name, value } = e?.target

    setState({
      ...state,
      currentTask: {
        ...state.currentTask,
        estimateOptimisticTime: Number(value)
      }
    })
  }

  const handleChangePreceedingTask = (value) => {
    setState({
      ...state,
      currentTask: {
        ...state.currentTask,
        preceedingTasks: value
      }
    })
  }

  const handleChangeTaskResponsibleEmployees = (value) => {
    validateTaskResponsibleEmployees(value, true)
  }
  const validateTaskResponsibleEmployees = (value, willUpdateState = true) => {
    let { translate } = props
    let { message } = ValidationHelper.validateArrayLength(translate, value)
    let newTask = state.currentTask
    if (checkIfHasCommonItems(value, newTask.accountableEmployees)) {
      message = 'Thành viên Thực hiện và Phê duyệt không được trùng nhau'
    }

    if (willUpdateState) {
      const responsiblesWithSalaryArr = value?.map((valueItem) => {
        return {
          userId: valueItem,
          salary: getSalaryFromUserId(responsibleEmployeesWithUnit, valueItem),
          weight: Number(newTask.totalResWeight) / value.length
        }
      })
      const accountablesWithSalaryArr = newTask.accountableEmployees?.map((valueItem) => {
        return {
          userId: valueItem,
          salary: getSalaryFromUserId(responsibleEmployeesWithUnit, valueItem),
          weight: Number(newTask.totalAccWeight) / newTask.accountableEmployees.length
        }
      })
      const currentNewTask = {
        ...state.currentTask,
        responsibleEmployees: value,
        errorOnResponsibleEmployees: message,
        actorsWithSalary: [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr]
      }
      setState({
        ...state,
        currentTask: currentNewTask
      })
    }
    return message === undefined
  }

  const handleChangeTaskAccountableEmployees = (value) => {
    validateTaskAccountableEmployees(value, true)
  }
  const validateTaskAccountableEmployees = (value, willUpdateState = true) => {
    let { translate } = props
    let { message } = ValidationHelper.validateArrayLength(translate, value)
    let newTask = state.currentTask
    if (checkIfHasCommonItems(value, newTask.responsibleEmployees)) {
      message = 'Thành viên Thực hiện và Phê duyệt không được trùng nhau'
    }

    if (willUpdateState) {
      const accountablesWithSalaryArr = value?.map((valueItem) => {
        return {
          userId: valueItem,
          salary: getSalaryFromUserId(responsibleEmployeesWithUnit, valueItem),
          weight: Number(newTask.totalAccWeight) / value.length
        }
      })
      const responsiblesWithSalaryArr = newTask.responsibleEmployees?.map((valueItem) => {
        return {
          userId: valueItem,
          salary: getSalaryFromUserId(responsibleEmployeesWithUnit, valueItem),
          weight: Number(newTask.totalResWeight) / newTask.responsibleEmployees.length
        }
      })
      const currentNewTask = {
        ...state.currentTask,
        accountableEmployees: value,
        errorOnResponsibleEmployees: message,
        actorsWithSalary: [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr]
      }
      setState({
        ...state,
        currentTask: currentNewTask
      })
    }
    return message === undefined
  }

  const handleChangeSingleSelectForm = (key, value) => {
    setState({
      ...state,
      currentTask: {
        ...state.currentTask,
        [key]: value[0]
      }
    })
  }

  const handleDeleteTask = (listIndex) => {
    let newList = tasks
    newList.splice(listIndex, 1)

    setTasks(newList)
    setState({
      ...state,
      currentTask: initTaskData,
      currentIndex: null
    })
    props.setTasksInfo(tasks)
  }

  const handleResetTask = () => {
    setState({
      ...state,
      // type: ADD_TYPE,
      currentTask: initTaskData,
      currentIndex: null
    })
  }

  const handleCancel = () => {
    setState({
      ...state,
      type: ADD_TYPE,
      currentTask: initTaskData,
      currentIndex: null
    })
  }

  const handleEditTask = (listIndex) => {
    setState({
      ...state,
      type: EDIT_TYPE,
      currentTask: tasks[listIndex],
      currentIndex: listIndex
    })
  }

  const handleSaveTask = (listIndex) => {
    let { currentTask } = state
    let newList = tasks.map((x, idx) => {
      if (idx === listIndex) {
        x = { ...currentTask }
      }
      return x
    })

    setState({
      ...state,
      type: ADD_TYPE,
      currentTask: initTaskData,
      currentIndex: null
    })
    setTasks(newList)
    props.setTasksInfo(tasks)
  }

  const handleAddTask = () => {
    let { currentTask } = state
    let newList = tasks

    newList.push(currentTask)

    setState({
      ...state,
      type: ADD_TYPE,
      currentTask: initTaskData,
      currentIndex: null
    })
    setTasks(newList)
    props.setTasksInfo(tasks)
  }

  let listPrevTask =
    tasks?.map((x) => {
      return { text: x.code, value: x.code?.trim() }
    }) ?? []
  const renderTaskForm = () => {
    return (
      <div className='row'>
        <div className='col-md-6'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>Thông tin chung</legend>

            {/* Form create task */}
            <div style={{ paddingTop: '10px' }}>
              <div className='row'>
                <div className='form-group col-md-6'>
                  <label>
                    Tên công việc<span className='text-red'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    name='name'
                    value={state.currentTask.name}
                    onChange={(e) => handleChange(e)}
                  ></input>
                </div>
                <div className='form-group col-md-6'>
                  <label>
                    Độ ưu tiên<span className='text-red'>*</span>
                  </label>
                  <SelectBox
                    id={`${props.type}-select-priority-task-${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={arrPrirority}
                    onChange={(value) => handleChangeSingleSelectForm('priority', value)}
                    value={state.currentTask?.priority}
                    multiple={false}
                  />
                </div>
              </div>

              <div className='row'>
                <div className='form-group col-md-6'>
                  <label>
                    Mã công việc<span className='text-red'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    name='code'
                    value={state.currentTask.code}
                    onChange={(e) => handleChange(e)}
                  ></input>
                </div>
                <div className='form-group col-md-6'>
                  <label>
                    Công việc tiền nhiệm<span className='text-red'>*</span>
                  </label>
                  {/* <input type="text" className="form-control" name="preceedingTasks" value={state.currentTask.preceedingTasks} onChange={(e) => handleChange(e)}></input> */}
                  <SelectBox
                    id={`${props.type}-preceeding-task-select-box-${id}-${state.currentIndex}`}
                    className='form-control select'
                    style={{ width: '100%' }}
                    items={listPrevTask ?? []}
                    onChange={handleChangePreceedingTask}
                    value={state.currentTask.preceedingTasks}
                    multiple={true}
                    options={{ placeholder: 'Chọn công việc tiền nhiệm' }}
                  />
                </div>
              </div>

              <div className='row'>
                <div className='form-group col-md-6'>
                  <label>
                    Thời gian ước lượng<span className='text-red'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    name='estimateNormalTime'
                    value={state.currentTask.estimateNormalTime}
                    onChange={(e) => handleChangeEstimateNormalTime(e)}
                  ></input>
                </div>
                <div className='form-group col-md-6'>
                  <label>
                    Thời lượng thỏa hiệp<span className='text-red'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    name='estimateOptimisticTime'
                    value={state.currentTask.estimateOptimisticTime}
                    onChange={(e) => handleChangeEstimateOptimisticTime(e)}
                  ></input>
                </div>
              </div>

              <div className='form-group'>
                <label>Mô tả công việc</label>
                <textarea
                  type='text'
                  rows={3}
                  style={{ minHeight: '103.5px' }}
                  name={`description`}
                  onChange={(value) => handleChange(value)}
                  value={state.currentTask?.description}
                  className='form-control'
                  placeholder='Mô tả công việc'
                  autoComplete='off'
                />
              </div>
            </div>
          </fieldset>
        </div>
        <div className='col-md-6'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>Vai trò</legend>

            {/* Form create task */}
            <div style={{ paddingTop: '10px' }}>
              <div className='row'>
                <div className='form-group col-md-6'>
                  <label>
                    Người thực hiện<span className='text-red'>*</span>
                  </label>
                  <SelectBox
                    id={`${props.type}-responsible-select-box-${id}-${state.currentIndex}`}
                    className='form-control select'
                    style={{ width: '100%' }}
                    items={optionUsers}
                    onChange={handleChangeTaskResponsibleEmployees}
                    value={state.currentTask.responsibleEmployees}
                    multiple={true}
                    options={{ placeholder: translate('task.task_management.add_resp') }}
                  />
                </div>
                <div className='form-group col-md-6'>
                  <label>
                    Trọng số người thực hiện (%)<span className='text-red'>*</span>
                  </label>
                  <input
                    type='number'
                    className='form-control'
                    name={`totalResWeight`}
                    onChange={(value) => handleChangeTotalResWeight(value)}
                    value={state.currentTask?.totalResWeight}
                    autoComplete='off'
                  />
                </div>
              </div>
              <div className='row'>
                <div className='form-group col-md-6'>
                  <label>
                    Người phê duyệt<span className='text-red'>*</span>
                  </label>
                  <SelectBox
                    id={`${props.type}-accounatable-select-box-${id}-${state.currentIndex}`}
                    className='form-control select'
                    style={{ width: '100%' }}
                    items={optionUsers}
                    onChange={handleChangeTaskAccountableEmployees}
                    value={state.currentTask.accountableEmployees}
                    multiple={true}
                    options={{ placeholder: translate('task.task_management.add_acc') }}
                  />
                </div>
                <div className='form-group col-md-6'>
                  <label>
                    Trọng số người phê duyệt (%)<span className='text-red'>*</span>
                  </label>
                  <input
                    type='number'
                    className='form-control'
                    name={`totalAccWeight`}
                    onChange={(value) => {
                      /** do nothing */
                    }}
                    value={state.currentTask?.totalAccWeight}
                    autoComplete='off'
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    )
  }

  return (
    <div className='form-group'>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', color: 'red' }}>
        <p>
          Điền các thông tin công việc theo mẫu bên duới<span className='text-red'>*</span>
        </p>
      </div>
      {renderTaskForm()}

      <div className='pull-right row' style={{ marginRight: 0, marginBottom: '15px' }}>
        {state.type === EDIT_TYPE && (
          <>
            <button
              className='btn btn-danger'
              style={{ marginRight: '5px' }}
              type={'button'}
              onClick={() => {
                handleCancel()
              }}
            >
              Hủy
            </button>
            <button
              className='btn btn-success'
              style={{ marginRight: '5px' }}
              type={'button'}
              onClick={() => {
                handleSaveTask(state.currentIndex)
              }}
            >
              Lưu
            </button>
          </>
        )}
        {state.type === ADD_TYPE && (
          <button
            className='btn btn-success'
            style={{ marginRight: '5px' }}
            type={'button'}
            onClick={() => {
              handleAddTask()
            }}
          >
            Thêm
          </button>
        )}
        <button
          className='btn btn-primary'
          type={'button'}
          onClick={() => {
            handleResetTask()
          }}
        >
          Xóa trắng
        </button>
      </div>

      <div className='box-tools' style={{ marginBottom: '5px' }}>
        <div className='btn-group'>
          <button type='button' onClick={() => setIsTable(!isTable)} className={`btn btn-xs ${isTable ? 'btn-danger' : 'active'}`}>
            Bảng
          </button>
          <button type='button' onClick={() => setIsTable(!isTable)} className={`btn btn-xs ${!isTable ? 'btn-danger' : 'active'}`}>
            Biểu đồ Gantt
          </button>
        </div>
      </div>
      <br />
      {!isTable ? (
        <ViewTaskProjectTemplateInGantt taskList={tasks} unitOfTime={prjGeneralInfo.unitOfTime} />
      ) : (
        <table id='project-template-task-table' className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>Mã công việc</th>
              <th>Tên công việc</th>
              <th>Công việc tiền nhiệm</th>
              <th>Thời gian ước lượng</th>
              <th>Thời lượng thỏa hiệp</th>
              <th>Người thực hiện</th>
              <th>Người phê duyệt</th>
              <th>Trọng số người thực hiện</th>
              <th>{translate('task_template.action')}</th>
            </tr>
          </thead>
          <tbody>
            {tasks &&
              tasks.length > 0 &&
              tasks.map((item, index) => (
                <tr key={index}>
                  <td>{item?.code}</td>
                  <td>{item?.name}</td>
                  <td>{item?.preceedingTasks?.join(', ')}</td>
                  <td>{item?.estimateNormalTime}</td>
                  <td>{item?.estimateOptimisticTime}</td>
                  <td>{item?.responsibleEmployees.map((userItem) => convertUserIdToUserName(listUsers, userItem)).join(', ')}</td>
                  <td>{item?.accountableEmployees.map((userItem) => convertUserIdToUserName(listUsers, userItem)).join(', ')}</td>
                  <td>{item?.totalResWeight}</td>
                  <td>
                    <a className='edit' title={translate('general.delete')} onClick={() => handleEditTask(index)}>
                      <i className='material-icons'>edit</i>
                    </a>
                    <a className='delete' title={translate('general.delete')} onClick={() => handleDeleteTask(index)}>
                      <i className='material-icons'>delete</i>
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateTaskProjectTemplate))
