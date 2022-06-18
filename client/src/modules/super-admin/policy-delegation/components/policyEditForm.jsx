import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { GeneralTab } from "./generalTab";
import { DelegationTab } from "./delegationTab";
import { ResourceTab } from "./resourceTab";
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { AttributeActions } from '../../attribute/redux/actions';
import { PolicyActions } from '../redux/actions';

function PolicyEditForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({

    })

    const { translate, policyDelegation } = props;
    const { policyID, policyName, description, delegatorRule, delegateeRule, delegatedObjectRule, resourceRule, delegatorAttributes, delegateeAttributes, delegatedObjectAttributes, resourceAttributes } = state;

    // setState từ props mới
    useEffect(() => {
        if (props.policyID !== state.policyID) {
            setState({
                ...state,
                policyID: props.policyID,
                policyName: props.policyName,
                description: props.description,
                delegatorAttributes: props.delegatorAttributes.map((a) => a = { ...a, addOrder: a._id }),
                delegateeAttributes: props.delegateeAttributes.map((a) => a = { ...a, addOrder: a._id }),
                delegatedObjectAttributes: props.delegatedObjectAttributes.map((a) => a = { ...a, addOrder: a._id }),
                resourceAttributes: props.resourceAttributes.map((a) => a = { ...a, addOrder: a._id }),
                delegatorRule: props.delegatorRule,
                delegateeRule: props.delegateeRule,
                delegatedObjectRule: props.delegatedObjectRule,
                resourceRule: props.resourceRule,
            })
        }
    }, [props.policyID])


    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    console.log(state)
    const handleChangeAddRowAttribute = (name, value) => {
        props.handleChangeAddRowAttribute(name, value)
    }

    useEffect(() => {
        props.getAttribute();
    }, [])
    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!ValidationHelper.validateName(translate, policyName, 6, 255).status || !validateDelegatorAttributes() || !validateDelegateeAttributes() || !validateDelegatedObjectAttributes() || !validateResourceAttributes()) {
            return false;
        }
        return true;
    }

    const validateDelegatorAttributes = () => {
        var delegatorAttributes = state.delegatorAttributes;
        let result = true;

        if (delegatorAttributes.length !== 0) {

            for (let n in delegatorAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, delegatorAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, delegatorAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }
    const validateDelegatedObjectAttributes = () => {
        var delegatedObjectAttributes = state.delegatedObjectAttributes;
        let result = true;

        if (delegatedObjectAttributes.length !== 0) {

            for (let n in delegatedObjectAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, delegatedObjectAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, delegatedObjectAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    const validateDelegateeAttributes = () => {
        var delegateeAttributes = state.delegateeAttributes;
        let result = true;

        if (delegateeAttributes.length !== 0) {

            for (let n in delegateeAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, delegateeAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, delegateeAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    const validateResourceAttributes = () => {
        var resourceAttributes = state.resourceAttributes;
        let result = true;

        if (resourceAttributes.length !== 0) {

            for (let n in resourceAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, resourceAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, resourceAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = () => {
        const data = {
            policyName: policyName,
            description: description,
            delegator: {
                delegatorAttributes: delegatorAttributes,
                delegatorRule: delegatorAttributes.length > 0 ? delegatorRule : "",
            },
            delegatee: {
                delegateeAttributes: delegateeAttributes,
                delegateeRule: delegateeAttributes.length > 0 ? delegateeRule : "",
            },
            delegatedObject: {
                delegatedObjectAttributes: delegatedObjectAttributes,
                delegatedObjectRule: delegatedObjectAttributes.length > 0 ? delegatedObjectRule : "",
            },
            resource: {
                resourceAttributes: resourceAttributes,
                resourceRule: resourceAttributes.length > 0 ? resourceRule : "",
            }
        }
        if (isFormValidated() && policyName) {
            props.editPolicy(policyID, data);

        }
    }


    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-policy-hooks`} isLoading={policyDelegation.isLoading}
                formID={`form-edit-policy-hooks`}
                title={translate('manage_delegation_policy.edit_title')}
                disableSubmit={!isFormValidated}
                func={save}
                size={75}
                maxWidth={850}
            >
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('manage_delegation_policy.general_information')} data-toggle="tab" href={`#edit_general`}>{translate('manage_delegation_policy.general_information')}</a></li>
                        <li><a title={translate('manage_delegation_policy.delegation_information')} data-toggle="tab" href={`#edit_delegation`}>{translate('manage_delegation_policy.delegation_information')}</a></li>
                    </ul>

                    <div className="tab-content">
                        {/* Thông tin chung */}
                        <GeneralTab
                            id={`edit_general`}
                            handleChange={handleChange}
                            policyID={policyID}
                            policyName={state.policyName}
                            description={state.description}
                        />

                        {/* Thông tin thuộc tính subject */}
                        <DelegationTab
                            id={`edit_delegation`}
                            handleChange={handleChange}
                            i={props.i}
                            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                            policyID={policyID}
                            delegatorAttributes={state.delegatorAttributes}
                            delegateeAttributes={state.delegateeAttributes}
                            delegatorRule={state.delegatorRule}
                            delegateeRule={state.delegateeRule}
                            resourceAttributes={resourceAttributes}
                            resourceRule={resourceRule}
                            delegatedObjectAttributes={delegatedObjectAttributes}
                            delegatedObjectRule={delegatedObjectRule}
                        />

                        {/* Thông tin thuộc tính resource */}
                        {/* <ResourceTab
                            id={`edit_resource`}
                            handleChange={handleChange}
                            i={props.i}
                            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                            policyID={policyID}
                            resourceAttributes={resourceAttributes}
                            resourceRule={resourceRule}
                        /> */}
                    </div>
                </div>

            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const policyDelegation = state.policyDelegation;
    return { policyDelegation }
}

const actions = {
    editPolicy: PolicyActions.editPolicy,
    getAttribute: AttributeActions.getAttributes
}

const connectedPolicyEditForm = connect(mapState, actions)(withTranslate(PolicyEditForm));
export { connectedPolicyEditForm as PolicyEditForm };