import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { UserActions } from '../redux/actions';
import { RoleActions } from '../../role/redux/actions';

import { UserFormValidator } from './userFormValidator';

class UserCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userEmail: "",
            userRoles: []
        }
    }

    save = () => {
        if (this.isFormValidated()) {
            return this.props.create({
                name: this.state.userName,
                email: this.state.userEmail,
                roles: this.state.userRoles
            });
        }
    }

    isFormValidated = () => {
        let result =
            this.validateUserName(this.state.userName, false) &&
            this.validateUserEmail(this.state.userEmail, false);

        return result;
    }

    handleUserNameChange = (e) => {
        let value = e.target.value;
        this.validateUserName(value, true);
    }
    validateUserName = (value, willUpdateState = true) => {
        let msg = UserFormValidator.validateName(value)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUserName: msg,
                    userName: value,
                }
            });
        }
        return msg === undefined;
    }

    handleUserEmailChange = (e) => {
        let value = e.target.value;
        this.validateUserEmail(value);
    }
    validateUserEmail = (value, willUpdateState = true) => {
        let msg = UserFormValidator.validateEmail(value)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUserEmail: msg,
                    userEmail: value,
                }
            });
        }
        return msg == undefined;
    }

    handleRolesChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                userRoles: value
            }
        });
    }

    componentDidMount() {
        this.props.getRoles();
    }

    render() {
        const { translate, role, user } = this.props;
        const { userName, userEmail, errorOnUserName, errorOnUserEmail } = this.state;

        const items = role.list ? role.list.filter(role => {
            return role.name !== 'Super Admin'
        }).map(role => { return { value: role._id, text: role.name } }) : []

        return (
            <React.Fragment>
                {/* Button thêm tài khoản người dùng mới */}
                <ButtonModal modalID="modal-create-user" button_name={translate('manage_user.add')} title={translate('manage_user.add_title')} />.

                <DialogModal
                    modalID="modal-create-user" isLoading={user.isLoading}
                    formID="form-create-user"
                    title={translate('manage_user.add_title')}
                    msg_success={translate('manage_user.add_success')}
                    msg_faile={translate('manage_user.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    {/* Form thêm tài khoản người dùng mới */}
                    <form id="form-create-user" onSubmit={() => this.save(translate('manage_user.add_success'))}>

                        {/* Tên người dùng */}
                        <div className={`form-group ${!errorOnUserName ? "" : "has-error"}`}>
                            <label>{translate('table.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={this.handleUserNameChange} />
                            <ErrorLabel content={errorOnUserName} />
                        </div>

                        {/* Email */}
                        <div className={`form-group ${!errorOnUserEmail ? "" : "has-error"}`}>
                            <label>{translate('table.email')}<span className="text-red">*</span></label>
                            <input type="email" className="form-control" onChange={this.handleUserEmailChange} />
                            <ErrorLabel content={errorOnUserEmail} />
                        </div>

                        {/* Phân quyền được cấp */}
                        <div className="form-group">
                            <label>{translate('manage_user.roles')}</label>
                            {items.length !== 0 &&
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`user-role-form-create`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={items}
                                    onChange={this.handleRolesChange}
                                    multiple={true}
                                />
                            }
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    create: UserActions.create,
    getRoles: RoleActions.get
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(UserCreateForm));