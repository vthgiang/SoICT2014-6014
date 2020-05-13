import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer } from 'react-toastify';

import { EmployeeManagerActions } from '../redux/actions';
import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom } from './combinedContent';
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti } from '../../../../../common-components';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';

class EmployeeManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            gender: null,
            employeeNumber: "",
            organizationalUnit: null,
            status: null,
            page: 0,
            limit: 5,
        }
    }
    componentDidMount() {
        this.props.getAllEmployee(this.state);
        this.props.getDepartment();
    }

    // Bắt sự kiện click chỉnh sửa thông tin nghỉ phép
    handleView = async (value) => {
        await this.setState(state => {
            return {
                currentRowView: value
            }
        });
        window.$('#modal-view-employee').modal('show');
    }
    // Bắt sự kiện click chỉnh sửa thông tin nghỉ phép
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-employee').modal('show');
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
    // Function lưu giá trị giới tính vào state khi thay đổi
    handleGenderChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            gender: value
        })
    }
    // Function lưu giá trị trạng thái vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            status: value
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }
    // Function bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        this.props.getAllEmployee(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getAllEmployee(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getAllEmployee(this.state);
    }
    render() {
        const { list } = this.props.department;
        var { employeesManager, translate } = this.props;
        var lists, listPosition = [];
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

        if (employeesManager.listEmployee) {
            lists = employeesManager.listEmployee;
        }
        var pageTotal = ((employeesManager.totalList % this.state.limit) === 0) ?
            parseInt(employeesManager.totalList / this.state.limit) :
            parseInt((employeesManager.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <EmployeeCreateForm />
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
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Giới tính</label>
                            <SelectMulti id={`multiSelectGender`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn giới tính", allSelectedText: "Chọn tất cả giới tính" }}
                                items={[{ value: "male", text: "Nam" }, { value: "female", text: "Nữ" }]} onChange={this.handleGenderChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn trạng thái", allSelectedText: "Chọn tất cả trạng thái" }}
                                items={[{ value: "active", text: "Đang làm việc" }, { value: "leave", text: "Đã nghỉ làm" }]} onChange={this.handleStatusChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSunmitSearch} >Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="employee-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Mã nhân viên</th>
                                <th>Họ và tên</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Đơn vị</th>
                                <th>Chức vụ</th>
                                <th>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="employee-table"
                                        columnArr={[
                                            "Mã nhân viên",
                                            "Họ và tên",
                                            "Giới tính",
                                            "Ngày sinh",
                                            "Đơn vị",
                                            "Chức vụ",
                                            "Trạng thái"
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof lists !== 'undefined' && lists.length !== 0) &&
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employees.map(y => y.employeeNumber)}</td>
                                        <td>{x.employees.map(y => y.fullName)}</td>
                                        <td>{x.employees.map(y => y.gender)}</td>
                                        <td>{x.employees.map(y => y.birthdate)}</td>
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
                                        <td>{x.employees.map(y => y.status)}</td>
                                        < td >
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title="xem thông tin nhân viên"><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin nhân viên"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xoá thông tin nhân viên"
                                                data={{
                                                    id: x.employees.map(y => y._id),
                                                    info: x.employees.map(y => y.fullName) + " - " + x.employees.map(y => y.employeeNumber)
                                                }}
                                                func={this.props.deleteEmployee}
                                            />
                                        </td>
                                    </tr>
                                )
                                )}
                        </tbody>

                    </table>
                    {employeesManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                <ToastContainer />
                {
                    this.state.currentRowView !== undefined &&
                    <EmployeeDetailForm
                        _id={this.state.currentRowView.employees[0]._id}
                        employees={this.state.currentRowView.employees}
                        salarys={this.state.currentRowView.salarys}
                        annualLeaves={this.state.currentRowView.annualLeaves}
                        commendations={this.state.currentRowView.commendations}
                        disciplines={this.state.currentRowView.disciplines}
                    />
                }
                {
                    this.state.currentRow !== undefined &&
                    <EmployeeEditFrom
                        _id={this.state.currentRow.employees[0]._id}
                        employees={this.state.currentRow.employees}
                        salarys={this.state.currentRow.salarys}
                        annualLeaves={this.state.currentRow.annualLeaves}
                        commendations={this.state.currentRow.commendations}
                        disciplines={this.state.currentRow.disciplines}
                    />
                }
            </div>
        );
    };
}

function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    deleteEmployee: EmployeeManagerActions.deleteEmployee,
};
const employeeManagement = connect(mapState, actionCreators)(withTranslate(EmployeeManagement));

export { employeeManagement as EmployeeManagement };