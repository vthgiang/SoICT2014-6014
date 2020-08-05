import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryName: '',
            categoryDescription: '',
            errorName: '',
            errorDescription: '',
        }
    }

    handleName = (e) => {
        const value = e.target.value;
        this.setState({
            categoryName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            categoryDescription: value
        })
    }

    validateName = (value, willUpdateState)=>{
        console.log('valueeeeName', value);
        let msg = undefined;
        const {translate} = this.props;
        if(!value){
            msg = translate('document.no_blank_name');
        }
        if(willUpdateState){
            this.setState(state=>{
                return{
                    ...state,
                    categoryName: value,
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

    validateDescription = (value, willUpdateState)=>{
        console.log('valueDessss', value);
        let msg = undefined;
        const {translate} = this.props;
        if(value === ''){
            msg = translate('document.no_blank_description');
        }
        if(willUpdateState){
            this.setState(state=>{
                return{
                    ...state,
                    categoryDescription: value,
                    errorDescription: msg,
                }
            })
        }
        return msg === undefined;
    }
    handleValidateDescription = (e)=>{
        const value = e.target.value.trim();
        this.validateDescription(value, true);
    }
    isValidateForm = ()=>{
        console.log('111111',this.validateDescription(this.state.categoryDescription, false) );
        console.log('2222222222',this.validateName(this.state.validateName, false))
        return this.validateDescription(this.state.categoryDescription, false) 
            && this.validateName(this.state.categoryName, false);
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.categoryId !== prevState.categoryId) {
            return {
                ...prevState,
                categoryId: nextProps.categoryId,
                categoryName: nextProps.categoryName,
                categoryDescription: nextProps.categoryDescription,

                errorName: undefined,
                errorDescription: undefined,
            } 
        } else {
            return null
        }
    }

    save = () => {
        const { categoryId, categoryName, categoryDescription } = this.state;
        this.props.editDocumentCategory(categoryId, {
            name: categoryName,
            description: categoryDescription
        });
    }

    render() {
        const { translate }=this.props;
        const { categoryName, categoryDescription, errorName, errorDescription } = this.state;
    
        return ( 
            <DialogModal
                modalID="modal-edit-document-category"
                formID="form-edit-document-category"
                title={translate('document.administration.categories.edit')}
                disableSubmit = {!this.isValidateForm()}
                func={this.save}
            >
                <form id="form-edit-document-category">
                    <div className={`form-group ${errorName === undefined ? "" : "has-error"}`}>
                        <label>{ translate('document.administration.categories.name') }<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={this.handleValidateName} value={categoryName}/>
                        <ErrorLabel content = {errorName}/>
                    </div>
                    <div className={`form-group ${errorDescription === undefined ? "" : "has-error"}`}>
                        <label>{ translate('document.administration.categories.description') }<span className="text-red">*</span></label>
                        <textarea type="text" className="form-control" onChange={this.handleValidateDescription} value={categoryDescription}/>
                        <ErrorLabel content = {errorDescription} />
                    </div>
                </form>
            </DialogModal>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    editDocumentCategory: DocumentActions.editDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(EditForm) );