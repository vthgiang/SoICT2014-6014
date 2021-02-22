import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';

import { UserActions } from "../../../../super-admin/user/redux/actions"
import { createKpiSetActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';

import { DialogModal, SelectBox } from '../../../../../../src/common-components';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';


var translate = '';
class ModalCreateEmployeeKpiSet extends Component {

    constructor(props) {
        super(props);

        translate = this.props.translate;

        this.state = {
            _id: null,
            employeeKpiSet: {
                organizationalUnit: "",
                approver: null,
                month: "",
            },
            adding: false
        };
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.organizationalUnit !== prevState.organizationalUnit || nextProps.month !== prevState.month) {
            return {
                ...prevState,
                employeeKpiSet: {
                    ...prevState.employeeKpiSet,
                    organizationalUnit: nextProps.organizationalUnit && nextProps.organizationalUnit._id,
                    month: nextProps.month
                },
                organizationalUnit: nextProps.organizationalUnit
            }
        } else {
            return null;
        }
    }

    componentDidMount = () => {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { user, createKpiUnit } = this.props;
        const { employeeKpiSet } = this.state;

        if (createKpiUnit && createKpiUnit.currentKPI && nextProps.department && !nextProps.department.unitLoading && !nextProps.department.unit && createKpiUnit?.currentKPI?.organizationalUnit?.parent) {
            this.props.getOrganizationalUnit(createKpiUnit?.currentKPI?.organizationalUnit?.parent);
        }
            
        // Khi truy vấn API đã có kết quả
        if (!employeeKpiSet.approver && user.userdepartments && user.userdepartments.managers && Object.keys(user.userdepartments.managers).length > 0 && user.userdepartments.managers?.[Object.keys(user.userdepartments.managers)?.[0]]?.members?.length > 0) { // Nếu có trưởng đơn vị
            let members = user.userdepartments.managers?.[Object.keys(user.userdepartments.managers)?.[0]]?.members;
            if (members?.length) {
                this.setState(state => {
                    return {
                        ...state,
                        employeeKpiSet: {
                            ...state.employeeKpiSet,
                            approver: members[0] && members[0]._id
                        }
                    };
                });
                return false; // Sẽ cập nhật lại state nên không cần render
            }
        } else if (!employeeKpiSet.approver && nextProps.department?.unit?.managers?.[0]?.users && nextProps.department?.unit?.managers?.[0]?.users.length > 0) { // Nếu có trưởng đơn vị
            let members = nextProps.department?.unit?.managers?.[0]?.users;
            if (members?.length) {
                this.setState(state => {
                    return {
                        ...state,
                        employeeKpiSet: {
                            ...state.employeeKpiSet,
                            approver: members?.[0]?.userId?.id
                        }
                    };
                });
                return false; // Sẽ cập nhật lại state nên không cần render
            }
        }

        return true;
    }

    /**Thay đổi người phê duyệt */
    handleApproverChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                employeeKpiSet: {
                    ...state.employeeKpiSet,
                    approver: value[0],
                }
            }
        });
    }

    /**Gửi request khởi tạo tập KPI cá nhân mới */
    handleCreateEmployeeKpiSet = async () => {
        const { employeeKpiSet } = this.state;


        if (employeeKpiSet.organizationalUnit && employeeKpiSet.month && employeeKpiSet.approver) {//&& employeeKpiSet.creator
            this.props.createEmployeeKpiSet(employeeKpiSet);
            window.$("#createEmployeeKpiSet").modal("hide");
        }
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [month, year].join('-');
    }

    render() {
        const { user, department, translate } = this.props;
        const { _id, employeeKpiSet, organizationalUnit } = this.state;
        let managers = [];

        if (user?.userdepartments) {
            managers = getEmployeeSelectBoxItems([user.userdepartments], true, false, false);
        }
        if (department?.unit) {
            let temp;
            temp = {
                text: department?.unit?.name,
                value: []
            }
            if (department?.unit?.managers?.[0]?.users) {
                department.unit.managers[0].users.map(item => {
                    temp.value.push({
                        value: item?.userId?.id,
                        text: item?.userId?.name + ' (' + department.unit.managers[0]?.name + ')'
                    })
                })
            }

            if (managers) {
                managers.push(temp);
            }
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID="createEmployeeKpiSet" isLoading={false}
                    formID="formCreateEmployeeKpiSet"
                    title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.initialize_kpi_set')}
                    msg_success={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.success')}
                    msg_faile={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.failure')}
                    func={this.handleCreateEmployeeKpiSet}
                >
                    <form className="form-group" id="formCreateEmployeeKpiSet" onSubmit={() => this.handleCreateEmployeeKpiSet(translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.success'))}>
                        {/* Tên đơn vị */}
                        <div className="form-group">
                            <label className="col-sm-2">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.organizational_unit')}</label>
                            <label className="col-sm-10" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{organizationalUnit && organizationalUnit.name}</label>
                        </div>

                        {/* Tháng */}
                        <div className="form-group">
                            <label className="col-sm-2">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.month')}</label>
                            {this.formatDate(employeeKpiSet.month)}
                        </div>

                        {/**Chọn người phê duyệt tập KPI này */}
                        {managers &&
                            <div className="col-sm-12 form-group">
                                <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
                                <SelectBox
                                    id={`createEmployeeKpiSet${_id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={managers}
                                    multiple={false}
                                    onChange={this.handleApproverChange}
                                    value={employeeKpiSet ? employeeKpiSet.approver : ""}
                                />
                            </div>
                        }
                        <div className="col-sm-12 form-group" >
                            <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.default_target')}</label>
                            <ul>
                                <li>Hỗ trợ thực hiện công việc</li>
                                <li>Phê duyệt công việc</li>
                            </ul>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, createKpiUnit, department, createEmployeeKpiSet } = state;
    return { user, createKpiUnit, department, createEmployeeKpiSet };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    createEmployeeKpiSet: createKpiSetActions.createEmployeeKpiSet,
    getOrganizationalUnit: DepartmentActions.getOrganizationalUnit
};

const connectedModalCreateEmployeeKpiSet = connect(mapState, actionCreators)(withTranslate(ModalCreateEmployeeKpiSet));
export { connectedModalCreateEmployeeKpiSet as ModalCreateEmployeeKpiSet };
