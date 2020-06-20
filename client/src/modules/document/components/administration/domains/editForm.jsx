import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
import TreeSelect from 'rc-tree-select';

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
        this.setState({ domainParent: value });
    };

    save = () => {
        const {domainId,  domainName, domainDescription, domainParent} = this.state;
        this.props.editDocumentDomain(domainId, {
            name: domainName,
            description: domainDescription,
            parent: domainParent
        });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.domainId !== prevState.domainId) {
            return {
                ...prevState,
                domainId: nextProps.domainId,
                domainName: nextProps.domainName,
                domainDescription: nextProps.domainDescription,
                domainParent: nextProps.domainParent
            } 
        } else {
            return null;
        }
    }

    render() {
        const {translate, documents}=this.props;
        const domains = documents.administration.domains.tree;
        const {domainId, domainName, domainDescription, domainParent} = this.state;

        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-edit-document-domain" button_name={translate('general.edit')} title={translate('document.administration.domains.edit')}/>
                <DialogModal
                    modalID="modal-edit-document-domain"
                    formID="form-edit-document-domain"
                    title={translate('document.administration.domains.edit')}
                    func={this.save}
                >
                    <form id="form-edit-document-domain">
                                <div className="form-group">
                                <label>{ translate('document.administration.domains.name') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" onChange={this.handleName} value={domainName}/>
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
                                    value={domainParent}
                                    treeData={domains}
                                    treeNodeFilterProp="label"
                                    filterTreeNode={false}
                                    onChange={this.handleParent}
                                />
                                </div>
                            </div>
                            <div className="form-group">
                                    <label>{ translate('document.administration.domains.description') }<span className="text-red">*</span></label>
                                    <textarea type="text" className="form-control" onChange={this.handleDescription} value={domainDescription}/>
                                </div>
                                </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocumentDomain: DocumentActions.editDocumentDomain
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(EditForm) );