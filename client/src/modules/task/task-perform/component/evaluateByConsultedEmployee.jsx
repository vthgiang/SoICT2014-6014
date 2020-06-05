import React, { Component } from 'react';
import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';
import { getStorage } from '../../../../config';

class EvaluateByConsultedEmployee extends Component {
    constructor(props) {
        super(props);
        this.state={
            info: {}
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
    
    componentWillMount() {
        this.props.getTaskById(this.props.id);
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
        var { point, errorOnPoint } = this.state;
        return ( point !== undefined && errorOnPoint === undefined)?true:false;
    }
    
    save = () => {
        var {tasks} = this.props;
        let task = (tasks && tasks.task) && tasks.task.info;

        var evaluations, taskId;
        taskId = this.props.id;
        evaluations = task.evaluations[task.evaluations.length-1]
        var data = {
            evaluateId: evaluations._id,
            user: getStorage("userId"),
            role: "Consulted",
            employeePoint: this.state.point,
            date: this.formatDate(Date.now()),
            automaticPoint: task.evaluations[task.evaluations.length-1].results.length !== 0 ? task.evaluations[task.evaluations.length-1].results[0].automaticPoint : 0 
        }

        console.log('data', data, taskId);
        this.props.evaluateTaskByConsultedEmployee(data,taskId);
    }



    render() {
        var { point, errorOnPoint } = this.state;
        var { id, role } = this.props;
        var { tasks } = this.props;
        var task = tasks.task.info;
        return (
            <React.Fragment>
            <DialogModal
                modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}-${this.props.perform}`}
                // modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}`}
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
                                placeholder={85}
                                onChange={this.handleChangePoint}
                                value={point}
                            />
                            <ErrorLabel content={errorOnPoint}/>
                        </div>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin đánh giá công việc tháng này</legend>
                            
                            {/* Hiện giờ đang lấy tháng đánh giá cuối cùng trong mảng là tháng đang đánh giá */}
                            {/* TODO: sửa lấy theo tháng đúng tháng đánh giá hiện tại theo Date */}

                            {
                                (task.evaluations.length !== 0 ) &&
                                <div >
                                    {
                                         (task.evaluations[task.evaluations.length-1].taskInformations.length !== 0) &&
                                         <div>
                                            <p><span style={{fontWeight: "bold"}}>Mức độ hoàn thành:</span> {task && task.progress}%</p>
                                            {/* {
                                                (task && task.taskInformations.length !== 0) &&
                                                task.taskInformations.map(info => {
                                                    return <div>
                                                        <p>{info.name}&nbsp;-&nbsp;Giá trị: {info.value}</p>
                                                    </div>
                                                })
                                            } */}
                                            {
                                                task.evaluations[task.evaluations.length-1].taskInformations.map(info => {
                                                    return <div>
                                                        <p><span style={{fontWeight: "bold"}}>{info.name}</span>&nbsp;-&nbsp;Giá trị: {info.value? info.value:"Chưa đánh giá"}</p>
                                                        {/* &nbsp;-&nbsp;Giá trị: {info.value} */}
                                                    </div>
                                                })
                                            }
                                        </div> 
                                        }
                                        {/* {
                                            (task.evaluations[task.evaluations.length-1].taskInformations.length === 0) &&
                                            <div><i style={{ color: "red", fontWeight: "bold" }}>...(Thông tin công việc chưa được cung cấp đầy đủ)</i></div>
                                        } */}
                                    
                                    <br/>
                                    {
                                        (task.evaluations[task.evaluations.length-1].results.length !== 0) ?
                                        <div>
                                            <p><span style={{fontWeight: "bold"}}>Điểm tự động:</span> &nbsp;{task.evaluations[task.evaluations.length-1].results[0].automaticPoint}</p>
                                            {
                                                task.evaluations[task.evaluations.length-1].results.map((res) => {
                                                    if(res.role === "Responsible"){
                                                        return <div >
                                                            <p><span style={{fontWeight: "bold"}}>Người thực hiện-{res.employee.name}</span>-Điểm tự đánh giá:{res.employeePoint}</p>
                                                        </div>
                                                    }
                                                })
                                            }
                                        </div> : <div><p style={{color: "red", fontWeight: "bold"}}>Người thực hiện chưa đánh giá </p></div>
                                    }
                                    
                                </div> 
                                // : <div><p style={{color: "red", fontWeight: "bold"}}>Người thực hiện chưa đánh giá</p></div>
                            }
                        </fieldset>
                    </form>
                </form>
            </DialogModal>
        </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks } = state; // tasks,
    return { tasks, performtasks }; // tasks,
}
const getState = {
    getTaskById: taskManagementActions.getTaskById,
    createResult: performTaskAction.createResultTask,
    editResultTask: performTaskAction.editResultTask,
    editStatusOfTask: taskManagementActions.editStatusOfTask,
    evaluateTaskByConsultedEmployees: taskManagementActions.evaluateTaskByConsultedEmployees, 
}

const evaluateByConsultedEmployee = connect(mapState, getState)(withTranslate(EvaluateByConsultedEmployee));
export { evaluateByConsultedEmployee as EvaluateByConsultedEmployee }

// export {EvaluateByConsultedEmployee};