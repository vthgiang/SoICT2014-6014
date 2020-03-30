import React, { Component } from 'react';
import MainHeaderMenu from './MainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { ModalDialog } from '../../../common-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeInformation = this.changeInformation.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    changeInformation = () => {
        if(this.refs.name.value.length < 10){
            toast.warning('Tên phải ít nhất 10 kí tự', {containerId: 'toast-notification'});
        }else{

            return this.props.changeInformation({
                name: this.refs.name.value
            });
        }
    }

    changePassword = () => {
        if(this.refs.new_password.value !== this.refs.confirm_password.value){
            toast.warning('Mật khẩu không khớp', {containerId: 'toast-notification'});
        }else{

            return this.props.changePassword({
                password: this.refs.password.value,
                new_password: this.refs.new_password.value
            });
        }
    }

    render() { 
        const { translate, auth } = this.props;
        return ( 
            <React.Fragment>
                <header className="main-header">
                    <Link to='/' className="logo">
                        <span className="logo-mini"><img src="/lib/main/image/logo.png" alt="Logo" style={{width: "40px", marginTop: "-5px", marginLeft: "-15px"}}></img></span>
                        <span className="logo-lg"><img src="/lib/main/image/logo.png" alt="Logo" style={{width: "40px", marginTop: "-5px", marginLeft: "-15px"}}></img>VNIST-Việc</span>
                    </Link>
                    <nav className="navbar navbar-static-top">
                        <a className="sidebar-toggle" data-toggle="push-menu" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <MainHeaderMenu/>
                    </nav>
                </header>

                {/* Modal profile */}
                <ModalDialog
                    modalID="modal-profile"
                    formID="form-profile"
                    title={translate('auth.profile.title')}
                    msg_success={translate('auth.profile.edit_success')}
                    msg_faile={translate('auth.profile.edit_faile')}
                    func={this.changeInformation}
                >
                    <form id="form-profile">
                        <div className="form-group">
                            <label>{ translate('auth.profile.name') }</label>
                            <input type="text" className="form-control" ref="name" defaultValue={ auth.user.name } />
                        </div>
                        <div className="form-group">
                            <label>{ translate('auth.profile.email') }</label>
                            <input type="email" className="form-control" ref="email" defaultValue={ auth.user.email } disabled/>
                        </div>
                    </form>
                </ModalDialog>

                {/* Modal Security */}
                <ModalDialog
                    modalID="modal-security"
                    formID="form-security" size="30"
                    title={translate('auth.security.title')}
                    msg_success={translate('auth.profile.edit_success')}
                    msg_faile={translate('auth.profile.edit_faile')}
                    func={this.changePassword}
                >
                    <form id="form-security">
                        <div className="form-group">
                            <label>{ translate('auth.security.old_password') }</label>
                            <input type="password" className="form-control" ref="password"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('auth.security.new_password') }</label>
                            <input type="password" className="form-control" ref="new_password"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('auth.security.confirm_password') }</label>
                            <input type="password" className="form-control" ref="confirm_password"/>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    changeInformation: AuthActions.changeInformation,
    changePassword: AuthActions.changePassword
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Header) );