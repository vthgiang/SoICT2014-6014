import React, { Component } from "react";
import BusinessDepartmentManagementTable from "./businessDepartmentManagementTable";
class BusinessDepartment extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <BusinessDepartmentManagementTable />
                </div>
            </div>
        );
    }
}

export default BusinessDepartment;
