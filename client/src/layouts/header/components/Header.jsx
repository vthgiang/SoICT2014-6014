import React, { Component } from 'react';
import MainHeaderMenu from './MainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { ModalDialog, ErrorLabel } from '../../../common-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';
import { LOCAL_SERVER_API } from '../../../env';
import { Validator } from './Validator';
import ModalChangeUserInformation from './ModalChangeUserInformation';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        const { translate, auth } = this.props;
        const { userName, userEmail, userNameError, emailError } = this.state;

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
                {
                    auth.user.name !== undefined &&
                    <ModalChangeUserInformation
                        userId={auth.user._id}
                        userName={auth.user.name}
                        userEmail={auth.user.email}
                    />
                }

                {/* Modal Security */}
                <ModalDialog
                    modalID="modal-security"
                    formID="form-security" size="30"
                    title={translate('auth.security.title')}
                    msg_success={translate('auth.profile.edit_success')}
                    msg_faile={translate('auth.profile.edit_faile')}
                    func={this.changePassword}
                >
                    <form id="form-security" style={{padding: '10px 20px 10px 20px'}}>
                        <div className="form-group">
                            <label>{ translate('auth.security.old_password') }<span className="text-red">*</span></label>
                            <input type="password" className="form-control" ref="password"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('auth.security.new_password') }<span className="text-red">*</span></label>
                            <input type="password" className="form-control" ref="new_password"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('auth.security.confirm_password') }<span className="text-red">*</span></label>
                            <input type="password" className="form-control" ref="confirm_password"/>
                        </div>
                    </form>
                </ModalDialog>
                
            </React.Fragment>
         );
    }

    changePassword = () => {
        const password = this.refs.password.value;
        const new_password = this.refs.new_password.value;
        const confirm_password = this.refs.confirm_password.value;
        const regex = /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/;

        if ( regex.test(new_password) ===  false || regex.test(confirm_password) ===  false ) {
            toast.warning(`Mật khẩu không được chứa các kí tự đặc biệt`, {containerId: 'toast-notification'});
        }else if(new_password.length < 6 || new_password.length > 20)
            toast.warning('Mật khẩu phải có độ dài từ 6 đến 20 kí tự', {containerId: 'toast-notification'});
        else if(new_password !== confirm_password)
            toast.warning('Mật khẩu không khớp', {containerId: 'toast-notification'});
        else{

            return this.props.changePassword({
                password,
                new_password
            });
        }
        
    }

    componentDidMount() {
        this.props.refresh();
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    changePassword: AuthActions.changePassword,
    refresh: AuthActions.refresh,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Header) );