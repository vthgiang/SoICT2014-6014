import React, { Component } from 'react';
import RoleTable from './RoleTable';
import RoleCreateForm from './RoleCreateForm';

class ManageRole extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <RoleCreateForm/>
                <RoleTable/>
            </React.Fragment>
         );
    }
}
 
export default ManageRole;