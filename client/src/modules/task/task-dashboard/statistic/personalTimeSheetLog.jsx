import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { taskManagementActions } from '../../task-management/redux/actions';

import { DatePicker } from '../../../../common-components';
import dayjs from 'dayjs';

import { convertTime } from '../../../../helpers/stringMethod';
import { getStorage } from '../../../../config';
function TaskDashboard(props) {
    const { tasks, translate } = props;
    console.log("props: ", props);

    const [state, setState] = useState(initState())
    function initState() {

        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
        let endMonth;

        if (month < 10) {
            endMonth = '0' + month;
        } else {
            endMonth = month;
        }

        const INFO_SEARCH = {
            endMonthTitle: [endMonth, year].join('-'),
        }

        return {
            type: 'status',
            monthTimeSheetLog: INFO_SEARCH.endMonthTitle,
        }
    }

    const { monthTimeSheetLog } = state;

    useEffect(() => {
        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();

       props.getTimeSheetOfUser(getStorage('userId'), month, year);
    }, [])

    const convertType = (value) => {
        // 1: Tắt bấm giờ bằng tay, 2: Tắt bấm giờ tự động với thời gian hẹn trc, 3: add log timer
        if (value == 1) {
            return "Bấm giờ"
        } else if (value == 2) {
            return "Bấm hẹn giờ"
        } else {
            return "Bấm bù giờ"
        }
    }

    const handleChangeMonthTimeSheetLog = (value) => {
        setState({
            ...state,
            monthTimeSheetLog: value
        });
    }

    const getUserTimeSheetLogs = () => {
        let { monthTimeSheetLog } = state;
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.split('-');
            let month = d[0];
            let year = d[1];
            let userId = getStorage('userId');
            props.getTimeSheetOfUser(userId, month, year);
        }
    }

    const getTotalTimeSheet = (ts) => {
        let total = 0;
        for (let i = 0; i < ts.length; i++) {
            let tslog = ts[i];
            if (typeof (tslog.duration) === 'number' && tslog.acceptLog) {
                total = total + Number(tslog.duration);
            }
        }
        return convertTime(total);
    }

    let { userTimeSheetLogs } = tasks;       // Thống kê bấm giờ

    return (
        <React.Fragment>
            {/* Thống kê bấm giờ theo tháng */}
            <div className="row">
                <div className="col-xs-12 col-md-12">
                    <div className="box box-primary">
                        <div className="box-body qlcv">
                            {/* Seach theo thời gian */}
                            <div className="form-inline" >
                                <div className="form-group">
                                    <label style={{ width: "auto" }}>Tháng</label>
                                    <DatePicker
                                        id="month-time-sheet-log"
                                        dateFormat="month-year"
                                        value={monthTimeSheetLog}
                                        onChange={handleChangeMonthTimeSheetLog}
                                        disabled={false}
                                    />
                                </div>
                                <button className="btn btn-primary" onClick={getUserTimeSheetLogs}>Thống kê</button>
                            </div>

                            <div>
                                <p className="pull-right" style={{ fontWeight: 'bold' }}>Tổng thời gian
                                    <span style={{ fontWeight: 'bold', marginLeft: 10 }}>
                                        {
                                            !tasks.isLoading ? getTotalTimeSheet(userTimeSheetLogs) : translate('general.loading')
                                        }
                                    </span>
                                </p >
                            </div>
                            <table className="table table-hover table-striped table-bordered" id="table-user-timesheetlogs">
                                <thead>
                                    <tr>
                                        <th style={{ width: 80 }}>STT</th>
                                        <th>Tên công việc</th>
                                        <th>Thời gian bắt đầu</th>
                                        <th>Thời gian kết thúc</th>
                                        <th>Loại bấm giờ</th>
                                        <th className="col-sort">Bấm giờ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userTimeSheetLogs.map((tsl, index) => {
                                            return (
                                                tsl?.acceptLog && <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{tsl.name}</td>
                                                    <td>{dayjs(tsl.startedAt).format("DD-MM-YYYY h:mm:ss A")}</td>
                                                    <td>{dayjs(tsl.stoppedAt).format("DD-MM-YYYY h:mm:ss A")}</td>
                                                    <td>{convertType(tsl.autoStopped)}</td>
                                                    <td>{convertTime(tsl.duration)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


function mapState(state) {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {
    getTimeSheetOfUser: taskManagementActions.getTimeSheetOfUser,
};

export default connect(mapState, actionCreators)(withTranslate(TaskDashboard));