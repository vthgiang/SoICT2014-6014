import React, { Component } from 'react';
import DepartmentTreeView from './DepartmentTreeView';
import DepartmentCreateForm from './DepartmentCreateForm';

class ManageDepartment extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <DepartmentCreateForm/>
                <DepartmentTreeView/>
            </React.Fragment>
         );
    }
}
 
export default ManageDepartment;