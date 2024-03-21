import React, { Component, useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import './reportProcess.css'
import c3 from 'c3'
import 'c3/c3.css'
import { checkIsNullUndefined, numberWithCommas } from '../../../../task-management/component/functionHelpers.js'

function areEqual(prevProps, nextProps) {
  if (JSON.stringify(prevProps.listTask) === JSON.stringify(nextProps.listTask)) {
    return true
  } else {
    return false
  }
}

function ReportTask(props) {
  const chartTask = useRef(null)
  const { translate } = props
  useEffect(() => {
    renderOverdueScheduleChart()
  })
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
  const getDataTask = () => {
    let arr1 = ['thời gian nhanh nhất']
    let arr2 = ['thời gian chậm nhất']
    let arr3 = ['thời gian trong quy trình này']
    let arr4 = []
    if (props.listTask && props.listTaskTemplate) {
      for (let x = 0; x < props.listTask.length; x++) {
        if (props.listTaskTemplate[x].fastest && props.listTaskTemplate[x].slowest) {
          arr1.push(props.listTaskTemplate[x].fastest.time)
          arr2.push(props.listTaskTemplate[x].slowest.time)
        }
        console.log(props.listTask[x].actualStartDate, props.listTask[x].actualEndDate, 'hour')
        arr3.push(convertT(props.listTask[x].actualStartDate, props.listTask[x].actualEndDate, 'hour'))
        arr4.push(props.listTask[x].name || 'abc')
      }
    }
    return [arr1, arr2, arr3, arr4]
  }
  const renderOverdueScheduleChart = () => {
    const chartTask1 = chartTask.current
    while (chartTask1.hasChildNodes()) {
      chartTask1.removeChild(chartTask1.lastChild)
    }
    let data = getDataTask()
    console.log(data)
    let chartOverdueSchedule = c3.generate({
      bindto: chartTask.current,
      data: {
        columns: [data[0], data[1], data[2]],
        type: 'bar',
        labels: true
      },
      axis: {
        x: {
          type: 'category',
          categories: data[3]
        }
      },
      tooltip: {
        format: {
          value: (value, ratio, id) => {
            return `${numberWithCommas(value)}`
          }
        }
      },
      zoom: {
        enabled: false
      }
      // size: {
      //     height: (data?.[0].length - 2) * 100,
      // },
    })
  }
  return (
    <React.Fragment>
      <div className='box-body qlcv'>
        <h4>
          <strong>Biểu đồ đánh giá thời gian làm việc so với quy trình khác theo mẫu</strong>
        </h4>
        <div ref={chartTask} />
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
}
const connectedReportTask = connect(mapState, actionCreators)(withTranslate(React.memo(ReportTask, areEqual)))
export { connectedReportTask as ReportTask }
