import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
// import { create } from '../redux/actions';

class DepartmentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null,
            description: null,
            dean: null,
            vice_dean: null,
            employee: null,
            parent: null
         }
        this.inputChange = this.inputChange.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    render() { 
        const { translate, departmentInfo } = this.props;
        return ( 
            <React.Fragment>
                <div className="modal modal-full fade" id={`department-detail-${departmentInfo._id}`}>
                    <div className="modal-dialog-full">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h4 className="modal-title">{ departmentInfo.name }</h4>
                            </div>
                            <div className="modal-body">

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal">{translate('form.close')}</button>
                                <button type="button" className="btn btn-success">{translate('form.save')}</button>
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
    
    }
}
 
export default connect(mapState, getState) (withTranslate(DepartmentEditForm)); 
