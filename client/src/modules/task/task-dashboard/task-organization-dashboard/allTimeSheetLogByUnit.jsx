import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertTime } from '../../../../helpers/stringMethod';
import { InforTimeSheetLog } from './inforTimeSheetLog'

import { UserActions } from '../../../super-admin/user/redux/actions';

import { PaginateBar, DataTableSetting } from '../../../../common-components/index';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
class AllTimeSheetLogsByUnit extends Component {
    constructor(props) {
        super(props);
        let curTime = new Date();
        let month = curTime.getMonth() + 1;
        let year = curTime.getFullYear();

        const defaultConfig = { limit: 10 }
        this.allTimeSheetLogsByUnitId = "all-time-sheet-logs"
        const allTimeSheetLogsByUnitIdPerPage = getTableConfiguration(this.allTimeSheetLogsByUnitId, defaultConfig).limit;

        this.state = {
            time: month + "-" + year,
            currentRowTimeSheetLog: undefined,

            type: "forAllTimeSheetLogs",
            page: 1,
            perPage: allTimeSheetLogsByUnitIdPerPage
        }
    }

    componentDidMount() {
        const { unitIds } = this.props;
        const { type, page, perPage } = this.state;

        let data = {
            type: type,
            organizationalUnitIds: unitIds,
            page: page,
            perPage: perPage
        }

        this.props.getAllEmployeeOfUnitByIds(data);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { unitIds, user } = this.props;
        const { type, page, perPage } = this.state;

        if (nextProps.user?.employeeForAllTimeSheetLogs?.loading !== user?.employeeForAllTimeSheetLogs?.loading) {
            return true
        }

        let data = {
            type: type,
            organizationalUnitIds: nextProps.unitIds,
            page: page,
            perPage: perPage
        }

        if (nextProps.unitIds && !user?.employeeForAllTimeSheetLogs?.employees && !user?.employeeForAllTimeSheetLogs?.loading) {
            this.props.getAllEmployeeOfUnitByIds(data);

            return true;
        }

        return true;
    }

    handleInforTimeSheet = async (value) => {
        const { organizationUnitTasks } = this.props;
        let inforTimeSheetLog = []
        if (organizationUnitTasks && organizationUnitTasks.tasks) {
            for (let i in organizationUnitTasks.tasks) {
                if (organizationUnitTasks.tasks[i].timesheetLogs && organizationUnitTasks.tasks[i].timesheetLogs.length) {
                    for (let j in organizationUnitTasks.tasks[i].timesheetLogs) {
                        let creator = organizationUnitTasks.tasks[i].timesheetLogs[j].creator;
                        if (creator == value.userId) {
                            let timesheet = {
                                ...organizationUnitTasks.tasks[i].timesheetLogs[j],
                                taskName: organizationUnitTasks.tasks[i].name,
                                taskId: organizationUnitTasks.tasks[i]._id,
                            }
                            inforTimeSheetLog.push(timesheet)
                        }
                    }
                }
            }
        }
        await this.setState(state => {
            return {
                ...state,
                currentRowTimeSheetLog: {
                    timesheetlogs: inforTimeSheetLog,
                    data: value
                }
            }
        });
        window.$('#modal-infor-time-sheet-log').modal('show');

    }

    handlePaginationAllTimeSheetLogs = (page) => {
        const { unitIds } = this.props;
        const { perPage, type } = this.state;

        this.setState(state => {
            return {
                ...state,
                page: page
            }
        })

        let data = {
            type: type,
            organizationalUnitIds: unitIds,
            page: page,
            perPage: perPage
        }

        this.props.getAllEmployeeOfUnitByIds(data);
    }

    setLimitAllTimeSheetLogs = (limit) => {
        const { unitIds } = this.props;
        const { type, page } = this.state;

        this.setState(state => {
            return {
                ...state,
                perPage: limit
            }
        })

        let data = {
            type: type,
            organizationalUnitIds: unitIds,
            page: page,
            perPage: limit
        }

        this.props.getAllEmployeeOfUnitByIds(data);
    }

