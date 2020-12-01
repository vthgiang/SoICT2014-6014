import React, { useState, useEffect } from 'react';
import { connect  } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';

import { exampleActions } from '../redux/actions';

function ExampleCreateForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: undefined,
        description: undefined,
        exampleNameError: {
            message: undefined,
            status: true
        }
    })

    const { translate, example, page, limit } = props;
    const { exampleName, description, exampleNameError } = state;


    const isFormValidated = () => {
        if (!exampleNameError.status) {
            return false;
        }
        return true;
    }

    const save = () => {
        if (isFormValidated() && exampleName) {
            props.createExample([{ exampleName, description }]);
            props.getExamples({
                exampleName: "",
                page: page,
                limit: limit
            });
        }
    }

    const handleExampleName = (e) => {
        const { value } = e.target;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            exampleName: value,
            exampleNameError: result
        })
    }

    const handleExampleDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        });
    }

    
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-example-hooks" isLoading={example.isLoading}
                formID="form-create-example-hooks"
                title={translate('manage_example.add_title')}
                msg_success={translate('manage_example.add_success')}
                msg_faile={translate('manage_example.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-example-hooks" onSubmit={() => save(translate('manage_example.add_success'))}>
                    <div className={`form-group ${exampleNameError.status ? "" : "has-error"}`}>
                        <label>{translate('manage_example.exampleName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={exampleName} onChange={handleExampleName}></input>
                        <ErrorLabel content={exampleNameError.message} />
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('manage_example.example_description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handleExampleDescription}></input>
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
    createExample: exampleActions.createExample,
    getExamples: exampleActions.getExamples,
}

const connectedExampleCreateForm = connect(mapState, actions)(withTranslate(ExampleCreateForm));
export { connectedExampleCreateForm as ExampleCreateForm };