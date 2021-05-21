/* Biểu đồ top 20 nhân sự có lương thưởng cao nhất */
import React, { Component } from 'react';
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

    const { translate, salary, department } = props;

    const { monthShow, organizationalUnits, childOrganizationalUnit } = props;

    let organizationalUnitsName;

    if (organizationalUnits) {
        organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    };

    let data = salary.listSalaryByMonthAndOrganizationalUnits;
    if (data.length !== 0) {
        data = data.map(x => {
            let total = parseInt(x.mainSalary);
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number)
                }
            };
            return { ...x, total: total }
        })
    };

    let dataSalary = []
        data.forEach(x => {
            const index = dataSalary.findIndex(y => y.employee._id === x.employee._id)
            if (index >= 0) {
                dataSalary[index].total = dataSalary[index].total + x.total
            } else {
                dataSalary = [...dataSalary, x]
            }
        });

    dataSalary = dataSalary.sort((a, b) => b.total - a.total);

    
    
        return (
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <div className="box-title">
                            {`Top 5 thu nhập cao nhất `}
                            {
                                organizationalUnitsName && organizationalUnitsName.length < 2 ?
                                    <>
                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                        <span>{` ${organizationalUnitsName?.[0] ? organizationalUnitsName?.[0] : ""}`}</span>
                                    </>
                                    :
                                    <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                    </span>
                            }
                            {` tháng ${monthShow}`}
                        </div>
                    </div>
                    <div className="box-body no-parding">
                        <ul className="users-list clearfix">
                            {
                                (dataSalary && dataSalary.length !== 0) ?
                                    dataSalary.map((x, index) => (
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
    const { salary, department } = state;
    return { salary, department };
};

const highestSalaryChart = connect(mapState, null)(withTranslate(HighestSalaryChart));
export { highestSalaryChart as HighestSalaryChart };
