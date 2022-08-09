import React from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BiddingDashboard } from './biddingDashboard';

const BidDashboard = () => {
    return (
        <div>
            <BiddingDashboard />
        </div>
    )
}

export default connect(null, null)(withTranslate(BidDashboard));
