import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { UsageManagement } from './usageManagement';

class UsageManager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <UsageManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(UsageManager)); 
