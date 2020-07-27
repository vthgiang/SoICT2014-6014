import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ['0-0-0'],
            documentTypeName: '',
            documentTypeDescription: '',

            errorName: undefined,
            errorDescription: undefined,
        }
    }

    handleSelect = (value) => {
        this.setState({ value });
    };
    

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            documentTypeName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            documentTypeDescription: value
        })
    }

    validateTypeName = (value, willUpdateState)=>{
        let msg = undefined;
        const {translate} = this.props;
        if(value === ""){
            msg =  translate('document.no_blank_name');
        }
        if(willUpdateState){
            this.setState(state=>{
               return{
                   ...state,
                   documentTypeName: value,
                   errorName: msg
               }
            })
        }
        return msg === undefined ;
    }

    handleValidateTypeName = e =>{
        let value = e.target.value.trim();
        this.validateTypeName(value, true);
    }
    validateTypeDescription = (value, willUpdateState)=>{
        const {translate} = this.props;
        let msg = undefined;
        if(value === ""){
            msg = translate('document.no_blank_description');
        }
        if(willUpdateState){
            this.setState(state=>{
               return{
                   ...state,
                   documentTypeDescription: value,
                   errorDescription: msg
               }
            })
        }
        return msg === undefined;
    }

    handleValidateTypeDescription = e =>{
        let value = e.target.value.trim();
        this.validateTypeDescription(value, true);
    }
    isFormValidated = () =>{
       // let {documentTypeDescription, documentTypeName} = this.state
        
        let cons = this.validateTypeName(this.state.documentTypeName, false) 
        &&  this.validateTypeDescription(this.state.documentTypeDescription, false);
     
        return cons;
    }

    save = () => {
        const {documentTypeName, documentTypeDescription} = this.state;
        this.props.createDocumentCategory({
            name: documentTypeName,
            description: documentTypeDescription
        });
    }

    render() {
        const {translate}=this.props;
        const {errorName, errorDescription} = this.state;
        return ( 
            <React.Fragment>
                
                <ButtonModal modalID="modal-create-document-type" button_name={translate('general.add')} title={translate('manage_user.add_title')}/>
                <DialogModal
                    modalID="modal-create-document-type"
                    formID="form-create-document-type"
                    title={translate('document.administration.categories.add')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-create-document-type">
                        <div className={`form-group ${errorName === undefined ? "" : "has-error"}`}>
                            <label>{ translate('document.administration.categories.name') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control"
                             onChange={this.handleValidateTypeName}/>
                             <ErrorLabel content={errorName}/>
                        </div>
                        <div className={`form-group ${errorDescription === undefined ? "" : "has-error"}`}>
                            <label>{ translate('document.administration.categories.description') }<span className="text-red">*</span></label>
                            <textarea type="text" className="form-control" onChange={this.handleValidateTypeDescription}/>
                            <ErrorLabel content={errorDescription}/>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentCategory: DocumentActions.createDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CreateForm) );