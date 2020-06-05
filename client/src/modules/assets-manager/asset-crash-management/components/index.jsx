import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetCrashManager } from './AssetCrashManager';

class ManagerAssetCrash extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <AssetCrashManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerAssetCrash)); 
