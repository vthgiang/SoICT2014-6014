import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get, destroy } from '../redux/actions';

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
                <table className="table table-bordered table-hover" style={{ marginTop: '50px'}}>
                    <thead>
                        <tr className="bg bg-gray">
                            <th>{ translate('table.name') }</th>
                            <th style={{ width: '120px' }}>{ translate('table.action') }</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            department.list.map( u => (
                                <tr 
                                    key={ u._id }
                                >
                                    <td>{ u.name }</td>
                                    <td>
                                        <a className="btn btn-sm btn-primary" data-toggle="modal" href={ `#department-detail-${u._id}` }><i className="fa fa-edit"></i></a>{' '}
                                        <a className="btn btn-sm btn-danger" data-toggle="modal" href={ `#department-delete-${u._id}` }><i className="fa fa-trash"></i></a>{' '}
                                        <div className="modal fade" id={`department-detail-${u._id}`}>
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header bg-blue">
                                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                                        <h4 className="modal-title">{ u.name }</h4>
                                                    </div>
                                                    <div className="modal-body">

                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-danger pull-left" data-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-success">Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                                        <button type="button" className="btn btn-danger pull-left" data-dismiss="modal">Không</button>
                                                        <button type="button" className="btn btn-success" onClick={() => this.deleteDepartment(u._id)} data-dismiss="modal">Có</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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