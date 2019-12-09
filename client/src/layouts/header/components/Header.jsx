import React, { Component } from 'react';
import MainHeaderMenu from './MainHeaderMenu';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
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
                            <h4 className="modal-title">Profile of user</h4>
                        </div>
                        <div className="modal-body">
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
export default Header;