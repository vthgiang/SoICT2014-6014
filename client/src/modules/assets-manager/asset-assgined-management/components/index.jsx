import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetAssignedManager } from './AssetAssignedManager';

class ManagerAssetAssigned extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <AssetAssignedManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerAssetAssigned)); 
