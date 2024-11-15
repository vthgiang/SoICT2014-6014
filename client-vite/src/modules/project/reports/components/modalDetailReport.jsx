import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, forceCheckOrVisible, LazyLoadComponent } from '../../../../common-components'
import { ProjectGantt } from '../../../../common-components/src/gantt/projectGantt'
import { ProjectActions } from '../../projects/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import moment from 'moment'
import { getStorage } from '../../../../config'
import TabProjectReportTasks from './tabProjectReportTasks'
import TabProjectReportCost from './tabProjectReportCost'
import TabProjectReportMember from './tabProjectReportMember'
import { checkIfAbleToCRUDProject, getCurrentProjectDetails } from '../../projects/components/functionHelper'

const ModalDetailReport = (props) => {
  const { projectDetailId, projectDetail, translate, project, tasks, user } = props
  const userId = getStorage('userId')
  const [currentProjectId, setCurrentProjectId] = useState('')
  const currentTasks = tasks?.tasksByProject

  useEffect(() => {
    props.getProjectsDispatch({ calledId: 'user_all', userId })
    props.getAllUserInAllUnitsOfCompany()
    props.getAllTasksByProject(projectDetailId || projectDetail?._id)
  }, [currentProjectId])

  if (projectDetailId != currentProjectId) {
    setCurrentProjectId(projectDetailId)
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-show-detail-report-${projectDetailId || projectDetail?._id}`}
        isLoading={false}
        formID={`form-show-detail-report-${projectDetailId || projectDetail?._id}`}
        title={`${translate('project.report.title')} "${projectDetail?.name}"`}
        hasSaveButton={false}
        size={75}
        resetOnClose={true}
      >
        <div className='nav-tabs-custom'>
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a href='#project-report-time' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                Công việc dự án
              </a>
            </li>
            {getCurrentProjectDetails(project, projectDetailId || projectDetail?._id)?.projectType === 2 && (
              <li>
                <a href='#project-report-cost' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  Chi phí dự án
                </a>
              </li>
            )}
            {checkIfAbleToCRUDProject({
              project,
              user,
              currentProjectId: projectDetailId || projectDetail?._id,
              isInsideProject: true
            }) && (
              <li>
                <a href='#project-report-member' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
                  Thành viên dự án
                </a>
              </li>
            )}
          </ul>
          <div className='tab-content'>
            {/** Tab báo cáo công việc dự án */}
            <div className='tab-pane active' id='project-report-time'>
              <TabProjectReportTasks currentTasks={currentTasks} />
            </div>
            {/** Tab báo cáo chi phí */}
            {getCurrentProjectDetails(project, projectDetailId || projectDetail?._id)?.projectType === 2 && (
              <div className='tab-pane' id='project-report-cost'>
                <LazyLoadComponent key='TabProjectReportCost'>
                  <TabProjectReportCost currentTasks={currentTasks} />
                </LazyLoadComponent>
              </div>
            )}
            {/** Tab báo cáo thành viên */}
            {checkIfAbleToCRUDProject({
              project,
              user,
              currentProjectId: projectDetailId || projectDetail?._id,
              isInsideProject: true
            }) && (
              <div className='tab-pane' id='project-report-member'>
                <LazyLoadComponent key='TabProjectReportMember'>
                  <TabProjectReportMember currentTasks={currentTasks} projectDetail={projectDetail} />
                </LazyLoadComponent>
              </div>
            )}
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project, user, tasks } = state
  return { project, user, tasks }
}

const mapDispatchToProps = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getAllTasksByProject: taskManagementActions.getAllTasksByProject
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalDetailReport))
