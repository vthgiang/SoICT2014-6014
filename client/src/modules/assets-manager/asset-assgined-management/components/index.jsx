import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetAssignedManager } from './AssetAssignedManager';
import { AssetCrashManager } from './AssetCrashManager';

class ManagerAssetAssignedCrash extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { translate } = this.props;
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a title="Quản lý thiết bị bàn giao" data-toggle="tab" href="#assetassigned">Quản lý thiết bị bàn giao</a></li>
                    <li><a title="Sự cố thiết bị" data-toggle="tab" href="#assetcrash">Sự cố thiết bị</a></li>
                </ul>
                <div className="tab-content" style={{ padding: 0 }}>
                    <AssetAssignedManager />
                    <AssetCrashManager />
                </div>
            </div>
        )
    };
}

const assetAssignedCrash = connect(null, null)(withTranslate(ManagerAssetAssignedCrash));

export { assetAssignedCrash as ManagerAssetAssignedCrash };