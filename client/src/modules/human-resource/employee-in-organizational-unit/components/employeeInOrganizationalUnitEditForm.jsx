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
    }
    componentDidMount() {
        this.props.getUser();
        this.props.getUser({ name: "ad" });
    }
    changeSearch = async (value) => {

        console.log("gshagdhwd");
        await this.props.getUser({ name: value })
        await this.setState({
            textSearch: value
        });
    }

    // Bắt sự kiện xoá nhân viên đơn vị
    handleDelete = (userId, roleId) => {
        let { roleEmployees } = this.state;
        roleEmployees = roleEmployees.map(x => {
            if (x.id === roleId) {
                x = { ...x, users: x.users.filter(y => y !== userId) }
            }
            return x
        })
        this.setState({
            roleEmployees: roleEmployees
        })

    }

    // Bắt sự kiện thêm nhân viên đơn vị
    handleAdd = (id) => {
        let { roleEmployees } = this.state;
        let userEmployees = this.refs[`employees${id}`].getValue();
        roleEmployees = roleEmployees.map(x => {
            if (x.id === id) {
                x = { ...x, users: x.users.concat(userEmployees) }
            }
            return x
        })
        this.setState({
            roleEmployees: roleEmployees
        })
        window.$(`#employee-unit-${id}`).val(null).trigger("change");
    }

    save = () => {
        var { roleDeans, roleViceDeans, roleEmployees } = this.state;
        roleDeans.forEach(x => {
            let users = this.refs[`deans${x.id}`].getValue();
            x = { ...x, users: users, showAlert: false }
            this.props.edit(x);
        });
        roleViceDeans.forEach(x => {
            let users = this.refs[`viceDeans${x.id}`].getValue();
            x = { ...x, users: users, showAlert: false }
            this.props.edit(x);
        });
        roleEmployees.forEach((x, index) => {
            console.log(roleEmployees.length);
            console.log(index);

            let users = this.refs[`employees${x.id}`].getValue();
            if (roleEmployees.length - 1 === index) {
                x = { ...x, users: x.users.concat(users) }
            } else {
                x = { ...x, users: x.users.concat(users), showAlert: false }
            }
            this.props.edit(x);
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            let roleDeans = nextProps.department[0].deans.map(x => {
                let infoRole = nextProps.role.find(y => y._id === x._id);
                return { id: x._id, name: x.name, parents: x.parents, users: infoRole.users.map(y => y.userId._id) }
            }),
                roleViceDeans = nextProps.department[0].viceDeans.map(x => {
                    let infoRole = nextProps.role.find(y => y._id === x._id);
                    return { id: x._id, name: x.name, parents: x.parents, users: infoRole.users.map(y => y.userId._id) }
                }),
                roleEmployees = nextProps.department[0].employees.map(x => {
                    let infoRole = nextProps.role.find(y => y._id === x._id);
                    return { id: x._id, name: x.name, parents: x.parents, users: infoRole.users.map(y => y.userId._id) }
                });
            return {
                ...prevState,
                _id: nextProps._id,
                roleDeans: roleDeans,
                roleViceDeans: roleViceDeans,
                roleEmployees: roleEmployees,
            }
        } else {
            return null;
        }
    }


    render() {
        let { translate, user } = this.props;
        const { _id, roleEmployees, roleDeans, roleViceDeans, textSearch } = this.state;
        let userlist = user.list, searchUses = user.searchUses;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-unit${_id}`} isLoading={false}
                    formID={`form-edit-unit${_id}`}
                    title={translate('manage_unit.edit_unit')}
                    msg_success={translate('manage_unit.edit_sucsess')}
                    msg_faile={translate('manage_unit.edit_faile')}
                    func={this.save}
                    disableSubmit={false}
                >
                    <form className="form-group" id={`form-edit-unit${_id}`}>
                        <fieldset className="scheduler-border" style={{ marginBottom: 10, paddingBottom: 10 }}>
                            <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">{translate('manage_unit.dean_unit')}</h4></legend>
                            {roleDeans !== undefined && roleDeans.map((x, index) => (
                                < div className="form-group" key={index} style={{ marginBottom: 0 }}>
                                    <label>{x.name}</label>
                                    <SelectBox
                                        id={`dean-unit-${x.id}`}
                                        ref={`deans${x.id}`}
                                        multiple={true}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={x.users}
                                        items={user.list.map(y => { return { value: y._id, text: `${y.name} (${y.email})` } })}
                                    />
                                </div>
                            ))}
                        </fieldset>
                        <fieldset className="scheduler-border" style={{ marginBottom: 10, paddingBottom: 10 }}>
                            <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">{translate('manage_unit.vice_dean_unit')}</h4></legend>
                            {roleViceDeans !== undefined && roleViceDeans.map((x, index) => (
                                < div className="form-group" key={index} style={{ marginBottom: 0 }}>
                                    <label>{x.name}</label>
                                    <SelectBox
                                        id={`vice_dean-unit-${x.id}`}
                                        ref={`viceDeans${x.id}`}
                                        className="form-control select2"
                                        multiple={true}
                                        style={{ width: "100%" }}
                                        value={x.users}
                                        items={user.list.map(y => { return { value: y._id, text: `${y.name} (${y.email})` } })}
                                    />
                                </div>
                            ))}
                        </fieldset>
                        <h4 style={{ marginBottom: 0, marginTop: 40 }}>{translate('manage_unit.employee_unit')}</h4>
                        {roleEmployees !== undefined && roleEmployees.map((x, index) => {
                            let infoEmployee = [], users = x.users;
                            for (let n in users) {
                                infoEmployee = userlist.filter(y => y._id === users[n]).concat(infoEmployee)
                            }
                            return (
                                <fieldset key={index} className="scheduler-border" style={{ marginBottom: 10, paddingBottom: 10 }}>
                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">{x.name}</h4></legend>
                                    <div className="form-group" key={index} style={{ marginBottom: 0 }}>
                                        <div className="employeeBox">
                                            <SelectBox
                                                id={`employee-unit-${x.id}`}
                                                ref={`employees${x.id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                onChange={this.handleEmployeeChange}
                                                multiple={true}
                                                // searchItems={searchUses.map(u => { return { value: u._id, text: u.name } })}
                                                // changeSearch={this.changeSearch}
                                                // textSearch={textSearch}
                                                items={user.list.map(y => { return { value: y._id, text: `${y.name} (${y.email})` } })}
                                            />
                                        </div>
                                        <button type="button" className="btn btn-success pull-right" style={{ marginBottom: 5 }} onClick={() => this.handleAdd(x.id)} title={translate('manage_unit.add_employee_unit')}>{translate('manage_employee.add_staff')}</button>
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
                                                            <a className="delete" title="Delete" onClick={() => this.handleDelete(user._id, x.id)}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        (infoEmployee.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                </fieldset>
                            )
                        })}

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