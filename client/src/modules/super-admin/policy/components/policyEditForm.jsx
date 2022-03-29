import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { GeneralTab } from "./generalTab";
import { SubjectTab } from "./subjectTab";
import { ResourceTab } from "./resourceTab";
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { AttributeActions } from '../../attribute/redux/actions';
import { PolicyActions } from '../redux/actions';

function PolicyEditForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({

    })

    const { translate, policy } = props;
    const { policyID, policyName, description, userRule, roleRule, resourceRule, userAttributes, roleAttributes, resourceAttributes } = state;

    // setState từ props mới
    useEffect(() => {
        if (props.policyID !== state.policyID) {
            setState({
                ...state,
                policyID: props.policyID,
                policyName: props.policyName,
                description: props.description,
                userAttributes: props.userAttributes.map((a) => a = { ...a, addOrder: a._id }),
                roleAttributes: props.roleAttributes.map((a) => a = { ...a, addOrder: a._id }),
                resourceAttributes: props.resourceAttributes.map((a) => a = { ...a, addOrder: a._id }),
                userRule: props.userRule,
                roleRule: props.roleRule,
                resourceRule: props.resourceRule
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
        if (!ValidationHelper.validateName(translate, policyName, 6, 255).status || !validateRoleAttributes() || !validateUserAttributes() || !validateResourceAttributes()) {
            return false;
        }
        return true;
    }

    const validateRoleAttributes = () => {
        var roleAttributes = state.roleAttributes;
        let result = true;

        if (roleAttributes.length !== 0) {

            for (let n in roleAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, roleAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, roleAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }
    const validateUserAttributes = () => {
        var userAttributes = state.userAttributes;
        let result = true;

        if (userAttributes.length !== 0) {

            for (let n in userAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, userAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, userAttributes[n].value).status) {
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
            subject: {
                user: {
                    userAttributes: userAttributes,
                    userRule: userAttributes.length > 0 ? userRule : "",
                },
                role: {
                    roleAttributes: roleAttributes,
                    roleRule: roleAttributes.length > 0 ? roleRule : "",
                }
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
                modalID={`modal-edit-policy-hooks`} isLoading={policy.isLoading}
                formID={`form-edit-policy-hooks`}
                title={translate('manage_policy.edit_title')}
                disableSubmit={!isFormValidated}
                func={save}
                size={50}
                maxWidth={500}
            >
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('manage_policy.general_information')} data-toggle="tab" href={`#edit_general`}>{translate('manage_policy.general_information')}</a></li>
                        <li><a title={translate('manage_policy.subject_information')} data-toggle="tab" href={`#edit_subject`}>{translate('manage_policy.subject_information')}</a></li>
                        <li><a title={translate('manage_policy.resource_information')} data-toggle="tab" href={`#edit_resource`}>{translate('manage_policy.resource_information')}</a></li>
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
                        <SubjectTab
                            id={`edit_subject`}
                            handleChange={handleChange}
                            i={props.i}
                            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                            policyID={policyID}
                            userAttributes={state.userAttributes}
                            roleAttributes={state.roleAttributes}
                            userRule={state.userRule}
                            roleRule={state.roleRule}
                        />

                        {/* Thông tin thuộc tính resource */}
                        <ResourceTab
                            id={`edit_resource`}
                            handleChange={handleChange}
                            i={props.i}
                            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                            policyID={policyID}
                            resourceAttributes={resourceAttributes}
                            resourceRule={resourceRule}
                        />
                    </div>
                </div>

            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const policy = state.policy;
    return { policy }
}

const actions = {
    editPolicy: PolicyActions.editPolicy,
    getAttribute: AttributeActions.getAttributes
}

const connectedPolicyEditForm = connect(mapState, actions)(withTranslate(PolicyEditForm));
export { connectedPolicyEditForm as PolicyEditForm };