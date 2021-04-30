import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel } from '../../../common-components';
import ValidationHelper from '../../../helpers/validationHelper';

function DeletePassword2(props) {
    const [state, setState] = useState({
        oldPassword2Error: undefined,
    })
    const { translate } = props;

    const handleChangeOldPassword2 = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        setState({
            ...state,
            oldPassword2: value,
            oldPassword2Error: message
        })
    }

    const isFormValidated = () => {
        const { oldPassword2 } = state;
        let { translate } = props;

        if (!ValidationHelper.validateEmpty(translate, oldPassword2).status) return false;
        return true;
    }

    const save = () => {
        const { oldPassword2 } = state;
        if (isFormValidated()) {
            return props.deletePassword2(oldPassword2);
        }
    }

    const { oldPassword2Error } = state;
    return (
        <DialogModal
            modalID="modal-delete-pwd2" isLoading={false}
            formID="modal-delete-pwd2"
            title={"Xóa mật khẩu cấp 2"}
            size={50}
            func={save}
            disableSubmit={!isFormValidated()}
        >
            <div style={{ padding: '10px 20px 10px 20px' }}>
                <div className={`form-group ${!oldPassword2Error ? "" : "has-error"}`}>
                    <label>{translate('auth.security.old_password2')}<span className="text-red">*</span></label>
                    <input className="form-control" type="password" onChange={handleChangeOldPassword2} placeholder="Nhập mật khẩu cấp 2 cũ" />
                    <ErrorLabel content={oldPassword2Error} />
                </div>
            </div>
        </DialogModal>
    );
}

const mapDispatchToProps = {
    deletePassword2: AuthActions.deletePassword2,
}

export default connect(null, mapDispatchToProps)(withTranslate(DeletePassword2));