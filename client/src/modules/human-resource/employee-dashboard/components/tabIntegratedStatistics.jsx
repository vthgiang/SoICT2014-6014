import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ViewAllOverTime, } from '../../../dashboard-personal/components/combinedContent';
import { ViewAllEmployee, ViewAllCommendation, ViewAllDiscipline } from '../../../dashboard-unit/components/combinedContent';

const TabIntegratedStatistics = (props) => {
    
    
    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };

    /** Function xem tất cả bảng tổng hợp công việc*/
    const viewAllTasks = () => {
        window.$('#modal-view-all-task').modal('show');
    }

    /** Function xem tất cả bảng tổng hợp nhân viên*/
    const viewAllEmployee = () => {
        window.$('#modal-view-all-employee').modal('show');
    }

    /** Function xem tất cả bảng tổng hợp khen thưởng*/
    const viewAllCommendation = () => {
        window.$('#modal-view-all-commendation').modal('show');
    }

    /** Function xem tất cả bảng tổng hợp kỷ luật*/
    const viewAllDiscipline = () => {
        window.$('#modal-view-all-discipline').modal('show');
    }

    const [state, setState] = useState({
        viewOverTime: null,
        viewHoursOff: null
    });

    /** Function xem tất cả tình hình tăng ca */
    const viewAllOverTime = async () => {
        await setState(state => ({...state, viewOverTime: 'overTime'}));
        window.$(`#modal-view-${"overTime"}`).modal('show');
    };

    /** Function xem tất cả tình hình nghỉ phép */
    const viewAllHoursOff = async () => {
        await setState(state => ({...state, viewHoursOff: 'hoursOff'}));
        window.$(`#modal-view-${"hoursOff"}`).modal('show');
    }

    const { translate, timesheets, discipline, user } = props;

    const { month, listAllEmployees } = props;

    

    let listEmployee = user.employees;
    let employeeOvertime = [], employeeHoursOff = [];
    /* Lấy dữ liệu tăng ca và nghỉ phép của mỗi nhân viên trong đơn vị */
    let listTimesheets = timesheets.listTimesheets;
    for (let i in listEmployee) {
        let totalOvertime = 0, totalHoursOff = 0;
        listTimesheets && listTimesheets.forEach(x => {
            if (listEmployee[i].userId.email === x.employee.emailInCompany) {
                totalOvertime = x.totalOvertime ? x.totalOvertime : 0;
                totalHoursOff = x.totalHoursOff ? x.totalHoursOff : 0;
            };
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
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tổng hợp nhân viên</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                            <th>Họ và tên</th>
                                            <th>Giới tính</th>
                                            <th>Ngày sinh</th>
                                            <th>Trình độ chuyên môn</th>
                                            <th>Tình trạng làm việc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listAllEmployees.length !== 0 &&
                                            listAllEmployees.map((x, index) => index < 5 ? (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.fullName}</td>
                                                    <td>{translate(`human_resource.profile.${x.gender}`)}</td>
                                                    <td>{formatDate(x.birthdate, false)}</td>
                                                    <td>{translate(`human_resource.profile.${x.professionalSkill}`)}</td>
                                                    <td>{translate(`human_resource.profile.${x.status}`)}</td>
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
                                <a style={{ cursor: 'pointer' }} onClick={viewAllEmployee} className="uppercase">Xem tất cả</a>
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
                                <h3 className="box-title">Tổng hợp khen thưởng tháng{month}</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th className="col-fixed" style={{ width: 80 }}>STT</th>
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
                                <a style={{ cursor: 'pointer' }} onClick={viewAllCommendation} className="uppercase">Xem tất cả</a>
                            </div>
                        </div>
                    </div>
                    {/* Tổng hợp kỷ luật */}
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tổng hợp kỷ luật tháng {month}</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th className="col-fixed" style={{ width: 80 }}>STT</th>
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
                                <a style={{ cursor: 'pointer' }} onClick={viewAllDiscipline} className="uppercase">Xem tất cả</a>
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
                                <h3 className="box-title">Tổng hợp tình hình nghỉ phép tháng {month}</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th className="col-fixed" style={{ width: 80 }}>STT</th>
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
                                <a style={{ cursor: 'pointer' }} onClick={viewAllHoursOff} className="uppercase">Xem tất cả</a>
                            </div>
                        </div>
                    </div>
                    {/* Tổng hợp tình hình tăng ca */}
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <h3 className="box-title">Tổng hợp tình hình tăng ca tháng {month}</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th className="col-fixed" style={{ width: 80 }}>STT</th>
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
                                <a style={{ cursor: 'pointer' }} onClick={viewAllOverTime} className="uppercase">Xem tất cả</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ViewAllEmployee dataEmployee={listAllEmployees} title={`Tổng hợp nhân viên `} viewAll={true} />
            <ViewAllCommendation dataCommendation={discipline.totalListCommendation} title={`Tổng hợp khen thưởng tháng ${month}`} />
            <ViewAllDiscipline dataDiscipline={discipline.totalListDiscipline} title={`Tổng hợp kỷ luật ${month}`} />
            {
                state.viewOverTime &&
                <ViewAllOverTime dataView={employeeOvertime} title={`Tổng hợp tình hình tăng ca tháng ${month}`} id={state.viewOverTime} />
            }
            {
                state.viewHoursOff &&
                <ViewAllOverTime dataView={employeeHoursOff} title={`Tổng hợp tình hình nghỉ phép tháng ${month}`} id={state.viewHoursOff} />
            }
        </div >
    );
}

function mapState(state) {
    const { timesheets, discipline, user } = state;
    return { timesheets, discipline, user };
}

const tabIntegratedStatistics = connect(mapState, null)(withTranslate(TabIntegratedStatistics));
export { tabIntegratedStatistics as TabIntegratedStatistics };