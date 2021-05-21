import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
import { EmployeeViewForm } from '../../profile/employee-management/components/combinedContent';
import { AnnualLeaveImportForm, AnnualLeaveCreateForm } from './combinedContent';

import { AnnualLeaveActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function ManageLeaveApplication(props) {
    const _tableId = "manage-leave-applicationn-table";
    const defaultConfig = { limit: 5 }
    const _limit = getTableConfiguration(_tableId, defaultConfig).limit;

    const [state, setState] = useState({
        dataStatus: 0,
        employeeNumber: "",
        employeeName: "",
        status: ['waiting_for_approval'],
        page: 0,
        limit: _limit,
        tableId: _tableId
    })

    useEffect(() => {
        props.getDepartmentsThatUserIsManager();
        props.getDepartment();
        // props.searchAnnualLeaves(state);
    }, [])

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        if (date) {
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
        return date;
    };

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     */
    const formatDate2 = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [year, month, day].join('-');
        }
        return date;
    };

    /**
     *  Bắt sự kiện click xem thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    const handleView = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRowView: value
            }
        });
        window.$(`#modal-view-employee${value._id}`).modal('show');
    }

    /** Function bắt sự kiện thay đổi mã nhân viên, tên nhân viên */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        });
    }

    /**
     * Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value :Tháng tìm kiếm
     */
    const handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        setState(state => {
            return {
                ...state,
                month: value
            }
        });
    }

    /**
     * Function lưu giá trị status vào state khi thay đổi
     * @param {*} value 
     */
    const handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState(state => {
            return {
                ...state,
                status: value
            }
        })
    }

    /** Function bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => {
        await props.searchAnnualLeaves(state);
    }

    useEffect(() => {
        const shouldComponentDidUpdate = () => {
            let departmentsThatUserIsManager = props.department.departmentsThatUserIsManager;
            if (state.dataStatus === 0 && departmentsThatUserIsManager && departmentsThatUserIsManager.length !== 0) {
                departmentsThatUserIsManager = departmentsThatUserIsManager.map(x => x._id);
                props.searchAnnualLeaves({ ...state, organizationalUnits: departmentsThatUserIsManager });
                setState(state => {
                    return {
                        dataStatus: 1,
                        organizationalUnits: departmentsThatUserIsManager,
                    }
                })
            }
        };
        shouldComponentDidUpdate();
    }, [props.department.departmentsThatUserIsManager, state.dataStatus]);

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng hiện thị
     */
    const setLimit = async (number) => {
        await setState(state => {
            return {
                ...state,
                limit: parseInt(number),
            }
        });
        props.searchAnnualLeaves(state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang hiện tại cần hiện thị
     */
    const setPage = async (pageNumber) => {
        let { limit } = state;
        let page = (pageNumber - 1) * limit;
        await setState(state => {
            return {
                ...state,
                page: parseInt(page),
            }
        });
        props.searchAnnualLeaves(state);
    };

    /**
     * Bắt sự kiện chấp nhận đơn xin nghỉ phép
     * @param {*} value : Đơn xin nghỉ phép
     */
    const handleAcceptApplication = (value) => {
        const { translate } = props;
        let startDateNew = formatDate2(value.startDate);
        let endDateNew = formatDate2(value.endDate);

        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('human_resource.work_plan.accept_application')}</div> <div>"${formatDate(value.startDate)} - ${formatDate(value.endDate)}" ?</div></h4>`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: props.translate('general.no'),
            confirmButtonText: props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.updateAnnualLeave(value._id, { ...value, startDate: startDateNew, endDate: endDateNew, status: 'approved', approvedApplication: true })
            }
        })
    };

    /**
     * Bắt sự kiện từ chối đơn xin nghỉ phép
     * @param {*} value : Đơn xin nghỉ
     */
    const handleRefuseApplication = (value) => {
        const { translate } = props;
        let startDateNew = formatDate2(value.startDate);
        let endDateNew = formatDate2(value.endDate);

        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('human_resource.work_plan.refuse_application')}</div> <div>"${formatDate(value.startDate)} - ${formatDate(value.endDate)}" ?</div></h4>`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: props.translate('general.no'),
            confirmButtonText: props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.updateAnnualLeave(value._id, { ...value, startDate: startDateNew, endDate: endDateNew, status: 'disapproved', approvedApplication: true })
            }
        })
    }

    const { translate, annualLeave } = props;
    const { month, status, limit, page, currentRow, currentRowView, tableId } = state;

    let listAnnualLeaves = [];
    if (annualLeave.isLoading === false) {
        listAnnualLeaves = annualLeave.listAnnualLeaves;
    };

    let pageTotal = ((annualLeave.totalList % limit) === 0) ?
        parseInt(annualLeave.totalList / limit) :
        parseInt((annualLeave.totalList / limit) + 1);
    let currentPage = parseInt((page / limit) + 1);

    console.log('annualLeave:', annualLeave)
    return (
        <div className="box" >
            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Mã nhân viên*/}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.staff_number')}</label>
                        <input type="text" className="form-control" name="employeeNumber" onChange={handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                    </div>
                    {/* Tên nhân viên  */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.staff_name')}</label>
                        <input type="text" className="form-control" name="employeeName" onChange={handleChange} placeholder={translate('human_resource.staff_name')} autoComplete="off" />
                    </div>

                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.annual_leave.add_annual_leave_title')} >{translate('human_resource.annual_leave.add_annual_leave')}</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$(`#modal-create-annual-leave`).modal('show')}>{translate('human_resource.salary.add_by_hand')}</a></li>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$(`#modal_import_file`).modal('show')}>{translate('human_resource.salary.add_import')}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* Tháng */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.month')}</label>
                        <DatePicker
                            id="month"
                            dateFormat="month-year"
                            value={formatDate(month, true)}
                            onChange={handleMonthChange}
                        />
                    </div>
                    {/* Trạng thái */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.status')}</label>
                        <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                            options={{ nonSelectedText: translate('human_resource.non_status'), allSelectedText: translate('human_resource.all_status') }}
                            onChange={handleStatusChange}
                            value={status}
                            items={[
                                { value: "approved", text: translate('human_resource.annual_leave.status.approved') },
                                { value: "waiting_for_approval", text: translate('human_resource.annual_leave.status.waiting_for_approval') },
                                { value: "disapproved", text: translate('human_resource.annual_leave.status.disapproved') }
                            ]}
                        >
                        </SelectMulti>
                    </div>
                    {/* Button tìm kiếm */}
                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
                </div>
                <AnnualLeaveCreateForm 
                    typeView="manager"
                />
                <AnnualLeaveImportForm />
                <div className="form-group col-md-12 row" >
                    {(Number(annualLeave.numberWaitForApproval) > 0 || Number(annualLeave.numberApproved) > 0 || Number(annualLeave.numberNotApproved) > 0) &&
                        <React.Fragment>
                            <span>{translate('human_resource.annual_leave.have')}&nbsp;</span>
                            <span style={{ fontWeight: "bold" }}>{`${Number(annualLeave.numberWaitForApproval) + Number(annualLeave.numberApproved) + Number(annualLeave.numberNotApproved)} ${translate('human_resource.annual_leave.leaveOfAbsenceLetter')}`}</span>
                        </React.Fragment>
                    }
                    
                    {
                        Number(annualLeave.numberWaitForApproval) > 0 &&
                        <React.Fragment>
                            <span className="text-warning" style={{ fontWeight: "bold" }}>,&nbsp;{`${annualLeave.numberWaitForApproval} ${translate('human_resource.annual_leave.waiting_for_approval_letter')}`}</span>
                        </React.Fragment>
                    }
                    {
                        Number(annualLeave.numberApproved) > 0 && 
                        <span className="text-success" style={{ fontWeight: "bold" }}>,&nbsp;{`${annualLeave.numberApproved} ${translate('human_resource.annual_leave.approved_letter')}`}</span>
                    }
                    {
                        Number(annualLeave.numberNotApproved) > 0 &&
                        <span className="text-danger" style={{ fontWeight: "bold" }}>,&nbsp;{`${annualLeave.numberNotApproved} ${translate('human_resource.annual_leave.not_approved_letter')}`}</span>
                    }
                    {(Number(annualLeave.numberWaitForApproval) > 0 || Number(annualLeave.numberApproved) > 0 || Number(annualLeave.numberNotApproved) > 0) &&
                        <span>&nbsp;{`${translate('human_resource.annual_leave.this_month')} (${formatDate(Date.now(), true)})`}</span>
                    }
                </div>

                <table className="table table-striped table-bordered table-hover" id={tableId}>
                    <thead>
                        <tr>
                            <th>{translate('human_resource.staff_number')}</th>
                            <th>{translate('human_resource.staff_name')}</th>
                            <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                            <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                            <th>{translate('human_resource.annual_leave.table.reason')}</th>
                            <th>{translate('human_resource.status')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.annual_leave.table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('human_resource.staff_number'),
                                        translate('human_resource.staff_name'),
                                        translate('human_resource.annual_leave.table.start_date'),
                                        translate('human_resource.annual_leave.table.end_date'),
                                        translate('human_resource.unit'),
                                        translate('human_resource.annual_leave.table.reason'),
                                        translate('human_resource.status')
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listAnnualLeaves && listAnnualLeaves.length !== 0 &&
                            listAnnualLeaves.map((x, index) => (
                                <tr key={index}>
                                    <td><a style={{ cursor: 'pointer' }} onClick={() => handleView(x.employee)}>{x.employee.employeeNumber}</a></td>
                                    <td>{x.employee.fullName}</td>
                                    <td><p>{formatDate(x.startDate)}</p>{x.startTime ? x.startTime : null}</td>
                                    <td><p>{formatDate(x.endDate)}</p>{x.endTime ? x.endTime : null}</td>
                                    <td>{x.reason}</td>
                                    <td>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {(x.status === 'waiting_for_approval' || x.status === "disapproved") &&
                                            <a onClick={() => handleAcceptApplication(x)} className="add_circle" style={{ width: '5px' }} title={translate('human_resource.work_plan.accept_application')}><i className="material-icons">check</i></a>}
                                        {(x.status === 'waiting_for_approval' || x.status === "approved") &&
                                            <a onClick={() => handleRefuseApplication(x)} className="delete" style={{ width: '5px' }} title={translate('human_resource.work_plan.refuse_application')}><i className="material-icons">clear</i></a>}
                                    </td>
                                </tr>))
                        }
                    </tbody>
                </table>
                {annualLeave.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listAnnualLeaves || listAnnualLeaves.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
            </div>
            {/* From xem thông tin nhân viên */
                <EmployeeViewForm
                    _id={currentRowView ? currentRowView._id : ""}
                />
            }
        </div >
    );
}
function mapState(state) {
    const { annualLeave, department } = state;
    return { annualLeave, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    updateAnnualLeave: AnnualLeaveActions.updateAnnualLeave,
    getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager,
};

const leaveApplication = connect(mapState, actionCreators)(withTranslate(ManageLeaveApplication));
export { leaveApplication as ManageLeaveApplication };