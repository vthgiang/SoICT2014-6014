import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            email: null,
            password: null,
            emailReset: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reset = this.reset.bind(this);
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

    reset(){
        const { emailReset } = this.state;
        this.props.resetPassword(emailReset);
    }

    render() { 
        const { auth } = this.props;
        return ( 
            <div className="hold-transition login-page" style={{ minHeight: '100vh' }}>
                <div className="login-box" style={{ marginTop: 0, marginBottom: 0, paddingTop: '7vh' }}>
                    <div className="login-logo">
                        <a href="/index2.html"><b>VNIST</b>-QLCV</a>
                    </div>
                    {
                        auth.error !== null &&
                        <div className="alert alert-danger alert-dismissible">
                            <p><i className="icon fa fa-ban" />{ auth.error }</p>
                        </div>
                    }
                    {/* {
                        user.msg !== null && <h4 style={{ backgroundColor: 'yellow', color: 'green', textAlign: 'center' }}>{ user.msg }</h4>
                    } */}
                    <div className="login-box-body">
                        <p className="login-box-msg">Sign in to start your session</p>
                        <form onSubmit={this.handleSubmit}> 
                            <div className="form-group has-feedback">
                                <input name="email" onChange={this.handleChange} type="email" className="form-control" placeholder="Email" required/>
                                <span className="glyphicon glyphicon-envelope form-control-feedback" />
                            </div>
                            <div className="form-group has-feedback">
                            <input name="password" onChange={this.handleChange} type="password" className="form-control" placeholder="Password" required/>
                                <span className="glyphicon glyphicon-lock form-control-feedback" />
                            </div>
                            <div className="row">
                                <div className="col-xs-8">
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" /> Remember Me
                                    </label>
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <button className="btn btn-primary btn-block btn-flat">Sign In </button>
                                </div>
                            </div>
                        </form>
                        
                        <a data-toggle="modal" href='#modal-reset-password'>I forgot my password</a><br />
                            <div className="modal fade" id="modal-reset-password">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                    <h4 className="modal-title">Input your email</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" className="form-control" name="emailReset" onChange={ this.handleChange }/><br/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.reset}>Save changes</button>
                                </div>
                                </div>
                            </div>
                        </div>
                        <a href="/register" className="text-center">Register a new membership</a>
                    </div>
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return{
        login: (user) => {
            dispatch(login(user));
        },
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Login) );