import React, { Component } from 'react';
import { ModalDetailKPIPersonal } from './ModalDetailKPIPersonal';
import { connect } from 'react-redux';
import { overviewKpiActions } from '../redux/actions';
import CanvasJSReact from '../../../../Chart/canvasjs.react';
import { ModalCopyKPIPersonal } from './ModalCopyKPIPersonal';

class KPIPersonalOverview extends Component {
    UNSAFE_componentWillMount() {
        this.props.getAllKPIPersonal(localStorage.getItem("id"));
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/main/js/Table.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    constructor(props) {
        super(props);
        this.state = {
            showModalCopy: ""
        };
    }
    // componentDidUpdate() {
    //     let script = document.createElement('script');
    //     script.src = '/main/js/Table.js';
    //     script.async = true;
    //     script.defer = true;
    //     document.body.appendChild(script);
    // }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    showModalCopy = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModalCopy: id
            }
        })
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`copyOldKPIToNewTime${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }
    render() {
        var listkpi;
        var currentKPI, currentTargets, kpiApproved, systempoint, mypoint, approverpoint, targetA, targetC, targetOther, misspoint;
        const { overviewKpiPersonal } = this.props;
        if (overviewKpiPersonal.kpipersonals) {
            listkpi = overviewKpiPersonal.kpipersonals;
            kpiApproved = listkpi.filter(item => item.status === 3);
            currentKPI = listkpi.filter(item => item.status !== 3);
            currentTargets = currentKPI[0].listtarget.map(item => { return { y: item.weight, name: item.name } });
            systempoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: item.systempoint }
            }).reverse();
            mypoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: item.mypoint }
            }).reverse();
            approverpoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: item.approverpoint }
            }).reverse();
            targetA = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: item.listtarget[0].approverpoint }
            }).reverse();
            targetC = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: item.listtarget[1].approverpoint }
            }).reverse();
            targetOther = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: (item.approverpoint - item.listtarget[0].approverpoint - item.listtarget[1].approverpoint) }
            }).reverse();
            misspoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: (100 - item.approverpoint) }
            }).reverse();
        }
        const options2 = {
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Biểu đồ kết quả KPI 2019",
                fontFamily: "tahoma",
                fontWeight: "normal",
                fontSize: 25,
            },
            axisY: {
                title: "Điểm",
            },
            toolTip: {
                shared: true
            },
            legend: {
                fontSize: 13
            },
            data: [{
                type: "stackedColumn100",
                showInLegend: true,
                name: "Hoàn thành vai trò quản lý (A)",
                dataPoints: targetA
            },
            {
                type: "stackedColumn100",
                showInLegend: true,
                name: "Liên kết nhân viên (C)",
                dataPoints: targetC
            },
            {
                type: "stackedColumn100",
                showInLegend: true,
                name: "Mục tiêu khác",
                dataPoints: targetOther
            },
            {
                type: "stackedColumn100",
                showInLegend: true,
                name: "Điểm bị trừ",
                dataPoints: misspoint
            }]
        }
        const options1 = {
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Kết quả KPI cá nhân năm 2019",
                fontFamily: "tahoma",
                fontWeight: "normal",
                fontSize: 25,
            },
            axisY: {
                title: "Kết quả",
                includeZero: false
            },
            toolTip: {
                shared: true
            },
            data: [{
                type: "spline",
                name: "Hệ thống đánh giá",
                showInLegend: true,
                dataPoints: systempoint
            },
            {
                type: "spline",
                name: "Cá nhân tự đánh giá",
                showInLegend: true,
                dataPoints: mypoint
            }, {
                type: "spline",
                name: "Quản lý đánh giá",
                showInLegend: true,
                dataPoints: approverpoint
            }]
        }
        const options3 = {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Phân bố mục tiêu tháng 12",
                fontFamily: "tahoma",
                fontWeight: "normal",
                fontSize: 25,
            },
            legend: {
                cursor: "pointer",
            },
            data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{name}: <strong>{y}%</strong>",
                indexLabel: "{name} - {y}%",
                dataPoints: currentTargets
            }]
        }
        
        return (
            <div className="table-wrapper box">
                {/* <div className="content-wrapper"> */}
                    {/* <section className="content-header">
                        <h1>
                            Tổng quan KPI cá nhân
                        </h1>
                        <ol className="breadcrumb">
                            <li><a href="/"><i className="fa fa-dashboard" /> Home</a></li>
                            <li><a href="/">Forms</a></li>
                            <li className="active">Advanced Elements</li>
                        </ol>
                    </section> */}
                    <section className="content">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <CanvasJSReact options={options2} />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="box box-primary">
                                    <CanvasJSReact options={options1} />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="box box-primary">
                                    <CanvasJSReact options={options3} />
                                </div>
                            </div>
                            <div className="col-xs-12">
                                <div className="box">
                                    <div className="box-header">
                                        <h3 className="box-title">Bảng thống kê kpi cá nhân hàng tháng</h3>
                                    </div>
                                    <div className="box-body">
                                        <table id="example4" className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Thời gian</th>
                                                    <th>Số lượng mục tiêu</th>
                                                    <th>Hệ thống đánh giá</th>
                                                    <th>Kết quả tự đánh giá</th>
                                                    <th>Quản lý đánh giá</th>
                                                    <th style={{ width: "100px" }}>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(typeof listkpi !== "undefined" && listkpi.length !== 0) ?
                                                    listkpi.map((item, index) =>
                                                        <tr key={index}>
                                                            <td>{this.formatDate(item.time)}</td>
                                                            <td>{item.listtarget.length}</td>
                                                            <td>{item.systempoint === null ? "Chưa đánh giá" : item.systempoint}</td>
                                                            <td>{item.mypoint === null ? "Chưa đánh giá" : item.mypoint}</td>
                                                            <td>{item.approverpoint === null ? "Chưa đánh giá" : item.approverpoint}</td>
                                                            <td>
                                                                <a href={`#detailKPIPersonal${item._id}`} data-toggle="modal" data-backdrop="static" data-keyboard="false" title="Xem chi tiết KPI tháng này" ><i className="material-icons">view_list</i></a>
                                                                <ModalDetailKPIPersonal kpipersonal={item} />
                                                                {<a href="#abc" onClick={() => this.showModalCopy(item._id)} className="copy" data-toggle="modal" data-backdrop="static" data-keyboard="false" title="Thiết lập kpi tháng mới từ kpi tháng này"><i className="material-icons">content_copy</i></a>}
                                                                {this.state.showModalCopy === item._id ? <ModalCopyKPIPersonal kpipersonal={item} /> : null}
                                                            </td>
                                                        </tr>) : null
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                {/* </div> */}
            </div>
        );
    }
}

function mapState(state) {
    const { overviewKpiPersonal } = state;
    return { overviewKpiPersonal };
}

const actionCreators = {
    getAllKPIPersonal: overviewKpiActions.getAllKPIPersonalByMember
};
const connectedKPIPersonalOverview = connect(mapState, actionCreators)(KPIPersonalOverview);
export { connectedKPIPersonalOverview as KPIPersonalOverview };
