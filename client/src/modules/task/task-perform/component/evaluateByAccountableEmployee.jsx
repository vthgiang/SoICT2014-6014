import React, { Component } from 'react';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';
import { TaskInformationForm } from './taskInformationForm';
import { getStorage } from '../../../../config';

class EvaluateByAccountableEmployee extends Component {
    constructor(props) {
        super(props);

        var idUser = getStorage("userId");
        var {tasks} = this.props;
        let task = (tasks && tasks.task) && tasks.task.info;
        
        var evaluations;
        var dateOfEval = new Date();
        var monthOfEval = dateOfEval.getMonth();
        var yearOfEval = dateOfEval.getFullYear();
        evaluations = task.evaluations.find(e => ( monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()) );

        var automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : 0;

        var date = this.formatDate(new Date());
        var point = 0;
        var info = {};
        // const { date, status, priority, progress, accountablePoint, autoPoint, myPoint, accountableContribution, } = this.state;

        // approvedPointConsulted5ed68e90ec0683397cbdf9fd: {value: 1, employee: "5ed68e90ec0683397cbdf9fd", role: "Consulted", target: "Point"}
        // contributeResponsible5ed68e90ec0683397cbdf9fe: {value: 1, employee: "5ed68e90ec0683397cbdf9fe", role: "Responsible", target: "Contribution"}
        var empPoint = {}, results = {};
        if(evaluations){
            if(evaluations.results.length !== 0) {
                var listResult = evaluations.results;
                for(let i in listResult){
                    if(listResult[i].role === "Responsible"){
                        empPoint[`responsible${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint: 0;
                        results[`approvedPointResponsible${listResult[i].employee._id}`] ={
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : 0,
                            employee: listResult[i].employee._id,
                            role: "Responsible",
                            target: "Point"
                        } 
                        results[`contributeResponsible${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : 0,
                            employee: listResult[i].employee._id,
                            role: "Responsible",
                            target: "Contribution"
                        }
                    }
                    else if(listResult[i].role === "Consulted"){
                        empPoint[`consulted${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint: 0;
                        results[`approvedPointConsulted${listResult[i].employee._id}`] ={
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : 0,
                            employee: listResult[i].employee._id,
                            role: "Consulted",
                            target: "Point"
                        } 
                        results[`contributeConsulted${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : 0,
                            employee: listResult[i].employee._id,
                            role: "Consulted",
                            target: "Contribution"
                        }
                    }
                    // approvedPoint5ed68e90ec0683397cbdf9fc: {value: 1, employee: "5ed68e90ec0683397cbdf9fc", role: "Accountable", target: "Point"}
                    // contributeAccountable5ed68e90ec0683397cbdf9fc: {value: 1, employee: "5ed68e90ec0683397cbdf9fc", role: "Accountable", target: "Contribution"}
                    else if(listResult[i].role === "Accountable"){
                        empPoint[`accountable${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint: 0;
                        results[`approvedPoint${listResult[i].employee._id}`] ={
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : 0,
                            employee: listResult[i].employee._id,
                            role: "Accountable",
                            target: "Point"
                        } 
                        results[`contributeAccountable${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : 0,
                            employee: listResult[i].employee._id,
                            role: "Accountable",
                            target: "Contribution"
                        }
                    }
                    
                    
                }
                // var res = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "Accountable" ));
                // if(res) point = res.employeePoint ? res.employeePoint : 0;
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
        }

        let statusOptions = []; statusOptions.push(task && task.status);
        
        this.state={
            info: info,
            results: results,
            empPoint: empPoint,
            status: statusOptions,
            progress: task.progress,
            autoPoint: automaticPoint,
            date: date
        }
        console.log('-----------------------------------------', this.state);
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

    componentWillMount() {
        this.props.getTaskById(this.props.id);
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

    handleChangeProgress = async (e) => {
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                progress: value,
                autoPoint: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
        // document.getElementById(`autoPoint-${this.props.perform}`).innerHTML = value;
    } 

// ====================================================================

    handleChangeAccountablePoint = async (e, id) => {
        var value = parseInt(e.target.value);
        var name = e.target.name
        await this.setState(state =>{
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Accountable",
                target: "Point"
            }
            state.empPoint[`accountable${id}`] = value;
            return {
                ...state,
                // accountablePoint: value,
                errorOnAccountablePoint: this.validatePoint(value)
            }
        })
        // document.getElementById(`accountablePoint${id}`).innerHTML = value;
    }

    handleChangeAccountableContribution = async(e, id)=>{
        var value = parseInt(e.target.value);
        var name = e.target.name;
        await this.setState(state =>{
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Accountable",
                target: "Contribution"
            }
            return {
                ...state,
                // accountableContribution: value,
                errorOnAccountableContribution: this.validatePoint(value)
            }
        })
    }

    handleChangeApprovedPointForResponsible = async (e, id) => {
        var value = parseInt(e.target.value);
        var name = e.target.name
        await this.setState(state =>{
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Responsible",
                target: "Point"
            }
            return {
                ...state,
                // accountablePoint: value,
                errorOnAccountablePoint: this.validatePoint(value)
            }
        })
    }

    handleChangeResponsibleContribution = async(e, id)=>{
        var value = parseInt(e.target.value);
        var name = e.target.name;
        await this.setState(state =>{
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Responsible",
                target: "Contribution"
            }
            return {
                ...state,
                // accountableContribution: value,
                errorOnAccountableContribution: this.validatePoint(value)
            }
        })
    }

    handleChangeApprovedPointForConsulted = async (e, id) => {
        var value = parseInt(e.target.value);
        var name = e.target.name
        await this.setState(state =>{
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Consulted",
                target: "Point"
            }
            return {
                ...state,
                // accountablePoint: value,
                errorOnAccountablePoint: this.validatePoint(value)
            }
        })
        // document.getElementById(`accountablePoint${id}`).innerHTML = value;
    }

    handleChangeConsultedContribution = async(e, id)=>{
        var value = parseInt(e.target.value);
        var name = e.target.name;
        await this.setState(state =>{
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Consulted",
                target: "Contribution"
            }
            return {
                ...state,
                // accountableContribution: value,
                errorOnAccountableContribution: this.validatePoint(value)
            }
        })
    }

// ==============================================================
    
