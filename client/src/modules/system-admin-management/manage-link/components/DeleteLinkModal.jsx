import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { destroy } from '../redux/actions';

class DeleteLinkModal extends Component {
    state = {  }
    render() { 
        const { linkId, translate } = this.props;
        return ( 
            <React.Fragment>
                
                <div className="modal fade" id={`modal-delete-${linkId}`}>
                    <div className="modal-dialog" style={{ width: '30%'}}> 
                        <div className="modal-content">
                            <div className="modal-header bg bg-red">
                                <h4 className="modal-title" style={{color: 'white', textAlign: 'center'}}>{ translate('manageLink.delete') }</h4>
                            </div>
                            <div className="modal-body">
                                <p style={{color: 'red', textAlign: 'center'}}><b>{ this.props.linkName }</b></p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success pull-left" data-dismiss="modal" onClick={ () =>this.props.deleteLink(this.props.linkId) }>{ translate('question.yes') }</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal">{ translate('question.no') }</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        deleteLink: (id) => {
            dispatch( destroy(id));
        }
    }
}
 
export default connect(mapState, getState) (withTranslate(DeleteLinkModal));