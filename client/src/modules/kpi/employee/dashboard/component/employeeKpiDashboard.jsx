import React, { Component } from 'react';
import { ModalDetailEmployeeKpiSet } from './employeeKpiDetailModal';
import { connect } from 'react-redux';
import { dashboardEmployeeKpiSetActions } from '../redux/actions';
import { managerKpiActions } from '../../management/redux/actions';
import CanvasJSReact from '../../../../../chart/canvasjs.react';
import { ModalCopyEmployeeKpiSet } from './employeeKpiCopyModal';

class DashBoardEmployeeKpiSet extends Component {
    UNSAFE_componentWillMount() {
        this.props.getEmployeeKpiSetByMember();//localStorage.getItem("id")
    }
    constructor(props) {
        super(props);
        this.state = {
            showModalCopy: ""
        };
    }
    
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
        const { KPIPersonalManager } = this.props;
        if (KPIPersonalManager.kpipersonals) {
            listkpi = KPIPersonalManager.kpipersonals;
            if(typeof listkpi !== "undefined" && listkpi.length !== 0){//listkpi.content
                kpiApproved = listkpi.filter(item => item.status === 3);
                currentKPI = listkpi.filter(item => item.status !== 3);
                currentTargets = currentKPI[0].kpis.map(item => { return { y: item.weight, name: item.name } });
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
                    return { label: this.formatDate(item.time), y: item.kpis[0].approverpoint }
                }).reverse();
                targetC = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: item.kpis[1].approverpoint }
                }).reverse();
                targetOther = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: (item.approverpoint - item.kpis[0].approverpoint - item.kpis[1].approverpoint) }
                }).reverse();
                misspoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: (100 - item.approverpoint) }
                }).reverse();
            }
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
                        </div>
                    </section>
                {/* </div> */}
            </div>
        );
    }
}

function mapState(state) {
    const { KPIPersonalManager } = state;
    return { KPIPersonalManager };
}

const actionCreators = {
    getEmployeeKpiSetByMember: managerKpiActions.getAllKPIPersonalByMember
};
const connectedDashBoardEmployeeKpiSet = connect(mapState, actionCreators)(DashBoardEmployeeKpiSet);
export { connectedDashBoardEmployeeKpiSet as DashBoardEmployeeKpiSet };
