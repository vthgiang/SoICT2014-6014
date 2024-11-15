import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'
import { DetailTaskTab } from './detailTaskTab'
import ActionTab from './actionTab'

import { UserActions } from '../../../super-admin/user/redux/actions'
import { performTaskAction } from '../redux/actions'

import qs from 'qs'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { ProjectActions } from '../../../project/projects/redux/actions'
import { getStorage } from '../../../../config'
import { DetailProjectTaskTab } from '../../task-project/component/detailProjectTaskTab'
import { getCurrentProjectDetails } from '../../../project/projects/components/functionHelper'

function TaskComponent(props) {
  const { translate, project, performtasks } = props

  const [state, setState] = useState({ taskId: null })
  /**
   * Dùng khi mở task từ URL. Ban đầu flag là 1, chạy vào render trước, taskID=null
   * Khi flag có giá trị là 2, taskID sẽ là tham số từ URL
   */
  const [flag, setFlag] = useState(1)

  const { role } = state

  useEffect(() => {
    props.getAllDepartment()
    props.getDepartment()
    props.getProjectsDispatch({ calledId: '' })
  }, [])

  useEffect(() => {
    // xử lý khi mở chi tiết công việc bằng link
    if (props.location) {
      const { taskId } = qs.parse(props.location.search, { ignoreQueryPrefix: true })
      if (taskId && flag === 1) {
        setFlag(2)
        props.getTaskById(taskId)
        props.getTimerStatusTask(taskId)
      }
    }
  }, [JSON.stringify(props.location)])

  useEffect(() => {
    if (props.id && !props.location) {
      props.getTaskById(props.id) // props.id // đổi thành nextProps.id để lấy dữ liệu về sớm hơn
      props.getTimerStatusTask(props.id)
    }
  }, [props.id])

  const onChangeTaskRole = (role) => {
    setState({
      ...state,
      role: role
    })
  }

  let taskId = props.id
  let task

  if (props.location) {
    if (flag !== 1) {
      taskId = qs.parse(props.location.search, { ignoreQueryPrefix: true }).taskId
    }
  }

  const detailTaskTab = useCallback(
    () => performtasks.task && <DetailTaskTab id={taskId} onChangeTaskRole={onChangeTaskRole} showToolbar={true} />,
    [JSON.stringify(performtasks.task), taskId]
  )

  const actionsTab = useCallback(
    () => performtasks.task && <ActionTab id={taskId} onChangeTaskRole={onChangeTaskRole} showToolbar={true} role={role} />,
    [JSON.stringify(performtasks.task), taskId, role]
  )

  if (performtasks.task) {
    task = performtasks.task
  }
  if (performtasks.task && performtasks.task.info) {
    return (
      <div>
        <h2>{translate('task.task_management.detail_task_permission')}</h2>
      </div>
    )
  }
  const check = props?.performtasks?.isLoadingGetTaskById

  return (
    <React.Fragment>
      {flag === 1 && check ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>Đang tải dữ liệu ...</div>
      ) : (
        <div className='row row-equal-height' style={{ margin: '0px', height: '100%', backgroundColor: '#fff' }}>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6' style={{ paddingTop: '10px' }}>
            {task?.taskProject && getCurrentProjectDetails(project, task?.taskProject)?.projectType === 2 ? (
              <DetailProjectTaskTab id={taskId} onChangeTaskRole={onChangeTaskRole} task={task && task} showToolbar={true} />
            ) : (
              detailTaskTab()
            )}
          </div>

          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6' style={{ padding: '10px 0 10px 0', borderLeft: '1px solid #f4f4f4' }}>
            {actionsTab()}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
function mapState(state) {
  const { performtasks, project } = state
  return { performtasks, project }
}

const actionCreators = {
  getTaskById: performTaskAction.getTaskById,
  getTimerStatusTask: performTaskAction.getTimerStatusTask,
  getAllDepartment: DepartmentActions.get,
  getDepartment: UserActions.getDepartmentOfUser,
  getAllUserOfCompany: UserActions.getAllUserOfCompany,
  getProjectsDispatch: ProjectActions.getProjectsDispatch
}

export default connect(mapState, actionCreators)(withTranslate(TaskComponent))
