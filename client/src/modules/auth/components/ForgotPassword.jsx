import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AuthActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: null,
            otp: null,
            password: null,
            confirm: null
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    resetPassword = () => {
        const {email, password, confirm, otp} = this.state;
        if(password !== confirm) 
            alert("Password not confirm");
        else
            this.props.resetPassword(otp, email, password);
    }

    render() { 
        const { translate, auth } = this.props;
        return ( 
            <div className="modal fade" id="modal-reset-password">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">{ translate('form.reset_password') }</h4>
                    </div>
                    {
                        !auth.forgotPassword ?
                        <React.Fragment>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>{ translate('form.email') }</label>
                                    <input type="text" className="form-control" name="email" onChange={ this.handleChange }/><br/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{ translate('form.close') }</button>
                                <button type="button" className="btn btn-primary" onClick={() => this.props.forgotPassword(this.state.email)}>{ translate('form.next') }</button>
                            </div>
                        </React.Fragment> : 
                        <React.Fragment>
                            <div className="modal-body">
                                <div className="alert alert-success alert-dismissible">
                                    <p>Mã xác thực đã được gửi đến <strong>{ this.state.email }</strong></p>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('form.otp') }</label>
                                    <input type="text" className="form-control" name="otp" onChange={ this.handleChange }/><br/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('form.new_password') }</label>
                                    <input type="password" className="form-control" name="password" onChange={ this.handleChange }/><br/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('form.confirm') }</label>
                                    <input type="password" className="form-control" name="confirm" onChange={ this.handleChange }/><br/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.resetPassword} data-dismiss="modal">{ translate('form.save') }</button>
                            </div>
                        </React.Fragment>
                    }
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
    forgotPassword: AuthActions.forgotPassword,
    resetPassword: AuthActions.resetPassword,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ForgotPassword) );