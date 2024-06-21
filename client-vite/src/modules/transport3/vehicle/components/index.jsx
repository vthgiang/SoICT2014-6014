import React from "react";

import VehicleManagementTable from "./vehicleManagementTable";

function VehiclesTransportation() {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <VehicleManagementTable/>
                </div>
            </div>
    );
}

export default VehiclesTransportation;