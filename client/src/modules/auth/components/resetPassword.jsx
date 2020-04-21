import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import qs from 'qs';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { Loading } from '../../../common-components';
import Swal from 'sweetalert2';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            reset_success: false,
            reset_error: false
        }
    }

    resetPassword = () => {
        if(this.refs.new_password.value !== this.refs.confirm.value){
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Mật khẩu không trùng khớp. Vui lòng kiểm tra lại!',
                showConfirmButton: false,
                timer: 3000
              })
        }else{
            this.props.resetPassword(
                this.refs.otp.value,
                this.refs.email.value,
                this.refs.new_password.value
            ).then(res => {
                this.setState({
                    reset_success: true,
                    reset_error: false
                })
            }).catch(err => {
                this.setState({
                    reset_success: false,
                    reset_error: true
                })
            })
        }
    }

    render() { 
        const { otp, email } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        const { isLoading } = this.props.auth;
        const { translate } = this.props;

        if(otp !== undefined && email !== undefined){
            return ( 
                <div className="hold-transition login-page" style={{ minHeight: '100vh' }}>
                    {
                        isLoading && <Loading />
                    }
                    <div className="login-box" style={{ marginTop: 0, marginBottom: 0, paddingTop: '7vh' }}>
                        <div className="login-logo">
                            <a href="/index2.html"><b>RESET PASSWORD</b></a>
                        </div>
                        {
                            !this.state.reset_success ?
                            <div className="login-box-body">
                                {
                                    this.state.reset_error &&
                                    <div className="alert alert-danger alert-dismissible">
                                        <p><i className="icon fa fa-ban" />{ translate(`alert.reset_password_faile`) }</p>
                                    </div>
                                }
                                <div className="form-group" hidden={true}>
                                    <label>OTP</label>
                                    <input ref="otp" type="text" className="form-control" defaultValue={otp} disabled/>
                                </div>
                                <div className="form-group" hidden={true}>
                                    <label>Email</label>
                                    <input ref="email" type="email" className="form-control" defaultValue={email} disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu mới</label>
                                    <input ref="new_password" type="password" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <label>Xác nhận mật khẩu mới</label>
                                    <input ref="confirm" type="password" className="form-control"/>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6">
                                    </div>
                                    <div className="col-xs-6">
                                        <button className="btn btn-primary pull-right" onClick={this.resetPassword}>Xác thực</button>
                                    </div>
                                </div>
                            </div>:
                            <div className="login-box-body">
                                <div className="alert alert-success alert-dismissible">
                                    <p><i className="icon fa fa-check-square-o" />{ translate(`alert.reset_password_success`) }</p>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <Link className="btn btn-primary pull-right" to="/login">Xác nhận</Link>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
             );
        }else{
            return <Redirect to='/login' />
        }
        
    }
}
  
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    resetPassword: AuthActions.resetPassword,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ResetPassword) );
