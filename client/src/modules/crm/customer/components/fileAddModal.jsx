import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, UploadFile, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

class FileAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handlefileNameChange = (e) => {
        const { value } = e.target;
        const { translate } = this.props;
        this.setState({
            name: value,
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ nameError: message });
    }


    handleDescriptionFileChange = (e) => {
        const { value } = e.target;
        const { translate } = this.props;
        this.setState({
            description: value,
        })

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ descriptionError: message });
    }


    handleChangeFile = (value) => {
        console.log('value', value)
        if (value && value.length > 0) {
            this.setState({
                fileName: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload,
            })
        } else {
            this.setState({
                fileName: "",
                urlFile: "",
            })
        }
    }


    isFormValidated = () => {
        const { name, description } = this.state;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, name).status ||
            !ValidationHelper.validateName(translate, description).status)
            return false;
        return true;
    }


    save = () => {
        if (this.isFormValidated) {
            this.props.callBackFromParentCreateForm(this.state);
        }
    }

    render() {
        const { translate } = this.props;
        //validate
        const { nameError, descriptionError } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-file`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_file')} />
                <DialogModal
                    size='50' modalID={`modal-create-file`} isLoading={false}
                    formID={`form-create-file`}
                    title={translate('crm.customer.file.add_file')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-file`}>
                        {/* Tên tài liệu  */}
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('crm.customer.file.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" onChange={this.handlefileNameChange} autoComplete="off" />
                            <ErrorLabel content={nameError} />
                        </div>

                        {/* Mô tả */}
                        <div className={`form-group ${!descriptionError ? "" : "has-error"}`}>
                            <label>{translate('crm.customer.file.description')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="description" onChange={this.handleDescriptionFileChange} autoComplete="off" />
                            <ErrorLabel content={descriptionError} />
                        </div>

                        {/* File đính kèm */}
                        <div className="form-group">
                            <label htmlFor="file">{translate('crm.customer.file.url')}</label>
                            <UploadFile onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(FileAddModal));