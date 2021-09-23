import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import AnnualLeaveManagement from './annualLeaveManagement';

function AnnualLeaveManager(props) {
    return (
        <React.Fragment>
            {/* file này không sử dụng nữa  */}
            {/* <AnnualLeaveManagement /> */}
        </React.Fragment>
    );
}
export default connect(null, null)(withTranslate(AnnualLeaveManager));
