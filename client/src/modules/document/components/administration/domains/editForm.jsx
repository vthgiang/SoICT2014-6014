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
        const {tree,list} = documents.administration.domains;
        const {domainId, domainName, domainDescription, domainParent} = this.state;
        
        return ( 
            <React.Fragment>
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
                                <TreeSelect data={list} value={[domainParent]} handleChange={this.handleParent} mode="radioSelect"/>
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