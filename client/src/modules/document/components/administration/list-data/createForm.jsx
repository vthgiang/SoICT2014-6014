import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { DocumentActions } from '../../../redux/actions';

class CreateForm extends Component {
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
            <React.Fragment>
                <ButtonModal modalID="modal-create-document" button_name={translate('general.add')} title={translate('manage_user.add_title')}/>
                <DialogModal
                    modalID="modal-create-document" size="75"
                    formID="form-create-document"
                    title={translate('document.add')}
                    func={this.save}
                >
                    <form id="form-create-document">
                        
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{ translate('document.name') }<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" onChange={this.handleName}/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('document.category') }<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" onChange={this.handleName}/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('document.domain') }<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" onChange={this.handleName}/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{ translate('document.description') }<span className="text-red">*</span></label>
                                    <textarea type="text" className="form-control" onChange={this.handleDescription}/>
                                </div>
                            </div>
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