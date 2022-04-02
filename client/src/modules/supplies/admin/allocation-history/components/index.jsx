import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AllocationManagement } from './AllocationManagement';

function ManageAllocationHistory(props) {
    return (
        <React.Fragment>
            <AllocationManagement>

            </AllocationManagement>
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(ManageAllocationHistory)); 