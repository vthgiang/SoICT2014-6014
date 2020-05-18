import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DistributeTransferManager } from './DistributeTransferManager';

class ManagerDistributeTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <DistributeTransferManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerDistributeTransfer)); 
