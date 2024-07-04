import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3'
import 'c3/c3.css'

const AssetStatusQuantityStatistic = (props) => {
  const { biddingPackagesManager, biddingContract, project } = props
  const refAssetStatusQuantity = React.createRef()

  const numofBP = biddingPackagesManager.totalList
  const numOfContract = biddingContract.totalList
  const numOfPrj = biddingContract.listBiddingContractStatistic.filter((x) => x.project !== null)?.length ?? project.data.totalDocs

  const setDataChart = () => {
    let assetColoumns, categories

    categories = ['Rảnh rỗi', 'Đang được sử dụng', 'Hỏng hóc', 'Mất', 'Thanh lý']
    assetColoumns = []

    const numberOfReadyToUse = 4
    const numberOfLost = 1
    const numberOfInUse = 5
    const numberOfBroken = 2
    const numberOfDisposed = 0

    assetColoumns = [
      ['Rảnh rỗi', numberOfReadyToUse],
      ['Đang được sử dụng', numberOfInUse],
      ['Hỏng hóc', numberOfBroken],
      ['Mất', numberOfLost],
      ['Thanh lý', numberOfDisposed]
    ]

    return {
      dataChart: assetColoumns,
      categories: categories
    }
  }

  const removePreviousChart = () => {
    const chart = refAssetStatusQuantity.current

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

    let chart = c3.generate({
      bindto: refAssetStatusQuantity.current,
      data: {
        columns: dataChart,
        type: 'pie'
      },
      padding: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      },
      tooltip: {
        format: {
          value: function (value, ratio, id) {
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
        <div className='box-title'>Thống kê trạng thái tài sản</div>
      </div>
      <div className='box-body'>
        <section ref={refAssetStatusQuantity}></section>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(AssetStatusQuantityStatistic))
export { connectedComponent as AssetStatusQuantityStatistic }
