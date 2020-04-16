import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer } from 'react-toastify';
import { EmployeeManagerActions } from '../redux/actions';
//import { EmployeeInfoActions } from '../../employee-info/redux/actions';
import { ModalDetailEmployee } from './ModalDetailEmployee';
import { ModalAddEmployee } from './ModalAddEmployee';
import { ModalEditEmployee } from './ModalEditEmployee';
import { ActionColumn } from '../../../../common-components';
import { PaginateBar } from '../../../../common-components';
import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { DeleteNotification } from '../../../../common-components';

class ListEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: "All",
            gender: "All",
            employeeNumber: "",
            department: "All",
            status: "All",
            page: 0,
            limit: 5,
            hideColumn: []

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getAllEmployee(this.state);
        this.props.getDepartment();
        let script1 = document.createElement('script');
        script1.src = 'lib/main/js/GridSelect.js';
        script1.async = true;
        script1.defer = true;
        document.body.appendChild(script1);

    }

    componentDidUpdate() {
        this.hideColumn();
    }

    hideColumn = () => {
        if (this.state.hideColumn.length !== 0) {
            var hideColumn = this.state.hideColumn;
            for (var j = 0, len = hideColumn.length; j < len; j++) {
                window.$(`#employee-table td:nth-child(` + hideColumn[j] + `)`).hide();
            }
        }
    }

    displayTreeSelect = (data, i) => {
        i = i + 1;
        if (data !== undefined) {
            if (typeof (data.children) === 'undefined') {
                return (
                    <option key={data.id} data-level={i} value={data.id}>{data.name}</option>
                )
            } else {
                return (
                    <React.Fragment key={data.id}>
                        <option data-level={i} value={data.id} style={{ fontWeight: "bold" }}>{data.name}</option>
                        {
                            data.children.map(tag => this.displayTreeSelect(tag, i))
                        }
                    </React.Fragment>
                )
            }

        }
        else return null
    }
    setLimit = async (number, hideColumn) => {
        await this.setState({
            limit: parseInt(number),
            hideColumn: hideColumn
        });
        this.props.getAllEmployee(this.state);
    }
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),

        });
        this.props.getAllEmployee(this.state);
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleSunmitSearch(event) {
        event.preventDefault();
        this.props.getAllEmployee(this.state);
    }
    render() {
        const { tree, list } = this.props.department;
        var lists, listDepartment = list, listPosition;
        for (let n in listDepartment) {
            if (listDepartment[n]._id === this.state.department) {
                listPosition = [
                    { _id: listDepartment[n].dean._id, name: listDepartment[n].dean.name },
                    { _id: listDepartment[n].vice_dean._id, name: listDepartment[n].vice_dean.name },
                    { _id: listDepartment[n].employee._id, name: listDepartment[n].employee.name }
                ]
            }
        }
        var { employeesManager, translate } = this.props;
        if (employeesManager.allEmployee) {
            lists = employeesManager.allEmployee;
        }
        var pageTotal = ((employeesManager.totalList % this.state.limit) === 0) ?
            parseInt(employeesManager.totalList / this.state.limit) :
            parseInt((employeesManager.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <h4 className="box-title">Danh sách nhân viên:</h4>
                        </div>
                        <ModalAddEmployee initState={this.state} />
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}:</label>
                            <select className="form-control" defaultValue="All" id="tree-select" name="department" onChange={this.handleChange}>
                                <option value="All" level={1}>--Tất cả---</option>
                                {
                                    tree !== null &&
                                    tree.map((tree, index) => this.displayTreeSelect(tree, 0))
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.position')}:</label>
                            <select className="form-control" defaultValue="All" name="position" onChange={this.handleChange}>
                                <option value="All">--Tất cả--</option>
                                {
                                    listPosition !== undefined &&
                                    listPosition.map((position, index) => (
                                        <option key={index} value={position._id}>{position.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label htmlFor="employeeNumber" className="form-control-static">{translate('page.staff_number')}:</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender" className="form-control-static">Giới tính:</label>
                            <select className="form-control" defaultValue="All" name="gender" onChange={this.handleChange}>
                                <option value="All">--Tất cả--</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                            </select>

                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}:</label>
                            <select className="form-control" defaultValue="All" name="status" onChange={this.handleChange}>
                                <option value="All">--Tất cả--</option>
                                <option value="active">Đang làm việc</option>
                                <option value="leave">Đã nghỉ làm</option>
                            </select>

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
                                    <ActionColumn
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
                            {(typeof lists === 'undefined' || lists.length === 0) ? <tr><th colSpan={8 - this.state.hideColumn.length}><center> Không có dữ liệu</center></th></tr> :
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employee.map(y => y.employeeNumber)}</td>
                                        <td>{x.employee.map(y => y.fullName)}</td>
                                        <td>{x.employee.map(y => y.gender)}</td>
                                        <td>{x.employee.map(y => y.brithday)}</td>
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
                                        <td>{x.employee.map(y => y.status)}</td>
                                        < td >
                                            <ModalDetailEmployee employee={x.employee} employeeContact={x.employeeContact} salary={x.salary}
                                                sabbatical={x.sabbatical} praise={x.praise} discipline={x.discipline} />
                                            <ModalEditEmployee employee={x.employee} employeeContact={x.employeeContact} salary={x.salary} initState={this.state}
                                                sabbatical={x.sabbatical} praise={x.praise} discipline={x.discipline} list={x} />
                                            <DeleteNotification
                                                content="Xoá thông tin nhân viên"
                                                data={{
                                                    id: x.employee.map(y => y._id),
                                                    info: x.employee.map(y => y.fullName) + " - " + x.employee.map(y => y.employeeNumber)
                                                }}
                                                func={this.props.deleteEmployee}
                                            />
                                        </td>
                                    </tr>
                                )
                                )}
                        </tbody>

                    </table>
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                <ToastContainer />
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
const connectedEmplyee = connect(mapState, actionCreators)(withTranslate(ListEmployee));

export { connectedEmplyee as ListEmployee };