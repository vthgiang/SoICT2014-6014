import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {
    HumanResourceChartBySalary, HumanResourceIncreaseAndDecreaseChart, QualificationChart, AgePyramidChart
} from './combinedContent';

const TabHumanResource = (props) => {
    const { organizationalUnits, monthShow, childOrganizationalUnit, defaultUnit, handleMonthChange, date } = props;
    return (
        <div className="row qlcv">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <AgePyramidChart organizationalUnits={organizationalUnits} />
                <div className='row'>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <HumanResourceChartBySalary organizationalUnits={organizationalUnits} monthShow={monthShow} handleMonthChange={handleMonthChange} />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <QualificationChart organizationalUnits={organizationalUnits} />
                    </div>

                </div>
                <HumanResourceIncreaseAndDecreaseChart 
                    childOrganizationalUnit={childOrganizationalUnit}
                    organizationalUnits={organizationalUnits} 
                    defaultUnit={defaultUnit} 
                    nameData1='Tuyển mới' 
                    nameData2='Nghỉ làm' 
                    nameData3='Tổng nhân sự' 
                    nameChart={'Tình hình tăng giảm nhân sự'} 
                    date={date}/>
            </div>
        </div>
    );
};

const tabHumanResource = connect(null, null)(withTranslate(TabHumanResource));
export { tabHumanResource as TabHumanResource };