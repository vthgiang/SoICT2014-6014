import React from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { ShipperActions } from '../../redux/actions'
import DeliveryTasksTable from "./deliveryTasksTable";

function ShipperDeliveryReport(props) {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <DeliveryTasksTable/>
        </div>
    );
}

function mapState(state) {
    const shipper = state.shipper;
    return { shipper }
}

const mapActions = {

}
export default connect(mapState, mapActions)(withTranslate(ShipperDeliveryReport));