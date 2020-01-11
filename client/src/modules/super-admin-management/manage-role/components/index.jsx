import React, { Component } from 'react';
import RoleTable from './RoleTable';
import RoleCreateForm from './RoleCreateForm';

class ManageRole extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <RoleCreateForm />
                    <RoleTable />
                </div>
            </div>
        );
    }
}

export default ManageRole;