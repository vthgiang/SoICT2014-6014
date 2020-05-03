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
                    <div className="modal-dialog">
                        <div className="modal-content" style={{borderRadius: '10px', border: 'gray solid 5px'}}>
                            <div className="modal-header">
                                <h4 className="modal-title text-center text-red">{translate('alert.title')}</h4>
                            </div>
                            <div className="modal-body">
                                <p><b>{translate('general.auth_alert.title')}</b></p>
                                <p>{translate('general.auth_alert.reason')}</p>
                                <ul>
                                    {
                                        translate('general.auth_alert.content').map(content => <li key={content}>{content}</li>)
                                    }
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.reset}>{translate('general.accept')}</button>
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