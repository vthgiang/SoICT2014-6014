import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import ForgotPassword from './forgotPassword';

class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            email: null,
            password: null,
            emailForgot: null,
            newPassword: null,
            confirmNewPassword: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        var { email, password } = this.state;
        var user = { email, password };
		this.props.login(user);
    }

    forgotPassword(){
        const { emailForgot } = this.state;
        this.props.forgotPassword(emailForgot);
    }

    // displayAuthAlert = () => {
    //     window.$(`#alert-error-auth`).modal("show");
    // }

    render() { 
        const { auth, translate } = this.props;
        return ( 
            <div className="hold-transition login-page" style={{ minHeight: '100vh' }}>
                
                {/* <button type="button" class="btn btn-default" onClick={this.displayAuthAlert}>display</button> */}
                
                <div className="login-box" style={{ marginTop: 0, marginBottom: 0, paddingTop: '7vh' }}>
                    <div className="login-logo">
                        <a href="/index2.html"><b>VNIST</b>-QLCV</a>
                    </div>
                    {
                        auth.error !== null &&
                        <div className="alert alert-danger alert-dismissible">
                            <p><i className="icon fa fa-ban" />{ translate(`alert.${auth.error}`) }</p>
                        </div>
                    }
                    <div className="login-box-body">
                        <form onSubmit={this.handleSubmit}> 
                            <div className="form-group has-feedback">
                                <input name="email" onChange={this.handleChange} type="email" className="form-control" placeholder={ translate('form.email') } required/>
                                <span className="glyphicon glyphicon-envelope form-control-feedback" />
                            </div>
                            <div className="form-group has-feedback">
                            <input name="password" onChange={this.handleChange} type="password" className="form-control" placeholder={ translate('form.password') } required/>
                                <span className="glyphicon glyphicon-lock form-control-feedback" />
                            </div>
                            <div className="row">
                                <div className="col-xs-8">
                                    <a data-toggle="modal" href='#modal-reset-password'>{ translate('form.forgot_password') }</a><br />
                                    <ForgotPassword />
                                </div>
                                <div className="col-xs-4">
                                    <button className="btn btn-primary btn-block btn-flat">{ translate('form.signin') }</button>
                                </div>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    login: AuthActions.login,
    forgotPassword: AuthActions.forgotPassword,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Login) );