import React, { Component } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { kpiMemberActions } from '../../../kpi/evaluation/employee-evaluation/redux/actions';
import { TaskInformationForm } from './taskInformationForm';

import {
    getStorage
} from '../../../../config';

class EvaluateByResponsibleEmployee extends Component {
    constructor(props) {
        var idUser = getStorage("userId");
        super(props);

        var {tasks} = this.props;
        let task = (tasks && tasks.task) && tasks.task.info;
        
        var evaluations;
        var dateOfEval = new Date();
        var monthOfEval = dateOfEval.getMonth();
        var yearOfEval = dateOfEval.getFullYear();
        evaluations = task.evaluations.find(e => ( monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()) );

        var automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : 0;

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

                // const { progress, date, kpi} = this.state;

                var date = this.formatDate(evaluations.date);
                for(let i in evaluations.kpis){
                    // console.log('------------', evaluations.kpis[i], typeof(evaluations.kpis[i]), idUser, typeof(idUser));
                }
                var kpi = evaluations.kpis.find(e => (String(e.employee._id) === String(idUser))).kpis;
                
                for(let i in kpi){
                    cloneKpi.push(kpi[i]._id);
                }
                console.log('------------------', cloneKpi);
            }
            this.state={
                idUser: idUser ,
                info: info,
                autoPoint: 0,
                // autoPoint: automaticPoint,
                date: date,
                kpi: cloneKpi,
                progress: task.progress
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

    componentDidMount() {
        this.props.getTaskById(this.props.id);
        this.props.getKPIMemberById(this.state.idUser);
        this.props.getAllKPIPersonalByUserID(this.state.idUser);
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

    handleKpiChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }

    handleDateChange = (value) => {
        // var value = e.target.value;
        this.setState(state => {
                return {
                    ...state,
                    errorOnDate: this.validateDate(value),
                    date: value,
                }
            });
        
    }

    handleChangePoint = async (e) => {
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                point: value,
                errorOnPoint: this.validatePoint(value)
            }
        })
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
        document.getElementById(`autoPoint-${this.props.perform}`).innerHTML = value;
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
        var {name, value} = event.target;
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

    isFormValidated = () => {
        const { point, autoPoint, progress, date, kpi, infoDate, infoBoolean, setOfValue } = this.state;
        const { errorOnDate, errorOnPoint, errorOnProgress, errorOnInfoDate, errorOnTextInfo, errorOnNumberInfo } = this.state;
        return ( errorOnDate === undefined && errorOnPoint === undefined && errorOnProgress === undefined 
                && errorOnInfoDate === undefined && errorOnTextInfo === undefined && errorOnNumberInfo === undefined) ? true : false;
    }
    
    save = () => {
        var taskId;
        taskId = this.props.id;
        var data = {
            user: getStorage("userId"),
            progress: this.state.progress,
            automaticPoint: this.state.autoPoint !== 0 ? this.state.autoPoint : this.state.progress,
            employeePoint: this.state.point,
            role: "Responsible",
            
            kpi: this.state.kpi,
            date: this.state.date,
            info: this.state.info,
            
        }

        console.log('data', data, taskId);
        this.props.evaluateTaskByResponsibleEmployees(data,taskId);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('PARENT nextProps, prevState',nextProps, prevState);
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,

                id: nextProps.id,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined,
                errorOnInfoBoolean: undefined, 
                errorOnTextInfo: undefined, 
                errorOnNumberInfo: undefined
            } 
        } else {
            return null;
        }
    }

    render() {
        const { translate, tasks, performtasks, KPIPersonalManager, kpimembers } = this.props;
        const { point, autoPoint, progress, date, kpi, priority, infoDate, infoBoolean, setOfValue } = this.state;
        const { errorOnDate, errorOnPoint, errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnTextInfo, errorOnNumberInfo } = this.state;
        // var items = [{value: '123', text: 'Quang'},{value: '789', text: 'Thế'}]

        var listKpi = (KPIPersonalManager && KPIPersonalManager.kpipersonals && KPIPersonalManager.kpipersonals[0])? KPIPersonalManager.kpipersonals[0].kpis : [];
        var task = (tasks && tasks.task)&& tasks.task.info;
        return (
            <React.Fragment>
            <DialogModal
                modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}-${this.props.perform}`}
                formID={`form-evaluate-task-by-${this.props.role}`}
                title={this.props.title}
                func={this.save}
                disableSubmit={!this.isFormValidated()}
                size={75}
                maxWidth={750}
            >
                <form id={`form-evaluate-task-by-${this.props.role}`}>
                    <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                        <label>Ngày đánh giá:<span className="text-red">*</span></label>
                        <DatePicker
                            id={`create_date_${this.props.perform}`}
                            value={date}
                            onChange={this.handleDateChange}
                        />
                        <ErrorLabel content={errorOnDate} />
                    </div>
                    <div className="form-group">
                        <label>Liên kết KPI:</label>
                        {
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`select-kpi-personal-evaluate-${this.props.perform}-${this.props.role}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {listKpi.map(x => { return { value: x._id, text: x.name } })}
                                onChange={this.handleKpiChange}
                                multiple={true}
                                value={kpi}
                            />
                        }
                    </div>
                    <div>
                        <TaskInformationForm 
                            task= {task && task} 

                            handleChangeProgress={this.handleChangeProgress}
                            handleInfoBooleanChange={this.handleInfoBooleanChange}
                            handleInfoDateChange={this.handleInfoDateChange}
                            handleSetOfValueChange={this.handleSetOfValueChange}
                            handleChangeNumberInfo={this.handleChangeNumberInfo}
                            handleChangeTextInfo={this.handleChangeTextInfo}

                            perform={this.props.perform}
                            value={this.state}
                        />
                        
                    </div>
                    <div>
                        <strong>Điểm tự động: &nbsp;<span id={`autoPoint-${this.props.perform}`}>{autoPoint}</span> </strong>
                        <br/>
                        <br/>
                        <div className={`form-group ${errorOnPoint===undefined?"":"has-error"}`}>
                            <label>Điểm tự đánh giá (<span style={{color:"red"}}>*</span>)</label>
                            <input 
                                className="form-control"
                                type="number" 
                                name="point"
                                placeholder={85}
                                onChange={this.handleChangePoint}
                                value={point}
                            />
                            <ErrorLabel content={errorOnPoint}/>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks, kpimembers, KPIPersonalManager } = state;
    return { tasks, performtasks, kpimembers, KPIPersonalManager };
}
const getState = {
    getTaskById: taskManagementActions.getTaskById,
    createResult: performTaskAction.createResultTask,
    editResultTask: performTaskAction.editResultTask,
    editStatusOfTask: taskManagementActions.editStatusOfTask,
    getKPIMemberById: kpiMemberActions.getKPIMemberById,
    getAllKPIPersonalByUserID: managerKpiActions.getAllKPIPersonalByUserID,
    evaluateTaskByResponsibleEmployees: taskManagementActions.evaluateTaskByResponsibleEmployees
}

const evaluateByResponsibleEmployee = connect(mapState, getState)(withTranslate(EvaluateByResponsibleEmployee));
export { evaluateByResponsibleEmployee as EvaluateByResponsibleEmployee }
