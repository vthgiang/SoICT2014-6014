import React, { Component } from 'react';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components/';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getStorage } from "../../../../config";
import { TaskInformationForm } from './taskInformationForm';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { performTaskAction } from '../redux/actions';

class ModalEditTaskByResponsibleEmployee extends Component {

    constructor(props) {
        super(props);

        let date = this.formatDate(new Date());
        let data = this.getData(date);

        this.state = {
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

    componentDidMount() {

        let { task, userId } = this.state;
        let date = this.formatDate(new Date());
        let department = task.organizationalUnit._id;

        this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, department, date);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { task } = nextProps;

        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
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

        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : 0;

        let date = this.formatDate(new Date());
        let point = undefined;
        let info = {};
        let cloneKpi = [];

        var infoEval = task.taskInformations;

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
        if (evaluations) {
            if (evaluations.results.length !== 0) {
                let res = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "Responsible"));
                if (res) point = res.employeePoint ? res.employeePoint : undefined;
            }


            date = this.formatDate(evaluations.date);

            let tmp = evaluations.kpis.find(e => (String(e.employee._id) === String(idUser)));
            if (tmp) {
                let kpi = tmp.kpis;

                for (let i in kpi) {
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

    handleChangeProgress = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
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

    handleKpiChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
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

    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    handleTaskNameChange = event => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }

    validateTaskName = (value, willUpdateState) => {
        let { translate } = this.props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
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
        let { translate } = this.props;
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
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
        var { info } = this.state;
        var check = true;
        for (let i in info) {
            if (info[i].value === undefined) {
                check = false;
                break;
            }
        }
        return this.validateTaskName(this.state.taskName, false)
            && this.validateTaskDescription(this.state.taskDescription, false)
    }

    handleAddTaskLog = () => {
        let currentTask = this.state.task;

        let title = '';
        let description = '';

        if (this.state.taskName !== currentTask.name || this.state.taskDescription !== currentTask.description) {
            title = title + 'Chỉnh sửa thông tin cơ bản';

            if (this.state.taskName !== currentTask.name) {
                description = description + 'Tên công việc mới: ' + this.state.taskName;
            }

            if (this.state.taskDescription !== currentTask.description) {
                description = description === '' ? description + 'Mô tả công việc mới: ' + this.state.taskDescription : description + '. ' + 'Mô tả công việc mới: ' + this.state.taskDescription;
            }
        }

        let date = this.formatDate(new Date());
        let info = this.getData(date);
        let kpi = info.kpi;

        let listKpi;
        const { KPIPersonalManager } = this.props
        if (KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;

        if (JSON.stringify(kpi) !== JSON.stringify(this.state.kpi)) {
            title = title === '' ? title + 'Chỉnh sửa liên kết KPI' : title + '. ' + 'Chỉnh sửa liên kết KPI';

            let newKpi = [];
            for (const element of this.state.kpi) {
                let a = listKpi.filter(item => item._id === element);
                newKpi.push(a[0].name);
            }
            description = description === '' ? description + 'Liên kết tới các KPI mới: ' + JSON.stringify(newKpi) : description + '. ' + 'Liên kết tới các KPI mới: ' + JSON.stringify(newKpi);
        }

        if (currentTask.progress !== this.state.progress) {
            title = title === '' ? title + 'Chỉnh sửa thông tin công việc' : title + '. ' + 'Chỉnh sửa thông tin công việc';
            description = description === '' ? description + 'Mức độ hoàn thành mới: ' + this.state.progress + "%" : description + '. ' + 'Mức độ hoàn thành mới: ' + this.state.progress + "%";
        }

        if (title !== '' || description !== '') {
            this.props.addTaskLog({
                createdAt: Date.now(),
                taskId: currentTask._id,
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
            date: this.formatDate(Date.now()),
            name: this.state.taskName,
            description: this.state.taskDescription,
            user: this.state.userId,
            progress: this.state.progress,
            kpi: this.state.kpi ? this.state.kpi : [],
            info: this.state.info,
        }

        this.props.editTaskByResponsibleEmployees(data, taskId);

        this.handleAddTaskLog(taskId);
    }

    render() {
        const { KPIPersonalManager, translate } = this.props
        const { task, taskName, taskDescription, kpi } = this.state;
        const { errorTaskName, errorTaskDescription } = this.state;
        let listKpi = [];
        if (KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;

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
                                <legend className="scheduler-border">{translate('task.task_management.edit_basic_info')}</legend>
                                <div>
                                    <div className={`form-group ${errorTaskName === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.name')}<span className="text-red">*</span></label>
                                        <input
                                            type="text"
                                            value={taskName}
                                            className="form-control"
                                            onChange={this.handleTaskNameChange}
                                        />
                                        <ErrorLabel content={errorTaskName} />
                                    </div>
                                    <div
                                        className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.detail_description')}<span className="text-red">*</span></label>
                                        <input
                                            type="text"
                                            value={taskDescription}
                                            className="form-control" onChange={this.handleTaskDescriptionChange}
                                        />
                                        <ErrorLabel content={errorTaskDescription} />
                                    </div>
                                </div>

                                {/*KPI related*/}

                                <div className="form-group">
                                    <label>{translate('task.task_management.detail_kpi')}:</label>
                                    {
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id={`select-kpi-personal-edit-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listKpi && listKpi.map(x => { return { value: x._id, text: x.name } })}
                                            onChange={this.handleKpiChange}
                                            multiple={true}
                                            value={kpi}
                                        />
                                    }
                                </div>
                            </fieldset>
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
                        </form>
                    </DialogModal>
                </React.Fragment>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tasks, KPIPersonalManager } = state;
    return { tasks, KPIPersonalManager };
}

const actionGetState = { //dispatchActionToProps
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
    editTaskByResponsibleEmployees: performTaskAction.editTaskByResponsibleEmployees,
    addTaskLog: performTaskAction.addTaskLog,
}

const modalEditTaskByResponsibleEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByResponsibleEmployee));
export { modalEditTaskByResponsibleEmployee as ModalEditTaskByResponsibleEmployee };
