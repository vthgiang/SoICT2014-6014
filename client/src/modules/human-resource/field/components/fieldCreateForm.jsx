import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components';

import { FieldsActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

class FieldCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ''
        };
    }


    handleChangeName = (e) => {
        const { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 3, 255);
        this.setState({
            name: value,
            errorOnName: message
        });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }


    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        let { name } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, name, 3, 255).status) return false;
        return true;
    }

    /** Bắt sự kiện submit form */
    save = () => {
        this.props.createFields(this.state)
    }

    render() {
        const { translate, field } = this.props;

        const { name, description, errorOnName } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-field" button_name={translate('human_resource.field.add_fields')} title={translate('human_resource.field.add_fields_title')} />
                <DialogModal
                    size='50' modalID="modal-create-field" isLoading={field.isLoading}
                    formID="form-create-annual-leave"
                    title={translate('human_resource.field.add_fields_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-field">
                        {/* Tên ngành nghề/lĩnh vực */}
                        <div className={`form-group ${errorOnName && "has-error"}`}>
                            <label>{translate('human_resource.field.table.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleChangeName} autoComplete="off"></input>
                            <ErrorLabel content={errorOnName} />
                        </div>
                        {/* Mô tả */}
                        <div className={`form-group`}>
                            <label>{translate('human_resource.field.table.description')}</label>
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="description" value={description} onChange={this.handleChange} placeholder="Enter ..." autoComplete="off"></textarea>
                        </div>

                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { field } = state;
    return { field };
};

const actionCreators = {
    createFields: FieldsActions.createFields,
};

const createForm = connect(mapState, actionCreators)(withTranslate(FieldCreateForm));
export { createForm as FieldCreateForm };
