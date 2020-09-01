import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';
import { AssetTypeService } from '../../../asset-type/redux/services';

import PurchaseColumnChart from './assetPurchaseChart';
import DisposalColumnChart from './assetDisposalChart';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';




class PurchaseAndDisposal extends Component {
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

        // AssetTypeService.getAssetTypes().then(res => {
        //     if (res.data.success) {
        //         this.setState({ assetType: res.data.content.tree })
        //     }
        // }).catch(err => {
        //     console.log(err);
        // });
    }

    render() {
        const { translate } = this.props;
        const { listAssets, assetType } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">

                        {/* Biểu đồ nhập tài sản */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.purchase_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    < PurchaseColumnChart
                                        listAssets={listAssets}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ thanh lý tài sản */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.disposal_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <DisposalColumnChart
                                        listAssets={listAssets}
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

const PurchaseAndDisposalConnect = connect(mapState)(withTranslate(PurchaseAndDisposal));
export { PurchaseAndDisposalConnect as PurchaseAndDisposal };