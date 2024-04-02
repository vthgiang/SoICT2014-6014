import dayjs from 'dayjs';
import React, { useState } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import {DateDiff, roundProb,getStatusStr} from '../../riskHelper'
const RiskDetail = (props) => {
    const { lists, type, translate,riskDis } = props
    const [state,setState] = useState({
        probs: [],
        now: dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss')
    })
    const getProb = (risk) =>{
        // console.log(riskDis)
        
        let prob = riskDis.lists.find(p => p.riskID == risk.riskID)?.prob
        return roundProb(prob)
    }
    return (
        <React.Fragment>
            {
                lists ?
                    <div className="faqs-page block ">
                        <div className="panel-group" id={"accordion-"+props.id} role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                            {
                                (lists.length !== 0) ?
                                    lists.map((risk, index) => (
                                        <div className="panel panel-default" key={index}>
                                            <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent={"#accordion-"+props.id} href={`#collapse-${props.id}${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                <span className="index">{index + 1}</span>
                                                <span className="task-name">{risk.riskName}</span>
                                                <small className="label label-danger" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{DateDiff.inDays(risk.occurrenceDate,state.now)} {translate('task.task_dashboard.day')} {translate('risk_dash.risk_detail.ago')}</small>
                                            </span>
                                            <div id={`collapse-${props.id}${index}`} className="panel-collapse collapse" role="tabpanel">
                                                <div className="panel-body">
                                                    <div className="time-todo-range">
                                                        <span style={{ marginRight: '10px' }}>{translate('risk_dash.risk_detail.risk_name')}</span>
                                                        <span >{risk.riskName}</span>
                                                    </div>
                                                    <div className="time-todo-range">
                                                        <span style={{ marginRight: '10px' }}>{translate('risk_dash.risk_detail.occurrence_date')}</span>
                                                        <span ><i class="fa fa-clock-o"> </i>{dayjs(risk.occurrenceDate).format('DD/MM/YYYY hh:mm A')}</span>
                                                    </div>
                                                    <div className="time-todo-range">
                                                        <span style={{ marginRight: '10px' }}>{translate('risk_dash.risk_detail.status')}</span>
                                                        <span >{translate("manage_risk." + risk.riskStatus)}</span>
                                                    </div>
                                                    <div className="time-todo-range">
                                                        <span style={{ marginRight: '10px' }}>{translate('risk_dash.risk_detail.responsibleEmployee')}</span>
                                                        <span >{risk.responsibleEmployees.map(re => re.name).join(',')}</span>
                                                    </div>
                                                    <div className="time-todo-range">
                                                        <span style={{ marginRight: '10px' }}>{translate('risk_dash.risk_detail.approvalEmployee')}</span>
                                                        <span >{risk.accountableEmployees.map(re => re.name).join(',')}</span>
                                                    </div>
                                                    <div className="time-todo-range">
                                                        <span style={{ marginRight: '10px' }}>{translate('risk_dash.risk_detail.ranking')} </span>
                                                        <span >{risk.ranking&&risk.ranking}</span>
                                                    </div>
                                                   
                                                    <div className="progress-task-wraper">
                                                        <span style={{ marginRight: '10px' }}>{translate('risk_dash.risk_detail.probability')}: </span>
                                                        <div className="progress-task">
                                                            <div className="fillmult" data-width={`${getProb(risk)}%`} style={{ width: `${getProb(risk)}%`, backgroundColor: getProb(risk) < 50 ? "#01DF01" : "#F7FE2E" }}></div>
                                                            <span className="perc">{getProb(risk)}%</span>
                                                        </div>
                                                    </div>
                                                    <a href={`/risk`} target="_blank" className="seemore-task">{translate('risk_dash.risk_detail.view_detail')}</a>
                                                </div>
                                            </div>
                                        </div>
                                    )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                            }
                        </div>
                    </div> : null
            }
        </React.Fragment>
    )
}

const connectedRiskDetail = connect(null, null)(withTranslate(RiskDetail));
export { connectedRiskDetail as RiskDetail };