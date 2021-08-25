import React, { useState, useEffect, memo, useRef } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { SelectBox, CustomLegendC3js } from '../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';
import dayjs from 'dayjs';

const CRITERIA = { NOT_COEFFICIENT: 0, COEFFICIENT: 1 };
const TYPEPOINT = { AUTOMAIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 };

let INFO_SEARCH = {
    typePoint: TYPEPOINT.AUTOMAIC_POINT,
    criteria: CRITERIA.NOT_COEFFICIENT
}


const averageFunction = (sum, coefficient) => {
    if (coefficient !== 0) {
        return sum / coefficient;
    } else {
        return null;
    }
}

function AverageResultsOfTaskInOrganizationalUnit(props) {
    // Khai báo props
    const { translate, tasks, dashboardEvaluationEmployeeKpiSet, organizationUnitTasks } = props;

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
            value: TYPEPOINT.AUTOMAIC_POINT
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
        userId: localStorage.getItem("userId"),

        criteria: CRITERIA.NOT_COEFFICIENT,
        typePoint: TYPEPOINT.AUTOMAIC_POINT,
        legend: []
    });

    // Khai báo state
    const { criteria, typePoint, legend } = state;
    const { units } = props;

    const chart = useRef();

    // Hàm lọc các công việc theo từng tháng
    const filterTasksByMonth = (startMonth, endMonth) => {
        let dataSumPointAndCoefficient = {}, resultAverage = {};
        let listTask = [];
        if (units && units.length !== 0) {
            units.map(unit => {
                dataSumPointAndCoefficient[unit] = {
                    sumAutomaticPointNotCoefficient: 0, sumAutomaticPointCoefficient: 0, sumNotCoefficientAutomatic: 0, sumCoefficientAutomatic: 0,
                    sumEmployeePointNotCoefficient: 0, sumEmployeePointCoefficient: 0, sumNotCoefficientEmployee: 0, sumCoefficientEmployee: 0,
                    sumApprovedPointNotCoefficient: 0, sumApprovedPointCoefficient: 0, sumNotCoefficientApproved: 0, sumCoefficientApproved: 0
                }
            })
        }
        if (organizationUnitTasks) {
            listTask = organizationUnitTasks;
        };

        if (listTask) {
            listTask.filter(task => {
                return task?.organizationalUnit?._id
                    && units?.indexOf(task.organizationalUnit._id) !== -1;
            }).map(task => {
                if (task?.evaluations?.length > 0) {
                    task.evaluations.filter(evaluation => {
                        let evaluatingMonth = dayjs(evaluation.evaluatingMonth).format("YYYY-MM");
                        if (dayjs(evaluatingMonth).isBetween(startMonth, endMonth, null, '[]')) { // '[]': tham số này check cho phép evaluatingMonth = startMonth hoặ startMonth = endMOnth, ko muốn thì set '()'
                            return 1;
                        }

                        return 0;
                    }).map(evaluation => {
                        if (evaluation.results && evaluation.results.length !== 0) {
                            evaluation.results.map(result => {
                                if (task?.organizationalUnit?._id) {
                                    if (criteria === CRITERIA.COEFFICIENT) {
                                        let totalDay = 0;
                                        let startEvaluation = evaluation.startDate && new Date(evaluation.startDate);
                                        let endEvaluation = evaluation.endDate && new Date(evaluation.endDate);
                                        totalDay = Math.round((endEvaluation.getTime() - startEvaluation.getTime()) / 1000 / 60 / 60 / 24);

                                        if (result?.automaticPoint && result?.taskImportanceLevel && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointCoefficient >= 0
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientAutomatic >= 0
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumAutomaticPointCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointCoefficient + result?.automaticPoint * result?.taskImportanceLevel * totalDay;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientAutomatic = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientAutomatic + result?.taskImportanceLevel * totalDay;
                                        }
                                        if (result?.employeePoint && dataSumPointAndCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointCoefficient >= 0
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientEmployee >= 0
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumEmployeePointCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointCoefficient + result?.employeePoint * result?.taskImportanceLevel * totalDay;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientEmployee = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientEmployee + result?.taskImportanceLevel * totalDay;
                                        }
                                        if (result?.approvedPoint && dataSumPointAndCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumApprovedPointCoefficient >= 0
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientApproved >= 0
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumApprovedPointCoefficient = dataSumPointAndCoefficient?.[task.organizationalUnit?._id]?.sumApprovedPointCoefficient + result?.approvedPoint * result?.taskImportanceLevel * totalDay;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientApproved = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientApproved + result?.taskImportanceLevel * totalDay;
                                        }
                                    } else {
                                        if (result?.automaticPoint
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointNotCoefficient >= 0
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientAutomatic >= 0
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumAutomaticPointNotCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointNotCoefficient + result?.automaticPoint;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumNotCoefficientAutomatic++;
                                        }
                                        if (result.employeePoint
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointNotCoefficient >= 0
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientEmployee >= 0
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumEmployeePointNotCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit._id]?.sumEmployeePointNotCoefficient + result?.employeePoint;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumNotCoefficientEmployee++;
                                        }
                                        if (result.approvedPoint
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumApprovedPointNotCoefficient >= 0
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientApproved >= 0
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumApprovedPointNotCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumApprovedPointNotCoefficient + result?.approvedPoint;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumNotCoefficientApproved++;
                                        }
                                    }
                                }
                            });
                        }
                    })
                }
            });
        }

        if (units && units.length !== 0) {
            units.map(unit => {
                let average;

                if (criteria === CRITERIA.COEFFICIENT) {
                    if (dataSumPointAndCoefficient[unit]) {
                        if (typePoint === TYPEPOINT.AUTOMAIC_POINT) {
                            average = averageFunction(dataSumPointAndCoefficient[unit].sumAutomaticPointCoefficient, dataSumPointAndCoefficient[unit].sumCoefficientAutomatic);
                        } else if (typePoint === TYPEPOINT.APPROVED_POINT) {
                            average = averageFunction(dataSumPointAndCoefficient[unit].sumApprovedPointCoefficient, dataSumPointAndCoefficient[unit].sumCoefficientApproved);
                        } else if (typePoint === TYPEPOINT.EMPLOYEE_POINT) {
                            average = averageFunction(dataSumPointAndCoefficient[unit].sumEmployeePointCoefficient, dataSumPointAndCoefficient[unit].sumCoefficientEmployee)
                        }
                    }

                    resultAverage[unit] = average;
                } else {
                    if (dataSumPointAndCoefficient[unit]) {
                        if (typePoint === TYPEPOINT.AUTOMAIC_POINT) {
                            average = averageFunction(dataSumPointAndCoefficient[unit].sumAutomaticPointNotCoefficient, dataSumPointAndCoefficient[unit].sumNotCoefficientAutomatic);
                        } else if (typePoint === TYPEPOINT.APPROVED_POINT) {
                            average = averageFunction(dataSumPointAndCoefficient[unit].sumApprovedPointNotCoefficient, dataSumPointAndCoefficient[unit].sumNotCoefficientApproved);
                        } else if (typePoint === TYPEPOINT.EMPLOYEE_POINT) {
                            average = averageFunction(dataSumPointAndCoefficient[unit].sumEmployeePointNotCoefficient, dataSumPointAndCoefficient[unit].sumNotCoefficientEmployee);
                        }
                    }

                    resultAverage[unit] = average;
                }
            })
        }
        return {
            ...resultAverage
        }
    }

    useEffect(() => {
        let month = ['x'], dataChart = {};
        let childrenOrganizationalUnit = [], currentOrganizationalUnit, queue = [];

        if (dashboardEvaluationEmployeeKpiSet) {
            currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }
        if (currentOrganizationalUnit) {
            childrenOrganizationalUnit.push(currentOrganizationalUnit);
            queue.push(currentOrganizationalUnit);
            while (queue.length > 0) {
                let v = queue.shift();
                if (v.children) {
                    for (let i = 0; i < v.children.length; i++) {
                        let u = v.children[i];
                        queue.push(u);
                        childrenOrganizationalUnit.push(u);
                    }
                }
            }
        }

        let legend = [];
        if (childrenOrganizationalUnit && childrenOrganizationalUnit.length !== 0 && units && units.length !== 0) {
            childrenOrganizationalUnit.filter(unit => {
                return units.indexOf(unit.id) !== -1;
            }).map(unit => {
                dataChart[unit.id] = [unit.name];
                legend = [...legend, unit.name]
            })

        }

        const period = dayjs(props?.endMonth).diff(props?.startMonth, 'month');
        for (let i = 0; i <= period; i++) {
            let currentMonth = dayjs(props?.startMonth).add(i, 'month').format("YYYY-MM");
            month = [
                ...month,
                dayjs(props?.startMonth).add(i, 'month').format("YYYY-MM-DD"), // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
            ];

            const data = filterTasksByMonth(currentMonth, currentMonth);
            if (units && units.length !== 0) {
                units.map(item => {
                    dataChart[item] && dataChart[item].push(data[item] || 0)
                })
            }
            setState({
                ...state,
                legend,
                dataChart: [
                    month,
                    ...Object.values(dataChart)
                ]
            })
        }
    }, [JSON.stringify(props?.organizationUnitTasks), JSON.stringify(props?.dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit), state.typePoint, state.criteria, props.startMonth, props.endMonth])


    useEffect(() => {
        if (state.dataChart)
            averageChart();
    }, [state.dataChart])

    const handleSelectCriteria = (value) => {
        value = value[0];
        INFO_SEARCH = {
            ...INFO_SEARCH,
            criteria: Number(value)
        }
    }

    const handleSelectTypePoint = (value) => {
        value = value[0];
        INFO_SEARCH = {
            ...INFO_SEARCH,
            typePoint: Number(value)
        }
    }

    const handleSearchData = () => {
        const { criteria, typePoint } = INFO_SEARCH;
        console.log("INFO_SEARCH_HANDLE", INFO_SEARCH)
        setState({
            ...state,
            typePoint,
            criteria
        })
    }

    const removePreviosChart = () => {
        let chart = document.getElementById('averageChartUnitChart');
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    const averageChart = () => {
        removePreviosChart();
        let { dataChart } = state;
        chart.current = c3.generate({
            bindto: document.getElementById('averageChartUnitChart'),             // Đẩy chart vào thẻ div có id="chart"

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
                        <label>Tiêu chí</label>
                        <SelectBox
                            id={`criteriaOfAverageUnitSelectBox`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={CRITERIA_SELECTBOX}
                            multiple={false}
                            onChange={handleSelectCriteria}
                            value={criteria}
                        />
                    </div>
                </div>
                <div className="form-inline" >
                    <div className="form-group">
                        <label>Loại điểm</label>
                        <SelectBox
                            id={`typePointOfAverageResultsTaskSelectBox`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={TYPEPOINT_SELECTBOX}
                            multiple={false}
                            onChange={handleSelectTypePoint}
                            value={typePoint}
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </div>
                </div>
            </div>

            <section id={"averageChartUnit"} className="c3-chart-container">
                <div id="averageChartUnitChart"></div>
                <CustomLegendC3js
                    chart={chart.current}
                    chartId={"averageChartUnit"}
                    legendId={"averageChartUnitLegend"}
                    title={legend && `${translate('general.list_unit')} (${legend?.length - 1})`}
                    dataChartLegend={legend && legend.map(item => item)}
                />
            </section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks, dashboardEvaluationEmployeeKpiSet } = state;
    return { tasks, dashboardEvaluationEmployeeKpiSet }
}
const actions = {

}


const connectedAverageResultsOfTaskInOrganizationalUnit = connect(mapState, actions)(withTranslate(AverageResultsOfTaskInOrganizationalUnit));
export { connectedAverageResultsOfTaskInOrganizationalUnit as AverageResultsOfTaskInOrganizationalUnit };