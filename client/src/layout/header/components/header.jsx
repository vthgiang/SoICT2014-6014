import React, { Component } from 'react';
import MainHeaderMenu from './mainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { DialogModal, ErrorLabel } from '../../../common-components';
import { Link } from 'react-router-dom';
import './header.css';
import { getStorage } from '../../../config';
import ModalChangeUserInformation from './modalChangeUserInformation';
import ResetPassword2 from '../../../modules/auth/components/resetPassword2';
import CreatePassword2 from '../../../modules/auth/components/createPassword2';
import DeletePassword2 from '../../../modules/auth/components/deletePassword2';
import { toast } from 'react-toastify';
import ValidationHelper from '../../../helpers/validationHelper';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleResetPassword2 = () => {
        window.$('#modal-reset-pwd2').appendTo("body").modal('show');
    }

    handleDeletePassword2 = () => {
        window.$('#modal-delete-pwd2').appendTo("body").modal('show');
    }

    handleCreatePassword2 = () => {
        window.$('#modal-create-pwd2').appendTo("body").modal('show');
    }

    render() {
        const { translate, auth } = this.props;
        const {
            oldPasswordError, newPasswordError, confirmPasswordError, password2Error
        } = this.state;
        const { user } = auth;

        return (
            <React.Fragment>
                <header className="main-header">
                    <Link to='/' className="logo">
                        <span className="logo-mini"><img src='/logo-white.png' /></span>
                        <span className="logo-lg"><b className="text-white">DX workplace</b></span>
                    </Link>
                    <nav className="navbar navbar-static-top">
                        <a className="sidebar-toggle" style={{ color: '#4C4C4C' }} data-toggle="push-menu" data-expand-on-hover={true} role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <MainHeaderMenu />
                    </nav>
                </header>

                {/* Modal profile */}
                {
                    auth.user.name !== undefined &&
                    <ModalChangeUserInformation
                        userId={auth.user._id}
                        userName={auth.user.name}
                        userEmail={auth.user.email}
                    />
                }
                <ResetPassword2 />
                <CreatePassword2 />
                <DeletePassword2 />

                {/* Modal Security */}
                <DialogModal
                    modalID="modal-security"
                    formID="form-security" size="30"
                    title={translate('auth.security.title')}
                    func={this.saveNewPassword} disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-security" style={{ padding: '10px 20px 10px 20px' }}>
                        <div className={`form-group ${!oldPasswordError ? "" : "has-error"}`}>
                            <label>{translate('auth.security.old_password')}<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleOldPassword} placeholder="Nhập mật khẩu cũ" />
                            <ErrorLabel content={oldPasswordError} />
                        </div>
                        <div className={`form-group ${!newPasswordError ? "" : "has-error"}`}>
                            <label>{translate('auth.security.new_password')}<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleNewPassword} placeholder="Nhập mật khẩu mới" />
                            <ErrorLabel content={newPasswordError} />
                        </div>
                        <div className={`form-group ${!confirmPasswordError ? "" : "has-error"}`}>
                            <label>{translate('auth.security.re_enter_new_password')}<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleConfirmPassword} placeholder={translate('auth.security.re_enter_new_password')} />
                            <ErrorLabel content={confirmPasswordError} />
                        </div>

                        {user && Object.keys(user).length > 0 && user.password2Exists === true ?
                            <div className={`form-group ${!password2Error ? "" : "has-error"}`}>
                                <label style={{ display: 'flex', marginTop: '5px' }}>
                                    Mật khẩu cấp 2
                                    <span className="text-red" style={{ marginLeft: '5px' }}>*</span>
                                    <a onClick={this.handleResetPassword2} style={{ marginLeft: '5px', cursor: 'pointer' }}>Đổi mật khẩu cấp 2</a>
                                    <a onClick={this.handleDeletePassword2} style={{ marginLeft: '5px', cursor: 'pointer' }}>Xóa mật khẩu cấp 2</a>
                                </label>
                                <input className="form-control" type="password" onChange={this.handleChangePassword2} placeholder="Nhập mật khẩu cấp 2" />
                                <ErrorLabel content={password2Error} />
                            </div> :
                            <label style={{ display: 'flex', marginTop: '5px' }}>
                                <span style={{ marginRight: '10px' }}>Chưa có mật khẩu cấp 2! </span>
                                <div style={{ display: 'flex' }}>
                                    <span>
                                        <a onClick={this.handleCreatePassword2} style={{ fontSize: '13px', cursor: 'pointer' }}>Thiết lập</a>
                                    </span>
                                </div>
                            </label>
                        }
                    </form>
                </DialogModal>

            </React.Fragment>
        );
    }

    handleOldPassword = (e) => {
        let { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validatePassword(translate, value);
        this.setState({
            oldPassword: value,
            oldPasswordError: message
        })
    }

    handleNewPassword = (e) => {
        let { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validatePassword(translate, value);
        this.setState({
            newPassword: value,
            newPasswordError: message
        })
    }

    handleConfirmPassword = (e) => {
        let { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validatePassword(translate, value);
        this.setState({
            confirmPassword: value,
            confirmPasswordError: message
        })
    }

    handleChangePassword2 = (e) => {
        const { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        this.setState({
            password2: value,
            password2Error: message,
        })
    }

    isFormValidated = () => {
        const { oldPassword, newPassword, confirmPassword, password2 } = this.state;
        let { translate, auth } = this.props;
        const { user } = auth;
        if (
            !ValidationHelper.validatePassword(translate, oldPassword).status ||
            !ValidationHelper.validatePassword(translate, newPassword).status ||
            !ValidationHelper.validatePassword(translate, confirmPassword).status ||
            (user && user.password2Exists && !ValidationHelper.validateEmpty(translate, password2).status)
        ) return false;
        return true;
    }

    saveNewPassword = () => {
        const { translate } = this.props;
        const { oldPassword, newPassword, confirmPassword, password2 } = this.state;
        if (newPassword !== confirmPassword) {
            toast.error(translate('auth.validator.confirm_password_invalid'));
        }
        if (this.isFormValidated()) {
            return this.props.changePassword({
                password: oldPassword,
                confirmPassword,
                new_password: newPassword,
                password2,
            });
        }
    }
}

const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    changePassword: AuthActions.changePassword,
    refresh: AuthActions.refresh,
    getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Header));