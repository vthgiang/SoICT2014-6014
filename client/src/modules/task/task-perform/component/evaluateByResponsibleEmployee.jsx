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
import { createKpiSetActions } from '../../../kpi/employee/creation/redux/actions';

class EvaluateByResponsibleEmployee extends Component {
    constructor(props) {
        
        super(props);

        let date = this.formatDate(new Date());
        let data = this.getData(date);

        this.state={
            task: data.task,
            idUser: data.idUser,
            info: data.info,
            autoPoint: data.autoPoint,
            date: data.date,
            kpi: data.kpi,
            point: data.point,
            progress: data.task.progress
        }
    }
        
    //  Hàm xử lý dữ liệu khởi tạo
    getData = (dateParam) => {
        let idUser = getStorage("userId");
        let {tasks} = this.props;
        let task = (tasks && tasks.task) && tasks.task.info;
        
        let evaluations;
        
        let splitter = dateParam.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1]-1, splitter[0]);
        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        evaluations = task.evaluations.find(e => ( monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()) );

        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : 0;

        let date = this.formatDate(new Date());
        if(this.props.perform === "stop"){
            date = this.formatDate(new Date()); 
        }
        else if(this.props.perform === "evaluate"){
            date = this.formatDate(new Date()); 
            // date = moment().endOf("month").format('DD-MM-YYYY');
        }

        let point = 0;
        let info = {};
        let cloneKpi = [];

        
        for(let i in task.taskInformations){
            if(task.taskInformations[i].type === "Date"){
                if(task.taskInformations[i].value){
                    task.taskInformations[i].value = this.formatDate(task.taskInformations[i].value);
                } else task.taskInformations[i].value = this.formatDate(new Date());
            }
            else if(task.taskInformations[i].type === "SetOfValues"){
                if(task.taskInformations[i].value){
                    task.taskInformations[i].value = task.taskInformations[i].value === undefined ? undefined : [task.taskInformations[i].value];
                }
            }
            
            info[`${task.taskInformations[i].code}`] = {
                value: task.taskInformations[i].value,
                code: task.taskInformations[i].code,
                type: task.taskInformations[i].type
            }
        }
        

        if(evaluations){
            if(evaluations.results.length !== 0) {
                let res = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "Responsible" ));
                if(res) point = res.employeePoint ? res.employeePoint : 0;
            }
            let infoEval = evaluations.taskInformations;
            let chkHasInfo = false;
            for(let i in infoEval) {
                if(infoEval[i].value !== undefined) {
                    chkHasInfo = true; 
                    break;
                }
            }

            if(chkHasInfo){
                for(let i in infoEval){
                    if(infoEval[i].type === "Date"){
                        if(infoEval[i].value){
                            infoEval[i].value = this.formatDate(infoEval[i].value);
                        } else infoEval[i].value = this.formatDate(new Date());
                        
                    }
                    else if(infoEval[i].type === "SetOfValues"){
                        if(infoEval[i].value){
                            infoEval[i].value = infoEval[i].value === undefined ? undefined : [infoEval[i].value];
                        }
                    }
                    info[`${infoEval[i].code}`] = {
                        value: infoEval[i].value,
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }

            if(this.props.perform === "stop"){
                if(chkHasInfo) {
                    date = this.formatDate(evaluations.date);
                }
                else date = this.formatDate(new Date());
            }
            else if(this.props.perform === "evaluate"){
                
                // if(chkHasInfo) date = this.formatDate(evaluations.date);
                date = this.formatDate(evaluations.date);

            }
           
            let tmp = evaluations.kpis.find(e => (String(e.employee._id) === String(idUser)));
            if (tmp){
                let kpi = tmp.kpis;
            
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

    componentDidMount() {
        let { task, idUser } = this.state;
        let date = this.formatDate(new Date());
        let department = task.organizationalUnit._id;

        this.props.getTaskById(this.props.id);
        this.props.getEmployeeKpiSet();
        this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, department, date);
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

    handleKpiChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }

    handleDateChange = (value) => {
        // let value = e.target.value;
        let {idUser, task} = this.state;

        let data = this.getData(value);
        this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, task.organizationalUnit._id, value);

        this.setState(state => {
            return {
                ...state,
                errorOnDate: this.validateDate(value),
                date: value,
                info: data.info, 
                kpi: data.kpi,
                autoPoint: data.autoPoint,
                point: data.point
            }
        });
        console.log('-----stateeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', this.state);
    }

    handleChangePoint = async (e) => {
        let value = parseInt(e.target.value);
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
        let value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                autoPoint: value,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
        // document.getElementById(`autoPoint-${this.props.perform}`).innerHTML = value;
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

    isFormValidated = () => {
        const { point, autoPoint, progress, date, kpi, infoDate, infoBoolean, setOfValue } = this.state;
        const { errorOnDate, errorOnPoint, errorOnProgress, errorOnInfoDate, errorOnTextInfo, errorOnNumberInfo } = this.state;
        var {info} = this.state;
        var check = true;
        for(let i in info) {
            if(info[i].value === undefined ) {
                check = false;
                break;
            }
        }
        return ( check && errorOnDate === undefined && errorOnPoint === undefined && errorOnProgress === undefined 
                && errorOnInfoDate === undefined && errorOnTextInfo === undefined && errorOnNumberInfo === undefined) ? true : false;
    }
    
    save = () => {
        let taskId;
        taskId = this.props.id;
        let data = {
            user: getStorage("userId"),
            progress: this.state.progress,
            // automaticPoint: this.state.autoPoint !== 0 ? this.state.autoPoint : this.state.progress,
            automaticPoint: this.state.autoPoint,
            employeePoint: this.state.point,
            role: "Responsible",
            
            kpi: this.state.kpi ? this.state.kpi : [],
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
        // let items = [{value: '123', text: 'Quang'},{value: '789', text: 'Thế'}]
        let listKpi = [];
        if(KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;

        let task = (tasks && tasks.task)&& tasks.task.info;
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
                                // items = {listKpi.map(x => { return { value: x._id, text: x.name } })}
                                items = { ((KPIPersonalManager && KPIPersonalManager.kpiSets) ? KPIPersonalManager.kpiSets.kpis : []).map(x => { return { value: x._id, text: x.name } })}
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

                            role={this.props.role}
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
    getEmployeeKpiSet: createKpiSetActions.getEmployeeKpiSet,
    getAllKPIPersonalByUserID: managerKpiActions.getAllKPIPersonalByUserID,
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
    evaluateTaskByResponsibleEmployees: taskManagementActions.evaluateTaskByResponsibleEmployees
}

const evaluateByResponsibleEmployee = connect(mapState, getState)(withTranslate(EvaluateByResponsibleEmployee));
export { evaluateByResponsibleEmployee as EvaluateByResponsibleEmployee }
