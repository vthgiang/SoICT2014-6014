import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { RoleActions } from '../../../super-admin-management/manage-role/redux/actions';
import 'react-toastify/dist/ReactToastify.css';
class ModalEditDepartmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSunmit = this.handleSunmit.bind(this);
    }
    componentDidMount() {
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
    handleSunmit(event) {
        // Khai báo các biến cần dùng và lấy biết trong store 
        let infoRoleDean,
            infoRoleViceDean,
            infoRoleEmployee,
            { role, data } = this.props;

        // lấy danh sách trưởng đơn vị
        let selectDean = this.refs.dean;
        let usersDean = [].filter.call(selectDean.options, o => o.selected).map(o => o.value);

        // lấy danh sách phó đơn vị
        let selectViceDean = this.refs.vice_dean;
        let usersViceDean = [].filter.call(selectViceDean.options, o => o.selected).map(o => o.value);

        // lấy danh sách nhân viên đơn vị
        let selectEmployee = this.refs.employee;
        let usersEmployee = [].filter.call(selectEmployee.options, o => o.selected).map(o => o.value);

        // Lấy thông tin các Role tương ứng với trưởng đơn vị, phó đơn vị và nhân viên đơn vị
        if (role.list.lenght !== 0) {
            for (let n in role.list) {
                if (role.list[n]._id === data.dean) {
                    infoRoleDean = role.list[n]
                }
                if (role.list[n]._id === data.vice_dean) {
                    infoRoleViceDean = role.list[n]
                }
                if (role.list[n]._id === data.employee) {
                    infoRoleEmployee = role.list[n]
                }
            }
        }

        let roleDean = { id: infoRoleDean._id, name: infoRoleDean.name, parents: infoRoleDean.parents, users: usersDean }
        let roleViceDean = { id: infoRoleViceDean._id, name: infoRoleViceDean.name, parents: infoRoleViceDean.parents, users: usersViceDean }
        let roleEmployee = { id: infoRoleEmployee._id, name: infoRoleEmployee.name, parents: infoRoleEmployee.parents, users: usersEmployee }
        
        // Lưu chỉnh sửa các role của đơn vị
        this.props.edit(roleDean);
        this.props.edit(roleViceDean);
        this.props.edit(roleEmployee);
        window.$(`#modal-viewUnit-${data.id}`).modal("hide");
    }
    render() {
        var userRoleDean, userRoleViceDean = [], userRoleEmployee = [];
        const { role, user, translate, data } = this.props;
        if (role.list.lenght !== 0) {
            for (let n in role.list) {
                if (role.list[n]._id === data.dean) {
                    userRoleDean = role.list[n].users.map(user => user.userId)
                }
                if (role.list[n]._id === data.vice_dean) {
                    userRoleViceDean = role.list[n].users
                }
                if (role.list[n]._id === data.employee) {
                    userRoleEmployee = role.list[n].users
                }
            }
        }
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-viewUnit-${data.id}`} className="edit" title="Chỉnh sửa nhân viên các đơn vị" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal fade" id={`modal-viewUnit-${data.id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa nhân sự {data.name.toLowerCase()}</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12 " >
                                    < div className="form-group col-md-12">
                                        <label className="pull-left">Trưởng đơn vị:</label>
                                        <select
                                            name="dean"
                                            className="form-control select2 pull-left"
                                            //multiple="multiple"
                                            onChange={this.handleChange}
                                            style={{ width: '100%' }}
                                            value={userRoleDean !== undefined ? userRoleDean[0] : "null"}
                                            ref="dean"
                                        >
                                            <option value="null"></option>
                                            {
                                                user.list.map(user => <option key={user._id} value={user._id}>{`${user.email} - ${user.name}`}</option>)
                                            }

                                        </select>
                                    </div>
                                    <div className="form-group col-md-12">
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

                                    <div className="col-md-12">
                                        <div className="form-group" >
                                            <label className="pull-left">Nhân viên đơn vị:</label>
                                            <select
                                                name="employee"
                                                className="form-control select2"
                                                multiple="multiple"
                                                onChange={this.handleChange}
                                                style={{ width: '100%' }}
                                                value={userRoleEmployee.map(user => user.userId)}
                                                ref="employee"
                                            >
                                                {
                                                    user.list.map(user => <option key={user._id} value={user._id}>{`${user.email} - ${user.name}`}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">{translate('modal.close')}</button>
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
    const { role, user } = state;
    return { role, user };
};

const actionCreators = {
    edit: RoleActions.edit
};

const editDepartmentManage = connect(mapState, actionCreators)(withTranslate(ModalEditDepartmentManage));
export { editDepartmentManage as ModalEditDepartmentManage };