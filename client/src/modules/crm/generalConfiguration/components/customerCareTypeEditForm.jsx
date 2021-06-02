import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmStatusActions } from '../../status/redux/actions';
import { DialogModal, ErrorLabel } from '../../../../common-components';
import { CrmCareTypeActions } from '../../careType/redux/action';

function CustomerCareTypeEditEditForm(props) {


    const { translate, data } = props;
    const { name, description, _id } = data;
    const [careTypeEdit, setCareTypeEdit] = useState({id:_id, name, description });
    if (careTypeEdit.id != data._id) {
        setCareTypeEdit({ id: data._id, name: data.name, description: data.description })
    }

    const handleChangeName = async (e) => {
        const { value } = e.target;
        await setCareTypeEdit( { ...careTypeEdit, name: value });
    }

    const handleChangeDescription = async (e) => {
        const { value } = e.target;
        await setCareTypeEdit( { ...careTypeEdit, description: value });
    }

    const save = () => {
        props.editCareType(careTypeEdit.id, careTypeEdit);
    }


    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-crm-customer-care-type-edit`}
                isLoading={false}
                formID="form-crm-care-type-edit"
                title="Chỉnh sửa nhóm khách hàng"
                func={save} size={50}
            // disableSubmit={!this.isFormValidated()}
            >
                {/* Form chỉnh sửa trạng thái khách hàng */}
                <form id="form-crm-care-type-edit">
                    {/* Tên trạng thái khách hàng */}
                    <div className={`form-group`}>
                        <label>{translate('crm.status.name')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={careTypeEdit.name ? careTypeEdit.name : ''} onChange={handleChangeName} />
                        {/* <ErrorLabel content={groupCodeEditFormError} /> */}
                    </div>

                    {/* Mô tả trạng thái khách hàng */}
                    <div className={`form-group`}>
                        <label>{translate('crm.status.description')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={careTypeEdit.description ? careTypeEdit.description : ''} onChange={handleChangeDescription} />
                        {/* <ErrorLabel content={groupNameEditFormError} /> */}
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}


const mapDispatchToProps = {
    editCareType: CrmCareTypeActions.editCareType,
}

export default connect(null, mapDispatchToProps)(withTranslate(CustomerCareTypeEditEditForm));