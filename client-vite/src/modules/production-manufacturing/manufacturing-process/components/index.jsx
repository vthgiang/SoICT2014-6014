import React, { Component } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { ManagerManufacturingProcess } from './managerManufacturingProcess'

function ManufacturingProcessManagement() {

    return (
        <React.Fragment>
            <div>
                <ManagerManufacturingProcess />
            </div>
        </React.Fragment>
    );

}

const connectManufacturingProcessManagement = connect()(withTranslate(ManufacturingProcessManagement))
export { connectManufacturingProcessManagement as ManufacturingProcessManagement }