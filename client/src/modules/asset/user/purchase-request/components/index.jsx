import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PurchaseRequest } from './PurchaseRequest';

function RecommendProcure1(props) {

    return (
        <React.Fragment>
            <PurchaseRequest />
        </React.Fragment>
    );
    
}

export default connect(null, null)(withTranslate(RecommendProcure1)); 