    handleChangeMyPoint = async(e)=>{
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                myPoint: value,
                errorOnMyPoint: this.validatePoint(value)
            }
        })
    }

    onContributeChange = async (e, id)=>{
        var {name, value} = e.target;
        await this.setState(state=>{
            state.results[`${name}`] = {
                value: value,
                employee: id,
            }
            return {
                ...state,
                // [name]: value
            }
        });
    }

    onApprovedPointChange = async (e, id)=>{
        var {name, value} = e.target;
        await this.setState(state=>{
            state.results[`${name}`] = {
                value: value,
                employee: id,
            }
            return {
                ...state,
                // [name]: value
            }
        });
        // document.getElementById(`autoPoint-${this.props.perform}`).innerHTML = value;
    }

// ==========================BEGIN HANDLE INFORMATION TASK=========================================

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

    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
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

    validateNumberInfo = (value) => {
        var { translate } = this.props;
        let msg = undefined;
        
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = "Giá trị bắt buộc phải chọn";
        }
        
        return msg;
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

// ==========================END HANDLE INFORMATION TASK=========================================

    // validatePoint = (value) => {
    //     var { translate } = this.props;
    //     let msg = undefined;
    //     if (value < 0 || value > 100) {
    //         msg = translate('task.task_perform.modal_approve_task.err_range');
    //     }
    //     if (isNaN(value)) {
    //         msg = translate('task.task_perform.modal_approve_task.err_empty');
    //     }
    //     return msg;
    // }
    
    
    handleStatusChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                status: value
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
    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }
        
        return msg;
    }

    isFormValidated = () => {
        const { errorOnDate, errorOnPoint, errorOnAccountablePoint, errorOnAccountableContribution, errorOnMyPoint,
            errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnNumberInfo, errorOnTextInfo} = this.state;
        return (errorOnDate === undefined && errorOnPoint === undefined &&  errorOnProgress === undefined 
                && errorOnInfoDate === undefined && errorOnAccountablePoint === undefined 
                && errorOnAccountableContribution === undefined && errorOnMyPoint === undefined
                && errorOnInfoBoolean === undefined && errorOnNumberInfo === undefined && errorOnTextInfo === undefined)?true:false;
    }
    
    save = () => {
        var {tasks} = this.props;
        let task = (tasks && tasks.task) && tasks.task.info;

        var evaluations, taskId;
        taskId = this.props.id;
        var data = {
            user: getStorage("userId"),
            progress: this.state.progress,
            automaticPoint: this.state.autoPoint !== 0 ? this.state.autoPoint : parseInt(this.state.progress),
            role: "Responsible",
            // status: this.state.status !== undefined ? this.state.status : ['Inprocess'],
            status: this.state.status,

            date: this.state.date,
            
            info: this.state.info,
            results: this.state.results,
        }

        console.log('data', data, taskId);
        this.props.evaluateTaskByAccountableEmployees(data, taskId);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('nextProps, prevState',nextProps, prevState);
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // TODO: ve sau can sửa
                id: nextProps.id,
                // point: nextProps.point,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined,
                errorOnInfoBoolean: undefined, 
                errorOnTextInfo: undefined, 
                errorOnNumberInfo: undefined,
                errorOnAccountablePoint: undefined,
                errorOnAccountableContribution: undefined, 
                errorOnMyPoint: undefined
            } 
        } else {
            return null;
        }
    }

    render() {
        const { translate, tasks, performtasks } = this.props;
        const { date, status, priority, progress, accountablePoint, autoPoint, myPoint, accountableContribution, infoDate, infoBoolean, setOfValue } = this.state;
        const { errorOnDate, errorOnPoint, errorOnAccountablePoint, errorOnAccountableContribution, errorOnMyPoint,
                errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnNumberInfo, errorOnTextInfo} = this.state;
        var task = (tasks && tasks.task)&& tasks.task.info;

        return (
            <React.Fragment>
            <DialogModal
                modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}-${this.props.perform}`}
                // modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}`}
                formID="form-evaluate-task-by-accountable"
                title={this.props.title}
                func={this.save}
                disableSubmit={!this.isFormValidated()}
                size={75}
                maxWidth={750}
            >
                <form id="form-evaluate-task-by-accountable">
                    <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                        <label>Ngày đánh giá:<span className="text-red">*</span></label>
                        <DatePicker
                            id={`create_date_${this.props.perform}`}
                            value={date}
                            onChange={this.handleDateChange}
                        />
                        <ErrorLabel content={errorOnDate} />
                    </div>
                    { 
                    (this.props.perform === "stop") &&
                        <div className="form-group">
                            <label>Trạng thái công việc:</label>
                            {
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`select-priority-task-${this.props.perform}-${this.props.role}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {[{value: "Inprocess", text: "Inprocess"}, {value: "WaitForApproval", text:"WaitForApproval"}, {value: "Finished", text:"Finished"}, {value: "Delayed", text:"Delayed"}, {value: "Canceled", text:"Canceled"}]}
                                    onChange={this.handleStatusChange}
                                    multiple={false}
                                    value={status}
                                />
                            }
                        </div>
                    }
                    
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
                        <strong>Đánh giá thành viên tham gia công việc: </strong>
                        <br/>
                        <br/>
                        {
                            <table className="table table-striped table-hover">
                                <tr>
                                    <th>Tên</th>
                                    <th>Vai trò</th>
                                    <th>Điểm tự đánh giá</th>
                                    <th>% đóng góp</th>
                                    <th>Đánh giá của người phê duyệt</th>
                                </tr>
                            
                                {
                                    task && task.responsibleEmployees.map((item,index) => 
                                        (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{'Responsible'}</td>
                                                <td>{this.state.empPoint[`responsible${item._id}`]?this.state.empPoint[`responsible${item._id}`]:0}</td>
                                                {/* <td>{this.state.results[`consulted${item._id}`]?this.state.results[`consulted${item._id}`]:0}</td> */}
                                                <td style={{padding: 5}}>
                                                    <input className="form-control" 
                                                        value={this.state.results[`contributeResponsible${item._id}`] ? this.state.results[`contributeResponsible${item._id}`].value : 0} 
                                                        type="number" name={`contributeResponsible${item._id}`} placeholder={"% Đóng góp"} 
                                                        onChange={(e)=>this.handleChangeResponsibleContribution(e,item._id)}
                                                    />
                                                </td>
                                                <td style={{padding: 5}}>
                                                    <input className="form-control" type="number" 
                                                        value={this.state.results[`approvedPointResponsible${item._id}`]? this.state.results[`approvedPointResponsible${item._id}`].value: 0} 
                                                        name={`approvedPointResponsible${item._id}`} placeholder={"Điểm phê duyệt"} 
                                                        onChange={(e)=>this.handleChangeApprovedPointForResponsible(e,item._id)}
                                                    />
                                                </td>
                                            </tr>  
                                        )
                                          
                                    )
                                }
                                {
                                    task && task.consultedEmployees.map((item,index) => 
                                        (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{'Consulted'}</td>
                                                {/* <td>{this.state.results[`responsible${item._id}`]?this.state.results[`responsible${item._id}`]:0}</td> */}
                                                <td>{this.state.empPoint[`consulted${item._id}`]?this.state.empPoint[`consulted${item._id}`]:0}</td>
                                                <td style={{padding: 5}}>
                                                    <input className="form-control" type="number" 
                                                        value={this.state.results[`contributeConsulted${item._id}`] ? this.state.results[`contributeConsulted${item._id}`].value : 0}
                                                        name={`contributeConsulted${item._id}`} placeholder={"% Đóng góp"} 
                                                        onChange={(e)=>this.handleChangeConsultedContribution(e,item._id)}
                                                    />
                                                </td>
                                                <td style={{padding: 5}}>
                                                    <input className="form-control" type="number" 
                                                        value={this.state.results[`approvedPointConsulted${item._id}`] ? this.state.results[`approvedPointConsulted${item._id}`].value : 0 }
                                                        name={`approvedPointConsulted${item._id}`} placeholder={"Điểm phê duyệt"} 
                                                        onChange={(e)=>this.handleChangeApprovedPointForConsulted(e,item._id)}
                                                    />
                                                </td>
                                            </tr>  
                                        )
                                          
                                    )
                                }
                                {
                                    task && task.accountableEmployees.map((item,index) => 
                                        (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{'Accountable'}</td>
                                                <td><p id={`accountablePoint${item._id}`}>{this.state.empPoint[`accountable${item._id}`]?this.state.empPoint[`accountable${item._id}`] : 0 }</p></td>
                                                <td style={{padding: 5}}>
                                                    <input className="form-control" type="number"
                                                        value={this.state.results[`contributeAccountable${item._id}`] ? this.state.results[`contributeAccountable${item._id}`].value : 0}
                                                        name={`contributeAccountable${item._id}`} placeholder={"% Đóng góp"} 
                                                        onChange={(e)=>this.handleChangeAccountableContribution(e,item._id)}
                                                    />
                                                </td>
                                                <td style={{padding: 5}}>
                                                    <input className="form-control" type="number"
                                                        value={this.state.results[`approvedPoint${item._id}`] ? this.state.results[`approvedPoint${item._id}`].value : 0 }
                                                        name={`approvedPoint${item._id}`} placeholder={"Điểm phê duyệt"} 
                                                        onChange={(e)=>this.handleChangeAccountablePoint(e,item._id)}
                                                    />
                                                </td>
                                            </tr>  
                                        )
                                          
                                    )
                                }
                            </table> 
                        }
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks } = state; 
    return { tasks, performtasks };
}
const getState = {
    getTaskById: taskManagementActions.getTaskById,
    createResult: performTaskAction.createResultTask,
    editResultTask: performTaskAction.editResultTask,
    editStatusOfTask: taskManagementActions.editStatusOfTask,
    evaluateTaskByAccountableEmployees: taskManagementActions.evaluateTaskByAccountableEmployees
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployee));
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployee }
