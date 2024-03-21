import React, { Component } from 'react'

import * as d3 from 'd3-format'

import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { Tree } from '../../../../../../../common-components'
import DepreciationBarChart from './depreciationBarChart'

class DepreciationTree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tree: false
    }
  }

  calculateDepreciation = (
    depreciationType,
    cost,
    usefulLife,
    estimatedTotalProduction,
    unitsProducedDuringTheYears,
    startDepreciation
  ) => {
    let annualDepreciation = 0,
      monthlyDepreciation = 0,
      remainingValue = cost

    if (depreciationType === 'straight_line') {
      // Phương pháp khấu hao theo đường thẳng
      annualDepreciation = (12 * cost) / usefulLife
      monthlyDepreciation = cost / usefulLife
      remainingValue =
        cost -
        (cost / usefulLife) *
          (new Date().getFullYear() * 12 +
            new Date().getMonth() -
            (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()))
    } else if (depreciationType === 'declining_balance') {
      // Phương pháp khấu hao theo số dư giảm dần
      let lastYears = false,
        t,
        usefulYear = usefulLife / 12,
        usedTime =
          new Date().getFullYear() * 12 +
          new Date().getMonth() -
          (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth())

      if (usefulYear < 4) {
        t = (1 / usefulYear) * 1.5
      } else if (usefulYear >= 4 && usefulYear <= 6) {
        t = (1 / usefulYear) * 2
      } else if (usefulYear > 6) {
        t = (1 / usefulYear) * 2.5
      }

      // Tính khấu hao đến năm hiện tại
      for (let i = 1; i <= usedTime / 12; i++) {
        if (!lastYears) {
          if (remainingValue * t > remainingValue / (usefulYear - i + 1)) {
            annualDepreciation = remainingValue * t
          } else {
            annualDepreciation = remainingValue / (usefulYear - i + 1)
            lastYears = true
          }
        }

        remainingValue = remainingValue - annualDepreciation
      }

      // Tính khấu hao đến tháng hiện tại
      if (usedTime % 12 !== 0) {
        if (!lastYears) {
          if (remainingValue * t > remainingValue / (usefulYear - Math.floor(usedTime / 12))) {
            annualDepreciation = remainingValue * t
          } else {
            annualDepreciation = remainingValue / (usefulYear - Math.floor(usedTime / 12))
            lastYears = true
          }
        }

        monthlyDepreciation = annualDepreciation / 12
        remainingValue = remainingValue - monthlyDepreciation * (usedTime % 12)
      }
    } else if (depreciationType === 'units_of_production') {
      // Phương pháp khấu hao theo sản lượng
      let monthTotal = unitsProducedDuringTheYears.length // Tổng số tháng tính khấu hao
      let productUnitDepreciation = cost / (estimatedTotalProduction * (usefulLife / 12)) // Mức khấu hao đơn vị sản phẩm
      let accumulatedDepreciation = 0 // Giá trị hao mòn lũy kế

      for (let i = 0; i < monthTotal; i++) {
        accumulatedDepreciation += unitsProducedDuringTheYears[i].unitsProducedDuringTheYear * productUnitDepreciation
      }

      remainingValue = cost - accumulatedDepreciation
      annualDepreciation = monthTotal ? (accumulatedDepreciation * 12) / monthTotal : 0
    }

    return parseInt(cost - remainingValue)
  }

  handleChangeViewChart = async (value) => {
    await this.setState((state) => {
      return {
        ...state,
        tree: value
      }
    })
  }

  render() {
    const { assetType, listAssets, translate, setDepreciationOfAsset, listAssetsAmount } = this.props
    const { tree } = this.state
    // let typeName = listAssetsAmount.typeName, countAssetDepreciation = listAssetsAmount.countAssetDepreciation, idAssetType = listAssetsAmount.idAssetType;

    let chart = []
    if (listAssetsAmount) {
      for (let i in listAssetsAmount.listType) {
        let val = d3.format(',')(listAssetsAmount.countAssetDepreciation[i])
        let title = `${listAssetsAmount.listType[i].typeName} - ${val} `

        chart.push({
          id: listAssetsAmount.listType[i]._id,
          typeName: title,
          parentId: listAssetsAmount.listType[i].parent
        })
      }
      if (listAssetsAmount.countAssetDepreciation.length > 0) this.props.getDepreciationOfAsset(listAssetsAmount.countAssetDepreciation)
    }

    let dataTree =
      chart &&
      chart.map((node) => {
        return {
          ...node,
          id: node.id,
          text: node.typeName,
          parent: node.parentId ? node.parentId.toString() : '#'
        }
      })

    return (
      <div className='depreciation-asset' id='depreciation-asset'>
        <br />
        <div className='box-tools pull-right'>
          <div className='btn-group pull-right'>
            <button
              type='button'
              className={`btn btn-xs ${tree ? 'active' : 'btn-danger'}`}
              onClick={() => this.handleChangeViewChart(false)}
            >
              {translate('asset.dashboard.bar_chart')}
            </button>
            <button
              type='button'
              className={`btn btn-xs ${tree ? 'btn-danger' : 'active'}`}
              onClick={() => this.handleChangeViewChart(true)}
            >
              {translate('asset.dashboard.tree')}
            </button>
          </div>
        </div>
        {tree ? (
          <div>
            <br />
            {/* Cây khấu hao tài sản */}
            <Tree id='tree-qlcv-depreciation-asset' data={dataTree} plugins={false} />
          </div>
        ) : (
          <DepreciationBarChart
            listAssetsAmount={listAssetsAmount}
            listAssets={listAssets}
            assetType={assetType}
            setDepreciationOfAsset={setDepreciationOfAsset}
          />
        )}
      </div>
    )
  }
}

export default withTranslate(DepreciationTree)
