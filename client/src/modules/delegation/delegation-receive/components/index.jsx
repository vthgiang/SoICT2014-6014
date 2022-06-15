import React from 'react';

import { withTranslate } from "react-redux-multilingual";

import { DelegationReceiveTable } from './delegationReceiveTable';

function ManageDelegationReceive() {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <DelegationReceiveTable />
            </div>
        </div>
    );
}

export default (withTranslate(ManageDelegationReceive));