import React, { Component } from 'react';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components/';
import { taskManagementActions } from "../../task-management/redux/actions";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from "../../../../config";
import { TaskInformationForm } from './taskInformationForm';
import { kpiMemberActions } from '../../../kpi/evaluation/employee-evaluation/redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';


class ModalEditTaskByResponsibleEmployee extends Component {

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
        document.getElementById("autoPoint").innerHTML = value;
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
        console.log('submitted form edit task');
    }

    componentDidMount() {
        this.props.getTaskById(this.props.id);
        this.props.getKPIMemberById(this.state.userId);
        this.props.getAllKPIPersonalByUserID(this.state.userId);
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
                // kpi: nextProps.kpi,
                // date: nextProps.date,
                // point: nextProps.point,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined
            } 
        } else {
            return null;
        }
    }
    // shouldComponentUpdate(nextProps, nextState){
    //     console.log('PARENT nextProps, prevState', nextProps, this.state, nextState);
    //     const { tasks } = nextProps;
    //     var task = tasks && tasks.task && tasks.task.info;
    //     // if (nextProps.id !== this.state.id) {

    //     this.setState(state=>{
    //         return {
    //             ...state,

    //             id: nextProps.id,

    //             errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
    //             errorOnPoint: undefined,
    //             errorOnInfoDate: undefined,
    //             errorOnProgress: undefined
    //         } 
    //     });
    //     // }
    // }

    render() {
        const { kpimembers, KPIPersonalManager } = this.props
        const {task, taskName, taskDescription, kpi} = this.state;
        const { errorTaskName, errorTaskDescription } = this.state;
        var listKpi = (KPIPersonalManager && KPIPersonalManager.kpipersonals && KPIPersonalManager.kpipersonals[0])? KPIPersonalManager.kpipersonals[0].kpis : [];
        // console.log('listKPI', listKpi);
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
                                            value={this.state.taskName !== undefined ? this.state.taskName : task && task.name}
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
                                            value={this.state.taskDescription !== undefined ? this.state.taskDescription : task && task.description}
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

                            {/* Thông tin chi tiết
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin chi tiết</legend>
                                <div>
                                    Mức độ hoàn thành
                                    <div className={`form-group ${errorTaskProgress === undefined ? "" : "has-error"}`}>
                                        <label>Mức độ hoàn thành</label>
                                        <input type="text"
                                               value={this.state.taskProgress !== undefined ? this.state.taskProgress : task && task.progress}
                                               className="form-control" onChange={this.handleTaskProgressChange}/>
                                        <ErrorLabel content={errorTaskProgress}/>
                                    </div>

                                    Task information
                                    {
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
                                    }


                                </div> */}
                            
                                
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
    const { tasks, kpimembers, KPIPersonalManager } = state;
    return { tasks, kpimembers, KPIPersonalManager };
}

const actionGetState = { //dispatchActionToProps
    getTaskById: taskManagementActions.getTaskById,
    getKPIMemberById: kpiMemberActions.getKPIMemberById,
    getAllKPIPersonalByUserID: managerKpiActions.getAllKPIPersonalByUserID
}

const modalEditTaskByResponsibleEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByResponsibleEmployee));
export { modalEditTaskByResponsibleEmployee as ModalEditTaskByResponsibleEmployee };
