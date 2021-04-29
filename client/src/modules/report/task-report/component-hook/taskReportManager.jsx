import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import Swal from 'sweetalert2';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { ButtonModal } from '../../../../common-components';
import { DataTableSetting, PaginateBar, DatePicker, SelectMulti } from '../../../../common-components';
import { TaskReportActions } from '../redux/actions';
import { TaskReportCreateForm } from './taskReportCreateForm';
import { TaskReportEditForm } from './taskReportEditForm';
import { TaskReportDetailForm } from './taskReportDetailForm';
import './transferList.css';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function TaskReportManager(props) {
    const tableId = "task-report-management-table";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        limit: limit,
        page: 0,
        name: '',
        month: null,
        currentRole: localStorage.getItem("userId"),
        tableId
    })

    const { reports, translate, user } = props;
    const {  page, currentEditRow, currentViewRow } = state;

    useEffect(() => {
        props.getTaskReports(state);
        props.getDepartment();
    }, [])

    /**
     * Bắt sự kiện click nút Edit
     * @param {*} report 
     */
    const handleEdit = async (idReport) => {
        await setState({
            ...state,
            currentEditRow: idReport
        });
        await window.$('#modal-edit-report').modal('show'); // hiển thị modal edit
    }

    /**
     * Hàm xóa báo cáo
     * @param {*} id  của báo cáo muốn xóa
     * @param {*} name tên báo cáo muốn xóa
     */
    const handleDelete = async (id, name) => {
        const { translate } = props;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('report_manager.delete')} </div> <div> "${name}" ?</div></h4>`,
            type: 'success',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: translate('report_manager.cancel'),
            confirmButtonColor: '#3085d6',
            confirmButtonText: translate('report_manager.confirm')
        }).then((res) => {
            if (res.value) {
                props.deleteTaskReport(id);
            }
        });
    }


    /**
     * Hàm  bắt sự kiện khi ấn enter để lưu
     * @param {*} event 
     */
    const handleEnterLimitSetting = (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            props.getTaskReports();
        }
    }


    /**
     * Bắt sự kiện thay đổi khi gõ vào ô input search
     * @param {*} e 
     */
    const handleChangeInput = (e) => {
        const { value } = e.target;
        const { name } = e.target;

        setState({
            ...state,
            [name]: value,
        })
    }

    /**
     * Bắt sự kiện tìm kiếm theo người tạo
     * @param {*} e 
     */
    const handleChangeCreator = (e) => {
        const { value } = e.target;

        setState({
            ...state,
            creator: value,
        })
    }

    // Bắt sự kiện khi click nút tìm kiếm
    const search = async () => {
        if (state.month === null) {
            let partMonth = formatDate(Date.now(), true).split('-');
            let month = [partMonth[1], partMonth[0]].join('-');
            await setState({
                ...state,
                month: month
            })
        } else if (state.month === "-") {
            await setState({
                ...state,
                month: ""
            })
        }
        await props.getTaskReports(state);
    }

    /**
     *  Bắt sự kiện chuyển trang
     * @param {*} pageNumber 
     */
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (state.limit);

        await setState({
            page: parseInt(page),
        });
        props.getTaskReports(state);
    }

    const handleView = async (taskReportId) => {
        await setState({
            ...state,
            currentViewRow: taskReportId
        })
        await window.$('#modal-detail-taskreport').modal('show');
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number 
     */
    const setLimit = async (number) => {
        await setState({
            limit: parseInt(number),
        });
        props.getTaskReports(state);
    }

    const checkPermissonCreator = (creator) => {
        const { currentRole } = state;
        if (currentRole === creator.toString()) {
            return true;
        }
        return false;
    }


    const checkPermissonManager = (manager) => {
        let currentRole = localStorage.getItem("currentRole");
        for (let x in manager) {
            if (currentRole === manager[x]) {
                return true;
            }
        }
        return false;
    }

    function formatDate(date, monthYear = false) {
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

    /**
     * Hàm bắt sự kiện thay đổi ô tìm kiếm theo tháng
     * @param {*} value 
     */
    const handleMonthChange = (value) => {
        let partMonth = value.split('-');
        value = [partMonth[1], partMonth[0]].join('-');
        setState({
            ...state,
            month: value
        });
    }

    /**
     * Hàm bắt sự kiện thay đổi tìm kiếm theo đơn vị
     * @param {*} value 
     */
    const handleSelectOrganizationalUnit = (value) => {
        setState({
            ...state,
            organizationalUnit: value,
        })
    }

    let pageTotal = (reports.totalList % limit === 0) ?
        parseInt(reports.totalList / limit) :
        parseInt((reports.totalList / limit) + 1);
    let cr_page = parseInt((page / limit) + 1);
    let units;

    if (user.organizationalUnitsOfUser) {
        units = user.organizationalUnitsOfUser;
    }


    return (
        <div className="box">
            <div className="box-body qlcv" >
                {
                    currentEditRow && <TaskReportEditForm taskReportId={currentEditRow} />
                }

                {/* Thêm mới bao cáo */}
                <div style={{ height: '40px' }}>
                    <ButtonModal modalID="modal-create-task-report" button_name={translate('report_manager.add_report')} title={translate('report_manager.add_report')} />
                </div>

                <TaskReportCreateForm />

                {
                    currentViewRow && <TaskReportDetailForm taskReportId={currentViewRow} />
                }

                {/* search form */}
                <div className="form-inline" style={{ marginBottom: '2px' }}>
                    <div className="form-group unitSearch">
                        <label>{translate('task.task_management.department')}</label>
                        {units &&
                            <SelectMulti id="multiSelectUnit1"
                                defaultValue={units.map(item => { return item._id })}
                                items={units.map(item => { return { value: item._id, text: item.name } })}
                                onChange={handleSelectOrganizationalUnit}
                                options={{
                                    nonSelectedText: translate('task.task_management.select_department'),
                                    allSelectedText: translate(`task.task_management.select_all_department`),
                                }}>
                            </SelectMulti>
                        }
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('report_manager.creator')}</label>
                        <input className="form-control" type="text" onKeyUp={handleEnterLimitSetting} name="creator" onChange={handleChangeCreator} placeholder={translate('report_manager.search_by_creator')} />
                    </div>
                </div>

                <div className="form-inline" style={{ marginBottom: 10 }}>
                    <div className="form-group">
                        <label className="form-control-static">{translate('report_manager.name')}</label>
                        <input className="form-control" type="text" onKeyUp={handleEnterLimitSetting} name="name" onChange={handleChangeInput} placeholder={translate('report_manager.search_by_name')} />
                    </div>

                    <div className="form-group">
                        <label className="form-control-static">Tháng</label>
                        <DatePicker
                            id="month"
                            dateFormat="month-year"
                            value={formatDate(Date.now(), true)}
                            onChange={handleMonthChange}
                        />
                    </div>

                </div>

                <div className="form-inline">
                    <div className="form-group" >
                        <label></label>
                        <button type="button" className="btn btn-success" onClick={search} title={translate('form.search')}>{translate('form.search')}</button>
                    </div>
                </div>

                <DataTableSetting
                    tableId={tableId}
                    columnArr={[
                        translate('report_manager.name'),
                        translate('report_manager.description'),
                        translate('report_manager.creator'),
                    ]}
                    setLimit={setLimit}
                />

                {/* table hiển thị danh sách báo cáo công việc */}
                <table className="table table-hover table-striped table-bordered" id={tableId}>
                    <thead>
                        <tr>
                            <th>{translate('report_manager.name')}</th>
                            <th>{translate('report_manager.description')}</th>
                            <th>{translate('report_manager.creator')}</th>
                            <th>{translate('report_manager.createdAt')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('table.action')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (reports && reports.listTaskReport && reports.listTaskReport.length > 0) ? reports.listTaskReport.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name} </td>
                                    <td>{item.description}</td>
                                    <td>{(item.creator && item.creator.length > 0) ? item.creator.map(o => o.name) : null}</td>
                                    <td>{item.createdAt.slice(0, 10)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a onClick={() => handleView(item._id)}><i className="material-icons">visibility</i></a>

                                        {/* Check nếu là người tạo thì có thể sửa, xóa báo cáo */}
                                        {
                                            (checkPermissonManager(item.organizationalUnit.managers) || checkPermissonCreator(item.creator && item.creator.length > 0 && item.creator.map(o => o._id))) &&
                                            <React.Fragment>
                                                <a onClick={() => handleEdit(item._id)} className="edit text-yellow" style={{ width: '5px' }} title={translate('report_manager.edit')}><i className="material-icons">edit</i></a>
                                                <a onClick={() => handleDelete(item._id, item.name)} className="delete" title={translate('report_manager.title_delete')}>
                                                    <i className="material-icons">delete</i>
                                                </a>
                                            </React.Fragment>
                                        }
                                    </td>
                                </tr>
                            )) : null
                        }
                    </tbody>
                </table>
                {reports.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    reports.listTaskReport && reports.listTaskReport.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}

                <PaginateBar pageTotal={pageTotal ? pageTotal : ""} currentPage={cr_page} func={setPage} />
            </div>
        </div>
    );
}

function mapState(state) {
    const { user, reports } = state;
    return { user, reports };
}
const actionCreators = {
    getTaskReports: TaskReportActions.getTaskReports,
    deleteTaskReport: TaskReportActions.deleteTaskReport,
    getDepartment: UserActions.getDepartmentOfUser,
}

export default connect(mapState, actionCreators)(withTranslate(TaskReportManager));