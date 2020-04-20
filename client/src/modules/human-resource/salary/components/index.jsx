import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SalaryManager } from './salaryManager';

class ManagerSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <SalaryManager />
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ManagerSalary)); 
