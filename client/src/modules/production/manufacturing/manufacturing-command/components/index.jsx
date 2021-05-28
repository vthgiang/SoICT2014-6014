import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ManufacturingCommandManagementTable from './manufacturingCommandManagementTable';

function ManufacturingCommand(props) {
    
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <ManufacturingCommandManagementTable />
            </div>
        </div>
    );
}
export default connect(null, null)(withTranslate(ManufacturingCommand));