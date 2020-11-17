import React, { Component } from "react";
import SLAMangementTable from "./slaManagementTable";

class ServiceLevelAgreement extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <SLAMangementTable />
                </div>
            </div>
        );
    }
}

export default ServiceLevelAgreement;
