import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BiddingPackageManagement } from './combinedContent';

const BiddingPackagesManagement = (props) => {
    return (
        <React.Fragment>
            <BiddingPackageManagement />
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(BiddingPackagesManagement)); 
