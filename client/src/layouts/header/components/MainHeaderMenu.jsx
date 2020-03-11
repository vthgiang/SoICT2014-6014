import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/MainHeaderMenu.css';
import { withTranslate } from 'react-redux-multilingual';
import { logout, logoutAllAccount } from '../../../modules/auth/redux/actions';
import { IntlActions } from 'react-redux-multilingual';
import { getLinksOfRole, refresh } from '../../../modules/auth/redux/actions';
import { setStorage, getStorage } from '../../../config';

class MainHeaderMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentRole: getStorage('currentRole') ? getStorage('currentRole') : null
        }
        this.selectHandle = this.selectHandle.bind(this);
    }

    selectHandle(e) {
        this.setState({ currentRole: e.target.value });
        setStorage('currentRole', e.target.value);
        this.props.getLinksOfRole(e.target.value);
    }

    componentDidMount() {
        this.props.getLinksOfRole(this.state.currentRole);
        this.props.refresh();
    }

    render() {
        const { auth, translate } = this.props;
        const { currentRole } = this.state;
        return (
            <React.Fragment>
                <div className="navbar-custom-menu">
                
                    <ul className="nav navbar-nav">
                        <li>
                            {
                                auth.user.roles && auth.user.roles.length > 0 &&
                                <select
                                    className="form-control"
                                    style={{ marginTop: '9px' }}
                                    onChange={this.selectHandle}
                                    name='currentRole'
                                    defaultValue={currentRole}>
                                    {
                                        auth.user.roles.map(role => {
                                            return (
                                                <option key={role.roleId._id} value={role.roleId._id}>
                                                    {role.roleId.name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            }
                        </li>
                        <li className="dropdown notifications-menu">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <i className="fa fa-bell-o" />
                                <span className="label label-warning">10</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li className="header">You have 10 notifications</li>
                                <li>
                                    {/* inner menu: contains the actual data */}
                                    <ul className="menu">
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-users text-aqua" /> 5 new members joined today
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-warning text-yellow" /> Very long description here that may not fit into the
                                                page and may cause design problems
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-users text-red" /> 5 new members joined
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-shopping-cart text-green" /> 25 sales made
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa fa-user text-red" /> You changed your username
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="footer"><a href="#">View all</a></li>
                            </ul>
                        </li>

                        <li className="dropdown user user-menu">
                            <a href="#abc" className="dropdown-toggle" data-toggle="dropdown">
                                <img src="/lib/adminLTE/dist/img/user2-160x160.jpg" className="user-image" alt="User Avatar" />
                                <span className="hidden-xs">{auth.user.name}</span>
                            </a>
                            <ul className="dropdown-menu">
                                {/* User image */}
                                <li className="user-header">
                                    <img src="/lib/adminLTE/dist/img/user2-160x160.jpg" className="img-circle" alt="User Avatar" />
                                    <p>
                                        {auth.user.name}
                                        <small>{auth.user.email}</small>
                                    </p>
                                </li>
                                <li className="user-footer">
                                    <div className="pull-left">
                                        <a href="#modal-profile" data-toggle="modal" className="btn btn-default btn-flat"><i className="fa fa-info-circle"></i> {translate('auth.profile')} </a>
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
                        <li>
                            <button
                                className="btn"
                                data-toggle="control-sidebar"
                                title={translate('language')}
                                style={{
                                    padding: '15px 15px 15px 15px',
                                    backgroundColor: '#605CA8',
                                    color: 'white'
                                }}>
                                <i className="fa fa-language"></i>
                            </button>
                        </li>
                    </ul>
                    <div className="control-sidebar control-sidebar-light" style={{ display: 'none', marginTop: '52px', width: '158px' }}>
                        <div style={{ marginTop: '-40px' }}>
                            <button onClick={this.props.setLanguageEnglish} style={{border: 'none', backgroundColor: '#F9FAFC'}}>
                                <i>
                                    <img src="/lib/en.png" className="img-circle" alt="img" style={{ width: '30px', height: '30px', marginLeft: '5px' }} />
                                    <span className="badge">EN</span>
                                </i>
                            </button>
                            <button onClick={this.props.setLanguageVietNam} style={{border: 'none', backgroundColor: '#F9FAFC'}}>
                                <i>
                                    <img src="/lib/vn.png" className="img-circle" alt="img" style={{ width: '30px', height: '30px', marginLeft: '5px' }} />
                                    <span className="badge">VN</span>
                                </i>
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => { //lưu các users lên store
    return {
        logout: () => {
            dispatch(logout()); //dispatch đến action getUsers trong file index của action và lưu dữ liệu users trên store
        },
        logoutAllAccount: () => {
            dispatch(logoutAllAccount()); //dispatch đến action getUsers trong file index của action và lưu dữ liệu users trên store
        },
        setLanguageVietNam: () => {
            localStorage.setItem('lang', 'vn');
            dispatch(IntlActions.setLocale('vn'));
        },
        setLanguageEnglish: () => {
            localStorage.setItem('lang', 'en');
            dispatch(IntlActions.setLocale('en'));
        },
        getLinksOfRole: (idRole) => {
            dispatch(getLinksOfRole(idRole));
        },
        refresh: () => {
            dispatch(refresh());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MainHeaderMenu));
