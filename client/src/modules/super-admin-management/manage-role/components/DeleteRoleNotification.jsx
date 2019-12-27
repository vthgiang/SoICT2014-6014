import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

class DeleteRoleNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const{ translate } = this.props;
        return ( 
            <div className="modal fade" id={`modal-delete-${this.props.roleId}`}>
                <div className="modal-dialog" style={{ width: '30%'}}> 
                    <div className="modal-content">
                        <div className="modal-header bg bg-red">
                            <h4 className="modal-title" style={{color: 'white', textAlign: 'center'}}>{ translate('manageRole.delete') }</h4>
                        </div>
                        <div className="modal-body">
                            <p style={{color: 'red', textAlign: 'center'}}><b>{ this.props.roleName }</b></p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success pull-left" data-dismiss="modal" onClick={ () =>this.props.deleteRole(this.props.roleId) }>{ translate('question.yes') }</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" >{ translate('question.no') }</button>
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

export default connect( mapStateToProps, null )( withTranslate(DeleteRoleNotification) );