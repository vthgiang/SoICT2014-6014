import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SalaryCreateForm } from './SalaryCreateForm';
import { SalaryImportFrom } from './SalaryImportFrom';
import { SalaryEditForm } from './SalaryEditForm';
import { ActionColumn, DeleteNotification, PaginateBar, DatePicker, SelectMulti } from '../../../../common-components';

import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { SalaryActions } from '../redux/actions';

class SalaryManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            month: null,
            employeeNumber: "",
            unit: null,
            page: 0,
            limit: 5,
        }
    }
    componentDidMount() {
        this.props.getListSalary(this.state);
        this.props.getDepartment();
    }

    // Function bắt sự kiện thêm lương nhân viên bằng tay
    createSalary = () => {
        window.$('#modal-create-salary').modal('show');
    }

    // Function bắt sự kiện chỉnh sửa thông tin nhân viên
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentRow: value
        })
        window.$('#modal-edit-salary').modal('show');
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
            unit: value
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
        if (this.state.month === null) {
            await this.setState({
                ...this.state,
                month: this.formatDate(Date.now())
            })
        }
        this.props.getListSalary(this.state);
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [month, year].join('-');
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getListSalary(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListSalary(this.state);
    }
    render() {
        console.log(this.state);
        const { list } = this.props.department;
        const { translate, salary } = this.props;
        var formater = new Intl.NumberFormat();
        var listSalary = "", listPosition = [];
        if (this.state.unit !== null) {
            let unit = this.state.unit;
            unit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let position = [
                            { _id: x.dean._id, name: x.dean.name },
                            { _id: x.vice_dean._id, name: x.vice_dean.name },
                            { _id: x.employee._id, name: x.employee.name }
                        ]
                        listPosition = listPosition.concat(position)
                    }
                })
            })
        }
        if (salary.isLoading === false) {
            listSalary = salary.listSalary;
        }
        var pageTotal = (salary.totalList % this.state.limit === 0) ?
            parseInt(salary.totalList / this.state.limit) :
            parseInt((salary.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <h4 className="box-title">{translate('salary_employee.list_salary')}:</h4>
                        </div>
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('salary_employee.add_salary_title')} >{translate('salary_employee.add_salary')}</button>
                            <ul className="dropdown-menu pull-right" style={{ background: "#999", marginTop: -15 }}>
                                <li><a style={{ color: "#fff" }} title={translate('salary_employee.add_import_title')} data-toggle="modal" data-target="#modal-importFileSalary">{translate('salary_employee.add_import')}</a></li>
                                <li><a style={{ color: "#fff" }} title={translate('salary_employee.add_by_hand_title')} onClick={this.createSalary} data-toggle="modal" data-target="#modal-addNewSalary">{translate('salary_employee.add_by_hand')}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.position')}</label>
                            <SelectMulti id={`multiSelectPosition`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_position'), allSelectedText: translate('page.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleMSNVChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="salary-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('table.employee_number')}</th>
                                <th>{translate('table.employee_name')}</th>
                                <th>{translate('table.month')}</th>
                                <th>{translate('table.total_salary')}</th>
                                <th>{translate('table.unit')}</th>
                                <th>{translate('table.position')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <ActionColumn
                                        tableId="salary-table"
                                        columnArr={[
                                            translate('table.employee_number'),
                                            translate('table.employee_name'),
                                            translate('table.month'),
                                            translate('table.total_salary'),
                                            translate('table.unit'),
                                            translate('table.position'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listSalary !== 'undefined' && listSalary.length !== 0) &&
                                listSalary.map((x, index) => {

                                    let salary = x.mainSalary.slice(0, x.mainSalary.length - 3);
                                    if (x.bonus.length !== 0) {
                                        var total = 0;
                                        for (let count in x.bonus) {
                                            total = total + parseInt(x.bonus[count].number)
                                        }
                                    }
                                    var unit = x.mainSalary.slice(x.mainSalary.length - 3, x.mainSalary.length);
                                    return (
                                        <tr key={index}>
                                            <td>{x.employee.employeeNumber}</td>
                                            <td>{x.employee.fullName}</td>
                                            <td>{x.month}</td>
                                            <td>
                                                {
                                                    (typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                        formater.format(parseInt(salary)) :
                                                        formater.format(total + parseInt(salary))
                                                } {unit}
                                            </td>
                                            <td>{x.departments.length !== 0 ? x.departments.map(unit => (
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
                                                <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('salary_employee.edit_salary')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('salary_employee.delete_salary')}
                                                    data={{
                                                        id: x._id,
                                                        info: x.employee.employeeNumber + "- tháng: " + x.month
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
                        (typeof listSalary === 'undefined' || listSalary.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                <SalaryCreateForm />
                <SalaryImportFrom />
                {
                    this.state.currentRow !== undefined &&
                    <SalaryEditForm
                        _id={this.state.currentRow._id}
                        unit={this.state.currentRow.mainSalary.slice(-3, this.state.currentRow.mainSalary.length)}
                        employeeNumber={this.state.currentRow.employee.employeeNumber}
                        month={this.state.currentRow.month}
                        mainSalary={this.state.currentRow.mainSalary.slice(0, this.state.currentRow.mainSalary.length - 3)}
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
    getDepartment: DepartmentActions.get,
    getListSalary: SalaryActions.getListSalary,
    deleteSalary: SalaryActions.deleteSalary,
};

const connectedListSalary = connect(mapState, actionCreators)(withTranslate(SalaryManager));
export { connectedListSalary as SalaryManager };