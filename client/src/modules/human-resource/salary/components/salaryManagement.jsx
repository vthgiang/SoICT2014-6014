import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker, SelectMulti, ExportExcel } from '../../../../common-components';

import { SalaryCreateForm, SalaryEditForm, SalaryImportForm } from './combinedContent';

import { SalaryActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

class SalaryManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            month: null,
            employeeNumber: "",
            organizationalUnit: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.searchSalary(this.state);
        this.props.getDepartment();
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

    /** Function bắt sự kiện thêm lương nhân viên bằng tay */
    createSalary = () => {
        window.$('#modal-create-salary').modal('show');
    }

    /** Function bắt sự kiện thêm lương nhân viên bằng import file */
    importSalary = async () => {
        await this.setState({
            importSalary: true
        })
        window.$('#modal_import_file').modal('show');
    }

    /**
     * Function bắt sự kiện chỉnh sửa thông tin lương nhân viên
     * @param {*} value : Thông tin lương nhân viên cần chỉnh sửa
     */
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentRow: value
        })
        window.$('#modal-edit-salary').modal('show');
    }

    /** Function lưu giá trị mã nhân viên vào state khi thay đổi */
    handleMSNVChange = (event) => {
        const { name, value } = event.target;
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
     * Function lưu giá trị chức vụ vào state khi thay đổi
     * @param {*} value : Array id phòng ban
     */
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    /**
     *Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value : Giá trị tháng
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

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { month } = this.state;
        if (month === null) {
            let partMonth = this.formatDate(Date.now(), true).split('-');
            let month = [partMonth[1], partMonth[0]].join('-');
            await this.setState({
                ...this.state,
                month: month
            })
        } else if (month === "-") {
            await this.setState({
                ...this.state,
                month: ""
            })
        }
        this.props.searchSalary(this.state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng hiện thị
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchSalary(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang cần xem
     */
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.searchSalary(this.state);
    }

    /**
     * Function chyển đổi dữ liệu bảng lương thành dạng dữ liệu dùng export
     * @param {*} data : dữ liệu bảng lương
     */
    convertDataToExportData = (data) => {
        const { translate } = this.props;
        let otherSalary = [];
        if (data) {
            data.forEach(x => {
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        if (!otherSalary.includes(x.bonus[count].nameBonus)) {
                            otherSalary = [...otherSalary, x.bonus[count].nameBonus]
                        }
                    };
                }
            })

            data = data.map((x, index) => {
                let organizationalUnits = x.organizationalUnits.map(y => y.name);
                let position = x.roles.map(y => y.roleId.name);
                let total = 0, bonus = {};
                let d = new Date(x.month),
                    month = '' + (d.getMonth() + 1),
                    year = d.getFullYear();
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        total = total + parseInt(x.bonus[count].number);
                        otherSalary.forEach((y, key) => {
                            if (y === x.bonus[count].nameBonus) {
                                bonus = { ...bonus, [`bonus${key}`]: parseInt(x.bonus[count].number) }
                            }
                        })
                    };
                    total = total + parseInt(x.mainSalary);
                }

                return {
                    STT4: index + 1,
                    employeeNumber: x.employee.employeeNumber,
                    fullName: x.employee.fullName,
                    mainSalary: parseInt(x.mainSalary),
                    birthdate: this.formatDate(x.employee.birthdate, false),
                    status: x.employee.status === 'active' ? "Đang làm việc" : "Đã nghỉ làm",
                    gender: x.employee.gender === 'male' ? "Nam" : "Nữ",
                    organizationalUnits: organizationalUnits.join(', '),
                    position: position.join(', '),
                    total: total,
                    month: month,
                    year: year,
                    ...bonus
                };
            })
        }

        let columns = otherSalary.map((x, index) => {
            return { key: `bonus${index}`, value: x, type: "Number" }
        })
        let exportData = {
            fileName: translate('human_resource.salary.file_name_export'),
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: translate('human_resource.salary.file_name_export'),
                    tables: [
                        {
                            // tableName: "Bảng lương 1",
                            // merges: [{
                            //     key: "other",
                            //     columnName: "Lương thưởng khác",
                            //     keyMerge: 'bonus0',
                            //     colspan: 2
                            // }],
                            // rowHeader: 3,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "month", value: "Tháng" },
                                { key: "year", value: "Năm" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "organizationalUnits", value: "Phòng ban" },
                                { key: "position", value: "Chức vụ" },
                                { key: "gender", value: "Giới tính" },
                                { key: "birthdate", value: "Ngày sinh" },
                                { key: "status", value: "Tình trạng lao động" },
                                { key: "mainSalary", value: "Tiền lương chính", },
                                ...columns,
                                { key: "total", value: "Tổng lương", },
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }
        return exportData
    }

    render() {
        const { translate, salary, department } = this.props;

        const { limit, page, organizationalUnit } = this.state;

        let formater = new Intl.NumberFormat();
        let { list } = department;
        let listSalarys = [], listPosition = [{ value: "", text: translate('human_resource.not_unit'), disabled: true }];

        if (organizationalUnit !== null) {
            listPosition = [];
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

        if (salary.isLoading === false) {
            listSalarys = salary.listSalarys;
        }
        let exportData = this.convertDataToExportData(listSalarys);

        let pageTotal = (salary.totalList % limit === 0) ?
            parseInt(salary.totalList / limit) :
            parseInt((salary.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Nút xuất thêm bảng lương*/}
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.salary.add_salary_title')} >{translate('human_resource.salary.add_salary')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a title={translate('human_resource.salary.add_import_title')} onClick={this.importSalary}>
                                    {translate('human_resource.salary.add_import')}</a></li>
                                <li><a title={translate('human_resource.salary.add_by_hand_title')} onClick={this.createSalary}>
                                    {translate('human_resource.salary.add_by_hand')}</a></li>
                            </ul>
                        </div>
                        {/* Nút xuất báo cáo */}
                        <ExportExcel id="export-salary" exportData={exportData} style={{ marginRight: 15, marginTop: 0 }} />
                    </div>
                    <div className="form-inline">
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        {/* Chức vụ */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.position')}</label>
                            <SelectMulti id={`multiSelectPosition`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={organizationalUnit === null ? listPosition : listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Mã số nhân viên */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleMSNVChange} placeholder={translate('human_resource.staff_number')} autoComplete="off" />
                        </div>
                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now(), true)}
                                onChange={this.handleMonthChange}
                            />
                            {/* Nút tìm kiếm */}
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>
                    <table id="salary-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_number')}</th>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>{translate('human_resource.month')}</th>
                                <th>{translate('human_resource.salary.table.total_salary')}</th>
                                <th>{translate('human_resource.unit')}</th>
                                <th>{translate('human_resource.position')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.salary.table.action')}
                                    <DataTableSetting
                                        tableId="salary-table"
                                        columnArr={[
                                            translate('human_resource.staff_number'),
                                            translate('human_resource.staff_name'),
                                            translate('human_resource.month'),
                                            translate('human_resource.salary.table.total_salary'),
                                            translate('human_resource.unit'),
                                            translate('human_resource.position'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listSalarys && listSalarys.length !== 0) &&
                                listSalarys.map((x, index) => {
                                    if (x.bonus.length !== 0) {
                                        var total = 0;
                                        for (let count in x.bonus) {
                                            total = total + parseInt(x.bonus[count].number)
                                        }
                                    }
                                    return (
                                        <tr key={index}>
                                            <td>{x.employee.employeeNumber}</td>
                                            <td>{x.employee.fullName}</td>
                                            <td>{this.formatDate(x.month, true)}</td>
                                            <td>
                                                {
                                                    (x.bonus || x.bonus.length === 0) ?
                                                        formater.format(parseInt(x.mainSalary)) :
                                                        formater.format(total + parseInt(x.mainSalary))
                                                } {x.unit}
                                            </td>
                                            <td>{x.organizationalUnits.length !== 0 ? x.organizationalUnits.map(unit => (
                                                <React.Fragment key={unit._id}>
                                                    {unit.name}<br />
                                                </React.Fragment>
                                            )) : null}</td>
                                            <td>{x.roles.length !== 0 ? x.roles.map(role => (
                                                <React.Fragment key={role._id}>
                                                    {role.roleId.name}<br />
                                                </React.Fragment>
                                            )) : null}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.salary.edit_salary')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('human_resource.salary.delete_salary')}
                                                    data={{
                                                        id: x._id,
                                                        info: x.employee.employeeNumber + "- " + translate('human_resource.month') + ": " + this.formatDate(x.month, true)
                                                    }}
                                                    func={this.props.deleteSalary}
                                                />
                                            </td>
                                        </tr>)
                                })
                            }
                        </tbody>
                    </table>

                    {salary.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listSalarys || listSalarys.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>

                {/* Form thêm thông tin bảng lương bằng tay */}
                <SalaryCreateForm />

                {/* Form Thêm thông tin bảng lương bằng import file */}
                {this.state.importSalary && <SalaryImportForm />}

                {/* Form chỉnh sửa thông tin bảng lương */
                    this.state.currentRow &&
                    <SalaryEditForm
                        _id={this.state.currentRow._id}
                        unit={this.state.currentRow.unit}
                        employeeNumber={this.state.currentRow.employee.employeeNumber}
                        month={this.formatDate(this.state.currentRow.month, true)}
                        mainSalary={this.state.currentRow.mainSalary}
                        bonus={this.state.currentRow.bonus}
                    />
                }
            </div>
        );
    }
}

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const actionCreators = {
    searchSalary: SalaryActions.searchSalary,
    deleteSalary: SalaryActions.deleteSalary,
    getDepartment: DepartmentActions.get,
};

const connectedListSalary = connect(mapState, actionCreators)(withTranslate(SalaryManagement));
export { connectedListSalary as SalaryManagement };