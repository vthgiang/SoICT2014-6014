import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';

import { RoleActions } from '../redux/actions';

import { RoleValidator } from './roleValidator';

class RoleCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleName: '',
            roleParents: [],
            roleUsers: []
        }
    }

    render() {
        const { translate, role, user } = this.props;
        const { roleNameError } = this.state;

        return (
            <React.Fragment>
                {/* Button thêm phân quyền mới */}
                <ButtonModal modalID="modal-create-role" button_name={translate('manage_role.add')} title={translate('manage_role.add_title')} />

                <DialogModal
                    modalID="modal-create-role" isLoading={role.isLoading}
                    formID="form-create-role"
                    title={translate('manage_role.add_title')}
                    msg_success={translate('manage_role.add_success')}
                    msg_faile={translate('manage_role.add_faile')}
                    func={this.save} disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm phân quyền mới */}
                    <form id="form-create-role">

                        {/* Tên phân quyền */}
                        <div className={`form-group ${!roleNameError ? "" : "has-error"}`}>
                            <label>{translate('manage_role.name')}<span className="text-red">*</span></label>
                            <input className="form-control" onChange={this.handleRoleName} />
                            <ErrorLabel content={roleNameError} />
                        </div>

                        {/* Kế thừa phân quyền */}
                        <div className="form-group">
                            <label>{translate('manage_role.extends')}</label>
                            <SelectBox
                                id="select-role-parents-create"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    role.list ?
                                        role.list.filter(role => (role.name !== 'Super Admin'))
                                            .map(role => { return { value: role._id, text: role.name } }) :
                                        []
                                }
                                onChange={this.handleParents}
                                multiple={true}
                            />
                        </div>

                        {/* Những người dùng có phân quyền */}
                        <div className="form-group">
                            <label>{translate('manage_role.users')}</label>
                            <SelectBox
                                id="select-role-users-create"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    user.list ? user.list.map(user => { return { value: user._id, text: `${user.name} - ${user.email}` } }) : []
                                }
                                onChange={this.handleUsers}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.props.get();
    }

    // Xy ly va validate role name
    handleRoleName = (e) => {
        const { value } = e.target;
        this.validateRoleName(value, true);
    }
    validateRoleName = (value, willUpdateState = true) => {
        let msg = RoleValidator.validateName(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    roleNameError: msg,
                    roleName: value,
                }
            });
        }
        return msg === undefined;
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
        let result = this.validateRoleName(this.state.roleName, false);
        return result;
    }

    save = () => {
        const data = {
            name: this.state.roleName,
            parents: this.state.roleParents,
            users: this.state.roleUsers
        }

        if (this.isFormValidated()) {
            return this.props.create(data);
        }
    }

}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    get: RoleActions.get,
    create: RoleActions.create
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoleCreateForm));