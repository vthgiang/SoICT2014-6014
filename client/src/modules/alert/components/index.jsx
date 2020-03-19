import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AlertActions } from '../redux/actions';
import './alert.css'

class Alert extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleButton = () => {
        this.props.reset();
        document.getElementById('alert').style.display = 'none';
    }

    render() { 
        const { display, msg } = this.props.alert;
        const { translate } = this.props;
        return ( 
            <React.Fragment>
                <div id="alert" className={display ? 'modal fade in display-block' : 'modal fade in display-none'} >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title text-center text-red">{translate('alert.title')}</h4>
                            </div>
                            <div className="modal-body text-center">
                                <strong>
                                    { msg !== null ? translate(`alert.${msg}`) : translate('alert.log_again') }
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