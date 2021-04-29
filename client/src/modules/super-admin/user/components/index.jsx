import React from 'react';

import ManageUserTable from './manageUserTable';

function ManageUser() {
    return (
        <div className="box" style={{ minHeight: '450px' }}>
            <div className="box-body">
                <ManageUserTable />
            </div>
        </div>
    );
}

export default ManageUser;
