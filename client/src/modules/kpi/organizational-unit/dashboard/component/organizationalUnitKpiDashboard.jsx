import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';

import { TrendsInOrganizationalUnitKpiChart } from './trendsInOrganizationalUnitKpiChart';
import { TrendsInChildrenOrganizationalUnitKpiChart } from './trendsInChildrenOrganizationalUnitKpiChart';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { ResultsOfOrganizationalUnitKpiChart } from './resultsOfOrganizationalUnitKpiChart';
import { ResultsOfAllOrganizationalUnitKpiChart } from './resultsOfAllOrganizationalUnitKpiChart';
import { StatisticsOfOrganizationalUnitKpiResultsChart } from './statisticsOfOrganizationalUnitKpiResultsChart';

import { SelectBox } from '../../../../../common-components/index';
import { DatePicker } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';


class OrganizationalUnitKpiDashboard extends Component {

    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.today = new Date();

        this.state = {
            currentRole: null,
            organizationalUnitId: null,

            currentYear: new Date().getFullYear(),
            month: this.today.getFullYear() + '-' + (this.today.getMonth() + 1),
            date: (this.today.getMonth() + 1) + '-' + this.today.getFullYear(),

            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            childUnitChart: false
        };
    }

    componentDidMount() {
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
                    organizationalUnitId: null,
                    childUnitChart: false
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            return true;
        }

        return false;
    }
    
    handleSelectTypeChildUnit = () => {
        this.setState(state => {
            return {
                ...state,
                childUnitChart: !this.state.childUnitChart
            }
        })
    }

    formatDate(date) {
        let d = new Date(date),
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
        let currentRole = localStorage.getItem("currentRole");
        return (currentRole === deanCurrentUnit);

    }

    handleSelectOrganizationalUnitId = (value) => {
        this.setState(state => {
            return {
                ...state,
                organizationalUnitId: value[0]
            }
        })
    }

    handleSelectMonth = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        this.setState(state => {
            return {
                ...state,
                month: month,
                date: value
            }
        })
    }

    render() {
        const { dashboardEvaluationEmployeeKpiSet, translate } = this.props;
        const { childUnitChart } = this.state;

        let childOrganizationalUnit, childrenOrganizationalUnit, organizationalUnitSelectBox;
        
        if (dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }

        if (childrenOrganizationalUnit) {
            let temporaryChild;

            childOrganizationalUnit = [{
                'name': childrenOrganizationalUnit.name,
                'id': childrenOrganizationalUnit.id,
                'viceDean': childrenOrganizationalUnit.viceDean
            }]

            temporaryChild = childrenOrganizationalUnit.children;

            while (temporaryChild) {
                temporaryChild.map(x => {
                    childOrganizationalUnit = childOrganizationalUnit.concat({
                        'name': x.name,
                        'id': x.id,
                        'viceDean': x.viceDean
                    });
                })

                let hasNodeChild = [];
                temporaryChild.filter(x => x.hasOwnProperty("children")).map(x => {
                    x.children.map(x => {
                        hasNodeChild = hasNodeChild.concat(x)
                    })
                });

                if (hasNodeChild.length === 0) {
                    temporaryChild = undefined;
                } else {
                    temporaryChild = hasNodeChild
                }
            }
        }

        if (childOrganizationalUnit) {
            organizationalUnitSelectBox = childOrganizationalUnit.map(x => { return { 'text': x.name, 'value': x.id } });
        }

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultDate = [month, year].join('-');

        return (
            <React.Fragment>
                <div className="qlcv">
                    {childOrganizationalUnit &&
                        <span className="form-inline">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectBox
                                id={`organizationalUnitSelectBoxInOrganizationalUnitKpiDashboard`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={organizationalUnitSelectBox}
                                multiple={false}
                                onChange={this.handleSelectOrganizationalUnitId}
                                value={organizationalUnitSelectBox[0].value}
                            />
                        </span>
                    }

                    <span className="form-inline">
                        <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                        <DatePicker
                            id="monthInOrganizationalUnitKpiDashboard"
                            dateFormat="month-year"             
                            value={defaultDate}                     
                            onChange={this.handleSelectMonth}
                            disabled={false}                   
                        />
                    </span>
                </div>

                {/* Xu hướng thực hiện mục tiêu */}
                <div className=" box box-primary">
                    <div className="box-header with-border">
                        <div className="box-title">{translate('kpi.organizational_unit.dashboard.trend')} {this.state.date}</div>

                        <button className="pull-right" title={ !childUnitChart ? "Hiển thị biểu đồ các đơn vị con" : "Hiển thị biểu đồ đơn vị hiện tại" } onClick={this.handleSelectTypeChildUnit}>{ !childUnitChart ? "Các đơn vị con" : "Đơn vị hiện tại" }</button>
                    </div>
                    <div className="box-body qlcv">
                        { !childUnitChart ?
                            <TrendsInOrganizationalUnitKpiChart
                                organizationalUnitId={this.state.organizationalUnitId}
                                month={this.state.month}
                            />
                            : <TrendsInChildrenOrganizationalUnitKpiChart
                                organizationalUnitId={this.state.organizationalUnitId}
                                month={this.state.month}
                            />
                        }
                    </div>
                </div>

                <div className="row">
                    {/* Phân bố KPI đơn vị */}
                    <div className="col-xs-6">
                        {childOrganizationalUnit &&
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">{translate('kpi.organizational_unit.dashboard.distributive')}{this.state.date}</div>
                                </div>
                                <div className="box-body qlcv">
                                    {(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) &&
                                        <DistributionOfOrganizationalUnitKpiChart
                                            organizationalUnitId={this.state.organizationalUnitId}
                                            month={this.state.month}
                                        />
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    {/* Thống kê kết quả KPI */}
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('kpi.organizational_unit.dashboard.statiscial')} {this.state.date}</div>
                            </div>
                            <div className="box-body qlcv">
                                <StatisticsOfOrganizationalUnitKpiResultsChart
                                    organizationalUnitId={this.state.organizationalUnitId}
                                    month={this.state.month}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/* Kết quả KPI đơn vị */}
                    {childOrganizationalUnit &&
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">{translate('kpi.organizational_unit.dashboard.result_kpi_unit')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    {(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) &&
                                        <ResultsOfOrganizationalUnitKpiChart organizationalUnitId={this.state.organizationalUnitId} />
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    {/* Kết quả KPI các đơn vị */}
                    {childOrganizationalUnit &&
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">{translate('kpi.organizational_unit.dashboard.result_kpi_units')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <ResultsOfAllOrganizationalUnitKpiChart />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { createKpiUnit, dashboardEvaluationEmployeeKpiSet } = state;
    return { createKpiUnit, dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree
};
const connectedOrganizationalUnitKpiDashboard = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiDashboard));
export { connectedOrganizationalUnitKpiDashboard as OrganizationalUnitKpiDashboard };