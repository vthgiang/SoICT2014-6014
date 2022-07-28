import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { DatePicker, LazyLoadComponent } from '../../../../common-components';
import urgentIcon from '../task-personal-dashboard/warning.png';
import todoIcon from '../task-personal-dashboard/to-do-list.png';

function TaskProcessDashboard(props) {
    const { tasks, translate } = props;

    const { loadingInformed, loadingCreator, loadingConsulted, loadingAccountable, loadingResponsible } = tasks;

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

    let { startMonthTitle, endMonthTitle } = infoSearch;

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
                        <button type="button" className="btn btn-success" onClick={() => { }}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
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

                            <Link to="/task-management" onClick={() => localStorage.setItem('stateFromTaskDashboard', JSON.stringify(
                                {
                                    fromTaskPersonalDashboard: true,
                                    status: ["inprocess"],
                                    startDate: infoSearch.startMonth,
                                    endDate: infoSearch.endMonth,
                                    roles: ["responsible", "accountable", "consulted", "creator", "informed"]
                                }
                            ))} target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">10</span>
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
                            <Link to="/task-management" onClick={() => localStorage.setItem('stateFromTaskDashboard', JSON.stringify(
                                {
                                    fromTaskPersonalDashboard: true,
                                    status: ["inprocess"],
                                    startDate: infoSearch.startMonth,
                                    endDate: infoSearch.endMonth,
                                    roles: ["creator"]
                                }
                            ))} target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">5</span>
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
                                    {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle} {`(2 quy trình)`}</div>
                                <a onClick={() => { }}>
                                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                                </a>
                            </div>
                            <LazyLoadComponent once={true}>
                                {
                                    <div className="qlcv box-body">
                                        <div className="nav-tabs-custom" >
                                            <ul className="general-tabs nav nav-tabs">
                                                <li className="active"><a className="general-task-type" href="#allGeneralTaskUrgent" data-toggle="tab" ><img style={{ width: '18px', height: '18px', marginRight: '5px' }} src={urgentIcon} alt="urgent" />Tổng quan&nbsp;<span>0</span></a></li>
                                                <li><a className="general-task-type" href="#allGeneralTaskTodo" data-toggle="tab" ><img src={todoIcon} alt="todo" style={{ width: '20px', marginRight: '5px' }} />  Đang thực hiện&nbsp;<span>0</span></a></li>
                                                <li><a className="general-task-type" href="#allGeneralTaskOverdue" data-toggle="tab" >Sắp hết hạn&nbsp;<span> 0</span></a></li>
                                                <li><a className="general-task-type" href="#allGeneralTaskDelay" data-toggle="tab" >Trễ tiến độ&nbsp;<span> 0</span></a></li>
                                            </ul>

                                        </div>
                                    </div>
                                }
                            </LazyLoadComponent>
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

};

export default connect(mapState, actionCreators)(withTranslate(TaskProcessDashboard));