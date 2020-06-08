import React, { Component } from 'react';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components/';
import { taskManagementActions } from "../../task-management/redux/actions";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from "../../../../config";
import { TaskInformationForm } from './taskInformationForm';
import { kpiMemberActions } from '../../../kpi/evaluation/employee-evaluation/redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { createKpiSetActions } from '../../../kpi/employee/creation/redux/actions';
// import { taskManagementActions } from "../../task-management/redux/actions";

class ModalEditTaskByResponsibleEmployee extends Component {

    constructor(props) {
        super(props);

        var userId = getStorage("userId");
        let { tasks } = this.props;

        let task = (tasks && tasks.task) && tasks.task.info;

        // khởi tạo state của task

        let taskName = task && task.name;
        let taskDescription = task && task.description;
        
        let progress = task && task.progress;

        var evaluations;
        var dateOfEval = new Date();
        var monthOfEval = dateOfEval.getMonth();
        var yearOfEval = dateOfEval.getFullYear();
        evaluations = task.evaluations.find(e => ( monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()) );

        var info = {};
        var cloneKpi = [];
        if(evaluations){
            let infoEval = evaluations.taskInformations;
                for(let i in infoEval){
                    if(infoEval[i].type === "Date"){
                        if(infoEval[i].value){
                            infoEval[i].value = this.formatDate(infoEval[i].value);
                        } else infoEval[i].value = this.formatDate(Date.now());
                    }
                    info[`${infoEval[i].code}`] = {
                        value: infoEval[i].value,
                        code: infoEval[i].code,
                        type: ''
                    }
                    
                }

                var date = this.formatDate(evaluations.date);
                // for(let i in evaluations.kpis){
                //     // console.log('------------', evaluations.kpis[i], typeof(evaluations.kpis[i]), idUser, typeof(idUser));
                // }
                
                let tmp = evaluations.kpis.find(e => (String(e.employee._id) === String(userId)));
                if (tmp){
                    var kpi = tmp.kpis;
                
                    for(let i in kpi){
                        cloneKpi.push(kpi[i]._id);
                    }
                    console.log('------------------', cloneKpi);;
                }
            }
            // const {task, taskName, taskDescription, kpi} = this.state;

        // TODO: chua lay dc gia tri cua KPI

        this.state = {
            userId: userId,
            task: task,
            kpi: cloneKpi,
            info: info,
            taskName : taskName,
            taskDescription: taskDescription,
            progress: progress
        }        
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
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
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
        document.getElementById("autoPoint").innerHTML = value;
    } 
    
    handleChangeNumberInfo = async (e) => {
        var value = parseInt(e.target.value);
        var name = e.target.name;
        await this.setState(state =>{
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Number'
            }
            return {
                ...state,
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
                code: name,
                type: 'Text'
            }
            return {
                ...state,
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
        // console.log('value', value);

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
        var {name, value} = event.target;

        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Boolean'
            }
            return {
                ...state,
                
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

    handleKpiChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
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

    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }
        
        return msg;
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

   
    isFormValidated = () => {
        return this.validateTaskName(this.state.taskName, false)
            && this.validateTaskDescription(this.state.taskDescription, false)
            // && this.validateTaskProgress(this.state.taskProgress, false);
    }

    save = () => {        
        // var {tasks} = this.props;
        var evaluations, taskId;
        taskId = this.props.id;
        // evaluations = this.state.task.evaluations[this.state.task.evaluations.length-1]
        var data = {
            date: this.formatDate(Date.now()),
            name: this.state.taskName,
            description: this.state.taskDescription,
            // evaluateId: evaluations._id,
            user: this.state.userId,
            progress: this.state.progress,
            kpi: this.state.kpi ? this.state.kpi : [],
            info: this.state.info,
        }

        console.log('data', data, taskId);
        this.props.editTaskByResponsibleEmployees(data, taskId);

    }

    componentDidMount() {
        this.props.getTaskById(this.props.id);
        this.props.getEmployeeKpiSet();
        // this.props.getKPIMemberById(this.state.userId);// lỗi
        this.props.getAllKPIPersonalByUserID(this.state.userId); // lấy ra mảng các list kpi theo các tháng
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('PARENT nextProps, prevState', nextProps, prevState);
        const { tasks } = nextProps;
        var task = tasks && tasks.task && tasks.task.info;
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // TODO: ve sau can sửa
                id: nextProps.id,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined
            } 
        } else {
            return null;
        }
    }
    

    render() {
        const { kpimembers, KPIPersonalManager, createEmployeeKpiSet } = this.props
        const {task, taskName, taskDescription, kpi} = this.state;
        const { errorTaskName, errorTaskDescription } = this.state;
        var listKpi = (KPIPersonalManager && KPIPersonalManager.kpipersonals && KPIPersonalManager.kpipersonals.length !== 0)? KPIPersonalManager.kpipersonals[KPIPersonalManager.kpipersonals.length-1].kpis : [];
        // console.log('KPIPersonalManager.kpipersonals[KPIPersonalManager.kpipersonals.length-1]', KPIPersonalManager.kpipersonals[KPIPersonalManager.kpipersonals.length-1]);
        // var listKpi = [];
        var currentKPI = (createEmployeeKpiSet && createEmployeeKpiSet.currentKPI) && createEmployeeKpiSet.currentKPI;
        var list = currentKPI && currentKPI.kpis;
        console.log('listKPI==========================', list);
        console.log('this.props.perform',this.props.perform);
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
                                        <input 
                                            type="text"
                                            value={taskName}
                                            className="form-control" 
                                            onChange={this.handleTaskNameChange}
                                        />
                                        <ErrorLabel content={errorTaskName}/>
                                    </div>
                                    {/*Input for task description*/}
                                    <div
                                        className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                        <label>Mô tả công việc<span className="text-red">*</span></label>
                                        <input 
                                            type="text"
                                            value={taskDescription}
                                            className="form-control" onChange={this.handleTaskDescriptionChange}
                                        />
                                        <ErrorLabel content={errorTaskDescription}/>
                                    </div>
                                </div>
                            
                                {/*KPI related*/}

                                <div className="form-group">
                                    <label>Liên kết KPI:</label>
                                    {
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id={`select-kpi-personal-edit-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items = {listKpi.map(x => { return { value: x._id, text: x.name } })}
                                            // items = {(currentKPI !== undefined ) && currentKPI.kpis.map(x => { return { value: x._id, text: x.name } })}
                                            onChange={this.handleKpiChange}
                                            multiple={true}
                                            value={kpi}
                                        />
                                    }
                                </div>
                            </fieldset>
                            <TaskInformationForm
                                task = { task && task }

                                handleChangeProgress={this.handleChangeProgress}
                                handleInfoBooleanChange={this.handleInfoBooleanChange}
                                handleInfoDateChange={this.handleInfoDateChange}
                                handleSetOfValueChange={this.handleSetOfValueChange}
                                handleChangeNumberInfo={this.handleChangeNumberInfo}
                                handleChangeTextInfo={this.handleChangeTextInfo}

                                perform={this.props.perform}
                                value={this.state}
                            
                            />

                                
                            {/* </fieldset> */}
                            <div style={{display: 'none'}}>
                                <span id='autoPoint'></span>
                            </div>

                        </form>
                    </DialogModal>
                </React.Fragment>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tasks, kpimembers, KPIPersonalManager, createEmployeeKpiSet } = state;
    return { tasks, kpimembers, KPIPersonalManager, createEmployeeKpiSet };
}

const actionGetState = { //dispatchActionToProps
    getTaskById: taskManagementActions.getTaskById,
    getEmployeeKpiSet: createKpiSetActions.getEmployeeKpiSet,
    getKPIMemberById: kpiMemberActions.getKPIMemberById,
    getAllKPIPersonalByUserID: managerKpiActions.getAllKPIPersonalByUserID,
    editTaskByResponsibleEmployees: taskManagementActions.editTaskByResponsibleEmployees,

}

const modalEditTaskByResponsibleEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByResponsibleEmployee));
export { modalEditTaskByResponsibleEmployee as ModalEditTaskByResponsibleEmployee };
