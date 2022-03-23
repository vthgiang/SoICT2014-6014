import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import StockManagementTable from './stockManagementTable';

function StockManagement(props) {
    const [state, setState] = useState({

    })
    return (
        <div className="box-body" style={{ minHeight: "450px" }}>
            <StockManagementTable />
        </div>
    );
}

export default connect(null, null)(withTranslate(StockManagement));
