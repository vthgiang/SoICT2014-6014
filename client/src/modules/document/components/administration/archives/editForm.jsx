import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { Dialog, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleValidateName = (e) => {
        const value = e.target.value;
        this.validateName(value, true);
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
    findNode = (element, id) => {
        if (element.id === id) {
            return element
        }
        else if (element.children) {
            let i;
            let result = "";
            for (i = 0; i < element.children.length; i++) {
                result = this.findNode(element.children[i], id);
            }
            return result;
        }
        return null;
    }
    // tìm các node con cháu
    addNode = (list, node) => {
        let array = [];
        let queue_children = [node];
        while (queue_children.length > 0) {
            let tmp = queue_children.shift();
            array = [...array, tmp._id];
            let children = list.filter(child => child.parent === tmp._id);
            queue_children = queue_children.concat(children);
        }
        return array
    }
    save = () => {
        const { translate, documents } = this.props;
        const { archiveId, archiveName, archiveDescription, archiveParent } = this.state;
        const { tree, list } = documents.administration.archives;

        let node = "";
        // find node
        node = list.filter(archive => archive._id === archiveId)[0]
        //  node = nodes[0];
        // find node child 
        let array = [];
        if (node) {
            array = this.addNode(list, node);
        }

        this.props.editDocumentArchive(archiveId, {
            name: archiveName,
            description: archiveDescription,
            parent: archiveParent,
            array: array,
        });
        //this.props.getDocumentArchives();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.archiveId !== prevState.archiveId) {
            return {
                ...prevState,
                archiveId: nextProps.archiveId,
                archiveName: nextProps.archiveName,
                archiveDescription: nextProps.archiveDescription,
                archiveParent: nextProps.archiveParent,
                archivePath: nextProps.archivePath,
                errorName: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, documents } = this.props;
        const { tree, list } = documents.administration.archives;
        const { archiveId, archiveName, archiveDescription, archiveParent, archivePath, errorName } = this.state;
        const archives = documents.administration.archives.list;
        return (
            <div id="edit-document-archive">
                <div className={`form-group ${errorName === undefined ? "" : "has-error"}`}>
                    <label>{translate('document.administration.archives.name')}<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleValidateName} value={archiveName} />
                    <ErrorLabel content={errorName} />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.archives.parent')}</label>
                    <TreeSelect data={list} value={[archiveParent]} handleChange={this.handleParent} mode="radioSelect" />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.domains.path')}</label>
                    <textarea style={{ minHeight: '30px' }} type="text" className="form-control" value={archivePath} disable />
                </div>
                <div className="form-group">
                    <label>{translate('document.administration.domains.description')}</label>
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
    editDocumentArchive: DocumentActions.editDocumentArchive,
    getDocumentArchives: DocumentActions.getDocumentArchive,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));