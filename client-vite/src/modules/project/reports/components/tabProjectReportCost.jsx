import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectActions } from '../../projects/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import moment from 'moment'
import c3 from 'c3'
import 'c3/c3.css'
import {
  formatTaskStatus,
  getAmountOfWeekDaysInMonth,
  renderCompare2Item,
  renderProgressBar,
  renderStatusColor
} from '../../projects/components/functionHelper'
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers'

const TabProjectReportCost = (props) => {
  const { currentTasks, translate, projectDetail } = props
  const chartRef = useRef(null)

  const preprocessData = () => {
    let columns = [],
      categories = []
    let budgets = ['Ngân sách (VND)'],
      actualCost = ['Chi phí thực (VND)']
    if (!currentTasks) {
      return {
        columns,
        categories
      }
    }
    for (let taskItem of currentTasks) {
      budgets.push(taskItem.estimateNormalCost)
      actualCost.push(taskItem.actualCost || 0)
      categories.push(taskItem.name)
    }
    columns = [budgets, actualCost]
    return {
      columns,
      categories
    }
  }

  // Xóa các chart đã render khi chưa đủ dữ liệu
  const removePreviousChart = () => {
    const currentChart = chartRef.current
    while (currentChart.hasChildNodes()) {
      currentChart.removeChild(currentChart.lastChild)
    }
  }

  const renderChart = () => {
    removePreviousChart()
    let chart = c3.generate({
      bindto: chartRef.current,
      data: {
        columns: preprocessData().columns,
        type: 'bar',
        labels: true
      },
      axis: {
        x: {
          type: 'category',
          categories: preprocessData().categories
        },
        y: {
          tick: {
            format: (d) => {
              return `${numberWithCommas(d)}`
            }
          }
        },
        rotated: true
      },
      zoom: {
        enabled: false
      },
      tooltip: {
        format: {
          value: (value, ratio, id) => {
            return `${numberWithCommas(value)} VND`
          }
        }
      },
      size: {
        height: (preprocessData().columns?.[0].length - 2) * 70
      }
    })
  }

  useEffect(() => {
    renderChart()
  })

  const getProjectTotalBudget = () => {
    let result = 0
    for (let taskItem of currentTasks) {
      result += Number(taskItem.estimateNormalCost)
    }
    return result
  }

  const getProjectTotalActualCost = () => {
    let result = 0
    for (let taskItem of currentTasks) {
      result += Number(taskItem.actualCost || 0)
    }
    return result
  }

  const [displayContent, setDisplayContent] = useState({
    title: 'Tổng số công việc',
    tasks: currentTasks
  })

  useEffect(() => {
    setDisplayContent({
      ...displayContent,
      tasks: currentTasks
    })
  }, [currentTasks])

  const renderItem = (label, value, colorCondition = undefined) => {
    return (
      <div className='row col-md-12' style={{ marginBottom: 5 }}>
        <span className='task-name'>
          {label}: <span style={{ fontWeight: 'bold', color: colorCondition || 'black' }}>{numberWithCommas(value)} VND</span>
        </span>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div>
        <div className='box-body qlcv'>
          <h4>
            <strong>Tổng quan chi phí dự án</strong>
          </h4>
          {renderItem('Tổng ngân sách cho dự án', getProjectTotalBudget())}
          {renderItem(
            'Chi phí thực tế hiện tại cho dự án',
            getProjectTotalActualCost(),
            renderCompare2Item(getProjectTotalBudget(), getProjectTotalActualCost())
          )}
        </div>
        <div className='box-body qlcv'>
          <h4>
            <strong>Biểu đồ so sánh ngân sách - chi phí dự án</strong>
          </h4>
          <div ref={chartRef} />
        </div>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const project = state.project
  return { project }
}

const mapDispatchToProps = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectReportCost))
