import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {auth, translate}=this.props;
        return ( 
            <li className="dropdown user user-menu">
                <a href='#abc' className="dropdown-toggle btn" data-toggle="dropdown" style={{width: '55px', height: '50px'}}>
                    <img src="/lib/adminLTE/dist/img/user1-128x128.jpg" className="user-image" alt="User Avatar" />
                </a>
                <ul className="dropdown-menu">
                    {/* User image */}
                    <li className="user-header">
                        <img src="/lib/adminLTE/dist/img/user1-128x128.jpg" className="img-circle" alt="User Avatar" />
                        <p>
                            {auth.user.name}
                            <small>{auth.user.email}</small>
                        </p>
                    </li>
                    <li className="user-footer">
                        <div className="pull-left">
                            <a href="#modal-profile" data-toggle="modal" className="btn btn-default btn-flat"><i className="fa fa-info-circle"></i> {translate('auth.profile.title')} </a>
                        </div>
                        <div className="pull-right">
                            <button type="button" className="btn btn-default btn-flat" onClick={this.props.logout}><i className="fa fa-sign-out"></i> {translate('auth.logout')} </button>
                        </div>
                        <div style={{ marginTop: '45px' }}>
                            <button style={{ width: '100%' }} type="button" className="btn btn-default btn-flat" onClick={this.props.logoutAllAccount}><i className="fa fa-power-off"></i> {translate('auth.logout_all_account')} </button>
                        </div>
                    </li>
                </ul>
            </li>
         );
    }
}

const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = { 
        logout: AuthActions.logout,
        logoutAllAccount: AuthActions.logoutAllAccount
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Profile));