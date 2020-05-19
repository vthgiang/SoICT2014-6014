import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RecommendDistribute } from './RecommendDistribute';

class RecommendDistribute1 extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <RecommendDistribute />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(RecommendDistribute1)); 
