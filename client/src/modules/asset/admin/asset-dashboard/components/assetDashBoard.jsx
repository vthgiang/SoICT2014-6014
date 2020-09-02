import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AssetService } from "../../asset-information/redux/services";
import { RecommendProcureService } from "../../../user/purchase-request/redux/services";
import { RecommendDistributeService } from "../../use-request/redux/services";

import { LazyLoadComponent, forceCheckOrVisible, ExportExcel } from '../../../../../common-components';

import { AssetByGroup } from './asset-by-group/assetByGroup';
import { AssetStatistics } from './asset-statistics-chart/index';
import { AssetIsExpired } from './asset-is-expired/assetIsExpired';
import { AssetByType } from './asset-by-type/assetByType';
import { translate } from 'react-redux-multilingual/lib/utils';
import { PurchaseAndDisposal } from './asset-purchase-disposal/purchaseAndDisposal';

class DashBoardAssets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listAssets: [],
            recommendProcure: [],
            recommendDistribute: [],

            currentTab: "assetByGroup"
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

        RecommendDistributeService.searchRecommendDistributes({
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 0,
        }).then(res => {
            if (res.data.success) {
                this.setState({ recommendDistribute: res.data.content.listRecommendDistributes });
            }
        }).catch(err => {
            console.log(err);
        });

        RecommendProcureService.searchRecommendProcures({
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 0,
        }).then(res => {
            if (res.data.success) {
                this.setState({ recommendProcure: res.data.content.listRecommendProcures });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    returnCountNumber = (array, status) => array.filter(item => item.status === status).length;

    handleNavTabs = (tab) => {
        this.setState(state => {
            return {
                ...state,
                currentTab: tab
            }
        })

        forceCheckOrVisible(true, false);
    }

    setAssetByGroupExportData = (amountOfAsset, depreciationOfAsset, valueOfAsset) => {
        let data, assetByGroup;

        if (valueOfAsset && valueOfAsset.length !== 0 && depreciationOfAsset && amountOfAsset) {
            data = valueOfAsset.map((item, index) => {
                return {
                    STT: index + 1,
                    name: valueOfAsset[index][0],
                    valueOfAsset: valueOfAsset[index][1],
                    depreciationOfAsset: depreciationOfAsset[index][1],
                    amountOfAsset: amountOfAsset[index][1]
                }
            })
        }
        
        assetByGroup = {
            fileName: "Thống kê các nhóm tài sản",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Thống kê các nhóm tài sản",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên nhóm" },
                                { key: "valueOfAsset", value: "Giá trị tài sản" },
                                { key: "depreciationOfAsset", value: "Giá trị khấu hao" },
                                { key: "amountOfAsset", value: "Số lượng" }
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }

        this.setState(state => {
            return {
                ...state,
                exportData: {
                    ...state.exportData,
                    assetByGroup: assetByGroup
                }
            }
        })
    }

    setAssetByTypeExportData = (amountOfAsset, depreciationOfAsset, valueOfAsset) => {
        let data, assetByType;

        if (valueOfAsset && valueOfAsset.type && valueOfAsset.count && valueOfAsset.type.length !== 0
            && depreciationOfAsset && depreciationOfAsset.count
            && amountOfAsset && amountOfAsset.count
        ) {
            data = valueOfAsset.type.map((item, index) => {
                return {
                    STT: index + 1,
                    name: valueOfAsset.type[index],
                    valueOfAsset: valueOfAsset.count[index],
                    depreciationOfAsset: depreciationOfAsset.count[index],
                    amountOfAsset: amountOfAsset.count[index]
                }
            })
        }
        
        assetByType = {
            fileName: "Thống kê các loại tài sản",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Thống kê các loại tài sản",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên loại" },
                                { key: "valueOfAsset", value: "Giá trị tài sản" },
                                { key: "depreciationOfAsset", value: "Giá trị hao mòn" },
                                { key: "amountOfAsset", value: "Số lượng" }
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }

        this.setState(state => {
            return {
                ...state,
                exportData: {
                    ...state.exportData,
                    assetByType: assetByType
                }
            }
        })
    }

    render() {
        const { translate } = this.props;
        const { listAssets, recommendProcure, recommendDistribute, exportData, currentTab } = this.state;
       
        console.log("6666", exportData)
        return (
            <div className="qlcv">
                <div className="row" style={{ marginTop: 10 }}>

                    {/* Tổng số tài sản */}
                    {/* <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Tổng số tài sản</span>
                                <span className="info-box-number">{listAssets.length ? listAssets.length : 0}</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div> */}

                    {/* Sẵn sàng sử dụng */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-check"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Sẵn sàng sử dụng</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'Sẵn sàng sử dụng') : 0}</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* Đang sử dụng */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-play"></i></span>
                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Đang sử dụng</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'Đang sử dụng') : 0}</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* Hỏng hóc */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-warning"></i></span>
                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Hỏng hóc</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'Hỏng hóc') : 0}</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* Thanh lý */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-calendar-times-o"></i></span>
                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Thanh lý</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'Thanh lý') : 0}</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#administration-asset-by-group" data-toggle="tab" onClick={() => this.handleNavTabs("assetByGroup")}>{translate('asset.dashboard.asset_by_group')}</a></li>
                        <li><a href="#administration-asset-by-type" data-toggle="tab" onClick={() => this.handleNavTabs("assetByType")}>{translate('asset.dashboard.asset_by_type')}</a></li>
                        <li><a href="#administration-asset-statistics" data-toggle="tab" onClick={() => this.handleNavTabs("assetStatistics")}>Thống kê tài sản</a></li>
                        <li><a href="#administration-purchase-disposal" data-toggle="tab" onClick={() => this.handleNavTabs("purchaseDisposal")}>{translate('asset.dashboard.asset_purchase_and_dispose')}</a></li>
                        <li><a href="#administration-asset-is-expired" data-toggle="tab" onClick={() => this.handleNavTabs("assetIsExpired")}>Hạn sử dụng tài sản</a> </li>
                        {exportData && currentTab && exportData[currentTab] && <ExportExcel type="link" style={{ padding: "15px" }} id="export-asset-dashboard" exportData={exportData[currentTab]} />}
                    </ul>
                    <div className="tab-content">

                        {/**Tài sản theo nhóm*/}
                        <div className="tab-pane active" id="administration-asset-by-group">
                            <LazyLoadComponent
                                key="AdministrationAssetByGroup"
                            >
                                <AssetByGroup
                                    setAssetByGroupExportData={this.setAssetByGroupExportData}
                                />
                            </LazyLoadComponent>
                        </div>

                        {/**Tài sản theo loại*/}
                        <div className="tab-pane" id="administration-asset-by-type">
                            <LazyLoadComponent
                                key="AdministrationAssetByType"
                            >
                                <AssetByType
                                    setAssetByTypeExportData={this.setAssetByTypeExportData}
                                />
                            </LazyLoadComponent>
                        </div>

                        {/* Thống kê mua bán tài sản*/}
                        <div className="tab-pane" id="administration-purchase-disposal">
                            <LazyLoadComponent
                                key="AdministrationPurchaseAndDisposal"
                            >
                                < PurchaseAndDisposal />
                            </LazyLoadComponent>
                        </div>

                        {/** Biểu đồ thống kê tài sản */}
                        <div className="tab-pane" id="administration-asset-statistics">
                            <LazyLoadComponent
                                key="AdministrationAssetStatistics"
                            >
                                <AssetStatistics />
                            </LazyLoadComponent>
                        </div>

                        {/* Danh sách các tài sản sắp hết hạn */}
                        <div className="tab-pane" id="administration-asset-is-expired">
                            <LazyLoadComponent
                                key="AdministrationAssetExpired"
                            >
                                <AssetIsExpired />
                            </LazyLoadComponent>
                        </div>



                    </div>
                </div>
            </div>
        );

        // return (
        //     <div className="qlcv">
        //         <section className="form-inline" style={{ textAlign: "right" }}>
        //             <div className="form-group">
        //                 <label>Phan loai theo</label>

        //                 <SelectBox
        //                     id={`select-type-display-in-asset-dashboard`}
        //                     className="form-control select2"
        //                     style={{ width: "100%" }}
        //                     items={[{ text: "Group", value: "Group" }, { text: "Type", value: "Type" }]}
        //                     multiple={false}
        //                     onChange={this.handleSelectTypeOfDisplay}
        //                     value={"Group"}
        //                 />
        //             </div>
        //         </section>


        //             {/* Biểu đồ yêu cầu mua sắm tài sản */}
        //             {/* <div className="col-md-6 col-sm-6 col-xs-6">
        //                 <CanvasJSChart options={options} />
        //             </div> */}

        //             {/* Biểu đồ yêu cầu sử dụng tài sản */}
        //             {/* <div className="col-md-6 col-sm-6 col-xs-6">
        //                 <CanvasJSChart options={options2} />
        //             </div> */}

        //         </div>
        //         <div className="row">
        //             {/* Biểu đồ số lượng tài sản */}
        //             <div className="col-xs-6">
        //                 <div className="box box-primary">
        //                     <div className="box-header with-border">
        //                         <div className="box-title">Biểu đồ số lượng tài sản</div>
        //                     </div>
        //                     <div className="box-body qlcv">
        //                         <AmountOfAssetChart
        //                             listAssets={listAssets}
        //                             displayBy={displayBy}
        //                             assetType={assetType}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Biểu đồ giá trị tài sản */}
        //             <div className="col-xs-6">
        //                 <div className="box box-primary">
        //                     <div className="box-header with-border">
        //                         <div className="box-title">Biểu đồ giá trị tài sản</div>
        //                     </div>
        //                     <div className="box-body qlcv">
        //                         <ValueOfAssetChart
        //                             listAssets={listAssets}
        //                             displayBy={displayBy}
        //                             assetType={assetType}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="row">
        //             {/* Biểu đồ khấu hao tài sản */}
        //             <div className="col-xs-6">
        //                 <div className="box box-primary">
        //                     <div className="box-header with-border">
        //                         <div className="box-title">Biểu đồ khấu hao tài sản</div>
        //                     </div>
        //                     <div className="box-body qlcv">
        //                         <DepreciationOfAssetChart
        //                             listAssets={listAssets}
        //                             displayBy={displayBy}
        //                             assetType={assetType}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // );
    }
};

function mapState(state) {
    const { listAssets } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType };
}

const DashBoard = connect(mapState)(withTranslate(DashBoardAssets));
export { DashBoard as DashBoardAssets };
