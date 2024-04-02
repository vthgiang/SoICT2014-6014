import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from '../../../../config';
import { getItemsFromRiskDistributionList, getRankingStr, getEmployeeSelectBoxItems } from './helper'
import {riskResponsePlanRequestActions} from '../../change-process-request/redux/actions'
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, TimePicker, SelectBox, ToolTip, TreeSelect, QuillEditor } from '../../../../common-components';
const RequestCreateRiskResponsePlan = (props) => {
    const { translate, riskDistribution } = props

    const [state, setState] = useState({
        riskID:null,
        name: [],
        riskLevel: 1,
        description: '',
        allUnitsMember: [],
        responsibleEmployees: [getStorage("userId")],
        accountableEmployees:[]
    })
    const { name, riskLevel, allUnitsMember ,accountableEmployees} = state
    useEffect(()=>{
        if(state.name.length!=0){
            console.log(riskDistribution.lists)
            let riskID = riskDistribution.lists.find(r => r.name ==name).riskID
            console.log(riskID)
            setState({
                ...state,
                riskID:riskID
            })
        }
    },[state.name])
    if (props.user.usersInUnitsOfCompany != undefined && props.user.usersInUnitsOfCompany.length != 0 && allUnitsMember.length == 0) {
        setState({
            ...state,
            allUnitsMember: getEmployeeSelectBoxItems(props.user.usersInUnitsOfCompany)
        })

    }
    const handleChangeAccountableEmployees = (value) =>{
        setState({
            ...state,
            accountableEmployees:value[0]
        })
    }
    const handleChangeDescription = (val) => {
        setState({
            ...state,
            description: val
        })
    }
    const handleChangeName = (value) => {
        setState({
            ...state,
            name: value[0]
        })
    }
    const handleChangeRiskLevel = (event) => {
        let val = event.target.value
        setState({
            ...state,
            riskLevel: parseInt(val)
        })
    }
    const isFormValidated = () => {
        return true
    }
    const save = () => {

        if(isFormValidated()){
            let data = {
                riskApply:state.riskID,
                riskLevel:state.riskLevel,
                responsibleEmployees:state.responsibleEmployees,
                accountableEmployees:state.accountableEmployees,
                description:state.description
            }
            console.log(data)
            props.createRiskResponsePlanRequest(data)
        }
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-request-create-risk-response-plan" isLoading={false}
                formID="form-create-example-hooks"
                title={`Yêu cầu thêm mới biện pháp`}
                // msg_success={translate('manage_risk_plan.add_success')}
                // msg_faile={translate('manage_risk_plan.add_failure')}
                func={save}
                disableSubmit={!isFormValidated()}
                minHeight={'500px'}
                size={75}
                maxWidth={500}
            >
                <div className="form-group col-sm-6">
                    <label className="control-label">
                        {translate('manage_risk_plan.riskApply')}<span className="text-red">*</span>
                    </label>
                    {riskDistribution.lists.length != 0 && <SelectBox
                        id={`request-risk-response-plan-select-risk`}
                        className="form-control"
                        style={{ width: "100%" }}
                        items={getItemsFromRiskDistributionList(riskDistribution.lists)}
                        onChange={handleChangeName}
                        value={name}

                        multiple={false}
                        options={{ placeholder: translate('manage_risk.select_risk_title') }}
                    />}
                </div>
                <div className="form-group col-sm-6">
                    <label className="control-label">
                        {translate('manage_risk_plan.create_form.risk_level')}<span className="text-red">*</span>
                    </label>
                    <select className="form-control" value={riskLevel} onChange={handleChangeRiskLevel}>
                        {[1,2,3,4,6,8,9, 12,16].map((val, index) => (
                            <option key={index} value={val}>
                                {getRankingStr(val)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="" className="control-label">
                        {'Lý do'}
                        <span className="text-red">*</span>

                    </label>
                    <QuillEditor
                        id={`request-risk_desc`}
                        getTextData={(val) => handleChangeDescription(val)}
                        quillValueDefault={''}
                        embeds={false}
                        placeholder={'Lý do'}
                        height="150px"
                    />
                </div>
                <div className={`form-group`}>
                    <label className="control-label">{translate('manage_risk.accountable')}<span className="text-red">*</span></label>
                    {allUnitsMember &&
                        <SelectBox
                            id={`request-accountable-select-box`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={allUnitsMember}
                            onChange={handleChangeAccountableEmployees}
                            value={accountableEmployees}
                            multiple={false}
                            options={{ placeholder: translate('task.task_management.add_resp') }}
                        />
                    }
                    {/* <ErrorLabel content={newTask.errorOnResponsibleEmployees} /> */}
                </div>
            </DialogModal>
        </React.Fragment>
    )
}
const mapState = (state) => {
    const { riskDistribution, riskResponsePlan, user,riskResponsePlanRequest } = state;
    return { riskDistribution, riskResponsePlan, user,riskResponsePlanRequest}
}

const actions = {
    createRiskResponsePlanRequest:riskResponsePlanRequestActions.createRiskResponsePlanRequest
}

const connectedRequestCreateRiskResponsePlan = connect(mapState, actions)(withTranslate(RequestCreateRiskResponsePlan));
export { connectedRequestCreateRiskResponsePlan as RequestCreateRiskResponsePlan };