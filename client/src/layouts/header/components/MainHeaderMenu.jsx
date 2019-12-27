import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/MainHeaderMenu.css';
import { withTranslate } from 'react-redux-multilingual';
import { logout } from '../../../modules/auth/redux/actions';
import { IntlActions } from 'react-redux-multilingual';
import { getLinksOfRole,refresh } from '../../../modules/auth/redux/actions';

class MainHeaderMenu extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            currentRole: localStorage.getItem('currentRole') ? localStorage.getItem('currentRole') : null
        }
        this.selectHandle = this.selectHandle.bind(this);
    }

    selectHandle(e){
        this.setState({currentRole: e.target.value});
        localStorage.setItem('currentRole', e.target.value);
        this.props.getLinksOfRole(e.target.value);
    }

    componentDidMount(){
        this.props.getLinksOfRole(this.state.currentRole);
        this.props.refresh();
    }

    render() {
        const { auth } = this.props;
        const { currentRole } = this.state;
        return (
            <React.Fragment>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li>
                            {
                                auth.user.roles && auth.user.roles.length > 0 &&
                                <select 
                                    style={{ padding: '8px' , marginTop: '5px'}} 
                                    onChange={this.selectHandle}
                                    name='currentRole'
                                    defaultValue={currentRole}>
                                    { 
                                        auth.user.roles.map( role => {
                                            return (
                                                <option key={ role.roleId._id } value={ role.roleId._id }>
                                                    { role.roleId.name }
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            }
                        </li>
                        <li className="dropdown user user-menu">
                            <a href="#abc" className="dropdown-toggle" data-toggle="dropdown">
                                <img src="/adminLTE/dist/img/user2-160x160.jpg" className="user-image" alt="User Avatar" />
                                <span className="hidden-xs">{ auth.user.name }</span>
                            </a>
                            <ul className="dropdown-menu">
                                {/* User image */}
                                <li className="user-header">
                                    <img src="/adminLTE/dist/img/user2-160x160.jpg" className="img-circle" alt="User Avatar" />
                                    <p>
                                        { auth.user.name }
                                        <small>{ auth.user.email }</small>
                                    </p>
                                </li>
                                <li className="user-footer">
                                    <div className="pull-left">
                                        <a href="#modal-profile" data-toggle="modal" className="btn btn-default btn-flat">Profile</a>
                                    </div>
                                    <div className="pull-right">
                                        <button type="button" className="btn btn-default btn-flat" onClick={this.props.logout}>Logout</button>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button 
                                className="btn" 
                                data-toggle="control-sidebar" 
                                title="language translate"
                                style={{
                                    padding: '15px 15px 15px 15px', 
                                    backgroundColor: '#605CA8',
                                    color: 'white'
                                }}>
                                <i className="fa fa-language"></i>
                            </button>
                        </li>
                    </ul>
                    <div className="control-sidebar control-sidebar-light" style={{display: 'none', marginTop: '52px', width: '135px'}}>
                        <div style={{marginTop: '-40px'}}>
                            <i onClick={this.props.setLanguageEnglish}>
                                <img src="/en.png" className="img-circle" alt="img" style={{width: '30px', height: '30px', marginLeft: '5px'}} />
                                <span className="badge">EN</span>
                            </i>
                            <i onClick={this.props.setLanguageVietNam}>
                                <img src="/vn.png" className="img-circle" alt="img" style={{width: '30px', height: '30px', marginLeft: '5px'}} />
                                <span className="badge">VN</span>
                            </i>
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
    return{
        logout: () => {
            dispatch(logout()); //dispatch đến action getUsers trong file index của action và lưu dữ liệu users trên store
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
