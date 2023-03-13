import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { getStorage } from '../../../../config';
import ValidationHelper from '../../../../helpers/validationHelper';

import { UserActions } from '../../../super-admin/user/redux/actions';

import { DatePicker, TimePicker, SelectBox, ErrorLabel, ToolTip, TreeSelect, QuillEditor, DialogModal } from '../../../../common-components';
import { TaskFormValidator } from '../../../task/task-management/component/taskFormValidator';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { ProjectPhaseActions} from '../redux/actions';
import dayjs from "dayjs";
import { convertUserIdToUserName, getCurrentProjectDetails, getDurationWithoutSatSun, getEstimateHumanCostFromParams, getEstimateMemberCost, getMaxMinDateInArr, getNearestIntegerNumber, getProjectParticipants, handleWeekendAndWorkTime, formatTime } from '../../projects/components/functionHelper';
import { checkIfHasCommonItems, getSalaryFromUserId, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const MilestoneCreateForm = (props) => {
    const { user, translate, tasks, department, project, currentProjectTasks, currentProjectPhase, projectId, currentProjectMilestone } = props;
    const projectDetail = getCurrentProjectDetails(project);
    const [state, setState] = useState({
        newMilestone: {
            name: "",
            description: "",
            date: "",
            time: "",
            priority: 3,
            responsibleEmployees: [],
            accountableEmployees: [],
            consultedEmployees: [],
            informedEmployees: [],
            creator: getStorage("userId"),
            preceedingTasks: [],
            followingTasks: [],
            preceedingMilestones: [],
            project: projectId,
            projectPhase: "",
            currentLatestDate: "",
            currentEarliestDate: projectDetail.startDate,
            errorOnName: undefined,
            errorOnDate: undefined,
            errorOnAccountableEmployees: undefined,
            errorOnResponsibleEmployees: undefined,
        },
        currentRole: getStorage('currentRole'),
    });

    const { currentRole, newMilestone } = state;
    const { name, description, date, time, priority, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees, preceedingTasks, projectPhase, currentLatestDate,
        currentEarliestDate, errorOnName, errorOnDate, errorOnAccountableEmployees, errorOnResponsibleEmployees, preceedingMilestones } = newMilestone;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const [currentTasksToChoose, setCurrentTasksToChoose] = useState({
        preceeding: [],
    })

    const [currentPhaseToChoose, setCurrentPhaseToChoose] = useState({
        phases: []
    })

    const [currentMilestoneToChoose, setCurrentMilestoneToChoose] = useState({
        milestones: []
    })

    useEffect(() => {
        let res = currentProjectPhase ? currentProjectPhase?.map(item => ({
            value: item._id,
            text: item.name
        })) : [];
        res.unshift({ value: "", text: "--Chọn giai đoạn--" });
        setCurrentPhaseToChoose({
            phases: res
        })
    }, [JSON.stringify(currentProjectPhase)])

    useEffect(() => {
        let res = currentProjectTasks ? currentProjectTasks?.map(item => ({
            value: item._id,
            text: item.name
        })) : [];
        // res.unshift({value: "", text: "Chọn công việc tiền nhiệm"})
        setCurrentTasksToChoose({
            preceeding: res,
        })
    }, [JSON.stringify(currentProjectTasks)])

    useEffect(() => {
        let res = currentProjectMilestone ? currentProjectMilestone?.map(item => ({
            value: item._id,
            text: item.name
        })) : [];
        setCurrentMilestoneToChoose({
            milestones: res,
        })
    }, [JSON.stringify(currentProjectMilestone)])

    // Đặt lại thời gian
    const regenerateTime = () => {
        let currentTime = formatTime(new Date())
        setState(state => {
            return {
                ...state,
                newMilestone: {
                    ...state.newMilestone,
                    time: currentTime
                }
            }
        });
    }

    useEffect(() => {
        //Đặt lại thời gian mặc định khi mở modal
        window.$(`#modal-create-project-milestone-${projectId}`).on('shown.bs.modal', regenerateTime);
        return () => {
            window.$(`#modal-create-project-milestone-${projectId}`).unbind('shown.bs.modal', regenerateTime)
        }
    }, [])

    useEffect(() => {
        const { currentRole } = state;
        props.showInfoRole(currentRole);
        props.getAllUserInAllUnitsOfCompany();
    }, [])


    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time.replace(/CH/g, 'PM').replace(/SA/g, 'AM')}`;
        return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
    }

    const handleChangeMilestoneName = (event) => {
        let value = event.target.value;
        validateChangeMilestoneName(value, true);
    }

    const handleChangePhase = (selected) => {
        let phase = currentProjectPhase?.find(phaseItem => phaseItem._id === selected[0]);
        let currentNewMilestone = {
            ...state.newMilestone,
            projectPhase: selected[0],
            currentLatestDate: "",
        }

        if (selected[0] !== state.newMilestone.projectPhase) {
            if (currentNewMilestone.time && currentNewMilestone.date) {
                let curDateTime = convertDateTime(currentNewMilestone.date, currentNewMilestone.time);
                // if (dayjs(curDateTime).isSameOrAfter(dayjs(currentNewMilestone.currentLatestDate))) {
                //     currentNewMilestone = {
                //         ...currentNewMilestone,
                //         errorOnDate: `Thời điểm phải trước thời gian kết thúc của giai đoạn hoặc dự án : ${dayjs(currentNewMilestone.currentLatestDate).format('HH:mm DD/MM/YYYY')}`
                //     }
                // }
                if (dayjs(curDateTime).isSameOrBefore(dayjs(currentNewMilestone.currentEarliestDate))) {
                    currentNewMilestone = {
                        ...currentNewMilestone,
                        errorOnDate: `Thời điểm phải sau thời gian kết thúc của công việc, cột mốc tiền nhiệm: ${dayjs(currentNewMilestone.currentEarliestDate).format('HH:mm DD/MM/YYYY')}`
                    }
                }
                else currentNewMilestone = {
                    ...currentNewMilestone,
                    errorOnDate: undefined
                }
            }
        }

        setState({
            ...state,
            newMilestone: currentNewMilestone
        })
    }

    const validateChangeMilestoneName = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateTaskName(translate, value, projectPhase.milestones || []);

        let currentNewMilestone = {
            ...state.newMilestone,
            name: value,
            errorOnName: message,
        };
        if (willUpdateState) {
            setState({
                ...state,
                newMilestone: currentNewMilestone
            })
        }
        return message === undefined;
    }

    // Hàm bắt sự kiện thay đổi mô tả cột mốc
    const handleChangeMilestoneDescription = (event) => {
        let { value } = event.target
        setState({
            ...state,
            newMilestone: {
                ...state.newMilestone,
                description: value,
            }
        });
    }

    const handleChangeMilestoneDate = (value) => {
        validateMilestoneDate(value, true);
    }
    const validateMilestoneDate = (value, willUpdateState = true) => {
        let message = undefined;
        if (value && time) {
            const curDateTime = convertDateTime(value, time);

            // if (dayjs(curDateTime).isSameOrAfter(dayjs(currentLatestDate))) {
            //     message = `Thời điểm phải trước thời gian kết thúc của giai đoạn hoặc dự án : ${dayjs(currentLatestDate).format('HH:mm DD/MM/YYYY')}`
            // }

            if (dayjs(curDateTime).isSameOrBefore(dayjs(currentEarliestDate))) {
                message = `Thời điểm phải sau thời gian kết thúc của công việc, cột mốc tiền nhiệm: ${dayjs(currentEarliestDate).format('HH:mm DD/MM/YYYY')}`
            }
        }

        let currentNewMilestone = {
            ...state.newMilestone,
            date: value,
            errorOnDate: message
        }

        if (willUpdateState) {
            setState({
                ...state,
                newMilestone: currentNewMilestone,
            });
        }
        return message === undefined;
    }

    // Hàm bắt sự kiện thay đổi thời gian cột mốc
    const handleTimeChange = (value) => {
        let message = undefined;
        if (date && value) {
            const curDateTime = convertDateTime(date, value);
            if (dayjs(curDateTime).isSameOrBefore(dayjs(currentEarliestDate))) {
                message = `Thời điểm phải sau thời gian kết thúc của công việc, cột mốc tiền nhiệm: ${dayjs(currentEarliestDate).format('HH:mm DD/MM/YYYY')}`
            }
        }

        setState({
            ...state,
            newMilestone: {
                ...state.newMilestone,
                time: value,
                errorOnDate: message,
            },
        });
    }

    const handleChangeMilestonePriority = (event) => {
        let currentNewMilestone = {
            ...state.newMilestone,
            priority: event.target.value
        }
        setState({
            ...state,
            newMilestone: currentNewMilestone,
        });
    }

    // Hàm bắt sự kiện thay đổi người thực hiện
    const handleChangeMilestoneResponsibleEmployees = (value) => {
        validateMilestoneResponsibleEmployees(value, true);
    }
    const validateMilestoneResponsibleEmployees = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(translate, value);

        if (willUpdateState) {
            let currentNewMilestone = {
                ...state.newMilestone,
                responsibleEmployees: value,
                errorOnResponsibleEmployees: message,
            }

            setState({
                ...state,
                newMilestone: currentNewMilestone,
            });
        }
        return message === undefined;
    }

    // Hàm bắt sự kiện thay đổi người phê duyệt
    const handleChangeMilestoneAccountableEmployees = (value) => {
        validateMilestoneAccountableEmployees(value, true);
    }
    const validateMilestoneAccountableEmployees = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(translate, value);
        if (willUpdateState) {
            let currentNewMilestone = {
                ...state.newMilestone,
                accountableEmployees: value,
                errorOnAccountableEmployees: message,
            }
            setState({
                ...state,
                newMilestone: currentNewMilestone,
            });
        }
        return message === undefined;
    }

    // Hàm bắt sự kiện thay đổi người tư vấn
    const handleChangeMilestoneConsultedEmployees = (value) => {
        setState(state => {
            return {
                ...state,
                newMilestone: {
                    ...state.newMilestone,
                    consultedEmployees: value
                }
            };
        });
    }

    // Hàm bắt sự kiện thay đổi người quan sát
    const handleChangeMilestoneInformedEmployees = (value) => {
        let currentNewMilestone = {
            ...state.newMilestone,
            informedEmployees: value,
        }
        setState({
            ...state,
            newMilestone: currentNewMilestone,
        });
    }

    // Tìm kiếm endDate muộn nhất trong list tasks
    const findLatestDate = (data) => {
        if (data.length === 0) return null;
        let currentMax = data[0].endDate;
        for (let dataItem of data) {
            if (!currentMax) currentMax = dataItem.endDate;
            else if (dataItem?.endDate && dayjs(dataItem.endDate).isAfter(dayjs(currentMax))) {
                currentMax = dataItem.endDate;
            }
        }
        return currentMax;
    }

    // Tìm kiếm startDate sớm nhất trong list tasks
    const findEarliestDate = (data) => {
        if (data.length === 0) return null;
        let currentMin = data[0].startDate;
        for (let dataItem of data) {
            if (!currentMin) currentMin = dataItem.startDate;
            else if (dataItem?.startDate && dayjs(dataItem.startDate).isBefore(dayjs(currentMin))) {
                currentMin = dataItem.startDate;
            }
        }
        return currentMin;
    }

    // Thay đổi công việc tiền nhiệm
    const handleChangePreceedingTask = (selected) => {
        let currentNewMilestone = {
            ...state.newMilestone,
            preceedingTasks: selected,
        }
        // Kiểm tra lại thời điểm sớm nhất có thể của cột mốc
        let newListTask = currentProjectTasks?.filter(taskItem => selected?.includes(taskItem._id));
        let listMilestone = [];
        listMilestone = newMilestone.preceedingMilestones && newMilestone.preceedingMilestones.length > 0 ? currentProjectMilestone?.filter(milestoneItem => newMilestone.preceedingMilestones.includes(milestoneItem._id)) : [];
        newListTask.push(...listMilestone);
        let earliestDate = findLatestDate(newListTask);

        currentNewMilestone = {
            ...currentNewMilestone,
            currentEarliestDate: earliestDate
        }

        if (currentNewMilestone.time && currentNewMilestone.date) {
            let curDateTime = convertDateTime(currentNewMilestone.date, currentNewMilestone.time);
            // if (dayjs(curDateTime).isSameOrAfter(dayjs(currentNewMilestone.currentLatestDate))) {
            //     currentNewMilestone = {
            //         ...currentNewMilestone,
            //         errorOnDate: `Thời điểm phải trước thời gian kết thúc của giai đoạn hoặc dự án: ${dayjs(currentNewMilestone.currentLatestDate).format('HH:mm DD/MM/YYYY')}`
            //     }
            // }
            if (dayjs(curDateTime).isSameOrBefore(dayjs(currentNewMilestone.currentEarliestDate))) {
                currentNewMilestone = {
                    ...currentNewMilestone,
                    errorOnDate: `Thời điểm phải sau thời gian kết thúc của công việc, cột mốc tiền nhiệm: ${dayjs(currentNewMilestone.currentEarliestDate).format('HH:mm DD/MM/YYYY')}`
                }
            }
            else currentNewMilestone = {
                ...currentNewMilestone,
                errorOnDate: undefined
            }
        }

        setState({
            ...state,
            newMilestone: currentNewMilestone,
        })
    }

    // Thay đổi cột mốc tiền nhiệm
    const handleChangePreceedingMilestone = (selected) => {
        let currentNewMilestone = {
            ...state.newMilestone,
            preceedingMilestones: selected,
        }
        // Kiểm tra lại thời điểm sớm nhất có thể của cột mốc
        let newListMilestone = currentProjectMilestone?.filter(milestoneItem => selected?.includes(milestoneItem._id));
        let listTask = newMilestone.preceedingTasks && newMilestone.preceedingTasks.length > 0 ? currentProjectTasks.filter(taskItem => newMilestone.preceedingTasks.includes(taskItem._id)) : [];
        newListMilestone.push(...listTask);
        let earliestDate = findLatestDate(newListMilestone);

        currentNewMilestone = {
            ...currentNewMilestone,
            currentEarliestDate: earliestDate
        }

        if (currentNewMilestone.time && currentNewMilestone.date) {
            let curDateTime = convertDateTime(currentNewMilestone.date, currentNewMilestone.time);
            // if (dayjs(curDateTime).isSameOrAfter(dayjs(currentNewMilestone.currentLatestDate))) {
            //     currentNewMilestone = {
            //         ...currentNewMilestone,
            //         errorOnDate: `Thời điểm phải trước thời gian kết thúc của giai đoạn hoặc dự án: ${dayjs(currentNewMilestone.currentLatestDate).format('HH:mm DD/MM/YYYY')}`
            //     }
            // }
            if (dayjs(curDateTime).isSameOrBefore(dayjs(currentNewMilestone.currentEarliestDate))) {
                currentNewMilestone = {
                    ...currentNewMilestone,
                    errorOnDate: `Thời điểm phải sau thời gian kết thúc của công việc, cột mốc tiền nhiệm: ${dayjs(currentNewMilestone.currentEarliestDate).format('HH:mm DD/MM/YYYY')}`
                }
            }
            else currentNewMilestone = {
                ...currentNewMilestone,
                errorOnDate: undefined
            }
        }

        setState({
            ...state,
            newMilestone: currentNewMilestone,
        })
    }

    // Kiểm tra các thông tin đầu vào
    const isFormValidated = () => {
        if (!ValidationHelper.validateTaskName(translate, name, projectPhase?.milestones || []).status || errorOnDate || errorOnName || errorOnAccountableEmployees
            || errorOnResponsibleEmployees || accountableEmployees.length === 0 || responsibleEmployees.length === 0) return false;
        return true;
    }

    const save = async () => {
        if (isFormValidated()) {
            let newDate = convertDateTime(date, time);
            let data = {
                ...newMilestone,
                startDate: newDate,
                endDate: newDate,
                preceedingTasks: preceedingTasks.map(item => {
                    return {
                        task: item,
                        link: '',
                    }
                }),
                projectPhase: newMilestone?.projectPhase !== ""? newMilestone.projectPhase: null, 
            }
            await props.createMilestone(data);
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-create-project-milestone-${projectId}`}
                isLoading={false}
                formID={`form-create-project-milestone-${projectId}`}
                title={`${translate('project.edit_title')} - Thêm mới cột mốc trong dự án`}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
            >

                {/** Form chứa thông tin của cột mốc */}
                <div className="row">
                    <div className={`col-sm-6 col-md-6 col-xs-12`}>

                        {/* Thông tin cột mốc */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('project.task_management.milestone_info')}</legend>

                            <div className={'row'}>
                                {/* Tên dự án */}
                                <div className="col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group">
                                    <label className="control-label">{translate('project.name')}<span className="text-red">*</span></label>
                                    <input className="form-control" value={getCurrentProjectDetails(project)?.name} disabled={true} />
                                </div>
                            </div>

                            <div className={'row'}>
                                {/* Tên cột mốc */}
                                <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorOnName === undefined ? "" : "has-error"}`}>
                                    <label>{translate('phase.milestone.name')}<span className="text-red">*</span></label>
                                    <input type="Name" className="form-control" placeholder={translate('phase.milestone.name')} value={name} onChange={handleChangeMilestoneName} />
                                    <ErrorLabel content={errorOnName} />
                                </div>
                            </div>

                            <div className={'row'}>
                                {/* Độ ưu tiên */}
                                <div className="col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group">
                                    <label className="control-label">{translate('task.task_management.detail_priority')}<span className="text-red">*</span></label>
                                    <select className="form-control" value={priority} onChange={handleChangeMilestonePriority}>
                                        <option value={5}>{translate('task.task_management.urgent')}</option>
                                        <option value={4}>{translate('task.task_management.high')}</option>
                                        <option value={3}>{translate('task.task_management.standard')}</option>
                                        <option value={2}>{translate('task.task_management.average')}</option>
                                        <option value={1}>{translate('task.task_management.low')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                {/* Công việc tiền nhiệm */}
                                {currentTasksToChoose.preceeding.length > 0 &&
                                    <div className={`form-group col-md-12 col-xs-12`}>
                                        <label>{translate('project.task_management.preceedingTask')}</label>
                                        <SelectBox
                                            id={`select-milestone-preceeding-task`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={currentTasksToChoose.preceeding}
                                            value={preceedingTasks}
                                            multiple={true}
                                            onChange={handleChangePreceedingTask}
                                        />
                                    </div>
                                }
                            </div>

                            <div className="row">
                                {/* Cột mốc tiền nhiệm */}
                                {currentMilestoneToChoose.milestones.length > 0 &&
                                    <div className={`form-group col-md-12 col-xs-12`}>
                                        <label>{translate('project.task_management.preceedingMilestone')}</label>
                                        <SelectBox
                                            id={`select-milestone-preceeding-milestone`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={currentMilestoneToChoose.milestones}
                                            value={preceedingMilestones}
                                            multiple={true}
                                            onChange={handleChangePreceedingMilestone}
                                        />
                                    </div>
                                }
                            </div>

                            <div className='row'>
                                {/* Giai đoạn trong dự án */}
                                <div className={`form-group col-md-12 col-xs-12`}>
                                    <label>{translate('project.task_management.phase')}</label>
                                    <SelectBox
                                        id={`select-milestone-phase`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={currentPhaseToChoose.phases}
                                        value={projectPhase}
                                        multiple={false}
                                        onChange={handleChangePhase}
                                    />
                                </div>
                            </div>

                            {/* Thời điểm của cột mốc */}
                            <div className="row form-group">
                                <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 ${errorOnDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('phase.milestone.date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`datepicker-milestone-1`}
                                        dateFormat="day-month-year"
                                        value={date}
                                        onChange={handleChangeMilestoneDate}
                                    />
                                    < TimePicker
                                        id={`time-picker-milestone-1`}
                                        refs={`time-picker-milestone-1`}
                                        value={time}
                                        onChange={handleTimeChange}
                                    />
                                    <ErrorLabel content={errorOnDate} />
                                </div>
                            </div>


                            {/* Mô tả cột mốc */}
                            <div className={`form-group`}>
                                <label>{translate('project.task_management.milestone_description')}</label>
                                <textarea type="text" className="form-control" value={description} onChange={handleChangeMilestoneDescription} />
                            </div>
                        </fieldset>
                    </div>

                    <div className={`col-sm-6 col-md-6 col-xs-12`} >
                        {/* Phân định trách nhiệm cột mốc */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.add_raci')} (RACI)</legend>
                            <div className="row form-group">
                                {/* Những người thực hiện cột mốc */}
                                <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 ${errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('task.task_management.responsible')}<span className="text-red">*</span></label>
                                    {getProjectParticipants(projectDetail) &&
                                        <SelectBox
                                            id={`milestone-responsible-select-box`}
                                            className="form-control select"
                                            style={{ width: "100%" }}
                                            items={getProjectParticipants(projectDetail)}
                                            onChange={handleChangeMilestoneResponsibleEmployees}
                                            value={responsibleEmployees}
                                            multiple={true}
                                            options={{ placeholder: translate('task.task_management.add_resp') }}
                                        />
                                    }
                                    <ErrorLabel content={errorOnResponsibleEmployees} />
                                </div>
                            </div>
                            <div className="row form-group">
                                {/* Những người quản lý/phê duyệt cột mốc */}
                                <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 ${errorOnAccountableEmployees === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('task.task_management.accountable')}<span className="text-red">*</span></label>
                                    {getProjectParticipants(projectDetail) &&
                                        <SelectBox
                                            id={`milestone-accounatable-select-box`}
                                            className="form-control select"
                                            style={{ width: "100%" }}
                                            items={getProjectParticipants(projectDetail)}
                                            onChange={handleChangeMilestoneAccountableEmployees}
                                            value={accountableEmployees}
                                            multiple={true}
                                            options={{ placeholder: translate('task.task_management.add_acc') }}
                                        />
                                    }
                                    <ErrorLabel content={errorOnAccountableEmployees} />
                                </div>
                            </div>

                            <div className="row form-group">
                                {/* Những người tư vấn cột mốc */}
                                <div className='col-lg-12 col-md-12 col-ms-12 col-xs-12'>
                                    <label className="control-label">{translate('task.task_management.consulted')}</label>
                                    {getProjectParticipants(projectDetail) &&
                                        <SelectBox
                                            id={`milestone-consulted-select-box`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={getProjectParticipants(projectDetail)}
                                            onChange={handleChangeMilestoneConsultedEmployees}
                                            value={consultedEmployees}
                                            multiple={true}
                                            options={{ placeholder: translate('task.task_management.add_cons') }}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="row form-group">
                                {/* Những người quan sát cột mốc */}
                                <div className='col-lg-12 col-md-12 col-ms-12 col-xs-12 '>
                                    <label className="control-label">{translate('task.task_management.informed')}</label>
                                    {getProjectParticipants(projectDetail) &&
                                        <SelectBox
                                            id={`milestone-informed-select-box`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={getProjectParticipants(projectDetail)}
                                            onChange={handleChangeMilestoneInformedEmployees}
                                            value={informedEmployees}
                                            multiple={true}
                                            options={{ placeholder: translate('task.task_management.add_inform') }}
                                        />
                                    }
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { tasks, user, department, project } = state;
    return { tasks, user, department, project };
}

const actionCreators = {
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    showInfoRole: RoleActions.show,
    createMilestone: ProjectPhaseActions.createMilestone,
};

const connectedMilestoneCreateForm = connect(mapState, actionCreators)(withTranslate(MilestoneCreateForm));
export { connectedMilestoneCreateForm as MilestoneCreateForm };