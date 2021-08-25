import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { SelectBox, SelectMulti } from '../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';
import { filterDifference } from '../../../../helpers/taskModuleHelpers';
import dayjs from 'dayjs';

const ROLE = { RESPONSIBLE: 0, ACCOUNTABLE: 1, CONSULTED: 2 };
const CRITERIA = { NOT_COEFFICIENT: 0, COEFFICIENT: 1 };

let INFO_SEARCH = {
    role: [ROLE.RESPONSIBLE],
    criteria: CRITERIA.NOT_COEFFICIENT
}

const averageFunction = (sum, coefficient) => {
    if (coefficient !== 0) {
        return sum / coefficient;
    } else {
        return null;
    }
}

function AverageResultsOfTask(props) {
    // Khai báo props
    const { translate, tasks } = props;

    const ROLE_SELECTBOX = [
        {
            text: translate('task.task_management.responsible'),
            value: ROLE.RESPONSIBLE
        },
        {
            text: translate('task.task_management.accountable'),
            value: ROLE.ACCOUNTABLE
        },
        {
            text: translate('task.task_management.consulted'),
            value: ROLE.CONSULTED
        }
    ];

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

    // Khởi tạo state
    const [state, setState] = useState({
        userId: localStorage.getItem("userId"),

        startMonth: null,
        endMonth: null,
        role: [ROLE.RESPONSIBLE],
        criteria: CRITERIA.NOT_COEFFICIENT
    });

    // Khai báo state
    const { userId, role, criteria } = state;


    // Hàm lọc các công việc theo từng tháng
    const filterTasksByMonth = (startMonth, endMonth) => {
        const { loadingResponsible, loadingConsulted, loadingAccountable } = tasks;
        let averageAutomatic, averageEmployee, averageApproved;
        let sumAutomaticPointNotCoefficient = 0, sumAutomaticPointCoefficient = 0, sumNotCoefficientAutomatic = 0, sumCoefficientAutomatic = 0;
        let sumEmployeePointNotCoefficient = 0, sumEmployeePointCoefficient = 0, sumNotCoefficientEmployee = 0, sumCoefficientEmployee = 0;
        let sumApprovedPointNotCoefficient = 0, sumApprovedPointCoefficient = 0, sumNotCoefficientApproved = 0, sumCoefficientApproved = 0;

        let listTask = [], listTaskByRole = [];

        if (!loadingResponsible && !loadingConsulted && !loadingAccountable) {
            listTaskByRole[ROLE.RESPONSIBLE] = tasks.responsibleTasks ? tasks.responsibleTasks : [];
            listTaskByRole[ROLE.ACCOUNTABLE] = tasks.accountableTasks ? tasks.accountableTasks : [];
            listTaskByRole[ROLE.CONSULTED] = tasks.consultedTasks ? tasks.consultedTasks : [];

            if (role.length !== 0) {
                role.map(role => {
                    listTask = listTask.concat(listTaskByRole[role]);
                })
            }

            listTask = filterDifference(listTask);
        };

        if (listTask) {
            listTask.map(task => {
                task.evaluations.filter(evaluation => {
                    let evaluatingMonth = dayjs(evaluation.evaluatingMonth).format("YYYY-MM");
                    if (dayjs(evaluatingMonth).isBetween(startMonth, endMonth, null, '[]')) { // '[]': tham số này check cho phép evaluatingMonth = startMonth hoặ startMonth = endMOnth, ko muốn thì set '()'
                        return 1;
                    }

                    return 0;
                }).map(evaluation => {
                    evaluation.results.filter(result => {
                        if (result.employee === userId) {
                            return 1;
                        }
                        return 0;
                    }).map(result => {
                        if (criteria === CRITERIA.COEFFICIENT) {
                            let totalDay = 0;
                            let startEvaluation = evaluation.startDate && new Date(evaluation.startDate);
                            let endEvaluation = evaluation.endDate && new Date(evaluation.endDate);
                            totalDay = Math.round((endEvaluation.getTime() - startEvaluation.getTime()) / 1000 / 60 / 60 / 24);

                            if (result.automaticPoint && result?.taskImportanceLevel) {
                                sumAutomaticPointCoefficient = sumAutomaticPointCoefficient + result.automaticPoint * result.taskImportanceLevel * totalDay;
                                sumCoefficientAutomatic = sumCoefficientAutomatic + result.taskImportanceLevel * totalDay;
                            }
                            if (result.employeePoint) {
                                sumEmployeePointCoefficient = sumEmployeePointCoefficient + result.employeePoint * result.taskImportanceLevel * totalDay;
                                sumCoefficientEmployee = sumCoefficientEmployee + result.taskImportanceLevel * totalDay;
                            }
                            if (result.approvedPoint) {
                                sumApprovedPointCoefficient = sumApprovedPointCoefficient + result.approvedPoint * result.taskImportanceLevel * totalDay;
                                sumCoefficientApproved = sumCoefficientApproved + result.taskImportanceLevel * totalDay;
                            }
                        } else {
                            if (result.automaticPoint) {
                                sumAutomaticPointNotCoefficient = sumAutomaticPointNotCoefficient + result.automaticPoint;
                                sumNotCoefficientAutomatic++;
                            }
                            if (result.employeePoint) {
                                sumEmployeePointNotCoefficient = sumEmployeePointNotCoefficient + result.employeePoint;
                                sumNotCoefficientEmployee++;
                            }
                            if (result.approvedPoint) {
                                sumApprovedPointNotCoefficient = sumApprovedPointNotCoefficient + result.approvedPoint;
                                sumNotCoefficientApproved++;
                            }
                        }
                    });
                })
            });
        }

        if (criteria === CRITERIA.COEFFICIENT) {
            averageAutomatic = averageFunction(sumAutomaticPointCoefficient, sumCoefficientAutomatic);
            averageEmployee = averageFunction(sumEmployeePointCoefficient, sumCoefficientEmployee);
            averageApproved = averageFunction(sumApprovedPointCoefficient, sumCoefficientApproved);
        } else {
            averageAutomatic = averageFunction(sumAutomaticPointNotCoefficient, sumNotCoefficientAutomatic);
            averageEmployee = averageFunction(sumEmployeePointNotCoefficient, sumNotCoefficientEmployee);
            averageApproved = averageFunction(sumApprovedPointNotCoefficient, sumNotCoefficientApproved);
        }

        return {
            'automaticPoint': averageAutomatic,
            'employeePoint': averageEmployee,
            'approvedPoint': averageApproved
        }
    }


    useEffect(() => {
        const { startMonth, endMonth } = props;
        let months = [], averageAutomatic = [translate('task.task_management.detail_auto_point')], averageEmployee = [translate('task.task_management.detail_emp_point')], averageApproved = [translate('task.task_management.detail_acc_point')];

        const period = dayjs(endMonth).diff(startMonth, 'month');
        for (let i = 0; i <= period; i++) {
            let currentMonth = dayjs(startMonth).add(i, 'month').format("YYYY-MM");
            months = [
                ...months,
                dayjs(startMonth).add(i, 'month').format("MM-YYYY"), // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
            ];

            const data = filterTasksByMonth(currentMonth, currentMonth);
            if (data) {
                averageAutomatic.push(data.automaticPoint || 0);
                averageEmployee.push(data.employeePoint || 0)
                averageApproved.push(data.approvedPoint || 0)
            }
        }

        months.unshift("x");
        if (months?.length)
            setState({
                ...state,
                dataChart: [
                    months,
                    averageAutomatic,
                    averageEmployee,
                    averageApproved
                ]
            })
    }, [JSON.stringify(props?.tasks?.responsibleTasks), JSON.stringify(props?.tasks?.accountableTasks), JSON.stringify(props?.tasks?.consultedTasks), state.role, state.criteria, props?.startMonth, props?.endMonth])


    const averageChart = () => {
        removePreviosChart();
        const { dataChart } = state;
        let chart = c3.generate({
            bindto: document.getElementById('average-chart'),             // Đẩy chart vào thẻ div có id="chart"

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
                    type: 'categories',
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
            }
        })
    }

    useEffect(() => {
        if (state?.dataChart)
            averageChart();
    }, [state.dataChart])

    const handleSelectRole = (value) => {
        INFO_SEARCH = {
            ...INFO_SEARCH,
            role: value,
        }
    }

    const handleSelectCriteria = (value) => {
        INFO_SEARCH = {
            ...INFO_SEARCH,
            criteria: Number(value[0]),
        }
    }

    const handleSearchData = () => {
        const { criteria, role } = INFO_SEARCH;
        setState({
            ...state,
            criteria,
            role
        })
    }

    const removePreviosChart = () => {
        const chart = document.getElementById('average-chart');
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    return (
        <React.Fragment>
            <div className="qlcv">
                <div className="form-inline" >
                    <div className="form-group">
                        <label style={{ width: '48px', textAlign: 'left' }}>{translate('task.task_management.role')}</label>
                        <SelectMulti
                            key="multiSelectAverageRole"
                            id="multiSelectAverageRole"
                            items={ROLE_SELECTBOX}
                            onChange={handleSelectRole}
                            options={{ allSelectedText: translate('task.task_management.select_all_status') }}
                            value={role}
                        />
                    </div>
                </div>
                <div className="form-inline" >
                    <div className="form-group">
                        <label style={{ width: 'auto' }}>Tiêu chí</label>
                        <SelectBox
                            key="criteriaOfAverageSelectBox"
                            id={`criteriaOfAverageSelectBox`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={CRITERIA_SELECTBOX}
                            multiple={false}
                            onChange={handleSelectCriteria}
                            value={criteria}
                        />
                    </div>
                    <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                </div>
            </div>
            <div id="average-chart"></div>
        </React.Fragment>
    )
}


function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {

}


const connectedAverageResultsOfTask = connect(mapState, actions)(withTranslate(AverageResultsOfTask));
export { connectedAverageResultsOfTask as AverageResultsOfTask };