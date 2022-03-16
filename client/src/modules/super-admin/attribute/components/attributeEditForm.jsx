import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

import { AttributeActions } from '../redux/actions';

function AttributeEditForm(props) {
    // Khởi tạo state
    const [state, setState] = useState({
        attributeID: undefined,
        attributeName: "",
        description: "",
        attributeNameError: {
            message: undefined,
            status: true
        }
    })

    const { translate, attribute } = props;
    const { attributeName, description, attributeNameError, attributeID } = state;

    // setState từ props mới
    if (props.attributeID !== attributeID) {
        setState({
            ...state,
            attributeID: props.attributeID,
            attributeName: props.attributeName,
            description: props.description,
            attributeNameError: {
                message: undefined,
                status: true
            }
        })
    }

    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!attributeNameError.status) {
            return false;
        }
        return true;
    }


    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = () => {
        if (isFormValidated) {
            props.editAttribute(attributeID, { attributeName, description });
        }
    }


    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handleAttributeName = (e) => {
        const { value } = e.target;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            attributeName: value,
            attributeNameError: result
        });
    }


    /**
     * Hàm xử lý khi mô tả ví dụ thay đổi
     * @param {*} e 
     */
    const handleAttributeDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-attribute-hooks`} isLoading={attribute.isLoading}
                formID={`form-edit-attribute-hooks`}
                title={translate('manage_attribute.edit_title')}
                disableSubmit={!isFormValidated}
                func={save}
                size={50}
                maxWidth={500}
            >
                <form id={`form-edit-attribute-hooks`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group ${attributeNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_attribute.attributeName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={attributeName} onChange={handleAttributeName} />
                        <ErrorLabel content={attributeNameError.message} />
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_attribute.description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handleAttributeDescription} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const attribute = state.attribute;
    return { attribute }
}

const actions = {
    editAttribute: AttributeActions.editAttribute
}

const connectedAttributeEditForm = connect(mapState, actions)(withTranslate(AttributeEditForm));
export { connectedAttributeEditForm as AttributeEditForm };