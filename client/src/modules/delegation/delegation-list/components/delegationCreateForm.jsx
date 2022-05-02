import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';

import { DelegationActions } from '../redux/actions';

function DelegationCreateForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        delegationName: "",
        description: "",
        delegationNameError: {
            message: undefined,
            status: true
        }
    })

    const { translate, delegation, page, perPage } = props;
    const { delegationName, description, delegationNameError } = state;


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
        if (isFormValidated() && delegationName) {
            props.createDelegation([{ delegationName, description }]);
            // props.getDelegations({
            //     delegationName: "",
            //     page: page,
            //     perPage: perPage
            // });
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
        })
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
        });
    }


    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-delegation-hooks" isLoading={delegation.isLoading}
                formID="form-create-delegation-hooks"
                title={translate('manage_delegation.add_title')}
                msg_success={translate('manage_delegation.add_success')}
                msg_failure={translate('manage_delegation.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-delegation-hooks" onSubmit={() => save(translate('manage_delegation.add_success'))}>
                    {/* Tên ví dụ */}
                    <div className={`form-group ${delegationNameError.status ? "" : "has-error"}`}>
                        <label>{translate('manage_delegation.delegationName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={delegationName} onChange={handleDelegationName}></input>
                        <ErrorLabel content={delegationNameError.message} />
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_delegation.delegation_description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handleDelegationDescription}></input>
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
    createDelegation: DelegationActions.createDelegation,
    getDelegations: DelegationActions.getDelegations,
}

const connectedDelegationCreateForm = connect(mapState, actions)(withTranslate(DelegationCreateForm));
export { connectedDelegationCreateForm as DelegationCreateForm };