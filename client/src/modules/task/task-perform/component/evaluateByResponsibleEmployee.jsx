import React, { Component } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { kpiMemberActions } from '../../../kpi/evaluation/employee-evaluation/redux/actions';

import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';

class EvaluateByResponsibleEmployee extends Component {
    constructor(props) {
        const token = getStorage();
        const verified = jwt.verify(token, TOKEN_SECRET);
        var idUser = verified._id;
        super(props);
        this.state={
            idUser: idUser 
        }
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
                errorOnProgress: this.validatePoint(value)
            }
        })
        document.getElementById("autoPoint").innerHTML = value;
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

    handleKpiChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }
    
    isFormValidated = () => {

    }
    
    save = () => {

    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // TODO: ve sau can sửa
                id: nextProps.id,
                // kpi: nextProps.kpi,
                // date: nextProps.date,
                // point: nextProps.point,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined
            } 
        } else {
            return null;
        }
    }

    render() {
        const { translate, tasks, performtasks, KPIPersonalManager, kpimembers } = this.props;
        const { point, progress, date, kpi } = this.state;
        const { errorOnDate, errorOnPoint, errorOnProgress } = this.state;
        var items = [{value: '123', text: 'Quang'},{value: '789', text: 'Duyên'}]

        var listKpi = (KPIPersonalManager && KPIPersonalManager.kpipersonals && KPIPersonalManager.kpipersonals[0])? KPIPersonalManager.kpipersonals[0].kpis : [];
        var task = (tasks && tasks.task)&& tasks.task.info;
        console.log('task ', task);
        return (
            <React.Fragment>
            <DialogModal
                modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}`}
                formID={`form-evaluate-task-by-${this.props.role}`}
                title={this.props.title}
                func={this.save}
                disableSubmit={!this.isFormValidated()}
                size={50}
                // maxWidth={500}
            >
                <form id={`form-evaluate-task-by-${this.props.role}`}>
                    <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                        <label>Ngày đánh giá:<span className="text-red">*</span></label>
                        <DatePicker
                            id="create_start_date"
                            value={date}
                            onChange={this.handleDateChange}
                        />
                        <ErrorLabel content={errorOnDate} />
                    </div>
                    <div className="form-group">
                        <label>Liên kết KPI:</label>
                        {
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`select-kpi-personal`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {listKpi.map(x => { return { value: x._id, text: x.name } })}
                                // items = {items}
                                onChange={this.handleKpiChange}
                                multiple={true}
                                value={kpi}
                            />
                        }
                    </div>
                    <div>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin đánh giá công việc tháng này</legend>
                            {/* information task */}
                            <div className={`form-group ${errorOnProgress===undefined?"":"has-error"}`}>
                                <label>Mức độ hoàn thành (<span style={{color:"red"}}>*</span>)</label>
                                <input 
                                    className="form-control"
                                    type="number" 
                                    name="progress"
                                    placeholder={85}
                                    onChange={this.handleChangeProgress}
                                    value={progress}
                                />
                                <ErrorLabel content={errorOnProgress}/>
                                
                            </div>
                            
                            {
                                (task && task.taskInformations.length !== 0) &&
                                task.taskInformations.map((info, index)=> 
                                    <div className={`form-group `}>
                                        <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                        <input 
                                            className="form-control"
                                            type="text" 
                                            name={info.code}
                                            placeholder={85}
                                            // onChange={this.handleChangeProgress}
                                            // value={index}
                                        />
                                        {/* <ErrorLabel content={errorOnProgress}/> */}
                                    </div>
                                )
                            }
                        </fieldset>
                    </div>
                    <div>
                        <strong>Điểm tự động: &nbsp;<span id='autoPoint'></span> </strong>
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
    const { tasks, performtasks, kpimembers, KPIPersonalManager } = state; // tasks,
    return { tasks, performtasks, kpimembers, KPIPersonalManager }; // tasks,
}
const getState = {
    getTaskById: taskManagementActions.getTaskById,
    createResult: performTaskAction.createResultTask,
    editResultTask: performTaskAction.editResultTask,
    editStatusOfTask: taskManagementActions.editStatusOfTask,
    getKPIMemberById: kpiMemberActions.getKPIMemberById,
    getAllKPIPersonalByUserID: managerKpiActions.getAllKPIPersonalByUserID
}

const evaluateByResponsibleEmployee = connect(mapState, getState)(withTranslate(EvaluateByResponsibleEmployee));
export { evaluateByResponsibleEmployee as EvaluateByResponsibleEmployee }

// export {EvaluateByResponsibleEmployee} ;