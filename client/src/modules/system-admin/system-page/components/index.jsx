import React from 'react';

import { withTranslate } from "react-redux-multilingual";
import { TableSystemAdminPage } from './tableSystemAdminPage';

function ManageSystemAdminPage() {
    console.log("DDay la ren derrr");
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                Hêloooo
            </div>
        </div>
    );
}

export default (withTranslate(ManageSystemAdminPage));