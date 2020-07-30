import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { UserActions } from '../redux/actions';

import { UserFormValidator } from './userFormValidator';

class UserEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: [
                { id: 1, name: "disable", value: false },
                { id: 2, name: "enable", value: true }
            ]
        }
    }

    checkSuperAdmin = (roleArr) => {
        let superAdmin = this.props.role.list.find(obj => {
            return obj.name === "Super Admin"
        });

        var result = false;
        for (let i = 0; i < roleArr.length; i++) {
            if (roleArr[i] === superAdmin._id) {
                result = true;
                break;
            }
        }

        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            return this.props.edit(this.props.userId, {
                email: this.state.userEmail,
                name: this.state.userName,
                active: this.state.userActive,
                roles: this.state.userRoles
            });
        }
    }

    isFormValidated = () => {
        let result =
            this.validateUserEmail(this.state.userEmail, false) &&
            this.validateUserName(this.state.userName, false); // Kết hợp với kết quả validate các trường khác (nếu có trong form)

        return result;
    }

    handleUserEmailChange = (e) => {
        let value = e.target.value;
        this.validateUserEmail(value, true);
    }
    validateUserEmail = (value, willUpdateState = true) => {
        let msg = UserFormValidator.validateEmail(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    userEmailError: msg,
                    userEmail: value,
                }
            });
        }
        return msg === undefined;
    }

    handleUserNameChange = (e) => {
        let value = e.target.value;
        this.validateUserName(value, true);
    }
    validateUserName = (value, willUpdateState = true) => {
        let msg = UserFormValidator.validateName(value);
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

    handleRolesChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                userRoles: value
            }
        });
    }

    handleUserActiveChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                userActive: value
            }
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.userId !== prevState.userId) {
            return {
                ...prevState,
                userId: nextProps.userId,
                userEmail: nextProps.userEmail,
                userName: nextProps.userName,
                userActive: nextProps.userActive,
                userRoles: nextProps.userRoles,
                userEmailError: undefined,
                errorOnUserName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, role, user, auth } = this.props;
        const { userId, userEmail, userName, userActive, userRoles, status, errorOnUserName, userEmailError } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' func={this.save} isLoading={user.isLoading}
                    modalID={`modal-edit-user`}
                    formID={`form-edit-user`}
                    title={translate('manage_user.edit')}
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('manage_user.edit_faile')}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    {/* Form chỉnh sửa thông tin tài khoản người dùng */}
                    <form id={`form-edit-user`}>
                        <div className="row">
                            {
                                this.checkSuperAdmin(userRoles) ? // Là super admin của công ty
                                    <React.Fragment>
                                        <div className={`form-group col-sm-8 ${!userEmailError ? "" : "has-error"}`}>
                                            <label>{translate('table.email')}<span className="text-red">*</span></label>
                                            {
                                                auth.user._id === userId ?
                                                    <input type="text" className="form-control" value={userEmail} onChange={this.handleUserEmailChange} /> :
                                                    <input type="text" className="form-control" value={userEmail} disabled />
                                            }
                                            <ErrorLabel content={userEmailError} />
                                        </div>
                                        <div className="form-group col-sm-4">
                                            <label>{translate('table.status')}<span className="text-red">*</span></label>
                                            <select
                                                className="form-control"
                                                style={{ width: '100%' }}
                                                value={userActive}
                                                disabled={true}>
                                                {
                                                    status.map(result => <option key={result.id} value={result.value}>{translate(`manage_user.${result.name}`)}</option>)
                                                }
                                            </select>
                                        </div>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <div className={`form-group col-sm-8 ${!userEmailError ? "" : "has-error"}`}>
                                            <label>{translate('table.email')}<span className="text-red">*</span></label>
                                            <input type="text" className="form-control" value={userEmail} onChange={this.handleUserEmailChange} />
                                            <ErrorLabel content={userEmailError} />
                                        </div>
                                        <div className="form-group col-sm-4">
                                            <label>{translate('table.status')}<span className="text-red">*</span></label>
                                            <select
                                                className="form-control"
                                                style={{ width: '100%' }}
                                                value={userActive}
                                                onChange={this.handleUserActiveChange}>
                                                {
                                                    status.map(result => <option key={result.id} value={result.value}>{translate(`manage_user.${result.name}`)}</option>)
                                                }
                                            </select>
                                        </div>
                                    </React.Fragment>
                            }
                        </div>
                        <div className={`form-group ${!errorOnUserName ? "" : "has-error"}`}>
                            <label>{translate('table.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={userName} onChange={this.handleUserNameChange} />
                            <ErrorLabel content={errorOnUserName} />
                        </div>
                        {
                            this.checkSuperAdmin(userRoles) && auth.user._id !== userId ?
                                null :
                                <div className="form-group">
                                    <label>{translate('manage_user.roles')}</label>
                                    <SelectBox
                                        id={`user-role-form${userId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            this.checkSuperAdmin(userRoles) ? // Neu tai khoan nay hien tai khong co role la Super Admin
                                                role.list.map(role => { return { value: role._id, text: role.name } }) :
                                                role.list.filter(role => {
                                                    return role.name !== 'Super Admin'
                                                }).map(role => { return { value: role._id, text: role.name } })
                                        }
                                        onChange={this.handleRolesChange}
                                        value={userRoles}
                                        multiple={true}
                                    />
                                </div>
                        }
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const action = {
    edit: UserActions.edit
}


export default connect(mapStateToProps, action)(withTranslate(UserEditForm));