import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { DocumentActions } from '../../../redux/actions';

function EditForm(props) {

    const [state, setState] = useState({})
    const handleName = (e) => {
        const value = e.target.value;
        const { translate } = props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        setState({
            ...state,
            name: value,
            nameError: message
        })
    }

    const handleDescription = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            description: value
        })
    }

    const isValidateForm = () => {
        const { translate } = props;
        const { name } = state;
        if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false;
        return true;
    }
    useEffect(() => {
        setState({
            ...state,
            categoryId: props.categoryId,
            name: props.categoryName,
            description: props.categoryDescription,
            nameError: undefined
        })
    }, [props.categoryId])
    const save = () => {
        if (isValidateForm()) {
            const { categoryId, name, description } = state;
            props.editDocumentCategory(categoryId, {
                name,
                description
            });
        }
    }

    const { translate } = props;
    const { name, description, nameError } = state;

    return (
        <DialogModal
            modalID="modal-edit-document-category"
            formID="form-edit-document-category"
            title={translate('document.administration.categories.edit')}
            disableSubmit={!isValidateForm()}
            func={save}
        >
            <form id="form-edit-document-category">
                <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                    <label>{translate('document.administration.categories.name')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={handleName} value={name} />
                    <ErrorLabel content={nameError} />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.categories.description')}<span className="text-red">*</span></label>
                    <textarea type="text" className="form-control" onChange={handleDescription} value={description} />
                </div>
            </form>
        </DialogModal>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocumentCategory: DocumentActions.editDocumentCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));