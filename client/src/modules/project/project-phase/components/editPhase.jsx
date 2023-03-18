import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DialogModal, ErrorLabel, DatePicker, SelectBox, TimePicker } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../../projects/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectPhaseActions } from '../redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import { convertDateTime, convertDepartmentIdToDepartmentName, convertUserIdToUserName, formatTime, getListDepartments, getProjectParticipants, getCurrentProjectDetails } from '../../projects/components/functionHelper';
import { getStorage } from '../../../../config';
import { TaskFormValidator } from '../../../task/task-management/component/taskFormValidator';
import dayjs from 'dayjs';

const PhaseEditForm = (props) => {
    const { translate, user, tasks, phaseEdit, phaseEditId, currentProjectTasks, projectPhase, project } = props;
    const projectDetail = getCurrentProjectDetails(project);
    const [state, setState] = useState({
        newPhase: {
            phaseName: '',
            description: '',
            startDate: '',
            endDate: '',
            priority: 3,
            responsibleEmployees: [],
            accountableEmployees: [],
            consultedEmployees: [],
            informedEmployees: [],
            status: '',
            progress: 0,
            listTask: [],
            listMilestone: [],
            estimateCost: '',
            startTime: '',
            endTime: '05:30 PM',
            errorOnPhaseName: undefined,
            errorOnStartDate: undefined,
            errorOnEndDate: undefined,
            errorOnStartTime: undefined,
            errorOnEndTime: undefined,
            errorOnStatus: undefined,
            errorOnProgress: undefined,
            errorOnAccountableEmployees: undefined,
            errorOnResponsibleEmployees: undefined,
        }
    });

    let { newPhase } = state;

    let { phaseName, description, status, listTask, listMilestone, startDate, endDate, priority, responsibleEmployees, accountableEmployees, 
        consultedEmployees, informedEmployees, estimateCost, startTime, endTime, errorOnPhaseName, progress, errorOnProgress, errorOnStartDate, errorOnEndDate, 
        errorOnStartTime, errorOnEndTime, errorOnStatus, errorOnAccountableEmployees, errorOnResponsibleEmployees } = state?.newPhase;

    // Cập nhật lại các trường thông tin nếu chọn giai đoạn khác
    useEffect(() => {
        phaseEdit?.project && props.getAllTasksByProject(phaseEdit?.project);
    }, [phaseEditId, JSON.stringify(tasks?.tasks)]);

    useEffect(() => {
        if (!tasks?.isLoading && !projectPhase?.isPhaseLoading && !projectPhase?.isMilestoneLoading) {
            let listTask = tasks?.tasksByProject?.filter(task => task.taskPhase === phaseEditId);
            let listMilestone = projectPhase?.milestones?.filter(milestone => milestone.projectPhase === phaseEditId);
            setState(state => {
                return {
                    ...state,
                    newPhase: {
                        phaseName: phaseEdit?.name || "",
                        description: phaseEdit?.description || "",
                        startDate: phaseEdit?.startDate ? formatDate(phaseEdit?.startDate) : '',
                        endDate: phaseEdit?.endDate ? formatDate(phaseEdit?.endDate) : '',
                        priority: phaseEdit?.priority || 3,
                        responsibleEmployees: phaseEdit?.responsibleEmployees?.map(employee => employee._id) || [],
                        accountableEmployees: phaseEdit?.accountableEmployees?.map(employee => employee._id) || [],
                        consultedEmployees: phaseEdit?.consultedEmployees?.map(employee => employee._id) || [],
                        informedEmployees: phaseEdit?.informedEmployees?.map(employee => employee._id) || [],
                        estimateCost: listTask?.reduce((current, next) => current + next.estimateNormalCost, 0),
                        startTime: formatTime(phaseEdit?.startDate) || '',
                        status: phaseEdit?.status || 'inprocess',
                        progress: phaseEdit?.progress || 0,
                        listTask,
                        listMilestone,
                        endTime: formatTime(phaseEdit?.endDate) || '05:30 PM',
                        errorOnPhaseName: undefined,
                        errorOnStartDate: undefined,
                        errorOnEndDate: undefined,
                        errorOnStartTime: undefined,
                        errorOnEndTime: undefined,
                        errorOnAccountableEmployees: undefined,
                        errorOnResponsibleEmployees: undefined,
                    }
                }
            })
        }
    }, [tasks?.isLoading, projectPhase?.isPhaseLoading, projectPhase?.isMilestoneLoading, phaseEditId, JSON.stringify(tasks?.tasks), JSON.stringify(phaseEdit)])

    // Hàm bắt sự kiện thay đổi tên giai đoạn
    const handleChangePhaseName = (event) => {
        let { value } = event.target;
        let message_length = ValidationHelper.validateName(translate, value, 6, 255).message;
        let message_dup = ValidationHelper.validateTaskName(translate, value, projectPhase.phases).message;
        let message = undefined;

        // Kiểm tra tên hiện tại có giống tên gốc
        if (value !== phaseEdit.name) message = message_length || message_dup;
        setState({
            ...state,
            newPhase: {
                ...state.newPhase,
                phaseName: value,
                errorOnPhaseName: message,
            }
        })
    }

    const checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

    // Tính tiến độ dựa trên những công việc và cột mốc thành phần
    const calculateProgress = async () => {
        let point = 0;
        let taskPoint = 0;
        let milestonePoint = 0;
        if (listTask && listTask.length > 0) {
            taskPoint = listTask.reduce((current, next) => current + next.progress, 0)
        }

        if (listMilestone && listMilestone.length > 0) {
            milestonePoint = listMilestone.reduce((current, next) => current + next.progress, 0)
        }

        if ( (listTask && listTask.length > 0) || (listMilestone && listMilestone.length > 0) ) {
            point = (taskPoint + milestonePoint) / (listMilestone.length + listTask.length);
        }

        setState({
            ...state,
            newPhase: {
                ...state.newPhase,
                progress: point,
            }
        })
    }

    const handleChangeStatus = (value) => {
        // kiểm tra trạng thái của các công việc và cột mốc thuộc giai đoạn
        if (value[0] === "finished") {
            let unFinishedTask = listTask.filter(task => task.status !== "finished");
            let unFinishedMilestone = listMilestone.filter(milestone => milestone.status !== "finished");
            if ( (unFinishedTask && unFinishedTask.length > 0) || (unFinishedMilestone && unFinishedMilestone.length >0) ) {
                setState({
                    ...state,
                    newPhase: {
                        ...state.newPhase,
                        errorOnStatus: "Giai đoạn không được hoàn thành khi công việc hoặc cột mốc thành phần chưa hoàn thành",
                        status: value[0]
                    }
                })
            }
        }
        else setState({
            ...state,
            newPhase: {
                ...state.newPhase,
                status: value[0],
                errorOnStatus: undefined
            }
        })
    }

    // Hàm bắt sự kiện thay đổi mô tả giai đoạn
    const handleChangePhaseDescription = (event) => {
        let { value } = event.target
        setState({
            ...state,
            newPhase: {
                ...state.newPhase,
                description: value,
            }
        });
    }

    // Thay đổi tiến độ
    const handleChangeProgress = (e) => {
        let value = parseInt(e.target.value);
        setState({
            ...state,
            newPhase: {
                ...state.newPhase,
                progress: value,
                errorOnProgress: validatePoint(value)
            }
        })
    }

    const validatePoint = (value) => {
        let { translate } = props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
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


    // Hàn bắt sự kiện thay đổi ngày bắt đầu giai đoạn
    const handleChangePhaseStartDate = (value) => {
        validatePhaseStartDate(value, true);
    }

    const validatePhaseStartDate = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateTaskStartDate(value, endDate, translate);
        let _startDate = convertDateTime(value, startTime);
        let _endDate = convertDateTime(endDate, endTime);

        if (_startDate > _endDate) {
            msg = translate('project.add_err_end_date');
        }

        if (willUpdateState) {
            setState({
                ...state,
                newPhase: {
                    ...state.newPhase,
                    startDate: value,
                    errorOnStartDate: msg,
                    errorOnEndDate: !msg && endDate ? msg : errorOnEndDate
                }
            })

        }
        return msg === undefined;
    }

    // Hàm bắt sự kiện thay đổi thời điểm bắt đầu dự án
    const handleStartTimeChange = (value) => {
        let _startDate = convertDateTime(startDate, value);
        let _endDate = convertDateTime(endDate, endTime);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('project.add_err_empty_start_date');
        }
        else if (_startDate > _endDate) {
            err = translate('project.add_err_end_date');
            resetErr = undefined;
        }
        setState({
            ...state,
            newPhase: {
                ...state.newPhase,
                startTime: value,
                errorOnStartDate: err,
                errorOnEndDate: resetErr,
            }
        });
    }

    // Hàm bắt sự kiện thời điểm kết thúc dự án
    const handleEndTimeChange = (value) => {
        let _startDate = convertDateTime(startDate, startTime);
        let _endDate = convertDateTime(endDate, value);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('project.add_err_empty_end_date');
        }
        else if (_startDate > _endDate) {
            err = translate('project.add_err_end_date');
            resetErr = undefined;
        }
        setState({
            ...state,
            newPhase: {
                ...state.newPhase,
                endTime: value,
                errorOnEndDate: err,
                errorOnStartDate: resetErr,
            }
        })
    }

    // Hàm bắt sự kiện thay đổi ngày kết thúc dự án
    const handleChangePhaseEndDate = (value) => {
        validatePhaseEndDate(value, true);
    }

    const validatePhaseEndDate = (value, willUpdateState = true) => {
        let msg = TaskFormValidator.validateTaskEndDate(startDate, value, translate);
        if (willUpdateState) {
            setState({
                ...state,
                newPhase: {
                    ...state.newPhase,
                    endDate: value,
                    errorOnEndDate: msg,
                    errorOnStartDate: !msg && startDate ? msg : errorOnStartDate
                }
            })
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi danh sách công việc thuộc giai đoạn
    // const handleChangeListTask = (selected) => {
    //     let newListTask = [];
    //     newListTask = currentProjectTasks?.filter(task => selected.includes(task._id));
    //     let newStartDate = formatDate(dayjs(findEarliestDate(newListTask)));
    //     let newStartTime = formatTime(dayjs(findEarliestDate(newListTask)));
    //     let newEndDate = formatDate(dayjs(findLatestDate(newListTask)));
    //     let newEndTime = formatTime(dayjs(findLatestDate(newListTask)));
    //     let newEstimateCost = newListTask?.reduce((previous,current) => previous + current.estimateNormalCost, 0)
    //     if (selected && selected.length > 0) {
    //         setState({
    //             ...state,
    //             newPhase: {
    //                 ...state.newPhase,
    //                 startDate: newStartDate,
    //                 endDate: newEndDate,
    //                 startTime: newStartTime,
    //                 endTime: newEndTime,
    //                 listTask: selected,
    //                 estimateCost: newEstimateCost,
    //             }
    //         })
    //     }
    //     else setState({
    //         ...state,
    //         newPhase: {
    //             ...state.newPhase,
    //             listTask: selected,
    //         }
    //     })
    // }

    // Hàm bắt sự kiện thay đổi độ ưu tiên
    const handleChangePhasePriority = (event) => {
        let currentNewPhase = {
            ...state.newPhase,
            priority: event.target.value
        }
        setState({
            ...state,
            newPhase: currentNewPhase,
        });
    }

    // Hàm bắt sự kiện thay đổi người thực hiện
    const handleChangePhaseResponsibleEmployees = (value) => {
        validatePhaseResponsibleEmployees(value, true);
    }
    const validatePhaseResponsibleEmployees = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(translate, value);

        if (willUpdateState) {
            let currentNewPhase = {
                ...state.newPhase,
                responsibleEmployees: value,
                errorOnResponsibleEmployees: message,
            }

            setState({
                ...state,
                newPhase: currentNewPhase,
            });
        }
        return message === undefined;
    }

    // Hàm bắt sự kiện thay đổi người phê duyệt
    const handleChangePhaseAccountableEmployees = (value) => {
        validatePhaseAccountableEmployees(value, true);
    }
    const validatePhaseAccountableEmployees = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(translate, value);
        if (willUpdateState) {
            let currentNewPhase = {
                ...state.newPhase,
                accountableEmployees: value,
                errorOnAccountableEmployees: message,
            }
            setState({
                ...state,
                newPhase: currentNewPhase,
            });
        }
        return message === undefined;
    }

    // Hàm bắt sự kiện thay đổi người tư vấn
    const handleChangePhaseConsultedEmployees = (value) => {
        setState(state => {
            return {
                ...state,
                newPhase: {
                    ...state.newPhase,
                    consultedEmployees: value
                }
            };
        });
    }

    // Hàm bắt sự kiện thay đổi người quan sát
    const handleChangePhaseInformedEmployees = (value) => {
        let currentNewPhase = {
            ...state.newPhase,
            informedEmployees: value,
        }
        setState({
            ...state,
            newPhase: currentNewPhase,
        });
    }



    // Kiểm tra xem các thông tin đầu vào có hợp lệ
    const isFormValidated = () => {
        if (!ValidationHelper.validateName(translate, phaseName, 6, 255).status || errorOnStartDate || errorOnEndDate || errorOnStatus || errorOnProgress || 
        errorOnAccountableEmployees || errorOnResponsibleEmployees || accountableEmployees.length === 0 || responsibleEmployees.length === 0) return false;
        return true;
    }

    const save = async () => {
        if (isFormValidated()) {
            let partStartDate = convertDateTime(startDate, startTime).split('-');
            let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

            let partEndDate = convertDateTime(endDate, endTime).split('-');
            let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

            await props.editPhase(phaseEdit?._id, {
                name: phaseName,
                startDate: start,
                endDate: end,
                priority,
                responsibleEmployees, 
                accountableEmployees, 
                consultedEmployees,
                informedEmployees,
                progress,
                status,
                description,
                estimateCost,
            });
        }
    }

    const isTasksListEmpty = (listTask?.length === 0);
    const freeTask = currentProjectTasks?.filter(task => !task.taskPhase || task.taskPhase === phaseEditId).map(task => {
        return {
            value: task._id,
            text: task.name,
        }
    });

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-phase-${phaseEdit?._id && phaseEditId}`}
                isLoading={false}
                formID={`form-edit-phase-${phaseEdit?._id && phaseEditId}`}
                title={translate('project.edit_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
            >
                <div className="row">
                    <div className={`col-sm-6 col-md-6 col-xs-12`}>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Chỉnh sửa thông tin giai đoạn trong dự án</legend>
                            {/* Tên giai đoạn */}
                            <div className={`form-group ${!errorOnPhaseName ? "" : "has-error"}`}>
                                <label>{translate('phase.fullName')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={phaseName} onChange={handleChangePhaseName}></input>
                                <ErrorLabel content={errorOnPhaseName} />
                            </div>

                            <div className={'row'}>
                                {/* Độ ưu tiên */}
                                <div className="col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group">
                                    <label className="control-label">{translate('task.task_management.detail_priority')}<span className="text-red">*</span></label>
                                    <select className="form-control" value={priority} onChange={handleChangePhasePriority}>
                                        <option value={5}>{translate('task.task_management.urgent')}</option>
                                        <option value={4}>{translate('task.task_management.high')}</option>
                                        <option value={3}>{translate('task.task_management.standard')}</option>
                                        <option value={2}>{translate('task.task_management.average')}</option>
                                        <option value={1}>{translate('task.task_management.low')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Thời gian bắt đầu, kết thúc */}
                            <div className="row">
                                <div className={`col-md-6 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('phase.startDate')}<span className="text-red">*</span></label>
                                    {
                                        isTasksListEmpty ?
                                            <DatePicker
                                                id={`edit-phase-start-date`}
                                                value={startDate}
                                                onChange={e => handleChangePhaseStartDate(e)}
                                                dateFormat="day-month-year"
                                            />
                                            : startDate
                                    }
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">{translate('phase.startTime')}<span className="text-red">*</span></label>
                                    {
                                        isTasksListEmpty ?
                                            <TimePicker
                                                id={`edit-phase-start-time`}
                                                value={startTime}
                                                onChange={e => handleStartTimeChange(e)}
                                                disabled={!isTasksListEmpty}
                                            />
                                            : startTime
                                    }
                                </div>
                            </div>


                            <div className="row">
                                <div className={`col-md-6 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                    <label className="control-label">{translate('phase.endDate')}<span className="text-red">*</span></label>
                                    {
                                        isTasksListEmpty ?
                                            <DatePicker
                                                id={`edit-phase-end-date`}
                                                value={endDate}
                                                onChange={e => handleChangePhaseEndDate(e)}
                                                dateFormat="day-month-year"
                                                disabled={!isTasksListEmpty}
                                            />
                                            : endDate
                                    }
                                    <ErrorLabel content={errorOnEndDate} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">{translate('phase.endTime')}<span className="text-red">*</span></label>
                                    {
                                        isTasksListEmpty ?
                                            <TimePicker
                                                id={`edit-phase-end-time`}
                                                value={endTime}
                                                onChange={e => handleEndTimeChange(e)}
                                                disabled={!isTasksListEmpty}
                                            />
                                            : endTime
                                    }
                                </div>
                            </div>

                            {/* Mô tả giai đoạn */}
                            <div className={`form-group`}>
                                <label>{translate('phase.description')}</label>
                                <textarea type="text" className="form-control" value={description} onChange={handleChangePhaseDescription} />
                            </div>

                            {/* Trạng thái */}
                            <div className={`form-group ${errorOnStatus === undefined ? "" : "has-error"}`}>
                                <label>{translate('phase.status')}</label>
                                <SelectBox
                                    id={`select-phase-status`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: "inprocess", text: translate('task.task_management.inprocess') },
                                        { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                        { value: "finished", text: translate('task.task_management.finished') },
                                        { value: "delayed", text: translate('task.task_management.delayed') },
                                        { value: "canceled", text: translate('task.task_management.canceled') },
                                    ]}
                                    value={newPhase.status}
                                    multiple={false}
                                    onChange={handleChangeStatus}
                                />
                                <ErrorLabel content={errorOnStatus} />
                            </div>

                            {/* Các công việc trong giai đoạn */}
                            {/* <div className={`form-group`}>
                                <label>{translate('phase.listTasks')}</label>
                                <SelectBox
                                    id={`select-phase-list-task`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={freeTask || []}
                                    value={newPhase.listTask}
                                    multiple={true}
                                    onChange={handleChangeListTask}
                                />
                            </div> */}

                            {/* Tiến độ */}
                            <div className={`form-group ${errorOnProgress === undefined ? "" : "has-error"}`}>
                                <label>{translate('task.task_management.detail_progress')} (1-100)</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="progress"
                                    placeholder={translate('task.task_management.edit_enter_progress')}
                                    onChange={handleChangeProgress}
                                    value={checkNullUndefined(progress) ? progress : ''}
                                />
                                <ErrorLabel content={errorOnProgress} />
                            </div>
                            <div className="pull-right">
                                <a onClick={calculateProgress} style={{ cursor: 'pointer', fontWeight: "normal" }}>Tự động tính mức độ hoàn thành dựa trên các công việc và cột mốc thành phần</a>
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
                                            id={`edit-phase-responsible-select-box`}
                                            className="form-control select"
                                            style={{ width: "100%" }}
                                            items={getProjectParticipants(projectDetail)}
                                            onChange={handleChangePhaseResponsibleEmployees}
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
                                            id={`edit-phase-accounatable-select-box`}
                                            className="form-control select"
                                            style={{ width: "100%" }}
                                            items={getProjectParticipants(projectDetail)}
                                            onChange={handleChangePhaseAccountableEmployees}
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
                                            id={`edit-phase-consulted-select-box`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={getProjectParticipants(projectDetail)}
                                            onChange={handleChangePhaseConsultedEmployees}
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
                                            id={`edit-phase-informed-select-box`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={getProjectParticipants(projectDetail)}
                                            onChange={handleChangePhaseInformedEmployees}
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

function mapStateToProps(state) {
    const { project, user, projectPhase, tasks } = state;
    return { project, user, projectPhase, tasks }
}

const mapDispatchToProps = {
    getAllTasksByProject: taskManagementActions.getAllTasksByProject,
    getAllMilestoneByProject: ProjectPhaseActions.getAllMilestoneByProject,
    editPhase: ProjectPhaseActions.editPhase,
    
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PhaseEditForm));