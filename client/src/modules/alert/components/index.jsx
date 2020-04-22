import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';
import { AlertActions } from '../redux/actions';
import './alert.css'

class Alert extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleButton = async() => {
        document.getElementById('alert').style.display = 'none';
        await this.props.reset();
    }

    render() { 
        const { display, message } = this.props.alert;
        const { translate } = this.props;
        if(message === 'page_access_denied')
            return <Redirect to="/"/>
        else
            return ( 
                <React.Fragment>
                    <div id="alert" className={display ? 'modal fade in display-block' : 'modal fade in display-none'} >
                        <div className="modal-dialog">
                            <div className="modal-content top-200">
                                <div className="modal-header">
                                    <h4 className="modal-title text-center text-red">{translate('alert.title')}</h4>
                                </div>
                                <div className="modal-body text-center">
                                    <strong>
                                        { message !== null ? translate(`alert.${message}`) : translate('alert.log_again') }
                                    </strong>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={this.handleButton}>OK</button>
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

const mapDispatchToProps = {
    reset: AlertActions.reset
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Alert) );