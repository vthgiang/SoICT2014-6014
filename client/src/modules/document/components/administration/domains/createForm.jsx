import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import TreeSelect from 'rc-tree-select';

class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            documentName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            documentDescription: value
        })
    }

    handleParent = (value) => {
        this.setState({ documentParent: value });
    };

    save = () => {
        const {documentName, documentDescription, documentParent} = this.state;
        this.props.createDocumentDomain({
            name: documentName,
            description: documentDescription,
            parent: documentParent
        });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.documentParent !== prevState.documentParent && nextProps.documentParent !== undefined) {
            return {
                ...prevState,
                documentParent: nextProps.documentParent
            } 
        } else {
            return null;
        }
    }

    render() {
        const {translate, documents}=this.props;
        const domains = documents.administration.domains.tree;
        const {documentParent} = this.state;

        console.log("this.state: ", this.state)
        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-document-domain" button_name={translate('general.add')} title={translate('manage_user.add_title')}/>
                <DialogModal
                    modalID="modal-create-document-domain"
                    formID="form-create-document-domain"
                    title={translate('document.administration.domains.add')}
                    func={this.save}
                >
                    <form id="form-create-document-domain">
                                <div className="form-group">
                                <label>{ translate('document.administration.domains.name') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={this.handleName}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate('document.administration.domains.parent') }<span className="text-red">*</span></label>
                                <div>
                                <TreeSelect
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                    style={{ width: '100%' }}
                                    transitionName="rc-tree-select-dropdown-slide-up"
                                    choiceTransitionName="rc-tree-select-selection__choice-zoom"
                                    placeholder={<i>{translate('document.administration.domains.select_parent')}</i>}
                                    showSearch
                                    allowClear
                                    treeLine
                                    value={documentParent}
                                    treeData={domains}
                                    treeNodeFilterProp="label"
                                    filterTreeNode={false}
                                    onChange={this.handleParent}
                                />
                                </div>
                            </div>
                            <div className="form-group">
                                    <label>{ translate('document.administration.domains.description') }<span className="text-red">*</span></label>
                                    <textarea type="text" className="form-control" onChange={this.handleDescription}/>
                                </div>
                                </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentDomain: DocumentActions.createDocumentDomain
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CreateForm) );