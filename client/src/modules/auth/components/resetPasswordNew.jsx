import React, { useEffect, useRef, useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import qs from 'qs';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { Loading, ErrorLabel } from '../../../common-components';
import ServerResponseAlert from '../../alert/components/serverResponseAlert';
import { toast } from 'react-toastify';
import ValidationHelper from '../../../helpers/validationHelper';

import ReCAPTCHA from "react-google-recaptcha";
// import { generateCharacter } from "../../../helpers/generateCode";
import './login.css';
function ResetPasswordNew(props) {
    const [state, setState] = useState({
        otp: "",
        isVerified: false
    })

    // const [verify, setVerify] = useState(() => {
    //     return generateCharacter();
    // });

    // const canvasRef = useRef(null);



    const [forgotPwd, setForgotPwd] = useState({
        errorOnPortal: undefined,
        errorOnEmail: undefined
    })

    let token;
    if (props?.location?.search)
        token = qs.parse(props.location.search, { ignoreQueryPrefix: true }).token;

    const { isLoading, reset_password, url_reset_password_valid, forgot_password } = props.auth;
    const { translate } = props;
    const { otp, } = state;

    // Kiểm tra link reset có hợp lệ hay không
    useEffect(() => {
        if (token)
            props.checkLinkValid({ token });
    }, [])

    // useEffect(() => {
    //     // gennerate capcha to image
    //     const ctx = canvasRef?.current?.getContext('2d');

    //     if (ctx) {
    //         console.log('verify', verify);
    //         ctx.font = "15px Arial";
    //         ctx.strokeText(verify, 10, 20);
    //     }
    // })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        });
    }

    const handleChangeOtp = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            otp: value
        })
    }

    const resetPassword = () => {
        const { new_password, confirm, otp } = state;
        if (new_password !== confirm) {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title='general.error'
                    content={['auth.validator.confirm_password_invalid']}
                />,
                { containerId: 'toast-notification' });
        } else {
            props.resetPassword({
                otp: otp,
                password: new_password,
                confirmPassword: confirm,
                token,
            })
        }
    }


    /**
     * Hàm phục vụ chức năng quên mật khẩu
     */
    const handleChangePortal = (e) => {
        const { translate } = props;
        const { value } = e.target;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setForgotPwd({
            ...forgotPwd,
            portal: value,
            errorOnPortal: message
        })
    }

    const handleChangeEmail = (e) => {
        const { translate } = props;
        const { value } = e.target;

        let { message } = ValidationHelper.validateEmail(translate, value);
        setForgotPwd({
            ...forgotPwd,
            email: value,
            errorOnEmail: message,
        })
    }

    const handleChangePassword2 = (e) => {
        const { value } = e.target;

        setForgotPwd({
            ...forgotPwd,
            password2: value,
        })
    }


    const verifyCaptchar = (response) => {
        if (response) {
            setState({
                isVerified: true
            })
            toast.success(
                <ServerResponseAlert
                    type='success'
                    title='general.success'
                    content={['Verify successful']}
                />,
                { containerId: 'toast-notification' });
        }
    }
    const handleForgotPassword = () => {
        const { portal, email, password2 } = forgotPwd;
        if (!state.isVerified) {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title='general.error'
                    content={['Please verify you are not a robot']}
                />,
                { containerId: 'toast-notification' });
            return false;

            }
        if (isFormValidated)

            props.forgotPassword({
                portal: portal,
                email: email,
                password2: password2
            });
    }



    // const handleChangeCapcha = () => {

    // }

    // const handleRefreshCode = () => {
    //     const context = canvasRef.current.getContext('2d');
    //     context.clearRect(0, 0, 300, 150);

    //     const code = generateCharacter();
    //     setVerify(code)
    // }

    const isFormValidated = () => {
        const { portal, email } = forgotPwd;
        let { translate } = props;


        if (
            !ValidationHelper.validateEmpty(translate, portal).status ||
            !ValidationHelper.validateEmail(translate, email).status

        ) return false;
        return true;
    }

    const renderErrorUrlInvalid = () => {
        return (
            <div className="alert alert-danger alert-dismissible text-left" style={{ fontSize: '13px', padding: '10px', marginBottom: 10 }}>
                Liên kết đặt lại mật khẩu của bạn không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.
            </div>
        )
    }

    const renderFromResetPwd = () => {
        return (
            <div className="dx-login-form" >
                <div className="dx-login-line" style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <label>Mã xác thực</label><span className="text-red">*</span>
                    <input type="text" className="form-control" value={otp} onChange={handleChangeOtp} placeholder={"Mã xác thực được gửi trong email"} />
                </div>
                <div className="dx-login-line" style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <label>{translate(`auth.profile.password`)}</label><span className="text-red">*</span>
                    <input name="new_password" type="password" className="form-control" onChange={handleChange} placeholder={"Mật khẩu mới"} />
                </div>
                <div className="dx-login-line" style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <label>{translate(`auth.profile.confirm`)}</label><span className="text-red">*</span>
                    <input name="confirm" type="password" className="form-control" onChange={handleChange} placeholder={"Xác nhận mật khẩu mới"} />
                </div>

                <div className="row">
                    <div className="col-xs-6">
                    </div>
                    <div className="col-xs-6">
                        <a className="btn btn-default" href="/login">{translate(`general.cancel`)}</a>
                        <button className="btn btn-primary pull-right" onClick={resetPassword}>{translate(`general.accept`)}</button>

                    </div>


                </div>
            </div>
        )
    }

    const renderFormResetPwdSucess = () => {
        return (<div className="login-box-body">
            <div className="alert alert-success alert-dismissible">
                <p><i className="icon fa fa-check-square-o" />{translate(`auth.reset_password_success`)}</p>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <a className="btn btn-primary pull-right" href="/login">Đi đến trang đăng nhập</a>
                </div>
            </div>
        </div>)
    }

    const renderFormForgotPwd = () => {
        return (
            <div className="dx-login-form">
                <div className={`dx-login-line ${!forgotPwd.errorOnPortal ? "" : "has-error"}`} style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <label>Portal</label><span className="text-red">*</span>
                    <input type="text" className="form-control" name="portal" value={forgotPwd.portal ? forgotPwd.portal : ""} onChange={handleChangePortal} placeholder="Portal công ty" />
                    <ErrorLabel content={forgotPwd.errorOnPortal} />
                </div>
                <div className={`dx-login-line ${!forgotPwd.errorOnEmail ? "" : "has-error"}`} style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <label>{translate('form.email')}</label><span className="text-red">*</span>
                    <input type="text" className="form-control" value={forgotPwd.email ? forgotPwd.email : ""} onChange={handleChangeEmail} placeholder={"Nhập email"} />
                    <ErrorLabel content={forgotPwd.errorOnEmail} />
                </div>
                <div className="dx-login-line" style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <label>{translate('form.password2')}</label>
                    <input type="password" className="form-control" name="password2" onChange={handleChangePassword2} placeholder={"Nhập mật khẩu cấp 2 nếu có"} />
                </div>

                {/* <div className="dx-login-line" style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <label>Mã kiểm tra</label>
                    <div>
                        <input type="text" className="form-control" name="capcha" onChange={handleChangeCapcha} />
                        <canvas ref={canvasRef}></canvas>
                        <button onClick={handleRefreshCode}>Làm mới</button>
                    </div>
                </div> */}


                <ReCAPTCHA
                    sitekey="6Ld94SMbAAAAANJYglZD8tCajp126HJLOIUiYV8H"
                    onChange={verifyCaptchar}

                />
                <div className="row">
                    <div className="col-xs-6">
                    </div>
                    <div className="col-xs-6">

                        <a className="btn btn-default" href={"/login"}>{translate(`general.cancel`)}</a>
                        <button className="btn btn-primary pull-right" onClick={handleForgotPassword} disabled={!isFormValidated()}>{translate(`general.accept`)}</button>

                    </div>
                </div>

            </div>
        )
    }

    const renderFormForgotPwdSucess = () => {
        return (
            <React.Fragment>
                <div className="modal-body">
                    <div className="alert alert-success alert-dismissible">
                        <p>Mã xác thực đã được gửi đến <strong>{forgotPwd.email}</strong></p>
                    </div>
                </div>
                <div className="modal-footer">
                    <a href="https://mail.google.com/" className="btn btn-primary" > Kiểm tra email </a>
                </div>
            </React.Fragment>
        )
    }

    if (token) {
        if (isLoading)
            return <div className="dx-login-page">
                <div className="dx-login-box">
                    <h4>Đang xử lý...</h4>
                </div>
            </div>
        return (
            <div className="dx-login-page">
                <div className="dx-login-box">
                    <h1 className="text-center"><b>RESET PASSWORD</b></h1>
                    {
                        !url_reset_password_valid && forgot_password === false &&
                        renderErrorUrlInvalid()
                    }
                    {
                        url_reset_password_valid ?
                            reset_password === false ?
                                // Giao diện thay đổi mật khẩu
                                renderFromResetPwd()
                                // Giao diện sau khi thay mật khẩu thành công
                                : renderFormResetPwdSucess()

                            // giao diện quên mật khẩu nếu url ko hợp lệ
                            : !forgot_password ? renderFormForgotPwd() : renderFormForgotPwdSucess()
                    }

                </div>
            </div>
        );
    } else {
        return <div className="dx-login-page">
            <div className="dx-login-box">
                <h1 className="text-center"><b>RESET PASSWORD</b></h1>
                {!forgot_password ? renderFormForgotPwd() : renderFormForgotPwdSucess()}
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return { auth: state.auth };
}

const mapDispatchToProps = {
    resetPassword: AuthActions.resetPassword,
    checkLinkValid: AuthActions.checkLinkValid,
    forgotPassword: AuthActions.forgotPassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ResetPasswordNew));