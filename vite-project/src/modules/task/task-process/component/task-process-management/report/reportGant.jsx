import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ProcessGantt } from '../../../../../../common-components/src/gantt/processGantt'
import { getDurationWithoutSatSun } from '../../../../../project/projects/components/functionHelper'
import { numberWithCommas } from '../../../../task-management/component/functionHelpers.js'
import './reportProcess.css'
import moment from 'moment'
import { performTaskAction } from '../../../../task-perform/redux/actions'
import { ModalDetailTask } from '../../../../task-dashboard/task-personal-dashboard/modalDetailTask'

function areEqual(prevProps, nextProps) {
  if (JSON.stringify(prevProps.listTask) === JSON.stringify(nextProps.listTask)) {
    return true
  } else {
    return false
  }
}

function ReportGant(props) {
  const { translate } = props
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
  useEffect(() => {
    setDataTask(getDataTask())
  }, [props.listTask])
  const convertT = (actualStartDate, actualEndDate, cv) => {
    let day1 = new Date(actualEndDate)
    let day2 = new Date(actualStartDate)
    let totalTime1 = 0
    let totalTime2 = 0
    let officeHours = props.officeHours
    let convertDayToHour = parseFloat(props.convertDayToHour)
    let days = 0
    if (officeHours.length !== 0) {
      //totalTime2 = props.dataTaskProcess[j].convertDayToHour;
      officeHours.forEach((value) => {
        let arrayAdministrativeStartTime = value.startTime.split(' ')
        arrayAdministrativeStartTime = arrayAdministrativeStartTime[0].split(':').concat(arrayAdministrativeStartTime[1])
        if (arrayAdministrativeStartTime[2] === 'PM') {
          arrayAdministrativeStartTime[0] = parseInt(arrayAdministrativeStartTime[0]) + 12
        }
        let arrayAdministrativeEndTime = value.endTime.split(' ')
        arrayAdministrativeEndTime = arrayAdministrativeEndTime[0].split(':').concat(arrayAdministrativeEndTime[1])
        if (arrayAdministrativeEndTime[2] === 'PM') {
          arrayAdministrativeEndTime[0] = parseInt(arrayAdministrativeEndTime[0]) + 12
        }
        if (day2.getHours() * 60 + day2.getMinutes() < arrayAdministrativeStartTime[0] * 60 + parseInt(arrayAdministrativeStartTime[1])) {
          totalTime1 =
            totalTime1 +
            (arrayAdministrativeEndTime[0] * 60 +
              parseInt(arrayAdministrativeEndTime[1]) -
              arrayAdministrativeStartTime[0] * 60 -
              parseInt(arrayAdministrativeStartTime[1])) /
              60
        } else if (
          day2.getHours() * 60 + day2.getMinutes() <
          arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1])
        ) {
          totalTime1 =
            totalTime1 +
            (arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1]) - day2.getHours() * 60 - day2.getMinutes()) / 60
        }
        if (day1.getHours() * 60 + day1.getMinutes() < arrayAdministrativeStartTime[0] * 60 + parseInt(arrayAdministrativeStartTime[1])) {
          totalTime2 = totalTime2 + 0
        } else if (
          day1.getHours() * 60 + day1.getMinutes() <
          arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1])
        ) {
          totalTime2 =
            totalTime2 +
            (day1.getHours() * 60 + day1.getMinutes() - arrayAdministrativeStartTime[0] * 60 - parseInt(arrayAdministrativeStartTime[1])) /
              60
        } else {
          totalTime2 =
            totalTime2 +
            (arrayAdministrativeEndTime[0] * 60 +
              parseInt(arrayAdministrativeEndTime[1]) -
              arrayAdministrativeStartTime[0] * 60 -
              parseInt(arrayAdministrativeStartTime[1])) /
              60
        }
      })
      day1.setHours(0)
      day1.setMinutes(0)
      day2.setDate(day2.getDate() + 1)
      day2.setHours(0)
      day2.setMinutes(0)
      var difference = Math.abs(day1 - day2)
      days = difference / (1000 * 3600)
      days = parseInt(days / 24) * convertDayToHour + totalTime1 + totalTime2
      switch (cv) {
        case 'days':
          days = days / convertDayToHour
          days = Math.round(days * 100) / 100
          break
        case 'hours':
          days = Math.round(days * 100) / 100
          break
        case 'weeks':
          days = days / (convertDayToHour * 7)
          days = Math.round(days * 100) / 100
          break
        case 'months':
          days = days / (convertDayToHour * 7 * 30)
          break
        default:
        // code block
      }
      // if ((days - d1 *24) >10){
      //     days = d1 * props.dataTaskProcess[j].convertDayToHour +(days - d1 *24) + props.dataTaskProcess[j].convertDayToHour -24
      // } else {
      //     days = d1 * props.dataTaskProcess[j].convertDayToHour + (days - d1 *24)
      // }

      // days = Math.round(days * 100) / 100
    }
    return days
  }
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
    if (props.listTask && props.listTask.length > 0) {
      for (let taskItem of props.listTask) {
        let start = moment(taskItem.startDate)
        let end = moment(taskItem.endDate)
        let endT = moment(taskItem.actualEndDate)
        let now = moment(new Date())
        let duration = 0
        if (currentMode === 'days') {
          duration = convertT(taskItem.startDate, taskItem.endDate, currentMode)
        } else if (currentMode === 'hours') {
          duration = convertT(taskItem.startDate, taskItem.endDate, currentMode)
        } else if (currentMode === 'weeks') {
          duration = convertT(taskItem.startDate, taskItem.endDate, currentMode)
        } else {
          duration = convertT(taskItem.startDate, taskItem.endDate, currentMode)
        }
        if (duration == 0) duration = 1
        let process = 0
        // Tô màu công việc
        if (taskItem.status == 'finished') {
          let uptonow1 = now.diff(end, currentMode)
          let uptonow2 = now.diff(endT, currentMode)
          if (uptonow1 < uptonow2) {
            process = 1
            count.intime++
          } else {
            count.delay++
          }
        } else if (taskItem.status != 'inprocess') {
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
          start_date: taskItem.actualStartDate
            ? moment(taskItem.actualStartDate).format('YYYY-MM-DD HH:mm')
            : moment(taskItem.startDate).format('YYYY-MM-DD HH:mm'),
          end_date:
            taskItem.actualEndDate && taskItem.status === 'finished'
              ? moment(taskItem.actualEndDate).format('YYYY-MM-DD HH:mm')
              : moment().isBefore(moment(taskItem.startDate))
                ? moment(taskItem.startDate).format('YYYY-MM-DD HH:mm')
                : moment().format('YYYY-MM-DD HH:mm'),
          progress: taskItem.progress / 100,
          process,
          parent: '0',
          status: taskItem.status
        })

        // Nếu task có các task tiền nhiệm thì tạo link
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
      }
      line = data.length
    }
    return {
      data,
      count,
      line,
      links
    }
  }
  const attachEvent = (id) => {
    if (!RegExp(/baseline/g).test(String(id))) {
      props.getTaskById(id)
      window.$(`#modal-detail-task-Employee`).modal('show')
    }
  }
  const task = props.tasks && props.tasks.task
  return (
    <React.Fragment>
      <ProcessGantt
        ganttData={dataTask}
        zoom={currentZoom}
        status={taskStatus}
        line={dataTask.line}
        onZoomChange={handleZoomChange}
        attachEvent={attachEvent}
      />
      {<ModalDetailTask action={'Employee'} task={task} />}
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
            {translate('task.task_management.not_achieved')}({dataTask.count && dataTask.count.notAchived ? dataTask.count.notAchived : 0})
          </label>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { user, auth, role, taskProcess } = state
  return { user, auth, role, taskProcess }
}

const actionCreators = {
  //getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
  //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
  getTaskById: performTaskAction.getTaskById
}
const connectedReportGant = connect(mapState, actionCreators)(withTranslate(React.memo(ReportGant, areEqual)))
export { connectedReportGant as ReportGant }
