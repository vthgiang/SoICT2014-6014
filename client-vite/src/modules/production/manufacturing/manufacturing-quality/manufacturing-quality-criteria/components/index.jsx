import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import CriteriaManagementTable from './criteriaManagementTable';

function ManufacturingQualityCreteria(props) {

    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                < CriteriaManagementTable />
            </div>
        </div>
    );
}
export default connect(null, null)(withTranslate(ManufacturingQualityCreteria));
