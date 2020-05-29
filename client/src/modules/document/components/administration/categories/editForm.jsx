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
            documentTypeName: value
        })
    }

    handleDescription = (e) => {
        const value = e.target.value;
        this.setState({
            documentTypeDescription: value
        })
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
        return ( 
            <DialogModal
                modalID="modal-create-document-type"
                formID="form-create-document-type"
                title={translate('document.administration.categories.add')}
                func={this.save}
            >
                <form id="form-create-document-type">
                    <div className="form-group">
                        <label>{ translate('document.administration.categories.name') }<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={this.handleName}/>
                    </div>
                    <div className="form-group">
                        <label>{ translate('document.administration.categories.description') }<span className="text-red">*</span></label>
                        <textarea type="text" className="form-control" onChange={this.handleDescription}/>
                    </div>
                </form>
            </DialogModal>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentCategory: DocumentActions.createDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(EditForm) );