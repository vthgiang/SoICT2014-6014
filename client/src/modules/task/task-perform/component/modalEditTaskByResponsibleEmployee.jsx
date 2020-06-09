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

        var date = this.formatDate(new Date());
        var data = this.getData(date);

        this.state={
            task: data.task,
            userId: data.idUser,
            taskName: data.task.name,
            taskDescription: data.task.description,
            idUser: data.idUser,
            info: data.info,
            date: data.date,
            kpi: data.kpi,
            progress: data.task.progress
        }   
    }

    //  Hàm xử lý dữ liệu khởi tạo
    getData = (dateParam) => {
        var idUser = getStorage("userId");
        var {tasks} = this.props;
        let task = (tasks && tasks.task) && tasks.task.info;
        
        var evaluations;
        
        var splitter = dateParam.split("-");
        var dateOfEval = new Date(splitter[2], splitter[1]-1, splitter[0]);
        var monthOfEval = dateOfEval.getMonth();
        var yearOfEval = dateOfEval.getFullYear();
        evaluations = task.evaluations.find(e => ( monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()) );

        var automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : 0;

        var date = this.formatDate(new Date());
        var point = 0;
        var info = {};
        var cloneKpi = [];
        if(evaluations){
            if(evaluations.results.length !== 0) {
                var res = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "Responsible" ));
                if(res) point = res.employeePoint ? res.employeePoint : 0;
            }
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

            date = this.formatDate(evaluations.date);
           
            let tmp = evaluations.kpis.find(e => (String(e.employee._id) === String(idUser)));
            if (tmp){
                var kpi = tmp.kpis;
            
                for(let i in kpi){
                    cloneKpi.push(kpi[i]._id);
                }
            }
        }
        return {
            task: task,
            idUser: idUser,
            kpi: cloneKpi,
            info: info,
            autoPoint: automaticPoint,
            point: point,
            date: date
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
        var taskId;
        taskId = this.props.id;
        var data = {
            date: this.formatDate(Date.now()),
            name: this.state.taskName,
            description: this.state.taskDescription,
            user: this.state.userId,
            progress: this.state.progress,
            kpi: this.state.kpi ? this.state.kpi : [],
            info: this.state.info,
        }

        console.log('data', data, taskId);
        this.props.editTaskByResponsibleEmployees(data, taskId);

    }

    componentDidMount() {

        var { task, userId } = this.state;
        var date = this.formatDate(new Date());
        var department = task.organizationalUnit._id;

        console.log('----------------------\n\n\n', date, userId, department);
        this.props.getTaskById(this.props.id);
        this.props.getEmployeeKpiSet();
        this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, department, date);
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
        const { KPIPersonalManager } = this.props
        const {task, taskName, taskDescription, kpi} = this.state;
        const { errorTaskName, errorTaskDescription } = this.state;
        var listKpi = [];
        if(KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;
        
        console.log('listKPI==========================\n\n\n', listKpi);
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
                                            items = {listKpi && listKpi.map(x => { return { value: x._id, text: x.name } })}
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
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
    editTaskByResponsibleEmployees: taskManagementActions.editTaskByResponsibleEmployees,
}

const modalEditTaskByResponsibleEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByResponsibleEmployee));
export { modalEditTaskByResponsibleEmployee as ModalEditTaskByResponsibleEmployee };
