import React, { Component } from "react";

import { TransportVehicalManagementTable } from './transportVehicalManagementTable';

class TransportVehical extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <TransportVehicalManagementTable />
                </div>
            </div>
        );
    }
}

export default TransportVehical;