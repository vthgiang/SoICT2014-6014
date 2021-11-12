import React, { useState } from "react";
import { connect } from "react-redux"
import { withTranslate } from "react-redux-multilingual"
import arrayToTree from 'array-to-tree';


import { DetailOfTaskDialogModal } from '../../kpi/statistic/component/detailOfTaskDialogModal'

function StatisticsTaskUnits (props) {
    const { organizationalUnits, monthStatistics } = props
    const { translate, chartData } = props

    const [ currentListTask, setCurrentListTask ] = useState([])

    const handleShowTask = (tasks) => {
        setCurrentListTask(tasks)
    }

    const showNodeContent = (translate, data) => {
        let currentMonth = new Date(monthStatistics)
        let nextMonth = new Date(monthStatistics)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        
        let pointShow = data?.pointShow;
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
                    <a className="kpi-number-target" data-toggle="modal" data-target="#modal-task-detail" data-backdrop="static" data-keyboard="false" onClick={() => handleShowTask(data.tasks)} style={{ fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>{translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks')}: {data?.tasks?.length}</a>
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

    let treeTaskUnits = [];
    let statisticsTaskUnits = chartData?.statisticsTaskUnits;
    if (statisticsTaskUnits && statisticsTaskUnits.length > 0 ) treeTaskUnits = arrayToTree(statisticsTaskUnits);

    return (
        <React.Fragment>
            {
                chartData?.isLoading
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

const connectedStatisticsTaskUnits = connect(null, null)(withTranslate(StatisticsTaskUnits))
export { connectedStatisticsTaskUnits as StatisticsTaskUnits }