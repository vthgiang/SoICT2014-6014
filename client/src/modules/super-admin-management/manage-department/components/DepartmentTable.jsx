import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
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
                        <React.Fragment key={u._id}>
                            <DepartmentCreateWithParent parentId={u._id}/>
                            <DepartmentEditForm departmentInfo={u}/>
                        </React.Fragment>
                    ))
                }
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = {
    get: DepartmentActions.get,
    destroy: DepartmentActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(DepartmentTable)); 