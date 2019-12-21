import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

class DeleteNotificationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const{ translate } = this.props;

        return ( 
            <div className="modal fade" id={`modal-delete-${this.props.userId}`}>
                <div className="modal-dialog" style={{ width: '30%'}}> 
                    <div className="modal-content">
                        <div className="modal-header bg bg-red">
                            <h4 className="modal-title" style={{color: 'white', textAlign: 'center'}}>{ translate('manageUser.delete') }</h4>
                        </div>
                        <div className="modal-body">
                            <p style={{ textAlign: 'center', color: 'red'}} ><i style={{ fontSize: '80px' }} className="fa fa-trash"></i></p>
                            <p style={{color: 'red', textAlign: 'center'}}><b>{ this.props.userEmail }</b></p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success pull-left" data-dismiss="modal" onClick={ () =>this.props.delete(this.props.userId) }>Yes</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" >No</button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps, null )( withTranslate(DeleteNotificationModal) );