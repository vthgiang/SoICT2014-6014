import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';

import {AssetDisposalChart} from './assetDisposalChart';
import { AssetManagerActions } from '../../../asset-information/redux/actions';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { AssetTypeService } from '../../../asset-type/redux/services';
import Swal from 'sweetalert2';
import { AssetPurchaseChart } from './assetPurchaseChart';

class PurchaseAndDisposal extends Component {

    constructor(props) {
        super(props);

        this.EXPORT_DATA = {
            purchaseData: null,
            disposalData: null
        }

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
        this.props.getAllAssetPurchase()
        this.props.getAllAssetDisposal()
        AssetTypeService.getAssetTypes().then(res => {
            if (res.data.success) {
                this.setState({ assetType: res.data.content.list })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    getPurchaseData = (purchaseData) => {
        this.EXPORT_DATA.purchaseData = purchaseData;

        this.props.setPurchaseAndDisposalExportData(this.EXPORT_DATA.purchaseData, this.EXPORT_DATA.disposalData)
    }

    getDisposalData = (disposalData) => {
        this.EXPORT_DATA.disposalData = disposalData;

        this.props.setPurchaseAndDisposalExportData(this.EXPORT_DATA.purchaseData, this.EXPORT_DATA.disposalData)
    }

    showDetailAssetDisposal = () => {
        Swal.fire({
            icon: "question",
            html: `<h3 style="color: red"><div>Biểu đồ thống kê thanh lý tài sản được xây dựng cần đầy đủ 2 điều kiện:</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <ul>
               <li>Tài sản phải chuyển trạng thái về : <b>Đã thanh lý</b></li>
                <li>Tài sản phải có đầy đủ thông tin thanh lý</li>
            </ul>`,
            width: "50%",
        })
    }

    render() {
        const { translate ,purchaseAsset} = this.props;
        const { listAssets, assetType } = this.state;
        console.log("purchaseAsset",purchaseAsset)
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
                                    <AssetPurchaseChart
                                        assetType={assetType}
                                        listAssets={listAssets}
                                        getPurchaseData={this.getPurchaseData}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ thanh lý tài sản */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div style={{ marginRight: '5px' }} className="box-title">{translate('asset.dashboard.disposal_asset')}</div>
                                    <a className="text-red" title={'Giải thích'} onClick={this.showDetailAssetDisposal}>
                                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', color: '#dd4b39' }} />
                                    </a>
                                </div>
                                <div className="box-body qlcv">
                                    <AssetDisposalChart
                                        assetType={assetType}
                                        listAssets={listAssets}
                                        getDisposalData={this.getDisposalData}
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
    const { listAssets,purchaseAsset } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType ,purchaseAsset};
}
const mapDispatchToProps = {
    getAllAssetPurchase : AssetManagerActions.getAllAssetPurchase,
    getAllAssetDisposal : AssetManagerActions.getAllAssetDisposal
}
const PurchaseAndDisposalConnect = connect(mapState,mapDispatchToProps)(withTranslate(PurchaseAndDisposal));
export { PurchaseAndDisposalConnect as PurchaseAndDisposal };