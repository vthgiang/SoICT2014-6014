import React, { Component } from 'react';
import MainHeaderMenu from './MainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
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
            this.props.editUser( profile );
        }else{
            if(password !== null) this.setState({ confirmNotification: 'Confirm invalid! Please input again!' });
            else this.setState({ confirmNotification: 'Password is not null' });
        }
    }

    render() { 
        const { translate, auth } = this.props;

        return ( 
            <React.Fragment>
                <header className="main-header">
                    <a href="index2.html" className="logo">
                        <span className="logo-mini">QLCV</span>
                        <span className="logo-lg"><b>QLCV-</b>VNIST</span>
                    </a>
                    <nav className="navbar navbar-static-top">
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
                            <h4 className="modal-title">{ translate('profile') }</h4>
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
                            <button type="button" className="btn btn-primary" onClick={ this.save }>{ translate('table.save') }</button>
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
        // getUser: () => {
        //     dispatch(get()); 
        // }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Header) );