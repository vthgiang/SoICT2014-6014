import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';

import { PolicyActions } from '../redux/actions';

function PolicyCreateForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        policyName: "",
        description: "",
        policyNameError: {
            message: undefined,
            status: true
        },
        rules: {}
    })

    const { translate, policy, page, perPage } = props;
    const { policyName, description, policyNameError, rules } = state;


    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!policyNameError.status) {
            return false;
        }
        return true;
    }


    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = () => {
        if (isFormValidated() && policyName) {
            props.createPolicy([{ policyName, description, rules }]);
            // props.getPolicies({
            //     policyName: "",
            //     page: page,
            //     perPage: perPage
            // });
        }
    }


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
    }


    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-policy-hooks" isLoading={policy.isLoading}
                formID="form-create-policy-hooks"
                title={translate('manage_policy.add_title')}
                msg_success={translate('manage_policy.add_success')}
                msg_failure={translate('manage_policy.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-policy-hooks" onSubmit={() => save(translate('manage_policy.add_success'))}>
                    {/* Tên ví dụ */}
                    <div className={`form-group ${policyNameError.status ? "" : "has-error"}`}>
                        <label>{translate('manage_policy.policyName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={policyName} onChange={handlePolicyName}></input>
                        <ErrorLabel content={policyNameError.message} />
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_policy.policy_description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handlePolicyDescription}></input>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const policy = state.policy;
    return { policy }
}

const actions = {
    createPolicy: PolicyActions.createPolicy,
    getPolicies: PolicyActions.getPolicies,
}

const connectedPolicyCreateForm = connect(mapState, actions)(withTranslate(PolicyCreateForm));
export { connectedPolicyCreateForm as PolicyCreateForm };