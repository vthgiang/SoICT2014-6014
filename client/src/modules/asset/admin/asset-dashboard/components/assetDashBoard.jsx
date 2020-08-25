import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import CanvasJSReact from './assets/canvasjs.react';

import { AssetService } from "../../asset-information/redux/services";
import { RecommendProcureService } from "../../../user/purchase-request/redux/services";
import { RecommendDistributeService } from "../../use-request/redux/services";

import { AssetByCategory } from './assetByCategory/assetByCategory';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../../common-components';


var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class DashBoardAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAssets: [],
            recommendProcure: [],
            recommendDistribute: [],
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



    render() {
        const { listAssets, recommendProcure, recommendDistribute } = this.state;
        const options = {
            animationEnabled: true,
            title: {
                text: "Yêu cầu mua sắm tài sản",
                fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif"
            },
            subtitles: [{
                text: recommendProcure.length ? `${recommendProcure.length} yêu cầu` : "0 yêu cầu",
                verticalAlign: "center",
                fontSize: 24,
                dockInsidePlotArea: true
            }],
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: "{name}: {y}",
                indexLabelFormatter: function (e) {
                    return `${e.dataPoint.name}: ${e.dataPoint.y}`
                },
                yValueFormatString: "#,###''",
                dataPoints: [
                    { name: "Chờ phê duyệt", y: recommendProcure.length ? this.returnCountNumber(recommendProcure, 'Chờ phê duyệt') : 'test' },
                    { name: "Đã phê duyệt", y: recommendProcure.length ? this.returnCountNumber(recommendProcure, 'Đã phê duyệt') : 0 },
                    { name: "Không phê duyệt", y: recommendProcure.length ? this.returnCountNumber(recommendProcure, 'Không phê duyệt') : 0 },
                ]
            }]
        };

        const options2 = {
            animationEnabled: true,
            title: {
                text: "Yêu cầu sử dụng tài sản",
                fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif"
            },
            subtitles: [{
                text: recommendDistribute.length ? `${recommendDistribute.length} yêu cầu` : "0 yêu cầu",
                verticalAlign: "center",
                fontSize: 24,
                dockInsidePlotArea: true
            }],
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: "{name}: {y}",
                indexLabelFormatter: function (e) {
                    return `${e.dataPoint.name}: ${e.dataPoint.y}`
                },
                yValueFormatString: "#,###''",
                dataPoints: [
                    { name: "Chờ phê duyệt", y: recommendDistribute.length ? this.returnCountNumber(recommendDistribute, 'Chờ phê duyệt') : 0 },
                    { name: "Đã phê duyệt", y: recommendDistribute.length ? this.returnCountNumber(recommendDistribute, 'Đã phê duyệt') : 0 },
                    { name: "Không phê duyệt", y: recommendDistribute.length ? this.returnCountNumber(recommendDistribute, 'Không phê duyệt') : 0 }
                ]
            }]
        };
        return (
            <div className="qlcv">
                <div className="row" style={{ marginTop: 10 }}>

                    {/* Tổng số tài sản */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Tổng số tài sản</span>
                                <span className="info-box-number">{listAssets.length ? listAssets.length : 0}</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>

                    {/* Sẵn sàng sử dụng */}
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>
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
                            <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>
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
                            <span className="info-box-icon bg-yellow"><i className="fa fa-calendar-times-o"></i></span>
                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Hỏng hóc</span>
                                <span className="info-box-number">{listAssets.length ? this.returnCountNumber(listAssets, 'Hỏng hóc') : 0}</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#administration-asset-by-type" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Tài sản theo nhóm loại</a></li>
                    </ul>
                    <div className="tab-content">

                        {/** Danh sách tài liệu văn bản */}
                        <div className="tab-pane active" id="administration-asset-by-type">
                            <LazyLoadComponent
                                key="AdministrationAssetByType"
                            >
                                <AssetByCategory />
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
