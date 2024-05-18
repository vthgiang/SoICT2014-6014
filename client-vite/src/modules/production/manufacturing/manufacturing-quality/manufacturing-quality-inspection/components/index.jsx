import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import InspectionManagementTable from './inspectionManagementTable';

function ManufacturingQualityInspection(props) {

    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                < InspectionManagementTable />
            </div>
        </div>
    );
}
export default connect(null, null)(withTranslate(ManufacturingQualityInspection));
