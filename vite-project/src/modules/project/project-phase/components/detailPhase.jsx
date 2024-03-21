import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, forceCheckOrVisible, LazyLoadComponent } from '../../../../common-components'
import { ProjectActions } from '../../projects/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { StatisticActions } from '../../statistic/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import moment from 'moment'
import { getStorage } from '../../../../config'
import TabPhaseReportTasks from './tabPhaseReportTasks'
import TabPhaseReportCost from './tabPhaseReportCost'
import TabPhaseReportMember from './tabPhaseReportMember'
import TabGeneralInfo from './tabGeneralInfo'
import TabEvalPhase from './tabEvalPhase'
import TabEvalPhaseMember from './tabEvalPhaseMember'
import TabEvalSelf from '../../statistic/components/tabEvalSelf'
import TabEvalPhaseTasks from './tabEvalPhaseTasks'
import TabProjectReportMember from '../../reports/components/tabProjectReportMember'
import { checkIfAbleToCRUDProject, getCurrentProjectDetails } from '../../projects/components/functionHelper'

const DetailPhase = (props) => {
  const { projectDetailId, projectDetail, translate, project, tasks, user, phaseId, phase, projectStatistic } = props
  const userId = getStorage('userId')
  const [currentProjectId, setCurrentProjectId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const currentTasks = tasks?.tasksByProject?.filter((task) => task.taskPhase === phaseId)
  let arrayTasksId = currentTasks.map((taskItem) => taskItem._id)
  const listTasksEval = projectStatistic.listTasksEval.filter((taskItem) => arrayTasksId.includes(taskItem._id))

  if (projectDetailId != currentProjectId) {
    setCurrentProjectId(projectDetailId)
  }

  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'))

  const handleChangeMonth = (value) => {
    setIsLoading(true)
    setCurrentMonth(moment(value, 'MM-YYYY'))
  }

  const projectType = getCurrentProjectDetails(project, projectDetailId || projectDetail?._id)?.projectType
  const allowModified = checkIfAbleToCRUDProject({
    project,
    user,
    currentProjectId: projectDetailId || projectDetail?._id,
    isInsideProject: true
  })

  useEffect(() => {
    props.getProjectsDispatch({ calledId: 'user_all', userId })
    props.getAllUserInAllUnitsOfCompany()
    props.getAllTasksByProject(projectDetailId || projectDetail?._id)
    props.getListTasksEvalDispatch(currentProjectId || projectDetail?._id, currentMonth.format())
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [currentProjectId, currentMonth])

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-show-detail-phase-${phaseId}`}
        isLoading={false}
        formID={`form-show-detail-phase${phaseId}`}
        title={`${translate('phase.report.title')} "${phase?.name}"`}
        hasSaveButton={false}
        size={75}
        resetOnClose={true}
      >
        <div className='nav-tabs-custom'>
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a href='#phase-general-detail' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                Thông tin chung
              </a>
            </li>
            <li>
              <a href='#phase-report-time' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                Công việc giai đoạn
              </a>
            </li>
            {projectType === 2 && (
              <li>
                <a href='#phase-report-cost' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  Chi phí giai đoạn
                </a>
              </li>
            )}
            {allowModified && (
              <li>
                <a href='#phase-report-member' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  Thành viên giai đoạn
                </a>
              </li>
            )}
            {projectType === 2 && (
              <li>
                <a href='#eval-phase' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  Thống kê đánh giá giai đoạn
                </a>
              </li>
            )}
            {projectType === 2 && (
              <li>
                <a href='#eval-phase-tasks' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  Thống kê đánh giá công việc
                </a>
              </li>
            )}
            {allowModified && projectType === 2 && (
              <li>
                <a href='#eval-phase-members' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  Thống kê đánh giá thành viên
                </a>
              </li>
            )}
            {projectType === 2 && (
              <li>
                <a href='#eval-self' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  Thống kê đánh giá cá nhân
                </a>
              </li>
            )}
          </ul>
          <div className='tab-content'>
            {/** Tab thông tin chung **/}
            <div className='tab-pane active' id='phase-general-detail'>
              <TabGeneralInfo phase={phase} />
            </div>

            {/** Tab báo cáo công việc dự án */}
            <div className='tab-pane' id='phase-report-time'>
              <TabPhaseReportTasks currentTasks={currentTasks} />
            </div>

            {/** Tab báo cáo chi phí */}
            {projectType === 2 && (
              <div className='tab-pane' id='phase-report-cost'>
                <LazyLoadComponent key='TabProjectReportCost'>
                  <TabPhaseReportCost currentTasks={currentTasks} />
                </LazyLoadComponent>
              </div>
            )}

            {/** Tab báo cáo thành viên */}
            {allowModified && (
              <div className='tab-pane' id='phase-report-member'>
                <LazyLoadComponent key='TabProjectReportMember'>
                  <TabPhaseReportMember currentTasks={currentTasks} projectDetail={projectDetail} />
                </LazyLoadComponent>
              </div>
            )}

            {/** Thống kê dự án */}
            {projectType === 2 && (
              <div className='tab-pane' id='eval-phase'>
                <TabEvalPhase
                  projectDetail={projectDetail}
                  projectDetailId={projectDetailId}
                  currentTasks={currentTasks}
                  listTasksEval={listTasksEval}
                  currentMonth={currentMonth}
                  handleChangeMonth={handleChangeMonth}
                />
              </div>
            )}

            {/** Thống kê điểm số công việc theo tháng */}
            {projectType === 2 && (
              <div className='tab-pane' id='eval-phase-tasks'>
                <TabEvalPhaseTasks
                  projectDetail={projectDetail}
                  projectDetailId={projectDetailId}
                  currentTasks={currentTasks}
                  listTasksEval={listTasksEval}
                  currentMonth={currentMonth}
                  handleChangeMonth={handleChangeMonth}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/** Tab đánh giá thành viên */}
            {allowModified && projectType === 2 && (
              <div className='tab-pane' id='eval-phase-members'>
                <TabEvalPhaseMember
                  currentTasks={currentTasks}
                  currentMonth={currentMonth}
                  listTasksEval={listTasksEval}
                  handleChangeMonth={handleChangeMonth}
                  projectDetail={projectDetail}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/** Tab đánh giá cá nhân */}
            {projectType === 2 && (
              <div className='tab-pane' id='eval-self'>
                <TabEvalSelf
                  currentTasks={currentTasks}
                  currentMonth={currentMonth}
                  listTasksEval={listTasksEval}
                  handleChangeMonth={handleChangeMonth}
                  projectDetail={projectDetail}
                  userId={userId}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project, user, tasks, projectPhase, projectStatistic } = state
  return { project, user, tasks, projectPhase, projectStatistic }
}

const mapDispatchToProps = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getAllTasksByProject: taskManagementActions.getAllTasksByProject,
  getListTasksEvalDispatch: StatisticActions.getListTasksEvalDispatch
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailPhase))
