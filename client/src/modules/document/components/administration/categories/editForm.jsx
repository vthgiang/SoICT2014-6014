import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.categoryId !== prevState.categoryId) {
            return {
                ...prevState,
                categoryId: nextProps.categoryId,
                categoryName: nextProps.categoryName,
                categoryDescription: nextProps.categoryDescription,
            } 
        } else {
            return null;
        }
    }

    save = () => {
        const {categoryId, categoryName, categoryDescription} = this.state;
        this.props.editDocumentCategory(categoryId, {
            name: categoryName,
            description: categoryDescription
        });
    }

    render() {
        const {translate}=this.props;
        const {categoryName, categoryDescription} = this.state;
        return ( 
            <DialogModal
                modalID="modal-edit-document-category"
                formID="form-edit-document-category"
                title={translate('document.administration.categories.edit')}
                func={this.save}
            >
                <form id="form-edit-document-category">
                    <div className="form-group">
                        <label>{ translate('document.administration.categories.name') }<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={this.handleName} value={categoryName}/>
                    </div>
                    <div className="form-group">
                        <label>{ translate('document.administration.categories.description') }<span className="text-red">*</span></label>
                        <textarea type="text" className="form-control" onChange={this.handleDescription} value={categoryDescription}/>
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