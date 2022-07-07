import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

function GeneralTab(props) {
    const [state, setState] = useState({
        policyName: "",
        description: "",
        policyNameError: {
            message: undefined,
            status: true
        },
    })

    // setState từ props mới
    useEffect(() => {
        if (props.policyID !== state.policyID) {
            setState({
                ...state,
                policyID: props.policyID,
                policyName: props.policyName,
                description: props.description,
            })
        }
    }, [props.policyID])

    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handlePolicyName = (e) => {
        const { value } = e.target;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            policyName: value,
            policyNameError: result
        })
        props.handleChange("policyName", value);
    }


    /**
     * Hàm xử lý khi mô tả ví dụ thay đổi
     * @param {*} e 
     */
    const handlePolicyDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        });
        props.handleChange("description", value);

    }

    const { translate } = props;
    const { policyName, description, policyNameError } = state;

    return (
        <div id={props.id} className="tab-pane active">
            {/* Tên ví dụ */}
            <div className={`form-group ${policyNameError.status ? "" : "has-error"}`}>
                <label>{translate('manage_delegation_policy.policyName')}<span className="text-red">*</span></label>
                <input type="text" className="form-control" value={policyName} onChange={handlePolicyName}></input>
                <ErrorLabel content={policyNameError.message} />
            </div>

            {/* Mô tả ví dụ */}
            <div className={`form-group`}>
                <label>{translate('manage_delegation_policy.policy_description')}</label>
                <input type="text" className="form-control" value={description} onChange={handlePolicyDescription}></input>
            </div>
        </div>
    );
};

function mapState(state) {
    const { policyDelegation } = state;
    return { policyDelegation };
};

const actionCreators = {

};
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab));
export { generalTab as GeneralTab };