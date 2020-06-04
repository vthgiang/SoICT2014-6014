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
import { taskTemplateConstants } from '../../task-template/redux/constants';

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
                taskTemplate: "",
                parent: "",
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
                        errorOnName: undefined,
                        errorOnDescription: undefined,
                        errorOnResponsibleEmployees: undefined,
                        errorOnAccountableEmployees: undefined,
                    }
                };
            });
        }
    }


    handleChangeTaskTemplate =  async (event) => {
        let value = event.target.value;
        
        if(value ===""){
            this.setState(state =>{
                return{
                    ...state,
                    newTask: { // update lại name,description và reset các selection phía sau
                        ...this.state.newTask,
                        name:"",
                        description: "",
                        priority: 3,
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        consultedEmployees: [],
                        informedEmployees: [],
                        taskTemplate: "",
                        errorOnName: undefined,
                        errorOnDescription: undefined,
                        errorOnResponsibleEmployees: undefined,
                        errorOnAccountableEmployees: undefined,
                    }
                };
            });
        }
        else{
            let taskTemplate = this.props.tasktemplates.items.find(function(taskTemplate) {                
                return taskTemplate._id === value; 
            });

            this.setState(state =>{
                return{
                    ...state,
                    newTask: { // update lại name,description và reset các selection phía sau
                        ...this.state.newTask,
                        name: taskTemplate.name,
                        description: taskTemplate.description,
                        priority: taskTemplate.priority,
                        responsibleEmployees: taskTemplate.responsibleEmployees,
                        accountableEmployees: taskTemplate.accountableEmployees,
                        consultedEmployees: taskTemplate.consultedEmployees,
                        informedEmployees: taskTemplate.informedEmployees,
                        taskTemplate: taskTemplate._id,
                    }
                };
            });
        } 
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

    shouldComponentUpdate = (nextProps, nextState) => {
        const { user } = this.props;
        const { newTask } = this.state;

        // Khi truy vấn lấy các đơn vị của user đã có kết quả, và thuộc tính đơn vị của newTask chưa được thiết lập
        if (newTask.organizationalUnit === "" && user.organizationalUnitsOfUser) {
            // Tìm unit mà currentRole của user đang thuộc về
            
            let defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);

            this.setState(state =>{ // Khởi tạo giá trị cho organizationalUnit của newTask
                return{
                    ...state,
                    newTask: {
                        ...this.state.newTask,
                        organizationalUnit: defaultUnit._id,
                       
                    }
                };
            });
            return false; // Sẽ cập nhật lại state nên không cần render
        }
        
        if(newTask.taskTemplate !== nextState.newTask.taskTemplate){
            
           return true;
        }
      
        return true;
    }

   
    render() {
        var units, userdepartments, listTaskTemplate, listKPIPersonal, usercompanys;
        const { newTask } = this.state;
        const { tasktemplates, user, KPIPersonalManager } = this.props; //kpipersonals
        
        var taskTemplate,responsibleEmployees;
        if(tasktemplates.taskTemplate) 
        { 
            taskTemplate =tasktemplates.taskTemplate;
            
        }
        
        if (tasktemplates.items && newTask.organizationalUnit) {
            listTaskTemplate = tasktemplates.items.filter(function(taskTemplate) {    
          
                return taskTemplate.organizationalUnit._id === newTask.organizationalUnit;
            });
        }
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
        }
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (user.usercompanys) usercompanys = user.usercompanys;

        let unitMembers;
        if (userdepartments) {
            unitMembers = [
                {
                    text: userdepartments.roles.dean.name,
                    value: userdepartments.deans.map(item => {return {text: item.name, value: item._id}})
                },
                {
                    text: userdepartments.roles.viceDean.name,
                    value: userdepartments.viceDeans.map(item => {return {text: item.name, value: item._id}})
                },
                {
                    text: userdepartments.roles.employee.name,
                    value: userdepartments.employees.map(item => {return {text: item.name, value: item._id}})
                },
            ]
        }

        // if (kpipersonals.kpipersonals) listKPIPersonal = kpipersonals.kpipersonals;
        if (KPIPersonalManager.kpipersonals) listKPIPersonal = KPIPersonalManager.kpipersonals;
        
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID={`addNewTask${this.props.id}`} isLoading={false}
                    formID="form-add-new-task"
                    disableSubmit={!this.isTaskFormValidated()}
                    func={this.handleSubmit}
                    title="Thêm công việc mới"
                >

                    <div className="col-sm-6">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin công việc</legend>
                            <div className={'form-group'}>
                                <label className="control-label">Đơn vị*</label>
                                
                                {units &&
                                <select value={newTask.organizationalUnit} className="form-control"onChange={this.handleChangeTaskOrganizationalUnit}>
                                    {units.map(x => {
                                        return <option key={x._id} value={x._id}>{x.name}</option>
                                    })}
                                </select>
                                }
                            </div>
                            
                            { (listTaskTemplate && listTaskTemplate.length !== 0) &&
                            <div className="form-group ">
                                <label className="control-label">Mẫu công việc</label>
                                
                                <select className="form-control" value={newTask.taskTemplate} onChange={this.handleChangeTaskTemplate}>
                                    <option value="">--Hãy chọn mẫu công việc--</option>
                                    {
                                        listTaskTemplate.map(item => {
                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            }


                            <div className={`form-group ${newTask.errorOnName===undefined?"":"has-error"}`}>
                                <label>Tên công việc*</label>
                                <input type="Name" className="form-control" placeholder="Tên công việc" value={(newTask.name)} onChange={this.handleChangeTaskName} />
                                <ErrorLabel content={newTask.errorOnName}/>
                            </div>
                            <div className={`form-group ${newTask.errorOnDescription===undefined?"":"has-error"}`}>
                                <label className="control-label">Mô tả công việc</label>
                                <textarea type="Description" className="form-control" name="Mô tả công việc" placeholder="Mô tả công việc" value={newTask.description} onChange={this.handleChangeTaskDescription}/>
                                <ErrorLabel content={newTask.errorOnDescription}/>
                            </div>
                            <div className="row form-group">
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnStartDate===undefined?"":"has-error"}`}>
                                    <label className="control-label">Ngày bắt đầu*:</label>
                                    <DatePicker 
                                        id="datepicker1"
                                        dateFormat="day-month-year"
                                        value={newTask.startDate}
                                        onChange={this.handleChangeTaskStartDate}
                                    />
                                    <ErrorLabel content={newTask.errorOnStartDate}/>
                                </div>
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnEndDate===undefined?"":"has-error"}`}>
                                    <label className="control-label">Ngày kết thúc*:</label>
                                    <DatePicker 
                                        id="datepicker2"
                                        value={newTask.endDate}
                                        onChange={this.handleChangeTaskEndDate}
                                    />
                                    <ErrorLabel content={newTask.errorOnEndDate}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Mức độ ưu tiên</label>
                                <select className="form-control" value={newTask.priority} onChange={this.handleChangeTaskPriority}>
                                    <option value={3}>Cao</option>
                                    <option value={2}>Trung bình</option>
                                    <option value={1}>Thấp</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Công việc cha</label>
                                <select className="form-control" value={newTask.parent} onChange={this.handleChangeTaskParent}>
                                    <option value="">--Hãy chọn công việc cha--</option>
                                    {this.props.currentTasks &&
                                        this.props.currentTasks.map(item => {
                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                        })}
                                </select>
                            </div>
                        </fieldset>
                    </div>
                    
                    <div className="col-sm-6">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Phân định trách nhiệm (RACI)</legend>
                            <div className={`form-group ${newTask.errorOnResponsibleEmployees===undefined?"":"has-error"}`}>
                                <label className="control-label">Người thực hiện*</label>
                                {unitMembers &&
                                <SelectBox
                                    id={`responsible-select-box${newTask.taskTemplate}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items={unitMembers}
                                    onChange={this.handleChangeTaskResponsibleEmployees}                                            
                                    value ={newTask.responsibleEmployees}
                                    multiple={true}
                                    options={{placeholder: "Chọn người thực hiện"}}
                                />
                                }
                                <ErrorLabel content={newTask.errorOnResponsibleEmployees}/>
                            </div>

                            <div className={`form-group ${newTask.errorOnAccountableEmployees===undefined?"":"has-error"}`}>
                                <label className="control-label">Người phê duyệt*</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`accounatable-select-box${newTask.taskTemplate}`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={unitMembers}
                                        onChange={this.handleChangeTaskAccountableEmployees}
                                        value ={newTask.accountableEmployees}
                                        multiple={true}
                                        options={{placeholder: "Chọn người phê duyệt"}}
                                    />
                                }
                                <ErrorLabel content={newTask.errorOnAccountableEmployees}/>
                            </div>

                            <div className='form-group'>
                                <label className="control-label">Người hỗ trợ</label>
                                {usercompanys &&
                                    <SelectBox
                                        id={`consulted-select-box${newTask.taskTemplate}`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={
                                            usercompanys.map(x => {
                                                return {value: x._id, text: x.name};
                                            })
                                        }
                                        onChange={this.handleChangeTaskConsultedEmployees}
                                        value ={newTask.consultedEmployees}
                                        multiple={true}
                                        options={{placeholder: "Chọn người hỗ trợ"}}
                                    />
                                }
                            </div>
                            <div className='form-group'>
                                <label className="control-label">Người quan sát</label>
                                {usercompanys &&
                                    <SelectBox
                                        id={`informed-select-box${newTask.taskTemplate}`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items={
                                            usercompanys.map(x => {
                                                return {value: x._id, text: x.name};
                                            })
                                        }
                                        onChange={this.handleChangeTaskInformedEmployees}
                                        value ={newTask.informedEmployees}
                                        multiple={true}
                                        options={{placeholder: "Chọn người quan sát"}}
                                    />
                                }
                            </div>
                        </fieldset>
                    </div>
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
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
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