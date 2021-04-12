import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel } from '../../../../common-components';

import { FieldsActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

const FieldEditForm = (props) => {
    
    const [state, setState] = useState({});


    const handleChangeName = (e) => {
        const { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState(state => ({
            ...state,
            name: value,
            errorOnName: message
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => ({
            ...state,
            [name]: value
        }))
    }


    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        let { name } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, name, 3, 255).status) return false;
        return true;
    }

    /** Bắt sự kiện submit form */
    const save = () => {
        const { updateFields } = props;
        updateFields(state._id, state)
    }

    if (props._id != state._id) {
        setState(state => ({
            ...state,
            _id: props._id,
            name: props.name,
            description: props.description,
            errorOnName: undefined
        }))
    }

    const { translate, field } = props;

    const { _id, name, description, errorOnName } = state;
    
    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`modal-edit-field${_id}`} isLoading={field.isLoading}
                formID="form-edit-annual-leave"
                title={translate('human_resource.field.edit_fields')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-edit-field${_id}`}>
                    {/* Tên ngành nghề/lĩnh vực */}
                    <div className={`form-group ${errorOnName && "has-error"}`}>
                        <label>{translate('human_resource.field.table.name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="name" value={name} onChange={handleChangeName} autoComplete="off"></input>
                        <ErrorLabel content={errorOnName} />
                    </div>
                    {/* Mô tả */}
                    <div className={`form-group`}>
                        <label>{translate('human_resource.field.table.description')}</label>
                        <textarea className="form-control" rows="3" style={{ height: 72 }} name="description" value={description} onChange={handleChange} placeholder="Enter ..." autoComplete="off"></textarea>
                    </div>

                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { field } = state;
    return { field };
};

const actionCreators = {
    updateFields: FieldsActions.updateFields,
};

const editForm = connect(mapState, actionCreators)(withTranslate(FieldEditForm));
export { editForm as FieldEditForm };
