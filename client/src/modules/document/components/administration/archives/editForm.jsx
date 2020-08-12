import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { Dialog, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class EditForm extends Component {
    constructor(props) {
        this.state = {

        }
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            archiveName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            archiveDescription: value
        })
    }
    handleParent = (value) => {
        this.setState({ archiveParent: value[0] });
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
                    archiveName: value,
                    errorName: msg
                }
            })
        }

        return msg === undefined;
    }

    isValidateForm = () => {
        return this.validateName(this.state.archiveName, false);
    }

    save = () => {
        const { archiveId, archiveName, archiveDescription, archiveParent } = this.state;
        this.props.editDocumentDomain(archiveId, {
            name: archiveName,
            description: archiveDescription,
            parent: archiveParent
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.archiveId !== prevState.archiveId) {
            return {
                ...prevState,
                archiveId: nextProps.archiveId,
                archiveName: nextProps.archiveName,
                archiveDescription: nextProps.archiveDescription,
                archiveParent: nextProps.archiveParent,
                errorName: undefined,
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, documents } = this.props;
        const { tree, list } = document.administration.archives;
        const { archiveId, archiveName, archiveDescription, archiveParent, errorName } = this.state;

        return (
            <div id="edit-document-archive">
                <div className={`form-group ${errorName === undefined ? "" : "has-error"}`}>
                    <label>Tên mục lưu trữ<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleValidateName} value={archiveName} />
                    <ErrorLabel content={errorName} />
                </div>
                <div className="form-group">
                    <label>Nút cha</label>
                    <TreeSelect data={list} value={[archiveParent]} handleChange={this.handleParent} mode="radioSelect" />
                </div>
                <div className="form-group">
                    <label>Mô tả</label>
                    <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={this.handleDescription} value={archiveDescription} />
                </div>
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={this.save}>{translate('form.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-document-archive`).slideUp()
                    }}>{translate('form.close')}</button>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocumentArchive: DocumentActions.editDocumentArchive
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));