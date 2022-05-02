import React from 'react';

import { withTranslate } from "react-redux-multilingual";

import { DelegationTable } from './delegationTable';

function ManageDelegation() {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <DelegationTable />
            </div>
        </div>
    );
}

export default (withTranslate(ManageDelegation));