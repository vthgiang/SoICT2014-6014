import React, { Component } from 'react';
import MainHeaderMenu from './MainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { ModalDialog } from '../../../common-components';
import { Link } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.save = this.save.bind(this);
    }

    save = () => {
        return this.props.editProfile({
            name: this.refs.name.value,
            email: this.refs.email.value
        });
    }

    changePassword = () => {
        
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
                    func={this.save}
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
                        <div className="form-group">
                            <label>{ translate('auth.profile.password') }</label>
                            <input type="password" className="form-control" ref="password"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('auth.profile.confirm') }</label>
                            <input type="password" className="form-control" ref="confirm"/>
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
                    func={this.save}
                >
                    <form id="form-security">
                        <div className="form-group">
                            <label>{ translate('auth.security.old_password') }</label>
                            <input type="password" className="form-control" ref="old_pasword"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('auth.security.new_password') }</label>
                            <input type="password" className="form-control" ref="new_passwordail"/>
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
    editProfile: AuthActions.editProfile
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Header) );