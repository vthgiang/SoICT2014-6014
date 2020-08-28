import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../redux/actions';
import { DialogModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { ROLE_VALIDATOR } from './roleValidator';

class RoleInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { role, user, translate } = this.props;
        const { roleId, roleType, roleName, roleParents, roleUsers, roleNameError } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    func={this.save} isLoading={role.isLoading}
                    modalID="modal-edit-role"
                    formID="form-edit-role"
                    title={translate('manage_role.edit')}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin phân quyền */}
                    <form id="form-edit-role">

                        {/* Tên phân quyền */}
                        <div className={`form-group ${!roleNameError ? "" : "has-error"}`}>
                            <label>{translate('manage_role.name')}<span className="text-red">*</span></label>
                            {
                                roleType === 'Abstract' ?
                                    <input className="form-control" value={roleName} disabled={true} /> :
                                    <input className="form-control" value={roleName} onChange={this.handleRoleName} />
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
                                    role.list.filter(role => (role && role.name !== 'Super Admin' && role.name !== roleName))
                                        .map(role => { return { value: role ? role._id : null, text: role ? role.name : "Role is deleted" } })
                                }
                                onChange={this.handleParents}
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
                                    user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "User is deleted" } })
                                }
                                onChange={this.handleUsers}
                                value={roleUsers}
                                multiple={roleName !== 'Super Admin' ? true : false}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.roleId !== prevState.roleId) {
            return {
                ...prevState,
                roleId: nextProps.roleId,
                roleName: nextProps.roleName,
                roleType: nextProps.roleType,
                roleParents: nextProps.roleParents,
                roleUsers: nextProps.roleUsers,
                roleNameError: undefined,
            }
        } else {
            return null;
        }
    }

    handleRoleName = (e) => {
        let {value} = e.target;
        this.setState({ roleName: value });

        let {translate} = this.props;
        let {msg} = ROLE_VALIDATOR.checkName(value, 4, 255);
        let err = msg ? translate(msg, {min: 4, max: 255}) : undefined;
        this.setState({ roleNameError: err})
    }

    handleParents = (value) => {
        this.setState(state => {
            return {
                ...state,
                roleParents: value
            }
        });
    }

    handleUsers = (value) => {
        this.setState(state => {
            return {
                ...state,
                roleUsers: value
            }
        });
    }

    handleRoleUser = (e) => {
        const { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                roleUsers: [value]
            }
        });
    }

    isFormValidated = () => {
        let {roleName} = this.state;
        if(!ROLE_VALIDATOR.checkName(roleName).status) return false;
        return true;
    }

    save = () => {
        const role = {
            id: this.state.roleId,
            name: this.state.roleName,
            parents: this.state.roleParents,
            users: this.state.roleUsers
        };

        if (this.isFormValidated()) {
            return this.props.edit(role);
        }
    }
}

function mapState(state) {
    const { role, user } = state;
    return { role, user };
}

const dispatchStateToProps = {
    edit: RoleActions.edit
}

export default connect(mapState, dispatchStateToProps)(withTranslate(RoleInfoForm));