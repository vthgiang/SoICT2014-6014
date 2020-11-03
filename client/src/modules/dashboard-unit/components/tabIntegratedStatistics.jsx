import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ViewAllTasks, ViewAllOverTime } from '../../dashboard-personal/components/combinedContent';

class TabIntegratedStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Function xem tất cả bảng tổng hợp công việc*/
    viewAllTasks = () => {
        window.$('#modal-view-all-task').modal('show');
    }

    /** Function xem tất cả tình hình tăng ca */
    viewAllOverTime = async () => {
        await this.setState({
            viewOverTime: 'overTime',
        });
        window.$(`#modal-view-${"overTime"}`).modal('show');
    };

    /** Function xem tất cả tình hình nghỉ phép */
    viewAllHoursOff = async () => {
        await this.setState({
            viewHoursOff: 'hoursOff',
        });
        window.$(`#modal-view-${"hoursOff"}`).modal('show');
    }

    render() {
        const { translate, timesheets } = this.props;

        const { month, employeeTasks, listEmployee } = this.props;

        const { viewOverTime, viewHoursOff } = this.state;

        let employeeOvertime = [], employeeHoursOff = [];
        /* Lấy dữ liệu tăng ca và nghỉ phép của mỗi nhân viên trong đơn vị */
        let listOvertimeOfUnitsByStartDateAndEndDate = timesheets.listOvertimeOfUnitsByStartDateAndEndDate;
        for (let i in listEmployee) {
            let totalOvertime = 0, totalHoursOff = 0;
            listOvertimeOfUnitsByStartDateAndEndDate && listOvertimeOfUnitsByStartDateAndEndDate.forEach(x => {
                if (listEmployee[i].userId.email === x.employee.emailInCompany && x.totalHoursOff < 0) {
                    totalOvertime = 0 - x.totalHoursOff;

                };
                if (listEmployee[i].userId.email === x.employee.emailInCompany && x.totalHoursOff > 0) {
                    totalHoursOff = x.totalHoursOff;

                }
            });
            employeeOvertime = [...employeeOvertime, { _id: listEmployee[i].userId._id, name: listEmployee[i].userId.name, totalHours: totalOvertime }];
            employeeHoursOff = [...employeeHoursOff, { _id: listEmployee[i].userId._id, name: listEmployee[i].userId.name, totalHours: totalHoursOff }];
        };
        /* Sắp xếp theo thứ tự giảm dần */
        if (employeeOvertime.length !== 0) {
            employeeOvertime = employeeOvertime.sort((a, b) => b.totalHours - a.totalHours);
        };
        if (employeeHoursOff.length !== 0) {
            employeeHoursOff = employeeHoursOff.sort((a, b) => b.totalHours - a.totalHours);
        };

        return (
            <div className="row qlcv">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    {/* Tổng hợp công việc */}
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tổng hợp công việc {month}</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Họ và tên</th>
                                            <th>Số công việc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employeeTasks.length !== 0 &&
                                            employeeTasks.map((x, index) => index < 5 ? (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.name}</td>
                                                    <td>{x.totalTask}</td>
                                                </tr>
                                            ) : null)
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="box-footer text-center">
                                <a style={{ cursor: 'pointer' }} onClick={this.viewAllTasks} className="uppercase">Xem tất cả</a>
                            </div>
                        </div>
                    </div>

                    {/* Tổng hợp tình hình nghỉ phép */}
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tổng hợp tình hình nghỉ phép {month}</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Họ và tên</th>
                                            <th>Số công việc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employeeHoursOff.length !== 0 &&
                                            employeeHoursOff.map((x, index) => index < 5 ? (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.name}</td>
                                                    <td>{x.totalHours}</td>
                                                </tr>
                                            ) : null)
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="box-footer text-center">
                                <a style={{ cursor: 'pointer' }} onClick={this.viewAllHoursOff} className="uppercase">Xem tất cả</a>
                            </div>
                        </div>
                    </div>
                    {/* Tổng hợp tình hình tăng ca */}
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tổng hợp tình hình tăng ca {month}</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Họ và tên</th>
                                            <th>Số công việc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employeeOvertime.length !== 0 &&
                                            employeeOvertime.map((x, index) => index < 5 ? (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.name}</td>
                                                    <td>{x.totalHours}</td>
                                                </tr>
                                            ) : null)
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="box-footer text-center">
                                <a style={{ cursor: 'pointer' }} onClick={this.viewAllOverTime} className="uppercase">Xem tất cả</a>
                            </div>
                        </div>
                    </div>
                </div>
                <ViewAllTasks employeeTasks={employeeTasks} title={`Tổng hợp công việc ${month}`} />
                {
                    viewOverTime &&
                    <ViewAllOverTime dataView={employeeOvertime} title={`Tổng hợp tình hình tăng ca ${month}`} id={viewOverTime} />
                }
                {
                    viewHoursOff &&
                    <ViewAllOverTime dataView={employeeHoursOff} title={`Tổng hợp tình hình nghỉ phép ${month}`} id={viewHoursOff} />
                }
            </div>
        );
    }
}

function mapState(state) {
    const { timesheets } = state;
    return { timesheets };
}

const tabIntegratedStatistics = connect(mapState, null)(withTranslate(TabIntegratedStatistics));
export { tabIntegratedStatistics as TabIntegratedStatistics };