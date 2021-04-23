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
import moment from 'moment';
import { getSalaryFromUserId, numberWithCommas } from './functionHelpers';
import { AutomaticTaskPointCalculator } from '../../task-perform/component/automaticTaskPointCalculator';

const MILISECS_TO_DAYS = 86400000;
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
                preceedingTasks: [],
                taskProject: "",
                estimateNormalTime: '',
                estimateOptimisticTime: '',
                estimatePessimisticTime: '',
                estimateNormalCost: '',
                estimateMaxCost: '',
                parent: '',
                budget: '',
                estimateAssetCost: '',
                actorsWithSalary: [],
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

    handleChangeTaskName = (event) => {
        let value = event.target.value;
        this.validateTaskName(value, true);
    }
    validateTaskName = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { message } = ValidationHelper.validateTaskName(translate, value, this.props.currentProjectTasks);

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
            msg = translate('task.task_management.add_err_end_date');
        }
        if (willUpdateState) {
            newTask.startDate = value;
            const numsOfSaturdays = this.getNumsOfDaysWithoutGivenDay(new Date(startDate), new Date(endDate), 6)
            const numsOfSundays = this.getNumsOfDaysWithoutGivenDay(new Date(startDate), new Date(endDate), 0)
            // newTask.estimateNormalTime = (moment(endDate).diff(moment(startDate), 'milliseconds') - numsOfSaturdays * MILISECS_TO_DAYS - numsOfSundays * MILISECS_TO_DAYS)
            newTask.estimateNormalTime = (moment(endDate).diff(moment(startDate), 'milliseconds'))
                .toString()
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
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
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
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
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
            const numsOfSaturdays = this.getNumsOfDaysWithoutGivenDay(new Date(newTask.startDate), new Date(newTask.endDate), 6)
            const numsOfSundays = this.getNumsOfDaysWithoutGivenDay(new Date(newTask.startDate), new Date(newTask.endDate), 0)
            newTask.estimateNormalTime = (
                moment(newTask.endDate)
                    .diff(moment(newTask.startDate), 'milliseconds')
                // .diff(moment(newTask.startDate), 'milliseconds') - numsOfSaturdays * MILISECS_TO_DAYS - numsOfSundays * MILISECS_TO_DAYS
            )
                .toString()
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
        let { translate, project } = this.props;
        const projectDetail = getCurrentProjectDetails(project);
        let { message } = ValidationHelper.validateArrayLength(this.props.translate, value);

        if (willUpdateState) {
            this.state.newTask.responsibleEmployees = value;
            this.state.newTask.errorOnResponsibleEmployees = message;
            const responsiblesWithSalaryArr = value?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem)
                })
            })
            const accountablesWithSalaryArr = this.state.newTask.accountableEmployees?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem)
                })
            })
            this.state.newTask.actorsWithSalary = [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr];
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
        let { translate, project } = this.props;
        const projectDetail = getCurrentProjectDetails(project);
        let { message } = ValidationHelper.validateArrayLength(this.props.translate, value);

        if (willUpdateState) {
            this.state.newTask.accountableEmployees = value;
            this.state.newTask.errorOnAccountableEmployees = message;
            const accountablesWithSalaryArr = value?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem)
                })
            })
            const responsiblesWithSalaryArr = this.state.newTask.responsibleEmployees?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem)
                })
            })
            this.state.newTask.actorsWithSalary = [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr];
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
        this.setState({
            newTask: {
                ...this.state.newTask,
                preceedingTasks: selected
            }
        }, () => this.props.handleChangeTaskData(this.state.newTask))
    }

    handleChangeBudget = (event) => {
        let value = event.target.value;
        this.validateBudget(value, true);
    }
    validateBudget = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { message } = ValidationHelper.validateNumericInputMandatory(translate, value);

        if (willUpdateState) {
            this.state.newTask.budget = value;
            this.state.newTask.errorOnBudget = message;
            this.setState(state => {
                return {
                    ...state,
                };
            });
            this.props.handleChangeTaskData(this.state.newTask)
            // this.props.isProcess && this.props.handleChangeName(this.state.newTask.name)
        }
        return message === undefined;
    }

    handleChangeEstTimeTask = (value, timeType) => {
        if (timeType === 'estimateNormalTime') {
            this.setState({
                newTask: {
                    ...this.state.newTask,
                    estimateNormalTime: value,
                    estimateOptimisticTime: value || Number(value) < 0 ? (Number(value) - 200).toString() : '',
                    estimatePessimisticTime: value || Number(value) < 0 ? (Number(value) + 200).toString() : '',
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
        let formattedEmployeeArr = [];
        if (Array.isArray(projectDetail?.responsibleEmployees)) {
            for (let item of projectDetail?.responsibleEmployees) {
                if (!projectDetail?.projectManager.find(managerItem => managerItem.name === item.name)) {
                    formattedEmployeeArr.push({
                        text: item.name,
                        value: item._id
                    })
                }
            }
        }

        if (!projectParticipants || !formattedManagerArr || !formattedEmployeeArr) {
            return []
        }
        projectParticipants = formattedManagerArr.concat(formattedEmployeeArr)
        if (projectParticipants.find(item => String(item.value) === String(projectDetail?.creator?._id))) {
            return projectParticipants;
        }
        projectParticipants.push({
            text: projectDetail?.creator?.name,
            value: projectDetail?.creator?._id
        })
        return projectParticipants;
    }

    convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    getNumsOfDaysWithoutGivenDay = (startDate, endDate, givenDay) => {
        let numberOfDates = 0
        while (startDate < endDate) {
            if (startDate.getDay() === givenDay) {
                numberOfDates++
            }
            startDate.setDate(startDate.getDate() + 1)
        }
        return numberOfDates
    }

    getEstHumanCost = () => {
        const { newTask, endTime, startTime } = this.state;
        const { responsibleEmployees, accountableEmployees, endDate, startDate } = newTask;
        const projectDetail = getCurrentProjectDetails(this.props.project);
        const startDateTask = this.convertDateTime(startDate, startTime);
        const endDateTask = this.convertDateTime(endDate, endTime);
        // Cần phải có biện pháp trừ đi ngày thứ 7 chủ nhật
        const numsOfSaturdays = this.getNumsOfDaysWithoutGivenDay(new Date(startDateTask), new Date(endDateTask), 6)
        const numsOfSundays = this.getNumsOfDaysWithoutGivenDay(new Date(startDateTask), new Date(endDateTask), 0)
        // const duration = moment(endDateTask).diff(moment(startDateTask), `milliseconds`) / MILISECS_TO_DAYS - numsOfSaturdays - numsOfSundays;
        const duration = moment(endDateTask).diff(moment(startDateTask), `milliseconds`) / MILISECS_TO_DAYS;
        console.log('duration-------', duration)

        // Tính số ngày công của tháng
        const weekDays = AutomaticTaskPointCalculator.getAmountOfWeekDaysInMonth(moment(startDateTask));

        let sum = 0;
        for (let responsibleItem of responsibleEmployees) {
            // 0.8 là trọng số của Responsible
            // Chia cho length đề phòng có nhiều người trong array này
            const resWeight = 0.8 / responsibleEmployees.length
            // Chia weekDays là số ngày công
            sum += getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, responsibleItem) / weekDays * duration * resWeight;
        }
        for (let accountableItem of accountableEmployees) {
            // 0.2 là trọng số của Accountable
            // Chia cho length đề phòng có nhiều người trong array này
            const accWeight = 0.2 / accountableEmployees.length
            // Chia weekDays là số ngày công
            sum += getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accountableItem) / weekDays * duration * accWeight;
        }
        return numberWithCommas(sum);
    }

    handleChangeAssetCost = (event) => {
        let value = event.target.value.toString();
        this.validateAssetCode(value, true);
    }
    validateAssetCode = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { message } = ValidationHelper.validateNumericInputMandatory(translate, value);

        if (willUpdateState) {
            this.setState({
                ...this.state,
                newTask: {
                    ...this.state.newTask,
                    estimateAssetCost: value,
                    estimateNormalCost: numberWithCommas(Number(this.getEstHumanCost().replace(/,/g, '')) + Number(value)),
                    errorOnAssetCode: message,
                }
            }, () => this.props.handleChangeTaskData(this.state.newTask))
        }
        return message === undefined;
    }

    convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    getEstHumanCost = () => {
        const { newTask, endTime, startTime } = this.state;
        const { responsibleEmployees, accountableEmployees, endDate, startDate } = newTask;
        const projectDetail = getCurrentProjectDetails(this.props.project);
        const startDateTask = this.convertDateTime(startDate, startTime);
        const endDateTask = this.convertDateTime(endDate, endTime);
        const duration = moment(endDateTask).diff(moment(startDateTask), `${projectDetail?.unitTime}s`);
        // Cần phải có biện pháp trừ đi ngày thứ 7 chủ nhật

        let sum = 0;
        for (let responsibleItem of responsibleEmployees) {
            // 0.8 là trọng số của Responsible
            // Chia 20 là số ngày công
            sum += getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, responsibleItem) / 20 * duration * 0.8;
        }
        for (let accountableItem of accountableEmployees) {
            // 0.2 là trọng số của Accountable
            // Chia 20 là số ngày công
            sum += getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accountableItem) / 20 * duration * 0.2;
        }
        return numberWithCommas(sum);
    }

    handleChangeAssetCost = (event) => {
        let value = event.target.value.toString();
        this.validateAssetCode(value, true);
    }
    validateAssetCode = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let { message } = ValidationHelper.validateNumericInputMandatory(translate, value);

        if (willUpdateState) {
            this.setState({
                ...this.state,
                newTask: {
                    ...this.state.newTask,
                    estimateAssetCost: value,
                    estimateNormalCost: numberWithCommas(Number(this.getEstHumanCost().replace(/,/g, '')) + Number(value)),
                    errorOnAssetCode: message,
                }
            }, () => this.props.handleChangeTaskData(this.state.newTask))
        }
        return message === undefined;
    }

    render() {
        const { id, newTask, startTime, endTime } = this.state;
        const { estimateNormalTime, estimateOptimisticTime, estimatePessimisticTime, estimateNormalCost, estimateMaxCost, estimateAssetCost } = newTask;
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

        // let listPreceedTasks = [{ value: "", text: `--${translate('task.task_management.add_parent_task')}--` }];
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
                            <legend className="scheduler-border">{translate('task.task_management.detail_info')}</legend>

                            <div className={'row'}>
                                {/* Tên dự án */}
                                <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group">
                                    <label className="control-label">{translate('project.name')}<span className="text-red">*</span></label>
                                    <div className="form-control">{getCurrentProjectDetails(project)?.name}</div>
                                </div>

                                {/* Độ ưu tiên công việc */}
                                <div className="col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group">
                                    <label className="control-label">{translate('task.task_management.detail_priority')}<span className="text-red">*</span></label>
                                    <select className="form-control" value={newTask.priority} onChange={this.handleChangeTaskPriority}>
                                        <option value={5}>{translate('task.task_management.urgent')}</option>
                                        <option value={4}>{translate('task.task_management.high')}</option>
                                        <option value={3}>{translate('task.task_management.standard')}</option>
                                        <option value={2}>{translate('task.task_management.average')}</option>
                                        <option value={1}>{translate('task.task_management.low')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className={'row'}>
                                {/* Tên công việc */}
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${newTask.errorOnName === undefined ? "" : "has-error"}`}>
                                    <label>{translate('task.task_management.name')}<span className="text-red">*</span></label>
                                    <input type="Name" className="form-control" placeholder={translate('task.task_management.name')} value={(newTask.name)} onChange={this.handleChangeTaskName} />
                                    <ErrorLabel content={newTask.errorOnName} />
                                </div>
                                {/* Ngân sách cho công việc */}
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${newTask.errorOnBudget === undefined ? "" : "has-error"}`}>
                                    <label>Ngân sách<span className="text-red">*</span> ({getCurrentProjectDetails(project)?.unitCost})</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ngân sách"
                                        value={newTask.budget}
                                        onChange={this.handleChangeBudget}
                                        onFocus={() => {
                                            this.setState({
                                                ...this.state,
                                                newTask: {
                                                    ...this.state.newTask,
                                                    budget: newTask.budget.replace(/,/g, ''),
                                                }
                                            })
                                        }}
                                        onBlur={() => {
                                            this.setState({
                                                ...this.state,
                                                newTask: {
                                                    ...this.state.newTask,
                                                    budget: numberWithCommas(newTask.budget),
                                                }
                                            })
                                        }}
                                    />
                                    <ErrorLabel content={newTask.errorOnBudget} />
                                </div>
                            </div>



                            {/* Công việc tiền nhiệm */}
                            {listPreceedTasks.length > 0 && <div className="form-group">
                                <label>{translate('project.task_management.preceedingTask')}</label>
                                <SelectBox
                                    id={`select-project-preceeding-task`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listPreceedTasks}
                                    value={newTask.preceedingTasks}
                                    multiple={true}
                                    onChange={this.handleChangePreceedingTask}
                                />
                            </div>}

                            {/* Mô tả công việc */}
                            <div className={`form-group ${newTask.errorOnDescription === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.detail_description')}<span className="text-red">*</span></label>
                                <QuillEditor
                                    id={`task-add-modal-${this.props.id}-${this.props.quillId}`}
                                    table={false}
                                    embeds={false}
                                    getTextData={this.handleChangeTaskDescription}
                                    height={150}
                                    quillValueDefault={newTask.quillDescriptionDefault}
                                    placeholder={translate('task.task_management.detail_description')}
                                />
                                <ErrorLabel content={newTask.errorOnDescription} />
                            </div>
                        </fieldset>

                        {/* Chi phí */}
                        {newTask.startDate.trim().length > 0 && newTask.endDate.trim().length > 0
                            && newTask.responsibleEmployees.length > 0 && newTask.accountableEmployees.length > 0
                            &&
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Ước lượng chi phí</legend>
                                {/* Chi phí ước lượng nhân lực */}
                                <div className={'row'}>
                                    <div className={`col-md-12 form-group`}>
                                        <label className="control-label">Chi phí ước lượng nhân lực (Lương Responsible * Thời gian ước lượng * 0.8 + Lương Accountable * Thời gian ước lượng * 0.2)
                                            <span className="text-red">*</span> ({getCurrentProjectDetails(project)?.unitCost})
                                        </label>
                                        <div className="form-control">
                                            {this.getEstHumanCost()}
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    {/* Chi phí ước lượng tài sản */}
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${newTask.errorOnAssetCode === undefined ? "" : 'has-error'}`}>
                                        <label className="control-label">Chi phí ước lượng tài sản<span className="text-red">*</span> ({getCurrentProjectDetails(project)?.unitCost})</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={estimateAssetCost}
                                            onChange={this.handleChangeAssetCost}
                                            onFocus={() => {
                                                this.setState({
                                                    ...this.state,
                                                    newTask: {
                                                        ...this.state.newTask,
                                                        estimateAssetCost: estimateAssetCost.replace(/,/g, ''),
                                                    }
                                                })
                                            }}
                                            onBlur={() => {
                                                this.setState({
                                                    ...this.state,
                                                    newTask: {
                                                        ...this.state.newTask,
                                                        estimateAssetCost: numberWithCommas(estimateAssetCost),
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                    <ErrorLabel content={newTask.errorOnAssetCode} />
                                    {/* Chi phí ước lượng */}
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${Number(estimateNormalCost.replace(/,/g, '')) > Number(newTask.budget.replace(/,/g, '')) ? 'has-error' : ''}`}>
                                        <label className="control-label">Chi phí ước lượng tổng<span className="text-red">*</span> ({getCurrentProjectDetails(project)?.unitCost})</label>
                                        <div className="form-control">
                                            {estimateNormalCost}
                                        </div>
                                        <ErrorLabel content={Number(estimateNormalCost.replace(/,/g, '')) > Number(newTask.budget.replace(/,/g, '')) && "Ngân sách đang thấp hơn chi phí ước lượng"} />
                                    </div>
                                </div>
                            </fieldset>}
                    </div>


                    <div className={`${isProcess ? "col-lg-12" : "col-sm-6"}`} >
                        {/* Thời gian */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Ước lượng thời gian</legend>
                            {/* Ngày bắt đầu, dự kiến kết thúc công việc */}
                            <div className="row form-group">
                                <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${newTask.errorOnStartDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('task.task_management.start_date')}<span className="text-red">*</span></label>
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

                        {/* Phân định trách nhiệm công việc */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.add_raci')} (RACI)</legend>
                            {/* Những người thực hiện công việc */}
                            <div className={`form-group ${newTask.errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.responsible')}<span className="text-red">*</span></label>
                                {this.getProjectParticipants() &&
                                    <SelectBox
                                        id={`responsible-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getProjectParticipants()}
                                        onChange={this.handleChangeTaskResponsibleEmployees}
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
                                {this.getProjectParticipants() &&
                                    <SelectBox
                                        id={`accounatable-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getProjectParticipants()}
                                        onChange={this.handleChangeTaskAccountableEmployees}
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
                                {this.getProjectParticipants() &&
                                    <SelectBox
                                        id={`consulted-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getProjectParticipants()}
                                        onChange={this.handleChangeTaskConsultedEmployees}
                                        value={newTask.consultedEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_cons') }}
                                    />
                                }
                            </div>
                            {/* Những người quan sát công việc */}
                            <div className='form-group'>
                                <label className="control-label">{translate('task.task_management.informed')}</label>
                                {this.getProjectParticipants() &&
                                    <SelectBox
                                        id={`informed-select-box${newTask.taskTemplate}-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getProjectParticipants()}
                                        onChange={this.handleChangeTaskInformedEmployees}
                                        value={newTask.informedEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_inform') }}
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