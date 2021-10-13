import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../redux/actions';
import { DialogModal, SelectBox, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ROLE_TYPE, ROOT_ROLE } from '../../../../helpers/constants';

function RoleInfoForm(props) {
    const [state, setState] = useState({})

    // Thiet lap cac gia tri tu props vao state
    useEffect(() => {
        if (props.roleId !== state.roleId) {
            setState({
                ...state,
                roleId: props.roleId,
                roleName: props.roleName,
                roleType: props.roleType,
                roleParents: props.roleParents,
                roleUsers: props.roleUsers,
                roleNameError: undefined,
            })
        }
    }, [props.roleId])

    const handleRoleName = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState({
            ...state,
            roleName: value,
            roleNameError: message
        });
    }

    const handleParents = (value) => {
        setState({
            ...state,
            roleParents: value
        });
    }

    const handleUsers = (value) => {
        setState({
            ...state,
            roleUsers: value
        });
    }

    const handleRoleUser = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            roleUsers: [value]
        });
    }

    const isFormValidated = () => {
        let { roleName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, roleName).status) return false;
        return true;
    }

    const save = () => {
        const role = {
            id: state.roleId,
            name: state.roleName,
            parents: state.roleParents,
            users: state.roleUsers
        };

        if (isFormValidated()) {
            return props.edit(role);
        }
    }

    const { role, user, translate } = props;
    const { roleId, roleType, roleName, roleParents, roleUsers, roleNameError } = state;

    return (
        <React.Fragment>
            <DialogModal
                func={save} isLoading={role.isLoading}
                modalID="modal-edit-role"
                formID="form-edit-role"
                title={translate('manage_role.edit')}
                disableSubmit={!isFormValidated()}
            >
                {/* Form chỉnh sửa thông tin phân quyền */}
                <form id="form-edit-role">

                    {/* Tên phân quyền */}
                    <div className={`form-group ${!roleNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_role.name')}<span className="text-red">*</span></label>
                        {
                            roleType === ROLE_TYPE.ROOT ?
                                <input className="form-control" value={roleName} disabled={true} /> :
                                <input className="form-control" value={roleName} onChange={handleRoleName} />
                        }
                        <ErrorLabel content={roleNameError} />
                    </div>

                    {/* Kế thừa phân quyền */}
                    <div className="form-group">
                        <label>{translate('manage_role.extends')}</label>
                        <SelectBox
                            id={`role-parents-${roleId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                role.list.filter(role => (role && role.name !== ROOT_ROLE.SUPER_ADMIN && role.name !== roleName))
                                    .map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })
                            }
                            onChange={handleParents}
                            disabled={roleName === ROOT_ROLE.SUPER_ADMIN ? true : false}
                            value={roleParents}
                            multiple={true}
                        />
                    </div>

                    {/* Những người dùng có phân quyền */}
                    <div className="form-group">
                        <label>{translate('manage_role.users')} {roleName}</label>
                        <SelectBox
                            id={`role-users-${roleId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "" } })
                            }
                            onChange={handleUsers}
                            value={roleUsers}
                            disabled={roleName === ROOT_ROLE.SUPER_ADMIN ? true : false}
                            multiple={roleName !== ROOT_ROLE.SUPER_ADMIN ? true : false}
                        />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { role, user } = state;
    return { role, user };
}

const dispatchStateToProps = {
    edit: RoleActions.edit
}

export default connect(mapState, dispatchStateToProps)(withTranslate(RoleInfoForm));