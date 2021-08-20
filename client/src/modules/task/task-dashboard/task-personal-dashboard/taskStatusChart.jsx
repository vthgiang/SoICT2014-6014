import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { SelectMulti } from '../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';
import { filterDifference } from '../../../../helpers/taskModuleHelpers';

import c3 from 'c3';
import 'c3/c3.css';

function TaskStatusChart(props) {
    // Khai báo props
    const { translate, TaskOrganizationUnitDashboard, tasks, organizationUnitTasks } = props;

    const ROLE = { RESPONSIBLE: 1, ACCOUNTABLE: 2, CONSULTED: 3, INFORMED: 4, CREATOR: 5 };
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
        },
        {
            text: translate('task.task_management.informed'),
            value: ROLE.INFORMED
        },
        {
            text: translate('task.task_management.creator'),
            value: ROLE.CREATOR
        }
    ]

    const [state, setState] = useState({
        role: [ROLE.RESPONSIBLE]
    });

    // Khai báo state
    const { role } = state;

    useEffect(() => {
        if ((tasks.responsibleTasks
            && tasks.accountableTasks
            && tasks.consultedTasks
            && tasks.informedTasks
            && tasks.creatorTasks) || (organizationUnitTasks)
        ) {
            pieChart();
        }
    })

    const handleSelectRole = (value) => {
        let role = value.map(item => Number(item));
        setState(state => {
            return {
                ...state,
                role: role
            }
        })
    }

    // Thiết lập dữ liệu biểu đồ
    const setDataPieChart = () => {
        let dataPieChart, numberOfInprocess = 0, numberOfWaitForApproval = 0, numberOfFinished = 0, numberOfDelayed = 0, numberOfCanceled = 0;
        let listTask = [], listTaskByRole = [];
        if (TaskOrganizationUnitDashboard) { // neu la listTask cua organizationUnit
            listTask = organizationUnitTasks && organizationUnitTasks;
        }
        else if (tasks && tasks.responsibleTasks && tasks.accountableTasks && tasks.consultedTasks && tasks.informedTasks && tasks.creatorTasks) {
            listTaskByRole[ROLE.RESPONSIBLE] = tasks.responsibleTasks;
            listTaskByRole[ROLE.ACCOUNTABLE] = tasks.accountableTasks;
            listTaskByRole[ROLE.CONSULTED] = tasks.consultedTasks;
            listTaskByRole[ROLE.INFORMED] = tasks.informedTasks;
            listTaskByRole[ROLE.CREATOR] = tasks.creatorTasks;

            if (role && role.length !== 0) {
                role.map(role => {
                    listTask = listTask.concat(listTaskByRole[role]);
                })
            }

            listTask = filterDifference(listTask);
        };
        if (listTask) {
            listTask.map(task => {
                switch (task.status) {
                    case "inprocess":
                        numberOfInprocess++;
                        break;
                    case "wait_for_approval":
                        numberOfWaitForApproval++;
                        break;
                    case "finished":
                        numberOfFinished++;
                        break;
                    case "delayed":
                        numberOfDelayed++;
                        break;
                    case "canceled":
                        numberOfCanceled++;
                        break;
                }
            });
        }

        dataPieChart = [
            [translate('task.task_management.inprocess'), numberOfInprocess],
            [translate('task.task_management.wait_for_approval'), numberOfWaitForApproval],
            [translate('task.task_management.finished'), numberOfFinished],
            [translate('task.task_management.delayed'), numberOfDelayed],
            [translate('task.task_management.canceled'), numberOfCanceled],
        ];

        return dataPieChart;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    const removePreviosChart = () => {
        const chart = document.getElementById('pie-chart-status');
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        removePreviosChart();

        let dataPieChart = setDataPieChart();
        // console.log('dataPieChart', dataPieChart)
        let chart = c3.generate({
            bindto: document.getElementById('pie-chart-status'),

            data: {                                 // Dữ liệu biểu đồ
                columns: dataPieChart,
                type: 'pie',
            },

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    value: function (value, ratio, id, index) {
                        return value;

                    }
                }
            }
        });
    }

    return (
        <React.Fragment>
            {!TaskOrganizationUnitDashboard &&
                <div className="qlcv">
                    <div className="form-inline" >
                        <div className="form-group">
                            <label style={{ width: 'auto' }}>{translate('task.task_management.role')}</label>
                            <SelectMulti
                                id={`roleOfStatusTaskSelectBox`}
                                items={ROLE_SELECTBOX}
                                multiple={true}
                                onChange={handleSelectRole}
                                options={{ allSelectedText: translate('task.task_management.select_all_status') }}
                                value={role} />
                        </div>
                    </div>
                </div>
            }

            <section id="pie-chart-status"></section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {
}

const connectedTaskStatusChart = connect(mapState, actions)(withTranslate(TaskStatusChart));
export { connectedTaskStatusChart as TaskStatusChart };