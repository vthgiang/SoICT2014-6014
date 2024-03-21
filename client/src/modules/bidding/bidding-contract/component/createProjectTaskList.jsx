import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ErrorLabel, SelectBox } from '../../../../common-components'
import { UserActions } from '../../../super-admin/user/redux/actions'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { EmployeeManagerActions } from '../../../human-resource/profile/employee-management/redux/actions'
import getAllEmployeeSelectBoxItems from '../../bidding-package/biddingPackageManagement/components/employeeHelper'
import {
  convertDepartmentIdToDepartmentName,
  convertUserIdToUserName,
  getListDepartments
} from '../../../project/projects/components/functionHelper'

function ProjectTaskForm(props) {
  const EDIT_TYPE = 'EDIT_TYPE',
    ADD_TYPE = 'ADD_TYPE' // , RESET_TYPE = "RESET_TYPE", DELETE_TYPE = "DELETE_TYPE", CANCEL_TYPE = "CANCEL_TYPE";
  const { translate, employeesManager, user } = props
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
  const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
  const arrUnitTimeList = [
    { text: 'Ngày', value: 'days' },
    { text: 'Giờ', value: 'hours' },
    { text: 'Tháng', value: 'months' }
  ]
  const initTaskData = {
    code: '',
    name: '',
    description: '',
    preceedingTasks: '',
    estimateNormalTime: '', // thời gian ước lượng
    estimateOptimisticTime: '', // thòi lượng thỏa hiệp
    unitOfTime: 'days',
    responsibleEmployees: [],
    accountableEmployees: [],
    totalResWeight: 80
  }
  const [state, setState] = useState({
    type: ADD_TYPE,
    currentTask: initTaskData,
    currentIndex: null
  })

  const [projectTask, setProjectTask] = useState(props.biddingContract?.projectTask ? props.biddingContract?.projectTask : [])

  const { id } = state

  useEffect(() => {
    const prjTaskData = props.biddingContract?.projectTask ? props.biddingContract?.projectTask : []

    props.getAllEmployee()
    setState({ ...state, id: props.id })
    setProjectTask(prjTaskData)
  }, [props.id, JSON.stringify(props.biddingContract?.projectTask)])

  let allEmployee
  if (employeesManager && employeesManager.listAllEmployees) {
    allEmployee = employeesManager.listAllEmployees
  }

  let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee)

  const handleChangeForm = (key, e) => {
    let { value } = e.target

    setState({
      ...state,
      currentTask: {
        ...state.currentTask,
        [key]: value
      }
    })
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
    let newList = projectTask
    newList.splice(listIndex, 1)

    setProjectTask(newList)
    props.handleChange('projectTask', newList)
  }

  const handleResetTask = () => {
    setState({
      ...state,
      type: ADD_TYPE,
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
      currentTask: projectTask.tasks[listIndex],
      currentIndex: listIndex
    })
  }

  const handleSaveTask = (listIndex) => {
    let { currentTask } = state
    let newList = projectTask.map((x, idx) => {
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
    setProjectTask(newList)
    props.handleChange('projectTask', newList)
  }

  const handleAddTask = () => {
    let { currentTask } = state
    let newList = projectTask

    newList.push(currentTask)

    setState({
      ...state,
      type: ADD_TYPE,
      currentTask: initTaskData,
      currentIndex: null
    })
    setProjectTask(newList)
    props.handleChange('projectTask', newList)
  }

  const renderTasks = () => {
    return (
      <>
        <fieldset className='scheduler-border'>
          <legend className='scheduler-border'>Danh sách công việc</legend>

          {/* Form create task */}
          <div style={{ paddingTop: '10px' }}>
            <div className='form-group'>
              <label>
                Tên công việc<span className='text-red'>*</span>
              </label>
              <input
                type='text'
                className='form-control'
                name={`name-${state.currentIndex}`}
                onChange={(value) => handleChangeForm('name', value)}
                value={state.currentTask?.name}
                placeholder='Tên công việc'
                autoComplete='off'
              />
              <ErrorLabel content={state.currentTask?.nameError} />
            </div>
            <div className='form-group'>
              <label>
                Mã công việc<span className='text-red'>*</span>
              </label>
              <input
                type='text'
                className='form-control'
                name={`name-${state.currentIndex}`}
                onChange={(value) => handleChangeForm('name', value)}
                value={state.currentTask?.name}
                placeholder='Tên công việc'
                autoComplete='off'
              />
              <ErrorLabel content={state.currentTask?.nameError} />
            </div>

            <div className='form-group'>
              <label>Mô tả công việc</label>
              <textarea
                type='text'
                rows={3}
                style={{ minHeight: '103.5px' }}
                name={`count-${state.currentIndex}`}
                onChange={(value) => handleChangeForm('description', value)}
                value={state.currentTask?.description}
                className='form-control'
                placeholder='Mô tả công việc'
                autoComplete='off'
              />
            </div>
            <div className='form-group'>
              <label>
                Thời gian thực hiện<span className='text-red'>*</span>
              </label>
              <input
                type='number'
                className='form-control'
                name={`estimateTime-${state.currentIndex}`}
                onChange={(value) => handleChangeForm('estimateTime', value)}
                value={state.currentTask?.estimateTime}
                placeholder='Thời gian thực hiện'
                autoComplete='off'
              />
            </div>
            <div className='form-group'>
              <label>
                Đơn vị thời gian<span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`${props.type}-select-decision-bidding-contract-unitTime-${id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={arrUnitTimeList}
                onChange={(value) => handleChangeSingleSelectForm('unitOfTime', value)}
                value={state.currentTask?.unitOfTime}
                multiple={false}
              />
            </div>
          </div>

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

          <table id='project-table' className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>Tên công việc</th>
                <th>Thời gian thực hiện</th>
                <th>Mô tả công việc</th>
                <th>{translate('task_template.action')}</th>
              </tr>
            </thead>
            <tbody>
              {projectTask?.map((item, listIndex) => {
                return (
                  <tr key={listIndex}>
                    <td>{item?.name}</td>
                    <td>
                      {item?.estimateTime} ({arrUnitTimeList.find((x) => x.value === item?.unitOfTime)?.text || ''})
                    </td>
                    <td>{item?.description}</td>
                    {/* <td>{item?.description?.length > 50 ? `${item?.description?.subString(0, 50)} ...` : item?.description}</td> */}
                    <td>
                      <a className='edit' title={translate('general.delete')} onClick={() => handleEditTask(listIndex)}>
                        <i className='material-icons'>edit</i>
                      </a>
                      <a className='delete' title={translate('general.delete')} onClick={() => handleDeleteTask(listIndex)}>
                        <i className='material-icons'>delete</i>
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </fieldset>
      </>
    )
  }

  return (
    <div id={id} className='tab-pane'>
      {renderTasks()}
    </div>
  )
}

function mapState(state) {
  const { employeesManager, user } = state
  return { employeesManager, user }
}

const actionCreators = {
  getAllEmployee: EmployeeManagerActions.getAllEmployee
}

const connectComponent = connect(mapState, actionCreators)(withTranslate(ProjectTaskForm))
export { connectComponent as ProjectTaskForm }
