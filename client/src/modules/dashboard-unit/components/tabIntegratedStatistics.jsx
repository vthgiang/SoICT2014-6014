import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ViewAllTasks, ViewAllOverTime, } from '../../dashboard-personal/components/combinedContent';
import { ViewAllEmployee, ViewAllCommendation, ViewAllDiscipline } from './combinedContent';
import { showListInSwal } from '../../../helpers/showListInSwal';

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
        const { translate, timesheets, discipline, department, employeeDashboardData } = this.props;
        const { month, listEmployee, listAllEmployees, organizationalUnits } = this.props;
        const { viewOverTime, viewHoursOff } = this.state;



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

        let organizationalUnitsName;
        if (organizationalUnits) {
            organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        };

        const taskUnits = this.props?.tasks?.organizationUnitTasks?.tasks;
        let employeeTasks = [];
        if (taskUnits?.length) {
            for (let i in listEmployee) {
                let tasks = [];
                let accountableTask = [], consultedTask = [], responsibleTask = [], informedTask = [];
                taskUnits.forEach(x => {
                    if (x?.accountableEmployees) {
                        x.accountableEmployees.forEach(k => {
                            if (typeof k === 'object') {
                                if (k?._id === listEmployee?.[i]?.userId?._id)
                                    accountableTask = [...accountableTask, x._id]
                            }
                            if (typeof k === 'string') {
                                if (k === listEmployee?.[i]?.userId?._id)
                                    accountableTask = [...accountableTask, x._id]
                            }
                        })
                    }

                    if (x?.responsibleEmployees) {
                        x.responsibleEmployees.forEach(k => {
                            if (typeof (k) === 'object') {
                                if (k?._id === listEmployee?.[i]?.userId?._id)
                                    responsibleTask = [...responsibleTask, x._id]
                            }
                            if (typeof (k) === 'string') {
                                if (k === listEmployee?.[i]?.userId?._id)
                                    responsibleTask = [...responsibleTask, x._id]
                            }
                        })
                    }

                    if (x?.consultedEmployees) {
                        x.consultedEmployees.forEach(k => {
                            if (typeof (k) === 'object') {
                                if (k?._id === listEmployee?.[i]?.userId?._id)
                                    consultedTask = [...consultedTask, x._id]
                            }
                            if (typeof (k) === 'string') {
                                if (k === listEmployee?.[i]?.userId?._id)
                                    consultedTask = [...consultedTask, x._id]
                            }
                        })
                    }

                    if (x?.informedEmployees) {
                        x.informedEmployees.forEach(k => {
                            if (typeof (k) === 'object') {
                                if (k?._id === listEmployee?.[i]?.userId?._id)
                                    informedTask = [...informedTask, x._id]
                            }
                            if (typeof (k) === 'string') {
                                if (k === listEmployee?.[i]?.userId?._id)
                                    informedTask = [...informedTask, x._id]
                            }
                        })
                    }
                })
                tasks = tasks.concat(accountableTask).concat(consultedTask).concat(responsibleTask).concat(informedTask);
                let totalTask = tasks.filter(function (item, pos) {
                    return tasks.indexOf(item) === pos;
                })
                employeeTasks = [...employeeTasks, { _id: listEmployee?.[i]?.userId?._id, name: listEmployee?.[i].userId?.name, totalTask: totalTask?.length }]
            }
        }
        if (employeeTasks.length !== 0) {
            employeeTasks = employeeTasks.sort((a, b) => b.totalTask - a.totalTask);
        };

        let maxTask = 1;

        if (employeeTasks && employeeTasks.length !== 0) {
            employeeTasks.forEach(x => {
                if (x.totalTask > maxTask) {
                    maxTask = x.totalTask
                }
            })
        }
        return (
            <div className="qlcv">
                <div className='row'>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        {/* Tổng hợp số nhân viên*/}
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <div className="box-title">
                                        Tổng hợp nhân viên
                                    </div>
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th className="col-fixed" style={{ width: 80 }}>STT</th>
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
                                    <div className="box-title">
                                        {`Tổng hợp công việc `}
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
                                        {month}
                                    </div>
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                                <th>Họ và tên</th>
                                                <th>Số công việc</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeTasks.length !== 0 &&
                                                employeeTasks.map((x, index) => index < 5 ? (
                                                    <tr key={index} style={{ width: 46 }}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.name}</td>
                                                        <td>
                                                            <div className="clearfix"> <small className="pull-right">{x.totalTask}</small> </div>
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
                                    <div className="box-title">
                                        {`Tổng hợp khen thưởng `}
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
                                        {month}
                                    </div>
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
                                            {employeeDashboardData.commendation?.totalList?.length !== 0 &&
                                                employeeDashboardData.commendation?.totalList?.map((x, index) => index < 5 ? (
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
                                        (!employeeDashboardData.commendation?.totalList || employeeDashboardData.commendation?.totalList?.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
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
                                    <div className="box-title">
                                        {`Tổng hợp kỷ luật `}
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
                                        {month}
                                    </div>
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
                                            {employeeDashboardData.discipline?.totalList?.length !== 0 &&
                                                employeeDashboardData.discipline?.totalList?.map((x, index) => index < 5 ? (
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
                                        (!employeeDashboardData.discipline?.totalList || employeeDashboardData.discipline?.totalList?.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
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
                                    <div className="box-title">
                                        {`Tổng hợp tình hình nghỉ phép `}
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
                                        {month}
                                    </div>
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
                                    <a style={{ cursor: 'pointer' }} onClick={this.viewAllHoursOff} className="uppercase">Xem tất cả</a>
                                </div>
                            </div>
                        </div>
                        {/* Tổng hợp tình hình tăng ca */}
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <div className="box-title">
                                        {`Tổng hợp tình hình tăng ca `}
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
                                        {month}
                                    </div>
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
                                    <a style={{ cursor: 'pointer' }} onClick={this.viewAllOverTime} className="uppercase">Xem tất cả</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ViewAllTasks employeeTasks={employeeTasks} title={`Tổng hợp công việc ${month}`} />
                <ViewAllEmployee dataEmployee={listAllEmployees} title={`Tổng hợp nhân viên`} />
                <ViewAllCommendation dataCommendation={employeeDashboardData.commendation?.totalList?.length > 0 ? employeeDashboardData.commendation?.totalList : []} title={`Tổng hợp khen thưởng${month}`} />
                <ViewAllDiscipline dataDiscipline={employeeDashboardData.discipline?.totalLists?.length > 0 ? employeeDashboardData.discipline.totalLists : []} title={`Tổng hợp kỷ luật ${month}`} />
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
    const { timesheets, discipline, department, tasks, employeeDashboardData } = state;
    return { timesheets, discipline, department, tasks, employeeDashboardData };
}

const tabIntegratedStatistics = connect(mapState, null)(withTranslate(TabIntegratedStatistics));
export { tabIntegratedStatistics as TabIntegratedStatistics };