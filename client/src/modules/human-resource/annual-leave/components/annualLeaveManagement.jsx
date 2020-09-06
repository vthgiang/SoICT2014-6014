import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti, ExportExcel } from '../../../../common-components';

import { AnnualLeaveCreateForm, AnnualLeaveEditForm } from './combinedContent';

import { AnnualLeaveActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';


class AnnualLeaveManagement extends Component {
    constructor(props) {
        super(props);
        let search = window.location.search.split('?')
        let keySearch = 'organizationalUnits';
        let keySearch2 = 'month';
        let organizationalUnits = null, month = null;

        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length);
                if (organizationalUnits !== 'null' && organizationalUnits.trim() !== '') {
                    organizationalUnits = organizationalUnits.split(',')
                } else organizationalUnits = null
            }
            let index2 = search[n].lastIndexOf(keySearch2);
            if (index2 !== -1) {
                month = search[n].slice(keySearch2.length + 1, search[n].length);
                if (month === 'null' && month.trim() === '') {
                    month = null
                }
            }
        }

        this.state = {
            organizationalUnits: organizationalUnits,
            employeeNumber: "",
            month: month,
            status: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchAnnualLeaves(this.state);
        this.props.getDepartment();
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nghỉ phép
     * @param {*} value : Thông tin nghỉ phép
     */
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-sabbtical').modal('show');
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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
    handleMSNVChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /**
     * Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value :Tháng tìm kiếm
     */
    handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            month: value
        });
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : array id đơn vị
     */
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    }

    /**
     * Function lưu giá trị status vào state khi thay đổi
     * @param {*} value 
     */
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            status: value
        })
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        // let { month } = this.state;
        // if (month) {
        //     let partMonth = this.formatDate(Date.now(), true).split('-');
        //     let month = [partMonth[1], partMonth[0]].join('-');
        //     await this.setState({
        //         ...this.state,
        //         month: month
        //     })
        // } else {
        //     await this.setState({
        //         ...this.state,
        //         month: month
        //     })
        // }
        this.props.searchAnnualLeaves(this.state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng hiện thị
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchAnnualLeaves(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trạng hiện tại cần hiện thị
     */
    setPage = async (pageNumber) => {
        let { limit } = this.state;
        let page = (pageNumber - 1) * limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchAnnualLeaves(this.state);
    }

    /**
     * Function chyển đổi dữ liệu nghỉ phép thành dạng dữ liệu dùng export
     * @param {*} data : dữ liệu nghỉ phép
     */
    convertDataToExportData = (data) => {
        const { translate, department } = this.props;
        if (data) {
            data = data.map((x, index) => {
                let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                return {
                    STT: index + 1,
                    employeeNumber: x.employee.employeeNumber,
                    fullName: x.employee.fullName,
                    organizationalUnit: organizationalUnit ? organizationalUnit.name : null,
                    startDate: new Date(x.startDate),
                    endDate: new Date(x.endDate),
                    reason: x.reason,
                    status: x.status === "pass" ? "Đã chấp nhận" : (x.status === "process" ? "Chờ phê duyệt" : "Không cấp nhận")
                };

            })
        }
        let exportData = {
            fileName: "Bảng thống kê nghỉ phép",
            dataSheets: [
                {
                    sheetName: "sheet1",
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "organizationalUnit", value: "Phòng ban" },
                                { key: "startDate", value: "Ngày bắt đầu" },
                                { key: "endDate", value: "Ngày kết thúc" },
                                { key: "reason", value: "Lý do" },
                                { key: "status", value: "Trạng thái" },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData
    }

    render() {
        const { translate, annualLeave, department } = this.props;

        const { month, limit, page, currentRow } = this.state;

        const { list } = department;
        let listAnnualLeaves = [], exportData = [];

        if (annualLeave.isLoading === false) {
            listAnnualLeaves = annualLeave.listAnnualLeaves;
            exportData = this.convertDataToExportData(listAnnualLeaves);
        }

        let pageTotal = ((annualLeave.totalList % limit) === 0) ?
            parseInt(annualLeave.totalList / limit) :
            parseInt((annualLeave.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <AnnualLeaveCreateForm />
                    <ExportExcel id="export-annual_leave" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15, marginTop: 2 }} />
                    <div className="form-inline">
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        {/* Mã số nhân viên */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleMSNVChange} placeholder={translate('human_resource.staff_number')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(month, true)}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                        {/* Trạng thái */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_status'), allSelectedText: translate('human_resource.all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "pass", text: translate('human_resource.annual_leave.status.pass') },
                                    { value: "process", text: translate('human_resource.annual_leave.status.process') },
                                    { value: "faile", text: translate('human_resource.annual_leave.status.faile') }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        {/* Button tìm kiếm */}
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                    </div>
                    <table id="sabbatical-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('human_resource.staff_number')}</th>
                                <th style={{ width: "14%" }}>{translate('human_resource.staff_name')}</th>
                                <th style={{ width: "9%" }}>{translate('human_resource.annual_leave.table.start_date')}</th>
                                <th style={{ width: "9%" }}>{translate('human_resource.annual_leave.table.end_date')}</th>
                                <th style={{ width: "12%" }}>{translate('human_resource.unit')}</th>
                                <th>{translate('human_resource.annual_leave.table.reason')}</th>
                                <th style={{ width: "11%" }}>{translate('human_resource.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.annual_leave.table.action')}
                                    <DataTableSetting
                                        tableId="sabbatical-table"
                                        columnArr={[
                                            translate('human_resource.staff_number'),
                                            translate('human_resource.staff_name'),
                                            translate('human_resource.annual_leave.table.start_date'),
                                            translate('human_resource.annual_leave.table.end_date'),
                                            translate('human_resource.unit'),
                                            translate('human_resource.annual_leave.table.reason'),
                                            translate('human_resource.status')
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
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
                                            <td>{x.employee.employeeNumber}</td>
                                            <td>{x.employee.fullName}</td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
                                            <td>{organizationalUnit ? organizationalUnit.name : null}</td>
                                            <td>{x.reason}</td>
                                            <td>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.annual_leave.delete_annual_leave')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('human_resource.annual_leave.delete_annual_leave')}
                                                    data={{
                                                        id: x._id,
                                                        info: this.formatDate(x.startDate).replace(/-/gi, "/") + " - " + this.formatDate(x.startDate).replace(/-/gi, "/")
                                                    }}
                                                    func={this.props.deleteAnnualLeave}
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
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>
                {
                    currentRow &&
                    <AnnualLeaveEditForm
                        _id={currentRow._id}
                        employeeNumber={currentRow.employee ? `${currentRow.employee.employeeNumber} - ${currentRow.employee.fullName}` : 'Deleted'}
                        organizationalUnit={currentRow.organizationalUnit}
                        endDate={this.formatDate(currentRow.endDate)}
                        startDate={this.formatDate(currentRow.startDate)}
                        reason={currentRow.reason}
                        status={currentRow.status}
                    />
                }
            </div >
        );
    }
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