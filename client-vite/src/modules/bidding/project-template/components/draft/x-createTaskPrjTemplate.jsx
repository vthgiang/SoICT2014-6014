import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { UserActions } from '../../../super-admin/user/redux/actions'
import TableTasksProject from './x-tableTaskProjectTemplate'
// import GanttTasksProject from './ganttTasksProject';
import { getStorage } from '../../../../config'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { CreateCPMTaskModal } from './x-createCPMTaskModal'
import CreateTaskSimple from './x-createSimpleTaskModal'

const CreateTaskProjectTemplate = (props) => {
  const { translate, user, tasks, currentProjectTasks, projectDetail } = props
  const userId = getStorage('userId')
  // const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
  const [isTableType, setIsTableType] = useState(true)

  const handleOpenCreateProjectTask = () => {
    window.$(`#addNewProjectTask-undefined`).modal('show')
  }

  const handleOpenCreateTask = () => {
    window.$(`#addNewTask-undefined`).modal('show')
  }

  const onHandleReRender = () => {
    setTimeout(() => {
      window.$('#modal-add-task-schedule').modal('hide')
    }, 10)
  }

  const onHandleOpenScheduleModal = () => {
    window.$('#modal-add-task-schedule').modal('show')
  }

  console.log('currentProjectTasks', currentProjectTasks)

  return (
    <React.Fragment>
      <div className='box-body qlcv'>
        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div className='box-tools' style={{ marginLeft: 10 }}>
            {/* <div className="btn-group">
                            <button type="button" className={`btn btn-xs ${isTableType ? 'btn-danger' : "active"}`} onClick={() => setIsTableType(true)}>Bảng</button>
                            <button type="button" className={`btn btn-xs ${isTableType ? "active" : "btn-danger"}`} onClick={() => {
                                setIsTableType(false);
                            }}>Biểu đồ Gantt</button>
                        </div> */}
          </div>
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            {/* Button refresh danh sách tasks */}
            <button
              style={{
                paddingTop: 5,
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
                marginRight: 10
              }}
              onClick={() => {
                // refresh các task đang có - cập nhật state tasksInfo
              }}
            >
              <span className='material-icons'>refresh</span>
            </button>
            {/* Button thêm mới */}
            {projectDetail?.projectType === 1 && <CreateTaskSimple onHandleReRender={onHandleReRender} />}
            {projectDetail?.projectType === 1 && (
              <button
                style={{ display: 'flex', marginTop: 15, marginRight: 10 }}
                type='button'
                className='btn btn-success'
                onClick={handleOpenCreateTask}
                title={`Tạo công việc mới`}
              >
                Tạo công việc mới
              </button>
            )}
            {/* {
                            projectDetail?.projectType === 2 &&
                                (projectDetail && <ModalAddTaskSchedule projectDetail={projectDetail} onHandleReRender={onHandleReRender} />)
                        } */}
            {projectDetail?.projectType === 2 && (
              <>
                {/* <CreateCPMTaskModal onHandleReRender={onHandleReRender} currentProjectTasks={currentProjectTasks} /> */}
                <button
                  style={{ display: 'flex', marginTop: 15, marginRight: 10 }}
                  type='button'
                  className='btn btn-success'
                  onClick={handleOpenCreateProjectTask}
                  title={`Tạo công việc mới bằng tay`}
                >
                  Tạo công việc mới
                </button>
              </>
            )}
          </div>
        </div>

        <TableTasksProject currentProjectTasks={currentProjectTasks} />

        {/* {isTableType ?
                    <TableTasksProject
                        currentProjectTasks={currentProjectTasks}
                    /> :
                    <GanttTasksProject currentProjectTasks={currentProjectTasks} />} */}
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project, changeRequest, user, tasks } = state
  return { project, changeRequest, user, tasks }
}

const mapDispatchToProps = {
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getTasksByProject: taskManagementActions.getTasksByProject,
  getAllDepartment: DepartmentActions.get,
  getDepartment: UserActions.getDepartmentOfUser
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateTaskProjectTemplate))
