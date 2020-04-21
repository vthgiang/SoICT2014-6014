import React, { Component } from 'react';
import RoleDefaultTable from './rootRoleTable';

class ManageRoleDefault extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <RoleDefaultTable />
                </div>
            </div>
        );
    }

}

export default ManageRoleDefault;