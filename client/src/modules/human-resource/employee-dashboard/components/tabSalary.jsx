import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { HighestSalaryChart, SalaryOfOrganizationalUnitsChart } from './combinedContent';

class TabSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.monthShow !== prevState.monthShow || nextProps.organizationalUnits !== prevState.organizationalUnits) {
            return {
                monthShow: nextProps.monthShow,
                organizationalUnits: nextProps.organizationalUnits
            };
            return null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.monthShow !== this.state.monthShow || nextProps.organizationalUnits !== this.state.organizationalUnits) {
            return true;
        };
        return false;
    }

    render() {
        const { organizationalUnits, monthShow, childOrganizationalUnit } = this.props;
        console.log("render");
        return (
            <React.Fragment>
                {/* Lương thưởng các đơn vị */}
                <SalaryOfOrganizationalUnitsChart organizationalUnits={organizationalUnits} monthShow={monthShow} />

                {/* Top 5 lương thưởng cao nhất */}
                <HighestSalaryChart childOrganizationalUnit={childOrganizationalUnit} organizationalUnits={organizationalUnits} monthShow={monthShow} />
            </React.Fragment>
        );
    }
};

const tabSalary = connect(null, null)(withTranslate(TabSalary));
export { tabSalary as TabSalary };