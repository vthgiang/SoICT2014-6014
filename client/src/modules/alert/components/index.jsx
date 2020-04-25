import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './alert.css';

class Alert extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        const { translate } = this.props;
        
        return ( 
            <React.Fragment>
                <div class="modal fade" id="alert-error-auth">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            
                            <div class="alert alert-danger">
                                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                <strong>Title!</strong> Alert body ...
                            </div>
                            
                            {/* <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 class="modal-title">Modal title</h4>
                            </div>
                            <div class="modal-body">
                                
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                            </div> */}
                        </div>
                    </div>
                </div>
                
                {/* <div id="alert" className={display ? 'modal fade in display-block' : 'modal fade in display-none'} >
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
                                <button className="btn btn-primary" onClick={this.handleButton}>Đăng xuất</button>
                            </div>
                        </div>
                    </div>
                </div>
                 */}
            </React.Fragment>
        );
    }
}
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps )( withTranslate(Alert) );