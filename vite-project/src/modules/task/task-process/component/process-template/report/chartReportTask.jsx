import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker } from '../../../../../../common-components'
import { TaskProcessActions } from '../../../redux/actions'
import { TaskProcessService } from '../../../redux/services'
import c3 from 'c3'
import 'c3/c3.css'
import { BarChartReportTask } from './barChartReportTask'

function ChartReportTask(props) {
  let arrayTaskInprocess = []
  const maxMinAvg = (arr) => {
    console.log(arr)
    let max = arr[0]
    let min = arr[0]
    let sum = 0
    arr.forEach(function (value) {
      if (value > max) max = value
      if (value < min) min = value
      sum += value
    })
    let avg = Math.round((sum / arr.length) * 100) / 100
    return [min ? min : 0, max ? max : 0, avg ? avg : 0]
  }
  if (props.info && props.info.length !== 0) {
    for (let i in props.info) {
      let dataX = []
      let dataX2 = []
      let dataY = ['nhanh nhất', 'chậm nhất', 'trung bình']
      console.log(props.dataTaskProcess)
      if (props.dataTaskProcess && props.dataTaskProcess.length !== 0) {
        for (let j in props.dataTaskProcess) {
          if (props.dataTaskProcess[j].tasks.find((value) => value.codeInProcess === props.info[i].code)) {
            let value = props.dataTaskProcess[j].tasks.find((value) => value.codeInProcess === props.info[i].code)
            let days = 0
            dataY.push(value.name)
            if (value.actualEndDate && value.actualStartDate) {
              let day1 = new Date(value.actualEndDate)
              let day2 = new Date(value.actualStartDate)
              let totalTime1 = 0
              let totalTime2 = 0
              let status1 = 0
              let status2 = 0
              if (props.dataTaskProcess[j].officeHours.length !== 0) {
                //totalTime2 = props.dataTaskProcess[j].convertDayToHour;
                props.dataTaskProcess[j].officeHours.forEach((value) => {
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
                  if (
                    day2.getHours() * 60 + day2.getMinutes() <
                    arrayAdministrativeStartTime[0] * 60 + parseInt(arrayAdministrativeStartTime[1])
                  ) {
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
                      (arrayAdministrativeEndTime[0] * 60 +
                        parseInt(arrayAdministrativeEndTime[1]) -
                        day2.getHours() * 60 -
                        day2.getMinutes()) /
                        60
                  }
                  if (
                    day1.getHours() * 60 + day1.getMinutes() <
                    arrayAdministrativeStartTime[0] * 60 + parseInt(arrayAdministrativeStartTime[1])
                  ) {
                    totalTime2 = totalTime2 + 0
                  } else if (
                    day1.getHours() * 60 + day1.getMinutes() <
                    arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1])
                  ) {
                    totalTime2 =
                      totalTime2 +
                      (day1.getHours() * 60 +
                        day1.getMinutes() -
                        arrayAdministrativeStartTime[0] * 60 -
                        parseInt(arrayAdministrativeStartTime[1])) /
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
              }

              // if (props.dataTaskProcess[j].administrativeStartTime && props.dataTaskProcess[j].administrativeEndTime){
              //     let arrayAdministrativeStartTimeHour = parseInt(props.dataTaskProcess[j].administrativeStartTime.split(":")[0])
              //     let arrayAdministrativeStartTimeMinute = parseInt(props.dataTaskProcess[j].administrativeStartTime.split(":")[1])
              //     let arrayAdministrativeEndTimeHour = parseInt(props.dataTaskProcess[j].administrativeEndTime.split(":")[0])
              //     let arrayAdministrativeEndTimeMinute = parseInt(props.dataTaskProcess[j].administrativeEndTime.split(":")[1])
              //     if (day2.getHours() < arrayAdministrativeStartTimeHour){
              //         day2.setHours(arrayAdministrativeStartTimeHour);
              //         day2.setMinutes(arrayAdministrativeStartTimeMinute)
              //     }
              //     if (day2.getHours() > arrayAdministrativeEndTimeHour){
              //         day2.setDate(day2.getDate()+1)
              //         day2.setHours(arrayAdministrativeStartTimeHour);
              //         day2.setMinutes(arrayAdministrativeStartTimeMinute)
              //     }
              //     if (day1.getHours() > arrayAdministrativeEndTimeHour){
              //         day1.setHours(arrayAdministrativeEndTimeHour);
              //         day1.setMinutes(arrayAdministrativeEndTimeMinute)
              //     }
              //     if (day1.getHours() < arrayAdministrativeStartTimeHour){
              //         day1.setDate(day1.getDate()-1)
              //         day1.setHours(arrayAdministrativeEndTimeHour);
              //         day1.setMinutes(arrayAdministrativeEndTimeMinute)
              //     }
              // }
              var difference = Math.abs(day1 - day2)
              days = difference / (1000 * 3600)
              console.log(totalTime1, totalTime2)
              days = parseInt(days / 24) * props.dataTaskProcess[j].convertDayToHour + totalTime1 + totalTime2
              // if ((days - d1 *24) >10){
              //     days = d1 * props.dataTaskProcess[j].convertDayToHour +(days - d1 *24) + props.dataTaskProcess[j].convertDayToHour -24
              // } else {
              //     days = d1 * props.dataTaskProcess[j].convertDayToHour + (days - d1 *24)
              // }

              days = Math.round(days * 100) / 100
            }
            dataX2.push(Math.round((value.hoursSpentOnTask.totalHoursSpent / (3600 * 1000)) * 100) / 100)
            dataX.push(days)
            // }
            // data.push(props.dataTaskProcess[j].tasks.find(value=>value.codeInProcess === props.info[i].code))
          }
        }
      }
      arrayTaskInprocess.push({
        name: props.info[i].name,
        code: props.info[i].code,
        dataX: ['Số giờ'].concat(maxMinAvg(dataX)).concat(dataX),
        dataY: dataY,
        dataX2: ['Số giờ'].concat(maxMinAvg(dataX2)).concat(dataX2)
      })
    }
  }

  return (
    <React.Fragment>
      {arrayTaskInprocess.length !== 0 &&
        arrayTaskInprocess.map((item, index) => {
          return <BarChartReportTask data={item} index={index} />
        })}
    </React.Fragment>
  )
}

function mapState(state) {
  //const { user, auth, role, taskProcess } = state;
  return {}
}

const actionCreators = {
  //getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
  //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
}
const connectedChartReportTask = connect(mapState, actionCreators)(withTranslate(ChartReportTask))
export { connectedChartReportTask as ChartReportTask }
