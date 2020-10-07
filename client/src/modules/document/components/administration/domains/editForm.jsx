import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            domainName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            domainDescription: value
        })
    }

    handleParent = (value) => {
        this.setState({ domainParent: value[0] });
    };

    validateName = async (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('document.no_blank_name');
        }
        if (willUpdateState) {
            await this.setState(state => {
                return {
                    ...state,
                    domainName: value,
                    errorName: msg
                }
            })
        }

        return msg === undefined;
    }

    handleValidateName = (e) => {
        const value = e.target.value.trim();
        this.validateName(value, true);
    }
    isValidateForm = () => {
        return this.validateName(this.state.domainName, false);
    }

    save = () => {
        const { domainId, domainName, domainDescription, domainParent } = this.state;
        this.props.editDocumentDomain(domainId, {
            name: domainName,
            description: domainDescription,
            parent: domainParent
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.domainId !== prevState.domainId) {
            return {
                ...prevState,
                domainId: nextProps.domainId,
                domainName: nextProps.domainName,
                domainDescription: nextProps.domainDescription,
                domainParent: nextProps.domainParent,
                errorName: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, documents } = this.props;
        const { list } = documents.administration.domains;
        const { domainName, domainDescription, domainParent, errorName } = this.state;

        return (
            <div id="edit-document-domain">
                <div className={`form-group ${errorName === undefined ? "" : "has-error"}`}>
                    <label>{translate('document.administration.domains.name')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleValidateName} value={domainName} />
                    <ErrorLabel content={errorName} />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.domains.parent')}</label>
                    <TreeSelect data={list} value={[domainParent]} handleChange={this.handleParent} mode="radioSelect" />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.domains.description')}</label>
                    <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={this.handleDescription} value={domainDescription} />
                </div>
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={this.save}>{translate('form.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-document-domain`).slideUp()
                    }}>{translate('form.close')}</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocumentDomain: DocumentActions.editDocumentDomain
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));