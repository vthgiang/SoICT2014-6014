import React, { Component } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

import { AssetService } from '../../../asset-information/redux/services'

import { StautsChart } from './stautsChart'
import { CostChart } from './costChart'
import { AssetTypeService } from '../../../asset-type/redux/services'
import { AssetManagerActions } from '../../../asset-information/redux/actions'

class AssetStatistics extends Component {
  constructor(props) {
    super(props)

    this.EXPORT_DATA = {
      assetStatusData: null,
      assetCostData: null
    }
    this.state = {
      listAssets: null
    }
  }

  componentDidMount() {
    AssetService.getAll({
      assetName: '',
      assetType: null,
      month: null,
      status: '',
      page: 0,
      limit: 0
    })
      .then((res) => {
        if (res.data.success) {
          this.setState({ listAssets: res.data.content.data })
        }
      })
      .catch((err) => {
        console.log(err)
      })
    this.props.getAllAssetGroup()
    this.props.getAllAssetStatistic()
    console.log('props', this.props)
    AssetTypeService.getAssetTypes()
      .then((res) => {
        if (res.data.success) {
          this.setState({ assetType: res.data.content.list })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getAssetTypeParentName = (listAssetTypeId, ListAssetType) => {
    const { translate } = this.props
    let newArr = []
    if (listAssetTypeId && listAssetTypeId.length === 0) {
      ListAssetType.forEach(() => {
        newArr = [`${translate('asset.general_information.choose_all')}`]
      })
    } else {
      ListAssetType.forEach((x) => {
        listAssetTypeId.forEach((y) => {
          if (x._id === y) newArr = [...newArr, x.typeName]
        })
      })
    }
    return newArr
  }

  getAssetStatusData = (assetStatusData, assetTypeStatusChart) => {
    const { assetType } = this.state
    let assetTypeName
    if (assetType && assetType.length > 0) {
      // export thêm loại tài sản, khi không search theo loại tài sản thì mặc định lấy tất
      assetTypeName = this.getAssetTypeParentName(assetTypeStatusChart, assetType)

      let newAssetTypeStatusChart = []
      assetStatusData.forEach((x) => {
        newAssetTypeStatusChart = [...newAssetTypeStatusChart, [...x, assetTypeName]]
      })

      this.EXPORT_DATA.assetStatusData = newAssetTypeStatusChart

      this.props.setAssetStatisticsExportData(this.EXPORT_DATA.assetStatusData, this.EXPORT_DATA.assetCostData)
    }
  }

  getAssetCostData = (assetCostData, assetTypeCostData) => {
    const { assetType } = this.state
    let assetTypeName

    if (assetType && assetType.length > 0) {
      // export thêm loại tài sản, khi không search theo loại tài sản thì mặc định lấy tất
      assetTypeName = this.getAssetTypeParentName(assetTypeCostData, assetType)

      let newAssetTypeCostChart = []
      assetCostData.forEach((x) => {
        newAssetTypeCostChart = [...newAssetTypeCostChart, [...x, assetTypeName]]
      })

      this.EXPORT_DATA.assetCostData = newAssetTypeCostChart

      this.props.setAssetStatisticsExportData(this.EXPORT_DATA.assetStatusData, this.EXPORT_DATA.assetCostData)
    }
  }

  render() {
    const { translate, chartAsset, statisticAsset } = this.props
    const { listAssets, assetType } = this.state
    console.log('statisticAsset', statisticAsset)
    return (
      <React.Fragment>
        <div className='qlcv'>
          <div className='row'>
            {/* Biểu thống kê tài sản theo trạng thái */}
            <div className='col-6 col-xs-6'>
              <div className='box box-solid'>
                <div className='box-header'>
                  <div className='box-title'>{translate('asset.dashboard.status_chart')}</div>
                </div>
                <div className='box-body qlcv'>
                  <StautsChart
                    assetType={assetType}
                    listAssets={listAssets}
                    getAssetStatusData={this.getAssetStatusData}
                    statisticAsset={this.props.statisticAsset.dataStatusOfAsset}
                  />
                </div>
              </div>
            </div>

            {/* Biểu thống kê tài sản theo giá trị */}
            <div className='col-6 col-xs-6'>
              <div className='box box-solid'>
                <div className='box-header'>
                  <div className='box-title'>{translate('asset.dashboard.cost_chart')}</div>
                </div>
                <div className='box-body qlcv'>
                  <CostChart
                    assetType={assetType}
                    listAssets={listAssets}
                    getAssetCostData={this.getAssetCostData}
                    statisticAsset={this.props.statisticAsset.dataCostOfAsset}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapState(state) {
  const { assetType } = state
  const { chartAsset, statisticAsset } = state.assetsManager
  return { assetType, chartAsset, statisticAsset }
}
const mapDispatchToProps = {
  getAllAssetGroup: AssetManagerActions.getAllAssetGroup,
  getAllAssetStatistic: AssetManagerActions.getAllAssetStatistic
}
const AssetStatisticsConnect = connect(mapState, mapDispatchToProps)(withTranslate(AssetStatistics))
export { AssetStatisticsConnect as AssetStatistics }
