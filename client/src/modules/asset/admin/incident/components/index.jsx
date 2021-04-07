import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { IncidentManagement } from './incidentManagement';

function IncidentManager(props) {

    return (
        <React.Fragment>
            <IncidentManagement />
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(IncidentManager)); 
