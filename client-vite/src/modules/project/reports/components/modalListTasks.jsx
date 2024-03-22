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
import {
  checkIfAbleToCRUDProject,
  formatTaskStatus,
  getCurrentProjectDetails,
  renderCompare2Item,
  renderProgressBar,
  renderStatusColor
} from '../../projects/components/functionHelper'
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers'

const ModalListTasks = (props) => {
  const { listType, translate, currentTasks, title } = props
  const [currentListType, setCurrentListType] = useState('')

  if (listType != currentListType) {
    setCurrentListType(listType)
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-list-tasks-report-${listType}`}
        isLoading={false}
        formID={`form-show-detail-report-${listType}`}
        title={title}
        hasSaveButton={false}
        size={100}
        resetOnClose={true}
      >
        <div>
          <table className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>Tên công việc</th>
                <th>Trạng thái</th>
                <th>Tiến độ (%)</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc dự kiến</th>
                <th>Thời gian kết thúc thực tế</th>
                <th>Thời điểm hiện tại</th>
                <th>Chi phí ước lượng (VND)</th>
                <th>Chi phí thực (VND)</th>
              </tr>
            </thead>
            <tbody id='show-report-time-tasks-project-table'>
              {currentTasks &&
                currentTasks.length !== 0 &&
                currentTasks.map((taskItem, index) => (
                  <tr key={index}>
                    <td style={{ color: '#385898' }}>{taskItem?.name}</td>
                    <td style={{ color: renderStatusColor(taskItem) }}>{formatTaskStatus(translate, taskItem?.status)}</td>
                    <td>{renderProgressBar(taskItem?.progress, taskItem)}</td>
                    <td>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                    <td>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                    <td
                      style={{
                        color: taskItem?.actualEndDate
                          ? renderCompare2Item(
                              taskItem?.endDate,
                              taskItem?.actualEndDate,
                              moment(taskItem?.endDate).isSameOrAfter(moment(taskItem?.actualEndDate))
                            )
                          : 'black'
                      }}
                    >
                      {taskItem?.actualEndDate && moment(taskItem?.actualEndDate).format('HH:mm DD/MM/YYYY')}
                    </td>
                    <td> {moment().format('HH:mm DD/MM/YYYY')}</td>
                    <td>{numberWithCommas(taskItem.estimateNormalCost)}</td>
                    <td style={{ color: renderCompare2Item(Number(taskItem.estimateNormalCost), Number(taskItem.actualCost) || 0) }}>
                      {numberWithCommas(taskItem.actualCost || 0)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
  getTasksByProject: taskManagementActions.getTasksByProject
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalListTasks))
