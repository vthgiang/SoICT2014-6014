import React, { Component } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, ErrorLabel, QuillEditor, TreeSelect, convertImageBase64ToFile } from '../../../../common-components/';
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
            errorInfo: {},
            task: data.task,
            userId: data.idUser,
            taskName: data.task.name,
            taskDescription: data.task.description,
            taskDescriptionDefault: data.task.description,
            idUser: data.idUser,
            info: data.info,
            date: data.date,
            progress: data.task.progress,
            taskProjectName: data.task.taskProject,
        }
    }

    componentDidMount() {

        let { task, userId } = this.state;
        let date = this.formatDate(new Date());
        let department = task.organizationalUnit ? task.organizationalUnit._id : '';

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
                errorOnProgress: undefined,
                errorInfo: {}
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
        evaluations = task?.evaluations?.find(e => (monthOfEval === new Date(e?.date)?.getMonth() && yearOfEval === new Date(e?.date)?.getFullYear()));

        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : 0;

        let date = this.formatDate(new Date());
        let point = undefined;
        let info = {};
        let cloneKpi = [];

        var infoEval = task.taskInformations;

        for (let i in infoEval) {

            if (infoEval[i].type === "date") {
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
            else if (infoEval[i].type === "set_of_values") {
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
                let res = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "responsible"));
                if (res) point = res.employeePoint ? res.employeePoint : undefined;
            }


            date = this.formatDate(evaluations.date);

        }
        return {
            task: task,
            idUser: idUser,
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
                type: 'number'
            }
            state.errorInfo[name] = this.validateNumberInfo(value);
            return {
                ...state,
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
                type: 'text'
            }
            state.errorInfo[name] = this.validateTextInfo(value);
            return {
                ...state,
            }
        })
    }

    handleInfoDateChange = (value, code) => {
        console.log('value', value);
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'date'
            }
            state.errorInfo[code] = this.validateDate(value);
            return {
                ...state,
            }
        });
    }

    handleSetOfValueChange = async (value, code) => {

        this.setState(state => {

            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'set_of_values'
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
                type: 'boolean'
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

    handleTaskDescriptionChange = (value, imgs) => {
        console.log(value, imgs)
        this.validateTaskDescription(value, imgs, true);
    }

    validateTaskDescription = (value, imgs, willUpdateState) => {
        let { translate } = this.props;
        let errorMessage = undefined;
        // if (value === "") {
        //     errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        // }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    taskDescription: value,
                    taskDescriptionImages: imgs,
                    errorTaskDescription: errorMessage,
                }
            })
        }
        return errorMessage === undefined;
    }

    handleTaskProject = (value) => {
        value = value.toString();
        this.setState({
            taskProjectName: value
        })
    }

    handleChangeListInfo = (data) => {
        this.setState({ listInfo: data })
    }

    isFormValidated = () => {
        let { info, errorInfo } = this.state;
        let check = true;
        if (Object.keys(errorInfo).length !== 0) {
            for (let i in errorInfo) {
                if (errorInfo[i]) {
                    check = false;
                    return;
                }
            }
        }

        return this.validateTaskName(this.state.taskName, false)
            && this.validateTaskDescription(this.state.taskDescription, false) && (this.state.errorOnProgress === undefined && check)
    }

    save = () => {
        let taskId = this.props.id;
        let imageDescriptions = convertImageBase64ToFile(this.state.taskDescriptionImages)

        let data = {
            listInfo: this.state.listInfo,
            date: this.formatDate(Date.now()),
            name: this.state.taskName,
            description: this.state.taskDescription,
            taskDescriptionImages: null,
            user: this.state.userId,
            progress: this.state.progress,
            info: this.state.info,
            taskProject: this.state.taskProjectName,
            imageDescriptions: imageDescriptions
        }

        this.props.editTaskByResponsibleEmployees(data, taskId);
    }

    checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

    render() {
        const { KPIPersonalManager, translate, project } = this.props
        const { task, taskName, taskDescription, kpi, taskProjectName } = this.state;
        const { errorTaskName, errorTaskDescription, taskDescriptionDefault } = this.state;
        const { title, id, role, perform } = this.props;

        let listKpi = [];
        if (KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;

        return (
            <div>
                <React.Fragment>
                    <DialogModal
                        size={75}
                        maxWidth={750}
                        modalID={`modal-edit-task-by-${role}-${id}`}
                        formID={`form-edit-task-${role}-${id}`}
                        title={title}
                        isLoading={false}
                        func={this.save}
                        disableSubmit={!this.isFormValidated()}
                    >
                        <form id={`form-edit-task-${role}-${id}`}>
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
                                        <label>{translate('task.task_management.detail_description')}</label>
                                        <QuillEditor
                                            id={`task-edit-by-responsible-${this.props.id}`}
                                            table={false}
                                            embeds={false}
                                            quillValueDefault={taskDescriptionDefault}
                                            getTextData={this.handleTaskDescriptionChange}
                                            maxHeight={180}
                                            placeholder={"Mô tả công việc"}
                                        />
                                        <ErrorLabel content={errorTaskDescription} />
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            {translate('task.task_management.project')}
                                        </label>
                                        <TreeSelect
                                            id={`select-task-project-task-edit-by-responsible-${id}`}
                                            mode='radioSelect'
                                            data={project?.data?.list?.filter((projectItem) => projectItem.projectType === 1)}
                                            handleChange={this.handleTaskProject}
                                            value={[taskProjectName]}
                                        />
                                    </div>
                                </div>

                                {/*KPI related*/}

                                {/* <div className="form-group">
                                    <label>{translate('task.task_management.detail_kpi')}:</label>
                                    {
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id={`select-kpi-personal-edit-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listKpi && listKpi.map(x => { return { value: x._id, text: x.name } })}
                                            onChange={this.handleKpiChange}
                                            multiple={true}
                                            value={kpi}
                                        />
                                    }
                                </div> */}
                            </fieldset>
                            <TaskInformationForm
                                task={task && task}

                                handleChangeProgress={this.handleChangeProgress}
                                handleInfoBooleanChange={this.handleInfoBooleanChange}
                                handleInfoDateChange={this.handleInfoDateChange}
                                handleSetOfValueChange={this.handleSetOfValueChange}
                                handleChangeNumberInfo={this.handleChangeNumberInfo}
                                handleChangeTextInfo={this.handleChangeTextInfo}
                                handleChangeListInfo={this.handleChangeListInfo}

                                role={role}
                                perform={perform}
                                value={this.state}
                                progress={this.state.progress}
                            />
                        </form>
                    </DialogModal>
                </React.Fragment>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tasks, KPIPersonalManager, project } = state;
    return { tasks, KPIPersonalManager, project };
}

const actionGetState = { //dispatchActionToProps
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
    editTaskByResponsibleEmployees: performTaskAction.editTaskByResponsibleEmployees,
}

const modalEditTaskByResponsibleEmployee = connect(mapStateToProps, actionGetState)(withTranslate(ModalEditTaskByResponsibleEmployee));
export { modalEditTaskByResponsibleEmployee as ModalEditTaskByResponsibleEmployee };
