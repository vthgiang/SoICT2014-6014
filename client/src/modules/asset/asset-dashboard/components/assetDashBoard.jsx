import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import CanvasJSReact from './assets/canvasjs.react';

import { AssetService } from "../../asset-management/redux/services";
import { RecommendProcureService } from "../../recommend-procure/redux/services";
import { RecommendDistributeService } from "../../recommend-distribute-management/redux/services";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class DashBoardAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAssets: [],
            recommendProcure: [],
            recommendDistribute: []
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

                    {/* Biểu đồ yêu cầu mua sắm tài sản */}
                    <div className="col-md-6 col-sm-6 col-xs-6">
                        <CanvasJSChart options={options} />
                    </div>

                    {/* Biểu đồ yêu cầu sử dụng tài sản */}
                    <div className="col-md-6 col-sm-6 col-xs-6">
                        <CanvasJSChart options={options2} />
                    </div>

                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { listAssets } = state.assetsManager;
    return { listAssets };
}

const DashBoard = connect(mapState)(withTranslate(DashBoardAssets));
export { DashBoard as DashBoardAssets };
