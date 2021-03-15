import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { createUnitKpiActions } from '../../creation/redux/actions';

import { CustomLegendC3js } from '../../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';

class DistributionOfOrganizationalUnitKpiChart extends Component {
    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.KIND_OF_CHART = { LINE: 1, PIE: 2 };
        this.chart = null;

        this.state = {
            currentRole: null,
            dataStatus: this.DATA_STATUS.QUERYING,
            kindOfChart: this.KIND_OF_CHART.LINE,

            willUpdate: false
        };
    }

    componentDidMount = () => {
        this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);

        this.setState(state => {
            return {
                ...state,
                currentRole: localStorage.getItem("currentRole"),
                dataStatus: this.DATA_STATUS.QUERYING,
                willUpdate: true
            }
        })
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.state.currentRole !== localStorage.getItem("currentRole")) {
            await this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"), this.props.organizationalUnitId, this.props.month);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true
                }
            });

            return false;
        }

        if (nextProps.organizationalUnitId !== this.state.organizationalUnitId || nextProps.month !== this.state.month) {
            await this.props.getCurrentKPIUnit(this.state.currentRole, nextProps.organizationalUnitId, nextProps.month);
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createKpiUnit.currentKPI) {
                return false;
            }
                
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE && nextState.willUpdate) {
            this.pieChart(this.state.kindOfChart);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                    willUpdate: false
                };
            });
        }

        if (!nextProps.createKpiUnit.currentKPI && this.state.dataStatus === this.DATA_STATUS.FINISHED) {

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                    willUpdate: true
                }
            });

            return false;
        }

        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.organizationalUnitId !== prevState.organizationalUnitId || nextProps.month !== prevState.month) {
            return {
                ...prevState,
                organizationalUnitId: nextProps.organizationalUnitId,
                month: nextProps.month
            }
        } else {
            return null;
        }
    }

    setDataPieChart = () => {
        const { createKpiUnit } = this.props;
        let listOrganizationalUnitKpi, dataPieChart;

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (listOrganizationalUnitKpi) {
            dataPieChart = listOrganizationalUnitKpi.map(x => {
                return [x.name, x.weight]
            })
        }
        return dataPieChart;
    }

    removePreviousChart() {
        const chart = this.refs.chart;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        } 
    }

    pieChart = (kindOfChart) => {
        const { translate } = this.props;
        this.removePreviousChart();

        let dataLineChart = [
            ['x'],
            [translate('kpi.organizational_unit.dashboard.trend_chart.weight')]
        ];
        let dataPieChart = this.setDataPieChart();

        if (kindOfChart === this.KIND_OF_CHART.LINE) {
            if (dataPieChart?.length > 0) {
                dataPieChart.map(item => {
                    dataLineChart[0].push(item?.[0])
                    dataLineChart[1].push(item?.[1])
                })
            }

            window.$('#distributionOfUnitLegend').hide();
        } else {
            window.$('#distributionOfUnitLegend').show();
        }

        let data = kindOfChart === this.KIND_OF_CHART.LINE 
            ? {
                x: 'x',
                columns: dataLineChart,
                type: 'spline',
            }
            : {
                x: null,
                columns: dataPieChart,
                type: 'pie',
            };

        this.chart = c3.generate({
            bindto: this.refs.chart,

            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            data: data,

            tooltip: {
                format: {
                    value: function (value) {
                        return value;
                    }
                }
            },

            axis: {                            
                x: {
                    type: 'category',
                    tick: {
                        format: function (x) {
                            if (dataLineChart?.[0]?.length > 1) {
                                if (dataLineChart?.[0]?.[x + 1]?.length > 30) {
                                    return dataLineChart?.[0]?.[x + 1]?.slice(0, 30) + "...";
                                } else {
                                    return dataLineChart?.[0]?.[x + 1]
                                }
                            }
                        }
                    }
                },

                y: {
                    label: {
                        text: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight'),
                        position: 'outer-right'
                    }
                }
            },

            legend: {
                show: kindOfChart === this.KIND_OF_CHART.LINE
            }
        });

        this.setState(state => {
            return {
                ...state,
                dataPieChart: dataPieChart
            }
        })
    }

    handleSelectKindOfChart = (value) => {
        if (Number(value) !== this.state.kindOfChart) {
            this.setState(state => {
                return {
                    ...state,
                    kindOfChart: Number(value)
                }
            })
        }

        this.pieChart(Number(value));
    }

    render() {
        const { createKpiUnit, translate } = this.props;
        const { dataPieChart, kindOfChart } = this.state;
        let currentKpi, organizationalUnitKpiLoading;

        if (createKpiUnit) {
            currentKpi = createKpiUnit.currentKPI;
            organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading
        }

        return (
            <React.Fragment>
                {currentKpi ?
                    <section id={"distributionOfUnit"} className="c3-chart-container">
                        <section style={{ textAlign: "right" }}> 
                            <section className="btn-group">
                                <button type="button" className={`btn btn-xs ${kindOfChart === this.KIND_OF_CHART.LINE ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfChart(this.KIND_OF_CHART.LINE)}>{translate('kpi.organizational_unit.dashboard.line_chart')}</button>
                                <button type="button" className={`btn btn-xs ${kindOfChart === this.KIND_OF_CHART.PIE ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfChart(this.KIND_OF_CHART.PIE)}>{translate('kpi.organizational_unit.dashboard.pie_chart')}</button>
                            </section>
                        </section>
                        <div ref="chart"></div>
                        {kindOfChart === this.KIND_OF_CHART.PIE 
                            && <CustomLegendC3js
                                chart={this.chart}
                                chartId={"distributionOfUnit"}
                                legendId={"distributionOfUnitLegend"}
                                title={`${translate('kpi.evaluation.employee_evaluation.KPI_list')} (${currentKpi.kpis && currentKpi.kpis.length})`}
                                dataChartLegend={dataPieChart && dataPieChart.map(item => item[0])}
                            />
                        }
                    </section>
                    : organizationalUnitKpiLoading && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
}

const connectedDistributionOfOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(DistributionOfOrganizationalUnitKpiChart));
export { connectedDistributionOfOrganizationalUnitKpiChart as DistributionOfOrganizationalUnitKpiChart }
