import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti, ExportExcel } from '../../../../common-components';

import { AnnualLeaveCreateForm, AnnualLeaveEditForm, AnnualLeaveImportForm } from './combinedContent';
import { EmployeeViewForm } from '../../profile/employee-management/components/combinedContent';

import { AnnualLeaveActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';


const AnnualLeaveManagement = (props) => {

    const _tableId = "table-annualLeave-management";
    const defaultConfig = { limit: 5 };
    const _limit = getTableConfiguration(_tableId, defaultConfig).limit;
    let search = window.location.search.split('?')
    let keySearch = 'organizationalUnits';
    let keySearch2 = 'month';
    let _organizationalUnits = null, _month = null;
    let currentPage = 0, pageTotal = 0;

    const [state, setState] = useState({
        tableId: _tableId,
        organizationalUnits: _organizationalUnits,
        employeeNumber: "",
        employeeName: "",
        month: _month,
        status: null,
        page: 0,
        limit: _limit,
    });

    useEffect(() => {
        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                _organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length);
                if (_organizationalUnits !== 'null' && _organizationalUnits.trim() !== '') {
                    _organizationalUnits = _organizationalUnits.split(',')
                } else _organizationalUnits = null
            }
            let index2 = search[n].lastIndexOf(keySearch2);
            if (index2 !== -1) {
                _month = search[n].slice(keySearch2.length + 1, search[n].length);
                if (_month === 'null' && _month.trim() === '') {
                    _month = null
                }
            }
        }
    }, [search]);

    useEffect(() => {
        async function fetchData() {
            await props.searchAnnualLeaves(state);
            await props.getDepartment();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!state.organizationalUnits && props && props.department && props.department.list.length > 0) {
            let childOrganizationalUnit = props.department.list.map(x => x._id);
            setState(state => {
                return {
                    ...state,
                    organizationalUnits: childOrganizationalUnit
                }
            })
        }
    }, [props]);

    /**
     * Function chyển đổi dữ liệu nghỉ phép thành dạng dữ liệu dùng export
     * @param {*} data : dữ liệu nghỉ phép
     */
    const convertDataToExportData = (data) => {
        const { translate, department } = props;
        if (data) {
            data = data.map((x, index) => {
                let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                return {
                    STT: index + 1,
                    employeeNumber: x.employee.employeeNumber,
                    fullName: x.employee.fullName,
                    organizationalUnit: organizationalUnit ? organizationalUnit.name : "",
                    startDate: new Date(x.startDate),
                    endDate: new Date(x.endDate),
                    totalHours: x.totalHours,
                    startTime: x.startTime,
                    endTime: x.endTime,
                    reason: x.reason,
                    status: x.status === "approved" ? translate('human_resource.annual_leave.status.approved') : (x.status === "waiting_for_approval" ? translate('human_resource.annual_leave.status.waiting_for_approval') : translate('human_resource.annual_leave.status.disapproved'))
                };

            })
        }
        let exportData = {
            fileName: translate('human_resource.annual_leave.file_export_name'),
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: translate('human_resource.annual_leave.file_export_name'),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate('human_resource.stt'), width: 7 },
                                { key: "employeeNumber", value: translate('human_resource.staff_number') },
                                { key: "fullName", value: translate('human_resource.staff_name'), width: 20 },
                                { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.profile.start_day') },
                                { key: "startTime", value: translate('human_resource.annual_leave.table.start_date') },
                                { key: "endDate", value: translate('human_resource.profile.end_date') },
                                { key: "endTime", value: translate('human_resource.annual_leave.table.end_date') },
                                { key: "totalHours", value: translate('human_resource.annual_leave.totalHours') },
                                { key: "reason", value: translate('human_resource.annual_leave.table.reason') },
                                { key: "status", value: translate('human_resource.status'), width: 25 },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData
    }

    const { translate, annualLeave, department } = props;

    const { month, limit, page, organizationalUnits, currentRow, currentRowView, importAnnualLeave, tableId } = state;

    const { list } = department;
    let listAnnualLeaves = [], exportData = [];

    pageTotal = ((annualLeave.totalList % limit) === 0) ?
        parseInt(annualLeave.totalList / limit) :
        parseInt((annualLeave.totalList / limit) + 1);
    currentPage = parseInt((page / limit) + 1);

    if (annualLeave.isLoading === false) {
        listAnnualLeaves = annualLeave.listAnnualLeaves;
        exportData = convertDataToExportData(listAnnualLeaves);
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nghỉ phép
     * @param {*} value : Thông tin nghỉ phép
     */
    const handleEdit = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-sabbtical').modal('show');
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

    /** Bắt sự kiện click tạo mới thông tin nghỉ phép */
    const createAnnualLeave = async () => {
        await window.$(`#modal-create-annual-leave`).modal('show');
    }

    /** Bắt sự kiện click import thông tin nghỉ phép */
    const _importAnnualLeave = async () => {
        await setState(state => {
            return {
                ...state,
                importAnnualLeave: true
            }
        });
        window.$(`#modal_import_file`).modal('show');
    }

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
    }

    /** Function lưu giá trị mã nhân viên vào state khi thay đổi */
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
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : array id đơn vị
     */
    const handleUnitChange = (value) => {
        setState(state => {
            return {
                ...state,
                organizationalUnits: value
            }
        })
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
    const handleSubmitSearch = async () => {
        await props.searchAnnualLeaves(state);
    }

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
        props.searchAnnualLeaves({
            ...state,
            limit: parseInt(number)
        });
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trạng hiện tại cần hiện thị
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
        props.searchAnnualLeaves({
            ...state,
            page: parseInt(page),
        });
    }

    return (
        <div className="box" >
            <div className="box-body qlcv">

                <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                    <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.annual_leave.add_annual_leave_title')} >{translate('human_resource.annual_leave.add_annual_leave')}</button>
                    <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                        <li><a style={{ cursor: 'pointer' }} onClick={createAnnualLeave}>{translate('human_resource.salary.add_by_hand')}</a></li>
                        <li><a style={{ cursor: 'pointer' }} onClick={_importAnnualLeave}>{translate('human_resource.salary.add_import')}</a></li>
                    </ul>
                </div>

                <AnnualLeaveCreateForm
                    typeView="admin"
                />
                {importAnnualLeave && <AnnualLeaveImportForm />}
                <ExportExcel id="export-annual_leave" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15, marginTop: 0 }} />

                <div className="form-inline">
                    {/* Đơn vị */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.unit')}</label>
                        <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                            value={organizationalUnits ? organizationalUnits : []}
                            options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                            items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={handleUnitChange}>
                        </SelectMulti>
                    </div>
                    {/* Tháng */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.month')}</label>
                        <DatePicker
                            id="month"
                            dateFormat="month-year"
                            value={formatDate(month ? month : '', true)}
                            onChange={handleMonthChange}
                        />
                    </div>

                </div>

                <div className="form-inline">
                    {/* Mã số nhân viên */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.staff_number')}</label>
                        <input type="text" className="form-control" name="employeeNumber" onChange={handleChange} placeholder={translate('human_resource.staff_number')} autoComplete="off" />
                    </div>
                    {/* Tên nhân viên  */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.staff_name')}</label>
                        <input type="text" className="form-control" name="employeeName" onChange={handleChange} placeholder={translate('human_resource.staff_name')} autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* Trạng thái */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.status')}</label>
                        <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                            options={{ nonSelectedText: translate('human_resource.non_status'), allSelectedText: translate('human_resource.all_status') }}
                            onChange={handleStatusChange}
                            items={[
                                { value: "approved", text: translate('human_resource.annual_leave.status.approved') },
                                { value: "waiting_for_approval", text: translate('human_resource.annual_leave.status.waiting_for_approval') },
                                { value: "disapproved", text: translate('human_resource.annual_leave.status.disapproved') }
                            ]}
                        >
                        </SelectMulti>
                    </div>
                    {/* Nút tìm kiếm */}
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSubmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>

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

                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('human_resource.staff_number')}</th>
                            <th>{translate('human_resource.staff_name')}</th>
                            <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                            <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                            <th>{translate('human_resource.unit')}</th>
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
                            listAnnualLeaves.map((x, index) => {
                                let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                                return (
                                    <tr key={index}>
                                        <td><a style={{ cursor: 'pointer' }} onClick={() => handleView(x.employee)}>{x.employee.employeeNumber}</a></td>
                                        <td>{x.employee.fullName}</td>
                                        <td><p>{formatDate(x.startDate)}</p>{x.startTime ? x.startTime : null}</td>
                                        <td><p>{formatDate(x.endDate)}</p>{x.endTime ? x.endTime : null}</td>
                                        <td>{organizationalUnit ? organizationalUnit.name : null}</td>
                                        <td>{x.reason}</td>
                                        <td style={{ color: x.status === "approved" ? "#28A745" : (x.status === "waiting_for_approval" ? '#ff7f0e' : '#dd4b39') }}>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.annual_leave.edit_annual_leave')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('human_resource.annual_leave.delete_annual_leave')}
                                                data={{
                                                    id: x._id,
                                                    info: formatDate(x.startDate).replace(/-/gi, "/") + " - " + formatDate(x.startDate).replace(/-/gi, "/")
                                                }}
                                                func={props.deleteAnnualLeave}
                                            />
                                        </td>
                                    </tr>)
                            })
                        }
                    </tbody>
                </table>
                {annualLeave.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listAnnualLeaves || listAnnualLeaves.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={pageTotal ? pageTotal : 0}
                    currentPage={currentPage}
                    display={listAnnualLeaves && listAnnualLeaves.length !== 0 && listAnnualLeaves.length}
                    total={annualLeave && annualLeave.totalList}
                    func={setPage} />
            </div>
            {   /* From chỉnh sửa thông tin nghỉ phép */
                currentRow &&
                <AnnualLeaveEditForm
                    _id={currentRow._id}
                    employee={currentRow.employee}
                    employeeNumber={currentRow.employee ? `${currentRow.employee.employeeNumber} - ${currentRow.employee.fullName}` : ''}
                    organizationalUnit={currentRow.organizationalUnit}
                    endDate={formatDate(currentRow.endDate)}
                    startDate={formatDate(currentRow.startDate)}
                    reason={currentRow.reason}
                    endTime={currentRow.endTime}
                    startTime={currentRow.startTime}
                    totalHours={currentRow.totalHours}
                    type={currentRow.type}
                    status={currentRow.status}
                />
            }

            {/* From xem thông tin nhân viên */
                <EmployeeViewForm
                    _id={currentRowView ? currentRowView._id : ""}
                />
            }
        </div >
    );
};

function mapState(state) {
    const { annualLeave, department } = state;
    return { annualLeave, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    deleteAnnualLeave: AnnualLeaveActions.deleteAnnualLeave,
};

const connectedListSabbatical = connect(mapState, actionCreators)(withTranslate(AnnualLeaveManagement));
export { connectedListSabbatical as AnnualLeaveManagement };