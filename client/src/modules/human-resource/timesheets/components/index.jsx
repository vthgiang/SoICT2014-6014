import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TimesheetsManagement } from './combinedContent';

const TimesheetsManager = (props) => {
    return (
        <React.Fragment>
            <TimesheetsManagement />
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(TimesheetsManager)); 
