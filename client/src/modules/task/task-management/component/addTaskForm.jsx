import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from "../../../../config";

import ValidationHelper from '../../../../helpers/validationHelper';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../task-template/redux/actions';
import { taskManagementActions } from '../redux/actions';
import { ProjectActions } from "../../../project/projects/redux/actions";
import { DatePicker, TimePicker, SelectBox, ErrorLabel, ToolTip, TreeSelect, QuillEditor, InputTags } from '../../../../common-components';
import { TaskFormValidator } from './taskFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import ProjectCreateForm from '../../../project/projects/components/createProject';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { ROOT_ROLE } from '../../../../helpers/constants';
import dayjs from "dayjs";

function AddTaskForm(props) {
    const { tasktemplates, user, translate, tasks, department, project, isProcess, info, role } = props;
    const userId = getStorage("userId");
    const [state, setState] = useState(() => initState())
    function initState() {
        return {
            newTask: {
                name: "",
                description: "",
                quillDescriptionDefault: "",
                startDate: "",
                endDate: "",
                startTime: "",
                endTime: "05:30 PM",
                priority: 3,
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                creator: getStorage("userId"),
                organizationalUnit: "",
                collaboratedWithOrganizationalUnits: [],
                taskTemplate: "",
                parent: "",
                taskProject: "",
                tags: []
            },
            currentRole: getStorage('currentRole'),
        }
    }
    const { id, newTask } = state;

    useEffect(() => {
        const { currentRole } = state;
        props.showInfoRole(currentRole);
        props.getTaskTemplateByUser(1, 0, [], ""); //pageNumber, noResultsPerPage, arrayUnit, name=""
        // Lấy tất cả nhân viên trong công ty
        // props.getAllUserOfCompany();
        props.getAllUserInAllUnitsOfCompany();
        props.getPaginateTasksByUser([], "1", "5", [], [], [], null, null, null, null, null, false, "listSearch");
        // Lấy danh sách tất cả dự án
        props.getProjectsDispatch({ calledId: "" });
        //Đặt lại thời gian mặc định khi mở modal
        window.$(`#addNewTask-${id}`).on('shown.bs.modal', regenerateTime);
        return () => {
            window.$(`#addNewTask-${id}`).unbind('shown.bs.modal', regenerateTime)
        }
    }, [])

    //Chức năng tạo task bằng process
    useEffect(() => {
        if (props.isProcess) {
            let { info } = props;
            setState({
                ...state,
                id: props.id,
                newTask: {
                    organizationalUnit: (info && info.organizationalUnit) ? typeof (info.organizationalUnit) === 'object' ? info.organizationalUnit._id : info.organizationalUnit : "",//props.department?.tree[0]?.id
                    collaboratedWithOrganizationalUnits: (info && info.collaboratedWithOrganizationalUnits) ? info.collaboratedWithOrganizationalUnits : [],
                    name: (info && info.name) ? info.name : '',
                    responsibleEmployees: (info && info.responsibleEmployees) ? info.responsibleEmployees : [],
                    accountableEmployees: (info && info.accountableEmployees) ? info.accountableEmployees : [],
                    consultedEmployees: (info && info.consultedEmployees) ? info.consultedEmployees : [],
                    informedEmployees: (info && info.informedEmployees) ? info.informedEmployees : [],
                    quillDescriptionDefault: (info && info.description) ? info.description : '',
                    description: (info && info.description) ? info.description : '',
                    creator: (info && info.creator) ? info.creator : getStorage("userId"),
                    priority: (info && info.priority) ? info.priority : 3,
                    parent: (info && info.parent) ? info.parent : "",
                    taskProject: (info && info.taskProject) ? info.taskProject : "",
                    endDate: (info && info.endDate) ? info.endDate : "",
                    startDate: (info && info.startDate) ? info.startDate : "",
                },
                showMore: props.isProcess ? false : true,
            })
            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.manager === state.currentRole
                || item.deputyManager === state.currentRole
                || item.employee === state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
        }
    }, [props.id, props.isProcess])

    // chức năng copy task
    useEffect(() => {
        if (props.task) {
            setState({
                ...state,
                id: props.id,
                newTask: {
                    name: props.task.name,
                    description: props.task.description,
                    quillDescriptionDefault: props.task.description,
                    startDate: formatDate(props.task.startDate),
                    endDate: formatDate(props.task.endDate),
                    priority: props.task.priority,
                    responsibleEmployees: props.task?.responsibleEmployees?.map(e => e._id),
                    accountableEmployees: props.task?.accountableEmployees?.map(e => e._id),
                    consultedEmployees: props.task?.consultedEmployees?.map(e => e._id),
                    informedEmployees: props.task?.informedEmployees?.map(e => e._id),
                    creator: getStorage("userId"),
                    organizationalUnit: props.task.organizationalUnit._id,
                    collaboratedWithOrganizationalUnits: props.task?.collaboratedWithOrganizationalUnits?.map(e => { return { organizationalUnit: e.organizationalUnit._id } }),
                    parent: props.task.parent?._id,
                    taskProject: props.task.taskProject,
                    formula: props.task.formula,
                    taskInformations: props.task.taskInformations,
                    taskActions: props.task.taskActions,
                    startTime: formatTime(props.task.startDate),
                    endTime: formatTime(props.task.endDate),
                },
            });
        }
    }, [props.id, JSON.stringify(props.task)])

    // Khi đổi nhấn add new task sang nhấn add subtask hoặc ngược lại, newTask thì parentTask = "", subTask thì parentTask có giá trị
    useEffect(() => {
        if (props?.parentTask || props?.parentTask === "") {
            setState({
                ...state,
                newTask: {
                    ...state.newTask,
                    parent: props?.parentTask
                }
            });
        }
    }, [props?.parentTask])

    useEffect(() => {
        props.handleChangeTaskData(state.newTask)
    }, [JSON.stringify(newTask)])

    useEffect(() => {
        if (props.isProcess !== true) {
            // Khi truy vấn lấy các đơn vị của user đã có kết quả, và thuộc tính đơn vị của newTask chưa được thiết lập
            if (newTask.organizationalUnit === "" && department.list.length !== 0 && department.isLoading === false) {
                // Tìm unit mà currentRole của user đang thuộc về
                let defaultUnit = department.list?.find(item =>
                    item.managers.find(x => x.id === state.currentRole)
                    || item.deputyManagers.find(x => x.id === state.currentRole)
                    || item.employees.find(x => x.id === state.currentRole));
                if (!defaultUnit && department.list.length > 0) { // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                    defaultUnit = department.list[0]
                }

                if (defaultUnit) {
                    props.getChildrenOfOrganizationalUnits(defaultUnit._id);
                    props.getTaskTemplateByUser(1, 10000, [defaultUnit._id], ""); //pageNumber, noResultsPerPage, arrayUnit, name=""
                }
                setState({
                    ...state,
                    newTask: {
                        ...state.newTask,
                        organizationalUnit: defaultUnit && defaultUnit._id,
                    }
                });
            }
        }

    }, [JSON.stringify(department?.list)])
    // convert ISODate to String dd-mm-yyyy
    const formatDate = (date) => {
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

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
    }

    // convert ISODate to String hh:mm AM/PM
    const formatTime = (date) => {
        return dayjs(date).format("h:mm A");
    }

    // Đặt lại thời gian
    const regenerateTime = () => {
        let currentTime = formatTime(new Date())
        setState(state => {
            return {
                ...state,
                newTask: {
                    ...state.newTask,
                    startTime: currentTime,
                }
            }
        });
    }

    const handleChangeTaskName = (event) => {
        let { value } = event.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        setState({
            ...state,
            newTask: {
                ...state.newTask,
                name: value,
                errorOnName: message
            }
        })
        props.isProcess && props.handleChangeName(value);
    }

    // const handleChangeTaskProject = (e) => {
    //     let { value } = e.target;
    //     setState({
    //         ...state,
    //         newTask: {
    //             ...state.newTask,
    //             taskProject: value
    //         }
    //     })
    // }

    const handleChangeTaskDescription = async (value, imgs) => {
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                description: value,
                imgs: imgs
            }
        });
    }

    const handleChangeTaskStartDate = (value) => {
        validateTaskStartDate(value, true);
    }
    const validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = props;
        const { newTask } = state;
        let msg = TaskFormValidator.validateTaskStartDate(value, newTask.endDate, translate);
        let startDate = convertDateTime(value, newTask.startTime);
        let endDate = convertDateTime(newTask.endDate, newTask.endTime);
        if (startDate > endDate) {
            msg = translate('task.task_management.add_err_end_date');
        }
        if (willUpdateState) {
            setState({
                ...state,
                newTask: {
                    ...state.newTask,
                    startDate: value,
                    errorOnStartDate: msg,
                }
            })
            newTask.startDate = value;
            newTask.errorOnStartDate = msg;
            if (!msg && newTask.endDate) {
                setState({
                    ...state,
                    newTask: {
                        ...state.newTask,
                        errorOnEndDate: msg
                    }
                })
            }
        }
        return msg === undefined;
    }

    const handleStartTimeChange = (value) => {
        let { translate } = props;
        let startDate = convertDateTime(state.newTask.startDate, value);
        let endDate = convertDateTime(state.newTask.endDate, state.newTask.endTime);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
            resetErr = undefined;
        }
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                startTime: value,
                errorOnStartDate: err,
                errorOnEndDate: resetErr,
            }
        });
    }

    const handleEndTimeChange = (value) => {
        let { translate } = props;
        let startDate = convertDateTime(state.newTask.startDate, state.newTask.startTime);
        let endDate = convertDateTime(state.newTask.endDate, value);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
            resetErr = undefined;
        }
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                endTime: value,
                errorOnEndDate: err,
                errorOnStartDate: resetErr,
            }
        })
    }

    const handleChangeTaskEndDate = (value) => {
        validateTaskEndDate(value, true);
    }

    const validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = props;
        const { newTask } = state
        let msg = TaskFormValidator.validateTaskEndDate(newTask.startDate, value, translate);
        if (willUpdateState) {
            setState({
                ...state,
                newTask: {
                    ...state.newTask,
                    endDate: value,
                    errorOnEndDate: msg,
                }
            })
            newTask.endDate = value;
            newTask.errorOnEndDate = msg;
            if (!msg && newTask.startDate) {
                setState({
                    ...state,
                    newTask: {
                        ...newTask,
                        errorOnStartDate: msg
                    }
                });
            }
        }
        return msg === undefined;
    }

    const handleChangeTaskPriority = (event) => {
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                priority: event.target.value
            }
        });
    }

    // Sau khi add project mới hoặc edit project thì call lại tất cả list project
    const handleAfterCreateProject = () => {
        props.getProjectsDispatch({ calledId: "" });
    }

    const handleChangeTaskOrganizationalUnit = (event) => {
        event.preventDefault();
        let value = event.target.value;
        if (value) {
            props.getChildrenOfOrganizationalUnits(value);
            props.getTaskTemplateByUser(1, 10000, [value], ""); //pageNumber, noResultsPerPage, arrayUnit, name=""
            setState({
                ...state,
                newTask: { // update lại unit, và reset các selection phía sau
                    ...state.newTask,
                    organizationalUnit: value,
                    collaboratedWithOrganizationalUnits: [],
                    responsibleEmployees: [],
                    accountableEmployees: [],
                    errorOnName: undefined,
                    errorOnDescription: undefined,
                    errorOnResponsibleEmployees: undefined,
                    errorOnAccountableEmployees: undefined,
                }
            });
        }
    }

    const handleChangeCollaboratedWithOrganizationalUnits = (value) => {
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                collaboratedWithOrganizationalUnits: value.map(item => { return { organizationalUnit: item, isAssigned: false } })
            }
        });
    }

    const handleChangeTaskTemplate = async (event) => {
        let value = event.target.value;
        if (value === "") {
            setState({
                ...state,
                newTask: { // update lại name,description và reset các selection phía sau
                    ...state.newTask,
                    name: "",
                    description: "",
                    priority: 3,
                    responsibleEmployees: [],
                    accountableEmployees: [],
                    consultedEmployees: [],
                    informedEmployees: [],
                    taskTemplate: "",
                    errorOnName: undefined,
                    errorOnDescription: undefined,
                    errorOnResponsibleEmployees: undefined,
                    errorOnAccountableEmployees: undefined,
                }
            });
        }
        else {
            let taskTemplate = props.tasktemplates.items.find(function (taskTemplate) {
                return taskTemplate._id === value;
            });

            setState({
                ...state,
                newTask: { // update lại name,description và reset các selection phía sau
                    ...state.newTask,
                    collaboratedWithOrganizationalUnits: taskTemplate.collaboratedWithOrganizationalUnits.map(item => { return { organizationalUnit: item._id, isAssigned: false } }),
                    name: taskTemplate.name,
                    description: taskTemplate.description,
                    quillDescriptionDefault: taskTemplate.description,
                    priority: taskTemplate.priority,
                    responsibleEmployees: taskTemplate.responsibleEmployees.map(item => item.id),
                    accountableEmployees: taskTemplate.accountableEmployees.map(item => item.id),
                    consultedEmployees: taskTemplate.consultedEmployees.map(item => item.id),
                    informedEmployees: taskTemplate.informedEmployees.map(item => item.id),
                    taskTemplate: taskTemplate._id,
                }
            });
        }
    }


    const handleSelectedParent = (value) => {
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                parent: value[0]
            }
        })

    }

    const onSearch = async (txt) => {
        await props.getPaginateTasksByUser([], "1", "5", [], [], [], txt, null, null, null, null, false, "listSearch");
    }

    const handleChangeTaskResponsibleEmployees = (value) => {
        validateTaskResponsibleEmployees(value, true);
    }
    const validateTaskResponsibleEmployees = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);
        if (willUpdateState) {
            setState({
                ...state,
                newTask: {
                    ...state.newTask,
                    responsibleEmployees: value,
                    errorOnResponsibleEmployees: message
                }
            });
            props.isProcess && props.handleChangeResponsible(value)
        }
        return message === undefined;
    }


    const handleChangeTaskAccountableEmployees = (value) => {
        validateTaskAccountableEmployees(value, true);
    }
    const validateTaskAccountableEmployees = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                newTask: {
                    ...state.newTask,
                    accountableEmployees: value,
                    errorOnAccountableEmployees: message
                }
            });
            props.isProcess && props.handleChangeAccountable(value)
        }
        return message === undefined;
    }

    const handleChangeTaskConsultedEmployees = (value) => {
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                consultedEmployees: value
            }
        });
    }
    const handleChangeTaskInformedEmployees = (value) => {
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                informedEmployees: value
            }
        });
    }

    const handleTaskProject = (selected) => {
        setState({
            ...state,
            newTask: {
                ...state.newTask,
                taskProject: selected[0]
            }
        })
    }

    const handleTaskTags = (value) => {
        setState(state => {
            return {
                ...state,
                newTask: {
                    ...state.newTask,
                    tags: value
            }}
        })
    }
    const uniqueArray = (arr) => {
        var result = arr.reduce((unique, o) => {
            if (!unique.some(obj => obj.value === o.value && obj.text === o.text)) {
                unique.push(o);
            }
            return unique;
        }, []);
        return result
    }
    let listTaskTemplate;
    let listDepartment = department?.list;
    let taskTemplate;
    if (tasktemplates.taskTemplate) {
        taskTemplate = tasktemplates.taskTemplate;
    }
    if (tasktemplates.items && newTask.organizationalUnit) {
        // listTaskTemplate = tasktemplates.items.filter(function (taskTemplate) {
        //     return taskTemplate.organizationalUnit._id === newTask.organizationalUnit;
        // });
        listTaskTemplate = tasktemplates.items
    }

    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }

    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);

    let listParentTask = [{ value: "", text: `--${translate('task.task_management.add_parent_task')}--` }];
    if (newTask.parent && props.currentTasks) {
        let taskItem = props.currentTasks.find(e => e._id === props.parentTask);
        taskItem && listParentTask.push({ value: taskItem._id, text: taskItem.name })
    }

    if (tasks.listSearchTasks) {
        let arr = tasks.listSearchTasks.map(x => { return { value: x._id, text: x.name } });
        listParentTask = [...listParentTask, ...arr];
        listParentTask = uniqueArray(listParentTask)
    }

    const checkCurrentRoleIsManager = role && role.item &&
        role.item.parents.length > 0 && role.item.parents.filter(o => o.name === ROOT_ROLE.MANAGER)

    return (
        <React.Fragment>

            {/** Form chứa thông tin của task */}
            <ProjectCreateForm
                handleAfterCreateProject={handleAfterCreateProject}
            />
            <div className="row">
                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                    {/* Thông tin công việc */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('task.task_management.detail_info')}</legend>
                        
                        <div className={'row'}>
                            {/* Đơn vị quản lý công việc */}
                            <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group">
                                <label className="control-label">{translate('task.task_management.unit_manage_task')}<span className="text-red">*</span></label>
                                {listDepartment &&
                                    <select value={newTask.organizationalUnit} className="form-control" onChange={handleChangeTaskOrganizationalUnit}>
                                        {listDepartment.map(x => {
                                            return <option key={x._id} value={x._id}>{x.name}</option>
                                        })}
                                    </select>
                                }
                            </div>

                            {/* Độ ưu tiên công việc */}
                            <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group">
                                <label className="control-label">{translate('task.task_management.detail_priority')}<span className="text-red">*</span></label>
                                <select className="form-control" value={newTask.priority} onChange={handleChangeTaskPriority}>
                                    <option value={5}>{translate('task.task_management.urgent')}</option>
                                    <option value={4}>{translate('task.task_management.high')}</option>
                                    <option value={3}>{translate('task.task_management.standard')}</option>
                                    <option value={2}>{translate('task.task_management.average')}</option>
                                    <option value={1}>{translate('task.task_management.low')}</option>
                                </select>
                            </div>
                        </div>


                        {/* Tên công việc */}
                        <div className={`form-group ${newTask.errorOnName === undefined ? "" : "has-error"}`}>
                            <label>{translate('task.task_management.name')}<span className="text-red">*</span></label>
                            <input type="Name" className="form-control" placeholder={translate('task.task_management.name')} value={(newTask.name)} onChange={handleChangeTaskName} />
                            <ErrorLabel content={newTask.errorOnName} />
                        </div>


                        {/* Mô tả công việc */}
                        <div className={`form-group`}>
                            <label className="control-label">{translate('task.task_management.detail_description')}</label>
                            <QuillEditor
                                id={`task-add-modal-${props.id}-${props.quillId}`}
                                table={false}
                                embeds={false}
                                getTextData={handleChangeTaskDescription}
                                maxHeight={180}
                                quillValueDefault={newTask.quillDescriptionDefault}
                                placeholder={translate('task.task_management.detail_description')}
                            />
                            <ErrorLabel content={newTask.errorOnDescription} />
                        </div>

                        {/* Ngày bắt đầu, kết thúc công việc */}
                        <div className="row form-group">
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`datepicker1-${id}-${props.id}`}
                                    dateFormat="day-month-year"
                                    value={newTask.startDate}
                                    onChange={handleChangeTaskStartDate}
                                />
                                < TimePicker
                                    id={`time-picker-1-${id}-${props.id}`}
                                    refs={`time-picker-1-${id}-${props.id}`}
                                    value={newTask.startTime}
                                    onChange={handleStartTimeChange}
                                />
                                <ErrorLabel content={newTask.errorOnStartDate} />
                            </div>
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`datepicker2-${id}-${props.id}`}
                                    value={newTask.endDate}
                                    onChange={handleChangeTaskEndDate}
                                />
                                < TimePicker
                                    id={`time-picker-2-${id}-${props.id}`}
                                    refs={`time-picker-2-${id}-${props.id}`}
                                    value={newTask.endTime}
                                    onChange={handleEndTimeChange}
                                />
                                <ErrorLabel content={newTask.errorOnEndDate} />
                            </div>
                        </div>
                    </fieldset>
                </div>


                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`} >

                    {/* Phân định trách nhiệm công việc */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('task.task_management.add_raci')} (RACI)</legend>

                        {/* Những người thực hiện công việc */}
                        <div className={`form-group ${newTask.errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                            <label className="control-label">{translate('task.task_management.responsible')}<span className="text-red">*</span></label>
                            {allUnitsMember &&
                                <SelectBox
                                    id={`responsible-select-box${newTask.taskTemplate}-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={handleChangeTaskResponsibleEmployees}
                                    value={newTask.responsibleEmployees}
                                    multiple={true}
                                    options={{ placeholder: translate('task.task_management.add_resp') }}
                                />
                            }
                            <ErrorLabel content={newTask.errorOnResponsibleEmployees} />
                        </div>

                        {/* Những người quản lý/phê duyệt công việc */}
                        <div className={`form-group ${newTask.errorOnAccountableEmployees === undefined ? "" : "has-error"}`}>
                            <label className="control-label">{translate('task.task_management.accountable')}<span className="text-red">*</span></label>
                            {allUnitsMember &&
                                <SelectBox
                                    id={`accounatable-select-box${newTask.taskTemplate}-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={handleChangeTaskAccountableEmployees}
                                    value={newTask.accountableEmployees}
                                    multiple={true}
                                    options={{ placeholder: translate('task.task_management.add_acc') }}
                                />
                            }
                            <ErrorLabel content={newTask.errorOnAccountableEmployees} />
                        </div>

                        {/* Những người tư vấn công việc */}
                        <div className='form-group'>
                            <label className="control-label">{translate('task.task_management.consulted')}</label>
                            {allUnitsMember &&
                                <SelectBox
                                    id={`consulted-select-box${newTask.taskTemplate}-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={handleChangeTaskConsultedEmployees}
                                    value={newTask.consultedEmployees}
                                    multiple={true}
                                    options={{ placeholder: translate('task.task_management.add_cons') }}
                                />
                            }
                        </div>

                        {/* Những người quan sát công việc */}
                        <div className='form-group'>
                            <label className="control-label">{translate('task.task_management.informed')}</label>
                            {allUnitsMember &&
                                <SelectBox
                                    id={`informed-select-box${newTask.taskTemplate}-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={allUnitsMember}
                                    onChange={handleChangeTaskInformedEmployees}
                                    value={newTask.informedEmployees}
                                    multiple={true}
                                    options={{ placeholder: translate('task.task_management.add_inform') }}
                                />
                            }
                        </div>
                    </fieldset>
                </div>
            </div>


            <div className="row">
                <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>
                    {/* Tùy chọn thêm */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('task.task_management.task_additional_info')}</legend>

                        {/* Mẫu công việc */}
                        {(listTaskTemplate) &&
                            <div className="form-group ">
                                <label className="control-label">{translate('task.task_management.add_template')} ({listDepartment.find(e => e._id === newTask.organizationalUnit)?.name})</label>

                                <select className="form-control" value={newTask.taskTemplate} onChange={handleChangeTaskTemplate}>
                                    <option value="">--{translate('task.task_management.add_template_notice')}--</option>
                                    {
                                        listTaskTemplate.map(item => {
                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        }

                        {/* Công việc liên quan */}
                        {props.parentTask || props.task ? // modal tạo subtask và modal copytask
                            <div className="form-group">
                                <label>{translate('task.task_management.add_parent_task')}</label>
                                <input className="form-control" value={listParentTask?.find(x => newTask?.parent === x?.value)?.text || '' } disabled />

                            </div>
                            :
                            //modal tạo mới task
                            <div className="form-group">
                                <label>{translate('task.task_management.add_parent_task')}
                                    <ToolTip
                                        type={"icon_tooltip"}
                                        dataTooltip={[translate('task.task_management.search_task_by_typing')]}
                                    />
                                </label>
                                <SelectBox
                                    id={`select-parent-new-task-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listParentTask}
                                    multiple={false}
                                    value={""}
                                    onChange={handleSelectedParent}
                                    onSearch={onSearch}
                                />
                            </div>
                        }

                        {/* Đơn vị phối hợp thực hiện công việc */}
                        {listDepartment &&
                            <div className="form-group">
                                <label>{translate('task.task_management.collaborated_with_organizational_units')}</label>
                                <SelectBox
                                    id={`multiSelectUnitThatHaveCollaborated-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listDepartment.filter(item => newTask && item._id !== newTask.organizationalUnit).map(x => {
                                        return { text: x.name, value: x._id }
                                    })}
                                    options={{ placeholder: translate('kpi.evaluation.dashboard.select_units') }}
                                    onChange={handleChangeCollaboratedWithOrganizationalUnits}
                                    value={newTask.collaboratedWithOrganizationalUnits?.map(e => e.organizationalUnit)}
                                    multiple={true}
                                />
                            </div>
                        }

                        {/* Dự án liên quan của công việc */}
                        {/** Tạm thời ẩn đi bên Process, nếu muốn hiện xóa check isProcess  */}
                        {!isProcess &&
                            <div className="form-group">
                                <label>
                                    {translate('task.task_management.project')}
                                </label>
                                <TreeSelect
                                    id={`select-task-project-task-${id}`}
                                    mode='radioSelect'
                                    data={props.projectIdFromDetailProject ? project?.data?.list?.filter((projectItem) => projectItem._id === props.projectIdFromDetailProject ) : 
                                        project?.data?.list?.filter((projectItem) => projectItem.projectType === 1 )}
                                    handleChange={handleTaskProject}
                                    value={props.projectIdFromDetailProject || [newTask.taskProject]}
                                    action={checkCurrentRoleIsManager && checkCurrentRoleIsManager.length > 0 ? () => { window.$('#modal-create-project').modal('show') } : null}
                                    actionIcon={checkCurrentRoleIsManager && checkCurrentRoleIsManager.length > 0 && 'fa fa-plus'}
                                />
                            </div>
                        }

                        <div className="form-group">
                            <label>Tags</label>
                            <InputTags
                                id={`tagsinput-${id}`}
                                onChange={handleTaskTags}
                                value={newTask?.tags}
                            />
                        </div>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { tasktemplates, tasks, user, department, project, role } = state;
    return { tasktemplates, tasks, user, department, project, role };
}

const actionCreators = {
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    showInfoRole: RoleActions.show,
};

const connectedAddTaskForm = connect(mapState, actionCreators)(withTranslate(AddTaskForm));
export { connectedAddTaskForm as AddTaskForm };