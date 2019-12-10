import React, { Component } from 'react';
import DepartmentTreeView from './DepartmentTreeView';

class ManageDepartment extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <DepartmentTreeView/>
            </React.Fragment>
         );
    }
}
 
export default ManageDepartment;