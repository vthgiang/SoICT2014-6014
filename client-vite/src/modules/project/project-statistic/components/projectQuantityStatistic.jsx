import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3'
import 'c3/c3.css'

const ProjectStatusQuantityStatistic = (props) => {
  const { biddingPackagesManager, biddingContract, project } = props
  const refProjectStatusQuantity = React.createRef()

  const numofBP = biddingPackagesManager.totalList
  const numOfContract = biddingContract.totalList
  const numOfPrj = biddingContract.listBiddingContractStatistic.filter((x) => x.project !== null)?.length ?? project.data.totalDocs

  const setDataChart = () => {
    let projectColumns, categories

    categories = ['Đang thực hiện', 'Chờ phê duyệt', 'Kết thúc', 'Tạm hoãn', 'Bị hủy']
    projectColumns = []
    // 1: hoạt động, 0: ngưng hoạt động, 2: đang chờ kết quả dự thầu, 3: Đang thực hiện gói thầu, 4:hoàn thành
    // const numberOfInProcess = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 1)?.length
    // const numberOfDelayed = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 0)?.length
    // const numberOfWaitForApproval = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 2)?.length
    // const numberOfInProcess = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 3)?.length
    // const numberOfCanceled = biddingPackagesManager?.listBiddingPackages.filter((x) => x.status === 4)?.length

    const numberOfInProcess = 3
    const numberOfDelayed = 0
    const numberOfWaitForApproval = 2
    const numberOfFinished = 3
    const numberOfCanceled = 0

    // projectColumns = ["Số lượng gói thầu theo trạng thái", numberOfInProcess, numberOfDelayed, numberOfWaitForApproval, numberOfInProcess, numberOfCanceled];

    projectColumns = [
      ['Đang thực hiện', numberOfInProcess],
      ['Chờ phê duyệt', numberOfWaitForApproval],
      ['Kết thúc', numberOfFinished],
      ['Tạm hoãn', numberOfDelayed],
      ['Bị hủy', numberOfCanceled]
      // ['Hồ sơ đề xuất', numberOfCanceled]
    ]

    return {
      dataChart: projectColumns,
      categories: categories
    }
  }

  const removePreviousChart = () => {
    const chart = refProjectStatusQuantity.current

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
      bindto: refProjectStatusQuantity.current,
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

      // padding: {
      //     top: 20,
      //     bottom: 20,
      //     right: 20
      // },

      // data: {
      //     columns: dataChart,
      //     type: "bar",
      //     labels: true,
      //     color: function (color, d) {
      //         return catColor[d.x];
      //     }
      // },
      // bar: {
      //     width: {
      //         ratio: 0.2
      //     }
      // },

      // axis: {
      //     x: {
      //         type: 'categories',
      //         categories: categories,
      //         label: "Trạng thái"
      //     },
      //     y: {
      //         label: "Số lượng gói thầu",
      //     },
      // },

      // zoom: {
      //     enabled: false
      // }
    })
  }

  useEffect(() => {
    renderChart()
  }, [])

  return (
    <div className='box'>
      <div className='box-header with-border'>
        <div className='box-title'>Thống kê trạng thái dự án</div>
      </div>
      <div className='box-body'>
        <section ref={refProjectStatusQuantity}></section>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectStatusQuantityStatistic))
export { connectedComponent as ProjectStatusQuantityStatistic }
