import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {translate, notification} = this.props;
        return ( 
            <React.Fragment>
                <li className="dropdown notifications-menu">
                    <a href="#abc" className="dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-bell-o" />
                        <span className="label label-warning">{notification.listReceivered.length}</span>
                    </a>
                    <ul className="dropdown-menu" style={{borderColor: 'gray'}}>
                        <li className="header text-center"> {notification.listReceivered.length} {translate('notification.news')}</li>
                        <li>
                            <ul className="menu">
                                <li>
                                    <a href="#abc">
                                        <i className="fa fa-warning text-yellow" /> Very long description here that may not fit into the
                                        page and may cause design problems
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="footer"><Link to="/notifications">{translate('notification.see_all')}</Link></li>
                    </ul>
                </li>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = { 
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Notifications));