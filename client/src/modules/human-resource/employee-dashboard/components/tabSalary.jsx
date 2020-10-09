import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent } from '../../../../common-components';

import { HighestSalaryChart, SalaryOfOrganizationalUnitsChart } from './combinedContent';
import './employeeDashBoard.css';

class TabSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    render() {
        const { organizationalUnits, monthShow } = this.props;
        return (
            <React.Fragment>
                {/* Top 20 lương thưởng cao nhất */}
                <HighestSalaryChart organizationalUnits={organizationalUnits} monthShow={monthShow} />

                {/* Lương thưởng các đơn vị */}
                <SalaryOfOrganizationalUnitsChart organizationalUnits={organizationalUnits} monthShow={monthShow} />

            </React.Fragment>
        );
    }
};

const tabSalary = connect(null, null)(withTranslate(TabSalary));
export { tabSalary as TabSalary };