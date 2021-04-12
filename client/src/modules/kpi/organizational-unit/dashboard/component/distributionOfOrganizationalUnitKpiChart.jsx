import React, {Component, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';

import {createUnitKpiActions} from '../../creation/redux/actions';

import {CustomLegendC3js} from '../../../../../common-components';
import {customAxisC3js} from '../../../../../helpers/customAxisC3js';

import c3 from 'c3';
import 'c3/c3.css';

function DistributionOfOrganizationalUnitKpiChart(props) {
    const DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
    const KIND_OF_CHART = {LINE: 1, PIE: 2};
    const refPieChart = React.createRef();

    const [state, setState] = useState({
        currentRole: null,
        dataStatus: DATA_STATUS.QUERYING,
        kindOfChart: KIND_OF_CHART.LINE,
    });

    const {createKpiUnit, translate} = props;
    const {dataPieChart, kindOfChart} = state;
    let currentKpi, organizationalUnitKpiLoading;

    useEffect(() => {
        async function fecth() {
            await props.getCurrentKPIUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);
            let data = await pieChart(KIND_OF_CHART.LINE);

            await setState({
                ...state,
                currentRole: localStorage.getItem("currentRole"),
                dataStatus: DATA_STATUS.QUERYING,
                chart: data?.chart,
                dataPieChart: data?.dataPieChart
            })
        }

        fecth()
    }, []);


    useEffect(() => {
        props.getCurrentKPIUnit(state.currentRole, props.organizationalUnitId, props.month);
        setState({
            ...state,
            dataStatus: DATA_STATUS.QUERYING,
        });

    }, [props.organizationalUnitId, props.month]);

    useEffect(() => {
        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (props.createKpiUnit.currentKPI) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE,
                });
            }

        } else if (state.dataStatus === DATA_STATUS.AVAILABLE) {
            let data = pieChart(state.kindOfChart);

            setState({
                ...state,
                dataStatus: DATA_STATUS.FINISHED,
                chart: data?.chart,
                dataPieChart: data?.dataPieChart
            });
        }
    });

    useEffect(() => {
        if (!props.createKpiUnit.currentKPI) {
            setState({
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
            });
        }
    }, [props.createKpiUnit.currentKPI])
    
    if (props.organizationalUnitId !== state.organizationalUnitId || props.month !== state.month) {
        setState({
            ...state,
            organizationalUnitId: props.organizationalUnitId,
            month: props.month
        })
    }

    const setDataPieChart = () => {
        const {createKpiUnit} = props;
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
    };

    function removePreviousChart() {
        const chart = refPieChart.current;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const pieChart = (kindOfChart) => {
        const {translate} = props;
        removePreviousChart();

        let dataLineChart = [
            ['x'],
            [translate('kpi.organizational_unit.dashboard.trend_chart.weight')]
        ];
        let dataPieChart = setDataPieChart();
        let data, tooltip;

        if (kindOfChart === KIND_OF_CHART.LINE) {
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

        if (kindOfChart === KIND_OF_CHART.LINE) {
            data = {
                x: 'x',
                columns: dataLineChart,
            }
            tooltip = dataLineChart?.[0]?.filter((item, index) => index > 0)
        } else if (kindOfChart === KIND_OF_CHART.PIE) {
            data = {
                x: null,
                columns: dataPieChart,
                type: 'pie'
            }
            tooltip = dataPieChart?.map(item => item?.[0])
        }

        let chart = c3.generate({
            bindto: "#abc",

            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            data: data,

            tooltip: {
                format: {
                    title: function (d) {
                        if (tooltip?.length > 0)
                            return tooltip?.[d];
                    }
                }
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('distributionOfUnit', tooltip, index);
                            return result;
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
                show: kindOfChart === KIND_OF_CHART.LINE
            }
        });

        return {
            chart,
            dataPieChart
        }
    };

    const handleSelectKindOfChart = (value) => {
        let data = pieChart(Number(value));

        setState({
            ...state,
            kindOfChart: Number(value),
            chart: data?.chart,
            dataPieChart: data?.dataPieChart
        })
    };

    if (createKpiUnit) {
        currentKpi = createKpiUnit.currentKPI;
        organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading
    }

    return (
        <React.Fragment>
            {currentKpi ?
                <section id={"distributionOfUnit"} className="c3-chart-container">
                    <section style={{textAlign: "right"}}>
                        <section className="btn-group">
                            <button type="button"
                                    className={`btn btn-xs ${kindOfChart === KIND_OF_CHART.LINE ? 'btn-danger' : null}`}
                                    onClick={() => handleSelectKindOfChart(KIND_OF_CHART.LINE)}>{translate('kpi.organizational_unit.dashboard.line_chart')}</button>
                            <button type="button"
                                    className={`btn btn-xs ${kindOfChart === KIND_OF_CHART.PIE ? 'btn-danger' : null}`}
                                    onClick={() => handleSelectKindOfChart(KIND_OF_CHART.PIE)}>{translate('kpi.organizational_unit.dashboard.pie_chart')}</button>
                        </section>
                    </section>
                    <div ref={refPieChart} id={"abc"} > </div>
                    {kindOfChart === KIND_OF_CHART.PIE
                    && <CustomLegendC3js
                        chart={state.chart}
                        chartId={"distributionOfUnit"}
                        legendId={"distributionOfUnitLegend"}
                        title={state.dataPieChart && `${translate('kpi.evaluation.employee_evaluation.KPI_list')} (${currentKpi.kpis && currentKpi.kpis.length})`}
                        dataChartLegend={state.dataPieChart && state.dataPieChart.map(item => item[0])}
                    />
                    }
                </section>
                : organizationalUnitKpiLoading &&
                <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
            }
        </React.Fragment>
    )
}

function mapState(state) {
    const {createKpiUnit} = state;
    return {createKpiUnit};
}

const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
};

const connectedDistributionOfOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(DistributionOfOrganizationalUnitKpiChart));
export {connectedDistributionOfOrganizationalUnitKpiChart as DistributionOfOrganizationalUnitKpiChart}
