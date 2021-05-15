import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmGroupActions } from '../redux/actions';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

function EditGroupForm(props) {

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
    const [editingGroup, setEdittingGroup] = useState({_id:undefined});
    const [validateState, setValidateState] = useState({});

    // dataStatus: DATA_STATUS.NOT_AVAILABLE,
    const { translate, groupIdEdit, crm } = props;
    useEffect(() => props.getGroup(groupIdEdit), [groupIdEdit])




    const handleChangeGroupCode = async (e) => {
        const { value } = e.target;
        await setEdittingGroup({
            ...editingGroup,
            code: value
        })
        // validate Mã nhóm khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        await setValidateState({ ...validateState, groupCodeEditFormError: message })

    }

    const handleChangeGroupName = async (e) => {
        const { value } = e.target;
        await setEdittingGroup({
            ...editingGroup,
            name: value
        })
        // validate tên nhóm khách hàng
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        await setValidateState({ ...validateState, groupNameEditFormError: message })

    }

    const handleChangeGroupDescription = async (e) => {

        const { value } = e.target;

        await setEdittingGroup({
            ...editingGroup,
            description: value
        })

    }


    const isFormValidated = () => {
        const { code, name } = editingGroup;

        if (!ValidationHelper.validateName(translate, code).status
            || !ValidationHelper.validateDescription(translate, name).status)
            return false;
        return true;
    }

    const save = () => {
        if (isFormValidated) {
            props.editGroup(groupIdEdit, editingGroup);
        }
    }
    const { groups } = crm;
    const { groupCodeEditFormError, groupNameEditFormError } = validateState;
    if(!crm.groups.isLoading && groups.groupById && (editingGroup._id != groups.groupById.groupById._id))  setEdittingGroup(groups.groupById.groupById)
    
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-group" isLoading={groups.isLoading}
                formID="form-edit-group"
                title="Chỉnh sửa nhóm khách hàng"
                func={save} size={50}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm nhóm khách hàng mới */}
                <form id="form-crm-group-edit">
                    {/* Mã nhóm khách hàng */}
                    <div className={`form-group ${!groupCodeEditFormError ? "" : "has-error"}`}>
                        <label>{translate('crm.group.code')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={editingGroup.code ? editingGroup.code : ''} onChange={handleChangeGroupCode} />
                        <ErrorLabel content={groupCodeEditFormError} />
                    </div>

                    {/* Tên nhóm khách hàng */}
                    <div className={`form-group ${!groupNameEditFormError ? "" : "has-error"}`}>
                        <label>{translate('crm.group.name')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" value={editingGroup.name ? editingGroup.name : ''} onChange={handleChangeGroupName} />
                        <ErrorLabel content={groupNameEditFormError} />
                    </div>

                    {/* Mô tả nhóm khách hàng */}
                    <div className="form-group">
                        <label>{translate('crm.group.description')}</label>
                        <textarea type="text" value={editingGroup.description ? editingGroup.description : ''} className="form-control" onChange={handleChangeGroupDescription} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}


function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getGroup: CrmGroupActions.getGroup,
    editGroup: CrmGroupActions.editGroup,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditGroupForm));