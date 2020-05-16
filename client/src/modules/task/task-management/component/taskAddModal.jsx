import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    getStorage
} from '../../../../config';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { taskTemplateActions } from '../../../task/task-template/redux/actions';
import { taskManagementActions } from '../redux/actions';
import { DialogModal, DatePicker, SelectBox, ErrorLabel } from '../../../../common-components';

import { TaskFormValidator} from './taskFormValidator';

class ModalAddTask extends Component {

    componentDidMount() {
        // get id current role
        this.props.getTaskTemplateByUser("1", "0", "[]"); //pageNumber, noResultsPerPage, arrayUnit, name=""
        // Lấy tất cả nhân viên trong công ty
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getAllUserOfCompany();
    }

    constructor(props) {
        super(props);
        this.state = {
            newTask: {
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                priority: 3,
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                creator: getStorage("userId"),
                organizationalUnit: "",
                taskTemplate: null,
                parent: null,
            },

            currentRole: getStorage('currentRole'),
        };
    }

    
    handleSubmit = async (event) => {
        const { newTask } = this.state;
        this.props.addTask(newTask);
    }

    isTaskFormValidated = () => {
        let result = 
            this.validateTaskName(this.state.newTask.name, false) &&
            this.validateTaskDescription(this.state.newTask.description, false) &&
            this.validateTaskStartDate(this.state.newTask.startDate, false) &&
            this.validateTaskEndDate(this.state.newTask.endDate, false) &&
            this.validateTaskAccountableEmployees(this.state.newTask.accountableEmployees, false) &&
            this.validateTaskResponsibleEmployees(this.state.newTask.responsibleEmployees, false);
        return result;
    }

    handleChangeTaskName = (event) => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }
    validateTaskName = (value, willUpdateState=true) => {
        let msg = TaskFormValidator.validateTaskName(value);

        if (willUpdateState){
            this.state.newTask.name = value;
            this.state.newTask.errorOnName = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }



    handleChangeTaskDescription = (event) => {
        let value = event.target.value;
        this.validateTaskDescription(value, true);
    }
    validateTaskDescription = (value, willUpdateState=true) => {
        let msg = TaskFormValidator.validateTaskDescription(value);

        if (willUpdateState){
            this.state.newTask.description = value;
            this.state.newTask.errorOnDescription = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }





    handleChangeTaskStartDate = (value) => {
        this.validateTaskStartDate(value, true);
    }
    validateTaskStartDate = (value, willUpdateState=true) => {
        let msg = TaskFormValidator.validateTaskStartDate(value);

        if (willUpdateState){
            this.state.newTask.startDate = value;
            this.state.newTask.errorOnStartDate= msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    handleChangeTaskEndDate = (value) => {
        this.validateTaskEndDate(value, true);
    }
    validateTaskEndDate = (value, willUpdateState=true) => {
        let msg = TaskFormValidator.validateTaskEndDate(this.state.newTask.startDate, value);

        if (willUpdateState){
            this.state.newTask.endDate = value;
            this.state.newTask.errorOnEndDate= msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }



    handleChangeTaskPriority = (event) => {
        this.state.newTask.priority = event.target.value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }


    handleChangeTaskOrganizationalUnit = (event) => {
        event.preventDefault();
        let value = event.target.value;
        if (value) {
            this.props.getAllUserOfDepartment(value);
            this.setState(state =>{
                return{
                    ...state,
                    newTask: { // update lại unit, và reset các selection phía sau
                        ...this.state.newTask,
                        organizationalUnit: value,
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        consultedEmployees: [],
                        informedEmployees: [],
                    }
                };
            });
        }
    }


    handleChangeTaskTemplate = async (event) => {
        let value = event.target.value;
        this.state.newTask.taskTemplate = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
        this.handleRACI();
    }
    handleRACI = () => {
        // TODO: Gọi service, thiết lập đơn vị, lấy dữ liệu và điền vào các trường RACI
    }


    handleChangeTaskParent = (event) => {
        let value = event.target.value;
        this.state.newTask.parent = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }






    handleChangeTaskResponsibleEmployees = (value) => {
        this.validateTaskResponsibleEmployees(value, true);
    }
    validateTaskResponsibleEmployees = (value, willUpdateState=true) => {
        let msg = TaskFormValidator.validateTaskResponsibleEmployees(value);

        if (willUpdateState){
            this.state.newTask.responsibleEmployees = value;
            this.state.newTask.errorOnResponsibleEmployees = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }


    handleChangeTaskAccountableEmployees = (value) => {
        this.validateTaskAccountableEmployees(value, true);
    }
    validateTaskAccountableEmployees = (value, willUpdateState=true) => {
        let msg = TaskFormValidator.validateTaskAccountableEmployees(value);

        if (willUpdateState){
            this.state.newTask.accountableEmployees = value;
            this.state.newTask.errorOnAccountableEmployees = msg;
            this.setState(state =>{
                return{
                    ...state,
                };
            });
        }
        return msg === undefined;
    }



    handleChangeTaskConsultedEmployees = (value) => {
        this.state.newTask.consultedEmployees = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }
    handleChangeTaskInformedEmployees = (value) => {
        this.state.newTask.informedEmployees = value;
        this.setState(state =>{
            return{
                ...state,
            };
        });
    }


    render() {
        var units, currentUnit, userdepartments, listTaskTemplate, listKPIPersonal, usercompanys;
        const { newTask } = this.state;
        const { tasktemplates, user, KPIPersonalManager } = this.props; //kpipersonals
        if (tasktemplates.items) {
            listTaskTemplate = tasktemplates.items;
        }
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
            currentUnit = units.find(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);

            if (newTask.organizationalUnit === ""){
                newTask.organizationalUnit = currentUnit._id; // Khởi tạo state lưu giá trị Unit Select Box
            }
        }
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (user.usercompanys) usercompanys = user.usercompanys;

        // if (kpipersonals.kpipersonals) listKPIPersonal = kpipersonals.kpipersonals;
        if (KPIPersonalManager.kpipersonals) listKPIPersonal = KPIPersonalManager.kpipersonals;

        console.log(this.state.newTask)
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`addNewTask${this.props.id}`} isLoading={false}
                    formID="form-add-new-task"
                    disableSubmit={!this.isTaskFormValidated()}
                    func={this.handleSubmit}
                    title="Thêm công việc mới"
                >
                    <form className="form-horizontal">
                        <div className="col-sm-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin công việc</legend>
                                <div className={`${newTask.errorOnName===undefined?"":"has-error"}`}>
                                    <label>Tên công việc*</label>
                                    <input type="Name" className="form-control" placeholder="Tên công việc" value={newTask.name} onChange={this.handleChangeTaskName} />
                                    <ErrorLabel content={newTask.errorOnName}/>
                                </div>
                                <div className={'form-group'}>
                                    <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Mô tả công việc</label>
                                    <div className={`col-sm-10 ${newTask.errorOnDescription===undefined?"":"has-error"}`} style={{ width: '100%' }}>
                                        <textarea type="Description" className="form-control" name="Mô tả công việc" placeholder="Mô tả công việc" value={newTask.description} onChange={this.handleChangeTaskDescription}/>
                                        <ErrorLabel content={newTask.errorOnDescription}/>
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnStartDate===undefined?"":"has-error"}`}>
                                        <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left', marginLeft: "-14px" }}>Ngày bắt đầu*:</label>
                                        <DatePicker 
                                            id="datepicker1"
                                            dateFormat="day-month-year"
                                            value={newTask.startDate}
                                            onChange={this.handleChangeTaskStartDate}
                                        />
                                        <ErrorLabel content={newTask.errorOnStartDate}/>
                                    </div>
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnEndDate===undefined?"":"has-error"}`}>
                                        <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left', marginLeft: "-14px" }}>Ngày kết thúc*:</label>
                                        <DatePicker 
                                            id="datepicker2"
                                            value={newTask.endDate}
                                            onChange={this.handleChangeTaskEndDate}
                                        />
                                        <ErrorLabel content={newTask.errorOnEndDate}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Mức độ ưu tiên</label>
                                    <div className="col-sm-10" style={{ width: '100%' }}>
                                        <select className="form-control" style={{ width: '100%' }} value={newTask.priority} onChange={this.handleChangeTaskPriority}>
                                            <option value={3}>Cao</option>
                                            <option value={2}>Trung bình</option>
                                            <option value={1}>Thấp</option>
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-sm-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Phân định trách nhiệm (RACI)</legend>
                                <div className={'form-group'}>
                                    <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Người thực hiện*</label>
                                    <div className={`col-sm-10 ${newTask.errorOnResponsibleEmployees===undefined?"":"has-error"}`} style={{ width: '100%' }}>
                                        {userdepartments &&
                                        <SelectBox
                                            id={`responsible-select-box`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items={[
                                                {
                                                    text: userdepartments[1].roleId.name,
                                                    value: [{text: userdepartments[1].userId.name, value: userdepartments[1].userId._id}]
                                                },
                                                {
                                                    text: userdepartments[2].roleId.name,
                                                    value: [{text: userdepartments[2].userId.name, value: userdepartments[2].userId._id}]
                                                },
                                            ]}
                                            onChange={this.handleChangeTaskResponsibleEmployees}
                                            multiple={true}
                                            options={{placeholder: "Chọn người thực hiện"}}
                                        />
                                        }
                                        <ErrorLabel content={newTask.errorOnResponsibleEmployees}/>
                                    </div>
                                </div>
                                <div className={'form-group'}>
                                    <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người phê duyệt*</label>
                                    <div className={`col-sm-10 ${newTask.errorOnAccountableEmployees===undefined?"":"has-error"}`} style={{ width: '100%' }}>
                                        {userdepartments &&
                                            <SelectBox
                                                id={`accounatable-select-box`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items={[
                                                    {
                                                        text: userdepartments[0].roleId.name,
                                                        value: [{text: userdepartments[0].userId.name, value: userdepartments[0].userId._id}]
                                                    },
                                                    {
                                                        text: userdepartments[1].roleId.name,
                                                        value: [{text: userdepartments[1].userId.name, value: userdepartments[1].userId._id}]
                                                    },
                                                ]}
                                                onChange={this.handleChangeTaskAccountableEmployees}
                                                multiple={true}
                                                options={{placeholder: "Chọn người phê duyệt"}}
                                            />
                                        }
                                        <ErrorLabel content={newTask.errorOnAccountableEmployees}/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người hỗ trợ</label>
                                    <div className="col-sm-10" style={{ width: '100%' }}>
                                        {usercompanys &&
                                            <SelectBox
                                                id={`consulted-select-box`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items={
                                                    usercompanys.map(x => {
                                                        return {value: x._id, text: x.name};
                                                    })
                                                }
                                                onChange={this.handleChangeTaskConsultedEmployees}
                                                multiple={true}
                                                options={{placeholder: "Chọn người hỗ trợ"}}
                                            />
                                        }
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người quan sát</label>
                                    <div className="col-sm-10" style={{ width: '100%' }}>
                                        {usercompanys &&
                                            <SelectBox
                                                id={`informed-select-box`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items={
                                                    usercompanys.map(x => {
                                                        return {value: x._id, text: x.name};
                                                    })
                                                }
                                                onChange={this.handleChangeTaskInformedEmployees}
                                                multiple={true}
                                                options={{placeholder: "Chọn người quan sát"}}
                                            />
                                        }
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <div className="col-sm-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Liên kết công việc</legend>
                                <div className={'form-group'}>
                                    <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Đơn vị*</label>
                                    <div className="col-sm-10" style={{ width: '100%' }}>
                                        {units &&
                                            <select value={currentUnit._id} className="form-control" style={{ width: '100%' }} onChange={this.handleChangeTaskOrganizationalUnit}>
                                                {units.map(x => {
                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                })}
                                            </select>}
                                    </div>
                                </div>
                                
                                <div className="form-group ">
                                    {
                                        (typeof listTaskTemplate !== "undefined" && listTaskTemplate.length !== 0) ?
                                            <div>
                                                <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Mẫu công việc</label>
                                                <div className="col-sm-10" style={{ width: '100%' }}>
                                                    {
                                                        (typeof listTaskTemplate !== "undefined" && listTaskTemplate.length !== 0) &&
                                                        <select className="form-control" style={{ width: '100%' }} value={newTask.taskTemplate} onChange={this.handleChangeTaskTemplate}>
                                                            <option value="">--Hãy chọn mẫu công việc--</option>
                                                            {
                                                                listTaskTemplate.map(item => {
                                                                    return <option key={item._id} value={item._id}>{item.name}</option>
                                                                })
                                                            }
                                                        </select>
                                                    }
                                                </div>
                                            </div> : null
                                    }
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Công việc cha</label>
                                    <div className="col-sm-10" style={{ width: '100%' }}>
                                        <select className="form-control" style={{ width: '100%' }} value={newTask.parent} onChange={this.handleChangeTaskParent}>
                                            <option value="">--Hãy chọn công việc cha--</option>
                                            {this.props.currentTasks &&
                                                this.props.currentTasks.map(item => {
                                                    return <option key={item._id} value={item._id}>{item.name}</option>
                                                })}
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasktemplates, tasks, user, KPIPersonalManager } = state;//fix--------------kpipersonals-->KPIPersonalManager-------department(s)----------
    return { tasktemplates, tasks, user, KPIPersonalManager };
}

const actionCreators = {
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    addTask: taskManagementActions.addTask,
    getDepartment: UserActions.getDepartmentOfUser,//có r
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,//có r
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,//chưa có
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    // getAllKPIPersonalByMember: managerKpiActions.getAllKPIPersonalByMember//KPIPersonalManager----managerKpiActions //bị khác với hàm dùng trong kpioverview-có tham số
    getAllKPIPersonalByUserID: managerKpiActions.getAllKPIPersonalByUserID//KPIPersonalManager----managerKpiActions //bị khác với hàm dùng trong kpioverview-có tham số
};

const connectedModalAddTask = connect(mapState, actionCreators)(ModalAddTask);
export { connectedModalAddTask as ModalAddTask };