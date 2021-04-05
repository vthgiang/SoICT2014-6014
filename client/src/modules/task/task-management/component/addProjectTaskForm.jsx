import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { getStorage } from '../../../../config';
import ValidationHelper from '../../../../helpers/validationHelper';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../task-template/redux/actions';
import { taskManagementActions } from '../redux/actions';

import { DatePicker, TimePicker, SelectBox, ErrorLabel, ToolTip, TreeSelect, QuillEditor } from '../../../../common-components';
import { TaskFormValidator } from './taskFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { ROOT_ROLE } from '../../../../helpers/constants';
import dayjs from "dayjs";
import { getCurrentProjectDetails } from '../../../project/component/projects/functionHelper';

class AddProjectTaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTask: {
                name: "",
                description: "",
                quillDescriptionDefault: "",
                startDate: "",
                endDate: "",
                priority: 3,
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                creator: getStorage("userId"),
                organizationalUnit: "",
                collaboratedWithOrganizationalUnits: [],
                taskTemplate: "",
                preceedingTask: "",
                taskProject: "",
                estimateNormalTime: '',
                estimateOptimisticTime: '',
                estimatePessimisticTime: '',
                estimateNormalCost: '',
                estimateMaxCost: '',
            },
            startTime: "08:00 AM",
            endTime: "05:30 PM",
            currentRole: getStorage('currentRole'),
        };
    }

    componentDidMount() {
        const { currentRole } = this.state;
        this.props.showInfoRole(currentRole);
        this.props.getTaskTemplateByUser(1, 0, [], ""); //pageNumber, noResultsPerPage, arrayUnit, name=""
        // Lấy tất cả nhân viên trong công ty
        // this.props.getAllUserOfCompany();
        this.props.getAllUserInAllUnitsOfCompany();
        this.props.getPaginateTasksByUser([], "1", "5", [], [], [], null, null, null, null, null, false, "listSearch");
    }

    convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
    }

    // convert ISODate to String hh:mm AM/PM
    formatTime(date) {
        return dayjs(date).format("hh:mm A");
    }

    isTaskFormValidated = () => {
        let result =
            this.validateTaskName(this.state.newTask.name, false) &&
            this.validateTaskDescription(this.state.newTask.description, false) &&
            this.validateTaskStartDate(this.state.newTask.startDate, false) &&
            this.validateTaskEndDate(this.state.newTask.endDate, false) &&
            this.validateTaskAccountableEmployees(this.state.newTask.accountableEmployees, false) &&
            this.validateTaskResponsibleEmployees(this.state.newTask.responsibleEmployees, false);
        return result;
    }

    handleChangeTaskName = (event) => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }
    validateTaskName = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            this.state.newTask.name = value;
            this.state.newTask.errorOnName = message;
            this.setState(state => {
                return {
                    ...state,
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
            this.props.isProcess && this.props.handleChangeName(this.state.newTask.name)
        }
        return message === undefined;
    }

    handleChangeTaskProject = (e) => {
        let { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                newTask: {
                    ...state.newTask,
                    taskProject: value
                }
            }
        })
        this.props.handleChangeTaskData(this.state.newTask)
    }

    handleChangeTaskDescription = (value, imgs) => {
        this.validateTaskDescription(value, true);
    }
    validateTaskDescription = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    newTask: {
                        ...state.newTask,
                        description: value,
                        errorOnDescription: message
                    }
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
        }
        return message === undefined;
    }

    handleChangeTaskStartDate = (value) => {
        this.validateTaskStartDate(value, true);
    }
    validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = TaskFormValidator.validateTaskStartDate(value, this.state.newTask.endDate, translate);
        let { newTask } = this.state;
        let startDate = this.convertDateTime(value, this.state.startTime);
        let endDate = this.convertDateTime(this.state.newTask.endDate, this.state.endTime);
        if (startDate > endDate) {
            msg = translate('project.task_management.add_err_end_date');
        }
        if (willUpdateState) {
            newTask.startDate = value;
            newTask.errorOnStartDate = msg;
            if (!msg && newTask.endDate) newTask.errorOnEndDate = msg;
            this.setState(state => {
                return {
                    ...state,
                    newTask
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
        }
        return msg === undefined;
    }

    handleStartTimeChange = (value) => {
        let { translate } = this.props;
        let startDate = this.convertDateTime(this.state.newTask.startDate, value);
        let endDate = this.convertDateTime(this.state.newTask.endDate, this.state.endTime);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('project.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('project.task_management.add_err_end_date');
            resetErr = undefined;
        }
        this.setState(state => {
            return {
                ...state,
                startTime: value,
                newTask: {
                    ...state.newTask,
                    errorOnStartDate: err,
                    errorOnEndDate: resetErr,
                }
            }
        }, () => {
            this.props.handleChangeStartTime(this.state.startTime);
            this.props.handleChangeTaskData(this.state.newTask)
        });
    }

    handleEndTimeChange = (value) => {
        let { translate } = this.props;
        let startDate = this.convertDateTime(this.state.newTask.startDate, this.state.startTime);
        let endDate = this.convertDateTime(this.state.newTask.endDate, value);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('project.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('project.task_management.add_err_end_date');
            resetErr = undefined;
        }

        this.setState(state => {
            return {
                ...state,
                endTime: value,
                newTask: {
                    ...state.newTask,
                    errorOnEndDate: err,
                    errorOnStartDate: resetErr,
                }
            }
        }, () => {
            this.props.handleChangeEndTime(this.state.endTime);
            this.props.handleChangeTaskData(this.state.newTask);
        });
    }

    handleChangeTaskEndDate = (value) => {
        this.validateTaskEndDate(value, true);
    }

    validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { newTask } = this.state;
        let msg = TaskFormValidator.validateTaskEndDate(newTask.startDate, value, translate);

        if (willUpdateState) {
            newTask.endDate = value;
            newTask.errorOnEndDate = msg;
            if (!msg && newTask.startDate) newTask.errorOnStartDate = msg;
            this.setState(state => {
                return {
                    ...state,
                    newTask
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
        }
        return msg === undefined;
    }

    handleChangeTaskPriority = (event) => {
        this.state.newTask.priority = event.target.value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.handleChangeTaskData(this.state.newTask)
    }

    handleChangeTaskOrganizationalUnit = (event) => {
        event.preventDefault();
        let value = event.target.value;
        if (value) {
            this.props.getChildrenOfOrganizationalUnits(value);
            this.props.getTaskTemplateByUser(1, 10000, [value], ""); //pageNumber, noResultsPerPage, arrayUnit, name=""
            this.setState(state => {
                return {
                    ...state,
                    newTask: { // update lại unit, và reset các selection phía sau
                        ...this.state.newTask,
                        organizationalUnit: value,
                        collaboratedWithOrganizationalUnits: [],
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        errorOnName: undefined,
                        errorOnDescription: undefined,
                        errorOnResponsibleEmployees: undefined,
                        errorOnAccountableEmployees: undefined,
                    }
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
        }
    }

    handleChangeCollaboratedWithOrganizationalUnits = async (value) => {
        this.setState(state => {
            return {
                ...state,
                newTask: {
                    ...this.state.newTask,
                    collaboratedWithOrganizationalUnits: value.map(item => { return { organizationalUnit: item, isAssigned: false } })
                }
            };
        });
        this.props.handleChangeTaskData(this.state.newTask)
    }

    handleChangeTaskTemplate = async (event) => {
        let value = event.target.value;
        if (value === "") {
            this.setState(state => {
                return {
                    ...state,
                    newTask: { // update lại name,description và reset các selection phía sau
                        ...this.state.newTask,
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
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
        }
        else {
            let taskTemplate = this.props.tasktemplates.items.find(function (taskTemplate) {
                return taskTemplate._id === value;
            });

            this.setState(state => {
                return {
                    ...state,
                    newTask: { // update lại name,description và reset các selection phía sau
                        ...this.state.newTask,
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
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
        }
    }


    handleSelectedParent = async (value) => {
        const val = value[0];

        this.setState(state => {
            return {
                newTask: {
                    ...state.newTask,
                    parent: val
                }
            }
        }, () => this.props.handleChangeTaskData(this.state.newTask))

    }

    onSearch = async (txt) => {

        await this.props.getPaginateTasksByUser([], "1", "5", [], [], [], txt, null, null, null, null, false, "listSearch");

        this.setState(state => {
            state.newTask.parent = "";
            return {
                ...state,
            }
        });
        this.props.handleChangeTaskData(this.state.newTask)
    }

    handleChangeTaskResponsibleEmployees = (value) => {
        this.validateTaskResponsibleEmployees(value, true);
    }
    validateTaskResponsibleEmployees = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { message } = ValidationHelper.validateArrayLength(this.props.translate, value);

        if (willUpdateState) {
            this.state.newTask.responsibleEmployees = value;
            this.state.newTask.errorOnResponsibleEmployees = message;
            this.setState(state => {
                return {
                    ...state,
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
            this.props.isProcess && this.props.handleChangeResponsible(this.state.newTask.responsibleEmployees)
        }
        return message === undefined;
    }


    handleChangeTaskAccountableEmployees = (value) => {
        this.validateTaskAccountableEmployees(value, true);
    }
    validateTaskAccountableEmployees = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { message } = ValidationHelper.validateArrayLength(this.props.translate, value);

        if (willUpdateState) {
            this.state.newTask.accountableEmployees = value;
            this.state.newTask.errorOnAccountableEmployees = message;
            this.setState(state => {
                return {
                    ...state,
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
            this.props.isProcess && this.props.handleChangeAccountable(this.state.newTask.accountableEmployees)
        }
        return message === undefined;
    }



    handleChangeTaskConsultedEmployees = (value) => {
        this.state.newTask.consultedEmployees = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.handleChangeTaskData(this.state.newTask)
    }
    handleChangeTaskInformedEmployees = (value) => {
        this.state.newTask.informedEmployees = value;
        this.setState(state => {
            return {
                ...state,
            };
        });
        this.props.handleChangeTaskData(this.state.newTask)
    }

    handleTaskProject = (selected) => {
        this.setState({
            newTask: {
                ...this.state.newTask,
                taskProject: selected[0]
            }
        }, () => this.props.handleChangeTaskData(this.state.newTask))
    }

    handleChangePreceedingTask = (selected) => {
        console.log(selected)
        // this.setState({
        //     newTask: {
        //         ...this.state.newTask,
        //         preceedingTask: selected
        //     }
        // }, () => this.props.handleChangeTaskData(this.state.newTask))
    }

    handleChangeEstTimeTask = (value, timeType) => {
        if (timeType === 'estimateNormalTime') {
            this.setState({
                newTask: {
                    ...this.state.newTask,
                    estimateNormalTime: value,
                    estimateOptimisticTime: value || Number(value) < 0 ? (Number(value) - 2).toString() : '',
                    estimatePessimisticTime: value || Number(value) < 0 ? (Number(value) + 2).toString() : '',
                    errorOnTimeEst: TaskFormValidator.validateTimeEst(value, this.props.translate),
                }
            }, () => this.props.handleChangeTaskData(this.state.newTask))
            return;
        }
        this.setState({
            newTask: {
                ...this.state.newTask,
                [timeType]: value,
                errorOnTimeEst: TaskFormValidator.validateTimeEst(value, this.props.translate),
            }
        }, () => this.props.handleChangeTaskData(this.state.newTask))
    }

    handleChangeEstCostNormalTask = (value, costType) => {
        if (costType === 'estimateNormalCost') {
            this.setState({
                newTask: {
                    ...this.state.newTask,
                    estimateNormalCost: value,
                    estimateMaxCost: value || Number(value) < 0 ? (Number(value) + 5 * Math.floor(Number(value) / 100)).toString() : '',
                    errorOnCostEst: TaskFormValidator.validateCostEst(value, this.props.translate),
                }
            }, () => this.props.handleChangeTaskData(this.state.newTask))
            return;
        }
        this.setState({
            newTask: {
                ...this.state.newTask,
                [costType]: value,
                errorOnCostEst: TaskFormValidator.validateCostEst(value, this.props.translate),
            }
        }, () => this.props.handleChangeTaskData(this.state.newTask))
    }



    // convert ISODate to String dd-mm-yyyy
    formatDate(date) {
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

    shouldComponentUpdate = (nextProps, nextState) => {
        const { user, department } = this.props;
        const { newTask } = this.state;

        //Chức năng tạo task bằng process
        if (nextProps.isProcess && nextProps.id !== this.state.id) {
            let { info } = nextProps;
            this.setState(state => {
                return {
                    id: nextProps.id,
                    newTask: {
                        organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit._id : "",//nextProps.department?.tree[0]?.id
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
                    showMore: this.props.isProcess ? false : true,
                }
            })


            let defaultUnit;
            if (user && user.organizationalUnitsOfUser) defaultUnit = user.organizationalUnitsOfUser.find(item =>
                item.manager === this.state.currentRole
                || item.deputyManager === this.state.currentRole
                || item.employee === this.state.currentRole);
            if (!defaultUnit && user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
                // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = user.organizationalUnitsOfUser[0]
            }
            return false;
        }


        if (nextProps.task && nextProps.id !== this.state.id) {
            this.setState({
                id: nextProps.id,
                newTask: {
                    name: nextProps.task.name,
                    description: nextProps.task.description,
                    quillDescriptionDefault: nextProps.task.description,
                    startDate: this.formatDate(nextProps.task.startDate),
                    endDate: this.formatDate(nextProps.task.endDate),
                    priority: nextProps.task.priority,
                    responsibleEmployees: nextProps.task?.responsibleEmployees?.map(e => e._id),
                    accountableEmployees: nextProps.task?.accountableEmployees?.map(e => e._id),
                    consultedEmployees: nextProps.task?.consultedEmployees?.map(e => e._id),
                    informedEmployees: nextProps.task?.informedEmployees?.map(e => e._id),
                    creator: getStorage("userId"),
                    organizationalUnit: nextProps.task.organizationalUnit._id,
                    collaboratedWithOrganizationalUnits: nextProps.task?.collaboratedWithOrganizationalUnits?.map(e => { return { organizationalUnit: e.organizationalUnit._id } }),
                    parent: nextProps.task.parent,
                    taskProject: nextProps.task.taskProject,
                    formula: nextProps.task.formula,
                    taskInformations: nextProps.task.taskInformations,
                    taskActions: nextProps.task.taskActions,
                },
                startTime: this.formatTime(nextProps.task.startDate),
                endTime: this.formatTime(nextProps.task.endDate),
            });
            return true;
        }

        if (nextProps.parentTask !== this.props.parentTask) { // Khi đổi nhấn add new task sang nhấn add subtask hoặc ngược lại
            this.setState(state => {
                return {
                    ...state,
                    newTask: {
                        ...this.state.newTask,
                        parent: nextProps.parentTask,
                    }
                };
            });
            return false;
        }

        // Khi truy vấn lấy các đơn vị của user đã có kết quả, và thuộc tính đơn vị của newTask chưa được thiết lập
        if (newTask.organizationalUnit === "" && department.list.length !== 0) {
            // Tìm unit mà currentRole của user đang thuộc về
            let defaultUnit = department.list?.find(item =>
                item.managers.find(x => x.id === this.state.currentRole)
                || item.deputyManagers.find(x => x.id === this.state.currentRole)
                || item.employees.find(x => x.id === this.state.currentRole));
            if (!defaultUnit && department.list.length > 0) { // Khi không tìm được default unit, mặc định chọn là đơn vị đầu tiên
                defaultUnit = department.list[0]
            }

            if (defaultUnit) {
                this.props.getChildrenOfOrganizationalUnits(defaultUnit._id);
                this.props.getTaskTemplateByUser(1, 10000, [defaultUnit._id], ""); //pageNumber, noResultsPerPage, arrayUnit, name=""
            }

            this.setState(state => { // Khởi tạo giá trị cho organizationalUnit của newTask
                return {
                    ...state,
                    newTask: {
                        ...this.state.newTask,
                        organizationalUnit: defaultUnit && defaultUnit._id,
                    }
                };
            });
            return false; // Sẽ cập nhật lại state nên không cần render
        }

        return true;
    }

    getProjectParticipants = () => {
        const { project } = this.props;
        const projectDetail = getCurrentProjectDetails(project);
        let projectParticipants = [];
        const formattedManagerArr = projectDetail?.projectManager?.map(item => {
            return ({
                text: item.name,
                value: item._id
            })
        })
        const formattedEmployeeArr = projectDetail?.responsibleEmployees?.map(item => {
            return ({
                text: item.name,
                value: item._id
            })
        })
        if (!projectParticipants || !formattedManagerArr || !formattedManagerArr) {
            return []
        }
        projectParticipants = formattedManagerArr.concat(formattedEmployeeArr)
        if (projectParticipants.find(item => item.value === projectDetail?.creator?._id)) {
            return projectParticipants;
        }
        projectParticipants.push({
            text: projectDetail?.creator?.name,
            value: projectDetail?.creator?._id
        })
        console.log('projectParticipants', projectParticipants)
        return projectParticipants;
    }

    render() {
        const { id, newTask, startTime, endTime } = this.state;
        const { estimateNormalTime, estimateOptimisticTime, estimatePessimisticTime, estimateNormalCost, estimateMaxCost } = newTask;
        const { tasktemplates, user, translate, tasks, department, project, isProcess, info, role } = this.props;
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

        // let listPreceedTasks = [{ value: "", text: `--${translate('project.task_management.add_parent_task')}--` }];
        // if (newTask.parent && this.props.currentTasks) {
        //     let taskItem = this.props.currentTasks.find(e => e._id === this.props.parentTask);
        //     taskItem && listPreceedTasks.push({ value: taskItem._id, text: taskItem.name })
        // }

        // if (tasks.listSearchTasks) {
        //     let arr = tasks.listSearchTasks.map(x => { return { value: x._id, text: x.name } });
        //     listPreceedTasks = [...listPreceedTasks, ...arr];
        // }

        let listPreceedTasks = [];
        if (this.props.currentProjectTasks) {
            listPreceedTasks = this.props.currentProjectTasks?.map(item => ({
                value: item._id,
                text: item.name
            }))
        }

        const checkCurrentRoleIsManager = role && role.item &&
            role.item.parents.length > 0 && role.item.parents.filter(o => o.name === ROOT_ROLE.MANAGER)


        return (
            <React.Fragment>
                {/** Form chứa thông tin của task */}
                <div className="row">
                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`}>

                        {/* Thông tin công việc */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('project.task_management.detail_info')}</legend>

                            <div className={'row'}>
                                {/* Tên dự án */}
                                <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group">
                                    <label className="control-label">{translate('project.name')}<span className="text-red">*</span></label>
                                    <div className="form-control">{getCurrentProjectDetails(project)?.name}</div>
                                </div>

                                {/* Độ ưu tiên công việc */}
                                <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group">
                                    <label className="control-label">{translate('project.task_management.detail_priority')}<span className="text-red">*</span></label>
                                    <select className="form-control" value={newTask.priority} onChange={this.handleChangeTaskPriority}>
                                        <option value={5}>{translate('project.task_management.urgent')}</option>
                                        <option value={4}>{translate('project.task_management.high')}</option>
                                        <option value={3}>{translate('project.task_management.standard')}</option>
                                        <option value={2}>{translate('project.task_management.average')}</option>
                                        <option value={1}>{translate('project.task_management.low')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tên công việc */}
                            <div className={`form-group ${newTask.errorOnName === undefined ? "" : "has-error"}`}>
                                <label>{translate('project.task_management.name')}<span className="text-red">*</span></label>
                                <input type="Name" className="form-control" placeholder={translate('project.task_management.name')} value={(newTask.name)} onChange={this.handleChangeTaskName} />
                                <ErrorLabel content={newTask.errorOnName} />
                            </div>

                            {/* Công việc tiền nhiệm */}
                            {listPreceedTasks.length > 0 && <div className="form-group">
                                <label>{translate('project.task_management.preceedingTask')}</label>
                                <SelectBox
                                    id={`select-project-preceeding-task`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listPreceedTasks}
                                    value={newTask.parent}
                                    multiple={true}
                                />
                            </div>}

                            {/* Mô tả công việc */}
                            <div className={`form-group ${newTask.errorOnDescription === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('project.task_management.detail_description')}<span className="text-red">*</span></label>
                                <QuillEditor
                                    id={`task-add-modal-${this.props.id}-${this.props.quillId}`}
                                    table={false}
                                    embeds={false}
                                    getTextData={this.handleChangeTaskDescription}
                                    height={150}
                                    quillValueDefault={newTask.quillDescriptionDefault}
                                    placeholder={translate('project.task_management.detail_description')}
                                />
                                <ErrorLabel content={newTask.errorOnDescription} />
                            </div>

                            {/* Ngày bắt đầu, kết thúc công việc */}
                            <div className="row form-group">
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnStartDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('project.task_management.start_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`datepicker1-${id}-${this.props.id}`}
                                        dateFormat="day-month-year"
                                        value={newTask.startDate}
                                        onChange={this.handleChangeTaskStartDate}
                                    />
                                    < TimePicker
                                        id={`time-picker-1-${id}-${this.props.id}`}
                                        ref={`time-picker-1-${id}-${this.props.id}`}
                                        value={startTime}
                                        onChange={this.handleStartTimeChange}
                                    />
                                    <ErrorLabel content={newTask.errorOnStartDate} />
                                </div>
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnEndDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('project.task_management.end_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`datepicker2-${id}-${this.props.id}`}
                                        value={newTask.endDate}
                                        onChange={this.handleChangeTaskEndDate}
                                    />
                                    < TimePicker
                                        id={`time-picker-2-${id}-${this.props.id}`}
                                        ref={`time-picker-2-${id}-${this.props.id}`}
                                        value={endTime}
                                        onChange={this.handleEndTimeChange}
                                    />
                                    <ErrorLabel content={newTask.errorOnEndDate} />
                                </div>
                            </div>
                        </fieldset>
                    </div>


                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`} >
                        {/* Thời gian và chi phí */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('project.task_management.timeAndCost')}</legend>

                            <strong style={{ marginBottom: 10 }}>{translate('project.task_management.estimatedTime')} (ngày)</strong>
                            <ErrorLabel content={newTask.errorOnTimeEst} />
                            <div className={'row'}>
                                {/* Thời gian ước lượng thông thường */}
                                <div className={`col-lg-4 col-md-4 col-ms-6 col-xs-6 form-group ${newTask.errorOnTimeEst === undefined ? "" : 'has-error'}`}>
                                    <label className="control-label">{translate('project.task_management.estimatedTimeNormal')}<span className="text-red">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={estimateNormalTime}
                                        onChange={(e) => this.handleChangeEstTimeTask(e?.target?.value, 'estimateNormalTime')}
                                    />
                                </div>
                                {/* Thời gian ước lượng lạc quan */}
                                <div className={`col-lg-4 col-md-4 col-ms-6 col-xs-6 form-group ${newTask.errorOnTimeEst === undefined ? "" : 'has-error'}`}>
                                    <label className="control-label">{translate('project.task_management.estimatedTimeOptimistic')}<span className="text-red">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={estimateOptimisticTime}
                                        onChange={(e) => this.handleChangeEstTimeTask(e?.target?.value, 'estimateOptimisticTime')}
                                    />
                                </div>
                                {/* Thời gian ước lượng bi quan */}
                                <div className={`col-lg-4 col-md-4 col-ms-6 col-xs-6 form-group ${newTask.errorOnTimeEst === undefined ? "" : 'has-error'}`}>
                                    <label className="control-label">{translate('project.task_management.estimatedTimePessimistic')}<span className="text-red">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={estimatePessimisticTime}
                                        onChange={(e) => this.handleChangeEstTimeTask(e?.target?.value, 'estimatePessimisticTime')}
                                    />
                                </div>
                            </div>

                            <strong style={{ marginBottom: 10 }}>{translate('project.task_management.estimatedCost')} (USD)</strong>
                            <ErrorLabel content={newTask.errorOnCostEst} />
                            <div className={'row'}>
                                {/* Chi phí ước lượng thông thường */}
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${newTask.errorOnCostEst === undefined ? "" : 'has-error'}`}>
                                    <label className="control-label">{translate('project.task_management.estimatedCostNormal')}<span className="text-red">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={estimateNormalCost}
                                        onChange={(e) => this.handleChangeEstCostNormalTask(e?.target?.value, 'estimateNormalCost')}
                                    />
                                    <ErrorLabel content={newTask.errorOnResponsibleEmployees} />
                                </div>
                                {/* Chi phí ước lượng tối đa */}
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${newTask.errorOnCostEst === undefined ? "" : 'has-error'}`}>
                                    <label className="control-label">{translate('project.task_management.estimatedCostMaximum')}<span className="text-red">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={estimateMaxCost}
                                        onChange={(e) => this.handleChangeEstCostNormalTask(e?.target?.value, 'estimateMaxCost')}
                                    />
                                    <ErrorLabel content={newTask.errorOnResponsibleEmployees} />
                                </div>
                            </div>
                        </fieldset>

                        {/* Phân định trách nhiệm công việc */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('project.task_management.add_raci')} (RACI)</legend>

                            {/* Những người thực hiện công việc */}
                            <div className={`form-group ${newTask.errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('project.task_management.responsible')}<span className="text-red">*</span></label>
                                {this.getProjectParticipants() &&
                                    <SelectBox
                                        id={`responsible-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getProjectParticipants()}
                                        onChange={this.handleChangeTaskResponsibleEmployees}
                                        value={newTask.responsibleEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('project.task_management.add_resp') }}
                                    />
                                }
                                <ErrorLabel content={newTask.errorOnResponsibleEmployees} />
                            </div>

                            {/* Những người quản lý/phê duyệt công việc */}
                            <div className={`form-group ${newTask.errorOnAccountableEmployees === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('project.task_management.accountable')}<span className="text-red">*</span></label>
                                {this.getProjectParticipants() &&
                                    <SelectBox
                                        id={`accounatable-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getProjectParticipants()}
                                        onChange={this.handleChangeTaskAccountableEmployees}
                                        value={newTask.accountableEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('project.task_management.add_acc') }}
                                    />
                                }
                                <ErrorLabel content={newTask.errorOnAccountableEmployees} />
                            </div>

                            {/* Những người tư vấn công việc */}
                            <div className='form-group'>
                                <label className="control-label">{translate('project.task_management.consulted')}</label>
                                {this.getProjectParticipants() &&
                                    <SelectBox
                                        id={`consulted-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getProjectParticipants()}
                                        onChange={this.handleChangeTaskConsultedEmployees}
                                        value={newTask.consultedEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('project.task_management.add_cons') }}
                                    />
                                }
                            </div>

                            {/* Những người quan sát công việc */}
                            <div className='form-group'>
                                <label className="control-label">{translate('project.task_management.informed')}</label>
                                {this.getProjectParticipants() &&
                                    <SelectBox
                                        id={`informed-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getProjectParticipants()}
                                        onChange={this.handleChangeTaskInformedEmployees}
                                        value={newTask.informedEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('project.task_management.add_inform') }}
                                    />
                                }
                            </div>
                        </fieldset>
                    </div>
                </div>
            </React.Fragment>
        );
    }
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

    showInfoRole: RoleActions.show,
};

const connectedAddTaskForm = connect(mapState, actionCreators)(withTranslate(AddProjectTaskForm));
export { connectedAddTaskForm as AddProjectTaskForm };