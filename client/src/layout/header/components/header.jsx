import React, { Component } from 'react';
import MainHeaderMenu from './mainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { DialogModal } from '../../../common-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './header.css';
import { getStorage } from '../../../config';
import ModalChangeUserInformation from './modalChangeUserInformation';

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
                        <span className="logo-mini"><img src="/logo.png" alt="Logo" style={{width: "40px", marginTop: "-5px", marginLeft: "-15px"}}></img></span>
                        <span className="logo-lg"><img src="/logo.png" alt="Logo" style={{width: "40px", marginTop: "-5px", marginLeft: "-15px"}}></img>VNIST-Việc</span>
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
                <DialogModal
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
                </DialogModal>
                
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

    getLinkId = (path, links) => {
        
        var linkId;
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            if(element.url === path){
                linkId = element._id;
            }
        }

        return linkId;
    } 

    componentDidMount(){
        this.props.refresh();
        
        const currentRole = getStorage("currentRole");
        this.props.getLinksOfRole(currentRole)
            .then(res=>{
                const links = res.data.content;
                const path = window.location.pathname;
                const linkId = this.getLinkId(path, links);
                this.props.getComponentsOfUserInLink(currentRole, linkId);
            })
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

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Header) );