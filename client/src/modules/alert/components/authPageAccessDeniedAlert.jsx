import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class AuthPageAccessDeniedAlert extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        const { translate } = this.props;

        return ( 
            <React.Fragment>
                <div className="modal fade" id="alert-error-auth-page-acccess-denied">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{borderRadius: '10px', border: 'gray solid 5px'}}>
                            <div className="modal-header">
                                <h4 className="modal-title text-center text-red">{translate('alert.title')}</h4>
                            </div>
                            <div className="modal-body">
                                <p className="text-center">{translate('general.auth_alert.page_access_denied')}</p>
                            </div>
                            <div className="modal-footer">
                                <a href="/" className="btn btn-primary">{translate('general.accept')}</a>
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

export default connect( mapStateToProps )( withTranslate(AuthPageAccessDeniedAlert) );