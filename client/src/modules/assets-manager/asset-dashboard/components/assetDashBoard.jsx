import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
// import './employeeDashBoard.css';
import CanvasJSReact from './assets/canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class DashBoardAssets extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    render() {
        const options = {
            animationEnabled: true,
            title: {
                text: "Yêu cầu mua sắm tài sản"
            },
            subtitles: [{
                text: "90 yêu cầu",
                verticalAlign: "center",
                fontSize: 24,
                dockInsidePlotArea: true
            }],
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###''",
                dataPoints: [
                    { name: "Chờ phê duyệt", y: 30 },
                    { name: "Đã phê duyệt", y: 30 },
                    { name: "Không phê duyệt", y: 30 },
                ]
            }]
        }

        const options2 = {
            animationEnabled: true,
            title: {
                text: "Yêu cầu sử dụng tài sản"
            },
            subtitles: [{
                text: "90 yêu cầu",
                verticalAlign: "center",
                fontSize: 24,
                dockInsidePlotArea: true
            }],
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###''",
                dataPoints: [
                    { name: "Chờ phê duyệt", y: 30 },
                    { name: "Đã phê duyệt", y: 30 },
                    { name: "Không phê duyệt", y: 30 },
                ]
            }]
        }

        const { translate } = this.props;
        return (
            <div className="qlcv">
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Tổng số tài sản</span>
                                <span className="info-box-number">100</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Sẵn sàng sử dụng</span>
                                <span className="info-box-number">20</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Đang sử dụng</span>
                                <span className="info-box-number">60</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-calendar-times-o"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Hỏng hóc</span>
                                <span className="info-box-number">20</span>
                                <a href="/manage-info-asset">Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-6 col-xs-6">
                        <CanvasJSChart options={options} />
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-6">
                        <CanvasJSChart options={options2} />
                    </div>

                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
}

const actionCreators = {};

const DashBoard = connect(mapState, actionCreators)(withTranslate(DashBoardAssets));
export { DashBoard as DashBoardAssets };
