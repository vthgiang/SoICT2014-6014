import React, { Component } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { ManagementChains } from "./managementChains"
const ManageChain = (props) => {
    const { translate } = props;
    return (
        <React.Fragment>
            <div>
                <ManagementChains/>
            </div>
        </React.Fragment>
    )
}

const connectManageChain = connect()(withTranslate(ManageChain))
export { connectManageChain as ManageChain }