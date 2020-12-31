import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';
import { SelectBox } from '../../../../common-components/index';

import { performTaskAction } from './../redux/actions';

class CollaboratedWithOrganizationalUnits extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAssigned: false,
            responsibleEmployees: undefined,
            consultedEmployees: undefined,

            employeeCollaboratedWithUnit: {
                isAssigned: false,
                responsibleEmployees: undefined,
                consultedEmployees: undefined
            },

            unitId: undefined,
            editCollaboratedTask: false
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.performtasks?.task?.logs !== this.props.performtasks?.task?.logs) {
            nextProps.performtasks?.task && this.props.getTaskLog(nextProps.performtasks?.task?._id);
            return true;
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.unitId !== prevState.unitId) {
            // Xử lý nhân viên tham gia công việc phối hợp đơn vị
            let responsibleEmployees = [], consultedEmployees = [], isAssigned = false;
            let employeeSelectBox = nextProps.employeeSelectBox && nextProps.employeeSelectBox.value;
            let task = nextProps.task;

            if (employeeSelectBox && employeeSelectBox.length !== 0) {
                if (task) {
                    if (task.responsibleEmployees && task.responsibleEmployees.length !== 0) {
                        task.responsibleEmployees.filter(item => {
                            let temp = employeeSelectBox.filter(employee => employee.value === item._id);
                            if (temp && temp.length !== 0) return true;
                        }).map(item => {
                            if (item) {
                                responsibleEmployees.push(item._id);
                            }
                        })
                        task.consultedEmployees.filter(item => {
                            let temp = employeeSelectBox.filter(employee => employee.value === item._id);
                            if (temp && temp.length !== 0) return true;
                        }).map(item => {
                            if (item) {
                                consultedEmployees.push(item._id);
                            }
                        })
                    }

                    if (task.collaboratedWithOrganizationalUnits && task.collaboratedWithOrganizationalUnits.length !== 0) {
                        let currentUnit = task.collaboratedWithOrganizationalUnits.filter(item => {
                            if (item.organizationalUnit && item.organizationalUnit._id === nextProps.employeeSelectBox.id) {
                                return true
                            }
                        })
                        if (currentUnit && currentUnit[0]) {
                            isAssigned = currentUnit[0].isAssigned;
                        }
                    }

                }
            }

            return {
                ...prevState,
                unitId: nextProps.unitId,
                employeeSelectBox: nextProps.employeeSelectBox,
                task: nextProps.task,

                isAssigned: isAssigned,
                responsibleEmployees: responsibleEmployees,
                consultedEmployees: consultedEmployees,

                employeeCollaboratedWithUnit: {
                    isAssigned: isAssigned,
                    responsibleEmployees: responsibleEmployees,
                    consultedEmployees: consultedEmployees
                }
            }
        } else {
            return null;
        }
    }

    /** Xác nhận phân công công việc */
    handleCheckBoxAssigned = () => {
        this.setState(state => {
            return {
                ...state,
                isAssigned: !this.state.isAssigned
            }
        })
    }

    /** Chỉnh sửa người tham gia */
    handleCancelEditCollaboratedTask = () => {
        const { employeeCollaboratedWithUnit } = this.state;
        this.setState(state => {
            return {
                ...state,
                editCollaboratedTask: false,
                responsibleEmployees: employeeCollaboratedWithUnit && employeeCollaboratedWithUnit.responsibleEmployees,
                consultedEmployees: employeeCollaboratedWithUnit && employeeCollaboratedWithUnit.consultedEmployees,
                isAssigned: employeeCollaboratedWithUnit && employeeCollaboratedWithUnit.isAssigned
            }
        })
    }

    /** Chọn người thực hiện cho công việc phối hợp với đơn vị khác */
    handleChangeResponsibleCollaboratedTask = (value) => {
        this.setState(state => {
            return {
                ...state,
                responsibleEmployees: value
            }
        })
    }

    /** Chọn người hỗ trợ cho công việc phối hợp với đơn vị khác */
    handleChangeConsultedCollaboratedTask = (value) => {
        this.setState(state => {
            return {
                ...state,
                consultedEmployees: value
            }
        })
    }

    /** Lưu thay đổi nhân viên tham gia công việc phối hợp với đơn vị khác */
    saveCollaboratedTask = (taskId) => {
        const { employeeCollaboratedWithUnit, responsibleEmployees, consultedEmployees, isAssigned, unitId } = this.state;

        let newEmployeeCollaboratedWithUnit = {
            unitId: unitId,
            isAssigned: isAssigned,
            oldResponsibleEmployees: employeeCollaboratedWithUnit.responsibleEmployees,
            oldConsultedEmployees: employeeCollaboratedWithUnit.consultedEmployees,
            responsibleEmployees: responsibleEmployees,
            consultedEmployees: consultedEmployees,
        }
        
        this.props.editEmployeeCollaboratedWithOrganizationalUnits(taskId, newEmployeeCollaboratedWithUnit);
        
        this.setState(state => {
            return {
                ...state,
                editCollaboratedTask: false,
                employeeCollaboratedWithUnit: {
                    ...state.employeeCollaboratedWithUnit,
                    isAssigned: isAssigned,
                    responsibleEmployees: responsibleEmployees,
                    consultedEmployees: consultedEmployees,

                }
            }
        })
    }

    render() {
        const { task, translate } = this.props;
        const { editCollaboratedTask, employeeCollaboratedWithUnit, employeeSelectBox, unitId, responsibleEmployees, consultedEmployees, isAssigned } = this.state;

        let responsibleEmployeesOfUnit, consultedEmployeesOfUnit;
        if (employeeCollaboratedWithUnit) {
            if (employeeCollaboratedWithUnit.responsibleEmployees && employeeCollaboratedWithUnit.responsibleEmployees.length !== 0
                && task && task.responsibleEmployees && task.responsibleEmployees.length !== 0) {
                responsibleEmployeesOfUnit = task.responsibleEmployees.filter(
                    item => {
                        if (employeeCollaboratedWithUnit.responsibleEmployees.includes(item._id)) {
                            return true;
                        }
                    }
                )
            }
            if (employeeCollaboratedWithUnit.consultedEmployees && employeeCollaboratedWithUnit.consultedEmployees.length !== 0
                && task && task.consultedEmployees && task.consultedEmployees.length !== 0) {
                consultedEmployeesOfUnit = task.consultedEmployees.filter(
                    item => {
                        if (employeeCollaboratedWithUnit.consultedEmployees.includes(item._id)) {
                            return true;
                        }
                    }
                )
            }
        }

        return (
            <React.Fragment>
                {task && employeeSelectBox && employeeSelectBox.length !== 0
                    && <div className="description-box">
                        <h4>{translate('task.task_management.role_in_collaborated_unit')} {employeeSelectBox && employeeSelectBox.text}</h4>

                        {editCollaboratedTask
                            ? <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        title={translate('task.task_process.export_info')}
                                        onClick={() => this.handleCheckBoxAssigned()}
                                        checked={isAssigned}
                                    />
                                    <strong>{translate('task.task_management.confirm_assigned')}</strong>
                                </label>
                                <div className="form-group no-line-height">
                                    <label>{translate('task.task_management.responsible')}</label>
                                    <SelectBox
                                        id={`multiSelectResponsibleEmployee${unitId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={employeeSelectBox && employeeSelectBox.value}
                                        onChange={this.handleChangeResponsibleCollaboratedTask}
                                        value={responsibleEmployees}
                                        multiple={true}
                                    />
                                </div>
                                <div className="form-group no-line-height">
                                    <label>{translate('task.task_management.consulted')}</label>
                                    <SelectBox
                                        id={`multiSelectConsultedEmployee${unitId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={employeeSelectBox && employeeSelectBox.value}
                                        onChange={this.handleChangeConsultedCollaboratedTask}
                                        value={consultedEmployees}
                                        multiple={true}
                                    />
                                </div>
                            </div>
                            : <div>
                                {/* Đã/Chưa xác nhận phân công công việc*/}
                                {employeeCollaboratedWithUnit && employeeCollaboratedWithUnit.isAssigned
                                    ? <strong><a className="fa fa-check" style={{ color: "green" }}></a> {translate('task.task_management.confirm_assigned_success')}</strong>
                                    : <strong><a className="fa fa-exclamation-triangle" style={{ color: "red" }}></a> {translate('task.task_management.confirm_assigned_failure')}</strong>
                                }
                                <br />

                                {/* Người thực hiện */}
                                <strong>{translate('task.task_management.responsible')}:</strong>
                                {
                                    (employeeCollaboratedWithUnit && employeeCollaboratedWithUnit.responsibleEmployees && employeeCollaboratedWithUnit.responsibleEmployees.length !== 0)
                                        ? <span>
                                            {
                                                responsibleEmployeesOfUnit && responsibleEmployeesOfUnit.length !== 0
                                                && responsibleEmployeesOfUnit.map((item, index) => {
                                                    let seperator = index !== 0 ? ", " : "";
                                                    if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                        return <span key={index}><strike>{seperator}{item.name}</strike></span>
                                                    } else {
                                                        return <span key={index}>{seperator}{item.name}</span>
                                                    }
                                                })
                                            }
                                        </span>
                                        : <span>{translate('task.task_management.task_empty_employee')}</span>
                                }
                                <br />
                                {/* Người hỗ trợ */}
                                <strong>{translate('task.task_management.consulted')}:</strong>
                                {
                                    (employeeCollaboratedWithUnit && employeeCollaboratedWithUnit.consultedEmployees && employeeCollaboratedWithUnit.consultedEmployees.length !== 0)
                                        ? <span>
                                            {
                                                consultedEmployeesOfUnit && consultedEmployeesOfUnit.length !== 0
                                                && consultedEmployeesOfUnit.map((item, index) => {
                                                    let seperator = index !== 0 ? ", " : "";
                                                    if (task.inactiveEmployees.indexOf(item._id) !== -1) { // tìm thấy item._id
                                                        return <span key={index}><strike>{seperator}{item.name}</strike></span>
                                                    } else {
                                                        return <span key={index}>{seperator}{item.name}</span>
                                                    }
                                                })
                                            }
                                        </span>
                                        : <span>{translate('task.task_management.task_empty_employee')}</span>
                                }
                            </div>
                        }

                        {editCollaboratedTask
                            ? <div class="row">
                                <div className="col-xs-6">
                                    <button type="button" className={`btn btn-danger btn-block`} onClick={() => this.handleCancelEditCollaboratedTask()}>Hủy</button>
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className={`btn btn-success btn-block`} onClick={() => this.saveCollaboratedTask(task._id)}>Lưu</button>
                                </div>

                            </div>
                            : <div style={{ marginTop: 7 }}>
                                <button className={`btn btn-block btn-default`} onClick={() => this.setState(state => { return { ...state, editCollaboratedTask: true } })} title="Chỉnh sửa">Chỉnh sửa</button>
                            </div>
                        }
                    </div>
                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { performtasks } = state;
    return { performtasks }
}

const actions = {
    editEmployeeCollaboratedWithOrganizationalUnits: performTaskAction.editEmployeeCollaboratedWithOrganizationalUnits,
    getTaskLog: performTaskAction.getTaskLog,
}

const connectedCollaboratedWithOrganizationalUnits = connect(mapState, actions)(withTranslate(CollaboratedWithOrganizationalUnits));
export { connectedCollaboratedWithOrganizationalUnits as CollaboratedWithOrganizationalUnits }