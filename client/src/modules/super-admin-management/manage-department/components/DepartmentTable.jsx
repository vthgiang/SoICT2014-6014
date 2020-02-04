import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get, destroy } from '../redux/actions';
import DepartmentCreateWithParent from './DepartmentCreateWithParent';
import DepartmentEditForm from './DepartmentEditForm';

class DepartmentTable extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.deleteDepartment = this.deleteDepartment.bind(this);
    }

    componentDidMount(){
        this.props.get();
    }

    deleteDepartment = (id) => {
        this.props.destroy(id);
    }

    render() { 
        const { department, translate } = this.props;
        return ( 
            <React.Fragment>
                {
                    department.list.map( u => (
                        <React.Fragment>
                            <DepartmentCreateWithParent parentId={u._id}/>
                            <DepartmentEditForm departmentInfo={u}/>
                            <div className="modal fade" id={`department-delete-${u._id}`}>
                                <div className="modal-dialog" style={{ width: '30%'}}>
                                    <div className="modal-content">
                                        <div className="modal-header bg-red">
                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                            <h4 className="modal-title">Xóa phòng ban</h4>
                                        </div>
                                        <div className="modal-body">
                                            { u.name }
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-default" data-dismiss="modal">{translate('question.yes')}</button>
                                            <button type="button" className="btn btn-primary" onClick={() => this.deleteDepartment(u._id)} data-dismiss="modal">{translate('question.no')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))
                }
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        get: () => {
            dispatch(get());
        },
        destroy: (id) => {
            dispatch(destroy(id));
        },
    }
}
 
export default connect(mapState, getState) (withTranslate(DepartmentTable)); 