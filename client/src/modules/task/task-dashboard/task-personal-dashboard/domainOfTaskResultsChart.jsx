import c3 from 'c3';
import 'c3/c3.css';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, SelectMulti } from '../../../../common-components/index';
import { filterDifference } from '../../../../helpers/taskModuleHelpers';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween)

const ROLE = { RESPONSIBLE: 0, ACCOUNTABLE: 1, CONSULTED: 2 };
const TYPEPOINT = { AUTOMATIC_POINT: 0, EMPLOYEE_POINT: 1, APPROVED_POINT: 2 };
let DATA_SEARCH = {
    role: [ROLE.RESPONSIBLE],
    typePoint: TYPEPOINT.AUTOMATIC_POINT,
};
function DomainOfTaskResultsChart(props) {
    const { translate, TaskOrganizationUnitDashboard } = props;
    const { taskDashboardCharts } = props.tasks
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
    const LABEL = {
        MAX: translate('task.task_management.dashboard_max'),
        MIN: translate('task.task_management.dashboard_min')
    }

    const CHART = React.createRef();

    const [state, setState] = useState(() => {
        return {
            aPeriodOfTime: true,
            userId: localStorage.getItem("userId"),
            role: DATA_SEARCH.role,
            typePoint: DATA_SEARCH.typePoint,
        }
    })

    // Hàm lọc các công việc theo từng tháng
    const filterTasksByMonth = (startMonth, endMonth) => {
        const { tasks, units } = props;
        const { userId } = state;
        const { typePoint, role } = DATA_SEARCH;
        let results = [], maxResult, minResult;
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
                        if (units || (result.employee === userId)) {
                            return 1;
                        }
                        return 0;
                    }).map(result => {
                        // console.log('resultEvalue', result, typePoint);
                        switch (typePoint) {
                            case TYPEPOINT.AUTOMATIC_POINT:
                                results.push(result.automaticPoint);
                                break;
                            case TYPEPOINT.EMPLOYEE_POINT:
                                results.push(result.employeePoint);
                                break;
                            case TYPEPOINT.APPROVED_POINT:
                                results.push(result.approvedPoint);
                                break;
                        }

                    });
                })
            });
        }

        if (results.length === 0) {
            maxResult = null;
            minResult = null;
        } else {
            maxResult = Math.max.apply(Math, results);
            minResult = Math.min.apply(Math, results);
        }

        return {
            'max': maxResult,
            'min': minResult
        }
    }

    useEffect(() => {
        if (TaskOrganizationUnitDashboard) {
            let dataChart = getDataChart("task-results-domain-chart");
            if (dataChart) {
                dataChart[1][0] = LABEL.MAX;
                dataChart[2][0] = LABEL.MIN;
                setState({
                    ...state,
                    dataChart: dataChart
                })
            }

        }
        else {
            const { translate } = props;
            const { startMonth, endMonth } = props; // cha truyền xuống

            let month = [], maxResults = [translate('task.task_management.dashboard_max')], minResults = [translate('task.task_management.dashboard_min')];

            const period = dayjs(endMonth).diff(startMonth, 'month');
            let data;

            for (let i = 0; i <= period; i++) {
                let currentMonth = dayjs(startMonth).add(i, 'month').format("YYYY-MM");
                month = [
                    ...month,
                    dayjs(startMonth).add(i, 'month').format("MM-YYYY"), // dayjs("YYYY-MM").add(number, 'month').format("YYYY-MM-DD")
                ];
                data = filterTasksByMonth(currentMonth, currentMonth);
                if (data) {
                    maxResults.push(data.max);
                    minResults.push(data.min)
                }
            }
            month.unshift("x");

            if (month?.length)
                setState({
                    ...state,
                    dataChart: [
                        month,
                        maxResults,
                        minResults
                    ]
                })
        }

    }, [props?.startMonth, props?.endMonth, state.role, state.typePoint, JSON.stringify(taskDashboardCharts),
    JSON.stringify(props?.tasks?.responsibleTasks), JSON.stringify(props?.tasks?.accountableTasks), JSON.stringify(props?.tasks?.consultedTasks)])

    useEffect(() => {
        if (state?.dataChart)
            domainChart();
    }, [state.dataChart])

    function getDataChart(chartName) {
        let dataChart;
        let data = taskDashboardCharts?.[chartName]
        if (data) {
            dataChart = data.dataChart
        }
        return dataChart;
    }
    const handleSelectRole = (value) => {
        let role = value.map(item => Number(item));
        DATA_SEARCH = {
            ...DATA_SEARCH,
            role: role
        }
    }

    const handleSelectTypePoint = (value) => {
        DATA_SEARCH = {
            ...DATA_SEARCH,
            typePoint: Number(value[0])
        }
        if (TaskOrganizationUnitDashboard) {
            props.handleChangeDataSearch("task-results-domain-chart", { typePoint: Number(value[0]) })
        }
    }

    const handleSearchData = () => {
        //dashboard cv đơn vị
        if (TaskOrganizationUnitDashboard) {
            let dataSearch = {
                "task-results-domain-chart": {
                    typePoint: DATA_SEARCH.typePoint
                }
            }
            props.getDataSearchChart(dataSearch)
        }
        //dashboard cv cá nhân
        else {
            setState({ //setState để component render lại, vẽ ra biểu đồ mới 
                ...state,
                role: DATA_SEARCH.role,
                typePoint: DATA_SEARCH.typePoint
            })
        }
    }


    const removePreviousChart = () => {
        const chart = CHART.current;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    const domainChart = () => {
        removePreviousChart();
        const { dataChart } = state;
        c3.generate({
            bindto: CHART.current,

            data: {
                x: 'x',
                columns: dataChart,
                type: 'area'
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
        })
    }
    return (
        <React.Fragment>
            <div className="qlcv">
                {!TaskOrganizationUnitDashboard
                    &&
                    <div className="form-inline" >
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('task.task_management.role')}</label>
                            <SelectMulti
                                id="multiSelectDomainOfTaskResults"
                                items={ROLE_SELECTBOX}
                                onChange={handleSelectRole}
                                options={{ allSelectedText: translate('task.task_management.select_all_status') }}
                                value={DATA_SEARCH.role}
                            />
                        </div>
                    </div>
                }
                <div className="form-inline" >
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('task.task_management.type_of_point')}</label>
                        <SelectBox
                            id={`typePointOfResultsTaskSelectBox`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={TYPEPOINT_SELECTBOX}
                            multiple={false}
                            onChange={handleSelectTypePoint}
                            value={DATA_SEARCH.typePoint}
                        />
                    </div>
                    <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                </div>
            </div>
            <div ref={CHART}></div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}

const actions = {
}

const connectedDomainOfTaskResultsChart = connect(mapState, actions)(withTranslate(DomainOfTaskResultsChart));
export { connectedDomainOfTaskResultsChart as DomainOfTaskResultsChart };
