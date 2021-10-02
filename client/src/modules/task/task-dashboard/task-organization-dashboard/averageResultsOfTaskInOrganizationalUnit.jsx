import React, { useState, useEffect, memo, useRef } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { SelectBox, CustomLegendC3js } from '../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';
import dayjs from 'dayjs';

const CRITERIA = { NOT_COEFFICIENT: 0, COEFFICIENT: 1 };
const TYPEPOINT = { AUTOMATIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 };

let DATA_SEARCH = {
    typePoint: TYPEPOINT.AUTOMATIC_POINT,
    criteria: CRITERIA.NOT_COEFFICIENT
}
function AverageResultsOfTaskInOrganizationalUnit(props) {
    // Khai báo props
    const { translate } = props;
    const { taskDashboardCharts } = props.tasks

    // Khởi tạo dữ liệu select box
    const CRITERIA_SELECTBOX = [
        {
            text: translate('task.task_management.detail_not_coefficient'),
            value: CRITERIA.NOT_COEFFICIENT
        },
        {
            text: translate('task.task_management.detail_coefficient'),
            value: CRITERIA.COEFFICIENT
        }
    ];

    const TYPEPOINT_SELECTBOX = [
        {
            text: translate('task.task_management.detail_auto_point'),
            value: TYPEPOINT.AUTOMATIC_POINT
        },
        {
            text: translate('task.task_management.detail_emp_point'),
            value: TYPEPOINT.EMPLOYEE_POINT
        },
        {
            text: translate('task.task_management.detail_acc_point'),
            value: TYPEPOINT.APPROVED_POINT
        }
    ];

    // Khởi tạo state
    const [state, setState] = useState({
        dataChart: [],
        legend: [],
    });

    // Khai báo state
    const { legend } = state;

    const CHART = useRef()
    const refMultiLineChart = React.createRef()
    useEffect(() => {
        let data = getData("average-results-chart")
        if (data)
            setState({
                ...state,
                dataChart: data.dataChart,
                legend: data.legend
            })
    }, [JSON.stringify(taskDashboardCharts)])

    useEffect(() => {
        if (state.dataChart)
            averageChart();
    }, [JSON.stringify(state.dataChart)])

    const handleSelectCriteria = (value) => {
        value = value[0];
        DATA_SEARCH = {
            ...DATA_SEARCH,
            criteria: Number(value)
        }
        props.handleChangeDataSearch("average-results-chart", { criteria: Number(value) })
    }

    const handleSelectTypePoint = (value) => {
        value = value[0];
        DATA_SEARCH = {
            ...DATA_SEARCH,
            typePoint: Number(value)
        }
        props.handleChangeDataSearch("average-results-chart", { typePoint: Number(value) })
    }

    const handleSearchData = () => {
        let dataSearch = {
            "average-results-chart": {
                typePoint: DATA_SEARCH.typePoint,
                criteria: DATA_SEARCH.criteria
            }
        }
        props.getDataSearchChart(dataSearch)
    }

    const removePreviousChart = () => {
        const chart = refMultiLineChart.current;
        if (chart)
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
    }
    function getData(chartName) {
        let dataChart;
        let data = taskDashboardCharts?.[chartName]
        if (data) {
            dataChart = data
        }
        return dataChart;
    }
    const averageChart = () => {
        removePreviousChart();
        const { dataChart } = state;
        CHART.current = c3.generate({
            bindto: refMultiLineChart.current,             // Đẩy chart vào thẻ div có id="chart"

            data: {
                x: 'x',
                columns: dataChart,
            },

            // Căn lề biểu đồ
            padding: {
                top: 20,
                right: 20,
                bottom: 20
            },

            axis: {                                // Config trục tọa độ
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
                        text: 'Điểm',
                        position: 'outer-right'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            },

            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        return value.toFixed(2);
                    }
                }
            },

            legend: {
                show: false
            }
        })
    }
    return (
        <React.Fragment>
            <div className="qlcv">
                <div className="form-inline" >
                    <div className="form-group">
                        <label>{translate('task.task_management.criteria')}</label>
                        <SelectBox
                            id={`criteriaOfAverageUnitSelectBox`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={CRITERIA_SELECTBOX}
                            multiple={false}
                            onChange={handleSelectCriteria}
                            value={DATA_SEARCH.criteria}
                        />
                    </div>
                </div>
                <div className="form-inline" >
                    <div className="form-group">
                        <label>{translate('task.task_management.type_of_point')}</label>
                        <SelectBox
                            id={`typePointOfAverageResultsTaskSelectBox`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={TYPEPOINT_SELECTBOX}
                            multiple={false}
                            onChange={handleSelectTypePoint}
                            value={DATA_SEARCH.typePoint}
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </div>
                </div>
            </div>

            <section id={"averageChartUnit"} className="c3-chart-container">
                <div ref={refMultiLineChart}></div>
                <CustomLegendC3js
                    chart={CHART.current}
                    chartId={"averageChartUnit"}
                    legendId={"averageChartUnitLegend"}
                    title={legend && `${translate('general.list_unit')} (${legend?.length})`}
                    dataChartLegend={legend && legend}
                />
            </section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state
    return { tasks }
}
const actions = {

}


const connectedAverageResultsOfTaskInOrganizationalUnit = connect(mapState, actions)(withTranslate(AverageResultsOfTaskInOrganizationalUnit));
export { connectedAverageResultsOfTaskInOrganizationalUnit as AverageResultsOfTaskInOrganizationalUnit };