import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';
import { AssetTypeService } from '../../../asset-type/redux/services';

import { AmountPieChart } from './amountPieChart';
import { ValuePieChart } from './valuePieChart';
import { DepreciationPieChart } from './depreciationPieChart';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';



class AssetByGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listAssets: [],
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

        AssetTypeService.getAssetTypes().then(res => {
            if (res.data.success) {
                this.setState({ assetType: res.data.content.tree })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const { translate } = this.props;
        const { listAssets, assetType } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
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
    const { listAssets } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType };
}

const AssetByGroupConnect = connect(mapState)(withTranslate(AssetByGroup));
export { AssetByGroupConnect as AssetByGroup };