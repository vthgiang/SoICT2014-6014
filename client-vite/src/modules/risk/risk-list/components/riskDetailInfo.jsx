import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal } from '../../../../common-components';
import dayjs from 'dayjs';
import { getImpactStr, getRankingStr, normalizeDescription } from '../../riskHelper';
import parse from 'html-react-parser';

const RiskDetailInfo = (props) => {
    const [state, setState] = useState({
        riskID: undefined,
    })

    const { translate, risk, riskInfo } = props;
    useEffect(() => {
        console.log(riskInfo)

    }, [])
    const { riskID } = state;
    const getRankingComponent = () => {
        // console.log('ranking', ranking)
        let color = "#FF0040"
        if (riskInfo.ranking < 4) {
            color = "#2EFE2E"
        }
        if (riskInfo.ranking <= 6 && riskInfo.ranking >= 4) {
            color = "#D7DF01"
        }
        if (riskInfo.ranking >= 8 && riskInfo.ranking < 12) {
            color = "#FE9A2E"

        }
        return (<div style={{ width: '190px', backgroundColor: color, textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold' }}>
            <p>{getRankingStr(translate, riskInfo.ranking)}</p>
        </div>);
    }

    // Nhận giá trị từ component cha
    const getHsseImpactComponent = () => {
        if (riskInfo.impact.health == 0 && riskInfo.impact.security == 0 && riskInfo.impact.enviroment == 0) {
            return (<div style={{ backgroundColor: 'gray', textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold', width: '190px' }}>
                <p>-----------</p>
            </div>)
        } else {
            let impactLevel = Math.max(riskInfo.impact.health, riskInfo.impact.security, riskInfo.impact.enviroment)

            // setState({
            //     ...state,
            //     impactLevel: impactLevel
            // })
            let color = 'green'
            if (impactLevel == 1) color = 'green'
            if (impactLevel == 2) color = 'yellow'
            if (impactLevel == 3) color = 'orange'
            if (impactLevel == 4) color = 'red'

            return (<div style={{ width: '190px', backgroundColor: color, textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold' }}>
                <p>{getImpactStr(translate, impactLevel) + '(' + impactLevel + ')'}</p>
            </div>);
        }


    }
    const getRiskProbabilityComponent = () => {
        // console.log('riskDistribution',props.riskDistribution)
        let prob = props.riskDistribution.lists.find(r => r.riskID == riskInfo.riskID).prob
        if (prob == 0)
            return (<div style={{ backgroundColor: 'gray', textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold', width: '190px' }}>
                <p>-----------</p>
            </div>)
        // let prob = props.riskDistribution.listRiskById.prob
        let rp = Math.round(prob * 10000) / 100
        let color = 'gray'
        let rankProb = 0
        if (prob > 0 && prob < 0.05) {
            color = 'green'
            rankProb = 1
        }
        if (prob >= 0.05 && prob < 0.24) {
            color = 'yellow'
            rankProb = 2
        }
        if (prob >= 0.25 && prob < 0.75) {
            color = 'orange'
            rankProb = 3
        }
        if (prob >= 0.75) {
            color = 'red'
            rankProb = 4
        }
        return (<div style={{ width: '190px', backgroundColor: color, textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold' }}>
            <p>{rp + ' %' + "(" + rankProb + ")"}</p>
        </div>);
    }
    const getRiskStatus = (status) => {
        let icon = "fa fa-check-circle";
        let color = "#088A08"
        if (status == "wait_for_approve" || status == "inprocess") {
            color = '#AEB404'
            icon = "fa fa-spinner"
        }
        if (status == "finished") icon = "fa fa-check-circle"
        if (status == "request_to_close") {
            color = "#0080FF"
            icon = "fa fa-arrow-circle-up"
        }
        return <p style={{ color: color, textAlign: 'center' }}>

            <i className={icon} />


            <span>{translate('manage_risk.'+status)}</span>

        </p>
        return <div style={{ color: color }}> <div className="row"><i className={icon} /></div><div><p className="row">{translate("manage_risk." + status)}</p></div></div>
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-example-hooks`} isLoading={risk.isLoading}
                title={translate('manage_risk.detail_info_risk')}
                formID={`form-detail-example-hooks`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <div className={`form-group`} style={{ textAlign: 'center' }}>
                    {/* <label>{translate('manage_risk.riskName')}:</label> */}
                    <h4> <strong>{riskInfo.riskName.toUpperCase()}</strong></h4>
                </div>
                <div className={`form-group`} style={{ textAlign: 'center' }}>
                    {/* <label>{translate('manage_risk.riskName')}:</label> */}
                    <h5> <strong>RISK ID</strong>{'#' + riskInfo._id.toUpperCase()}</h5>
                </div>
                <div className={`form-group`} style={{ textAlign: 'center' }}>
                    {/* <label>{translate('manage_risk.riskName')}:</label> */}
                    <h4><strong>{getRiskStatus(riskInfo.riskStatus)}</strong></h4>
                </div>
                <br></br>
                <div className="detail-ranking-info row">
                    <div className='col-sm-4'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Ranking</td>
                                </tr>
                                <tr>
                                    <td>{getRankingComponent()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='col-sm-4'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>{translate('manage_risk.risk_detail_info.probability')}</td>
                                </tr>
                                <tr>
                                    <td>{getRiskProbabilityComponent()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='col-sm-4'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>{translate('manage_risk.risk_detail_info.impact')}</td>

                                </tr>
                                <tr>
                                    <td>{getHsseImpactComponent()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br></br>
                <div className={`form-group detail-info`}>
                    <label>{translate('manage_risk.description').toUpperCase()}:</label>
                    <span> {riskInfo.description != undefined ? parse(riskInfo.description) : ''}</span>
                </div>
                <br></br>
                <div className="row detail-info">
                    {/* Tên rủi ro */}

                    {/* Mô tả rủi ro*/}
                    <div className="col-sm-6">
                        <div className={`form-group`}>
                            <label>{translate('manage_risk.risk_status')}:</label>
                            <span> {translate('manage_risk.' + riskInfo.riskStatus)}</span>
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_risk.raised_date')}:</label>
                            <span> {dayjs(riskInfo.raisedDate).format("DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_risk.occurrence_date')}:</label>
                            <span> {dayjs(riskInfo.occurrenceDate).format("DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className={`form-group`}>
                            <label>{translate('manage_risk.responsible')}:</label>
                            <span> {riskInfo.responsibleEmployees != undefined ? riskInfo.responsibleEmployees.map(e => e.name).join(',') : 'undenified'}</span>
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_risk.accountable')}:</label>
                            <span> {riskInfo.accountableEmployees != undefined ? riskInfo.accountableEmployees.map(e => e.name).join(',') : 'undenified'}</span>
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_risk.select_task_title')}:</label>
                            <ul>
                                {riskInfo.taskRelate && riskInfo.taskRelate.length != 0 && riskInfo.taskRelate.map((task, index) => (<li key={index}>{task.name}</li>))}
                            </ul>
                        </div>
                    </div>

                    <div >
                        {riskInfo.riskResponsePlans && riskInfo.riskResponsePlans.length != 0 &&
                            <table id="risk-response-plan-table">
                                <thead>

                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{translate('manage_risk.risk_detail_info.probability_mitigation_method')}</td>
                                        <td>{translate('manage_risk.risk_detail_info.impact_mitigation_method')}</td>
                                    </tr>
                                    {riskInfo.riskResponsePlans.map((riskPlan, index) => (
                                        <tr key={index}>
                                            <td>
                                                {parse(riskPlan.probabilityMitigationMethod)}
                                            </td>
                                            <td>
                                                {parse(riskPlan.impactMitigationMethod)}
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        }


                    </div>



                </div>

            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const risk = state.risk;
    const riskDistribution = state.riskDistribution
    return { risk, riskDistribution };
}

const connectedRiskDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(RiskDetailInfo)));
export { connectedRiskDetailInfo as RiskDetailInfo }