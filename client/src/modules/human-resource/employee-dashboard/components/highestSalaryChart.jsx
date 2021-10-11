/* Biểu đồ top 20 nhân sự có lương thưởng cao nhất */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import { ApiImage } from '../../../../common-components';
import { ViewAllSalary } from '../../../dashboard-personal/components/combinedContent';

const HighestSalaryChart = (props) => {


    /** Function xem tất cả lương thưởng nhân viên  */
    const viewAllSalary = () => {
        window.$(`#modal-view-all-salary`).modal('show');
    }

    const [dataSalary, setDataSalary] = useState([])

    const { translate, salary, department, employeeDashboardData } = props;

    const { monthShow, organizationalUnits } = props;

    let organizationalUnitsName;

    if (organizationalUnits) {
        organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    };

    useEffect(() => {
        setDataSalary(employeeDashboardData.highestSalaryChartData)
    }, [employeeDashboardData.highestSalaryChartData])



    return (
        <React.Fragment>
            <div className="box box-solid">
                <div className="box-header with-border">
                    <div className="box-title">
                        {`Top 5 thu nhập cao nhất `}
                        {
                            organizationalUnitsName && organizationalUnitsName.length < 2 ?
                                <>
                                    <span>{` ${organizationalUnitsName?.[0] ? organizationalUnitsName?.[0] : ""} `}</span>
                                </>
                                :
                                <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                </span>
                        }
                        {monthShow}
                    </div>
                </div>
                <div className="box-body no-parding">
                    <ul className="users-list clearfix">
                        {salary.isLoading
                            ? <li>{translate('general.loading')}</li>
                            : (dataSalary && dataSalary?.length !== 0) ?
                                dataSalary?.map((x, index) => (
                                    index < 5 &&
                                    <li key={index} style={{ maxWidth: 200 }}>
                                        <ApiImage src={`.${x.employee.avatar}`} />
                                        <a className="users-list-name">{x.employee.fullName}</a>
                                        <span className="users-list-date">{x.employee.employeeNumber}</span>
                                    </li>
                                ))
                                : <li>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</li>
                        }
                    </ul>
                </div>
                <div className="box-footer text-center">
                    <a style={{ cursor: 'pointer' }} onClick={viewAllSalary} className="uppercase">Xem tất cả</a>
                </div>
            </div>
            <ViewAllSalary dataSalary={dataSalary} title={`Tổng hợp tình hình lương thưởng ${monthShow}`} viewTotalSalary={true} />
        </React.Fragment>
    );
}

function mapState(state) {
    const { salary, department, employeeDashboardData } = state;
    return { salary, department, employeeDashboardData };
};

const highestSalaryChart = connect(mapState, null)(withTranslate(HighestSalaryChart));
export { highestSalaryChart as HighestSalaryChart };
