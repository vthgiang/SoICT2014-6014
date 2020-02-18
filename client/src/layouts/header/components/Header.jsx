import React, { Component } from 'react';
import MainHeaderMenu from './MainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { editProfile } from '../../../modules/auth/redux/actions';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: this.props.auth.user.name,
            email: this.props.auth.user.email,
            password: null,
            confirm: null,
            confirmNotification: null
        };
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    save = (e) => {
        e.preventDefault();
        const { name, email, password, confirm } = this.state;
        if( password === confirm && password !== null ){
            const profile = { name, email, password };
            this.props.editProfile( profile );
        }else{
            if(password !== null) this.setState({ confirmNotification: 'Confirm invalid! Please input again!' });
            else this.setState({ confirmNotification: 'Password is not null' });
        }
    }

    componentDidMount(){
        this.setState({
            name: this.props.auth.user.name,
            email: this.props.auth.user.email
        })
    }

    render() { 
        const { translate, auth } = this.props;
        return ( 
            <React.Fragment>
                <header className="main-header">
                    {/* Logo */}
                    <a href="index2.html" className="logo">
                        {/* mini logo for sidebar mini 50x50 pixels */}
                        <span className="logo-mini"><img src="/lib/main/image/logo.png" alt="Logo" style={{width: "40px", marginTop: "-5px", marginLeft: "-15px"}}></img></span>
                        {/* logo for regular state and mobile devices */}
                        <span className="logo-lg"><img src="/lib/main/image/logo.png" alt="Logo" style={{width: "40px", marginTop: "-5px", marginLeft: "-15px"}}></img>VNIST-Việc</span>
                    </a>
                    {/* Header Navbar: style can be found in header.less */}
                    <nav className="navbar navbar-static-top">
                        {/* Sidebar toggle button*/}
                        <a href="#abc" className="sidebar-toggle" data-toggle="push-menu" role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <MainHeaderMenu/>
                    </nav>
                </header>
                <div className="modal fade" id="modal-profile">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 className="modal-title">{ translate('profileTitle') }</h4>
                        </div>
                        <div className="modal-body">
                            {
                                this.state.confirmNotification !== null && 
                                <strong style={{ color: 'red' }}><i className="fa fa-info"></i> { this.state.confirmNotification } </strong>
                            }
                            
                            <form style={{ marginBottom: '20px' }} >
                                <div className="form-group">
                                    <label>{ translate('table.name') }</label>
                                    <input type="text" className="form-control" name="name" onChange={ this.inputChange } defaultValue={ auth.user.name } />
                                </div>
                                <div className="form-group">
                                    <label>{ translate('table.email') }</label>
                                    <input type="email" className="form-control" defaultValue={ auth.user.email } disabled/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('table.password') }</label>
                                    <input type="password" className="form-control" name="password" onChange={ this.inputChange } />
                                </div>
                                <div className="form-group">
                                    <label>{ translate('table.confirm') }</label>
                                    <input type="password" className="form-control" name="confirm" onChange={ this.inputChange } />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default pull-left" data-dismiss="modal">{ translate('table.close') }</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={ this.save }>{ translate('table.save') }</button>
                        </div>
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

const mapDispatchToProps = (dispatch, props) => {
    return{
        editProfile: (data) => {
            dispatch(editProfile(data)); 
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Header) );