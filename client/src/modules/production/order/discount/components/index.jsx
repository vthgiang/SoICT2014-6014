import React, { Component } from "react";
import DiscountManagementTable from "./discountManagementTable";
class Discount extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <DiscountManagementTable />
                </div>
            </div>
        );
    }
}

export default Discount;
