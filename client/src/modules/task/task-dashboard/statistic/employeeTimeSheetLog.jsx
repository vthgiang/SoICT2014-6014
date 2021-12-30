import React, { Component, Fragment, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { taskManagementActions } from '../../task-management/redux/actions';
import { DatePicker } from '../../../../common-components';
import { convertTime } from '../../../../helpers/stringMethod';
import { PaginateBar, DataTableSetting, ExportExcel } from '../../../../common-components/index';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function EmployeeTimeSheetLog(props) {

    console.log("__render");
    const { tasks, translate } = props;

    const [state, setState] = useState(initState())
    function initState() {
        const defaultConfig = { limit: 15 }
        const allTimeSheetLogsId = "all-time-sheet-logs"
        const perPage = getTableConfiguration(allTimeSheetLogsId, defaultConfig).limit;
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
            limit: perPage,
            page: 1,
        }
        
    }

    let { monthTimeSheetLog, limit, page } = state;
    let { allTimeSheetLogs } = tasks; // Thống kê bấm giờ

    let dataExport = {
        fileName: `${"Thống kê công việc nhân viên"} ${state.monthTimeSheetLog}`,
        dataSheets: [
            {
                sheetTitle: `${'Thống kê công việc nhân viên'} ${state.monthTimeSheetLog}`,
                sheetName: `${'Thống kê công việc nhân viên'}`,
                sheetTitleWidth: 11,
                tables: [
                    {
                        columns: [
                            {key: 'STT', value: 'STT', width: 7},
                            {key: 'name', value: 'Họ và tên', width: 30, horizontal:'left'},
                            {key: 'countResponsibleTasks', value: 'Số CV thực hiện', width: 15},
                            {key: 'countAccountableTasks', value: 'Số CV phê duyệt', width: 15},
                            {key: 'countInformedTasks', value: 'Số CV quan sát', width: 15},
                            {key: 'countConsultedTasks', value: 'Số CV tư vấn', width: 15},
                            {key: 'totalTasks', value: 'Tổng số CV', width: 15},
                            {key: 'totalDuration_1', value: 'Bấm giờ', width: 15},
                            {key: 'totalDuration_2', value: 'Bấm hẹn giờ', width: 15},
                            {key: 'totalDuration_3', value: 'Bấm bù giờ', width: 15},
                            {key: 'totalDuration', value: 'Tổng thời gian', width: 15},
                        ],
                        data: allTimeSheetLogs?.docs?.map((tsl, index) => ({
                            STT: index + 1,
                            name: tsl.name ? tsl.name : '...',
                            countResponsibleTasks: tsl.countResponsibleTasks,
                            countAccountableTasks: tsl.countAccountableTasks,
                            countInformedTasks: tsl.countInformedTasks,
                            countConsultedTasks: tsl.countConsultedTasks,
                            totalTasks: tsl.totalTasks,
                            totalDuration_1: convertTime(tsl.totalDuration[1]),
                            totalDuration_2: convertTime(tsl.totalDuration[2]),
                            totalDuration_3: convertTime(tsl.totalDuration[3]),
                            totalDuration: convertTime(tsl.totalDuration[1] + tsl.totalDuration[2] + tsl.totalDuration[3])
                        }))
                    }
                ]
            }
        ]
    }

    useEffect(() => {
        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
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
            props.getAllUserTimeSheet( month, year, limit, page);
        }
    }

    const handlePaginationAllTimeSheetLogs = (page) => {
        let { monthTimeSheetLog } = state;
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.split('-');
            let month = d[0];
            let year = d[1];
            setState({
                ...state,
                page: page
            })
            props.getAllUserTimeSheet( month, year, limit, page);
        }
    }
    
    const setRowLimit = (limit) => {
        let { monthTimeSheetLog } = state;
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.split('-');
            let month = d[0];
            let year = d[1];
            setState({
                ...state,
                page: 1,
                limit: limit
            })
            props.getAllUserTimeSheet( month, year, limit, 1);
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
                    <ExportExcel 
                        id="export-excel" 
                        style={{right: 0}} 
                        exportData={dataExport}
                    />
                </div>
            </div>
            <div className="box-body qlcv">
                <DataTableSetting
                    tableId={"all-time-sheet-logs"}
                    setLimit={setRowLimit}
                />
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
                            <th style={{ textAlign: 'center' }}>Bấm giờ</th>
                            <th style={{ textAlign: 'center' }}>Bấm hẹn giờ</th>
                            <th style={{ textAlign: 'center' }}>Bấm bù giờ</th>
                            <th style={{ textAlign: 'center' }}>Tổng thời gian</th>
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
                                        <td style={{ textAlign: 'center' }}>{convertTime(tsl.totalDuration[1])}</td>
                                        <td style={{ textAlign: 'center' }}>{convertTime(tsl.totalDuration[2])}</td>
                                        <td style={{ textAlign: 'center' }}>{convertTime(tsl.totalDuration[3])}</td>
                                        <td style={{ textAlign: 'center' }} className="col-sort">
                                            {convertTime(tsl.totalDuration[1] + tsl.totalDuration[2] + tsl.totalDuration[3] )}
                                        </td>
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