import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { managerActions } from '../../management/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';
// import { ModalDetailKPI } from './ModalDetailKPI';
import CanvasJSReact from '../../../../../chart/canvasjs.react';
// import { ModalCopyKPIUnit } from './ModalCopyKPIUnit';

import { TrendsInOrganizationalUnitKpiChart } from './trendsInOrganizationalUnitKpiChart';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { ResultsOfOrganizationalUnitKpiChart } from './resultsOfOrganizationalUnitKpiChart';
import { TaskPerformanceResultsOfOrganizationalUnitChart } from './taskPerformanceResultsOfOrganizationalUnitChart';
import { StatisticsOfPerformanceResultsChart } from './statisticsOfPerformanceResultsChart';

class OrganizationalUnitKpiDashboard extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            currentMonth: new Date().getMonth() + 1,
            currentYear: new Date().getFullYear(),
            currentRole: localStorage.getItem("currentRole")
        };
    }

    componentDidMount() {
        this.props.getDepartment();//localStorage.getItem('id')
        this.props.getAllKPIUnit(this.state.currentRole);
        this.props.getChildrenOfOrganizationalUnitsAsTree(this.state.currentRole)
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

    checkPermisson = (deanCurrentUnit) => {
        var currentRole = localStorage.getItem("currentRole");
        return (currentRole === deanCurrentUnit);
        
    }

    render() {
        
        var childOrganizationalUnit, listkpi, currentKPI, currentTargets, kpiApproved, datachat1, targetA, targetC, targetOther, misspoint, childrenOrganizationalUnit;
        var unitList, currentUnit;
        const { user, managerKpiUnit, dashboardEvaluationEmployeeKpiSet } = this.props;

        if(dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }
        if(childrenOrganizationalUnit) {
            var temporaryChild;

            childOrganizationalUnit = [{
                'name': childrenOrganizationalUnit.name,
                'id': childrenOrganizationalUnit.id
            }]

            temporaryChild = childrenOrganizationalUnit.children;

            while(temporaryChild) {
                temporaryChild.map(x => {
                    childOrganizationalUnit = childOrganizationalUnit.concat({
                        'name': x.name,
                        'id': x.id
                    });
                })
                
                var hasNodeChild = [];
                temporaryChild.filter(x => x.hasOwnProperty("children")).map(x => {
                    x.children.map(x => {
                        hasNodeChild = hasNodeChild.concat(x)
                    })
                });
                
                if(hasNodeChild.length === 0) {
                    temporaryChild = undefined;
                } else {
                    temporaryChild = hasNodeChild
                }
            }
        }

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
                            <div className="box box-primary">
                                <CanvasJSReact options={options2} />
                            </div>

                            {managerKpiUnit.kpis ?
                                <div className=" box box-primary" style={ {textAlign: 'center'}}>
                                    <h2>Xu hướng thực hiện mục tiêu của nhân viên tháng {this.state.currentMonth}</h2>
                                    <TrendsInOrganizationalUnitKpiChart/>
                                </div>
                                : <div className="box box-primary" style={ {textAlign: 'center'}}>
                                    <h2>Xu hướng thực hiện mục tiêu của nhân viên tháng {this.state.currentMonth}</h2>
                                    <h4>Chưa khởi tạo tập Kpi đơn vị tháng {this.state.currentMonth}</h4>
                                </div>
                            }   
                            
                            <div className="row">
                                {childOrganizationalUnit &&
                                    <div className="col-xs-6">
                                        <div className="box box-primary" style={ {textAlign: 'center'}}>
                                            <h2>Kết quả KPI đơn vị năm {this.state.currentYear}</h2>
                                            <ResultsOfOrganizationalUnitKpiChart organizationalUnitId={childOrganizationalUnit[0].id}/>
                                        </div>
                                    </div>
                                }   
                                {managerKpiUnit.kpis ?
                                    <div className="col-xs-6">
                                        <div className="box box-primary" style={ {textAlign: 'center'}}>
                                            <h2>Phân bố KPI đơn vị tháng {this.state.currentMonth}</h2>
                                            <DistributionOfOrganizationalUnitKpiChart/>
                                        </div>
                                    </div>
                                    : <div className="col-xs-6">
                                        <div className="box box-primary" style={ {textAlign: 'center'}}>
                                            <h2>Phân bố KPI đơn vị tháng {this.state.currentMonth}</h2>
                                            <h4>Chưa khởi tạo tập Kpi đơn vị tháng {this.state.currentMonth}</h4>
                                        </div>
                                    </div>
                                }   
                            </div>

                            <div className="row">
                                {childOrganizationalUnit &&
                                    <div className="col-xs-6">
                                        <div className="box box-primary" style={ {textAlign: 'center'}}>
                                            <h2>Kết quả thực hiện công việc các đơn vị năm {this.state.currentYear}</h2>
                                            <TaskPerformanceResultsOfOrganizationalUnitChart childrenOrganizationalUnit={childOrganizationalUnit}/>
                                        </div>
                                    </div>
                                }       
                                <div className="col-xs-6">
                                    <div className="box box-primary" style={ {textAlign: 'center'}}>
                                        <h2>Thống kê kết quả thực hiện công việc tháng {this.state.currentMonth}</h2>
                                        <StatisticsOfPerformanceResultsChart/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
            </div>
        );
    }
}

function mapState(state) {
    const { user, managerKpiUnit, dashboardEvaluationEmployeeKpiSet } = state;
    return { user, managerKpiUnit, dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getAllKPIUnit: managerActions.getAllKPIUnit,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree
};
const connectedOrganizationalUnitKpiDashboard = connect(mapState, actionCreators)(OrganizationalUnitKpiDashboard);
export { connectedOrganizationalUnitKpiDashboard as OrganizationalUnitKpiDashboard };