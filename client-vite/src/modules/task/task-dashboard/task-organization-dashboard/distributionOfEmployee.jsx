import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { SelectMulti, PaginateBar, DataTableSetting } from '../../../../common-components/index'
import { withTranslate } from 'react-redux-multilingual'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import c3 from 'c3'
import 'c3/c3.css'
import _deepClone from 'lodash/cloneDeep'

let infoSearch = {
  status: ['inprocess', 'wait_for_approval', 'finished', 'delayed', 'canceled']
}

function DistributionOfEmployee(props) {
  const { translate } = props
  const { taskDashboardCharts } = props.tasks
  const [state, setState] = useState(() => initState())

  const { perPage, nameEmployee, taskCount, page, pageTotal, total, display } = state
  function initState() {
    const defaultConfig = { limit: 10 }
    const distributionOfEmployeeChartId = 'distribution-of-employee-chart'
    const distributionOfEmployeeChartPerPage = getTableConfiguration(distributionOfEmployeeChartId, defaultConfig).limit

    return {
      perPage: distributionOfEmployeeChartPerPage
    }
  }
  useEffect(() => {
    const dataChart = getDataChart('employee-distribution-chart')

    if (dataChart) {
      const data = _deepClone(dataChart)
      const nameEmployee = data.nameEmployee.slice(0, perPage)
      const { taskCount } = data
      for (const i in taskCount) {
        taskCount[i] = taskCount[i].slice(0, 1).concat(taskCount[i].slice(1, perPage + 1))
      }
      setState({
        ...state,
        nameEmployee,
        taskCount,
        total: data?.totalEmployee,
        pageTotal: Math.ceil(data?.totalEmployee / perPage),
        page: 1,
        display: nameEmployee.length
      })
      // console.log('state: ', state)
    }
  }, [JSON.stringify(taskDashboardCharts?.['employee-distribution-chart'])])

  useEffect(() => {
    if (state.nameEmployee && state.taskCount) barChart()
  }, [JSON.stringify(state.taskCount), JSON.stringify(state.nameEmployee)])

  const handleSelectStatus = (value) => {
    if (value.length === 0) {
      value = ['inprocess']
    }
    infoSearch = {
      ...infoSearch,
      status: value
    }
    props.handleChangeDataSearch('employee-distribution-chart', { status: value, page, perPage })
  }
  const handleSearchData = () => {
    const { status } = infoSearch
    const dataSearch = {
      'employee-distribution-chart': {
        status
      }
    }
    props.getDataSearchChart(dataSearch)
    setState({
      ...state,
      status
    })
  }

  const handlePaginationDistributionOfEmployeeChart = (page) => {
    const dataChart = getDataChart('employee-distribution-chart')
    if (dataChart) {
      const data = _deepClone(dataChart)
      const begin = (Number(page) - 1) * perPage
      const end = (Number(page) - 1) * perPage + perPage
      const nameEmployee = data?.nameEmployee.slice(begin, end)
      const { taskCount } = data
      for (const i in taskCount) {
        taskCount[i] = taskCount[i].slice(0, 1).concat(taskCount[i].slice(begin + 1, end + 1))
      }
      setState({
        ...state,
        nameEmployee,
        taskCount,
        page,
        display: nameEmployee.length
      })
    }
  }
  const setLimitDistributionOfEmployeeChart = (limit) => {
    const dataChart = getDataChart('employee-distribution-chart')
    if (dataChart) {
      const data = _deepClone(dataChart)
      const nameEmployee = data?.nameEmployee.slice(0, Number(limit))
      const { taskCount } = data
      for (const i in taskCount) {
        taskCount[i] = taskCount[i].slice(0, 1).concat(taskCount[i].slice(1, Number(limit) + 1))
      }

      setState({
        ...state,
        nameEmployee,
        taskCount,
        page: 1,
        perPage: Number(limit),
        display: nameEmployee.length,
        pageTotal: Math.ceil(data.totalEmployee / limit)
      })
    }
  }

  function getDataChart(chartName) {
    let dataChart
    const data = taskDashboardCharts?.[chartName]
    if (data.dataChart) {
      dataChart = data.dataChart
      dataChart.taskCount[0][0] = translate('task.task_management.responsible_role')
      dataChart.taskCount[1][0] = translate('task.task_management.accountable_role')
      dataChart.taskCount[2][0] = translate('task.task_management.consulted_role')
      dataChart.taskCount[3][0] = translate('task.task_management.informed_role')
    }
    return dataChart
  }

  const removePreviousChart = () => {
    const chart = document.getElementById('distributionChart')

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const barChart = () => {
    removePreviousChart()

    const height = nameEmployee?.length * 60
    const heightOfChart = height > 320 ? height : 320
    c3.generate({
      bindto: document.getElementById('distributionChart'),

      data: {
        columns: taskCount || [],
        type: 'bar',
        groups: [
          [
            `${translate('task.task_management.consulted_role')}`,
            `${translate('task.task_management.informed_role')}`,
            `${translate('task.task_management.responsible_role')}`,
            `${translate('task.task_management.accountable_role')}`
          ]
        ]
      },

      size: {
        height: heightOfChart
      },

      legend: {
        // Ẩn chú thích biểu đồ
        show: true
      },

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      axis: {
        x: {
          type: 'category',
          categories: nameEmployee?.length > 0 ? nameEmployee : []
        },
        rotated: true
      }
    })
  }
  return (
    <>
      <DataTableSetting tableId='distribution-of-employee-chart' setLimit={setLimitDistributionOfEmployeeChart} />
      <div className='box-body qlcv'>
        <section className='form-inline' style={{ textAlign: 'right' }}>
          {/* Chọn trạng thái công việc */}
          <div className='form-group'>
            <label style={{ minWidth: '150px' }}>{translate('task.task_management.task_status')}</label>
            <SelectMulti
              id='multiSelectStatusInDistribution'
              items={[
                { value: 'inprocess', text: translate('task.task_management.inprocess') },
                { value: 'wait_for_approval', text: translate('task.task_management.wait_for_approval') },
                { value: 'finished', text: translate('task.task_management.finished') },
                { value: 'delayed', text: translate('task.task_management.delayed') },
                { value: 'canceled', text: translate('task.task_management.canceled') }
              ]}
              value={infoSearch.status}
              onChange={handleSelectStatus}
              options={{
                nonSelectedText: translate('task.task_management.inprocess'),
                allSelectedText: translate('task.task_management.select_all_status')
              }}
            />
          </div>
          <div className='form-group'>
            <button className='btn btn-success' onClick={handleSearchData}>
              {translate('task.task_management.filter')}
            </button>
          </div>
        </section>

        {/* Biểu đồ đóng góp */}
        <section id='distributionChart' />

        <PaginateBar
          display={display}
          total={total}
          pageTotal={pageTotal}
          currentPage={page}
          func={handlePaginationDistributionOfEmployeeChart}
        />
      </div>
    </>
  )
}

const mapState = (state) => {
  const { user, tasks } = state
  return { user, tasks }
}

const actions = {}

const connectedDistributionOfEmployee = connect(mapState, actions)(withTranslate(DistributionOfEmployee))
export { connectedDistributionOfEmployee as DistributionOfEmployee }
