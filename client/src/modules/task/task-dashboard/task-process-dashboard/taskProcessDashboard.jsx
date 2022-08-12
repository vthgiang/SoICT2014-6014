import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { DatePicker, LazyLoadComponent } from '../../../../common-components';
import urgentIcon from '../task-personal-dashboard/warning.png';
import todoIcon from '../task-personal-dashboard/to-do-list.png';
import GeneralTaskProcessChart from "./generalProcessChart"
import { TaskProcessActions } from '../../task-process/redux/actions';
import { getStorage } from '../../../../config';
import { TaskHasTaskOutputs } from './taskHasTaskOutputs';
import { TaskHasDepartments } from './taskHasDepartments';


const getTaskProcessManagement = (listTaskProcess, userId) => {
    let numberTaskProcessManagement = 0
    if (listTaskProcess && listTaskProcess.length) {
        const listTaskProcessManagement = listTaskProcess?.map((item) => {
            if (item.manager?.length) {
                const manager = item.manager.find((user) => user.id === userId);
                if (manager) {
                    numberTaskProcessManagement = numberTaskProcessManagement + 1;
                }
            }
        })
    }
    return numberTaskProcessManagement;
}

function TaskProcessDashboard(props) {
    const { tasks, taskProcess, translate } = props;
    const { listTaskProcess } = taskProcess;
    const userId = getStorage("userId");
    const [state, setState] = useState(initState())
    const [infoSearch, setInfoSearch] = useState(initInfoSearch())
    function initState() {

        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
        let startMonth, endMonth, startYear;

        if (month > 3) {
            startMonth = month - 3;
            startYear = year;
        } else {
            startMonth = month - 3 + 12;
            startYear = year - 1;
        }
        if (startMonth < 10)
            startMonth = '0' + startMonth;
        if (month < 10) {
            endMonth = '0' + month;
        } else {
            endMonth = month;
        }

        const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        const INFO_SEARCH = {
            startMonth: [startYear, startMonth].join('-'),
            endMonth: [year, endMonth].join('-'),

            startMonthTitle: [startMonth, startYear].join('-'),
            endMonthTitle: [endMonth, year].join('-'),
        }

        const SEARCH_FOR_WEIGHT_TASK = {
            taskStartMonth: [startYear, startMonth].join('-'),
            taskEndMonth: [year, endMonth].join('-'),

            startMonthTitle: [startMonth, startYear].join('-'),
            endMonthTitle: [endMonth, year].join('-'),
        }

        return {
            userID: "",

            dataStatus: DATA_STATUS.NOT_AVAILABLE,

            startMonth: INFO_SEARCH.startMonth,
            endMonth: INFO_SEARCH.endMonth,

            startMonthTitle: INFO_SEARCH.startMonthTitle,
            endMonthTitle: INFO_SEARCH.endMonthTitle,
            type: 'status',
            monthTimeSheetLog: INFO_SEARCH.endMonthTitle,
        }
    }

    function initInfoSearch() {
        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
        let startMonth, endMonth, startYear;

        if (month > 3) {
            startMonth = month - 3;
            startYear = year;
        } else {
            startMonth = month - 3 + 12;
            startYear = year - 1;
        }
        if (startMonth < 10)
            startMonth = '0' + startMonth;
        if (month < 10) {
            endMonth = '0' + month;
        } else {
            endMonth = month;
        }

        return {
            startMonth: [startYear, startMonth].join('-'),
            endMonth: [year, endMonth].join('-'),

            startMonthTitle: [startMonth, startYear].join('-'),
            endMonthTitle: [endMonth, year].join('-'),
        }
    }

    const formatMonth = (value) => {
        let monthTitle = value.slice(5, 7) + '-' + value.slice(0, 4);
        return monthTitle
    }

    const handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setInfoSearch({
            ...infoSearch,
            startMonth: month,
        })
    }

    const handleSelectMonthEnd = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setInfoSearch({
            ...infoSearch,
            endMonth: month,
        })
    }

    let { startMonthTitle, endMonthTitle, startMonth, endMonth } = infoSearch;

    useEffect(() => {
        props.getAllTaskProcess(undefined, undefined, undefined, startMonth, endMonth)
    }, [])

    return (
        <React.Fragment>
            <div className="qlcv" style={{ textAlign: "left" }}>
                {/**Chọn ngày bắt đầu */}
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('task.task_management.from')}</label>
                        <DatePicker
                            id="monthStartInTaskDashBoard"
                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                            value={startMonthTitle}                 // giá trị mặc định cho datePicker    
                            onChange={handleSelectMonthStart}
                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                        />
                    </div>

                    {/**Chọn ngày kết thúc */}
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('task.task_management.to')}</label>
                        <DatePicker
                            id="monthEndInTaskDashBoard"
                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                            value={endMonthTitle}                 // giá trị mặc định cho datePicker    
                            onChange={handleSelectMonthEnd}
                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                        />
                    </div>

                    {/**button tìm kiếm data để vẽ biểu đồ */}
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={() => { props.getAllTaskProcess(undefined, undefined, undefined, startMonth, endMonth) }}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </div>
                </div>
                <div className="row statistical-wrapper" style={{ marginTop: '5px' }}>
                    <div className="col-md-2 col-sm-4 col-xs-4 statistical-item">
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                                    list_alt
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Quy trình tham gia</span>
                            </div>

                            <Link to="/task-process-management" target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">{taskProcess?.listTaskProcess?.length}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" >
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', color: "#f13c3c" }} className="material-icons">
                                    person
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Quy trình quản lý</span>
                            </div>
                            <Link to="/task-process-management" target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">{getTaskProcessManagement(listTaskProcess, userId)}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">
                                    {`Tổng quan quy trình `}
                                    {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle} {`(${taskProcess.listTaskProcess?.length ?? 0} quy trình)`}</div>
                                <a onClick={() => { }}>
                                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                                </a>
                            </div>
                            <LazyLoadComponent once={true}>
                                <GeneralTaskProcessChart />
                            </LazyLoadComponent>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Tổng quan công việc trong quy trình {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}</div>
                            </div>
                            <div className="box-body qlcv">
                                <LazyLoadComponent once={true}>
                                    <TaskHasTaskOutputs
                                        startMonth={state.startMonth}
                                        endMonth={state.endMonth}
                                    />
                                </LazyLoadComponent>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Quy trình công việc {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}</div>
                            </div>
                            <div className="box-body qlcv">
                                <LazyLoadComponent once={true}>
                                    <TaskHasDepartments
                                        startMonth={state.startMonth}
                                        endMonth={state.endMonth}
                                    />
                                </LazyLoadComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


function mapState(state) {
    const { tasks, taskProcess } = state;
    return { tasks, taskProcess };
}
const actionCreators = {
    getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
};

export default connect(mapState, actionCreators)(withTranslate(TaskProcessDashboard));