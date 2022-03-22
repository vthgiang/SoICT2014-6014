import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

import { PolicyActions } from '../redux/actions';

function PolicyEditForm(props) {
    // Khởi tạo state
    const [state, setState] = useState({
        policyID: undefined,
        policyName: "",
        description: "",
        policyNameError: {
            message: undefined,
            status: true
        }
    })

    const { translate, policy } = props;
    const { policyName, description, policyNameError, policyID } = state;

    // setState từ props mới
    if (props.policyID !== policyID) {
        setState({
            ...state,
            policyID: props.policyID,
            policyName: props.policyName,
            description: props.description,
            policyNameError: {
                message: undefined,
                status: true
            }
        })
    }

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
        if (isFormValidated) {
            props.editPolicy(policyID, { policyName, description });
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
        });
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
        })
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
                <form id={`form-edit-policy-hooks`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group ${policyNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_policy.policyName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={policyName} onChange={handlePolicyName} />
                        <ErrorLabel content={policyNameError.message} />
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_policy.description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handlePolicyDescription} />
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
    editPolicy: PolicyActions.editPolicy
}

const connectedPolicyEditForm = connect(mapState, actions)(withTranslate(PolicyEditForm));
export { connectedPolicyEditForm as PolicyEditForm };