import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';

import './employeeInOrganizationalUnit.css'

class EmployeeInOrganizationalUnitEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchItems: [],
        };
        this.handleAdd = this.handleAdd.bind(this);
    }
    componentDidMount() {
        this.props.getUser()
    }
    changeSearch = async (value) => {
        this.setState({
            textSearch: value
        });
        await this.props.getUser({ name: value })
    }
    // Bắt sự kiện thay đổi trưởng đơn vị
    handleDeanChange = (value) => {
        this.setState({
            userRoleDean: value
        })
    }
    // Bắt sự kiện thay đổi phó đơn vị
    handleViceDeanChange = (value) => {
        this.setState({
            userRoleViceDean: value
        })
    }
    // Bắt sự kiện thay đổi nhân viên đơn vị
    handleEmployeeChange = (value) => {
        this.setState({
            addUserEmployee: value
        })
    }
    // Bắt sự kiện xoá nhân viên đơn vị
    handleDelete = (id) => {
        this.setState({
            userRoleEmployee: this.state.userRoleEmployee.filter(user => user !== id)
        })

    }
    // Bắt sự kiện thêm nhân viên đơn vị
    handleAdd(e) {
        e.preventDefault();
        let userRoleEmployee = this.state.userRoleEmployee.concat(this.state.addUserEmployee);
        userRoleEmployee = userRoleEmployee.filter((item, index) => {
            return userRoleEmployee.indexOf(item) === index
        });
        this.setState({
            userRoleEmployee: userRoleEmployee,
            addUserEmployee: [],
        });
        window.$(`#employee-unit-${this.state._id}`).val(null).trigger("change");
    }
    save = () => {
        var { userRoleDean, userRoleViceDean, userRoleEmployee, addUserEmployee,
            infoRoleDean, infoRoleViceDean, infoRoleEmployee } = this.state;

        userRoleEmployee = userRoleEmployee.concat(addUserEmployee);
        userRoleEmployee = userRoleEmployee.filter((item, index) => {
            return userRoleEmployee.indexOf(item) === index
        });

        let roleDean = { id: infoRoleDean._id, name: infoRoleDean.name, parents: infoRoleDean.parents, users: userRoleDean, showAlert: false }
        let roleViceDean = { id: infoRoleViceDean._id, name: infoRoleViceDean.name, parents: infoRoleViceDean.parents, users: userRoleViceDean, showAlert: false }
        let roleEmployee = { id: infoRoleEmployee._id, name: infoRoleEmployee.name, parents: infoRoleEmployee.parents, users: userRoleEmployee }
        // Lưu chỉnh sửa các role của đơn vị
        this.props.edit(roleDean);
        this.props.edit(roleViceDean);
        this.props.edit(roleEmployee);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            var idRoleDean = nextProps.department[0].dean._id,
                idRoleViceDean = nextProps.department[0].viceDean._id,
                idRoleEmployee = nextProps.department[0].employee._id,
                infoRoleDean = nextProps.role.filter(x => x._id === idRoleDean),
                infoRoleViceDean = nextProps.role.filter(x => x._id === idRoleViceDean),
                infoRoleEmployee = nextProps.role.filter(x => x._id === idRoleEmployee);
            return {
                ...prevState,
                _id: nextProps._id,
                infoRoleDean: infoRoleDean[0],
                infoRoleViceDean: infoRoleViceDean[0],
                infoRoleEmployee: infoRoleEmployee[0],
                userRoleDean: infoRoleDean[0].users.map(x => x.userId._id !== undefined ? x.userId._id : x.userId),
                userRoleViceDean: infoRoleViceDean[0].users.map(x => x.userId._id !== undefined ? x.userId._id : x.userId),
                userRoleEmployee: infoRoleEmployee[0].users.map(x => x.userId._id !== undefined ? x.userId._id : x.userId),
                addUserEmployee: [],
            }
        } else {
            return null;
        }
    }


    render() {
        var infoEmployee = [];
        var { translate, user } = this.props;
        const { _id, userRoleDean, userRoleViceDean, userRoleEmployee, addUserEmployee } = this.state;
        // Lấy thông tin name và email của nhân viên đơn vị
        for (let n in userRoleEmployee) {
            infoEmployee = user.list.filter(x => x._id === userRoleEmployee[n]).concat(infoEmployee)
        }
        // Lấy danh sách người dùng không phải là nhân viên của đơn vị
        var userlist = user.list, searchUses = user.searchUses;
        if (userRoleViceDean.length !== 0) {
            for (let n in userRoleViceDean) {
                userlist = userlist.filter(x => x._id !== userRoleViceDean[n]);
                searchUses = searchUses.filter(x => x._id !== userRoleViceDean[n])
            }
        }
        if (userRoleDean.length !== 0) {
            userlist = userlist.filter(x => x._id !== userRoleDean[0]);
            searchUses = searchUses.filter(x => x._id !== userRoleDean[0])
        }
        for (let n in userRoleEmployee) {
            userlist = userlist.filter(x => x._id !== userRoleEmployee[n]);
        }
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-unit`} isLoading={false}
                    formID={`form-edit-unit`}
                    title={translate('manage_unit.edit_unit')}
                    msg_success={translate('manage_unit.edit_sucsess')}
                    msg_faile={translate('manage_unit.edit_faile')}
                    func={this.save}
                    disableSubmit={false}
                >
                    <form className="form-group" id={`form-edit-unit`}>
                        < div className="form-group">
                            <label>{translate('manage_unit.dean_unit')}</label>
                            <SelectBox
                                id={`dean-unit-${_id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={user.list.map(x => { return { value: x._id, text: x.name } })}
                                changeSearch={false}
                                onChange={this.handleDeanChange}
                                value={userRoleDean[0]}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manage_unit.vice_dean_unit')}</label>
                            <SelectBox
                                id={`vice_dean-unit-${_id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={user.list.map(x => { return { value: x._id, text: x.name } })}
                                onChange={this.handleViceDeanChange}
                                // searchItems={user.searchUses.map(x => { return { value: x._id, text: x.name } })}
                                // changeSearch={this.changeSearch}
                                // textSearch={this.state.textSearch}
                                value={userRoleViceDean}
                                multiple={true}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0, marginTop: 40 }}>
                            <label>{translate('manage_unit.employee_unit')}</label>
                            <div>
                                <div className="employeeBox">
                                    <SelectBox
                                        id={`employee-unit-${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        onChange={this.handleEmployeeChange}
                                        value={addUserEmployee}
                                        searchItems={searchUses.map(x => { return { value: x._id, text: x.name } })}
                                        changeSearch={this.changeSearch}
                                        textSearch={this.state.textSearch}
                                        multiple={true}
                                    />
                                </div>
                                <button type="button" className="btn btn-success pull-right" style={{ marginBottom: 5 }} onClick={this.handleAdd} title={translate('manage_unit.add_employee_unit')}>{translate('manage_employee.add_staff')}</button>
                            </div>
                        </div>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('table.employee_name')}</th>
                                    <th>{translate('manage_unit.email_employee')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    infoEmployee.length !== 0 &&
                                    infoEmployee.map((user, index) => (
                                        <tr key={index}>
                                            <td style={{ textAlign: "left" }}>{user.name}</td>
                                            <td style={{ textAlign: "left" }}>{user.email}</td>
                                            <td>
                                                <a className="delete" title="Delete" onClick={() => this.handleDelete(user._id)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (infoEmployee === 'undefined' || infoEmployee.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    var { user } = state;
    return { user };
};

const actionCreators = {
    edit: RoleActions.edit,
    getUser: UserActions.get,
};

const editFrom = connect(mapState, actionCreators)(withTranslate(EmployeeInOrganizationalUnitEditForm));
export { editFrom as EmployeeInOrganizationalUnitEditForm };