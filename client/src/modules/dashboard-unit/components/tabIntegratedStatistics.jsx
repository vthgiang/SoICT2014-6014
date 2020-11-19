import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ViewAllTasks, ViewAllOverTime, } from '../../dashboard-personal/components/combinedContent';
import { ViewAllEmployee, ViewAllCommendation, ViewAllDiscipline } from './combinedContent';

class TabIntegratedStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /** Function xem tất cả bảng tổng hợp công việc*/
    viewAllTasks = () => {
        window.$('#modal-view-all-task').modal('show');
    }

    /** Function xem tất cả bảng tổng hợp nhân viên*/
    viewAllEmployee = () => {
        window.$('#modal-view-all-employee').modal('show');
    }

    /** Function xem tất cả bảng tổng hợp khen thưởng*/
    viewAllCommendation = () => {
        window.$('#modal-view-all-commendation').modal('show');
    }

    /** Function xem tất cả bảng tổng hợp kỷ luật*/
    viewAllDiscipline = () => {
        window.$('#modal-view-all-discipline').modal('show');
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
        const { translate, timesheets, discipline } = this.props;

        const { month, employeeTasks, listEmployee, listAllEmployees } = this.props;
        let maxTask = 1;
        if (employeeTasks && employeeTasks.length !== 0) {
            employeeTasks.forEach(x => {
                if (x.totalTask > maxTask) {
                    maxTask = x.totalTask
                }
            })
        }

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
            <div className="qlcv">
                <div className='row'>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        {/* Tổng hợp số nhân viên*/}
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Tổng hợp nhân viên</h3>
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Họ và tên</th>
                                                <th>Giới tính</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listAllEmployees.length !== 0 &&
                                                listAllEmployees.map((x, index) => index < 5 ? (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.fullName}</td>
                                                        <td>{translate(`human_resource.profile.${x.gender}`)}</td>
                                                    </tr>
                                                ) : null)
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        (!listAllEmployees || listAllEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                </div>
                                <div className="box-footer text-center">
                                    <a style={{ cursor: 'pointer' }} onClick={this.viewAllEmployee} className="uppercase">Xem tất cả</a>
                                </div>
                            </div>
                        </div>

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
                                                        <td>
                                                            <div className="clearfix"> <small class="pull-right">{x.totalTask}</small> </div>
                                                            <div className="progress xs">
                                                                <div style={{ width: `${(x.totalTask / maxTask).toFixed(2) * 100}%` }} className="progress-bar progress-bar-green">
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null)
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        (!employeeTasks || employeeTasks.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                </div>
                                <div className="box-footer text-center">
                                    <a style={{ cursor: 'pointer' }} onClick={this.viewAllTasks} className="uppercase">Xem tất cả</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        {/* Tổng hợp khen thưởng */}
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Tổng hợp khen thưởng {month}</h3>
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Họ và tên</th>
                                                <th>Lý do khen thưởng </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {discipline.totalListCommendation.length !== 0 &&
                                                discipline.totalListCommendation.map((x, index) => index < 5 ? (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.employee.fullName}</td>
                                                        <td>{x.reason}</td>
                                                    </tr>
                                                ) : null)
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        (!discipline.totalListCommendation || discipline.totalListCommendation.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                </div>
                                <div className="box-footer text-center">
                                    <a style={{ cursor: 'pointer' }} onClick={this.viewAllCommendation} className="uppercase">Xem tất cả</a>
                                </div>
                            </div>
                        </div>
                        {/* Tổng hợp kỷ luật */}
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Tổng hợp kỷ luật {month}</h3>
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Họ và tên</th>
                                                <th>Lý do kỷ luật</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {discipline.totalListDiscipline.length !== 0 &&
                                                discipline.totalListDiscipline.map((x, index) => index < 5 ? (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.employee.fullName}</td>
                                                        <td>{x.reason}</td>
                                                    </tr>
                                                ) : null)
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        (!discipline.totalListDiscipline || discipline.totalListDiscipline.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                </div>
                                <div className="box-footer text-center">
                                    <a style={{ cursor: 'pointer' }} onClick={this.viewAllDiscipline} className="uppercase">Xem tất cả</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                                                <th>Tổng số giờ</th>
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
                                    {
                                        (!employeeHoursOff || employeeHoursOff.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
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
                                                <th>Tổng số giờ</th>
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
                                    {
                                        (!employeeOvertime || employeeOvertime.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                </div>
                                <div className="box-footer text-center">
                                    <a style={{ cursor: 'pointer' }} onClick={this.viewAllOverTime} className="uppercase">Xem tất cả</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ViewAllTasks employeeTasks={employeeTasks} title={`Tổng hợp công việc ${month}`} />
                <ViewAllEmployee dataEmployee={listAllEmployees} title={`Tổng hợp nhân viên`} />
                <ViewAllCommendation dataCommendation={discipline.totalListCommendation} title={`Tổng hợp khen thưởng ${month}`} />
                <ViewAllDiscipline dataDiscipline={discipline.totalListDiscipline} title={`Tổng hợp kỷ luật ${month}`} />
                {
                    viewOverTime &&
                    <ViewAllOverTime dataView={employeeOvertime} title={`Tổng hợp tình hình tăng ca ${month}`} id={viewOverTime} />
                }
                {
                    viewHoursOff &&
                    <ViewAllOverTime dataView={employeeHoursOff} title={`Tổng hợp tình hình nghỉ phép ${month}`} id={viewHoursOff} />
                }
            </div >
        );
    }
}

function mapState(state) {
    const { timesheets, discipline } = state;
    return { timesheets, discipline };
}

const tabIntegratedStatistics = connect(mapState, null)(withTranslate(TabIntegratedStatistics));
export { tabIntegratedStatistics as TabIntegratedStatistics };