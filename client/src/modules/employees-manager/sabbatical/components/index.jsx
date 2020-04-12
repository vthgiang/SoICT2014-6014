import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SabbaticalManager } from './SabbaticalManager';

class ManagerSabbatical extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <SabbaticalManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerSabbatical)); 
