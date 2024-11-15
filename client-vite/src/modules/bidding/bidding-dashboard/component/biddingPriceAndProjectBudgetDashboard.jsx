import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3'
import 'c3/c3.css'

const BiddingPriceAndProjectBudgetDashboard = (props) => {
  const { biddingPackagesManager, biddingContract, project } = props
  const refPriceBudget = React.createRef()

  const numofBP = biddingPackagesManager.totalList
  const numOfContract = biddingContract.totalList
  const numOfPrj = biddingContract.listBiddingContractStatistic.filter((x) => x.project !== null)?.length ?? project.data.totalDocs

  const setDataChart = () => {
    let bidColumns, projectColumns, categories

    bidColumns = ['Dự toán gói thầu']
    projectColumns = ['Ngân sách dự án']
    categories = []

    const listContract = biddingContract.listBiddingContractStatistic.filter(
      (x) => x.project !== null && x.biddingPackage !== null && x.biddingPackage?.status === 3
    )

    for (let ct of listContract) {
      if (ct.project?.budget) {
        categories.push(`${ct.biddingPackage?.name ?? ''}`)
        bidColumns.push(ct.biddingPackage?.price ?? 0)
        projectColumns.push(Math.round(ct.project?.budget) ?? 0)
      }
    }

    return {
      dataChart: [bidColumns, projectColumns],
      categories: categories
    }
  }

  const removePreviousChart = () => {
    const chart = refPriceBudget.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  // var cat_colors = ['#FF0000','#00FF00', '#0000FF']

  // var chart = c3.generate({
  //     data: {
  //         columns: [
  //             ['data1', 30, 20, 50],
  //         ],
  //         type: 'bar',
  //         color: function (color, d) {
  //             return cat_colors[d.x];

  //         }
  //     }
  // })

  const renderChart = () => {
    removePreviousChart()
    const { translate } = props

    let { dataChart, categories } = setDataChart()

    let chart = c3.generate({
      bindto: refPriceBudget.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      data: {
        columns: dataChart,
        type: 'bar',
        labels: true
      },
      bar: {
        width: {
          ratio: 0.2
        }
      },

      axis: {
        x: {
          type: 'categories',
          categories: categories,
          label: 'Tên gói thầu'
        },
        y: {
          label: 'VND'
        }
      },

      zoom: {
        enabled: true
      }
    })
  }

  useEffect(() => {
    renderChart()
  }, [JSON.stringify(biddingContract)])

  return (
    <div className='box'>
      <div className='box-header with-border'>
        <div className='box-title'>Tương quan giữa dự toán gói thầu và ngân sách dự án</div>
      </div>
      <div className='box-body'>
        <section ref={refPriceBudget}></section>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(BiddingPriceAndProjectBudgetDashboard))
export { connectedComponent as BiddingPriceAndProjectBudgetDashboard }
