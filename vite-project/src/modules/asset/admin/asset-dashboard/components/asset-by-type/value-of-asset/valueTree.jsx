import React, { Component } from 'react'

import ValueBarChart from './valueBarChart'

import * as d3 from 'd3-format'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { Tree } from '../../../../../../../common-components'

class ValueTree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tree: false,
      crrValue: false
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

  handleChangeViewCurrentValue = () => {
    this.setState({
      ...this.state,
      crrValue: !this.state.crrValue
    })
  }

  render() {
    const { assetType, listAssets, translate, setValueOfAsset, depreciationOfAsset, listAssetsAmount } = this.props
    const { tree, crrValue } = this.state
    let typeName = [],
      currentValue = []

    let chart = []
    if (listAssetsAmount) {
      if (crrValue) {
        if (depreciationOfAsset && depreciationOfAsset.length > 0) {
          currentValue = listAssetsAmount.countAssetValue.map((o, i) => o - depreciationOfAsset[i])
        }
      }

      for (let i in listAssetsAmount.listType) {
        let val
        if (crrValue) {
          val = d3.format(',')(currentValue[i])
        } else {
          val = d3.format(',')(listAssetsAmount.countAssetValue[i])
        }

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
      <div className='value-asset' id='value-asset'>
        {/* Chọn loại biểu đồ */}
        <div className='box-tools' style={{ marginBottom: '15px' }}>
          <div className='btn-group value-asset-option'>
            <button
              type='button'
              className={`btn btn-xs ${crrValue ? 'active' : 'btn-danger'}`}
              onClick={() => this.handleChangeViewCurrentValue()}
            >
              Nguyên giá
            </button>
            <button
              type='button'
              className={`btn btn-xs ${crrValue ? 'btn-danger' : 'active'}`}
              onClick={() => this.handleChangeViewCurrentValue()}
            >
              Giá trị hiện tại
            </button>
          </div>
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
            {/* Cây giá trị tài sản */}
            <Tree id={`tree-qlcv-value-asset-${crrValue}`} data={dataTree} plugins={false} />
          </div>
        ) : (
          <ValueBarChart
            listAssetsAmount={listAssetsAmount}
            setValueOfAsset={setValueOfAsset}
            depreciationOfAsset={depreciationOfAsset}
            crrValue={crrValue}
          />
        )}
      </div>
    )
  }
}

export default withTranslate(ValueTree)
