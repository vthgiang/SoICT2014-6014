import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, ErrorLabel, QuillEditor, TreeSelect, convertImageBase64ToFile } from '../../../../common-components/';
import { getStorage } from "../../../../config";

import { TaskInformationForm } from './taskInformationForm';

import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { performTaskAction } from '../redux/actions';

function ModalEditTaskByResponsibleEmployee(props) {
    const [state, setState] = useState(initState());
    const { title, id, role, perform } = props;
    const { KPIPersonalManager, translate, project } = props
    const { task, taskName, taskDescription, kpi, taskProjectName,
        errorTaskName, errorTaskDescription, taskDescriptionDefault } = state;

    function initState() {
        let date = formatDate(new Date());
        let data = getData(date);

        return {
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

    useEffect(() => {
        let { task, userId } = state;
        let date = formatDate(new Date());
        let department = task.organizationalUnit ? task.organizationalUnit._id : '';

        props.getAllKpiSetsOrganizationalUnitByMonth(userId, department, date);
    }, [])


    if (props.id !== state.id) {
        setState({
            ...state,
            id: props.id,

            errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
            errorOnPoint: undefined,
            errorOnInfoDate: undefined,
            errorOnProgress: undefined,
            errorInfo: {}
        })
    }

    //  Hàm xử lý dữ liệu khởi tạo
    function getData(dateParam) {
        let idUser = getStorage("userId");
        let { task } = props;

        let evaluations;

        let splitter = dateParam.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        evaluations = task?.evaluations?.find(e => (monthOfEval === new Date(e?.date)?.getMonth() && yearOfEval === new Date(e?.date)?.getFullYear()));

        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : 0;

        let date = formatDate(new Date());
        let point = undefined;
        let info = {};
        let cloneKpi = [];

        var infoEval = task.taskInformations;

        for (let i in infoEval) {

            if (infoEval[i].type === "date") {
                if (infoEval[i].value) {
                    info[`${infoEval[i].code}`] = {
                        value: formatDate(infoEval[i].value),
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
                else if (!infoEval[i].filledByAccountableEmployeesOnly) {
                    info[`${infoEval[i].code}`] = {
                        value: formatDate(Date.now()),
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


            date = formatDate(evaluations.date);

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
    function formatDate(date) {
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

    const handleChangeProgress = async (e) => {
        let value = parseInt(e.target.value);
        setState({
            ...state,
            progress: value,
            errorOnProgress: validatePoint(value)
        })
    }

    const handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'number'
            }
            state.errorInfo[name] = validateNumberInfo(value);
            return {
                ...state,
            }
        })
    }

    const handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        await setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'text'
            }
            state.errorInfo[name] = validateTextInfo(value);
            return {
                ...state,
            }
        })
    }

    const handleInfoDateChange = (value, code) => {
        console.log('value', value);
        setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'date'
            }
            state.errorInfo[code] = validateDate(value);
            return {
                ...state,
            }
        });
    }

    const handleSetOfValueChange = async (value, code) => {
        setState(state => {
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

    const handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        setState(state => {
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


    const validateInfoBoolean = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    const validateTextInfo = (value) => {
        let msg = undefined;
        if (value === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty')
        }
        return msg;
    }

    const validateNumberInfo = (value) => {
        let msg = undefined;

        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    const handleKpiChange = (value) => {
        setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }

    const validatePoint = (value) => {
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    function validateDate(value, willUpdateState = true) {
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    const handleTaskNameChange = event => {
        let value = event.target.value;
        validateTaskName(value, true);
    }

    const validateTaskName = (value, willUpdateState) => {
        let errorMessage = undefined;
        if (value === "") {
            errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        }
        if (willUpdateState) {
            setState({
                ...state,
                taskName: value,
                errorTaskName: errorMessage
            })
        }
        return errorMessage === undefined;
    }

    const handleTaskDescriptionChange = (value, imgs) => {
        console.log(value, imgs)
        validateTaskDescription(value, imgs, true);
    }

    const validateTaskDescription = (value, imgs, willUpdateState) => {
        let { translate } = props;
        let errorMessage = undefined;
        // if (value === "") {
        //     errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
        // }
        if (willUpdateState) {
            setState({
                ...state,
                taskDescription: value,
                taskDescriptionImages: imgs,
                errorTaskDescription: errorMessage,
            })
        }
        return errorMessage === undefined;
    }

    const handleTaskProject = (value) => {
        value = value.toString();
        setState({
            taskProjectName: value
        })
    }

    const handleChangeListInfo = (data) => {
        setState({ listInfo: data })
    }

    const isFormValidated = () => {
        let { info, errorInfo } = state;
        let check = true;
        if (Object.keys(errorInfo).length !== 0) {
            for (let i in errorInfo) {
                if (errorInfo[i]) {
                    check = false;
                    return;
                }
            }
        }

        return validateTaskName(state.taskName, false)
            && validateTaskDescription(state.taskDescription, false) && (state.errorOnProgress === undefined && check)
    }

    const save = () => {
        let taskId = props.id;
        let imageDescriptions = convertImageBase64ToFile(state.taskDescriptionImages)

        let data = {
            listInfo: state.listInfo,
            date: formatDate(Date.now()),
            name: state.taskName,
            description: state.taskDescription,
            taskDescriptionImages: null,
            user: state.userId,
            progress: state.progress,
            info: state.info,
            taskProject: state.taskProjectName,
            imageDescriptions: imageDescriptions
        }

        props.editTaskByResponsibleEmployees(data, taskId);
    }

    const checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

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
                    func={save}
                    disableSubmit={!isFormValidated()}
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
                                        onChange={handleTaskNameChange}
                                    />
                                    <ErrorLabel content={errorTaskName} />
                                </div>
                                <div
                                    className={`form-group ${errorTaskDescription === undefined ? "" : "has-error"}`}>
                                    <label>{translate('task.task_management.detail_description')}</label>
                                    <QuillEditor
                                        id={`task-edit-by-responsible-${props.id}`}
                                        table={false}
                                        embeds={false}
                                        quillValueDefault={taskDescriptionDefault}
                                        getTextData={handleTaskDescriptionChange}
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
                                        handleChange={handleTaskProject}
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
                                        onChange={handleKpiChange}
                                        multiple={true}
                                        value={kpi}
                                    />
                                }
                            </div> */}
                        </fieldset>
                        <TaskInformationForm
                            task={task && task}

                            handleChangeProgress={handleChangeProgress}
                            handleInfoBooleanChange={handleInfoBooleanChange}
                            handleInfoDateChange={handleInfoDateChange}
                            handleSetOfValueChange={handleSetOfValueChange}
                            handleChangeNumberInfo={handleChangeNumberInfo}
                            handleChangeTextInfo={handleChangeTextInfo}
                            handleChangeListInfo={handleChangeListInfo}

                            role={role}
                            perform={perform}
                            value={state}
                            progress={state.progress}
                        />
                    </form>
                </DialogModal>
            </React.Fragment>
        </div>
    );
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
