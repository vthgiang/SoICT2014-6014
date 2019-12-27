import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get } from '../redux/actions';

class DepartmentTable extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.get();
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
                                        <a className="btn btn-sm btn-primary" data-toggle="modal" href={ `#edit-deparment-modal-${u._id}` }><i className="fa fa-edit"></i></a>{' '}
                                        
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
    }
}
 
export default connect(mapState, getState) (withTranslate(DepartmentTable)); 