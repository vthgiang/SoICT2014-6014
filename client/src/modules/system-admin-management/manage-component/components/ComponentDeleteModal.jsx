import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ComponentDeleteModal extends Component {
    state = {  }
    render() { 
        const { componentId, componentName , translate } = this.props;
        return ( 
            <React.Fragment>
                
                <div className="modal fade" id={`modal-component-delete-${componentId}`}>
                    <div className="modal-dialog" style={{ width: '30%'}}> 
                        <div className="modal-content">
                            <div className="modal-header bg bg-red">
                                <h4 className="modal-title" style={{color: 'white', textAlign: 'center'}}>{ translate('manageComponent.delete') }</h4>
                            </div>
                            <div className="modal-body">
                                <p style={{color: 'red', textAlign: 'center'}}><b>{ componentName }</b></p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success pull-left" data-dismiss="modal" onClick={ () =>this.props.deleteComponent(componentId) }>{ translate('question.yes') }</button>
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
 
export default connect(mapState, null) (withTranslate(ComponentDeleteModal));