import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ErrorManagementTable from './errorManagementTable';

function ManufacturingQualityError(props) {

    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                < ErrorManagementTable />
            </div>
        </div>
    );
}
export default connect(null, null)(withTranslate(ManufacturingQualityError));
