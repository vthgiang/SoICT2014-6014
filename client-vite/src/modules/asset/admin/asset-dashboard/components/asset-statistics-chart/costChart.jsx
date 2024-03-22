import React, { Component } from 'react'
import { connect } from 'react-redux'

import c3 from 'c3'
import 'c3/c3.css'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { TreeSelect } from '../../../../../../common-components'

class CostChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: []
    }
  }

  // Thiết lập dữ liệu biểu đồ
  setDataPieChart = () => {
    const { listAssets, getAssetCostData, chartAsset, statisticAsset } = this.props
    const { type } = this.state

    let filterAsset = {
        typeName: [],
        lessThanOneHundred: [],
        oneHundred: [],
        twoHundred: [],
        fiveHundred: [],
        oneBillion: [],
        twoBillion: [],
        fiveBillion: [],
        tenBillion: [],
        idAssetTypes: []
      },
      dataPieChart,
      lessThanOneHundreds = 0,
      oneHundreds = 0,
      twoHundreds = 0,
      fiveHundreds = 0,
      oneBillions = 0,
      twoBillions = 0,
      fiveBillions = 0,
      tenBillions = 0
    if (statisticAsset) {
      let assetList = statisticAsset.costOfAssets
      console.log('assetList', assetList)
      if (type && type.length) {
        type.map((i) => {
          let index = assetList.idAssetTypes?.indexOf(i)
          filterAsset.lessThanOneHundred.push(assetList.lessThanOneHundred[index])
          filterAsset.oneHundred.push(assetList.oneHundred[index])
          filterAsset.twoHundred.push(assetList.twoHundred[index])
          filterAsset.fiveHundred.push(assetList.fiveHundred[index])
          filterAsset.oneBillion.push(assetList.oneBillion[index])
          filterAsset.twoBillion.push(assetList.twoBillion[index])
          filterAsset.fiveBillion.push(assetList.fiveBillion[index])
          filterAsset.tenBillion.push(assetList.tenBillion[index])
        })
      } else {
        filterAsset = assetList
      }

      for (let i in filterAsset.lessThanOneHundred) {
        lessThanOneHundreds += filterAsset.lessThanOneHundred[i]
      }
      for (let i in filterAsset.oneHundred) {
        oneHundreds += filterAsset.oneHundred[i]
      }
      for (let i in filterAsset.twoHundred) {
        twoHundreds += filterAsset.twoHundred[i]
      }
      for (let i in filterAsset.fiveHundred) {
        fiveHundreds += filterAsset.fiveHundred[i]
      }
      for (let i in filterAsset.oneBillion) {
        oneBillions += filterAsset.oneBillion[i]
      }
      for (let i in filterAsset.twoBillion) {
        twoBillions += filterAsset.twoBillion[i]
      }
      for (let i in filterAsset.fiveBillion) {
        fiveBillions += filterAsset.fiveBillion[i]
      }
      for (let i in filterAsset.tenBillion) {
        tenBillions += filterAsset.tenBillion[i]
      }
    }

    dataPieChart = [
      ['< 100M', lessThanOneHundreds],
      ['100M - 200M', oneHundreds],
      ['200M - 500M', twoHundreds],
      ['500M - 1B', fiveHundreds],
      ['1B - 2B', oneBillions],
      ['2B - 5B', twoBillions],
      ['5B - 10B', fiveBillions],
      ['> 10B', tenBillions]
    ]

    if (getAssetCostData && listAssets) {
      getAssetCostData(dataPieChart, type)
    }

    return dataPieChart
  }

  // Khởi tạo PieChart bằng C3
  pieChart = () => {
    let dataPieChart = this.setDataPieChart()

    this.chart = c3.generate({
      bindto: '#assetCost',

      data: {
        columns: dataPieChart,
        type: 'donut'
      },
      pie: {
        label: {
          format: function (value, ratio, id) {
            return value
          }
        }
      },
      padding: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      },
      tooltip: {
        format: {
          title: function (d) {
            return d
          },
          value: function (value, ratio, id) {
            return value
          }
        }
      },
      legend: {
        show: true
      }
    })
  }

  getAssetTypes = () => {
    let { assetType } = this.props
    // let assetTypeName = assetType && assetType.listAssetTypes;
    let typeArr = []
    assetType &&
      assetType.map((item) => {
        typeArr.push({
          _id: item._id,
          id: item._id,
          name: item.typeName,
          parent: item.parent ? item.parent._id : null
        })
      })

    return typeArr
  }

  handleChangeTypeAsset = (value) => {
    if (value.length === 0) {
      value = []
    }

    this.setState({
      ...this.state,
      type: value
    })
  }

  render() {
    const { translate } = this.props
    const { type } = this.state
    let typeArr = this.getAssetTypes()

    this.pieChart()

    return (
      <React.Fragment>
        <div className='form-group' style={{ width: '100%' }}>
          <label style={{ minWidth: 'fit-content', marginRight: '10px' }}>{translate('asset.general_information.asset_type')}</label>
          <TreeSelect data={typeArr} value={type} handleChange={this.handleChangeTypeAsset} mode='hierarchical' />
        </div>
        <div className='box-body qlcv' id='assetCostChart'>
          <section id='assetCost'></section>
        </div>
      </React.Fragment>
    )
  }
}

const AmountOfAssetChartConnected = connect(null, null)(withTranslate(CostChart))

export { AmountOfAssetChartConnected as CostChart }
