import React from "react";

import IssueManagementTable from '@modules/transport3/issue/components/issueManagementTable';

function VehiclesTransportation() {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <IssueManagementTable />
                </div>
            </div>
    );
}

export default VehiclesTransportation;
