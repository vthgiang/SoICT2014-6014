import React, { Component } from 'react';
import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';
import { getStorage } from '../../../../config';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';

class EvaluateByConsultedEmployee extends Component {
    constructor(props) {
        super(props);

        let idUser = getStorage("userId");
        let { task } = this.props;
        
        let progress = task.progress;
        let evaluations;
        let dateOfEval = new Date();
        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        evaluations = task.evaluations.find(e => ( monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()) );

        let automaticPoint = ( evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : undefined;
        
        let point = undefined, date;
        if(evaluations){
            let res = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "Consulted" ));
            if(res) point = res.employeePoint ? res.employeePoint : undefined;
            date = evaluations.date;
        }

        let infoEval = evaluations? evaluations.taskInformations : [];
        let info = {};

        for(let i in infoEval){
                   
            if(infoEval[i].type === "Date"){
                if(infoEval[i].value){
                    info[`${infoEval[i].code}`] = {
                        value: this.formatDate(infoEval[i].value),
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                } 
                else if( !infoEval[i].filledByAccountableEmployeesOnly ) {
                    info[`${infoEval[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                } 
            }
            else if(infoEval[i].type === "SetOfValues"){
                let splitSetOfValues = infoEval[i].extra.split('\n');
                if(infoEval[i].value){
                    info[`${infoEval[i].code}`] = {
                        value: [infoEval[i].value],
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
                else if(!infoEval[i].filledByAccountableEmployeesOnly){
                    info[`${infoEval[i].code}`] = {
                        value: [splitSetOfValues[0]],
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }
            else {
                if(infoEval[i].value){
                    info[`${infoEval[i].code}`] = {
                        value: infoEval[i].value,
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }         
        }

        this.state={
            info: info,
            task: task,
            date: date,
            progress: progress,
            evaluations: evaluations,
            automaticPoint: automaticPoint,
            point: point
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
    
    // componentDidMount() {
    //     this.props.getTaskById(this.props.id);
    // }

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

    
    handleShowAutomaticPointInfo = async () => {
        await this.setState(state => {
            return {
                ...state,
                showAutoPointInfo: 1
            }
        });
        window.$(`#modal-automatic-point-info`).modal('show');
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('nextProps.id !== prevState.id', nextProps, prevState);
        if(nextProps.id !== prevState.id){
            return{
                ...prevState,
                id: nextProps.id,
                // TODO: Ve sau can sua

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined,
                errorOnInfoBoolean: undefined, 
                errorOnTextInfo: undefined, 
                errorOnNumberInfo: undefined
            }
        }else{
            return null;
        }
    }


    isFormValidated = () => {
        let { point, errorOnPoint, info  } = this.state;
        return ( point !== undefined && errorOnPoint === undefined)?true:false;
    }
    
    save = () => {
        let taskId;
        taskId = this.props.id;
        let data = {
            user: getStorage("userId"),
            role: "Consulted",
            employeePoint: this.state.point,
            date: this.formatDate(Date.now()),
            automaticPoint: this.state.automaticPoint
        }

        console.log('data', data, taskId);
        this.props.evaluateTaskByConsultedEmployees(data,taskId);
    }



    render() {
        let { point, errorOnPoint, evaluations, automaticPoint } = this.state;
        let { id, role, task } = this.props;

        return (
            <React.Fragment>
            <DialogModal
                modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}-${this.props.perform}`}
                formID="form-evaluate-task-by-consulted"
                title={this.props.title}
                func={this.save}
                disableSubmit={!this.isFormValidated()}
                size={75}
                maxWidth={750}
            >
                <form id="form-evaluate-task-by-consulted">
                    <form className="form-group">
                        <div className={`form-group ${errorOnPoint===undefined?"":"has-error"}`}>
                            <label>Điểm tự đánh giá (<span style={{color:"red"}}>*</span>)</label>
                            <input 
                                className="form-control"
                                type="number" 
                                name="point"
                                placeholder={"Nhập điểm tự đánh giá"}
                                onChange={this.handleChangePoint}
                                value={point}
                            />
                            <ErrorLabel content={errorOnPoint}/>
                        </div>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin đánh giá công việc tháng này</legend>
                            <p><span style={{fontWeight: "bold"}}>Mức độ hoàn thành:</span> {task && task.progress}%</p>
                            {   
                                evaluations ?
                                <div >
                                    {
                                        (evaluations.taskInformations.length !== 0) &&
                                        <div>
                                            {/* <p><span style={{fontWeight: "bold"}}>Mức độ hoàn thành:</span> {task && task.progress}%</p> */}
                                            {
                                                evaluations.taskInformations.map(info => {
                                                    if(info.type === "Date"){
                                                        return <div>
                                                            <p><span style={{fontWeight: "bold"}}>{info.name}</span>&nbsp;-&nbsp;Giá trị: {info.value? this.formatDate(info.value):"Chưa đánh giá"}</p>
                                                        </div>
                                                    }
                                                    else return <div>
                                                        {/* TODO: Check date ISO */}
                                                        <p><span style={{fontWeight: "bold"}}>{info.name}</span>&nbsp;-&nbsp;Giá trị: {info.value? info.value:"Chưa đánh giá"}</p>
                                                    </div>
                                                })
                                            }
                                        </div> 
                                    }                                        
                                    <br/>
                                    {
                                        (evaluations.results.length !== 0) ?
                                        <div>
                                            {/* <p><span style={{fontWeight: "bold"}}>Điểm tự động:</span> &nbsp;{automaticPoint}</p> */}
                                            <strong>Điểm tự động: &nbsp;
                                                <a href="javascript:void(0)" onClick = { () => this.handleShowAutomaticPointInfo() }>
                                                    {automaticPoint !== undefined? automaticPoint : "Chưa tính được"}
                                                </a>
                                            </strong>
                                            {
                                                evaluations.results.map((res) => {
                                                    if(res.role === "Responsible"){
                                                        return <div >
                                                            <p><span style={{fontWeight: "bold"}}>Người thực hiện-{res.employee.name}</span>-Điểm tự đánh giá:{res.employeePoint}</p>
                                                        </div>
                                                    }
                                                })
                                            }
                                        </div> : <div><p style={{color: "red", fontWeight: "bold"}}>Người thực hiện chưa đánh giá </p></div>
                                    }
                                    
                                </div> : <div><p style={{color: "red", fontWeight: "bold"}}>Chưa có thông tin đánh giá công việc </p></div>
                            }
                        </fieldset>
                    </form>
                </form>
            </DialogModal>
            {
                this.state.showAutoPointInfo === 1 && 
                <ModalShowAutoPointInfo
                    task={this.state.task}
                    progress={this.state.progress}
                    date={this.state.date}
                    info={this.state.info}
                    autoPoint={automaticPoint}
                />
            }
        </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks } = state; 
    return { tasks, performtasks }; 
}
const getState = {
    evaluateTaskByConsultedEmployees: performTaskAction.evaluateTaskByConsultedEmployees, 
}

const evaluateByConsultedEmployee = connect(mapState, getState)(withTranslate(EvaluateByConsultedEmployee));
export { evaluateByConsultedEmployee as EvaluateByConsultedEmployee }
