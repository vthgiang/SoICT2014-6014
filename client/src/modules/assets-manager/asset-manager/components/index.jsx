import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetManager } from './AssetManager';

class ManagerAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <AssetManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerAsset)); 