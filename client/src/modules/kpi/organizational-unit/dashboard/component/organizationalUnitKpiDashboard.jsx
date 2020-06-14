import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { managerActions } from '../../management/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';

import { TrendsInOrganizationalUnitKpiChart } from './trendsInOrganizationalUnitKpiChart';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { ResultsOfOrganizationalUnitKpiChart } from './resultsOfOrganizationalUnitKpiChart';
import { TaskPerformanceResultsOfOrganizationalUnitChart } from './taskPerformanceResultsOfOrganizationalUnitChart';
import { StatisticsOfPerformanceResultsChart } from './statisticsOfPerformanceResultsChart';

import CanvasJSReact from '../../../../../chart/canvasjs.react';

import { SelectBox } from '../../../../../common-components/index';
class OrganizationalUnitKpiDashboard extends Component {

    constructor(props) {
        super(props);
        
        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            currentMonth: new Date().getMonth() + 1,
            currentYear: new Date().getFullYear(),
            currentRole: null,
            resultsOrganizationalUnitId: null,
            resultsOrganizationalUnit: null,
            organizationalUnitSelectBox: null,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        };
    }

    componentDidMount() {
        this.props.getDepartment();//localStorage.getItem('id')
        this.props.getAllKPIUnit(localStorage.getItem("currentRole"));
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
        this.setState(state => {
            return {
                ...state,
                currentRole: localStorage.getItem('currentRole')
            }
        })
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.state.currentRole !== localStorage.getItem('currentRole')) {
            await this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
            await this.props.getAllKPIUnit(localStorage.getItem("currentRole"));

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    organizationalUnitId: null
                }
            });

            return false;
        }

        if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
            return false;
        } else if(nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            return true;
        }

        return false;
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

    handleSelectOrganizationalUnitForResults = (value) => {
        var organizationalUnit = this.state.organizationalUnitSelectBox.filter(x => x.value === value[0]).map(x => x.text);

        this.setState(state => {
            return {
                ...state,
                resultsOrganizationalUnitId: value[0],
                resultsOrganizationalUnit: organizationalUnit[0]
            }
        })
    }

    render() {
        
        var childOrganizationalUnit, targetA, targetC, targetOther, misspoint, childrenOrganizationalUnit, organizationalUnitSelectBox;
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

        if(childOrganizationalUnit) {
            organizationalUnitSelectBox = childOrganizationalUnit.map(x => { return { 'text': x.name, 'value': x.id } });

            if(organizationalUnitSelectBox && this.state.resultsOrganizationalUnitId === null) {
                this.setState(state => {
                    return {
                        ...state,
                        resultsOrganizationalUnitId: organizationalUnitSelectBox[0].value,
                        resultsOrganizationalUnit: organizationalUnitSelectBox[0].text,
                        organizationalUnitSelectBox: organizationalUnitSelectBox
                    }
                })
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
        
        return (
            <div className="table-wrapper box">
                    <section className="content">
                        <div className="row">
                            <div className="box box-primary">
                                <CanvasJSReact options={options2} />
                            </div>

                            {managerKpiUnit.kpis ?
                                <div className=" box box-primary" style={ {textAlign: 'center'}}>
                                    <h2 class="box-title">Xu hướng thực hiện mục tiêu của nhân viên tháng {this.state.currentMonth}</h2>
                                    <TrendsInOrganizationalUnitKpiChart/>
                                </div>
                                : <div className="box box-primary" style={ {textAlign: 'center'}}>
                                    <h2 class="box-title">Xu hướng thực hiện mục tiêu của nhân viên tháng {this.state.currentMonth}</h2>
                                    <h4>Chưa khởi tạo tập Kpi đơn vị tháng {this.state.currentMonth}</h4>
                                </div>
                            }   
                            
                            <div className="row">
                                {childOrganizationalUnit &&
                                    <div className="col-xs-6">
                                        <div className="box box-primary" style={ {textAlign: 'center'}}>
                                            <h2 class="box-title">Kết quả KPI đơn vị năm {this.state.currentYear}</h2>
                                            <div className="box-body dashboard_box_body">
                                                <div style={{textAlign: "right"}}>
                                                    <span className="label label-danger">{this.state.resultsOrganizationalUnit}</span>

                                                    <button type="button" data-toggle="collapse" data-target="#resultsOrganizationalUnit" style={{ border: "none", background: "none", padding: "5px" }}><i className="fa fa-gear" style={{ fontSize: "15px" }}></i></button>
                                                    <div id="resultsOrganizationalUnit" className="box collapse setting-table">
                                                        <span className="pop-arw arwTop L-auto" style={{ right: "26px" }}></span>

                                                        <div className = "form-group">
                                                            <label>Đơn vị</label>
                                                            <SelectBox
                                                                id={`resultsOrganizationalUnitSelectBox`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                items={organizationalUnitSelectBox}
                                                                multiple={false}
                                                                onChange={this.handleSelectOrganizationalUnitForResults}
                                                                value={organizationalUnitSelectBox[0].value}
                                                            />
                                                        </div> 
                                                    </div>
                                                </div>
                                                {(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) && 
                                                    <ResultsOfOrganizationalUnitKpiChart organizationalUnitId={this.state.resultsOrganizationalUnitId}/>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }   
                                {managerKpiUnit.kpis ?
                                    <div className="col-xs-6">
                                        <div className="box box-primary" style={ {textAlign: 'center'}}>
                                            <h2 class="box-title">Phân bố KPI đơn vị tháng {this.state.currentMonth}</h2>
                                            <div className="box-body dashboard_box_body">
                                                <DistributionOfOrganizationalUnitKpiChart organizationalUnitId={this.state.distributionOrganizationalUnitId}/>
                                            </div>
                                        </div>
                                    </div>
                                    : <div className="col-xs-6">
                                        <div className="box box-primary" style={ {textAlign: 'center'}}>
                                            <h2 class="box-title">Phân bố KPI đơn vị tháng {this.state.currentMonth}</h2>
                                            <h4>Chưa khởi tạo tập Kpi đơn vị tháng {this.state.currentMonth}</h4>
                                        </div>
                                    </div>
                                }   
                            </div>

                            <div className="row">
                                {childOrganizationalUnit &&
                                    <div className="col-xs-6">
                                        <div className="box box-primary" style={ {textAlign: 'center'}}>
                                            <h2 class="box-title">Kết quả thực hiện công việc các đơn vị năm {this.state.currentYear}</h2>
                                            <TaskPerformanceResultsOfOrganizationalUnitChart/>
                                        </div>
                                    </div>
                                }       
                                <div className="col-xs-6">
                                    <div className="box box-primary" style={ {textAlign: 'center'}}>
                                        <h2 class="box-title">Thống kê kết quả thực hiện công việc tháng {this.state.currentMonth}</h2>
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