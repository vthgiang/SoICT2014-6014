import React, { Component } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { ManageIssueDashboard } from "./manageIssueDashboard"
const ManageChain = (props) => {
    const { translate } = props;
    return (
        <React.Fragment>
            <div>
                <ManageIssueDashboard />
            </div>
        </React.Fragment>
    )
}

const connectManageIssueDashboard = connect()(withTranslate(ManageIssueDashboard))
export { connectManageIssueDashboard as ManageIssueDashboard }