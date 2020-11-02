import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmStatusActions } from '../../status/redux/actions';
import { DialogModal, ErrorLabel } from '../../../../common-components';

class CustomerStatusEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(props, state) {
        const { statusIdEdit, data } = props;
        if (statusIdEdit != state.statusIdEdit) {
            return {
                ...state,
                statusIdEdit: props.statusIdEdit,
                name: data.name,
                description: data.description,
            }
        } else {
            return null;
        }
    }

    handleChangeStatusName = (e) => {
        const { value } = e.target;

        this.setState({
            name: value,
        })
    }

    handleChangeStatusDescription = (e) => {
        const { value } = e.target;

        this.setState({
            description: value,
        })
    }


    save = () => {
        const { statusIdEdit, name, description } = this.state;
        const data = {
            name,
            description
        }

        this.props.editStatus(statusIdEdit, data);
    }

    render() {
        const { translate } = this.props;
        const { name, description } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-edit" isLoading={false}
                    formID="form-crm-status-edit"
                    title="Chỉnh sửa nhóm khách hàng"
                    func={this.save} size={50}
                // disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa trạng thái khách hàng */}
                    <form id="form-crm-status-edit">
                        {/* Tên trạng thái khách hàng */}
                        <div className={`form-group`}>
                            <label>{translate('crm.status.name')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" value={name ? name : ''} onChange={this.handleChangeStatusName} />
                            {/* <ErrorLabel content={groupCodeEditFormError} /> */}
                        </div>

                        {/* Mô tả trạng thái khách hàng */}
                        <div className={`form-group`}>
                            <label>{translate('crm.status.description')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" value={description ? description : ''} onChange={this.handleChangeStatusDescription} />
                            {/* <ErrorLabel content={groupNameEditFormError} /> */}
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

// function mapStateToProps(state) {
//     const { crm } = state;
//     return { crm };
// }

const mapDispatchToProps = {
    editStatus: CrmStatusActions.editStatus,
}

export default connect(null, mapDispatchToProps)(withTranslate(CustomerStatusEditForm));