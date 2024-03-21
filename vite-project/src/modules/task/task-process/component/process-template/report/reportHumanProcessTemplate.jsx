import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker } from '../../../../../../common-components'
import { TaskProcessActions } from '../../../redux/actions'
import { TaskProcessService } from '../../../redux/services'
import { ChartCountByMonth } from './chartCountByMonth'
import { ChartReportTask } from './chartReportTask'
import { TableReportTask } from './tableReportTask'
import c3 from 'c3'
import 'c3/c3.css'
import moment from 'moment'

function areEqual(prevProps, nextProps) {
  if (prevProps.idProcess === nextProps.idProcess) {
    return true
  } else {
    return false
  }
}
function ReportHumanProcessTemplate(props) {
  const formatDate = (date, monthYear = false) => {
    if (!date) return null
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    if (monthYear === true) {
      return [month, year].join('-')
    } else {
      return [day, month, year].join('-')
    }
  }
  // let { data } = props;
  let date = new Date()
  let _startDate = formatDate(date.setMonth(new Date().getMonth() - 6), true)
  const [state, setState] = useState({
    startDate: _startDate,
    endDate: formatDate(Date.now(), true),
    search: 0
  })

  const showData = (lists = [], nameTask) => {
    let result = null
    if (lists && lists.length !== 0) {
      result = lists.map((taskItem, index) => {
        return (
          <tr key={index}>
            <td>{taskItem.name}</td>
            <td>{taskItem.trehan}</td>
            <td>{taskItem.dunghan}</td>
            <td>{taskItem.minTime}</td>
            <td>{taskItem.maxTime}</td>
            <td>{taskItem.avgTime}</td>
            <td>{taskItem.maxPoint}</td>
            <td>{taskItem.minPoint}</td>
            <td>{taskItem.avgPoint}</td>
          </tr>
        )
      })
    }
    return result
  }

  useEffect(() => {
    let partMonth1 = state.startDate.split('-')
    let startDate = [partMonth1[1], partMonth1[0]].join('-')
    let partMonth2 = state.endDate.split('-')
    let endDate = [partMonth2[1], partMonth2[0]].join('-')
    TaskProcessService.getAllTaskProcess(1, 100000, '', startDate, endDate, props.idProcess).then((res) => {
      setState({
        ...state,
        dataTaskProcess: res.data.content.data
      })
    })
  }, [state.search, props.idProcess])
  const handleSunmitSearch = () => {
    setState({
      ...state,
      search: state.search + 1
    })
  }
  const handleStartMonthChange = (value) => {
    setState({
      ...state,
      startDate: value
    })
  }

  const handleEndMonthChange = (value) => {
    setState({
      ...state,
      endDate: value
    })
  }
  let listMember = []
  // if (state.dataTaskProcess){
  //     for (let i in state.dataTaskProcess) {
  //         let tasks = state.dataTaskProcess[i].tasks
  //         let arr = [];
  //         tasks.forEach(value => {
  //             let member1 = value.responsibleEmployees
  //             let end = moment(taskItem.endDate);
  //             let endT = moment(taskItem.actualEndDate);
  //             let now = moment(new Date());
  //             let intime = false
  //             if (value.status == "finished") {
  //                 let uptonow1 = now.diff(end, currentMode);
  //                 let uptonow2 = now.diff(endT, currentMode);
  //                 if (uptonow1 < uptonow2) {
  //                     intime = true;
  //                 }
  //             }
  //             member1.forEach(member =>{
  //                 let index2 = listMember.findIndex(e => e.member._id === member._id);
  //                 if (index2 === -1) {
  //                     if (intime){
  //                         listMember.push({member:member,intime:1,totalTask:1})
  //                     } else listMember.push({member:member,delay:1,totalTask:1})
  //                 } else {
  //                     if (intime){
  //                         listMember[index2].intime = listMember[index2].intime+1;
  //                         listMember[index2].totalTask = listMember[index2].totalTask+1;
  //                     } else {
  //                         listMember[index2].delay = listMember[index2].delay+1;
  //                         listMember[index2].totalTask = listMember[index2].totalTask+1;
  //                     }
  //                 }
  //             })
  //         });
  //         var newArr = []
  //         arr.forEach((item) => {

  //         })

  //     }
  // }
  const { translate } = props

  return (
    <React.Fragment>
      <div className='form-inline'>
        <div className='form-group'>
          <label style={{ width: 'auto' }}>Từ ngày</label>
          <DatePicker
            id='form-month-annual-leave'
            dateFormat='month-year'
            deleteValue={false}
            value={state.startDate}
            onChange={handleStartMonthChange}
          />
        </div>
        <div className='form-group'>
          <label style={{ width: 'auto' }}>Đến ngày</label>
          <DatePicker
            id='to-month-annual-leave'
            dateFormat='month-year'
            deleteValue={false}
            value={state.endDate}
            onChange={handleEndMonthChange}
          />
        </div>
        <button type='button' className='btn btn-success' title={translate('general.search')} onClick={() => handleSunmitSearch()}>
          {translate('general.search')}
        </button>
      </div>
      <p>Đánh giá nhân sự</p>
      <table id='listTaskProcess1' className='table table-striped table-bordered table-hover'>
        <thead>
          <tr>
            <th>Tên thành viên</th>
            <th>số quy trình tham gia</th>
            <th>tổng số công việc tham gia</th>
            <th>số công việc đúng hạn</th>
            <th>Số công việc trễ hạn</th>
          </tr>
        </thead>
        <tbody>{showData(listMember)}</tbody>
      </table>
    </React.Fragment>
  )
}

function mapState(state) {
  const { user, auth, role, taskProcess } = state
  return { user, auth, role, taskProcess }
}

const actionCreators = {
  getAllTaskProcess: TaskProcessActions.getAllTaskProcess
  //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
}
const connectedReportHumanProcessTemplate = connect(
  mapState,
  actionCreators
)(withTranslate(React.memo(ReportHumanProcessTemplate, areEqual)))
export { connectedReportHumanProcessTemplate as ReportHumanProcessTemplate }
