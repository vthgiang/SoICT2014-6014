import React, { Component } from 'react'

import AmountBarChart from './amountBarChart'

import * as d3 from 'd3-format'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { Tree } from '../../../../../../../common-components'

class AmountTree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tree: false
    }
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
    const { translate, setAmountOfAsset, listAssetsAmount } = this.props
    const { tree } = this.state
    let typeName = []
    let chart = []
    if (listAssetsAmount) {
      for (let i in listAssetsAmount.listType) {
        let val = d3.format(',')(listAssetsAmount.countAssetType[i])
        let title = `${listAssetsAmount.listType[i].typeName} - ${val} `

        typeName.push(listAssetsAmount.listType[i].typeName)

        chart.push({
          id: listAssetsAmount.listType[i]._id,
          typeName: title,
          parentId: listAssetsAmount.listType[i].parent
        })
      }
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
      <div className='amout-asset' id='amout-asset'>
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
            {/* Cây số lượng tài sản */}
            <Tree id='tree-qlcv-amount-asset' data={dataTree} plugins={false} />
          </div>
        ) : (
          <AmountBarChart listAssetsAmount={listAssetsAmount} setAmountOfAsset={setAmountOfAsset} />
        )}
      </div>
    )
  }
}

export default withTranslate(AmountTree)
