import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DateTimeConverter, SelectBox, SelectMulti } from '../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';

function AverageResultsOfTask(props) {
    // Khai báo props
    const { translate, tasks } = props;

    const ROLE = { RESPONSIBLE: 0, ACCOUNTABLE: 1, CONSULTED: 2 };
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

    // Khởi tạo state
    const [state, setState] = useState({
        userId: localStorage.getItem("userId"),

        startMonth: null,
        endMonth: null,
    });
    const [role, setRole] = useState([ROLE.RESPONSIBLE]);
    const [criteria, setCriteria] = useState(CRITERIA.NOT_COEFFICIENT);

    // Khai báo state
    const { userId, startMonth, endMonth } = state;

    // Khởi tạo ref lưu infosearch cũ
    const ref = useRef({
        criteria: criteria,
        role: role
    });
    const currentState = ref.current;

    useEffect(() => {
        if (currentState.criteria === criteria && currentState.role === role) {
            if (tasks.responsibleTasks
                && tasks.accountableTasks
                && tasks.consultedTasks
            ) {
                averageChart();
            }
        }

        // Cập nhật ref
        ref.current = {
            criteria: criteria,
            role: role
        }
    })

    if (props.startMonth !== startMonth || props.endMonth !== endMonth) {
        setState({
            ...state,
            startMonth: props.startMonth,
            endMonth: props.endMonth
        })
    }

    const handleSelectRole = (value) => {
        let roleSelect = value.map(item => Number(item));
        setRole(roleSelect);
    }

    const handleSelectCriteria = (value) => {
        setCriteria(Number(value[0]));
    }

    const handleSearchData = () => {
        setState({
            ...state,
            infoSearch: {
                criteria: criteria,
                role: role
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

    // Lọc công việc trùng lặp
    const filterDuplicateTask = (listTask) => {
        let idArray = listTask.map(item => item && item._id);
        idArray = idArray.map((item, index, array) => {
            if (array.indexOf(item) === index) {
                return index;
            } else {
                return false
            }
        })
        idArray = idArray.filter(item => listTask[item]);
        let listTaskNotDuplicate = idArray.map(item => {
            return listTask[item]
        })

        return listTaskNotDuplicate;
    }

    // Hàm lọc các công việc theo từng tháng
    const filterTasksByMonth = (currentMonth, nextMonth) => {
        let averageAutomatic, averageEmployee, averageApproved;
        let sumAutomaticPointNotCoefficient = 0, sumAutomaticPointCoefficient = 0, sumNotCoefficientAutomatic = 0, sumCoefficientAutomatic = 0;
        let sumEmployeePointNotCoefficient = 0, sumEmployeePointCoefficient = 0, sumNotCoefficientEmployee = 0, sumCoefficientEmployee = 0;
        let sumApprovedPointNotCoefficient = 0, sumApprovedPointCoefficient = 0, sumNotCoefficientApproved = 0, sumCoefficientApproved = 0;

        let listTask = [], listTaskByRole = [];

        if (tasks.responsibleTasks && tasks.accountableTasks && tasks.consultedTasks) {
            listTaskByRole[ROLE.RESPONSIBLE] = tasks.responsibleTasks;
            listTaskByRole[ROLE.ACCOUNTABLE] = tasks.accountableTasks;
            listTaskByRole[ROLE.CONSULTED] = tasks.consultedTasks;

            if (role.length !== 0) {
                role.map(role => {
                    listTask = listTask.concat(listTaskByRole[role]);
                })
            }

            listTask = filterDuplicateTask(listTask);
        };

        if (listTask) {
            listTask.map(task => {
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
                    evaluation.results.filter(result => {
                        if (result.employee === userId) {
                            return 1;
                        }
                        return 0;
                    }).map(result => {
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


                            if (result.automaticPoint && result.taskImportanceLevel) {
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
            'month': new Date(currentMonth),
            'automaticPoint': averageAutomatic,
            'employeePoint': averageEmployee,
            'approvedPoint': averageApproved
        }
    }

    const setDataAverageChart = () => {
        let month = ['x'], averageAutomatic = [translate('task.task_management.detail_auto_point')], averageEmployee = [translate('task.task_management.detail_emp_point')], averageApproved = [translate('task.task_management.detail_acc_point')];
        let monthIndex = startMonth;
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
            averageAutomatic.push(data.automaticPoint || 0);
            averageEmployee.push(data.employeePoint || 0)
            averageApproved.push(data.approvedPoint || 0)

            monthIndex = nextMonthIndex;
        }
        return [
            month,
            averageAutomatic,
            averageEmployee,
            averageApproved
        ]
    }

    const removePreviosChart = () => {
        const chart = document.getElementById('average-chart');
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    const averageChart = () => {
        removePreviosChart();
        let dataChart = setDataAverageChart();
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
            }
        })
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