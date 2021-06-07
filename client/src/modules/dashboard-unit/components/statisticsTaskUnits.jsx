import React, { useEffect, useState } from "react";
import { connect } from "react-redux"
import { withTranslate } from "react-redux-multilingual"
import arrayToTree from 'array-to-tree';

import { taskManagementActions } from '../../task/task-management/redux/actions';

import { DetailOfTaskDialogModal } from '../../kpi/statistic/component/detailOfTaskDialogModal'

function StatisticsTaskUnits (props) {
    const { organizationalUnits, monthStatistics } = props
    const { translate, tasks } = props

    const [ currentListTask, setCurrentListTask ] = useState([])
    useEffect(() => {
        let organizationalUnitIds = organizationalUnits?.map(item => item?._id)
        props.getTaskInOrganizationUnitByMonth(organizationalUnitIds, monthStatistics, monthStatistics)
    }, [JSON.stringify(props.organizationalUnits)])

    const handleShowTask = (tasks) => {
        setCurrentListTask(tasks)
    }

    const showNodeContent = (translate, data) => {
        let totalPoint = 0, totalDays = 0;

        // Loc CV theo don vi
        let currentMonth = new Date(monthStatistics)
        let nextMonth = new Date(monthStatistics)
        nextMonth.setMonth(nextMonth.getMonth() + 1)

        if (data?.tasks?.length > 0) {
            data.tasks.map(task => {
                //  Loc danh gia theo thang
                if (task?.evaluations?.length > 0) {
                    task.evaluations.filter(evaluation => {
                        if (new Date(evaluation.evaluatingMonth) < nextMonth && new Date(evaluation.evaluatingMonth) >= currentMonth) {
                            return 1;
                        }
            
                        return 0;
                    }).map(eva => {
                        let startDate = new Date(eva?.startDate)
                        let endDate = new Date(eva?.endDate)

                        let days = (endDate?.getTime() - startDate.getTime())/(24*3600*1000) 
                        totalPoint = totalPoint + (eva?.results?.[0]?.automaticPoint ?? 0) * (days && !isNaN(days) ? days : 0)
                        totalDays = totalDays + (days && !isNaN(days) ? days : 0)
                    })
                }
            })
        }
        
        let pointShow = totalDays ? Math.round(totalPoint/totalDays) : null
        let titleShow = translate('kpi.evaluation.dashboard.auto_point')

        return (
            <div key={data.organizationalUnitName} className={`tf-nc ${!data.parent_id && "bg bg-primary"}`} style={{
                minWidth: '120px',
                border: 'none',
                padding: '9px 12px',
                textAlign: 'center',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                borderRadius: '5px',
                backgroundColor: data.parent_id ? "fff" : "#4797b9"

            }}>
                <div>
                    <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{`${data.organizationalUnitName}`}</h5>
                    <div className="progress-weigth-kpi" style={{ backgroundColor: data.parent_id ? "#8a8a8a" : "#676767" }}>
                        <div className="fillmult" data-width={`${pointShow}%`} style={{ width: `${pointShow}%`, backgroundColor: pointShow < 50 ? "#dc0000" : "rgb(76 179 99)" }}></div>
                        <a title={titleShow} className="perc">{`${!pointShow && pointShow !== 0 ? translate('kpi.evaluation.employee_evaluation.not_avaiable') : pointShow + '/100'}`}</a>
                    </div>
                    <a className="kpi-number-target" data-toggle="modal" data-target="#modal-task-detail" data-backdrop="static" data-keyboard="false" onClick={() => handleShowTask(data.tasks)} style={{ fontSize: "13px", cursor: "pointer" }}>{translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')}: {data?.tasks?.length}</a>
                </div>
            </div>
        )
    }

    const displayTreeView = (translate, data) => {
        if (data) {
            if (!data.children) {
                return (
                    <li key={data.id}>
                        {showNodeContent(translate, data)}
                    </li>
                )
            }

            return (
                <li key={data.id}>
                    {showNodeContent(translate, data)}
                    <ul>
                        {
                            data.children.map(tag => displayTreeView(translate, tag))
                        }
                    </ul>
                </li>
            )
        } else {
            return null
        }
    }

    let statisticsTaskUnits = []
    let listTask = tasks?.organizationUnitTasks?.tasks

    if (props.organizationalUnits?.length > 0) {
        statisticsTaskUnits = props.organizationalUnits.map(unit => {
            let tasks = listTask?.filter(task => unit?._id === task?.organizationalUnit?._id).map(item => {
                return {
                    ...item,
                    detailOrganizationalUnit: [{
                        name: item?.organizationalUnit?.name   // dùng cho modal hiển thị danh sách CV
                    }]
                }
            })

            return {
                parent_id: unit?.parent,
                id: unit?._id,
                organizationalUnitName: unit?.name,
                tasks: tasks
            }
        })
    }

    let treeTaskUnits = arrayToTree(statisticsTaskUnits);

    return (
        <React.Fragment>
            {
                tasks?.isLoading
                ? <div>{translate('general.loading')}</div>
                : treeTaskUnits 
                    ? treeTaskUnits.map((tree, index) =>
                        <div key={index} className="tf-tree example" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '50px' }}>
                            <ul>
                                {
                                    displayTreeView(translate, tree)
                                }
                            </ul>
                        </div>
                    )
                    : <div>{translate('kpi.organizational_unit.dashboard.no_data')}</div>
            }
            <DetailOfTaskDialogModal listTask={currentListTask}/>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state
    return { tasks }
}
const actions = {
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
}

const connectedStatisticsTaskUnits = connect(mapState, actions)(withTranslate(StatisticsTaskUnits))
export { connectedStatisticsTaskUnits as StatisticsTaskUnits }