import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TimesheetsImportForm, TimesheetsCreateForm, TimesheetsEditForm } from './combinedContent';
import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker, SelectMulti, SlimScroll } from '../../../../common-components';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { TimesheetsActions } from '../redux/actions';

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
            position: null,
            month: this.formatDate(Date.now(), true),
            employeeNumber: "",
            organizationalUnit: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getDepartment();

        let partMonth = this.state.month.split('-');
        let month = [partMonth[1], partMonth[0]].join('-');
        this.props.searchTimesheets({ ...this.state, month: month });
    }
    // Function bắt sự kiện thêm thông tin chấm công
    createTimesheets = () => {
        window.$('#modal-create-timesheets').modal('show');
    }

    // Function bắt sự kiện import thông tin chấm công
    handleImport = () => {
        window.$('#modal_import_file').modal('show');
    }

    // Function bắt sự kiện chỉnh sửa thông tin chấm công
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentRow: value
        })
        window.$('#modal-edit-timesheets').modal('show');
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
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

    // Function lấy danh sách các ngày trong tháng
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


    // Function lưu giá trị mã nhân viên vào state khi thay đổi
    handleMSNVChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị unit vào state khi thay đổi
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnit: value
        })
    }

    // Function lưu giá trị chức vụ vào state khi thay đổi
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Function bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        let allDayOfMonth = this.getAllDayOfMonth(this.state.month);
        let dateNow = new Date(), dayNow = dateNow.getDate();
        let partMonth = this.state.month.split('-');
        if (this.formatDate(new Date(partMonth[1], partMonth[0], 0), true) !== this.formatDate(dateNow, true)) {
            dayNow = 31;
        }
        this.setState({
            allDayOfMonth: allDayOfMonth,
            dayNow: dayNow
        })

        let month = [partMonth[1], partMonth[0]].join('-');
        this.props.searchTimesheets({ ...this.state, month: month });
    }



    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });

        let partMonth = this.state.month.split('-');
        let month = [partMonth[1], partMonth[0]].join('-');
        this.props.searchTimesheets({ ...this.state, month: month });
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });

        let partMonth = this.state.month.split('-');
        let month = [partMonth[1], partMonth[0]].join('-');
        this.props.searchTimesheets({ ...this.state, month: month });
    }
    render() {
        const { list } = this.props.department;
        const { translate, timesheets } = this.props;
        const { month, limit, page, allDayOfMonth, dayNow } = this.state;

        var listTimesheets = [], listPosition = [];
        if (this.state.organizationalUnit !== null) {
            let organizationalUnit = this.state.organizationalUnit;
            organizationalUnit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let roleDeans = x.deans.map(y => { return { _id: y._id, name: y.name } });
                        let roleViceDeans = x.viceDeans.map(y => { return { _id: y._id, name: y.name } });
                        let roleEmployees = x.employees.map(y => { return { _id: y._id, name: y.name } });
                        listPosition = listPosition.concat(roleDeans).concat(roleViceDeans).concat(roleEmployees);
                    }
                })
            })
        }

        if (timesheets.isLoading === false) {
            listTimesheets = timesheets.listTimesheets;
        }
        let pageTotal = (timesheets.totalList % limit === 0) ?
            parseInt(timesheets.totalList / limit) :
            parseInt((timesheets.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title="Chấm công nhân viên" >Thêm chấm công</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }} >
                                <li><a title={'Thêm mới thông tin chấm công từ file excel'} onClick={this.handleImport}>Import file Excel</a></li>
                                <li><a title={'Thêm mới thông tin chấm công'} onClick={this.createTimesheets}>Thêm bằng tay</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.position')}</label>
                            <SelectMulti id={`multiSelectPosition`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleMSNVChange} placeholder={translate('human_resource.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                deleteValue={false}
                                value={month}
                                onChange={this.handleMonthChange}
                            />
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>
                    <div className="form-inline">
                        <label>Ký hiệu: &emsp; &emsp; </label><i style={{ color: "#08b30e", fontSize: 19 }} className="glyphicon glyphicon-ok"></i><span> -- Có đi làm </span>
                                            &emsp;&emsp;&emsp;<i style={{ color: "red", fontSize: 19 }} className="glyphicon glyphicon-remove"></i><span> -- Nghỉ làm</span>

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
                                        <th>Mã nhân viên</th>
                                        <th>Tên nhân viên</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listTimesheets.length !== 0 && listTimesheets.map((x, index) => (
                                            <tr key={index}>
                                                <td style={{ paddingTop: 22 }}>{x.employee.employeeNumber}</td>
                                                <td style={{ paddingTop: 22 }}>{x.employee.fullName}</td>
                                                <td style={{ paddingTop: 22 }}>
                                                    <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin chấm công"><i className="material-icons">edit</i></a>
                                                    <DeleteNotification
                                                        content="Xoá thông tin chấm công"
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

                <TimesheetsCreateForm />
                <TimesheetsImportForm />
                {
                    this.state.currentRow &&
                    <TimesheetsEditForm
                        _id={this.state.currentRow._id}
                        employeeNumber={this.state.currentRow.employee.employeeNumber}
                        month={this.formatDate(this.state.currentRow.month, true)}
                        workSession1={this.state.currentRow.workSession1}
                        workSession2={this.state.currentRow.workSession2}
                        allDayOfMonth={this.getAllDayOfMonth(this.formatDate(this.state.currentRow.month, true))}
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