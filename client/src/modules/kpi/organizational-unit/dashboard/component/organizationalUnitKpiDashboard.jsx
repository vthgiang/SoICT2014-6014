import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';

import { TrendsInOrganizationalUnitKpiChart } from './trendsInOrganizationalUnitKpiChart';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { ResultsOfOrganizationalUnitKpiChart } from './resultsOfOrganizationalUnitKpiChart';
import { ResultsOfAllOrganizationalUnitKpiChart } from './resultsOfAllOrganizationalUnitKpiChart';
import { StatisticsOfOrganizationalUnitKpiResultsChart } from './statisticsOfOrganizationalUnitKpiResultsChart';

import { SelectBox } from '../../../../../common-components/index';
class OrganizationalUnitKpiDashboard extends Component {

    constructor(props) {
        super(props);
        
        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            currentMonth: new Date().getMonth() + 1,
            currentYear: new Date().getFullYear(),
            currentRole: null,

            organizationalUnitId: null,
            organizationalUnit: null,
            organizationalUnitSelectBox: null,

            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        };
    }

    componentDidMount() {
        this.props.getDepartment();//localStorage.getItem('id')
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));

        this.setState(state => {
            return {
                ...state,
                currentRole: localStorage.getItem('currentRole'),
                dataStatus: this.DATA_STATUS.QUERYING
            }
        })
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.state.currentRole !== localStorage.getItem('currentRole')) {
            await this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));

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

    handleSelectOrganizationalUnitId = (value) => {
        var organizationalUnitId = this.state.organizationalUnitSelectBox.filter(x => x.value === value[0]).map(x => x.text);

        this.setState(state => {
            return {
                ...state,
                organizationalUnitId: value[0],
                organizationalUnit: organizationalUnitId[0]
            }
        })
    }

    render() {
        var childOrganizationalUnit, childrenOrganizationalUnit, organizationalUnitSelectBox;
        const { user, dashboardEvaluationEmployeeKpiSet } = this.props;

        if(dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }

        if(childrenOrganizationalUnit) {
            var temporaryChild;

            childOrganizationalUnit = [{
                'name': childrenOrganizationalUnit.name,
                'id': childrenOrganizationalUnit.id,
                'viceDean': childrenOrganizationalUnit.viceDean
            }]

            temporaryChild = childrenOrganizationalUnit.children;

            while(temporaryChild) {
                temporaryChild.map(x => {
                    childOrganizationalUnit = childOrganizationalUnit.concat({
                        'name': x.name,
                        'id': x.id,
                        'viceDean': x.viceDean
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

            if(organizationalUnitSelectBox && this.state.organizationalUnitId === null) {
                this.setState(state => {
                    return {
                        ...state,
                        organizationalUnitId: organizationalUnitSelectBox[0].value,
                        organizationalUnit: organizationalUnitSelectBox[0].text,
                        organizationalUnitSelectBox: organizationalUnitSelectBox
                    }
                })
            }
        }
        
        return (
            <div className="table-wrapper box">
                {childOrganizationalUnit &&
                    <section style={{textAlign: "right"}}>
                        <span className="label label-danger">{this.state.organizationalUnit}</span>
                        <button type="button" data-toggle="collapse" data-target="#organizationalUnit" style={{ border: "none", background: "none", padding: "0px 15px 0px 5px" }}><i className="fa fa-gear" style={{ fontSize: "15px" }}></i></button>
                        
                        <div className="box box-primary box-solid collapse setting-table" id="organizationalUnit">
                            <div className="box-header with-border">
                                <h3 className="box-title">Đơn vị</h3>
                                <div className="box-tools pull-right">
                                    <button type="button" className="btn btn-box-tool" data-toggle="collapse" data-target="#organizationalUnit" ><i className="fa fa-times"></i></button>
                                </div>
                            </div>

                            <div className="box-body">
                                <div className = "form-group">
                                    <SelectBox
                                        id={`organizationalUnitSelectBox`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={organizationalUnitSelectBox}
                                        multiple={false}
                                        onChange={this.handleSelectOrganizationalUnitId}
                                        value={organizationalUnitSelectBox[0].value}
                                    />
                                </div> 
                            </div>
                        </div>
                    </section>
                }

                <section className="content">
                    <div className=" box box-primary" style={ {textAlign: 'center'}}>
                        <h2 class="box-title">Xu hướng thực hiện mục tiêu của nhân viên tháng {this.state.currentMonth}</h2>
                        <div className="box-body dashboard_box_body">
                            <TrendsInOrganizationalUnitKpiChart/>
                        </div>
                    </div>
                        
                    <div className="row">
                        {childOrganizationalUnit &&
                            <div className="col-xs-6">
                                <div className="box box-primary" style={ {textAlign: 'center'}}>
                                    <h2 class="box-title">Kết quả KPI đơn vị năm {this.state.currentYear}</h2>
                                    <div className="box-body dashboard_box_body">
                                        {(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) && 
                                            <ResultsOfOrganizationalUnitKpiChart organizationalUnitId={this.state.organizationalUnitId}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        }   
                        <div className="col-xs-6">
                            {childOrganizationalUnit &&
                                <div className="box box-primary" style={ {textAlign: 'center'}}>
                                    <h2 class="box-title">Phân bố KPI đơn vị tháng {this.state.currentMonth}</h2>
                                    <div className="box-body dashboard_box_body">
                                        {(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) && 
                                            <DistributionOfOrganizationalUnitKpiChart organizationalUnitId={this.state.organizationalUnitId}/>
                                        }
                                    </div>
                                </div>
                            }   
                        </div>
                    </div>
                    <div className="row">
                        {childOrganizationalUnit &&
                            <div className="col-xs-6">
                                <div className="box box-primary" style={ {textAlign: 'center'}}>
                                    <h2 class="box-title">Kết quả KPI các đơn vị năm {this.state.currentYear}</h2>
                                    <ResultsOfAllOrganizationalUnitKpiChart/>
                                </div>
                            </div>
                        }       
                        <div className="col-xs-6">
                            <div className="box box-primary" style={ {textAlign: 'center'}}>
                                <h2 class="box-title">Thống kê kết quả KPI tháng {this.state.currentMonth}</h2>
                                <StatisticsOfOrganizationalUnitKpiResultsChart/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

function mapState(state) {
    const { user, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = state;
    return { user, createKpiUnit, dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree
};
const connectedOrganizationalUnitKpiDashboard = connect(mapState, actionCreators)(OrganizationalUnitKpiDashboard);
export { connectedOrganizationalUnitKpiDashboard as OrganizationalUnitKpiDashboard };