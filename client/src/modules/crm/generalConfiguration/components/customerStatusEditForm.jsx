import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmStatusActions } from '../../status/redux/actions';
import { DialogModal, ErrorLabel } from '../../../../common-components';

function CustomerStatusEditForm(props) {


    const { translate, data } = props;
    const { name, description, _id } = data;
    const [statusEdit, setStatusEdit] = useState({id:_id, name, description });
    if (statusEdit.id != data._id) {
        setStatusEdit({ id: data._id, name: data.name, description: data.description })
    }

    const handleChangeStatusName = async (e) => {
        const { value } = e.target;
        const newStatus = { ...statusEdit, name: value }
        await setStatusEdit(newStatus);
    }

    const handleChangeStatusDescription = async (e) => {
        const { value } = e.target;
        const newStatus = { ...statusEdit, description: value, }
        await setStatusEdit(newStatus);
    }

    const save = () => {
        props.editStatus(statusEdit.id, statusEdit);
    }


    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-crm-customer-status-edit`}
                isLoading={false}
                formID="form-crm-status-edit"
                title="Chỉnh sửa nhóm khách hàng"
                func={save} size={50}
            // disableSubmit={!this.isFormValidated()}
            >
                {/* Form chỉnh sửa trạng thái khách hàng */}
                <form id="form-crm-status-edit">
                    {/* Tên trạng thái khách hàng */}
                    <div className={`form-group`}>
                        <label>{translate('crm.status.name')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={statusEdit.name ? statusEdit.name : ''} onChange={handleChangeStatusName} />
                        {/* <ErrorLabel content={groupCodeEditFormError} /> */}
                    </div>

                    {/* Mô tả trạng thái khách hàng */}
                    <div className={`form-group`}>
                        <label>{translate('crm.status.description')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={statusEdit.description ? statusEdit.description : ''} onChange={handleChangeStatusDescription} />
                        {/* <ErrorLabel content={groupNameEditFormError} /> */}
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}


// function mapStateToProps(state) {
//     const { crm } = state;
//     return { crm };
// }

const mapDispatchToProps = {
    editStatus: CrmStatusActions.editStatus,
}

export default connect(null, mapDispatchToProps)(withTranslate(CustomerStatusEditForm));