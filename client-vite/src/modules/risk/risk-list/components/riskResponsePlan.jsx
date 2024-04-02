import { RiskResponsePlanManagement } from "../../risk-response-plan/components"
import React, { useState, useEffect } from 'react';
import { DialogModal, } from '../../../../common-components';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
const RiskResponsePlan = (props) =>{
    const save =()=>{}
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-risk-response-plan-for-approve`} isLoading={false}
                title={'Phê duyệt rủi ro'}
                formID={`form-show-approve`}
                size={100}
                maxWidth={500}
                func={save}
            >
                 <RiskResponsePlanManagement></RiskResponsePlanManagement>
            </DialogModal>
        </React.Fragment>
           
           
    )
}
function mapStateToProps(state) {
    const {risk,riskResponsePlan} = state
    return { risk ,riskResponsePlan};
}
const actions = {
  

}
const connectedRiskResponsePlan = React.memo(connect(mapStateToProps, actions)(withTranslate(RiskResponsePlan)));
export { connectedRiskResponsePlan as RiskResponsePlan }