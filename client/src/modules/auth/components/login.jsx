import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import ForgotPassword from './forgotPassword';
import { getStorage } from '../../../config';
import './login.css';

class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            emailForgot: null,
            newPassword: null,
            confirmNewPassword: null,
            portal: getStorage('portal')
        };
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { email, password, portal } = this.state;
		this.props.login({ email, password, portal});
    }

    forgotPassword = () => {
        const { emailForgot } = this.state;
        this.props.forgotPassword(emailForgot);
    }

    render() { 
        const { auth, translate } = this.props;
        
        return ( 
            <div className="dx-login-page">
                <div className="dx-login-box">
                    <a href="/">
                        <img className="dx-logo-lg" src="./logo.png"/>  
                    </a>
                    {
                        auth.error &&
                        <div className="alert alert-danger alert-dismissible text-left">
                            <i className="icon fa fa-ban" /> {translate(`auth.${auth.error}`)}
                        </div>
                    }
                    <form className="dx-login-form" onSubmit={this.handleSubmit}>
                        <div className="dx-login-line">
                            <label>
                                <i className="glyphicon glyphicon-envelope"></i>
                                <span className="dx-login-text">{ translate('form.email') }</span>
                            </label>
                            <input className="dx-login-input" name="email" onChange={this.handleChange} type="email" placeholder={ translate('form.email') } required/>
                        </div>
                        <div className="dx-login-line">
                            <label>
                                <i className="glyphicon glyphicon-lock"></i>
                                <span className="dx-login-text">{ translate('form.password') }</span>
                            </label>
                            <input className="dx-login-input" name="password" onChange={this.handleChange} type="password" placeholder={ translate('form.password') } required/>
                        </div>
                        <div className="dx-login-line">
                            <label>
                                <i className="glyphicon glyphicon-hdd"></i>
                                <span className="dx-login-text">{ translate('form.portal') }</span>
                            </label>
                            <input className="dx-login-input" name="portal" onChange={this.handleChange} type="text" placeholder="Portal" value={this.state.portal}/>
                        </div>
                        <button type="submit" className="dx-login-submit">
                            <span className="dx-login-text">
                            { translate('form.signin') }
                            </span>
                        </button>
                    </form>
                    <div>
                        <a data-toggle="modal" href='#modal-reset-password'>{ translate('form.forgot_password') }</a><br />
                        <ForgotPassword />
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