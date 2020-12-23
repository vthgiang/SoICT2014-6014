/* Biểu đồ top 20 nhân sự có lương thưởng cao nhất */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ApiImage } from '../../../../common-components';
import { ViewAllSalary } from '../../../dashboard-personal/components/combinedContent';

class HighestSalaryChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Function xem tất cả lương thưởng nhân viên  */
    viewAllSalary = () => {
        window.$(`#modal-view-all-salary`).modal('show');
    }

    render() {
        const { translate, salary, department } = this.props;

        const { monthShow, organizationalUnits, childOrganizationalUnit } = this.props;

        let organizationalUnitsName;
        if (organizationalUnits) {
            organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        };

        let dataSalary = salary.listSalaryByMonthAndOrganizationalUnits;
        if (dataSalary.length !== 0) {
            dataSalary = dataSalary.map(x => {
                let total = parseInt(x.mainSalary);
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        total = total + parseInt(x.bonus[count].number)
                    }
                };
                return { ...x, total: total }
            })
        };
        dataSalary = dataSalary.sort((a, b) => b.total - a.total);

        return (
            <React.Fragment>
                {childOrganizationalUnit.length === department.list.length &&
                    <React.Fragment>
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <h3 className="box-title">{`Top 5 lương thưởng cao nhất của ${(!organizationalUnits || organizationalUnits.length === department.list.length) ? "công ty" : organizationalUnitsName.join(', ')} tháng ${monthShow} `}</h3>
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
                                <a style={{ cursor: 'pointer' }} onClick={this.viewAllSalary} className="uppercase">Xem tất cả</a>
                            </div>
                        </div>
                        <ViewAllSalary dataSalary={dataSalary} title={`Tổng hợp tình hình lương thưởng ${monthShow}`} viewTotalSalary={true} />
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const highestSalaryChart = connect(mapState, null)(withTranslate(HighestSalaryChart));
export { highestSalaryChart as HighestSalaryChart };
