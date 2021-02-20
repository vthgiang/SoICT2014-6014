import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertTime } from '../../../../helpers/stringMethod';
import { InforTimeSheetLog } from './inforTimeSheetLog'


class AllTimeSheetLogsByUnit extends Component {
    constructor(props) {
        super(props);
        let curTime = new Date();
        let month = curTime.getMonth() + 1;
        let year = curTime.getFullYear();
        this.state = {
            time: month + "-" + year,
            currentRowTimeSheetLog: undefined
        }
    }

    componentDidMount() {
        let { time } = this.state;
        // this.filterTimeSheetLog(time);
    }

    changeTime = (value) => {
        this.setState({
            time: value
        });
        // this.filterTimeSheetLog(value);
    }

    filterTimeSheetLog = (time) => {
        if (time) {
            let dataTime = time.split("-");
            let month = dataTime[0];
            let year = dataTime[1];
            // this.props.getAllUserTimeSheetByUnit(this.props.idsUnit, month, year);
        }
    }

    formatDate = (date) => {
        if (date) {
            let data = date.split("-");
            data = data[1] + "-" + data[0]
            return data;
        }
    }
    handleInforTimeSheet = async (value) => {
        const { organizationUnitTasks, userDepartment } = this.props;
        let inforTimeSheetLog = []
        if (organizationUnitTasks && organizationUnitTasks.tasks) {
            for (let i in organizationUnitTasks.tasks) {
                if (organizationUnitTasks.tasks[i].timesheetLogs && organizationUnitTasks.tasks[i].timesheetLogs.length) {
                    for (let j in organizationUnitTasks.tasks[i].timesheetLogs) {
                        let creator = organizationUnitTasks.tasks[i].timesheetLogs[j].creator;
                        if (creator == value.userId) {
                            let timesheet = {
                                ...organizationUnitTasks.tasks[i].timesheetLogs[j],
                                taskName: organizationUnitTasks.tasks[i].name
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
    render() {
        const { tasks, translate } = this.props;
        const { organizationUnitTasks, userDepartment, startMonth, endMonth } = this.props;
        const { month, currentRowTimeSheetLog } = this.state;
        console.log("Dòng 76", this.props)
        var allTimeSheet = [], timesheetlogs = []
        if (userDepartment) {
            for (let i in userDepartment) {
                allTimeSheet[userDepartment[i].userId._id] = {
                    totalhours: 0,
                    autotimer: 0,
                    manualtimer: 0,
                    logtimer: 0,
                    name: userDepartment[i].userId.name,
                    userId: userDepartment[i].userId._id
                }
            }
        }
        if (organizationUnitTasks && organizationUnitTasks.tasks && userDepartment) {
            for (let i in organizationUnitTasks.tasks) {
                if (organizationUnitTasks.tasks[i].timesheetLogs && organizationUnitTasks.tasks[i].timesheetLogs.length) {
                    for (let j in organizationUnitTasks.tasks[i].timesheetLogs) {
                        let autoStopped = organizationUnitTasks.tasks[i].timesheetLogs[j].autoStopped;
                        let creator = organizationUnitTasks.tasks[i].timesheetLogs[j].creator;
                        if (creator && allTimeSheet[creator]) {
                            if (autoStopped == 1) {
                                allTimeSheet[creator].manualtimer += organizationUnitTasks.tasks[i].timesheetLogs[j].duration
                            } else if (autoStopped == 2) {
                                allTimeSheet[creator].autotimer += organizationUnitTasks.tasks[i].timesheetLogs[j].duration
                            } else if (autoStopped == 3) {
                                allTimeSheet[creator].logtimer += organizationUnitTasks.tasks[i].timesheetLogs[j].duration
                            }
                        }
                    }
                }
            }

            for (let i in allTimeSheet) {
                allTimeSheet[i].totalhours = allTimeSheet[i].autotimer + allTimeSheet[i].manualtimer + allTimeSheet[i].logtimer
                timesheetlogs.push(allTimeSheet[i])
            }
        }

        return (
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">
                                Thống kê bấm giờ từ tháng {this.formatDate(startMonth)} đến tháng {this.formatDate(endMonth)}
                            </div>
                        </div>
                        <div className="box-body qlcv">
                            <table className="table table-hover table-striped table-bordered" id="table-user-timesheetlogs">
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px' }}>STT</th>
                                        <th>{translate('manage_user.name')}</th>
                                        <th>Tổng thời gian bấm giờ</th>
                                        <th>Bấm giờ tự chọn</th>
                                        <th>Bấm giờ tự động</th>
                                        <th>Bấm giờ tự tắt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        timesheetlogs.length && timesheetlogs.map((tsl, index) => {
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
                        </div>
                    </div>
                </div>
                { currentRowTimeSheetLog &&
                    <InforTimeSheetLog
                        timesheetlogs={currentRowTimeSheetLog.timesheetlogs}
                        data={currentRowTimeSheetLog.data}
                    />
                }
            </div>
        )
    }
}

const mapState = (state) => {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {

};

export default connect(mapState, actionCreators)(withTranslate(AllTimeSheetLogsByUnit));

const connectedAllTimeSheetLogs = connect(mapState, actionCreators)(withTranslate(AllTimeSheetLogsByUnit))
export { connectedAllTimeSheetLogs as AllTimeSheetLogsByUnit }