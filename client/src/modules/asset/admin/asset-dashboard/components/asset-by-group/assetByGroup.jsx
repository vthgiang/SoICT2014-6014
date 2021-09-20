import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';
import { AssetTypeService } from '../../../asset-type/redux/services';

import AmountPieChart from './amountPieChart';
import ValuePieChart from './valuePieChart';
import DepreciationPieChart from './depreciationPieChart';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import _isEqual from 'lodash/isEqual';
import StatisticalAssetByGroup from './statisticalAssetByGroup';
import { AssetManagerActions } from '../../../asset-information/redux/actions';

class AssetByGroup extends Component {

    constructor(props) {
        super(props);

        this.EXPORT_DATA = {
            amountOfAsset: null,
            depreciationOfAsset: null,
            valueOfAsset: null
        }

        this.state = {
            listAssets: [],
            amountOfAsset: [],
            depreciationOfAsset: [],
            valueOfAsset: [],
            
        }
    }

    componentDidMount() {
        AssetService.getAll({
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 0
        }).then(res => {
            if (res.data.success) {
                this.setState({ listAssets: res.data.content.data });
            }
        }).catch(err => {
            console.log(err);
        });
        
        this.props.getAllAssetGroup()
        console.log("props",this.props)
        AssetTypeService.getAssetTypes().then(res => {
            if (res.data.success) {
                this.setState({ assetType: res.data.content.tree })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    setAmountOfAsset = (value) => {
        let { amountOfAsset } = this.state;
        this.EXPORT_DATA.amountOfAsset = value;
        this.props.setAssetByGroupExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)

        if (!_isEqual(amountOfAsset, value)) {
            this.setState(state => {
                return {
                    ...state,
                    amountOfAsset: value,
                }
            })
        }
    }

    setDepreciationOfAsset = (value) => {
        let { depreciationOfAsset } = this.state;
        this.EXPORT_DATA.depreciationOfAsset = value;
        this.props.setAssetByGroupExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)

        if (!_isEqual(depreciationOfAsset, value)) {
            this.setState(state => {
                return {
                    ...state,
                    depreciationOfAsset: value,
                }
            })
        }
    }

    setValueOfAsset = (value) => {
        let { valueOfAsset } = this.state;
        this.EXPORT_DATA.valueOfAsset = value;
        this.props.setAssetByGroupExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)

        if (!_isEqual(valueOfAsset, value)) {
            this.setState(state => {
                return {
                    ...state,
                    valueOfAsset: value,
                }
            })
        }
    }

    render() {
        const { translate ,chartAsset} = this.props;
        const { listAssets, assetType, amountOfAsset, valueOfAsset, depreciationOfAsset } = this.state;
        console.log("chartAsset",chartAsset)
        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">
                        <div className="col-md-12">
                            {
                                (amountOfAsset.length > 0 || valueOfAsset.length > 0 || depreciationOfAsset.length > 0) &&
                                <StatisticalAssetByGroup
                                    amountOfAsset={amountOfAsset}
                                    valueOfAsset={valueOfAsset}
                                    depreciationOfAsset={depreciationOfAsset}
                                />
                            }
                        </div>
                    </div>
                    <div className="row">
                        {/* Biểu đồ số lượng tài sản */}
                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.amount_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <AmountPieChart
                                        listAssets={listAssets}
                                        setAmountOfAsset={this.setAmountOfAsset}
                                        chartAsset={this.props.chartAsset.numberAsset}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ giá trị */}
                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.value_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <ValuePieChart
                                        listAssets={listAssets}
                                        assetType={assetType}
                                        setValueOfAsset={this.setValueOfAsset}
                                        chartAsset={this.props.chartAsset.valueAsset}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        {/* Biểu đồ khấu hao */}
                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.depreciation_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <DepreciationPieChart
                                        listAssets={listAssets}
                                        assetType={assetType}
                                        setDepreciationOfAsset={this.setDepreciationOfAsset}
                                        chartAsset={this.props.chartAsset.depreciationAssets}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}
function mapState(state) {
    const { listAssets,chartAsset } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType,chartAsset };
}
const mapDispatchToProps = {
    getAllAssetGroup: AssetManagerActions.getAllAssetGroup
}
const AssetByGroupConnect = connect(mapState,mapDispatchToProps)(withTranslate(AssetByGroup));
export { AssetByGroupConnect as AssetByGroup };