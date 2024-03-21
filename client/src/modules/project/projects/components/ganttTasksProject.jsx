import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectActions } from '../redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { formatTaskStatus } from './functionHelper'
import moment from 'moment'
import { ProjectGantt } from '../../../../common-components/src/gantt/projectGantt'
import DetailPhase from '../../project-phase/components/detailPhase.jsx'
import DetailMilestone from '../../project-phase/components/detailMilestone.jsx'
import { getDurationWithoutSatSun, getCurrentProjectDetails } from './functionHelper'
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers'
import { performTaskAction } from '../../../task/task-perform/redux/actions'
import { ModalDetailTask } from '../../../task/task-dashboard/task-personal-dashboard/modalDetailTask'

const GanttTasksProject = (props) => {
  const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0]
  const {
    translate,
    currentProjectTasks,
    user,
    project,
    tasks,
    currentProjectPhase = [],
    currentProjectMilestone = [],
    projectPhase
  } = props
  const task = tasks && tasks.task
  let projectDetail = {}

  if (props.projectDetail) {
    projectDetail = props.projectDetail
  } else projectDetail = getCurrentProjectDetails(project, currentProjectId)

  const [state, setState] = useState({
    currentPhase: {},
    currentPhaseId: '',
    currentTaskId: '',
    currentMilestone: '',
    currentMilestoneId: ''
  })

  const { currentPhase, currentPhaseId, currentTaskId, currentMilestoneId, currentMilestone } = state

  // Kiểm tra xem công việc thuộc loại nào
  const checkTaskType = (id) => {
    if (currentProjectTasks?.find((taskItem) => taskItem._id === id)) return 'task'
    else if (currentProjectPhase?.find((phase) => phase._id === id)) return 'phase'
    else if (currentProjectMilestone?.find((milestone) => milestone._id === id)) return 'milestone'
    return 'none'
  }

  const [currentZoom, setCurrentZoom] = useState(translate('system_admin.system_setting.backup.date'))
  const [dataTask, setDataTask] = useState({
    data: [],
    links: [],
    count: 0,
    line: 0
  })

  const taskStatus = ['inprocess']

  const handleZoomChange = (zoom) => {
    setCurrentZoom(zoom)
    setDataTask(getDataTask(zoom))
  }

  const attachEvent = (id) => {
    if (!RegExp(/baseline/g).test(String(id))) {
      let type = checkTaskType(id)

      if (type === 'task') {
        setState((state) => {
          return {
            ...state,
            currentTaskId: id
          }
        })
        props.getTaskById(id)
        window.$(`#modal-detail-task-Employee`).modal('show')
      }

      if (type === 'phase') {
        setState((state) => {
          return {
            ...state,
            currentPhaseId: id,
            currentPhase: currentProjectPhase?.find((phase) => phase._id === id)
          }
        })
        window.$(`#modal-show-detail-phase-${id}`).modal('show')
      }

      if (type === 'milestone') {
        setState((state) => {
          return {
            ...state,
            currentMilestoneId: id,
            currentMilestone: currentProjectMilestone.find((milestone) => milestone._id === id)
          }
        })
        window.$(`#modal-show-detail-milestone-${id}`).modal('show')
      }
    }
  }

  useEffect(() => {
    setDataTask(getDataTask())
  }, [])

  const getDataTask = (zoom = currentZoom) => {
    // Dựa vào currentZoom để tính toán duration theo giờ, ngày, tuần, tháng
    let currentMode = ''
    switch (zoom) {
      case translate('system_admin.system_setting.backup.hour'): {
        currentMode = 'hours'
        break
      }
      case translate('system_admin.system_setting.backup.date'): {
        currentMode = 'days'
        break
      }
      case translate('system_admin.system_setting.backup.week'): {
        currentMode = 'weeks'
        break
      }
      case translate('system_admin.system_setting.backup.month'): {
        currentMode = 'months'
        break
      }
      default: {
        break
      }
    }
    let data = [],
      links = [],
      linkId = 0,
      line = 0
    let count = { delay: 0, intime: 0, notAchived: 0 }
    if (currentProjectTasks && currentProjectTasks.length > 0) {
      for (let taskItem of currentProjectTasks) {
        let start = moment(taskItem.startDate)
        let end = moment(taskItem.endDate)
        let now = moment(new Date())
        let duration = 0
        if (currentMode === 'days') {
          duration = getDurationWithoutSatSun(taskItem.startDate, taskItem.endDate, 'days')
        } else if (currentMode === 'hours') {
          duration = getDurationWithoutSatSun(taskItem.startDate, taskItem.endDate, 'hours')
        } else {
          duration = end.diff(start, currentMode)
        }
        if (duration == 0) duration = 1
        let process = 0

        // Tô màu công việc
        if (taskItem.status != 'inprocess') {
          process = 3
        } else if (now > end) {
          process = 2 // Quá hạn
          count.notAchived++
        } else {
          let processDay = Math.floor((taskItem.progress * duration) / 100)
          let uptonow = now.diff(start, currentMode)

          if (uptonow > processDay) {
            process = 0 // Trễ hạn
            count.delay++
          } else if (uptonow <= processDay) {
            process = 1 // Đúng hạn
            count.intime++
          }
        }
        data.push({
          id: taskItem._id,
          text: taskItem.status == 'inprocess' ? `${taskItem.name} - ${taskItem.progress}%` : taskItem.name,
          taskName: `${taskItem.name}`,
          responsible: `${taskItem.responsibleEmployees.map((resItem) => resItem.name).join(', ')}`,
          customDuration: numberWithCommas(duration),
          planned_start: moment(taskItem.startDate).format('YYYY-MM-DD HH:mm'),
          planned_end: moment(taskItem.endDate).format('YYYY-MM-DD HH:mm'),
          start_date: moment(taskItem.startDate).format('YYYY-MM-DD HH:mm'),
          end_date:
            taskItem.actualEndDate && taskItem.status === 'finished'
              ? moment(taskItem.actualEndDate).format('YYYY-MM-DD HH:mm')
              : moment().isBefore(moment(taskItem.startDate).add(1, currentMode))
                ? moment(taskItem.startDate).add(1, currentMode).format('YYYY-MM-DD HH:mm')
                : moment().format('YYYY-MM-DD HH:mm'),
          progress: taskItem.progress / 100,
          process,
          parent: taskItem?.taskPhase ? taskItem.taskPhase : '0',
          status: formatTaskStatus(translate, taskItem.status),
          type: 'task'
        })

        // Nếu task có các công việc, cột mốc tiền nhiệm thì tạo link
        if (taskItem.preceedingTasks && taskItem.preceedingTasks.length > 0) {
          for (let preceedingItem of taskItem.preceedingTasks) {
            links.push({
              id: linkId,
              source: preceedingItem.task,
              target: taskItem._id,
              type: '0'
            })
            linkId++
          }
        }

        if (taskItem.preceedingMilestones && taskItem.preceedingMilestones.length > 0) {
          for (let preceedingItem of taskItem.preceedingMilestones) {
            links.push({
              id: linkId,
              source: preceedingItem,
              target: taskItem._id,
              type: '0'
            })
            linkId++
          }
        }
      }
    }

    if (currentProjectPhase && currentProjectPhase.length > 0) {
      for (let phaseItem of currentProjectPhase) {
        let start = moment(phaseItem.startDate)
        let end = moment(phaseItem.endDate)
        let now = moment(new Date())
        let duration = 0
        if (currentMode === 'days') {
          duration = getDurationWithoutSatSun(phaseItem.startDate, phaseItem.endDate, 'days')
        } else if (currentMode === 'hours') {
          duration = getDurationWithoutSatSun(phaseItem.startDate, phaseItem.endDate, 'hours')
        } else {
          duration = end.diff(start, currentMode)
        }
        if (duration == 0) duration = 1
        let process = 0

        // Tô màu công việc
        if (phaseItem.status != 'inprocess') {
          process = 3
        } else if (now > end) {
          process = 2 // Quá hạn
        } else {
          let processDay = Math.floor((phaseItem.progress * duration) / 100)
          let uptonow = now.diff(start, currentMode)

          if (uptonow > processDay) {
            process = 0 // Trễ hạn
          } else if (uptonow <= processDay) {
            process = 1 // Đúng hạn
          }
        }
        data.push({
          id: phaseItem._id,
          text: phaseItem.status == 'inprocess' ? `${phaseItem.name} - ${phaseItem.progress}%` : phaseItem.name,
          taskName: `${phaseItem.name}`,
          responsible: '',
          customDuration: numberWithCommas(duration),
          planned_start: moment(phaseItem.startDate).format('YYYY-MM-DD HH:mm'),
          planned_end: moment(phaseItem.endDate).format('YYYY-MM-DD HH:mm'),
          start_date: moment(phaseItem.startDate).format('YYYY-MM-DD HH:mm'),
          end_date:
            phaseItem.actualEndDate && phaseItem.status === 'finished'
              ? moment(phaseItem.actualEndDate).format('YYYY-MM-DD HH:mm')
              : moment().isBefore(moment(phaseItem.startDate).add(1, currentMode))
                ? moment(phaseItem.startDate).add(1, currentMode).format('YYYY-MM-DD HH:mm')
                : moment().format('YYYY-MM-DD HH:mm'),
          progress: phaseItem.progress ? phaseItem.progress / 100 : 0,
          process,
          parent: '0',
          status: formatTaskStatus(translate, phaseItem.status),
          type: 'project'
        })
      }
    }

    if (currentProjectMilestone && currentProjectMilestone.length > 0) {
      for (let milestoneItem of currentProjectMilestone) {
        let start = moment(milestoneItem.startDate)
        let end = moment(milestoneItem.endDate)
        let now = moment(new Date())
        let duration = 0
        if (currentMode === 'days') {
          duration = getDurationWithoutSatSun(milestoneItem.startDate, milestoneItem.endDate, 'days')
        } else if (currentMode === 'hours') {
          duration = getDurationWithoutSatSun(milestoneItem.startDate, milestoneItem.endDate, 'hours')
        } else {
          duration = end.diff(start, currentMode)
        }
        if (duration == 0) duration = 1
        let process = 0

        // Tô màu công việc
        if (milestoneItem.status != 'inprocess') {
          process = 3
        } else if (now > end) {
          process = 2 // Quá hạn
        } else {
          let processDay = Math.floor((milestoneItem.progress * duration) / 100)
          let uptonow = now.diff(start, currentMode)

          if (uptonow > processDay) {
            process = 0 // Trễ hạn
          } else if (uptonow <= processDay) {
            process = 1 // Đúng hạn
          }
        }
        data.push({
          id: milestoneItem._id,
          text: milestoneItem.status == 'inprocess' ? `${milestoneItem.name} - ${milestoneItem.progress}%` : milestoneItem.name,
          taskName: `${milestoneItem.name}`,
          responsible: `${milestoneItem.responsibleEmployees.map((resItem) => resItem.name).join(', ')}`,
          customDuration: numberWithCommas(duration),
          planned_start: moment(milestoneItem.startDate).format('YYYY-MM-DD HH:mm'),
          planned_end: moment(milestoneItem.endDate).format('YYYY-MM-DD HH:mm'),
          start_date: moment(milestoneItem.startDate).format('YYYY-MM-DD HH:mm'),
          end_date:
            milestoneItem.actualEndDate && milestoneItem.status === 'finished'
              ? moment(milestoneItem.actualEndDate).format('YYYY-MM-DD HH:mm')
              : moment().isBefore(moment(milestoneItem.startDate).add(1, currentMode))
                ? moment(milestoneItem.startDate).add(1, currentMode).format('YYYY-MM-DD HH:mm')
                : moment().format('YYYY-MM-DD HH:mm'),
          progress: milestoneItem.progress ? milestoneItem.progress / 100 : 0,
          process,
          parent: milestoneItem?.projectPhase ? milestoneItem.projectPhase : '0',
          status: formatTaskStatus(translate, milestoneItem.status),
          type: 'milestone',
          actualEndDate:
            milestoneItem.actualEndDate && milestoneItem.status === 'finished'
              ? moment(milestoneItem.actualEndDate).format('YYYY-MM-DD HH:mm')
              : moment().isBefore(moment(milestoneItem.startDate).add(1, currentMode))
                ? moment(milestoneItem.startDate).add(1, currentMode).format('YYYY-MM-DD HH:mm')
                : moment().format('YYYY-MM-DD HH:mm')
        })
        // Nếu cột mốc có các công việc, cột mốc tiền nhiệm thì tạo link
        if (milestoneItem.preceedingTasks && milestoneItem.preceedingTasks.length > 0) {
          for (let preceedingItem of milestoneItem.preceedingTasks) {
            links.push({
              id: linkId,
              source: preceedingItem.task,
              target: milestoneItem._id,
              type: '0'
            })
            linkId++
          }
        }

        if (milestoneItem.preceedingMilestones && milestoneItem.preceedingMilestones.length > 0) {
          for (let preceedingItem of milestoneItem.preceedingMilestones) {
            links.push({
              id: linkId,
              source: preceedingItem,
              target: milestoneItem._id,
              type: '0'
            })
            linkId++
          }
        }
      }
    }

    line = data.length

    return {
      data,
      count,
      line,
      links
    }
  }

  return (
    <React.Fragment>
      <div style={{ marginTop: '20px' }}>
        <>
          <ProjectGantt
            ganttData={dataTask}
            zoom={currentZoom}
            status={taskStatus}
            line={dataTask.line}
            onZoomChange={handleZoomChange}
            attachEvent={attachEvent}
          />
          {<ModalDetailTask action={'Employee'} task={task} />}
          {currentPhaseId && (
            <DetailPhase
              phaseId={currentPhaseId}
              currentProjectTasks={currentProjectTasks}
              projectDetail={projectDetail}
              phase={currentPhase}
            />
          )}
          {currentMilestoneId && (
            <DetailMilestone
              milestoneId={currentMilestoneId}
              currentProjectTasks={currentProjectTasks}
              projectDetail={projectDetail}
              milestone={currentMilestone}
            />
          )}
          <div className='form-inline' style={{ textAlign: 'center' }}>
            <div className='form-group'>
              <div id='in-time'></div>
              <label id='label-for-calendar'>
                {translate('task.task_management.in_time')}({dataTask.count && dataTask.count.intime ? dataTask.count.intime : 0})
              </label>
            </div>
            <div className='form-group'>
              <div id='delay'></div>
              <label id='label-for-calendar'>
                {translate('task.task_management.delayed_time')}({dataTask.count && dataTask.count.delay ? dataTask.count.delay : 0})
              </label>
            </div>
            <div className='form-group'>
              <div id='not-achieved'></div>
              <label id='label-for-calendar'>
                {translate('task.task_management.not_achieved')}(
                {dataTask.count && dataTask.count.notAchived ? dataTask.count.notAchived : 0})
              </label>
            </div>
          </div>
        </>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project, user, tasks, projectPhase } = state
  return { project, user, tasks, projectPhase }
}

const mapDispatchToProps = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getTaskById: performTaskAction.getTaskById
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GanttTasksProject))
