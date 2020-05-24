import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { managerActions } from '../../management/redux/actions';
// import { ModalDetailKPI } from './ModalDetailKPI';
import CanvasJSReact from '../../../../../chart/canvasjs.react';
// import { ModalCopyKPIUnit } from './ModalCopyKPIUnit';

import { TrendsInOrganizationalUnitKpiChart } from './trendsInOrganizationalUnitKpiChart';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { ResultsOfOrganizationalUnitKpiChart } from './resultsOfOrganizationalUnitKpiChart';

class OrganizationalUnitKpiDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().getMonth() + 1,
            currentRole: localStorage.getItem("currentRole")
        };
    }

    componentDidMount() {
        this.props.getDepartment();//localStorage.getItem('id')
        this.props.getAllKPIUnit(localStorage.getItem("currentRole"));
        this.handleResizeColumn();
    }

    componentDidUpdate() {
        if (this.state.currentRole !== localStorage.getItem('currentRole')) {
            this.props.getAllKPIUnit(localStorage.getItem("currentRole"));
            this.setState(state => {
                return {
                    ...state,
                    currentRole: localStorage.getItem('currentRole')
                }
            })
        }
    }
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
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
    // showModalCopy = async (id) => {
    //     await this.setState(state => {
    //         return {
    //             ...state,
    //             showModalCopy: id
    //         }
    //     })
    //     var element = document.getElementsByTagName("BODY")[0];
    //     element.classList.add("modal-open");
    //     var modal = document.getElementById(`copyOldKPIToNewTime${id}`);
    //     modal.classList.add("in");
    //     modal.style = "display: block; padding-right: 17px;";
    // }
    checkPermisson = (deanCurrentUnit) => {
        var currentRole = localStorage.getItem("currentRole");
        return (currentRole === deanCurrentUnit);
        
    }

    render() {
        
        var listkpi, currentKPI, currentTargets, kpiApproved, datachat1, targetA, targetC, targetOther, misspoint;
        var unitList, currentUnit;
        const { user, managerKpiUnit } = this.props;
        
        if (user.organizationalUnitsOfUser) {
            unitList = user.organizationalUnitsOfUser;
            currentUnit = unitList.filter(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
        }
        
        if (managerKpiUnit.kpis) {
            listkpi = managerKpiUnit.kpis;
            if(typeof listkpi !== "undefined" && listkpi.length !== 0)//listkpi.content
            {
                kpiApproved = listkpi.filter(item => item.status === 2);
                currentKPI = listkpi.filter(item => item.status !== 2);
                currentTargets =currentKPI[0].kpis.map(item => { return { y: item.weight, name: item.name } });

                datachat1 = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.automaticPoint }
                }).reverse();
                targetA = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.kpis[0].result }
                }).reverse();
                targetC = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.kpis[1].result }
                }).reverse();
                targetOther = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (item.result - item.kpis[0].result - item.kpis[1].result) }
                }).reverse();
                misspoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (100 - item.result) }
                }).reverse();
            };
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
        
        return (
            <div className="table-wrapper box">
                    <section className="content">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <CanvasJSReact options={options2} />
                                </div>
                            </div>

                            {managerKpiUnit.kpis ?
                                <div className="col-xs-12 box box-primary" style={ {textAlign: 'center'}}>
                                    <h1>Xu hướng thực hiện mục tiêu của nhân viên tháng {this.state.date}</h1>
                                    <TrendsInOrganizationalUnitKpiChart/>
                                </div>
                                : <div className="col-xs-12 box box-primary" style={ {textAlign: 'center'}}>
                                    <h2>Xu hướng thực hiện mục tiêu của nhân viên tháng {this.state.date}</h2>
                                    <h4>Chưa khởi tạo tập Kpi đơn vị tháng {this.state.date}</h4>
                                </div>
                            }   
                            
                            <div className="col-xs-6">
                                <div className="box box-primary" style={ {textAlign: 'center'}}>
                                    <h1>Kết quả KPI đơn vị năm 2019</h1>
                                    <ResultsOfOrganizationalUnitKpiChart/>
                                </div>
                            </div>
                                
                            {managerKpiUnit.kpis ?
                                <div className="col-xs-6">
                                    <div className="box box-primary" style={ {textAlign: 'center'}}>
                                        <h1>Phân bố KPI đơn vị tháng {this.state.date}</h1>
                                        <DistributionOfOrganizationalUnitKpiChart/>
                                    </div>
                                </div>
                                : <div className="col-xs-6">
                                    <div className="box box-primary" style={ {textAlign: 'center'}}>
                                        <h2>Phân bố KPI đơn vị tháng {this.state.date}</h2>
                                        <h4>Chưa khởi tạo tập Kpi đơn vị tháng {this.state.date}</h4>
                                    </div>
                                </div>
                            }   
                        </div>
                    </section>
            </div>
        );
    }
}

function mapState(state) {
    const { user, managerKpiUnit } = state;
    return { user, managerKpiUnit };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getAllKPIUnit: managerActions.getAllKPIUnit,
};
const connectedOrganizationalUnitKpiDashboard = connect(mapState, actionCreators)(OrganizationalUnitKpiDashboard);
export { connectedOrganizationalUnitKpiDashboard as OrganizationalUnitKpiDashboard };