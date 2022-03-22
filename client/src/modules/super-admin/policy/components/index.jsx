import React from 'react';

import { withTranslate } from "react-redux-multilingual";

import { PolicyTable } from './policyTable';

function ManagePolicy() {
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <PolicyTable />
            </div>
        </div>
    );
}

export default (withTranslate(ManagePolicy));