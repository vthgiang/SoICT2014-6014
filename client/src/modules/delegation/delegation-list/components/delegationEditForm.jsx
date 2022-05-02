import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

import { DelegationActions } from '../redux/actions';

function DelegationEditForm(props) {
    // Khởi tạo state
    const [state, setState] = useState({
        delegationID: undefined,
        delegationName: "",
        description: "",
        delegationNameError: {
            message: undefined,
            status: true
        }
    })

    const { translate, delegation } = props;
    const { delegationName, description, delegationNameError, delegationID } = state;

    // setState từ props mới
    if (props.delegationID !== delegationID) {
        setState({
            ...state,
            delegationID: props.delegationID,
            delegationName: props.delegationName,
            description: props.description,
            delegationNameError: {
                message: undefined,
                status: true
            }
        })
    }

    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!delegationNameError.status) {
            return false;
        }
        return true;
    }


    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = () => {
        if (isFormValidated) {
            props.editDelegation(delegationID, { delegationName, description });
        }
    }


    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handleDelegationName = (e) => {
        const { value } = e.target;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            delegationName: value,
            delegationNameError: result
        });
    }


    /**
     * Hàm xử lý khi mô tả ví dụ thay đổi
     * @param {*} e 
     */
    const handleDelegationDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-delegation-hooks`} isLoading={delegation.isLoading}
                formID={`form-edit-delegation-hooks`}
                title={translate('manage_delegation.edit_title')}
                disableSubmit={!isFormValidated}
                func={save}
                size={50}
                maxWidth={500}
            >
                <form id={`form-edit-delegation-hooks`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group ${delegationNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_delegation.delegationName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={delegationName} onChange={handleDelegationName} />
                        <ErrorLabel content={delegationNameError.message} />
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_delegation.description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handleDelegationDescription} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const delegation = state.delegation;
    return { delegation }
}

const actions = {
    editDelegation: DelegationActions.editDelegation
}

const connectedDelegationEditForm = connect(mapState, actions)(withTranslate(DelegationEditForm));
export { connectedDelegationEditForm as DelegationEditForm };