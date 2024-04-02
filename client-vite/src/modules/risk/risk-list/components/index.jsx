import React,{useEffect}from 'react';
import {riskActions} from '../redux/actions'
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import {RiskManagementTable} from "./riskManagementTable";
import { RiskDistributionActions } from '../../risk-dash-board/redux/actions';

function RiskManagement(props) {
    useEffect(() => {
        props.updateProb()
    }, [])
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
             
                <RiskManagementTable />
            </div>
        </div>
    );
}
function mapState(state) {
    const risk = state.risk;
    // console.log(risk)
    return { risk }
}

const actions = {
    getRisks: riskActions.getRisks,
    createRisk: riskActions.createRisk,
    deleteRisk: riskActions.deleteRisk,
    updateProb: RiskDistributionActions.updateProb
}
const connectedRiskManagement = connect(mapState, actions)(withTranslate(RiskManagement));
export { connectedRiskManagement as RiskManagement };