import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent } from '../../../../common-components';

import { TrendOfOvertime, AnnualLeaveTrendsChart } from './combinedContent';

class TabAnualLeave extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };
    render() {
        const { childOrganizationalUnit, defaultUnit } = this.props
        return (
            <React.Fragment>
                <LazyLoadComponent>
                    <AnnualLeaveTrendsChart defaultUnit={defaultUnit} organizationalUnits={[childOrganizationalUnit[0].id]} nameData1='Số lượt nghỉ' nameData2='Số giờ nghỉ phép' nameChart={'Xu hướng nghỉ phép'} />
                </LazyLoadComponent>
                <LazyLoadComponent>
                    <TrendOfOvertime defaultUnit={defaultUnit} organizationalUnits={[childOrganizationalUnit[0].id]} nameData1='Số giờ tăng ca' nameChart={'Xu hướng tăng ca'} />
                </LazyLoadComponent>
            </React.Fragment>
        );
    }
};

const tabAnualLeave = connect(null, null)(withTranslate(TabAnualLeave));
export { tabAnualLeave as TabAnualLeave };