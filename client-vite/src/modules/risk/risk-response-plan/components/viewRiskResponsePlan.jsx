import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from '../../../../common-components';
import {getRankingStr} from './helper'
import parse from 'html-react-parser';
const ViewRiskResponsePlan = (props) => {
    const { translate, riskPlanDetail, riskDistribution } = props
    const [ state, setState ] = useState({
        name: '',
        riskLevel: 0,
        applyCaseDescription: '',
        probabilityDescription: '',
        impactDescription: '',
    })
    useEffect(() => {
        setState({
            ...state,
            name: riskDistribution.lists.find(r => r.riskID == riskPlanDetail.riskApply).name,
            riskLevel: riskPlanDetail.riskLevel,
            applyCaseDescription: riskPlanDetail.applyCase,
            probabilityDescription: riskPlanDetail.probabilityMitigationMethod,
            impactDescription: riskPlanDetail.impactMitigationMethod
        })
    }, [riskPlanDetail])
    const {name,riskLevel,applyCaseDescription,probabilityDescription,impactDescription} = state
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-risk-response-plan`} isLoading={false}
                title={translate('manage_risk_plan.detail')}
                formID={`form-detail-example-hooks`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form>
                    <div className="form-group">
                        <label>{translate('manage_risk_plan.riskApplyName')}:</label>
                        <span> {name}</span>
                    </div>
                    <div className="form-group">
                        <label>{translate('manage_risk_plan.risk_level')}:</label>
                        <span> {getRankingStr(translate,riskLevel)}</span>
                    </div>
                    <div className="form-group">
                        <label>{translate('manage_risk_plan.apply_case')}:</label>
                        <span> {parse(applyCaseDescription)}</span>
                    </div>

                    <div className="form-group">
                        <label>{translate('manage_risk_plan.probability_mitigation_method')}:</label>
                        <span> {parse(probabilityDescription)}</span>
                    </div>
                    <div className="form-group">
                        <label>{translate('manage_risk_plan.impact_mitigation_method')}:</label>
                        <span> {parse(impactDescription)}</span>
                    </div>
                   
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

const mapState = (state) => {
    const { riskDistribution, riskResponsePlan } = state;
    return { riskDistribution, riskResponsePlan }
}

const connectedViewRiskResponsePlan = connect(mapState, null)(withTranslate(ViewRiskResponsePlan));
export { connectedViewRiskResponsePlan as ViewRiskResponsePlan };