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

function DomainOfTaskResultsChart(props) {
    const { translate, TaskOrganizationUnitDashboard } = props;
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

    let DATA_SEARCH = {
        role: [ROLE.RESPONSIBLE],
        typePoint: TYPEPOINT.AUTOMAIC_POINT,
    };
    const CHART = React.createRef();

    const [state, setState] = useState(() => {
        return {
            aPeriodOfTime: true,
            userId: localStorage.getItem("userId"),
            role: DATA_SEARCH.role,
            typePoint: DATA_SEARCH.typePoint,
        }
    })
    const { typePoint, role } = state;

    // Hàm lọc các công việc theo từng tháng
    const filterTasksByMonth = (startMonth, endMonth) => {
        console.log('=============================', startMonth)
        const { tasks, TaskOrganizationUnitDashboard, units, organizationUnitTasks } = props;
        const { role, userId, typePoint } = state;

        let results = [], maxResult, minResult;
        let listTask = [], listTaskByRole = [];

        if (TaskOrganizationUnitDashboard) {
            listTask = organizationUnitTasks;
        }
        else if (tasks.responsibleTasks && tasks.accountableTasks && tasks.consultedTasks) {
            listTaskByRole[ROLE.RESPONSIBLE] = tasks.responsibleTasks;
            listTaskByRole[ROLE.ACCOUNTABLE] = tasks.accountableTasks;
            listTaskByRole[ROLE.CONSULTED] = tasks.consultedTasks;

            if (role.length !== 0) {
                role.map(role => {
                    listTask = listTask.concat(listTaskByRole[role]);
                })
            }
            // console.log('listTaskByRole', listTaskByRole)
            listTask = filterDifference(listTask);
        };

        if (listTask) {
            listTask.map(task => {
                task.evaluations.filter(evaluation => {
                    let evaluatingMonth = dayjs(evaluation.evaluatingMonth).format("YYYY-MM");
                    // console.log('evaluatingMonth', evaluatingMonth, task.name)
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
                            case TYPEPOINT.AUTOMAIC_POINT:
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
    }, [props?.startMonth, props?.endMonth, JSON.stringify(props?.units), state.role, state.typePoint, JSON.stringify(props?.organizationUnitTasks),
    JSON.stringify(props?.tasks?.responsibleTasks), JSON.stringify(props?.tasks?.accountableTasks), JSON.stringify(props?.tasks?.consultedTasks)])

    useEffect(() => {
        if (state?.dataChart)
            domainChart();
    }, [state.dataChart])


    const handleSelectRole = (value) => {
        let role = value.map(item => Number(item));
        DATA_SEARCH.role = role;
    }

    const handleSelectTypePoint = (value) => {
        DATA_SEARCH.typePoint = Number(value[0]);
    }

    const handleSearchData = () => {
        setState(state => {
            return {
                ...state,
                role: DATA_SEARCH.role,
                typePoint: DATA_SEARCH.typePoint
            }
        })
    }


    const removePreviosChart = () => {
        const chart = CHART.current;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    const domainChart = () => {
        removePreviosChart();
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
                                value={role}
                            />
                        </div>
                    </div>
                }
                <div className="form-inline" >
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                        <SelectBox
                            id={`typePointOfResultsTaskSelectBox`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={TYPEPOINT_SELECTBOX}
                            multiple={false}
                            onChange={handleSelectTypePoint}
                            value={typePoint}
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
