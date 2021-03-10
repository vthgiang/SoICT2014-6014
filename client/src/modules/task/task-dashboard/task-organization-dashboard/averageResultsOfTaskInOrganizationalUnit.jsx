import React, { useState, useEffect, memo, useRef } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { SelectBox, CustomLegendC3js } from '../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';

function AverageResultsOfTaskInOrganizationalUnit(props) {
    // Khai báo props
    const { translate, tasks, dashboardEvaluationEmployeeKpiSet } = props;

    // Khởi tạo dữ liệu select box
    const CRITERIA = { NOT_COEFFICIENT: 0, COEFFICIENT: 1 };
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

    const TYPEPOINT = { AUTOMAIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 };
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
        infoSearch: {
            criteria: null,
            typePoint: null,
        },
        startMonth: null,
        endMonth: null
    });
    
    // Khai báo state
    const { criteria, typePoint, units, startMonth, endMonth } = state;

    // Khởi tạo ref lưu infosearch cũ
    const ref = useRef({
        criteria: criteria,
        typePoint: typePoint
    });
    const currentState = ref.current;
    const chart = useRef();
    const dataChart = useRef();

    useEffect(() => {
        if (currentState.criteria === criteria && currentState.typePoint === typePoint) {
            if (tasks.organizationUnitTasks) {
                averageChart();
            } 
        }

        // Cập nhật ref
        ref.current = {
            criteria: criteria,
            typePoint: typePoint
        }
    }) 
    

    if (props.startMonth !== startMonth || props.endMonth !== endMonth || props.units !== units) {
        setState({
            ...state,
            startMonth: props.startMonth,
            endMonth: props.endMonth,
            units: props.units
        })
    }

    const handleSelectCriteria = (value) => {
        setState({
            ...state,
            criteria: Number(value[0])
        })
    }

    const handleSelectTypePoint = (value) => {
        setState({
            ...state,
            typePoint: Number(value[0])
        })
    }

    const handleSearchData = () => {
        setState({
            ...state,
            infoSearch: {
                criteria: criteria,
                typePoint: typePoint
            }
        })
    }

    const averageFunction = (sum, coefficient) => {
        if (coefficient !== 0) {
            return sum / coefficient;
        } else {
            return null;
        }
    }

    // Hàm lọc các công việc theo từng tháng
    const filterTasksByMonth = (currentMonth, nextMonth) => {
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
        if (tasks && tasks.organizationUnitTasks && tasks.organizationUnitTasks.tasks) {
            listTask = tasks.organizationUnitTasks.tasks;
        };

        if (listTask) {
            listTask.filter(task => {
                return task?.organizationalUnit?._id
                    && units?.indexOf(task.organizationalUnit._id) !== -1;
            }).map(task => {
                if (task?.evaluations?.length > 0) {
                    task.evaluations.filter(evaluation => {
                        let date = new Date(nextMonth)
                        let month = date.getMonth() + 1
                        let day;
                        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
                            day = 31;
                        } else if (month === 2) {
                            day = 28;
                        } else {
                            day = 30;
                        }
                        let dateNextMonth = date.getFullYear() + '-' + month + '-' + day;
                        if (new Date(evaluation.date) < new Date(dateNextMonth) && new Date(evaluation.date) >= new Date(currentMonth)) {
                            return 1;
                        }

                        return 0;
                    }).map(evaluation => {
                        if (evaluation.results && evaluation.results.length !== 0) {
                            evaluation.results.map(result => {
                                if (task?.organizationalUnit?._id) {
                                    if (criteria === CRITERIA.COEFFICIENT) {
                                        let totalDay = 0;
                                        let startDate = task.startDate && new Date(task.startDate);
                                        let endDate = task.endDate && new Date(task.endDate);
                                        let dateEvaluation = evaluation.date && new Date(evaluation.date);

                                        // Trường hợp công việc hoàn thành trong 1 tháng
                                        if (startDate && endDate && dateEvaluation && startDate.getMonth() === dateEvaluation.getMonth() && endDate.getMonth() === dateEvaluation.getMonth()) {
                                            totalDay = Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
                                        }   // Trường hợp ngày đánh giá cùng tháng vs ngày bắt đầu
                                        else if (startDate && dateEvaluation && startDate.getMonth() === dateEvaluation.getMonth()) {
                                            let lastDayInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
                                            totalDay = Math.round((lastDayInMonth.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
                                        }   // Trường hợp ngày đánh giá cùng tháng vs ngày kết thúc
                                        else if (endDate && dateEvaluation && endDate.getMonth() === dateEvaluation.getMonth()) {
                                            let firstDayInMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                                            totalDay = Math.round((endDate.getTime() - firstDayInMonth.getTime()) / 1000 / 60 / 60 / 24);
                                        }   // Trường hợp còn lại
                                        else if (dateEvaluation) {
                                            let firstDayInMonth = new Date(dateEvaluation.getFullYear(), dateEvaluation.getMonth(), 1);
                                            let lastDayInMonth = new Date(dateEvaluation.getFullYear(), dateEvaluation.getMonth() + 1, 0);
                                            totalDay = Math.round((lastDayInMonth.getTime() - firstDayInMonth.getTime()) / 1000 / 60 / 60 / 24);
                                        }
                            
                                        if (result?.automaticPoint && result?.taskImportanceLevel && dataSumPointAndCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientAutomatic
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumAutomaticPointCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointCoefficient + result?.automaticPoint * result?.taskImportanceLevel * totalDay;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientAutomatic = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientAutomatic + result?.taskImportanceLevel * totalDay;
                                        }
                                        if (result?.employeePoint && dataSumPointAndCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientEmployee
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumEmployeePointCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointCoefficient + result?.employeePoint * result?.taskImportanceLevel * totalDay;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientEmployee = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientEmployee + result?.taskImportanceLevel * totalDay;
                                        }
                                        if (result?.approvedPoint && dataSumPointAndCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumApprovedPointCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientApproved
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumApprovedPointCoefficient = dataSumPointAndCoefficient?.[task.organizationalUnit?._id]?.sumApprovedPointCoefficient + result?.approvedPoint * result?.taskImportanceLevel * totalDay;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumCoefficientApproved = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumCoefficientApproved + result?.taskImportanceLevel * totalDay;
                                        }
                                    } else {
                                        if (result?.automaticPoint
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointNotCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientAutomatic
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumAutomaticPointNotCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumAutomaticPointNotCoefficient + result?.automaticPoint;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumNotCoefficientAutomatic++;
                                        }
                                        if (result.employeePoint
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumEmployeePointNotCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientEmployee
                                        ) {
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumEmployeePointNotCoefficient = dataSumPointAndCoefficient?.[task?.organizationalUnit._id]?.sumEmployeePointNotCoefficient + result?.employeePoint;
                                            dataSumPointAndCoefficient[task.organizationalUnit._id].sumNotCoefficientEmployee++;
                                        }
                                        if (result.approvedPoint
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumApprovedPointNotCoefficient
                                            && dataSumPointAndCoefficient?.[task?.organizationalUnit?._id]?.sumNotCoefficientApproved) {
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
            'month': new Date(currentMonth),
            ...resultAverage
        }
    }

    const setDataAverageChart = () => {
        let month = ['x'], dataChart = {};
        let childrenOrganizationalUnit = [], currentOrganizationalUnit, queue = [];
        let monthIndex = startMonth;

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

        if (childrenOrganizationalUnit && childrenOrganizationalUnit.length !== 0 && units && units.length !== 0) {
            childrenOrganizationalUnit.filter(unit => {
                return units.indexOf(unit.id) !== -1;
            }).map(unit => {
                dataChart[unit.id] = [unit.name]
            })

        }

        while (new Date(monthIndex) <= new Date(endMonth)) {
            let data, nextMonthIndex;

            if (new Number(monthIndex.slice(5, 7)) < 9) {
                nextMonthIndex = monthIndex.slice(0, 4) + '-0' + (new Number(monthIndex.slice(5, 7)) + 1);
            } else if (new Number(monthIndex.slice(5, 7)) < 12) {
                nextMonthIndex = monthIndex.slice(0, 4) + '-' + (new Number(monthIndex.slice(5, 7)) + 1);
            } else {
                nextMonthIndex = (new Number(monthIndex.slice(0, 4)) + 1) + '-' + '01';
            }

            data = filterTasksByMonth(monthIndex, nextMonthIndex);

            month.push(data.month);
            if (units && units.length !== 0) {
                units.map(item => {
                    dataChart[item] && dataChart[item].push(data[item])
                })
            }

            monthIndex = nextMonthIndex;
        }

        return [
            month,
            ...Object.values(dataChart)
        ]
    }

    const removePreviosChart = () => {
        let chart = document.getElementById('averageChartUnitChart');
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    const averageChart = () => {
        removePreviosChart();
        dataChart.current = setDataAverageChart();
        
        chart.current = c3.generate({
            bindto: document.getElementById('averageChartUnitChart'),             // Đẩy chart vào thẻ div có id="chart"

            data: {
                x: 'x',
                columns: dataChart.current,
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
            <section className="form-inline">
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
            </section>
            <section className="form-inline">
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

                <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
            </section>
            <section id={"averageChartUnit"} className="c3-chart-container">
                <div id="averageChartUnitChart"></div>
                <CustomLegendC3js
                    chart={chart.current}
                    chartId={"averageChartUnit"}
                    legendId={"averageChartUnitLegend"}
                    title={dataChart.current && `${translate('general.list_unit')} (${dataChart.current.length - 1})`}
                    dataChartLegend={dataChart.current && dataChart.current.filter((item, index) => index !== 0).map(item => item[0])}
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