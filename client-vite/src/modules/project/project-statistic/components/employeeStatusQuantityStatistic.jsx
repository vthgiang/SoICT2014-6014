import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3'
import 'c3/c3.css'

const EmployeeStatusQuantityStatistic = (props) => {
  const { biddingPackagesManager, biddingContract, project } = props
  const refEmployeeStatusQuantity = React.createRef()

  const numofBP = biddingPackagesManager.totalList
  const numOfContract = biddingContract.totalList
  const numOfPrj = biddingContract.listBiddingContractStatistic.filter((x) => x.project !== null)?.length ?? project.data.totalDocs

  const setDataChart = () => {
    let employeeColumns, categories

    categories = ['Rảnh rỗi', 'Đang thực hiện công việc']
    employeeColumns = []
    const { employeeQuantityStatistic } = props
    const {
      numberOfReadyToAssign,
      numberOfIsWorking
    } = employeeQuantityStatistic

   
    employeeColumns = [
      ['Rảnh rỗi', numberOfReadyToAssign],
      ['Đang thực hiện công việc', numberOfIsWorking],
    ]

    return {
      dataChart: employeeColumns,
      categories: categories
    }
  }

  const removePreviousChart = () => {
    const chart = refEmployeeStatusQuantity.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const renderChart = () => {
    removePreviousChart()
    const { translate } = props

    let { dataChart, categories } = setDataChart()
    // let catColor = ['#2ca02c', '#d62728', '#f57b0f', '#bab104', '#1f77b4']

    let chart = c3.generate({
      bindto: refEmployeeStatusQuantity.current,
      data: {
        // Dữ liệu biểu đồ
        columns: dataChart,
        type: 'pie'
      },
      // color: {
      //     pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
      // },

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
            const percentage = (ratio * 100).toFixed(2) + '%';
            return value + ' (' + percentage + ')';
          }
        }
      }
    })
  }

  useEffect(() => {
    renderChart()
  }, [])

  return (
    <div className='box'>
      <div className='box-header with-border'>
        <div className='box-title'>Thống kê trạng thái nhân viên</div>
      </div>
      <div className='box-body'>
        <section ref={refEmployeeStatusQuantity}></section>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(EmployeeStatusQuantityStatistic))
export { connectedComponent as EmployeeStatusQuantityStatistic }
