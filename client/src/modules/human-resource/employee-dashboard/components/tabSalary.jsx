import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { HighestSalaryChart, SalaryOfOrganizationalUnitsChart } from './combinedContent';

const TabSalary = (props) => {
    const { organizationalUnits, monthShow, childOrganizationalUnit,salaryChart } = props;
    
    return (
        <React.Fragment>
            {/* Lương thưởng các đơn vị */}
            <SalaryOfOrganizationalUnitsChart 
                organizationalUnits={organizationalUnits} 
                monthShow={monthShow} 
                salaryChartData = {salaryChart}
            />
            
            {/* Top 5 lương thưởng cao nhất */}
            <HighestSalaryChart childOrganizationalUnit={childOrganizationalUnit} organizationalUnits={organizationalUnits} monthShow={monthShow} />
        </React.Fragment>
    );
};

const tabSalary = connect(null, null)(withTranslate(TabSalary));
export { tabSalary as TabSalary };