import React, { useState, } from 'react';
import { Redirect, Link } from 'react-router-dom'
import qs from 'qs';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { Loading } from '../../../common-components';
import ServerResponseAlert from '../../alert/components/serverResponseAlert';
import { toast } from 'react-toastify';

const ResetPassword = (props) => {
    const [state,setState] = useState({
        reset_success: false,
        reset_error: false
    })
    
    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        setState({
            
            [name]: value
        });
    }
    const resetPassword = (data) => {
        if(state.new_password !== state.confirm){
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title='general.error'
                    content={['auth.validator.confirm_password_invalid']}
                />, 
                {containerId: 'toast-notification'});
        } else{
            props.resetPassword({
                portal: data.portal,
                otp: data.otp,
                email: data.email,
                password: data.new_password
            })
        }
    }
   
    const { portal, otp, email } = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const { isLoading, reset_password } = props.auth;
    const { translate } = props; console.log(state)
    if(otp && email){
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
                        reset_password === false ?
                        <div className="login-box-body">
                            <div className="form-group" hidden={true}>
                                <label>{ translate(`auth.profile.otp`) }</label>
                                <input name="otp" type="text" className="form-control" value={otp} disabled/>
                            </div>
                            <div className="form-group" hidden={true}>
                                <label>{ translate(`auth.profile.email`) }</label>
                                <input name="email" type="email" className="form-control" value={email} disabled/>
                            </div>
                            <div className="form-group">
                                <label>{ translate(`auth.profile.password`) }</label>
                                <input name="new_password" type="password" className="form-control" onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>{ translate(`auth.profile.confirm`) }</label>
                                <input name="confirm" type="password" className="form-control" onChange={handleChange}/>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                </div>
                                <div className="col-xs-6">
                                    <a className="btn btn-default" href="/login">{ translate(`general.cancel`) }</a>
                                    <button className="btn btn-primary pull-right" onClick={() => resetPassword({
                                        portal, otp, email, 
                                        new_password: state.new_password,
                                        confirm: state.confirm
                                    })}>{ translate(`general.accept`) }</button>
                                </div>
                            </div>
                        </div>:
                        <div className="login-box-body">
                            <div className="alert alert-success alert-dismissible">
                                <p><i className="icon fa fa-check-square-o" />{ translate(`auth.reset_password_success`) }</p>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <a className="btn btn-primary pull-right" href="/login">{ translate(`general.accept`) }</a>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
         );
    } else{
        return <Redirect to='/login' />
    }
}

const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    resetPassword: AuthActions.resetPassword,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ResetPassword) );