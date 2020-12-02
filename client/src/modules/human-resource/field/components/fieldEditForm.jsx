import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel } from '../../../../common-components';

import { FieldsActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

class FieldEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    handleChangeName = (e) => {
        const { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
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
        this.props.updateFields(this.state._id, this.state)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                name: nextProps.name,
                description: nextProps.description,
                errorOnName: undefined,

            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, field } = this.props;

        const { _id, name, description, errorOnName } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-field${_id}`} isLoading={field.isLoading}
                    formID="form-edit-annual-leave"
                    title={translate('human_resource.field.edit_fields')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-field${_id}`}>
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
    updateFields: FieldsActions.updateFields,
};

const editForm = connect(mapState, actionCreators)(withTranslate(FieldEditForm));
export { editForm as FieldEditForm };
