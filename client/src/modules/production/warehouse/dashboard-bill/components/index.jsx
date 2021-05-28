import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import DashBoardBills from './billDashboard';

function BillDashBoard(props) {
    return (
        <React.Fragment>
            <DashBoardBills />
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(BillDashBoard));
