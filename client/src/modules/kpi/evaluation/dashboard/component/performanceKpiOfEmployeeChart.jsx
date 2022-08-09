import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import { withTranslate } from 'react-redux-multilingual';
import { DashboardEvaluationEmployeeKpiSetAction } from '../redux/actions';

function PerformanceKpiOfEmployeeChart(props) {
    const { translate, user, dashboardEvaluationEmployeeKpiSet } = props;
    const [state, setState] = useState({
        labels: [],
        profilePoint: ['Điểm kinh nghiệm'],
        resultPoint: ['Điểm kết quả thực hiện'],
        progressPoint: ['Điểm quá trình thực hiện']
    }
    );
    const { labels, profilePoint, resultPoint, progressPoint } = state;


    useEffect(() => {
        let users = {};
        let userdepartments = user?.userdepartments;

        if (userdepartments && !userdepartments.length) {
            userdepartments = [user.userdepartments]
        }
        if (userdepartments) {
            let allEmployeesOfUnits = [];
            for (let item of userdepartments) {

                // Lay danh sach tat ca nhan vien cua cac phong ban da chon
                let employeesUnit = item.employees ? Object.values(item.employees) : [];
                let managersUnit = item.managers ? Object.values(item.managers) : [];
                let deputyManagersUnit = item.deputyManagers ? Object.values(item.deputyManagers) : [];
                let employeesArr = [];
                let managersArr = [];
                let deputyManagersArr = [];
                let allEmployees = []
                if (employeesUnit.length > 0) {
                    for (let element of employeesUnit) {
                        employeesArr = employeesArr.concat(element.members)
                    }
                }
                if (managersUnit.length > 0) {
                    for (let element of managersUnit) {
                        managersArr = managersArr.concat(element.members)
                    }
                }
                if (deputyManagersUnit.length > 0) {
                    for (let element of deputyManagersUnit) {
                        deputyManagersArr = deputyManagersArr.concat(element.members)
                    }
                }

                allEmployees = managersArr.concat(deputyManagersArr, employeesArr);
                allEmployeesOfUnits = allEmployeesOfUnits.concat(allEmployees)

            }

            for (let employee of allEmployeesOfUnits) {
                if (!users[employee.id]) {
                    users[employee.id] = employee.id
                }
            }
            props.getEmployeeKpiPerformance(Object.values(users))
        }
    }, [user.userdepartments])

    useEffect(() => {
        let label = [];
        let profile = ['Điểm kinh nghiệm'];
        let result = ['Điểm kết quả thực hiện'];
        let progress = ['Điểm quá trình thực hiện'];
        if (dashboardEvaluationEmployeeKpiSet?.employeeKpiPerformance) {
            for (let item of dashboardEvaluationEmployeeKpiSet.employeeKpiPerformance) {
                label.push(item.name);
                profile.push(item.profilePoint);
                result.push(item.resultPoint);
                progress.push(item.progressPoint);
            }

            setState({
                ...state,
                labels: label,
                profilePoint: profile,
                resultPoint: result,
                progressPoint: progress
            });
        }
    }, [dashboardEvaluationEmployeeKpiSet.employeeKpiPerformance])

    useEffect(() => {
        if (labels.length > 0)
            barChart();
    }, [labels])

    const removePreviousChart = () => {
        const chart = document.getElementById("performanceKpiChart");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const barChart = () => {
        removePreviousChart();
        c3.generate({
            bindto: document.getElementById("performanceKpiChart"),

            data: {
                columns: [
                    profilePoint,
                    progressPoint,
                    resultPoint
                ],
                type: 'bar'
            },

            legend: {
                show: true
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
            },

            axis: {
                x: {
                    type: 'category',
                    categories: labels
                }
            },
        });
    }
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <section id="performanceKpiChart"></section>
            </div>
        </React.Fragment>
    )
}


const mapState = (state) => {
    const { user, tasks, dashboardEvaluationEmployeeKpiSet } = state;
    return { user, tasks, dashboardEvaluationEmployeeKpiSet };
}

const actions = {
    getEmployeeKpiPerformance: DashboardEvaluationEmployeeKpiSetAction.getEmployeeKpiPerformance
};

const connectedPerformanceKpiOfEmployee = connect(mapState, actions)(withTranslate(PerformanceKpiOfEmployeeChart));
export { connectedPerformanceKpiOfEmployee as PerformanceKpiOfEmployeeChart };
