import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';
class CreateForm extends Component {
    constructor(props) {
        super(props);
        console.log('cons', this.props.domainParent);
        this.state = {
            domainParent: this.props.domainParent,
        }
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
        this.setState({ domainParent: value[0] });
    };
    validateName = (value, willUpdateState)=>{
        let msg = undefined;
        const {translate} = this.props;
        if(!value){
            msg = translate('document.no_blank_name');
        }
        if(willUpdateState){
            this.setState(state=>{
                return{
                    ...state,
                    documentName: value,
                    errorName: msg,
                }
            })
        }
        return msg === undefined;
    }
    handleValidateName = (e)=>{
        const value = e.target.value.trim();
        this.validateName(value, true);
    }
    
    isValidateForm = ()=>{
        return this.validateName(this.state.documentName, false);
    }

    save = () => {
        const {documentName, documentDescription, domainParent} = this.state;
        this.props.createDocumentDomain({
            name: documentName,
            description: documentDescription,
            parent: domainParent ? domainParent : ""
        });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.domainParent !== prevState.domainParent && nextProps.domainParent.length) {
            let dm = nextProps.domainParent;
            return {
                ...prevState,
                domainParent: dm,
            } 
        } else {
            return null;
        }
    }

    render() {
        const { translate, documents } = this.props;
        const { list } = documents.administration.domains;
        const { domainParent, errorName } = this.state;
        return ( 
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-document-domain"
                    formID="form-create-document-domain"
                    title={translate('document.administration.domains.add')}
                    disableSubmit = {!this.isValidateForm()}
                    func={this.save}
                >
                    <form id="form-create-document-domain">
                            <div className={`form-group ${!errorName ? "" : "has-error"}`}>
                            <label>{ translate('document.administration.domains.name') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleValidateName}/>
                            <ErrorLabel content ={errorName}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('document.administration.domains.parent') }</label>
                            <TreeSelect data={list} value={!domainParent ? "" : domainParent} handleChange={this.handleParent} mode="radioSelect"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('document.administration.domains.description') }</label>
                            <textarea style={{minHeight: '100px'}} type="text" className="form-control" onChange={this.handleDescription}/>
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