import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { exampleActions } from '../redux/actions';

const ExampleCreateForm = (props) => {
    const { example, translate, page, perPage } = props;
    
    const [state, setState] = useState({
        exampleName: "",
        description: "",
        exampleNameError: undefined
    })
    const { exampleName, description, exampleNameError } = state;

    const isFormValidated = () => {
        const { exampleName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, exampleName, 6, 255).status) {
            return false;
        }
        return true;
    }

    const save = () => {
        if (isFormValidated()) {
            props.createExample([{ exampleName, description }]);
            props.getOnlyExampleName({
                exampleName: "",
                page: page,
                perPage: perPage
            })
        }
    }

    const handleExampleName = (e) => {
        const { value } = e.target;

        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            exampleName: value,
            exampleNameError: message
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
            <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} />
            <DialogModal
                modalID="modal-create-example" isLoading={example.isLoading}
                formID="form-create-example"
                title={translate('manage_example.add_title')}
                msg_success={translate('manage_example.add_success')}
                msg_failure={translate('manage_example.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-example" onSubmit={() => save(translate('manage_example.add_success'))}>
                    <div className={`form-group ${!exampleNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_example.exampleName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={exampleName} onChange={handleExampleName}></input>
                        <ErrorLabel content={exampleNameError} />
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

function mapStateToProps(state) {
    const example = state.example3;
    return { example }
}

const mapDispatchToProps = {
    createExample: exampleActions.createExample,
    getOnlyExampleName: exampleActions.getOnlyExampleName
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleCreateForm)); 