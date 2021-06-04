import React, { Component } from "react";
import { TransportRequirementsManagementTable } from './transportRequirementsManagementTable';
import './transport-requirements.css';
class TransportRequirements extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <TransportRequirementsManagementTable />
                </div>
            </div>
        );
    }
}

export default TransportRequirements;