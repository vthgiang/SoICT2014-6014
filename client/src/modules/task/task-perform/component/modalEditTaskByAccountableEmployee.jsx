import React, { Component } from 'react';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components/';
import { taskManagementActions } from "../../task-management/redux/actions";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from "../../../../config";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { TaskInformationForm } from './taskInformationForm';


class ModalEditTaskByAccountableEmployee extends Component {

    constructor(props) {
        super(props);

        var userId = getStorage("userId");


        let { tasks } = this.props;

        let task = (tasks && tasks.task) && tasks.task.info;
        // let taskInformation = [{name: "Số nợ cần thu", value: 100},{name: "Số nợ đã thu", value: 60},{name: "Loại thuốc cần thu", value: "Thuốc viên"}];
        // let taskInformation = task && task.taskInformations;

        this.state = {
            userId: userId,
            task: task,
            info: {}
            // taskInformation: taskInformation,
        }
    }

    // ==============================BEGIN HANDLE TASK INFORMATION===================================

    handleChangeProgress = async (e) => {
        var value = parseInt(e.target.value);
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
        var value = parseInt(e.target.value);
        var name = e.target.name;
        await this.setState(state =>{
            state.info[`${name}`] = {
                value: value,
                code: name
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
        var value = e.target.value;
        var name = e.target.name;
        await this.setState(state =>{
            state.info[`${name}`] = {
                value: value,
                code: name
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
                code: code
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
                code: code
            }
            return {
                ...state,
            }
        });
    }

    handleInfoBooleanChange  = (event) => {
        var {name, value} = event.target;
        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name
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
        var { translate } = this.props;
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
        var { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    handleChangeActiveEmployees = (e) =>{
        var {name, value} = e.target;
        this.setState(state=>{
            return {
                ...state,
                activeEmployees : e.target.checked
            }
        })
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
        return this.validateTaskName(this.state.taskName, false)
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
                informEmployees: value
            }
        });
    }

    save = () => {
        console.log('submitted form edit task');
    }

    componentDidMount() {
        this.props.getTaskById(this.props.id);
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('PARENT nextProps, prevState',nextProps, prevState);
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // TODO: ve sau can sửa
                id: nextProps.id,
                // kpi: nextProps.kpi,
                // date: nextProps.date,
                // point: nextProps.point,

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

    render() {
        const { task } = this.state;
        const { errorTaskName, errorTaskDescription, errorTaskProgress, 
            responsibleEmployees, accountableEmployees, consultedEmployees, informEmployees 
        } = this.state;

        const { user } = this.props;
        var departmentUsers = [];
        if (user.userdepartments) departmentUsers = user.userdepartments;

        let priorityOptions = [{value: 3, text: "Cao"}, {value: 2, text:"Trung bình"}, {value: 1, text:"Thấp"}];
        let statusOptions = [{value: 1, text: "Inprocess"}, {value: 2, text:"WaitForApproval"}, {value: 3, text:"Finished"}, {value: 4, text:"Delayed"}, {value: 5, text:"Canceled"}];
        
        // console.log('task', task);

        return (
            <div>
                <React.Fragment>
                    <DialogModal
                        size={75}
                        maxWidth={750}
                        // modalID={`modal-edit-task-by-${this.props.role}-${this.props.id}-${this.props.perform}`}
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
                                               value={this.state.taskName !== undefined ? this.state.taskName : task && task.name}
                                               className="form-control" onChange={this.handleTaskNameChange}/>
                                        <ErrorLabel content={errorTaskName}/>
                                    </div>
                                    {/*Input for task description*/}
                                    <div
                                        className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                        <label>Mô tả công việc<span className="text-red">*</span></label>
                                        <input type="text"
                                               value={this.state.taskDescription !== undefined ? this.state.taskDescription : task && task.description}
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
                                        <label>Mức ưu tiên</label>
                                        {
                                            <SelectBox
                                                id={`select-status-${this.props.perform}-${this.props.role}`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items = {statusOptions}
                                                multiple={false}
                                                value={statusOptions.filter(s => s.text === task.status)[0].value}
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
                                                items = {priorityOptions}
                                                multiple={false}
                                                value={priorityOptions.find(p => p.value === task.priority)}
                                                onChange={this.handleSelectedPriority}
                                            />
                                        }
                                    </div>

                                    {/*Mức độ hoàn thành*/}
                                    {/* <div className={`form-group ${errorTaskProgress === undefined ? "" : "has-error"}`}>
                                        <label>Mức độ hoàn thành</label>
                                        <input 
                                            type="text"
                                            value={this.state.taskProgress !== undefined ? this.state.taskProgress : task && task.progress}
                                            className="form-control" onChange={this.handleTaskProgressChange}/>
                                        <ErrorLabel content={errorTaskProgress}/>
                                    </div> */}

                                    {/*Task information*/}
                                    {/* {
                                        (taskInformation != null && taskInformation.length !== 0) && taskInformation.map((info, index) => {
                                            return <div
                                                className={`form-group`}>
                                                <label>{info.name}</label>
                                                <input type="text"
                                                       value={info.value}
                                                       className="form-control"
                                                       onChange=""/>
                                            </div>
                                        })
                                    } */}
                                    
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

                                perform ={this.props.perform}
                                value={this.state}
                            />
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin chi tiết</legend>
                                
                                {/*Người thực hiện*/}
                                <div className="form-group">
                                    <label>Người thực hiện</label>
                                    {
                                        <SelectBox
                                            id={`select-responsible-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {departmentUsers.map(employee => { return { value: employee._id, text: employee.userId.name } })}
                                            onChange={this.handleSelectedResponsibleEmployee}
                                            multiple={true}
                                            value={responsibleEmployees}
                                        />
                                    }
                                </div>

                                {/*Người phê duyệt*/}
                                <div className="form-group">
                                    <label>Người phê duyệt</label>
                                    {
                                        <SelectBox
                                            id={`select-accountable-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {departmentUsers.map(employee => { return { value: employee._id, text: employee.userId.name } })}
                                            onChange={this.handleSelectedAccountableEmployee}
                                            multiple={true}
                                            value={accountableEmployees}
                                        />
                                    }
                                </div>

                                {/*Người hỗ trợ*/}
                                <div className="form-group">
                                    <label>Người hỗ trợ</label>
                                    {
                                        <SelectBox
                                            id={`select-consulted-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {departmentUsers.map(employee => { return { value: employee._id, text: employee.userId.name } })}
                                            onChange={this.handleSelectedConsultedEmployee}
                                            multiple={true}
                                            value={consultedEmployees}
                                        />
                                    }
                                </div>

                                {/*Người giám sát*/}
                                <div className="form-group">
                                    <label>Người giám sát</label>
                                    {
                                        <SelectBox
                                            id={`select-informed-employee-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {departmentUsers.map(employee => { return { value: employee._id, text: employee.userId.name } })}
                                            onChange={this.handleSelectedInformEmployee}
                                            multiple={true}
                                            value={informEmployees}
                                        />
                                    }
                                </div>
                            </fieldset>
                            <div style={{display: 'none'}}>
                                <span id='autoPoint'></span>
                            </div>

                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Chọn nhân viên không làm việc nữa</legend>
                                <div className="checkbox">
                                    {
                                        task && task.responsibleEmployees.map(r=>{
                                            return <div>
                                                    <label>
                                                        <input 
                                                            type="checkbox" 
                                                            value={r._id}
                                                            onChange={this.handleChangeActiveEmployees}
                                                        /> {r.name}
                                                    </label>
                                                    <br/>
                                                </div>
                                        })
                                    } 
                                    
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
    const { tasks, user } = state;
    return { tasks, user };
}

const actionGetState = { //dispatchActionToProps
    getTaskById: taskManagementActions.getTaskById,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment
}

const modalEditTaskByAccountableEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByAccountableEmployee));
export { modalEditTaskByAccountableEmployee as ModalEditTaskByAccountableEmployee };
