import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RecommendDistributeManager } from './RecommendDistributeManager';

class ManagerRecommendDistribute extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <RecommendDistributeManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerRecommendDistribute)); 
