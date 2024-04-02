import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { riskResponsePlanActions } from '../../risk-response-plan/redux/actions'
import { } from '../../risk-response-plan/components/helper'
import { DialogModal, SelectBox, QuillEditor, SelectMulti } from '../../../../common-components';
import dayjs from 'dayjs';
import { normalizeDescription, clone } from '../../riskHelper';
import { riskActions } from '../redux/actions'
import { RiskResponsePlanManagement } from '../../risk-response-plan/components';


const AprroveRiskForm = (props) => {
    const initState = {
        riskID: undefined,
        approveDescription: '',
        approveType: 1,
        riskResponsePlanByRiskId: [],
        riskResponsePlanSelect: [],
        riskName: ''
    }
    const [state, setState] = useState(initState)

    const { translate, approveRisk, riskResponsePlan } = props;
    const {
        approveType,
        approveDescription,
        riskResponsePlanSelect
    } = state;
    useEffect(() => {
        setState({
            ...state,
            riskName: approveRisk.riskName
        })
        console.log('approveRisk', approveRisk)
    }, [approveRisk])
    const handleSelectRiskPlan = (event, riskPlan) => {
        let isChecked = event.target.checked
        let riskResponsePlanTemp = []
        if (isChecked == true) {
            riskResponsePlanTemp = riskResponsePlanSelect.concat(riskPlan)

        } else {
            riskResponsePlanTemp = riskResponsePlanTemp.filter(rrp => rrp._id != riskPlan._id)
        }
        setState({
            ...state,
            riskResponsePlanSelect: riskResponsePlanTemp
        })
    }
    const handleChangeType = (event) => {
        let val = event.target.value
        console.log(val)
        setState({
            ...state,
            approveType: val
        })
    }
    const handleApproveDescription = (value) => {
        setState({
            ...state,
            approveDescription: value
        })

    }
    const approveTypeItems = [
        {

            text: 'Kết thúc',
            value: 1
        }, {
            text: 'Đã xử lý',
            value: 2
        }
    ]
    const save = () => {
        let status = 'wait_for_approve'
        if (approveType == 1) {
            status = 'finished'
        }
        if (approveType == 2) {
            status = 'inprocess'
        }
        props.editRisk(approveRisk._id, {
            riskResponsePlans: riskResponsePlanSelect,
            approveType: parseInt(approveType),
            description: approveDescription,
            action: 'approve',
            status: status
        })
        props.getRisks({
            type: 'getByUser',
            page: props.page,
            perPage: props.perPage
        })
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-approve`} isLoading={props.risk.isLoading && riskResponsePlan.isLoading}
                title={'Phê duyệt rủi ro'}
                formID={`form-show-approve`}
                size={100}
                maxWidth={500}
                func={save}
            >   
                {/* <div className="row" style={{textAlign:'left'}}>{dayjs(new Date()).format('DD/MM/YYYY')}</div> */}
                <div className="form-group" style={{textAlign:'center'}}>
                    <h3><strong>{approveRisk.riskName}</strong></h3>
                    <h4>RISK ID # {approveRisk._id.toString().toUpperCase()}</h4>
                    <h5>{translate('manage_risk.approve_modal.occurrence_date')}: {dayjs(approveRisk.occurrenceDate).format('DD/MM/YYYY')}</h5>
                    <h5>{translate('manage_risk.approve_modal.responsibleEmployee')}: {approveRisk.responsibleEmployees[0].name}</h5>
                </div>
                <form id={`form-show-approve`}>
                    <div className="col-sm-6">
                        <fieldset  className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_risk.approve_modal.approval_information')}</legend>
                       
                        <div className="form-group">
                            <label> {translate('manage_risk.approve_modal.status')}:  </label>
                            <select style={{ width: '50%' }} className="form-control" value={approveType} onChange={handleChangeType}>
                                {approveTypeItems.map(item => {
                                    return <option key={item.value} value={item.value}>{item.text}</option>
                                })}
                            </select>
                        </div>

                        <div className={`form-group`}>
                            <label>{translate('manage_risk.approve_modal.description')}:</label>
                            <QuillEditor
                                id="show-approve"
                                getTextData={(val) => handleApproveDescription(val)}
                                quillValueDefault={''}
                                embeds={false}
                                placeholder="Mô t ả phương pháp giảm thiểu/xử lý rủi ro"
                            />
                        </div>
                        </fieldset>

                    </div>
                    <div className="col-sm-6" >
                    {approveRisk&&approveRisk.riskStatus == "wait_for_approve"&&<fieldset  className="scheduler-border">
                        <legend className="scheduler-border">{translate('manage_risk.approve_modal.select_risk_response_plan')}</legend>
                        <div className={`form-group`}id = "select-risk-response-plan">
                            {/* Tên biện pháp ứng phó rủi ro */}
                            {/* {riskResponsePlanSelect.map( r=> <p>{r._id}</p>)} */}
                            
                            <RiskResponsePlanManagement inForm={true} handleSelect={handleSelectRiskPlan} />
                        </div>
                    </fieldset>}
                    </div>

                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { risk, riskResponsePlan } = state
    return { risk, riskResponsePlan };
}
const actions = {
    editRisk: riskActions.editRisk,
    getRisks: riskActions.getRisks,
    getRiskResponsePlans: riskResponsePlanActions.getRiskResponsePlans,
    getRiskResponsePlanByRiskId: riskResponsePlanActions.getRiskResponsePlanByRiskId

}
const connectedAprroveRiskForm = React.memo(connect(mapStateToProps, actions)(withTranslate(AprroveRiskForm)));
export { connectedAprroveRiskForm as AprroveRiskForm }