    render() {
        const { translate, user } = this.props;
        const { organizationUnitTasks, startMonthTitle, endMonthTitle, unitIds, selectBoxUnit, startMonth, endMonth } = this.props;
        const { currentRowTimeSheetLog, page } = this.state;
        let allTimeSheet = [], timesheetlogs = [];
        let listEmployee;

        if (user) {
            listEmployee = user?.employeeForAllTimeSheetLogs?.employees;
        }

        if (listEmployee) {
            for (let i in listEmployee) {
                allTimeSheet[listEmployee[i]?.userId._id] = {
                    totalhours: 0,
                    autotimer: 0,
                    manualtimer: 0,
                    logtimer: 0,
                    name: listEmployee[i].userId.name,
                    userId: listEmployee[i].userId._id
                }
            }
        }

        let filterTimeSheetLogs = [];
        organizationUnitTasks?.tasks && organizationUnitTasks.tasks.forEach((o, index) => {
            if (o.timesheetLogs && o.timesheetLogs.length > 0) {
                filterTimeSheetLogs = [
                    ...filterTimeSheetLogs,
                    ...o.timesheetLogs
                ]
            }
        });

        filterTimeSheetLogs = filterTimeSheetLogs.filter(o => o.creator && o.duration && o.startedAt && o.stoppedAt && o.acceptLog && dayjs(o.startedAt).isSameOrAfter(startMonth, 'month') && dayjs(o.stoppedAt).isSameOrBefore(endMonth, 'month'));

        for (let i in filterTimeSheetLogs) {
            let autoStopped = filterTimeSheetLogs[i].autoStopped;
            let creator = filterTimeSheetLogs[i].creator;

            if (allTimeSheet[creator]) {
                if (autoStopped === 1) {
                    allTimeSheet[creator].manualtimer += filterTimeSheetLogs[i].duration
                } else if (autoStopped === 2) {
                    allTimeSheet[creator].autotimer += filterTimeSheetLogs[i].duration
                } else if (autoStopped === 3) {
                    allTimeSheet[creator].logtimer += filterTimeSheetLogs[i].duration
                }
            }
        }

        allTimeSheet = Object.entries(allTimeSheet).map(([key, value]) => {
            if (value.totalhours >= 0) {
                value.totalhours = value?.manualtimer + value?.logtimer + value?.autotimer;
            }
            return value;
        })

        return (
            <React.Fragment>
                <div className="box-header with-border">
                    <div className="box-title">
                        Thống kê bấm giờ {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                        {
                            unitIds && unitIds.length < 2 ?
                                <>
                                    <spn>{` ${translate('task.task_dashboard.of')}`}</spn>
                                    <span>{` ${this.props.getUnitName(selectBoxUnit, unitIds).map(o => o).join(", ")}`}</span>
                                </>
                                :
                                <span onClick={() => this.props.showUnitGeneraTask(selectBoxUnit, unitIds)} style={{ cursor: 'pointer' }}>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitIds && unitIds.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                </span>
                        }
                    </div>
                    <DataTableSetting
                        tableId={this.allTimeSheetLogsByUnitId}
                        setLimit={this.setLimitAllTimeSheetLogs}
                    />
                </div>
                <div className="box-body qlcv">
                    <table className="table table-hover table-striped table-bordered" id="table-user-timesheetlogs">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>STT</th>
                                <th>Họ và tên</th>
                                <th>Tổng thời gian bấm giờ</th>
                                <th>Bấm giờ</th>
                                <th>Bấm hẹn giờ</th>
                                <th>Bấm bù giờ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allTimeSheet?.length > 0 && allTimeSheet.map((tsl, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><a onClick={() => this.handleInforTimeSheet(tsl)}>{tsl.name}</a></td>
                                            <td>{convertTime(tsl.totalhours)}</td>
                                            <td>{convertTime(tsl.manualtimer)}</td>
                                            <td>{convertTime(tsl.autotimer)}</td>
                                            <td>{convertTime(tsl.logtimer)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {currentRowTimeSheetLog &&
                        <InforTimeSheetLog
                            timesheetlogs={currentRowTimeSheetLog.timesheetlogs}
                            data={currentRowTimeSheetLog.data}
                        />
                    }
                    <PaginateBar
                        display={user?.employeeForAllTimeSheetLogs?.employees?.length}
                        total={user?.employeeForAllTimeSheetLogs?.totalEmployee}
                        pageTotal={user?.employeeForAllTimeSheetLogs?.totalPage}
                        currentPage={page}
                        func={this.handlePaginationAllTimeSheetLogs}
                    />
                </div>
            </React.Fragment>
        )
    }
}

const mapState = (state) => {
    const { tasks, user } = state;
    return { tasks, user };
}
const actionCreators = {
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds
};

export default connect(mapState, actionCreators)(withTranslate(AllTimeSheetLogsByUnit));

const connectedAllTimeSheetLogs = connect(mapState, actionCreators)(withTranslate(AllTimeSheetLogsByUnit))
export { connectedAllTimeSheetLogs as AllTimeSheetLogsByUnit }