import React, { Component, Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { taskManagementActions } from '../../task-management/redux/actions';

import { DatePicker } from '../../../../common-components';

import { convertTime } from '../../../../helpers/stringMethod';
import { getStorage } from '../../../../config';
import parse from 'html-react-parser';
import { PaginateBar, DataTableSetting } from '../../../../common-components/index';
function EmployeeTimeSheetLog(props) {
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

    let { allTimeSheetLogs } = tasks; // Thống kê bấm giờ
    console.log("--time", allTimeSheetLogs);
    const { monthTimeSheetLog } = state;

    useEffect(() => {
        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear(),
            limit = 15,
            page = 1;
        props.getAllUserTimeSheet(month, year, limit, page);
    }, [])

    const handleChangeMonthTimeSheetLog = (value) => {
        setState({
            ...state,
            monthTimeSheetLog: value
        });
    }

    const getAllUserTimeSheetLogs = () => {
        let { monthTimeSheetLog } = state;
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.split('-');
            let month = d[0];
            let year = d[1];
            let limit = 15, page = 1;
            props.getAllUserTimeSheet( month, year, limit, page);
        }
    }

    const handlePaginationAllTimeSheetLogs = (page) => {
        let { monthTimeSheetLog } = state;
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.split('-');
            let month = d[0];
            let year = d[1];
            let limit = 15;
            props.getAllUserTimeSheet( month, year, limit, page);
        }
    }

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
                    <button className="btn btn-primary" onClick={getAllUserTimeSheetLogs}>Thống kê</button>
                </div>
            </div>
            <div className="box-body qlcv">
                <table className="table table-hover table-striped table-bordered" id="table-user-timesheetlogs">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>STT</th>
                            <th style={{ width: 180 }}>Họ và tên</th>
                            <th style={{ textAlign: 'center' }}>Số CV thực hiện</th>
                            <th style={{ textAlign: 'center' }}>Số CV phê duyệt</th>
                            <th style={{ textAlign: 'center' }}>Số CV quan sát</th>
                            <th style={{ textAlign: 'center' }}>Số CV tư vấn</th>
                            <th style={{ textAlign: 'center' }}>Tổng số CV</th> 
                            <th style={{ textAlign: 'center' }}>Tổng thời gian bấm giờ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allTimeSheetLogs?.docs?.map((tsl, index) => {
                                if (tsl.active == true)
                                return (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                        <td><a>{tsl.name}</a></td>
                                        <td style={{ textAlign: 'center' }}>{tsl.countResponsibleTasks}</td>
                                        <td style={{ textAlign: 'center' }}>{tsl.countAccountableTasks}</td>
                                        <td style={{ textAlign: 'center' }}>{tsl.countInformedTasks}</td>
                                        <td style={{ textAlign: 'center' }}>{tsl.countConsultedTasks}</td>
                                        <td style={{ textAlign: 'center' }}>{tsl.totalTasks}</td>
                                        <td style={{ textAlign: 'center' }}>{convertTime(tsl.totalDuration)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                <PaginateBar
                    display={allTimeSheetLogs ? allTimeSheetLogs?.docs?.length : 0 }
                    total={allTimeSheetLogs ? allTimeSheetLogs.totalDocs : 0 }
                    pageTotal={allTimeSheetLogs ? allTimeSheetLogs.totalPages : 0}
                    currentPage={allTimeSheetLogs ? allTimeSheetLogs.page : 1 }
                    func={handlePaginationAllTimeSheetLogs}
                />
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
    getAllUserTimeSheet: taskManagementActions.getAllUserTimeSheet,
};

export default connect(mapState, actionCreators)(withTranslate(EmployeeTimeSheetLog));