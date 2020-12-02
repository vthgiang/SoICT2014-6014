import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { exampleActions } from '../redux/actions';

import { DialogModal, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';


class ExampleEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleName: "",
            description: "",
            exampleNameError: {
                message: undefined,
                status: true
            }
        }
    }

    isFormValidated = () => {
        const { exampleNameError } = this.state;
        if (!exampleNameError.status) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated) {
            const { exampleID, exampleName, description } = this.state;
            this.props.editExample(exampleID, { exampleName, description });
        }
    }

    handleExampleName = (e) => {
        const { value } = e.target;
        
        let { translate } = this.props;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        this.setState(state => {
            return {
                ...state,
                exampleName: value,
                exampleNameError: result,
            }
        });
    }

    handleExampleDescription = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        })
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.exampleID !== prevState.exampleID) {
            return {
                ...prevState,
                exampleID: nextProps.exampleID,
                exampleName: nextProps.exampleName,
                description: nextProps.description,
                exampleNameError: {
                    message: undefined,
                    status: true
                }
            }
        } else {
            return null;
        }
    }

    render() {
        const { example, translate } = this.props;
        const { exampleName, exampleNameError, description } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-example`} isLoading={example.isLoading}
                    formID={`form-edit-example`}
                    title={translate('manage_example.edit_title')}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size={50}
                    maxWidth={500}
                >
                    <form id={`form-edit-example`}>
                        <div className={`form-group ${exampleNameError.status ? "" : "has-error"}`}>
                            <label>{translate('manage_example.exampleName')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={exampleName} onChange={this.handleExampleName} />
                            <ErrorLabel content={exampleNameError.message} />
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_example.description')}</label>
                            <input type="text" className="form-control" value={description} onChange={this.handleExampleDescription} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const example = state.example1;
    return { example }
}

const mapDispatchToProps = {
    editExample: exampleActions.editExample
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleEditForm));