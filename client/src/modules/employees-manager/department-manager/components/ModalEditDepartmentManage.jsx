import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { UserActions } from '../../../super-admin-management/users-management/redux/actions';
import { RoleActions } from '../../../super-admin-management/roles-management/redux/actions';
import 'react-toastify/dist/ReactToastify.css';
class ModalEditDepartmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteEmployee: [],
            addEmployee: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSunmit = this.handleSunmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        this.props.getDepartment();
        this.props.getRole();
        this.props.getUser();
        let script = document.createElement('script');
        script.src = 'lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleClick() {
        window.$('#setting-table').collapse('show');
    }
    handleDelete = (id) => {
        this.setState({
            deleteEmployee: [...this.state.deleteEmployee, id],
            addEmployee: this.state.addEmployee.filter(user => user !== id),
        })
    }
    handleAdd = () => {
        var { list } = this.props.department;
        var data = list.filter(x => x._id === this.props.id);
        let selectEmployee = this.refs.employee;
        let usersEmployee = [].filter.call(selectEmployee.options, o => o.selected).map(o => o.value);
        var deleteEmployee = this.state.deleteEmployee;
        for (let n in usersEmployee) {
            deleteEmployee = deleteEmployee.filter(user => user !== usersEmployee[n])
            window.$(`select.${data[0]._id} option.${usersEmployee[n]}`).remove();
        }
        this.setState({
            addEmployee: [...this.state.addEmployee, ...usersEmployee],
            deleteEmployee: deleteEmployee
        })

    }
    handleClose = () => {
        window.$(`#modal-viewUnit-${this.props.id}`).modal('hide');
    }
    handleSunmit(event) {
        // Khai báo các biến cần dùng và lấy biến trong store 
        let infoRoleDean,
            infoRoleViceDean,
            infoRoleEmployee,
            userRoleEmployee,
            { role } = this.props;
        var { list } = this.props.department;
        var data = list.filter(x => x._id === this.props.id);
        data = data[0];
        // lấy danh sách trưởng đơn vị
        let selectDean = this.refs.dean;
        let usersDean = [].filter.call(selectDean.options, o => o.selected).map(o => o.value);

        // lấy danh sách phó đơn vị
        let selectViceDean = this.refs.vice_dean;
        let usersViceDean = [].filter.call(selectViceDean.options, o => o.selected).map(o => o.value);

        // Kiểm tra người dùng đã thêm nhân viên vào đơn vị chưa khi người dùng đã chọn nhân viên
        // để thêm vào đơn vị
        if (this.refs.employee.value !== "") {
            this.notifyerror("Bạn chưa thêm nhân viên vào đơn vị");
        } else {
            // Lấy thông tin các Role tương ứng với trưởng đơn vị, phó đơn vị và nhân viên đơn vị
            if (role.list.length !== 0) {
                for (let n in role.list) {
                    if (role.list[n]._id === data.dean._id) {
                        infoRoleDean = role.list[n]
                    }
                    if (role.list[n]._id === data.vice_dean._id) {
                        infoRoleViceDean = role.list[n]
                    }
                    if (role.list[n]._id === data.employee.id) {
                        infoRoleEmployee = role.list[n]
                        userRoleEmployee = role.list[n].users.map(user => user.userId)
                    }
                }
            }
            //Thêm nhân viên vào đơn vị
            if (this.state.addEmployee.length !== 0) {
                userRoleEmployee = this.state.addEmployee.concat(userRoleEmployee);
            }
            // Xoá nhân viên đơn vị
            if (this.state.deleteEmployee.length !== 0) {
                for (let n in this.state.deleteEmployee) {
                    userRoleEmployee = userRoleEmployee.filter(user => user !== this.state.deleteEmployee[n]);
                }
            }

            let roleDean = { id: infoRoleDean._id, name: infoRoleDean.name, parents: infoRoleDean.parents, users: usersDean }
            let roleViceDean = { id: infoRoleViceDean._id, name: infoRoleViceDean.name, parents: infoRoleViceDean.parents, users: usersViceDean }
            let roleEmployee = { id: infoRoleEmployee._id, name: infoRoleEmployee.name, parents: infoRoleEmployee.parents, users: userRoleEmployee }

            // Lưu chỉnh sửa các role của đơn vị
            this.props.edit(roleDean);
            this.props.edit(roleViceDean);
            this.props.edit(roleEmployee);

            window.$(`#modal-viewUnit-${this.props.id}`).modal('hide');
        }


    }
    render() {
        var userRoleDean, userRoleViceDean = [], userRoleEmployee = [], infoEmployee = [];
        var { role, user, translate, id } = this.props;
        var { list } = this.props.department;
        var data = list.filter(x => x._id === id);
        data = data[0];
        console.log(data)
        if (role.list.length !== 0) {
            for (let n in role.list) {
                if (role.list[n]._id === data.dean._id) {
                    userRoleDean = role.list[n].users.map(user => user.userId)
                }
                if (role.list[n]._id === data.vice_dean._id) {
                    userRoleViceDean = role.list[n].users
                }
                if (role.list[n]._id === data.employee._id) {
                    userRoleEmployee = role.list[n].users.map(user => user.userId)
                }
            }
        }
        //Thêm nhân viên vào đơn vị
        if (this.state.addEmployee.length !== 0) {
            userRoleEmployee = this.state.addEmployee.concat(userRoleEmployee);
        }
        // Xoá nhân viên đơn vị
        if (this.state.deleteEmployee.length !== 0) {
            for (let n in this.state.deleteEmployee) {
                userRoleEmployee = userRoleEmployee.filter(user => user !== this.state.deleteEmployee[n]);
            }
        }
        // Lấy thông tin name và email của nhân viên đơn vị
        for (let n in userRoleEmployee) {
            infoEmployee = user.list.filter(user => user._id === userRoleEmployee[n]).concat(infoEmployee)
        }
        // Lấy danh sách người dùng không phải là nhân viên của đơn vị
        var userlist = user.list;
        if (userRoleViceDean.length !== 0) {
            var userRoleViceDeanId = userRoleViceDean.map(user => user.userId);
            for (let n in userRoleViceDeanId) {
                userlist = userlist.filter(user => user._id !== userRoleViceDeanId[n])
            }
        }
        if (userRoleDean !== undefined) {
            userlist = userlist.filter(user => user._id !== userRoleDean[0])
        }
        for (let n in userRoleEmployee) {
            userlist = userlist.filter(user => user._id !== userRoleEmployee[n])
        }
        return (
            <div style={{ display: "inline" }}>
                <div className="modal fade" id={`modal-viewUnit-${id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-size-75">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => this.handleClose()}>
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa nhân sự {data.name.toLowerCase()}</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12 " >
                                    <div className="col-md-12">
                                        < div className="form-group col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label className="pull-left">Trưởng đơn vị:</label>
                                            <select
                                                name="dean"
                                                className="form-control select2 pull-left"
                                                onChange={this.handleChange}
                                                onClick={this.handleClick}
                                                style={{ width: '100%' }}
                                                value={userRoleDean !== undefined ? userRoleDean[0] : "null"}
                                                ref="dean"
                                            >
                                                <option value="null"></option>
                                                {
                                                    user.list.map(user => <option key={user._id} value={user._id}>{`${user.email} - ${user.name}`}</option>)
                                                }
                                            </select>
                                            {/* <div id="setting-table" className="row collapse">
                                                <span className="pop-arw arwTop L-auto" style={{ right: "13px" }}></span>

                                                <div className="col-xs-12" style={{ marginTop: "10px" }}>
                                                    <label style={{ marginRight: "15px" }}>{translate('table.line_per_page')}</label>
                                                    <input className="form-control" type="text" defaultValue={5} ref={this.record} />
                                                </div>
                                                <div className="col-xs-2 col-xs-offset-6" style={{ marginTop: "10px" }}>
                                                    <button type="button" className="btn btn-success" onClick={this.setLimit}>{translate('table.update')}</button>
                                                </div>
                                            </div> */}

                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }} >
                                            <label className="pull-left">Phó đơn vị:</label>
                                            <select
                                                name="vice_dean"
                                                className="form-control select2"
                                                multiple="multiple"
                                                onChange={this.handleChange}
                                                style={{ width: '100%' }}
                                                value={userRoleViceDean.map(user => user.userId)}
                                                ref="vice_dean"
                                            >
                                                {
                                                    user.list.map(user => <option key={user._id} value={user._id}>{`${user.email} - ${user.name}`}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="pull-left">Nhân viên đơn vị:</label>
                                        <div className="form-group col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }} >
                                            <fieldset className="scheduler-border">
                                                <div className="form-group col-md-10" style={{ paddingRight: 0, paddingLeft: 0, paddingTop: 5 }} >
                                                    <label className="pull-left">Thêm nhân viên:</label>
                                                    <select
                                                        name="employee"

                                                        className={`form-control select2 ${data._id}`}
                                                        multiple="multiple"
                                                        onChange={this.handleChange}
                                                        style={{ width: '100%' }}
                                                        ref="employee"
                                                    >
                                                        {userlist &&
                                                            userlist.map((user, index) => <option key={index} className={user._id} value={user._id}>{`${user.email} - ${user.name}`}</option>)
                                                        }
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-2" style={{ paddingTop: 24, paddingRight: 0 }}>
                                                    <button type="submit" style={{ height: 34 }} className="btn btn-success pull-right" onClick={() => this.handleAdd()} title="Thêm nhân viên đơn vị">Thêm nhân viên</button>
                                                </div>
                                                <div className=" col-md-12 pull-left" style={{ paddingLeft: 0, paddingRight: 0, width: "100%" }}>
                                                    <div className="box-header pull-left" style={{ paddingLeft: 0, paddingTop: 0 }}>
                                                        <h3 className="box-title pull-left">Danh sách nhân viên đơn vị:</h3>
                                                    </div>
                                                </div>
                                                <table className="table table-striped table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên nhân viên</th>
                                                            <th>Email nhân viên</th>
                                                            <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            infoEmployee.length === 0 ? <tr><td colSpan={3}><center> Không có dữ liệu</center></td></tr> :
                                                                infoEmployee.map((user, index) => (
                                                                    <tr key={index}>
                                                                        <td style={{ textAlign: "left" }}>{user.name}</td>
                                                                        <td style={{ textAlign: "left" }}>{user.email}</td>
                                                                        <td>
                                                                            <a href="#abc" className="delete" title="Delete" onClick={() => this.handleDelete(user._id)}><i className="material-icons"></i></a>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                        }

                                                    </tbody>
                                                </table>
                                            </fieldset>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleClose()}>{translate('modal.close')}</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" title={translate('modal.update')} onClick={this.handleSunmit} >{translate('modal.update')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
function mapState(state) {
    var { role, user, department } = state;
    return { role, user, department };
};

const actionCreators = {
    edit: RoleActions.edit,
    getRole: RoleActions.get,
    getUser: UserActions.get,
    getDepartment: DepartmentActions.get,
};

const editDepartmentManage = connect(mapState, actionCreators)(withTranslate(ModalEditDepartmentManage));
export { editDepartmentManage as ModalEditDepartmentManage };