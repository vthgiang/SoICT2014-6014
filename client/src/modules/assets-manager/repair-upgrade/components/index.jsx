import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RepairUpgradeManager } from './RepairUpgradeManager';

class ManagerRepairUpgrade extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <RepairUpgradeManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerRepairUpgrade)); 
