import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectActions } from '../../projects/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import moment from 'moment'
import { DatePicker, SelectBox } from '../../../../common-components'
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers'
import { AutomaticTaskPointCalculator } from '../../../task/task-perform/component/automaticTaskPointCalculator'
import c3 from 'c3'
import 'c3/c3.css'
import ModalEVMData from '../../statistic/components/modalEVMData'

const TabEvalPhase = (props) => {
  const { currentTasks, listTasksEval, projectDetailId, projectDetail } = props
  const chartRef = useRef(null)
  const [currentTimeMode, setCurrentTimeMode] = useState('')
  const currentTimeModeArr = [
    { text: 'Tuần', value: 'weeks' },
    { text: 'Tháng', value: 'months' }
  ]
  const [currentGraphData, setCurrentGraphData] = useState(undefined)

  const checkUndefinedNull = (value) => {
    return value === undefined || value === null
  }

  const getGraphTasksDataOfTimeMode = (listData, timeMode) => {
    if (!listData || listData.length === 0) return undefined
    let categories = []
    let modalEVMData = []
    let plannedValues = ['Planned Value'],
      actualCosts = ['Actual Cost'],
      earnedValues = ['Earned Value']
    const tableData = listData.map((listItem) => {
      // console.log('listItem', listItem)
      const data = {
        task: listItem,
        progress: listItem.progress,
        projectDetail
      }
      const resultCalculate = AutomaticTaskPointCalculator.calcTaskEVMPoint(data)
      return {
        ...listItem,
        ...resultCalculate
      }
    })
    // console.log('tableData', tableData)
    let earliestStart = tableData[0].startDate
    let latestEnd = tableData[0].endDate
    for (let tableItem of tableData) {
      if (moment(tableItem.startDate).isBefore(moment(earliestStart))) {
        earliestStart = tableItem.startDate
      }
      if (moment(tableItem.endDate).isAfter(moment(latestEnd))) {
        latestEnd = tableItem.endDate
      }
    }
    const diffInDuration = moment(latestEnd).diff(moment(earliestStart), timeMode)
    if (diffInDuration > 1) {
      let currentCounterMoment = earliestStart
      // Tính toán các thông số theo từng khoảng timemode một
      for (let i = 0; i < diffInDuration; i++) {
        const startOfCurrentMoment = moment(currentCounterMoment).startOf(timeMode.substring(0, timeMode.length - 1))
        const endOfCurrentMoment = moment(currentCounterMoment).endOf(timeMode.substring(0, timeMode.length - 1))
        // Tập hợp các task của khoảng timemode đó và tính toán các thông số
        let totalPVEachMoment = 0,
          totalACEachMoment = 0,
          totalEVEachMoment = 0
        let listTasksEachMoment = []
        for (let tableItem of tableData) {
          if (
            moment(tableItem.endDate).isSameOrAfter(startOfCurrentMoment) &&
            moment(tableItem.endDate).isSameOrBefore(endOfCurrentMoment)
          ) {
            // console.log(tableItem.name, tableItem.plannedValue, tableItem.actualCost, tableItem.earnedValue)
            totalPVEachMoment += tableItem.plannedValue === Infinity ? 0 : tableItem.plannedValue
            totalACEachMoment += tableItem.actualCost
            totalEVEachMoment += tableItem.earnedValue
            listTasksEachMoment.push(tableItem)
          }
        }
        plannedValues.push(totalPVEachMoment)
        actualCosts.push(totalACEachMoment)
        earnedValues.push(totalEVEachMoment)
        const currentCategoryTitle =
          timeMode === 'weeks'
            ? `Tuần ${Math.ceil(moment(currentCounterMoment).date() / 7)} T${moment(currentCounterMoment).format('M-YYYY')}`
            : `T${moment(currentCounterMoment).format('M-YYYY')}`
        // Push vào categories để làm thành trục Oy
        categories.push(currentCategoryTitle)
        // Sau mỗi lần lặp thì tăng currentCounterMoment thêm 1 đơn vị nhỏ nhất của timeMode
        currentCounterMoment = moment(currentCounterMoment).add(1, timeMode).format()
        // Push vào modalEVMData để show bên modal details
        modalEVMData.push({
          category: currentCategoryTitle,
          listTasksEachMoment,
          startOfCurrentMoment,
          endOfCurrentMoment,
          totalPVEachMoment,
          totalACEachMoment,
          totalEVEachMoment
        })
      }
      return {
        graphData: [plannedValues, actualCosts, earnedValues],
        modalEVMData,
        categories
      }
    }
    return undefined
  }

  const handleProcessTableData = (listData, listDataForEvalMonth) => {
    if (!listData || listData.length === 0 || !listDataForEvalMonth || listDataForEvalMonth.length === 0) return []
    // Lấy data từ listTasksEval cho tableData
    const tableTimeModeData = listDataForEvalMonth.map((listItem) => {
      const data = {
        task: listItem,
        progress: listItem.progress,
        projectDetail
      }
      const resultCalculate = AutomaticTaskPointCalculator.calcTaskEVMPoint(data)
      return {
        ...listItem,
        ...resultCalculate
      }
    })
    return tableTimeModeData
  }

  const processedTableData = handleProcessTableData(currentTasks, listTasksEval)

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
        columns: currentGraphData.graphData,
        type: 'line'
      },
      axis: {
        x: {
          type: 'category',
          categories: currentGraphData.categories
        },
        y: {
          tick: {
            format: (d) => {
              return `${numberWithCommas(d)} VND`
            }
          }
        }
      },
      zoom: {
        enabled: true
      },
      tooltip: {
        format: {
          value: (value, ratio, id) => {
            return numberWithCommas(value)
          }
        }
      }
    })
  }

  useEffect(() => {
    if (currentGraphData) {
      renderChart()
    }
  })

  useEffect(() => {
    if (currentTasks) {
      // Lấy graph tasks data theo tuần
      const graphDataWeeks = getGraphTasksDataOfTimeMode(currentTasks, 'weeks')
      // Lấy graph tasks data theo tháng
      const graphDataMonths = getGraphTasksDataOfTimeMode(currentTasks, 'months')
      setCurrentTimeMode(graphDataMonths ? 'months' : 'weeks')
      setCurrentGraphData(graphDataMonths || graphDataWeeks)
    }
  }, [currentTasks])

  const showModalDetails = () => {
    setTimeout(() => {
      window.$(`#modal-evm-${projectDetailId}`).modal('show')
    }, 10)
  }

  useEffect(() => {
    console.log('currentTimeMode', currentTimeMode)
  }, [currentTimeMode])

  // console.log('currentTasks', currentTasks)
  return (
    <React.Fragment>
      <div className='box-body qlcv'>
        {currentGraphData && (
          <ModalEVMData projectDetailId={projectDetailId} projectDetail={projectDetail} evmData={currentGraphData.modalEVMData} />
        )}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div className='col-md-8 col-xs-8 col-ms-8' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <h4>
              <strong>Biểu đồ trực quan EVM</strong>
            </h4>
            <div className='col-md-3 col-xs-3 col-ms-3'>
              <SelectBox
                id={`tab-eval-phase-time-mode`}
                className='form-control select2'
                value={currentTimeMode}
                items={currentTimeModeArr}
                onChange={(e) => {
                  setCurrentTimeMode(e[0])
                  setCurrentGraphData(getGraphTasksDataOfTimeMode(currentTasks, e[0]))
                }}
                multiple={false}
              />
            </div>
          </div>

          <button className='btn-link' onClick={showModalDetails}>
            Xem chi tiết
          </button>
        </div>
        {currentGraphData ? (
          <div ref={chartRef} />
        ) : (
          `Không thể biểu diễn biểu đồ dưới dạng ${currentTimeModeArr.find((item) => item.value === currentTimeMode)?.text}`
        )}
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabEvalPhase))
