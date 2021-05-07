import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeCreatePage } from './combinedContent';

function EmployeeCreate(props) {
    const [state, setState] = useState({

    })

    return (
        <React.Fragment>
            <EmployeeCreatePage />
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(EmployeeCreate));
