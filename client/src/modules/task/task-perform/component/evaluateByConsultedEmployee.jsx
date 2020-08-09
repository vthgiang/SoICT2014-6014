import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import { getStorage } from '../../../../config';

class EvaluateByConsultedEmployee extends Component {
    constructor(props) {
        super(props);

        let { date, id } = this.props;
        let data = this.getData(date);

        this.state = {
            id: id,
            info: data.info,
            task: data.task,
            date: data.date,
            progress: data.progress,
            evaluations: data.evaluations,
            automaticPoint: data.automaticPoint,
            point: data.point,
            dentaDate: data.dentaDate,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
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

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id) {
            let { task, idUser } = this.state;
            let department = task.organizationalUnit._id;
            let date = nextProps.date;
            let data = this.getData(date);

            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                    info: data.info,
                    task: data.task,
                    date: data.date,
                    progress: data.progress,
                    evaluations: data.evaluations,
                    automaticPoint: data.automaticPoint,
                    point: data.point,
                    dentaDate: data.dentaDate,
                }
            });
            return false;
        }
        else return true;
    }

    getData = (dateParams) => {
        let idUser = getStorage("userId");
        let { task } = this.props;

        let progress = task.progress;
        let evaluations;
        let date = dateParams;
        let dentaDate = 0;

        let splitter = dateParams.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        evaluations = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));

        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : undefined;

        let point = undefined;
        if (evaluations) {
            let res = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "Consulted"));
            if (res) point = res.employeePoint ? res.employeePoint : undefined;
            // date = this.formatDate(evaluations.date);
            progress = evaluations.progress;
        }

        let infoEval = evaluations ? evaluations.taskInformations : [];
        let info = {};

        for (let i in infoEval) {

            if (infoEval[i].type === "Date") {
                if (infoEval[i].value) {
                    info[`${infoEval[i].code}`] = {
                        value: this.formatDate(infoEval[i].value),
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
                else if (!infoEval[i].filledByAccountableEmployeesOnly) {
                    info[`${infoEval[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }
            else if (infoEval[i].type === "SetOfValues") {
                let splitSetOfValues = infoEval[i].extra.split('\n');
                if (infoEval[i].value) {
                    info[`${infoEval[i].code}`] = {
                        value: [infoEval[i].value],
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
                else if (!infoEval[i].filledByAccountableEmployeesOnly) {
                    info[`${infoEval[i].code}`] = {
                        value: [splitSetOfValues[0]],
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }
            else {
                if (infoEval[i].value) {
                    info[`${infoEval[i].code}`] = {
                        value: infoEval[i].value,
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }
        }
        dentaDate = Math.round(((new Date()).getTime() - dateOfEval.getTime()) / (1000 * 3600 * 24));
        
        return {
            info: info,
            task: task,
            date: date,
            progress: progress,
            evaluations: evaluations,
            automaticPoint: automaticPoint,
            point: point,
            dentaDate: dentaDate,
        }
    }

    checkNullUndefined = (x) => {
        if( x === null || x === undefined ) {
            return false;
        }
        else return true;
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
        await this.setState(state => {
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


    isFormValidated = () => {
        let { point, errorOnPoint } = this.state;
        return (point !== undefined && errorOnPoint === undefined) ? true : false;
    }

    save = () => {
        let taskId;
        taskId = this.state.task._id;
        let data = {
            user: getStorage("userId"),
            role: "Consulted",
            employeePoint: this.state.point,
            date: this.formatDate(Date.now()),
            automaticPoint: this.state.automaticPoint
        }

        this.props.evaluateTaskByConsultedEmployees(data, taskId);
    }

    checkNote = () => {
        let { date } = this.props;
        let splitter = date.split("-");
        let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let now = new Date ();

        if(now.getMonth() === isoDate.getMonth() && now.getFullYear() === isoDate.getFullYear()) {
            return false;
        }
        return true
    }

    render() {
        let { point, errorOnPoint, evaluations, automaticPoint, progress, date, info, showAutoPointInfo, dentaDate } = this.state;
        let { task, translate } = this.props;

        let checkNoteMonth;
        checkNoteMonth = this.checkNote();

        let disabled = false;
        if (checkNoteMonth && (dentaDate > 7)) {
            disabled = true;
        }
        let disableSubmit = !this.isFormValidated();

        return (
            <React.Fragment>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className="row">
                        <div className='col-md-8'>
                            {checkNoteMonth && (dentaDate <= 7 && dentaDate > 0) && <p style={{color: "red"}}>{translate('task.task_management.note_eval')}{8 - dentaDate}.</p>}
                            {checkNoteMonth && (dentaDate > 7) && <p style={{color: "red"}}>{translate('task.task_management.note_not_eval')}</p>}
                        </div>
                        {!(checkNoteMonth && (dentaDate > 7)) &&
                            <div style={{ justifyContent: "flex-end", display: "flex" }} className='col-md-4'>
                                <button disabled={disabled || disableSubmit} className="btn btn-success" onClick={this.save}>{translate('task.task_management.btn_save_eval')}</button>
                            </div>
                        }
                    </div>
                    <form id="form-evaluate-task-by-consulted">
                        <div className={`form-group ${errorOnPoint === undefined ? "" : "has-error"}`}>
                            <label>{translate('task.task_management.detail_emp_point')} (<span style={{ color: "red" }}>*</span>)</label>
                            <input
                                className="form-control"
                                type="number"
                                name="point"
                                placeholder={translate('task.task_management.enter_emp_point')}
                                onChange={this.handleChangePoint}
                                value={this.checkNullUndefined(point) ? point : ''}
                                disabled={disabled} 
                            />
                            <ErrorLabel content={errorOnPoint} />
                        </div>

                        {(evaluations && evaluations.results.length !== 0) ?
                            <div style={{ lineHeight: 2.8 }}>
                                <strong>{translate('task.task_management.detail_auto_point')}: &nbsp;
                                                    <a style={{ cursor: "pointer" }} onClick={() => this.handleShowAutomaticPointInfo()}>
                                        {this.checkNullUndefined(automaticPoint) ? automaticPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                    </a>
                                </strong>
                                {
                                    evaluations.results.map((res, index) => {
                                        if (res.role === "Responsible") {
                                            return <div key={index} >
                                                <span style={{ fontWeight: "bold" }}>{translate('task.task_management.detail_emp_point_of')} {res.employee.name}</span>:&nbsp;&nbsp;&nbsp;{res.employeePoint}
                                            </div>
                                        }
                                    })
                                }
                            </div> : <div><p style={{ color: "red", fontWeight: "bold" }}>{translate('task.task_management.responsible_not_eval')} </p></div>
                        }

                        {/* Thông tin công việc */}
                        <br/>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.info_eval_month')}</legend>
                            <div style={{ lineHeight: 2.8 }}>
                                {/* % tiến độ */}
                                <div><span style={{ fontWeight: "bold" }}>{translate('task.task_management.detail_progress')}:&nbsp;&nbsp;&nbsp;</span>{task && task.progress}%</div>
                                
                                {/* Các thông tin khác */}
                                {
                                    evaluations ?
                                        <div>
                                            {(evaluations.taskInformations.length !== 0) &&
                                                <div>
                                                    {
                                                        evaluations.taskInformations.map((info, index) => {
                                                            if (info.type === "Date") {
                                                                return <div key={index}>
                                                                    <div><span style={{ fontWeight: "bold" }}>{info.name}</span>:&nbsp;&nbsp;&nbsp;{info.value ? this.formatDate(info.value) : translate('task.task_management.not_eval')}</div>
                                                                </div>
                                                            }
                                                            else return <div key={index}>
                                                                <div><span style={{ fontWeight: "bold" }}>{info.name}</span>:&nbsp;&nbsp;&nbsp;{info.value ? info.value : translate('task.task_management.not_eval')}</div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div> : <div><p style={{ color: "red", fontWeight: "bold" }}>{translate('task.task_management.not_eval_on_month')} </p></div>
                                }
                            </div>
                        </fieldset>
                    </form>

                </div>

                {
                    showAutoPointInfo === 1 &&
                    <ModalShowAutoPointInfo
                        task={task}
                        progress={progress}
                        date={date}
                        info={info}
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
