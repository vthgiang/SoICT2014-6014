import React, { Component } from 'react';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components/';
import { taskManagementActions } from "../../task-management/redux/actions";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from "../../../../config";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { TaskInformationForm } from './taskInformationForm';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';

import Swal from 'sweetalert2'

class ModalEditTaskByAccountableEmployee extends Component {

    constructor(props) {
        super(props);

        let userId = getStorage("userId");

        let { task } = this.props;
        // let { tasks } = this.props;

        // let task = (tasks && tasks.task) && tasks.task.info;

        // khởi tạo state của task

        let statusOptions = []; statusOptions.push(task && task.status);
        let priorityOptions = []; priorityOptions.push(task && task.priority);
        let taskName = task && task.name;
        let taskDescription = task && task.description;
        let progress = task && task.progress;

        let info = {}, taskInfo = task && task.taskInformations;
        for(let i in taskInfo){
            if(taskInfo[i].type === "Date"){
                if(taskInfo[i].value){
                    info[`${taskInfo[i].code}`] = {
                        value: this.formatDate(taskInfo[i].value),
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                    // taskInfo[i].value = this.formatDate(taskInfo[i].value);
                } 
                else {
                    info[`${taskInfo[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                    // taskInfo[i].value = this.formatDate(Date.now());
                }
            }
            else if(taskInfo[i].type === "SetOfValues"){
                let splitter = taskInfo[i].extra.split('\n');
                if(taskInfo[i].value){
                    info[`${taskInfo[i].code}`] = {
                        value: [taskInfo[i].value],
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                } else{
                    info[`${taskInfo[i].code}`] = {
                        value: [splitter[0]],
                        code: taskInfo[i].code,
                        type: taskInfo[i].type
                    }
                }
                // taskInfo[i].value = taskInfo[i].value ? [taskInfo[i].value] : [splitter[0]];
            }
            else {
                info[`${taskInfo[i].code}`] = {
                    value: taskInfo[i].value,
                    code: taskInfo[i].code,
                    type: taskInfo[i].type
                }
            }            
        }
    
        let responsibleEmployees = task && task.responsibleEmployees.map(employee => { return employee._id });
        let accountableEmployees = task && task.accountableEmployees.map(employee => { return employee._id });
        let consultedEmployees = task && task.consultedEmployees.map(employee => { return employee._id });
        let informedEmployees = task && task.informedEmployees.map(employee => { return employee._id });
        // let inactiveEmployees = task && task.inactiveEmployees.map(employee => { return employee._id });
        let inactiveEmployees = task && task.inactiveEmployees;
        let listInactive = {};
        for(let i in inactiveEmployees){
            if(accountableEmployees.indexOf(inactiveEmployees[i]) !== -1){
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role:'Accountable',
                    checked: true
                }
            }
            else if(responsibleEmployees.indexOf(inactiveEmployees[i]) !== -1){
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role:'Responsible',
                    checked: true
                }
            }
            else if(consultedEmployees.indexOf(inactiveEmployees[i]) !== -1){
                listInactive[`${inactiveEmployees[i]}`] = {
                    value: inactiveEmployees[i],
                    role:'Consulted',
                    checked: true
                }
            }
        }

        this.state = {
            listInactive: listInactive,
            userId: userId,
            task: task,
            info: info,
            taskName : taskName,
            taskDescription: taskDescription,
            statusOptions :  statusOptions,
            priorityOptions : priorityOptions,
            progress: progress,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            consultedEmployees: consultedEmployees,
            informedEmployees: informedEmployees,
            inactiveEmployees: inactiveEmployees
        }    
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    // ==============================BEGIN HANDLE TASK INFORMATION===================================

    handleChangeProgress = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
        document.getElementById(`autoPoint`).innerHTML = value;
    } 

    handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state =>{
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Number'
            }
            return {
                ...state,
                // [name]: {
                //     value: value,
                //     code: name
                // },
                errorOnNumberInfo: this.validateNumberInfo(value)
            }
        })
    } 

    handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        await this.setState(state =>{
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Text'
            }
            return {
                ...state,
                // [name]: {
                //     value: value,
                //     code: name
                // },
                errorOnTextInfo: this.validateTextInfo(value)
            }
        })
    }

    handleInfoDateChange = (value, code) => {
        console.log('value', value);
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'Date'
            }
            return {
                ...state,
                errorOnInfoDate: this.validateDate(value),
                // infoDate: value,
            }
        });
    }

    handleSetOfValueChange = async (value, code) => {
        console.log('value', value);

        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'SetOfValues'
            }
            return {
                ...state,
            }
        });
    }

    handleInfoBooleanChange  = (event) => {
        let {name, value} = event.target;
        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Boolean'
            }
            return {
                ...state,
                // [name]: {
                //     value: value,
                //     code: name
                // }
                // errorOnInfoBoolean: this.validateInfoBoolean(value)
            }
        });
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = "Giá trị bắt buộc phải chọn";
        }
        
        return msg;
    }

    validateTextInfo = (value) =>{
        let msg = undefined;
        if(value === ""){
            msg = "Giá trị không được để trống"
        }
        return msg;
    }

    validateNumberInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    // ==============================END HANDLE TASK INFORMATION===================================


    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }
        
        return msg;
    }

    validatePoint = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    changeActiveEmployees = async (listInactive) => {
        let inactiveEmployees = [];
        for(let i in listInactive){
            if(listInactive[i].checked === true){
                inactiveEmployees.push(listInactive[i].value);
            }
        }
        await this.setState(state => {
            return {
                ...state,
                inactiveEmployees: inactiveEmployees
            }
        });
    }

    
    handleChangeActiveAccountable = async (e, id) =>{
        let {task} = this.state;
        let target = e.target;
        let { value, name, checked } = target;
        
        let numOfResponsible = this.state.responsibleEmployees.length;
        let numOfAccountable = this.state.accountableEmployees.length;
        
        await this.setState(state => {
            state.listInactive[`${id}`] = { // accountable
                value: value,
                checked: checked,
                role: 'Accountable'
            }
            return {
                ...state,
            }
        });
        
        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;
        
        for(let i in listInactive) {
            if(listInactive[i].checked === true){
                if(task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if(task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }
        
        console.log('==========================',numOfInactiveAcc, numOfInactiveResp);
        
        if(numOfAccountable === numOfInactiveAcc) {
            Swal.fire({
                title: "Phải có tối thiểu một người phê duyệt",
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Xác nhận",
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = { // accountable
                        value: value,
                        checked: false,
                        role: 'Accountable'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if(numOfInactiveResp === numOfResponsible ) {
            Swal.fire({
                title: "Phải có tối thiểu một người thực hiện",
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Xác nhận",
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = { // accountable
                        value: value,
                        checked: false,
                        role: 'Accountable'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    handleChangeActiveResponsible = async (e, id) =>{
        let {task} = this.state;
        let target = e.target;
        let { value, name, checked } = target;
        
        let numOfResponsible = task.responsibleEmployees.length;
        let numOfAccountable = task.accountableEmployees.length;

        await this.setState(state => {
            state.listInactive[`${id}`] = { // responsible
                value: value,
                checked: checked,
                role: 'Responsible'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;
        
        for(let i in listInactive) {
            if(listInactive[i].checked === true){
                if(task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if(task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }
        
        console.log('==========================',numOfInactiveAcc, numOfInactiveResp);

        if(numOfInactiveResp === numOfResponsible ) {
            Swal.fire({
                title: "Phải có tối thiểu một người thực hiện",
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Xác nhận",
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = { // accountable
                        value: value,
                        checked: false,
                        role: 'Responsible'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if(numOfAccountable === numOfInactiveAcc) {
            Swal.fire({
                title: "Phải có tối thiểu một người phê duyệt",
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Xác nhận",
            }).then((res) => {
                this.setState(state => {
                    state.listInactive[`${id}`] = { // accountable
                        value: value,
                        checked: false,
                        role: 'Responsible'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
    }

    handleChangeActiveConsulted = async (e, id) =>{
        let {task} = this.state;
        let target = e.target;
        let { value, name, checked } = target;
        
        let numOfResponsible = this.state.responsibleEmployees.length;
        let numOfAccountable = this.state.accountableEmployees.length;

        await this.setState(state => {
            state.listInactive[`${id}`] = { // consulted
                value: value,
                checked: checked,
                role: 'Consulted'
            }
            return {
                ...state,
            }
        });

        let numOfInactiveResp = 0, numOfInactiveAcc = 0, listInactive = this.state.listInactive;
        
        for(let i in listInactive) {
            if(listInactive[i].checked === true){
                if(task.responsibleEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1;
                if(task.accountableEmployees.map(e => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1;
            }
        }
        
        console.log('==========================',numOfInactiveAcc, numOfInactiveResp);

        if(numOfAccountable === numOfInactiveAcc) {
            Swal.fire({
                title: "Phải có tối thiểu một người phê duyệt",
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Xác nhận",
            }).then((res) => {
                numOfInactiveResp = numOfInactiveResp - 1;
                numOfInactiveAcc = numOfInactiveAcc - 1;
                this.setState(state => {
                    state.listInactive[`${id}`] = { // 
                        value: value,
                        checked: false,
                        role: 'Consulted'
                    }
                    return {
                        ...state,
                    }
                });
            });
        }
        else if(numOfInactiveResp === numOfResponsible ) {
            Swal.fire({
                title: "Phải có tối thiểu một người thực hiện",
                type: 'Warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Xác nhận",
            }).then((res) => {
                numOfInactiveResp = numOfInactiveResp - 1;
                numOfInactiveAcc = numOfInactiveAcc - 1;
                this.setState(state => {
                    state.listInactive[`${id}`] = { // 
                        value: value,
                        checked: false,
                        role: 'Consulted'
                    }
                    return {
                        ...state,
                    }
                });
            });
        } 
    }

    handleTaskNameChange = event => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }

    validateTaskName = (value, willUpdateState) => {
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = "Tên công việc không được để trống";
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskName: value,
                    errorTaskName: errorMessage
                }
            })
        }
        return errorMessage === undefined;
    }

    handleTaskDescriptionChange = event => {
        let value = event.target.value;
        this.validateTaskDescription(value, true);
    }

    validateTaskDescription = (value, willUpdateState) => {
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = "Mô tả công việc không được để trống";
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskDescription: value,
                    errorTaskDescription: errorMessage,
                }
            })
        }
        return errorMessage === undefined;
    }

    handleTaskProgressChange = event => {
        let value = event.target.value;
        this.validateTaskProgress(value, true);
    }

    validateTaskProgress = (value, willUpdateState) => {
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = "Hãy nhập mức độ hoàn thành công việc";
        }
        if (value !== undefined && isNaN(value)) {
            errorMessage = "Mức độ hoàn thành phải có định dạng number";
        }
        if (value < 0 || value > 100) {
            errorMessage = "Mức độ hoàn thành phải trong khoảng 0 - 100";
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskProgress: value,
                    errorTaskProgress: errorMessage,
                }
            })
        }
        return errorMessage === undefined;
    }

    isFormValidated = () => {
        var {info} = this.state;
        var check = true;
        for(let i in info) {
            if(info[i].value === undefined ) {
                check = false;
                break;
            }
        }
        // check &&
        return  this.validateTaskName(this.state.taskName, false)
            && this.validateTaskDescription(this.state.taskDescription, false)
            && this.validateTaskProgress(this.state.taskProgress, false);
    }

    handleSelectedPriority = (value) => {
        // console.log("selected priority"),
        this.setState(state=>{
            return {
                ...state,
                priorityOptions: value
            }
        });
    }

    handleSelectedStatus = (value) => {
        // console.log("selected status")
        this.setState(state=> {
            return {
                ...state,
                statusOptions: value
            }
        })
    }

    handleSelectedResponsibleEmployee = (value) => {
        // console.log('selected responsible employee');
        this.setState(state=>{
            return {
                ...state,
                responsibleEmployees: value
            }
        });
    }
    handleSelectedAccountableEmployee = (value) => {
        // console.log('selected responsible employee');
        this.setState(state=>{
            return {
                ...state,
                accountableEmployees: value
            }
        });
    }
    handleSelectedConsultedEmployee = (value) => {
        // console.log('selected responsible employee');
        this.setState(state=>{
            return {
                ...state,
                consultedEmployees: value
            }
        });
    }
    handleSelectedInformEmployee = (value) => {
        // console.log('selected responsible employee');
        this.setState(state=>{
            return {
                ...state,
                informedEmployees: value
            }
        });
    }

    save = () => {

        let listInactive = this.state.listInactive, taskId, inactiveEmployees = [];
        taskId = this.props.id;
        for(let i in listInactive){
            if(listInactive[i].checked !== undefined && listInactive[i].checked === true){
                inactiveEmployees.push(listInactive[i].value);
            }
        }
        let data = {
            name: this.state.taskName,
            description: this.state.taskDescription,
            status: this.state.statusOptions,
            priority: this.state.priorityOptions,
            // evaluateId: evaluations._id,
            user: this.state.userId,
            progress: this.state.progress,
            date: this.formatDate(Date.now()),

            accountableEmployees: this.state.accountableEmployees,
            consultedEmployees: this.state.consultedEmployees,
            responsibleEmployees: this.state.responsibleEmployees,
            informedEmployees: this.state.informedEmployees,
            // inactiveEmployees: this.state.inactiveEmployees,
            inactiveEmployees: inactiveEmployees,

            info: this.state.info,
        }

        console.log('data', data, taskId);
        this.props.editTaskByAccountableEmployees(data, taskId);
    }

    componentDidMount() {
        // this.props.getTaskById(this.props.id);
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('PARENT nextProps, prevState',nextProps, prevState);
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // TODO: ve sau can sửa
                id: nextProps.id,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined,
                errorTaskName: undefined,
                errorTaskDescription: undefined 
            
            } 
        } else {
            return null;
        }
    }

    formatPriority = (data) => {
            const {translate} = this.props;
            if(data === 1) return translate('task.task_management.low');
            if(data === 2) return translate('task.task_management.normal');
            if(data === 3) return translate('task.task_management.high');
        }

    formatStatus = (data) => {
        const {translate} = this.props;
        if( data === "Inprocess" ) return translate('task.task_management.inprocess');
        else if( data === "WaitForApproval" ) return translate('task.task_management.wait_for_approval');       
        else if( data === "Finished" ) return translate('task.task_management.finished');       
        else if( data === "Delayed" ) return translate('task.task_management.delayed');       
        else if( data === "Canceled" ) return translate('task.task_management.canceled');       
    }
    
    render() { 
        
        const { task } = this.state;
        const { errorTaskName, errorTaskDescription, errorTaskProgress, taskName, taskDescription, statusOptions, priorityOptions, 
            responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees, inactiveEmployees
        } = this.state;

        const { user, tasktemplates, translate } = this.props;
        let departmentUsers, usercompanys;
        if (user.userdepartments) departmentUsers = user.userdepartments;
        if (user.usercompanys) usercompanys = user.usercompanys;

        let priorityArr = [
            {value: 3, text: translate('task.task_management.low')},
            {value: 2, text:translate('task.task_management.normal')}, 
            {value: 1, text:translate('task.task_management.high')}
        ];
        let statusArr = [
            {value: "Inprocess", text: translate('task.task_management.inprocess')},
            {value: "WaitForApproval", text:translate('task.task_management.wait_for_approval')}, 
            {value: "Finished", text:translate('task.task_management.finished')}, 
            {value: "Delayed", text:translate('task.task_management.delayed')}, 
            {value: "Canceled", text:translate('task.task_management.canceled')}
        ];
        
        let usersOfChildrenOrganizationalUnit;
        if(user && user.usersOfChildrenOrganizationalUnit){
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        return (
            <div>
                <React.Fragment>
                    <DialogModal
                        size={75}
                        maxWidth={750}
                        modalID={`modal-edit-task-by-${this.props.role}-${this.props.id}`}
                        formID={`form-edit-task-${this.props.role}-${this.props.id}`}
                        title={this.props.title}
                        isLoading={false}
                        func={this.save}
                        disableSubmit={!this.isFormValidated()}
                    >
                        <form id={`form-edit-task-${this.props.role}-${this.props.id}`}>
                            {/*Thông tin cơ bản*/}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin cơ bản</legend>
                                <div>
                                    {/*Input for task name*/}
                                    <div className={`form-group ${errorTaskName === undefined ? "" : "has-error"}`}>
                                        <label>Tên công việc<span className="text-red">*</span></label>
                                        <input type="text"
                                               value={taskName}
                                               className="form-control" onChange={this.handleTaskNameChange}/>
                                        <ErrorLabel content={errorTaskName}/>
                                    </div>
                                    {/*Input for task description*/}
                                    <div
                                        className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                        <label>Mô tả công việc<span className="text-red">*</span></label>
                                        <input type="text"
                                               value={taskDescription}
                                               className="form-control" onChange={this.handleTaskDescriptionChange}/>
                                        <ErrorLabel content={errorTaskDescription}/>
                                    </div>
                                </div>
                            </fieldset>

                            {/*Thông tin chi tiết*/}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin chi tiết</legend>
                                <div>

                                    {/*Trạng thái*/}
                                    <div className="form-group">
                                        <label>Trạng thái</label>
                                        {
                                            <SelectBox
                                                id={`select-status-${this.props.perform}-${this.props.role}`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items = {statusArr}
                                                multiple={false}
                                                value={statusOptions}
                                                onChange={this.handleSelectedStatus}
                                            />
                                        }
                                    </div>

                                    {/*Mức ưu tiên*/}
                                    <div className="form-group">
                                        <label>Mức ưu tiên</label>
                                        {
                                            <SelectBox
                                                id={`select-priority-${this.props.perform}-${this.props.role}`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items = {priorityArr}
                                                multiple={false}
                                                // value={priorityOptions.find(p => p.value === task.priority)}
                                                value={priorityOptions}
                                                onChange={this.handleSelectedPriority}
                                            />
                                        }
                                    </div>                                    
                                </div>
                                
                            </fieldset>

                            <TaskInformationForm
                                task= {task && task} 

                                handleChangeProgress={this.handleChangeProgress}
                                handleInfoBooleanChange={this.handleInfoBooleanChange}
                                handleInfoDateChange={this.handleInfoDateChange}
                                handleSetOfValueChange={this.handleSetOfValueChange}
                                handleChangeNumberInfo={this.handleChangeNumberInfo}
                                handleChangeTextInfo={this.handleChangeTextInfo}
                                
                                role={this.props.role}
                                perform ={this.props.perform}
                                value={this.state}
                            />
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin chi tiết</legend>
                                
                                {/*Người thực hiện*/}
                                <div className="form-group">
                                    <label>Người thực hiện</label>
                                    {unitMembers &&
                                        <SelectBox
                                            id={`select-responsible-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {unitMembers}
                                            onChange={this.handleSelectedResponsibleEmployee}
                                            multiple={true}
                                            value={responsibleEmployees}
                                        />
                                    }
                                </div>

                                {/*Người phê duyệt*/}
                                <div className="form-group">
                                    <label>Người phê duyệt</label>
                                    {unitMembers &&
                                        <SelectBox
                                            id={`select-accountable-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {unitMembers}
                                            onChange={this.handleSelectedAccountableEmployee}
                                            multiple={true}
                                            value={accountableEmployees}
                                        />
                                    }
                                </div>

                                {/*Người hỗ trợ*/}
                                <div className="form-group">
                                    <label>Người hỗ trợ</label>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`select-consulted-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {
                                                usercompanys.map(x => {
                                                    return {value: x._id, text: x.name};
                                                })
                                            }
                                            onChange={this.handleSelectedConsultedEmployee}
                                            multiple={true}
                                            value={consultedEmployees}
                                        />
                                    }
                                </div>

                                {/*Người giám sát*/}
                                <div className="form-group">
                                    <label>Người giám sát</label>
                                    {usercompanys &&
                                        <SelectBox
                                            id={`select-informed-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {
                                                usercompanys.map(x => {
                                                    return {value: x._id, text: x.name};
                                                })
                                            }
                                            onChange={this.handleSelectedInformEmployee}
                                            multiple={true}
                                            value={informedEmployees}
                                        />
                                    }
                                </div>
                            </fieldset>
                            <div style={{display: 'none'}}>
                                <span id='autoPoint'></span>
                            </div>

                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Nhân viên không làm việc nữa</legend>
                                <div className="form-group">
                               
                                    <div className="checkbox">
                                        <strong>Người phê duyệt</strong>
                                        {
                                            task.accountableEmployees.map(elem => {
                                                return <div>
                                                    <label>
                                                        <input 
                                                            type="checkbox" 
                                                            // accountable
                                                            checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true}  
                                                            value={elem._id}
                                                            name="accountable" onChange={(e)=>this.handleChangeActiveAccountable(e, elem._id)} 
                                                        />{elem.name}
                                                    </label>
                                                    <br/>
                                                </div>
                                            })
                                        }
                                        <br/>
                                        <strong>Người thực hiện</strong>
                                        {
                                            task.responsibleEmployees.map(elem => {
                                                return <div>
                                                    <label>
                                                        <input 
                                                            type="checkbox" 
                                                            // responsible
                                                            checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true} 
                                                            value={elem._id}
                                                            name="responsible" onChange={(e)=>this.handleChangeActiveResponsible(e, elem._id)} 
                                                        />{elem.name}
                                                    </label>
                                                    <br/>
                                                </div>
                                            })
                                        }
                                        <br/>
                                        { task.consultedEmployees.length !== 0 &&
                                            <React.Fragment>
                                                <strong>Người hỗ trợ</strong>
                                                {
                                                    task.consultedEmployees.map(elem => {
                                                        return <div>
                                                            <label>
                                                                <input 
                                                                    type="checkbox" 
                                                                    // consulted
                                                                    checked={this.state.listInactive[`${elem._id}`] && this.state.listInactive[`${elem._id}`].checked === true} 
                                                                    value={elem._id}
                                                                    name="consulted" onChange={(e)=>this.handleChangeActiveConsulted(e,elem._id)} 
                                                                />{elem.name}
                                                            </label>
                                                            <br/>
                                                        </div>
                                                    })
                                                }
                                            </React.Fragment>
                                        }
                                    </div>
                                    
                                    {/* về sau nếu muốn xóa nhân viên trong mảng nhân viên phía client thì dùng splice(index,1) server thì dùng $pull */}
                                </div>
                            </fieldset>
                        </form>
                    </DialogModal>
                </React.Fragment>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tasks, user, tasktemplates } = state;
    return { tasks, user, tasktemplates };
}

const actionGetState = { //dispatchActionToProps
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    editTaskByAccountableEmployees: taskManagementActions.editTaskByAccountableEmployees,
}

const modalEditTaskByAccountableEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByAccountableEmployee));
export { modalEditTaskByAccountableEmployee as ModalEditTaskByAccountableEmployee };
