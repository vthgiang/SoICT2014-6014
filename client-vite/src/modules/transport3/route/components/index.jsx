import React from "react";

import RouteManagementTable from '@modules/transport3/route/components/routeManagementTable.jsx';

function VehiclesTransportation() {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <RouteManagementTable />
                </div>
            </div>
    );
}

export default VehiclesTransportation;
