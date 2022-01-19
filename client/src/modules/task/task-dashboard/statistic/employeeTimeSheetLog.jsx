import React, { Component, Fragment, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { taskManagementActions } from '../../task-management/redux/actions';
import { DatePicker } from '../../../../common-components';
import { convertTime } from '../../../../helpers/stringMethod';
import { PaginateBar, DataTableSetting, ExportExcel } from '../../../../common-components/index';
import NumberFormat from 'react-number-format';

function EmployeeTimeSheetLog(props) {
    const { tasks, translate } = props;
    console.log('tasks', tasks);

    let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
    let endMonth = month < 10 ? '0' + month : '' + month;
    endMonth = [endMonth, year].join('-');

    let monthTimeSheetLog = useRef(endMonth),
        rowLimit = useRef(15),
        page = useRef(1),
        timeLimit = useRef(0);
    let { allTimeSheetLogs } = tasks; // Thống kê bấm giờ

    let dataExport = {
        fileName: `${"Thống kê công việc nhân viên tháng"} ${monthTimeSheetLog.current}`,
        dataSheets: [
            {
                sheetTitle: `${'Thống kê công việc nhân viên tháng'} ${monthTimeSheetLog.current}`,
                sheetName: `${monthTimeSheetLog.current}`,
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
        props.getAllUserTimeSheet(month, year, 15, 1, 0);
    }, [])

    const handleChangeMonthTimeSheetLog = (value) => {
        monthTimeSheetLog.current = value;
    }
    const handleChangeTimeLimit = (value) => {
        timeLimit.current = value.floatValue;
    }

    // Lấy dữ liệu từ theo tháng được chọn
    const getAllUserTimeSheetLogs = () => {
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.current.split('-');
            let month = d[0];
            let year = d[1];
            props.getAllUserTimeSheet( month, year, rowLimit.current, page.current, timeLimit.current);
        }
    }

    // Lấy dữ liệu tại trang được chọn
    const handlePaginationAllTimeSheetLogs = (pageIndex) => {
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.current.split('-');
            let month = d[0];
            let year = d[1];
            page.current = pageIndex
            props.getAllUserTimeSheet( month, year, rowLimit.current, page.current, timeLimit.current);
        }
    }
    
    // Giới hạn số lượng cột, mỗi khi chọn sẽ reset về trang 1
    const setRowLimit = (limitValue) => {
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.current.split('-');
            let month = d[0];
            let year = d[1];
            page.current = 1;
            rowLimit.current = limitValue;
            props.getAllUserTimeSheet( month, year, rowLimit.current, 1, timeLimit.current);
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
                        <label style={{ width: "auto" }} >Tháng</label>
                        <DatePicker
                            id="month-time-sheet-log"
                            dateFormat="month-year"
                            value={monthTimeSheetLog.current}
                            onChange={handleChangeMonthTimeSheetLog}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{'Thời gian tối thiểu'}</label>
                        {/* <input autoComplete="off" className="form-control" type="number" placeholder={translate('task.task_management.search_by_employees')} name="name" /> */}
                        <NumberFormat
                            className="form-control"
                            value={timeLimit.current}
                            displayType={'input'}
                            suffix={' giờ'}
                            onValueChange={handleChangeTimeLimit}
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
                <table className="table table-hover table-striped table-bordered" id="all-time-sheet-logs">
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