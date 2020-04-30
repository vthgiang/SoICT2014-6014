import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SalaryCreateForm, SalaryEditForm, SalaryImportFrom } from './combinedContent';
import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker, SelectMulti } from '../../../../common-components';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { SalaryActions } from '../redux/actions';

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
        if (this.state.month === null) {
            await this.setState({
                ...this.state,
                month: this.formatDate(Date.now())
            })
        }
        this.props.searchSalary(this.state);
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
        this.props.searchSalary(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.searchSalary(this.state);
    }
    render() {
        const { list } = this.props.department;
        const { translate, salary } = this.props;
        var formater = new Intl.NumberFormat();
        var listSalarys = "", listPosition = [];
        if (this.state.organizationalUnit !== null) {
            let organizationalUnit = this.state.organizationalUnit;
            organizationalUnit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let position = [
                            { _id: x.dean._id, name: x.dean.name },
                            { _id: x.viceDean._id, name: x.viceDean.name },
                            { _id: x.employee._id, name: x.employee.name }
                        ]
                        listPosition = listPosition.concat(position)
                    }
                })
            })
        }
        if (salary.isLoading === false) {
            listSalarys = salary.listSalarys;
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
                            <h4 className="box-title">{translate('human_resource.salary.list_salary')}:</h4>
                        </div>
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.salary.add_salary_title')} >{translate('human_resource.salary.add_salary')}</button>
                            <ul className="dropdown-menu pull-right" style={{ background: "#999", marginTop: -15 }}>
                                <li><a style={{ color: "#fff" }} title={translate('human_resource.salary.add_import_title')} data-toggle="modal" data-target="#modal-importFileSalary">{translate('human_resource.salary.add_import')}</a></li>
                                <li><a style={{ color: "#fff" }} title={translate('human_resource.salary.add_by_hand_title')} onClick={this.createSalary} data-toggle="modal" data-target="#modal-addNewSalary">{translate('human_resource.salary.add_by_hand')}</a></li>
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
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
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
                            {(typeof listSalarys !== 'undefined' && listSalarys.length !== 0) &&
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
                                            <td>{x.month}</td>
                                            <td>
                                                {
                                                    (typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
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
                                                        info: x.employee.employeeNumber + "- " + translate('human_resource.month') + ": " + x.month
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
                        (typeof listSalarys === 'undefined' || listSalarys.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                <SalaryCreateForm />
                <SalaryImportFrom />
                {
                    this.state.currentRow !== undefined &&
                    <SalaryEditForm
                        _id={this.state.currentRow._id}
                        unit={this.state.currentRow.unit}
                        employeeNumber={this.state.currentRow.employee.employeeNumber}
                        month={this.state.currentRow.month}
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
    getDepartment: DepartmentActions.get,
    searchSalary: SalaryActions.searchSalary,
    deleteSalary: SalaryActions.deleteSalary,
};

const connectedListSalary = connect(mapState, actionCreators)(withTranslate(SalaryManagement));
export { connectedListSalary as SalaryManagement };