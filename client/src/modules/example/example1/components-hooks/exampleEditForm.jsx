import React, { useState, useEffect } from 'react';
import { connect  } from 'react-redux';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

import { exampleActions } from '../redux/actions';

function ExampleEditForm(props) {
    // Khởi tạo state
    const [state, setState] = useState({
        exampleID: undefined,
        exampleName: "",
        description: "",
        exampleNameError: undefined
    })

    const { translate, example } = props;
    const { exampleName, description, exampleNameError, exampleID } = state;

    // setState từ props mới
    if (props.exampleID !== exampleID) {
        setState({
            ...state,
            exampleID: props.exampleID,
            exampleName: props.exampleName,
            description: props.description,
            exampleNameError: undefined
        })
    }
        
    const isFormValidated = () => {
        if (!ValidationHelper.validateName(translate, exampleName, 6, 255).status) {
            return false;
        }
        return true;
    }

    const save = () => {
        if (isFormValidated) {
            props.editExample(exampleID, { exampleName, description });
        }
    }

    const handleExampleName = (e) => {
        const { value } = e.target;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            exampleName: value,
            exampleNameError: message
        });
    }

    const handleExampleDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-example`} isLoading={example.isLoading}
                formID={`form-edit-example`}
                title={translate('manage_example.edit_title')}
                disableSubmit={!isFormValidated}
                func={save}
                size={50}
                maxWidth={500}
            >
                <form id={`form-edit-example`}>
                    <div className={`form-group ${!exampleNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_example.exampleName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={exampleName} onChange={handleExampleName} />
                        <ErrorLabel content={exampleNameError} />
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('manage_example.description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handleExampleDescription} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const example = state.example1;
    return { example }
}
const actions = {
    editExample: exampleActions.editExample
}

const connectedExampleEditForm = connect(mapState, actions)(withTranslate(ExampleEditForm));
export { connectedExampleEditForm as ExampleEditForm };