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
        }
    }

    handleSelect = (value) => {
        console.log('onChange ', value);
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
            <React.Fragment>
                
                <ButtonModal modalID="modal-create-document-type" button_name={translate('general.add')} title={translate('manage_user.add_title')}/>
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
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    createDocumentCategory: DocumentActions.createDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CreateForm) );