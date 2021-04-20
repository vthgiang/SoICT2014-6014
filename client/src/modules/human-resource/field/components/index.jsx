import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { FieldManagement } from './combinedContent';

const FieldManager = (props) => {
    return (
        <React.Fragment>
            <FieldManagement />
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(FieldManager));
