import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, TimePicker, SelectBox, ToolTip, TreeSelect, QuillEditor } from '../../../../common-components';
import { RiskDistributionActions } from '../../risk-dash-board/redux/actions';
import { riskResponsePlanActions } from '../redux/actions'
import { getItemsFromRiskDistributionList, getRankingStr, getRiskLevelItems } from './helper'
const EditRiskResponsePlan = (props) => {
    const initState = {
        name: [],
        editRiskPlan: null,
        probabilityMitigationDescription: '',
        impactMitigationDescription: '',
        applyCaseDescription: '',
        riskID: '',
        riskLevel: 1,
    }

    const [state, setState] = useState(initState)
    const {
        riskDistribution,
        riskResponsePlan,
        translate,
        createRiskResponsePlan,
        getRiskDistributions,
        data
    } = props
    const {
        editRiskPlan,
        name,
        riskLevel,
        riskID,
        impactMitigationDescription,
        probabilityMitigationDescription,
        applyCaseDescription
    } = state
    useEffect(()=>{
        setState({
            ...state,
            name:riskDistribution.lists.find(r => r.riskID == data.riskApply).name,
            riskLevel:data.riskLevel,
            probabilityMitigationDescription:data.probabilityMitigationMethod,
            impactMitigationDescription:data.impactMitigationMethod,
            applyCaseDescription:data.applyCase

        })
       
       
    },[data])
    useEffect(() => {
        if (riskDistribution.lists.length != 0) {
            console.log(riskDistribution.lists)
        }
    }, [riskDistribution.lists])
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
    const isFormValidated = () => {
        return (
            name.length!=0&&
            probabilityMitigationDescription.length!=0&&
            impactMitigationDescription.length!=0&&
            riskLevel.length!=0
        )
        
    }
    const save = () => {
        if(isFormValidated()){
            
            let editData =  {
                riskLevel:riskLevel,
                riskApply:riskID,
                impactMitigationMethod:impactMitigationDescription,
                probabilityMitigationMethod:probabilityMitigationDescription,
                applyCase:applyCaseDescription
            }
            console.log(editData)
            props.editRiskResponsePlan(data._id,editData)
        }
        
    }
    const handleChangeName = (value) => {
        setState({
            ...state,
            name: value[0]
        })
    }
    const handleChangeProbabilityDescription = (value) => {
        setState({
            ...state,
            probabilityMitigationDescription: value
        })
    }
    const handleChangeRiskLevel = (event) => {
        let val = event.target.value
        setState({
            ...state,
            riskLevel: parseInt(val)
        })
    }
    const handleChangeApplyCaseDescription = (value) => {
        setState({
            ...state,
            applyCaseDescription: value
        })
    }
    const handleChangeImpactDescription = (value) =>{
        setState({
            ...state,
            impactMitigationDescription:value
        })
    }
  
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-risk-response-plan" isLoading={false}
                formID="form-create-example-hooks"
                title={translate('manage_risk_plan.add')}
                msg_success={translate('manage_risk_plan.add_success')}
                msg_faile={translate('manage_risk_plan.add_failure')}
                func={save}
                disableSubmit={!isFormValidated()}
                minHeight={'500px'}
                size={75}
                maxWidth={500}
            >

                <div id="probability_mitigation_method" className="tab-pane active" >
                    <form>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_risk_plan.create_form.risk_info')}</legend>
                            <div className="form-group col-sm-6">
                                <label className="control-label">
                                    {translate('manage_risk_plan.riskApply')}<span className="text-red">*</span>
                                </label>
                                {riskDistribution.lists.length != 0 && <SelectBox
                                    id={`edit-risk-response-plan-select-risk`}
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
                                            {getRankingStr(translate,val)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group col-sm-12">
                                <label htmlFor="" className="control-label">
                                    {translate('manage_risk_plan.create_form.apply_description')}
                                    <span className="text-red">*</span>

                                </label>
                                <QuillEditor
                                    id={`edit-risk_desc`}
                                    getTextData={(val) => handleChangeApplyCaseDescription(val)}
                                    quillValueDefault={data.applyCase}
                                    embeds={false}
                                    placeholder={translate('manage_risk_plan.create_form.apply_description')}
                                    height="150px"
                                />
                            </div>
                        </fieldset>

                        <div className="row">
                            <form>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_risk_plan.create_form.mitigation_method')}</legend>
                                    <div className="col-sm-6">

                                        <div className="form-group">
                                            <label htmlFor="" className="control-label">
                                                {translate('manage_risk_plan.create_form.probability_description')}
                                                <span className="text-red">*</span>

                                            </label>
                                            <QuillEditor
                                                id={'edit-prob_desc'}
                                                getTextData={(val) => handleChangeProbabilityDescription(val)}
                                                quillValueDefault={data.probabilityMitigationMethod}
                                                embeds={false}
                                                placeholder={translate('manage_risk_plan.create_form.probability_description')}
                                                height="150px"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="" className="control-label">
                                                {translate('manage_risk_plan.create_form.impact_description')}
                                                <span className="text-red">*</span>

                                            </label>
                                            <QuillEditor
                                                id={`edit-impact_desc`}
                                                getTextData={(val) => handleChangeImpactDescription(val)}
                                                quillValueDefault={data.impactMitigationMethod}
                                                embeds={false}
                                                placeholder={translate('manage_risk_plan.create_form.impact_description')}
                                                height="150px"
                                            />
                                        </div>
                                    </div>
                                </fieldset>

                            </form>

                        </div>


                    </form>

                    {translate('manage_risk_plan.probability_mitigation_method')}
                </div>


            </DialogModal>

        </React.Fragment>
    )
}
const mapState = (state) => {
    const { riskDistribution, riskResponsePlan } = state;
    return { riskDistribution, riskResponsePlan }
}

const actions = {
    editRiskResponsePlan:riskResponsePlanActions.editRiskResponsePlan,
}

const connectedEditRiskResponsePlan = connect(mapState, actions)(withTranslate(EditRiskResponsePlan));
export { connectedEditRiskResponsePlan as EditRiskResponsePlan };