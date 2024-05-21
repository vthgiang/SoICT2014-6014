import React from "react";
import ShipperManagementTable from './shipperManagementTable'


function ShipperTransportation() {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <ShipperManagementTable/>
            </div>
        </div>
    );
}

export default ShipperTransportation;