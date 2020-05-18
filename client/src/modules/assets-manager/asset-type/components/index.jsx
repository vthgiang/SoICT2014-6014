import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetTypeManager } from './AssetTypeManager';

class ManagerAssetType extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <AssetTypeManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerAssetType)); 
