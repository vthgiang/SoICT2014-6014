import React, { Component } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { TaskManufacturingManager } from "./taskManufacturingManager"
const TaskManufacturingManagement = (props) => {
    const { translate } = props;
    return (
        <React.Fragment>
            <div>
                <TaskManufacturingManager/>
            </div>
        </React.Fragment>
    )
}

const connectTaskManagement = connect()(withTranslate(TaskManufacturingManagement))
export { connectTaskManagement as TaskManufacturingManagement }