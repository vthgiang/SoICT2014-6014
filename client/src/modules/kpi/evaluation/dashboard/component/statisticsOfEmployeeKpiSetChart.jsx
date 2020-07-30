import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createKpiSetActions } from '../../../employee/creation/redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';

class StatisticsOfEmployeeKpiSetChart extends Component {

    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING,
            willUpdate: false
        };
    }

    componentDidMount = () => {
        this.props.getAllEmployeeKpiSetByMonth(this.props.userId, this.props.startMonth, this.props.endMonth);
        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
                willUpdate: true
            }
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        const { userId, startMonth, endMonth, willUpdate } = this.state;
        if (nextProps.userId !== userId || nextProps.startMonth !== startMonth || nextProps.endMonth !== endMonth) {
            await this.props.getAllEmployeeKpiSetByMonth(nextProps.userId, nextProps.startMonth, nextProps.endMonth);
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true,
                }
            });
            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createEmployeeKpiSet.employeeKpiSetByMonth)
                return false;
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE && willUpdate) {

            this.multiLineChart();
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                    willUpdate: false
                };
            });
        }
        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userId !== prevState.userId || nextProps.startMonth !== prevState.startMonth || nextProps.endMonth !== prevState.endMonth) {
            return {
                ...prevState,
                userId: nextProps.userId,
                startMonth: nextProps.startMonth,
                endMonth: nextProps.endMonth,
            }
        } else {
            return null;
        }
    }

    setDataMultiLineChart = () => {
        const { createEmployeeKpiSet, translate } = this.props;
        const { willUpdate } = this.state;
        let listEmployeeKpiSet, dataMultiLineChart, automaticPoint, employeePoint, approvedPoint, date;

        if (createEmployeeKpiSet && willUpdate) {
            listEmployeeKpiSet = createEmployeeKpiSet.employeeKpiSetByMonth
        }
        if (listEmployeeKpiSet !== null) {
            automaticPoint = [translate('kpi.evaluation.dashboard.auto_eva')].concat(listEmployeeKpiSet.map(x => x.automaticPoint));
            employeePoint = [translate('kpi.evaluation.dashboard.employee_eva')].concat(listEmployeeKpiSet.map(x => x.employeePoint));
            approvedPoint = [translate('kpi.evaluation.dashboard.approver_eva')].concat(listEmployeeKpiSet.map(x => x.approvedPoint));
            date = listEmployeeKpiSet.map(x => {
                date = new Date(x.date);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() - 1);
            })
        }
        dataMultiLineChart = [['x'].concat(date), automaticPoint, employeePoint, approvedPoint];
        return dataMultiLineChart;
    }

    removePreviousChart() {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    multiLineChart = () => {
        const { translate } = this.props;
        this.removePreviousChart();
        let dataMultiLineChart = this.setDataMultiLineChart();
        this.chart = c3.generate({
            bindto: this.refs.chart,
            padding: {
                top: 20,
                right: 20,
                left: 20
            },
            data: {                                
                x: 'x',
                columns: dataMultiLineChart,
                type: 'spline'
            },
            axis: {                               
                x: {
                    type: 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                },
                y: {
                    max: 100,
                    min: 0,
                    label: {
                        text: translate('kpi.evaluation.employee_evaluation.point'),
                        position: 'outer-right'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            },
            zoom: {                         
                enabled: false
            }
        })
    }

    render() {
        return (
            <React.Fragment>
                <div ref="chart"></div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}
const actions = {
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
}
const connectedStatisticsOfEmployeeKpiSetChart = connect(mapState, actions)(withTranslate(StatisticsOfEmployeeKpiSetChart));
export { connectedStatisticsOfEmployeeKpiSetChart as StatisticsOfEmployeeKpiSetChart };