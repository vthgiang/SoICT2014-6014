import React, { Component } from 'react';
import { exampleActions } from '../redux/actions';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';


class ExampleEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.exampleId !== this.props.exampleId) {
            this.props.getExampleDetail(nextProps.exampleId);
            return false;
        }

        const { example } = this.props;
        const { exampleId, exampleName, description } = this.state;

        let currentDetailExample;

        if (example?.currentDetailExample) {
            currentDetailExample = example.currentDetailExample;
        }
        if (currentDetailExample && !exampleId && !exampleName && !description) {
            this.setState(state => {
                return {
                    ...state,
                    exampleId: currentDetailExample._id,
                    exampleName: currentDetailExample.exampleName,
                    description: currentDetailExample.description
                }
            })
        }

        return true;
    }

    isFormValidated = () => {
        const { exampleName } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, exampleName, 6, 255).status) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated) {
            const { exampleId, exampleName } = this.state;
            this.props.editExample(exampleId, { exampleName });
        }
    }

    handleExampleName = (e) => {
        const { value } = e.target;
        this.setState({
            exampleName: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({
            exampleNameError: message
        });
    }

    handleExampleDescription = (e) => {
        const { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                description: value
            }
        })
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
                        <div className={`form-group ${!exampleNameError ? "" : "has-error"}`}>
                            <label>{translate('manage_example.exampleName')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={exampleName} onChange={this.handleExampleName} />
                            <ErrorLabel content={exampleNameError} />
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manage_example.example_description')}</label>
                            <input type="text" className="form-control" value={description} onChange={this.handleExampleDescription} ></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const example = state.example3;
    return { example }
}

const mapDispatchToProps = {
    editExample: exampleActions.editExample,
    getExampleDetail: exampleActions.getExampleDetail
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleEditForm));