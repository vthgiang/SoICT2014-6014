import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './alert.css';

class AuthAlert extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        const { translate } = this.props;

        return ( 
            <React.Fragment>
                <div className="modal fade" id="alert-error-auth">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{borderRadius: '10px', border: 'gray solid 5px'}}>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 className="modal-title text-center text-red">{translate('alert.title')}</h4>
                            </div>
                            <div className="modal-body">
                                Nội dung thông báo người dùng phải đăng nhập lại
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">{translate('general.close')}</button>
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