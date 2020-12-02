import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { FieldManagement } from './combinedContent';

class SalaryField extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <FieldManagement />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(SalaryField)); 
