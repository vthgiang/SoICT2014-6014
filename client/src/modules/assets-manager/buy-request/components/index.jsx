import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BuyRequestManager } from './BuyRequestManager';

class ManagerBuyRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <BuyRequestManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerBuyRequest)); 
