import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker, SelectMulti, SlimScroll, ExportExcel } from '../../../../common-components';

import { TimesheetsImportForm, TimesheetsCreateForm, TimesheetsEditForm } from './combinedContent';

import { TimesheetsActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

import './timesheet.css';

class TimesheetsManagement extends Component {
    constructor(props) {
        super(props);

        let allDayOfMonth = this.getAllDayOfMonth(this.formatDate(Date.now(), true));
        let dateNow = new Date();
        let dayNow = dateNow.getDate();

        this.state = {
            allDayOfMonth: allDayOfMonth,
            dayNow: dayNow,
            month: this.formatDate(Date.now(), true),
            employeeNumber: "",
            organizationalUnit: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        const { month } = this.state;

        let monthSearch = month;
        if (month) {
            let partMonth = this.state.month.split('-');
            monthSearch = [partMonth[1], partMonth[0]].join('-');
        }

        this.props.getDepartment();
        this.props.searchTimesheets({ ...this.state, month: monthSearch });
    }

    /** Function bắt sự kiện thêm thông tin chấm công */
    createTimesheets = () => {
        window.$('#modal-create-timesheets').modal('show');
    }

    /** Function bắt sự kiện import thông tin chấm công */
    handleImport = () => {
        window.$('#modal_import_file').modal('show');
    }

    /** Function bắt sự kiện chỉnh sửa thông tin chấm công */
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentRow: value
        })
        window.$('#modal-edit-timesheets').modal('show');
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

    /**
     * Function lấy danh sách các ngày trong tháng
     * @param {*} month : Tháng
     */
    getAllDayOfMonth = (month) => {
        let partMonth = month.split('-');
        let lastDayOfmonth = new Date(partMonth[1], partMonth[0], 0);
        let arrayDay = [], days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 1; i <= lastDayOfmonth.getDate(); i++) {
            let day = i;
            if (i.toString().length < 2)
                day = '0' + i;
            let date = new Date([partMonth[1], partMonth[0], day]);
            arrayDay = [...arrayDay, { day: days[date.getDay()], date: date.getDate() }]
        }
        return arrayDay
    }


    /** Function lưu giá trị mã nhân viên vào state khi thay đổi */
    handleMSNVChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });

    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id đơn vị
     */
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnit: value
        })
    }

    /**
     * Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value : Tháng
     */
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { month } = this.state;
        let allDayOfMonth = this.getAllDayOfMonth(month);
        let dateNow = new Date(), dayNow = dateNow.getDate();
        let partMonth = month.split('-');
        if (this.formatDate(new Date(partMonth[1], partMonth[0], 0), true) !== this.formatDate(dateNow, true)) {
            dayNow = 31;
        }
        this.setState({
            allDayOfMonth: allDayOfMonth,
            dayNow: dayNow
        })

        let monthNew = [partMonth[1], partMonth[0]].join('-');
        this.props.searchTimesheets({ ...this.state, month: monthNew });
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng 
     */
    setLimit = async (number) => {
        const { month } = this.state;
        await this.setState({
            limit: parseInt(number),
        });

        let monthSearch = month;
        if (month) {
            let partMonth = this.state.month.split('-');
            monthSearch = [partMonth[1], partMonth[0]].join('-');
        }

        this.props.searchTimesheets({ ...this.state, month: monthSearch });
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber :  Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        const { month, limit } = this.state;
        let page = (pageNumber - 1) * (limit);
        await this.setState({
            page: parseInt(page),
        });
        let monthSearch = month;
        if (month) {
            let partMonth = month.split('-');
            monthSearch = [partMonth[1], partMonth[0]].join('-');
        }
        this.props.searchTimesheets({ ...this.state, month: monthSearch });
    }

    /**
     * Function chyển đổi dữ liệu chấm công thành dạng dữ liệu dùng export
     * @param {*} data : Dữ liệu chấm công
     */
    convertDataToExportData = (data) => {
        const { translate } = this.props;
        let dataExport = [];
        data.map((x, index) => {
            let total = 0;
            let shifts1 = x.workSession1;
            let shifts2 = x.workSession2;
            let colShifts1 = {}, colShifts2 = {};
            shifts1.forEach((y, key) => {
                if (y === true) {
                    colShifts1 = { ...colShifts1, [`date${key + 1}`]: 'X' };
                    total += 1;
                } else {
                    colShifts1 = { ...colShifts1, [`date${key + 1}`]: '' }
                }
            })
            shifts2.forEach((y, key) => {
                if (y === true) {
                    colShifts2 = { ...colShifts2, [`date${key + 1}`]: 'X' };
                    total += 1;
                } else {
                    colShifts2 = { ...colShifts2, [`date${key + 1}`]: '' }
                }
            })

            let row = [
                {
                    merges: { STT: 2, employeeNumber: 2, fullName: 2, total: 2 },
                    STT: index + 1,
                    fullName: x.employee ? x.employee.fullName : "",
                    employeeNumber: x.employee ? x.employee.employeeNumber : "",
                    space: translate('human_resource.timesheets.shifts1'),
                    ...colShifts1,
                    total: total / 2,
                }, {
                    STT: "",
                    fullName: "",
                    employeeNumber: "",
                    space: translate('human_resource.timesheets.shifts2'),
                    ...colShifts2,
                    total: "",
                },
            ]
            dataExport = dataExport.concat(row);
        });


        let addColumns = [];
        for (let n = 1; n <= 31; n++) {
            addColumns = [...addColumns, { key: `date${n}`, value: n, width: 4 }]
        }
        let exportData = {
            fileName: translate('human_resource.timesheets.file_name_export'),
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    sheetTitle: translate('human_resource.timesheets.file_name_export'),
                    tables: [
                        {
                            merges: [{
                                key: "other",
                                columnName: translate('human_resource.timesheets.date_of_month'),
                                keyMerge: 'date1',
                                colspan: 31
                            }],
                            rowHeader: 2,
                            columns: [
                                { key: "STT", value: translate('human_resource.stt'), width: 7 },
                                { key: "employeeNumber", value: translate('human_resource.staff_number') },
                                { key: "fullName", value: translate('human_resource.staff_name'), width: 20 },
                                { key: "space", value: "", width: '10' },
                                ...addColumns,
                                { key: "total", value: translate('human_resource.timesheets.total_timesheets') },
                            ],
                            data: dataExport
                        }
                    ]
                },
            ]
        }
        return exportData
    }


    render() {
        const { translate, timesheets, department } = this.props;

        const { month, limit, page, allDayOfMonth, dayNow, organizationalUnit, currentRow } = this.state;

        let listTimesheets = [], exportData = [];
        if (timesheets.isLoading === false) {
            listTimesheets = timesheets.listTimesheets;
            exportData = this.convertDataToExportData(listTimesheets);
        }

        let pageTotal = (timesheets.totalList % limit === 0) ?
            parseInt(timesheets.totalList / limit) :
            parseInt((timesheets.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Button chấm công */}
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true" >{translate('human_resource.timesheets.add_timesheets')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }} >
                                <li><a style={{ cursor: 'pointer' }} title={translate('human_resource.add_data_by_excel')} onClick={this.handleImport}>{translate('human_resource.timesheets.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} title={translate('human_resource.timesheets.add_timesheets_title')} onClick={this.createTimesheets}>{translate('human_resource.timesheets.add_by_hand')}</a></li>
                            </ul>
                        </div>
                        <ExportExcel id="export-timesheets" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15, marginTop: 0 }} />
                    </div>

                    <div className="form-inline">
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={department.list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        {/* Mã nhân viên */}
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
                                deleteValue={false}
                                value={month}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>

                    <div className="form-inline">
                        <label>{translate('human_resource.timesheets.symbol')}: &emsp; &emsp; </label><i style={{ color: "#08b30e", fontSize: 19 }} className="glyphicon glyphicon-ok"></i><span> -- {translate('human_resource.timesheets.do_work')} </span>
                                            &emsp;&emsp;&emsp;<i style={{ color: "red", fontSize: 19 }} className="glyphicon glyphicon-remove"></i><span> -- {translate('human_resource.timesheets.not_work')}</span>

                    </div>

                    <DataTableSetting
                        tableId="table-timesheets"
                        limit={this.state.limit}
                        setLimit={this.setLimit}
                        hideColumnOption={false}
                    />

                    <div id="croll-table" className="form-inline">
                        <div className="sticky col-lg-4 col-md-4 col-sm-6 col-xs-7 " style={{ padding: 0 }}>
                            <table id="table-timesheets" className="keeping table table-bordered">
                                <thead>
                                    <tr style={{ height: 58 }}>
                                        <th>{translate('human_resource.staff_number')}</th>
                                        <th>{translate('human_resource.staff_name')}</th>
                                        <th>{translate('general.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listTimesheets.length !== 0 && listTimesheets.map((x, index) => (
                                            <tr key={index}>
                                                <td style={{ paddingTop: 22 }}>{x.employee ? x.employee.employeeNumber : null}</td>
                                                <td style={{ paddingTop: 22 }}>{x.employee ? x.employee.fullName : null}</td>
                                                <td style={{ paddingTop: 22 }}>
                                                    <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.timesheets.edit_timesheets')}><i className="material-icons">edit</i></a>
                                                    <DeleteNotification
                                                        content={translate('human_resource.timesheets.delete_timesheets')}
                                                        data={{
                                                            id: x._id,
                                                            info: x.employee.employeeNumber + "- " + translate('human_resource.month') + ": " + month
                                                        }}
                                                        func={this.props.deleteTimesheets}
                                                    />

                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>

                            </table>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-6 col-xs-5" style={{ padding: 0 }}>
                            <table id="timesheets" className="timekeeping table table-striped table-bordered table-hover" style={{ marginLeft: -1 }}>
                                <thead>
                                    <tr style={{ height: 58 }}>
                                        {allDayOfMonth.map((x, index) => (
                                            <th key={index}>{x.day}&nbsp; {x.date}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listTimesheets.length !== 0 && listTimesheets.map((x, index) => {
                                            let workSession1 = x.workSession1, workSession2 = x.workSession2;
                                            return (
                                                <React.Fragment key={index}>
                                                    <tr>{
                                                        allDayOfMonth.map((y, indexs) => (
                                                            <td key={indexs}>
                                                                {workSession1[indexs] ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                    (indexs < dayNow - 1 ? <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i> : null)}
                                                            </td>
                                                        ))
                                                    }
                                                    </tr>
                                                    <tr>{
                                                        allDayOfMonth.map((y, indexs) => (
                                                            <td key={indexs}>
                                                                {workSession2[indexs] === true ? <i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i> :
                                                                    (indexs < dayNow - 1 ? <i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i> : null)}
                                                            </td>
                                                        ))
                                                    }
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <SlimScroll outerComponentId='croll-table' innerComponentId='timesheets' innerComponentWidth={1000} activate={true} />
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>
                {/* Form thêm mới thông tin chấm công */}
                <TimesheetsCreateForm />

                {/* Form import chấm công */}
                <TimesheetsImportForm />

                {   /* Form chinh sửa thông tin chấm công */
                    currentRow &&
                    <TimesheetsEditForm
                        _id={currentRow._id}
                        employeeNumber={currentRow.employee ? `${currentRow.employee.employeeNumber} - ${currentRow.employee.fullName}` : null}
                        month={this.formatDate(currentRow.month, true)}
                        workSession1={currentRow.workSession1}
                        workSession2={currentRow.workSession2}
                        allDayOfMonth={this.getAllDayOfMonth(this.formatDate(currentRow.month, true))}
                    />
                }
            </div>
        );
    }
}

function mapState(state) {
    const { department, timesheets } = state;
    return { department, timesheets };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    searchTimesheets: TimesheetsActions.searchTimesheets,
    deleteTimesheets: TimesheetsActions.deleteTimesheets,

};

const connectedTimesheets = connect(mapState, actionCreators)(withTranslate(TimesheetsManagement));
export { connectedTimesheets as TimesheetsManagement };