import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3'
import 'c3/c3.css'

const BiddingStatusQuantityStatistic = (props) => {
  const { biddingPackagesManager, biddingContract, project } = props
  const refBiddingStatusByQuantity = React.createRef()

  const numofBP = biddingPackagesManager.totalList
  const numOfContract = biddingContract.totalList
  const numOfPrj = biddingContract.listBiddingContractStatistic.filter((x) => x.project !== null)?.length ?? project.data.totalDocs

  const setDataChart = () => {
    let bidColumns, categories

    categories = ['Hoạt động', 'Ngưng hoạt động', 'Đang chờ kết quả dự thầu', 'Đang thực hiện', 'Hoàn thành']
    bidColumns = []
    // 1: hoạt động, 0: ngưng hoạt động, 2: đang chờ kết quả dự thầu, 3: Đang thực hiện gói thầu, 4:hoàn thành
    const numberOfActive = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 1)?.length
    const numberOfInactive = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 0)?.length
    const numberOfWaitForBidding = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 2)?.length
    const numberOfInProcess = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 3)?.length
    const numberOfComplete = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 4)?.length

    // bidColumns = ["Số lượng gói thầu theo trạng thái", numberOfActive, numberOfInactive, numberOfWaitForBidding, numberOfInProcess, numberOfComplete];

    bidColumns = [
      ['Hoạt động', numberOfActive],
      ['Đang chờ kết quả dự thầu', numberOfWaitForBidding],
      ['Đang thực hiện', numberOfInProcess],
      ['Ngưng hoạt động', numberOfInactive],
      ['Hoàn thành', numberOfComplete]
    ]

    return {
      dataChart: bidColumns,
      categories: categories
    }
  }

  const removePreviousChart = () => {
    const chart = refBiddingStatusByQuantity.current

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
      bindto: refBiddingStatusByQuantity.current,
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
            return value
          }
        }
      }
    })
  }

  useEffect(() => {
    renderChart()
  }, [JSON.stringify(biddingPackagesManager)])

  return (
    <div className='box'>
      <div className='box-header with-border'>
        <div className='box-title'>Thống kê trạng thái gói thầu</div>
      </div>
      <div className='box-body'>
        <section ref={refBiddingStatusByQuantity}></section>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(BiddingStatusQuantityStatistic))
export { connectedComponent as BiddingStatusQuantityStatistic }
