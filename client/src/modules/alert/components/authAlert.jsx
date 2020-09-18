import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './alert.css';

import store from '../../../redux/store';

class AuthAlert extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }
    reset = () => {
        store.dispatch({
            type: 'RESET'
        });
    }

    render() { 
        const { translate } = this.props;

        return ( 
            <React.Fragment>
                <div className="modal fade" id="alert-error-auth">
                    <div className="modal-dialog" style={{marginTop: '100px'}}>
                        <div className="alert alert-danger alert-dismissible">
                            <i className="icon fa fa-bullhorn" />
                            {translate('general.auth_alert.title')}
                        </div>

                        <div className="modal-content">
                            <div className="modal-body">
                                <p><b></b></p>
                                <p>{translate('general.auth_alert.reason')}</p>
                                <ul>
                                    {
                                        translate('general.auth_alert.content').map(content => <li key={content}>{content}</li>)
                                    }
                                </ul>
                                <button className="btn btn-default pull-right" onClick={this.reset}>{translate('general.accept')}</button>
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

export default connect( mapStateToProps )( withTranslate(AuthAlert) );