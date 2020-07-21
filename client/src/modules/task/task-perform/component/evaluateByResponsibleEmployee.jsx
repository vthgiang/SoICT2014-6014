import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { TaskInformationForm } from './taskInformationForm';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import { getStorage } from '../../../../config';
import moment from 'moment'

var currentTask;

class EvaluateByResponsibleEmployee extends Component {
    constructor(props) {

        super(props);

        let date = this.formatDate(new Date());
        let data = this.getData(date);

        this.state = {
            calcInfo: {},
            task: data.task,
            idUser: data.idUser,
            info: data.info,
            autoPoint: data.calcAuto,
            oldAutoPoint: data.autoPoint,
            date: data.date,
            kpi: data.kpi,
            point: data.point,
            progress: data.progress
        }

        currentTask = data;
    }

    //  Hàm xử lý dữ liệu khởi tạo
    getData = (dateParam) => {
        let idUser = getStorage("userId");
        let { task } = this.props;
        let evaluations;

        let splitter = dateParam.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        evaluations = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));

        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : undefined;

        let date = this.formatDate(new Date());
        if (this.props.perform === "stop") {
            date = this.formatDate(new Date());
        }
        else if (this.props.perform === "evaluate") {
            date = moment().endOf("month").format('DD-MM-YYYY');
        }

        let point = undefined;
        let info = {};
        let cloneKpi = [];

        let infoTask = task.taskInformations;
        for (let i in infoTask) {
            if (infoTask[i].type === "Date") {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: this.formatDate(infoTask[i].value),
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
                else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                    info[`${infoTask[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
            else if (infoTask[i].type === "SetOfValues") {
                let splitSetOfValues = infoTask[i].extra.split('\n');
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: [infoTask[i].value],
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
                else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                    info[`${infoTask[i].code}`] = {
                        value: [splitSetOfValues[0]],
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
            else {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: infoTask[i].value,
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
        }

        let progress = task.progress;
        if (evaluations) {
            progress = evaluations.progress;
            if (evaluations.results.length !== 0) {
                let res = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "Responsible"));
                if (res) point = res.employeePoint ? res.employeePoint : undefined;
            }
            let infoEval = evaluations.taskInformations;
            let chkHasInfo = false;
            for (let i in infoEval) {
                if (infoEval[i].value !== undefined) {
                    chkHasInfo = true;
                    break;
                }
            }

            if (chkHasInfo) {
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
            }

            if (this.props.perform === "stop") {
                if (chkHasInfo) {
                    date = this.formatDate(evaluations.date);
                }
                else date = this.formatDate(new Date());
            }
            else if (this.props.perform === "evaluate") {

                date = this.formatDate(evaluations.date);

            }

            let tmp = evaluations.kpis.find(e => (String(e.employee._id) === String(idUser)));
            if (tmp) {
                let kpi = tmp.kpis;

                for (let i in kpi) {
                    cloneKpi.push(kpi[i]._id);
                }
            }
        }

        let taskInfo = {
            task: task,
            progress: progress,
            date: date,
            info: info,
        };

        let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(calcAuto)) calcAuto = undefined

        return {
            task: task,
            idUser: idUser,
            kpi: cloneKpi,
            info: info,
            autoPoint: automaticPoint,
            point: point,
            date: date,
            progress: progress,
            calcAuto: calcAuto,
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

    handleKpiChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }

    handleDateChange = (value) => {
        let { idUser, task } = this.state;

        let data = this.getData(value);
        this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, task.organizationalUnit._id, value);

        let automaticPoint = data.autoPoint;
        let taskInfo = {
            task: data.task,
            progress: data.progress,
            date: value,
            info: data.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        this.setState(state => {
            return {
                ...state,
                errorOnDate: this.validateDate(value),
                date: value,
                info: data.info,
                kpi: data.kpi,
                autoPoint: automaticPoint,
                point: data.point,
                oldAutoPoint: data.autoPoint,
                progress: data.progress,
            }
        });
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

    handleChangeProgress = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
        await this.handleChangeAutoPoint();
    }

    handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
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
        await this.handleChangeAutoPoint();
    }

    handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        await this.setState(state => {
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

    handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Boolean'
            }
            return {
                ...state,
            }
        });
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    validateTextInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty')
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

    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
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
        const { errorOnDate, errorOnPoint, errorOnProgress, errorOnInfoDate, errorOnTextInfo, errorOnNumberInfo } = this.state;
        var { info } = this.state;

        var check = true;
        for (let i in info) {
            if (info[i].value === undefined) {
                check = false;
                break;
            }
        }
        return (errorOnDate === undefined && errorOnPoint === undefined && errorOnProgress === undefined
            && errorOnInfoDate === undefined && errorOnTextInfo === undefined && errorOnNumberInfo === undefined) ? true : false;
    }

    calcAutomaticPoint = () => {
        let taskInfo = {
            task: this.state.task,
            progress: this.state.progress,
            date: this.state.date,
            info: this.state.info,
        };

        let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        return automaticPoint;
    }

    handleChangeAutoPoint = async () => {
        let automaticPoint = this.calcAutomaticPoint();
        await this.setState(state => {
            return {
                ...state,
                autoPoint: automaticPoint,
                showAutoPointInfo: undefined
            }
        });
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

    formatRole = (data) => {
        const { translate } = this.props;
        if (data === "Consulted") return translate('task.task_management.consulted');
        if (data === "Accountable") return translate('task.task_management.accountable');
        if (data === "Responsible") return translate('task.task_management.responsible');
    }

    handleAddTaskLog = () => {
        let title = '';
        let description = '';

        let { date, kpi, progress, autoPoint, point } = this.state;

        if (date !== currentTask.date ||
            JSON.stringify(kpi) !== JSON.stringify(currentTask.kpi) ||
            autoPoint !== currentTask.autoPoint ||
            point !== currentTask.point
        ) {
            title = title + 'Chỉnh sửa thông tin đánh giá theo vai trò người thực hiện';

            if (date !== currentTask.date) {
                description = description + 'Ngày đánh giá mới: ' + date;
            }

            if (JSON.stringify(kpi) !== JSON.stringify(currentTask.kpi)) {
                const { KPIPersonalManager } = this.props;
                let listKpi = [];
                if (KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;

                let newKpi = [];
                for (const element of kpi) {
                    let a = listKpi.filter(item => item._id === element);
                    newKpi.push(a[0].name);
                }

                description = description === '' ? description + 'Liên kết tới các KPI mới: ' + JSON.stringify(newKpi) : description + '. ' + 'Liên kết tới các KPI mới: ' + JSON.stringify(newKpi);
            }

            if (autoPoint !== currentTask.autoPoint) {
                description = description === '' ? description + 'Điểm chấm tự động mới: ' + autoPoint : description + '. ' + 'Điểm chấm tự động mới: ' + autoPoint;
            }

            if (point !== currentTask.point) {
                description = description === '' ? description + 'Điểm tự đánh giá mới: ' + point : description + '. ' + 'Điểm tự đánh giá mới: ' + point;
            }
        }

        if (currentTask.task.progress !== progress) {
            title = title === '' ? title + 'Chỉnh sửa thông tin công việc' : title + '. ' + 'Chỉnh sửa thông tin công việc';
            description = description === '' ? description + 'Mức độ hoàn thành mới: ' + progress + "%" : description + '. ' + 'Mức độ hoàn thành mới: ' + progress + "%";
        }

        if (title !== '' || description !== '') {
            this.props.addTaskLog({
                createdAt: Date.now(),
                taskId: this.props.id,
                creator: getStorage("userId"),
                title: title,
                description: description,
            })
        }
    }

    save = () => {
        let taskId;
        taskId = this.props.id;
        let data = {
            user: getStorage("userId"),
            progress: this.state.progress,
            automaticPoint: this.state.autoPoint,
            employeePoint: this.state.point,
            role: "Responsible",

            kpi: this.state.kpi ? this.state.kpi : [],
            date: this.state.date,
            info: this.state.info,

        }

        console.log('data', data, taskId);
        this.props.evaluateTaskByResponsibleEmployees(data, taskId);

        this.handleAddTaskLog();
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

    render() {
        const { translate, KPIPersonalManager } = this.props;
        const { task, point, oldAutoPoint, autoPoint, date, kpi, showAutoPointInfo } = this.state;
        const { errorOnDate, errorOnPoint } = this.state;

        let listKpi = [];
        if (KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;

        let taskActions = task.taskActions;
        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let actionsNotRating = taskActions.filter(item => (
            item.rating === -1 &&
            new Date(item.createdAt).getMonth() === evaluationsDate.getMonth()
            && new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
        ))

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
                            <label>{translate('task.task_management.evaluate_date')}:<span className="text-red">*</span></label>
                            <DatePicker
                                id={`create_date_${this.props.perform}`}
                                value={date}
                                onChange={this.handleDateChange}
                            />
                            <ErrorLabel content={errorOnDate} />
                        </div>
                        <div className="form-group">
                            <label>{translate('task.task_management.detail_kpi')}:</label>
                            {
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`select-kpi-personal-evaluate-${this.props.perform}-${this.props.role}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={((KPIPersonalManager && KPIPersonalManager.kpiSets) ? KPIPersonalManager.kpiSets.kpis : []).map(x => { return { value: x._id, text: x.name } })}
                                    onChange={this.handleKpiChange}
                                    multiple={true}
                                    value={kpi}
                                />
                            }
                        </div>
                        <div>
                            <TaskInformationForm
                                task={task && task}

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
                            <strong>{translate('task.task_management.detail_auto_point')}: &nbsp;
                            <a style={{ cursor: "pointer" }} id={`autoPoint-${this.props.perform}`} onClick={() => this.handleShowAutomaticPointInfo()}>
                                    {autoPoint !== undefined ? autoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                </a>
                            </strong>
                            <br />
                            <br />
                            <strong>{translate('task.task_management.detail_auto_on_system')}: &nbsp;
                            <a style={{ color: "black" }}>
                                    {oldAutoPoint ? oldAutoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                </a>
                            </strong>
                            <br />
                            <br />
                            <strong>{translate('task.task_management.action_not_rating')}: &nbsp; </strong>
                            <ul>
                                {actionsNotRating.length === 0 ? <li>{translate('task.task_management.no_action')}.</li> :
                                    actionsNotRating.map((item, index) => {
                                        return <li key={index}>
                                            {item.description}
                                        </li>
                                    })
                                }
                            </ul>

                            {
                                showAutoPointInfo === 1 &&
                                <ModalShowAutoPointInfo
                                    task={this.state.task}
                                    progress={this.state.progress}
                                    date={this.state.date}
                                    info={this.state.info}
                                    autoPoint={autoPoint}
                                />
                            }
                            <br />
                            <div className={`form-group ${errorOnPoint === undefined ? "" : "has-error"}`}>
                                <label>{translate('task.task_management.detail_emp_point')} (<span style={{ color: "red" }}>*</span>)</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="point"
                                    placeholder={translate('task.task_management.enter_emp_point')}
                                    onChange={this.handleChangePoint}
                                    value={point}
                                />
                                <ErrorLabel content={errorOnPoint} />
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
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
    evaluateTaskByResponsibleEmployees: performTaskAction.evaluateTaskByResponsibleEmployees,
    addTaskLog: performTaskAction.addTaskLog,
}

const evaluateByResponsibleEmployee = connect(mapState, getState)(withTranslate(EvaluateByResponsibleEmployee));
export { evaluateByResponsibleEmployee as EvaluateByResponsibleEmployee }
