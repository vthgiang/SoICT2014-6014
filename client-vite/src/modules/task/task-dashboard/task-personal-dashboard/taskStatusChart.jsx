import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { SelectMulti } from '../../../../common-components/index'

import { withTranslate } from 'react-redux-multilingual'
import { filterDifference } from '../../../../helpers/taskModuleHelpers'

import c3 from 'c3'
import 'c3/c3.css'

function TaskStatusChart(props) {
  // Khai báo props
  const { translate, TaskOrganizationUnitDashboard, tasks } = props
  const { taskDashboardCharts } = props.tasks
  const ROLE = { RESPONSIBLE: 1, ACCOUNTABLE: 2, CONSULTED: 3, INFORMED: 4, CREATOR: 5 }
  const ROLE_SELECTBOX = [
    {
      text: translate('task.task_management.responsible'),
      value: ROLE.RESPONSIBLE
    },
    {
      text: translate('task.task_management.accountable'),
      value: ROLE.ACCOUNTABLE
    },
    {
      text: translate('task.task_management.consulted'),
      value: ROLE.CONSULTED
    },
    {
      text: translate('task.task_management.informed'),
      value: ROLE.INFORMED
    },
    {
      text: translate('task.task_management.creator'),
      value: ROLE.CREATOR
    }
  ]
  const LABEL = {
    INPROCESS: translate('task.task_management.inprocess'),
    WAIT_FOR_APPROVAL: translate('task.task_management.wait_for_approval'),
    FINISHED: translate('task.task_management.finished'),
    DELAYED: translate('task.task_management.delayed'),
    CANCELED: translate('task.task_management.canceled')
  }

  const [state, setState] = useState({
    role: [ROLE.RESPONSIBLE]
  })
  const CHART = React.createRef()
  // Khai báo state
  const { role } = state

  useEffect(() => {
    if (TaskOrganizationUnitDashboard) {
      let dataChart = getDataChart('task-status-chart')
      if (dataChart) {
        dataChart[0][0] = LABEL.INPROCESS
        dataChart[1][0] = LABEL.WAIT_FOR_APPROVAL
        dataChart[2][0] = LABEL.FINISHED
        dataChart[3][0] = LABEL.DELAYED
        dataChart[4][0] = LABEL.CANCELED
      }

      setState({
        ...state,
        dataChart: dataChart
      })
    } else {
      let dataPieChart,
        numberOfInprocess = 0,
        numberOfWaitForApproval = 0,
        numberOfFinished = 0,
        numberOfDelayed = 0,
        numberOfCanceled = 0
      let listTask = [],
        listTaskByRole = []

      if (tasks) {
        if (tasks.responsibleTasks) listTaskByRole[ROLE.RESPONSIBLE] = tasks.responsibleTasks
        if (tasks.accountableTasks) listTaskByRole[ROLE.ACCOUNTABLE] = tasks.accountableTasks
        if (tasks.consultedTasks) listTaskByRole[ROLE.CONSULTED] = tasks.consultedTasks
        if (tasks.informedTasks) listTaskByRole[ROLE.INFORMED] = tasks.informedTasks
        if (tasks.creatorTasks) listTaskByRole[ROLE.CREATOR] = tasks.creatorTasks

        if (role && role.length !== 0) {
          role.map((role) => {
            listTask = listTask.concat(listTaskByRole[role])
          })
        }

        listTask = filterDifference(listTask)
      }
      if (listTask) {
        listTask.map((task) => {
          switch (task?.status) {
            case 'inprocess':
              numberOfInprocess++
              break
            case 'wait_for_approval':
              numberOfWaitForApproval++
              break
            case 'finished':
              numberOfFinished++
              break
            case 'delayed':
              numberOfDelayed++
              break
            case 'canceled':
              numberOfCanceled++
              break
          }
        })
      }

      dataPieChart = [
        [LABEL.INPROCESS, numberOfInprocess],
        [LABEL.WAIT_FOR_APPROVAL, numberOfWaitForApproval],
        [LABEL.FINISHED, numberOfFinished],
        [LABEL.DELAYED, numberOfDelayed],
        [LABEL.CANCELED, numberOfCanceled]
      ]
      setState({
        ...state,
        dataChart: dataPieChart
      })
    }
  }, [
    JSON.stringify(taskDashboardCharts?.['task-status-chart']),
    JSON.stringify(tasks?.responsibleTasks),
    JSON.stringify(tasks?.accountableTasks),
    JSON.stringify(tasks?.consultedTasks),
    state.role
  ])

  useEffect(() => {
    if (state?.dataChart) {
      pieChart()
    }
  }, [JSON.stringify(state?.dataChart)])

  const handleSelectRole = (value) => {
    let role = value.map((item) => Number(item))
    setState({
      ...state,
      role: role
    })
  }

  function getDataChart(chartName) {
    let dataChart
    let data = taskDashboardCharts?.[chartName]
    if (data) {
      dataChart = data.dataChart
    }
    return dataChart
  }

  // Xóa các chart đã render khi chưa đủ dữ liệu
  const removePreviousChart = () => {
    const chart = CHART.current
    while (chart.hasChildNodes()) {
      chart.removeChild(chart.lastChild)
    }
  }

  // Khởi tạo PieChart bằng C3
  const pieChart = () => {
    removePreviousChart()
    const { dataChart } = state
    c3.generate({
      bindto: CHART.current,

      data: {
        // Dữ liệu biểu đồ
        columns: dataChart,
        type: 'pie'
      },

      // Căn lề biểu đồ
      padding: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      },

      tooltip: {
        format: {
          value: function (value, ratio, id, index) {
            return value
          }
        }
      }
    })
  }
  return (
    <React.Fragment>
      {!TaskOrganizationUnitDashboard && (
        <div className='qlcv'>
          <div className='form-inline'>
            <div className='form-group'>
              <label style={{ width: 'auto' }}>{translate('task.task_management.role')}</label>
              <SelectMulti
                id={`roleOfStatusTaskSelectBox`}
                items={ROLE_SELECTBOX}
                multiple={true}
                onChange={handleSelectRole}
                options={{ allSelectedText: translate('task.task_management.select_all_status') }}
                value={role}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={CHART}></div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { tasks } = state
  return { tasks }
}
const actions = {}

const connectedTaskStatusChart = connect(mapState, actions)(withTranslate(TaskStatusChart))
export { connectedTaskStatusChart as TaskStatusChart }
