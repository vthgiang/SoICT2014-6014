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

const PhaseCreateForm = (props) => {
    const { translate, user, tasks, currentProjectTasks, projectPhase, project, projectId } = props;
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
            listTask: [],
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
            projectId: projectId,
        }
    });

    let { newPhase } = state;

    let { phaseName, description, listTask, startDate, endDate, priority, responsibleEmployees, accountableEmployees, consultedEmployees, 
        informedEmployees, estimateCost, startTime, endTime, errorOnPhaseName, errorOnStartDate, errorOnEndDate, 
        errorOnStartTime, errorOnEndTime, errorOnAccountableEmployees, errorOnResponsibleEmployees } = state?.newPhase;


    // Đặt lại thời gian
    const regenerateTime = () => {
        let currentTime = formatTime(new Date())
        setState(state => {
            return {
                ...state,
                newPhase: {
                    ...state.newPhase,
                    startTime: currentTime
                }
            }
        });
    }

    useEffect(() => {
        //Đặt lại thời gian mặc định khi mở modal
        window.$(`#modal-create-project-phase-${projectId}`).on('shown.bs.modal', regenerateTime);
        return () => {
            window.$(`#modal-create-project-phase-${projectId}`).unbind('shown.bs.modal', regenerateTime)
        }
    }, [])

    // Hàm bắt sự kiện thay đổi tên giai đoạn
    const handleChangePhaseName = (event) => {
        let { value } = event.target;
        let message_length = ValidationHelper.validateName(translate, value, 6, 255).message;
        let message_dup = ValidationHelper.validateTaskName(translate, value, projectPhase.phases).message;

        setState({
            ...state,
            newPhase: {
                ...state.newPhase,
                phaseName: value,
                errorOnPhaseName: message_length || message_dup,
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

    // Hàm bắt sự kiện thay đổi thời điểm bắt đầu giai đoạn
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

    // Hàm bắt sự kiện thời điểm kết thúc giai đoạn
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

    // Hàm bắt sự kiện thay đổi ngày kết thúc giai đoạn
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
        if (!ValidationHelper.validateName(translate, phaseName, 6, 255).status || errorOnStartDate || errorOnEndDate || errorOnAccountableEmployees
        || errorOnResponsibleEmployees || accountableEmployees.length === 0 || responsibleEmployees.length === 0 ) return false;
        return true;
    }

    const save = async () => {
        if (isFormValidated()) {
            let partStartDate = convertDateTime(startDate, startTime).split('-');
            let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

            let partEndDate = convertDateTime(endDate, endTime).split('-');
            let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

            await props.createPhase({
                name: phaseName,
                startDate: start,
                endDate: end,
                priority,
                responsibleEmployees, 
                accountableEmployees, 
                consultedEmployees,
                informedEmployees,
                description,
                estimateCost,
                creator:  getStorage('userId'),
                project: projectId
            });
        }
    }

    const isTasksListEmpty = (listTask?.length === 0);
    const freeTask = currentProjectTasks?.filter(task => !task.taskPhase).map(task => {
        return {
            value: task._id,
            text: task.name,
        }
    });

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-create-project-phase-${projectId}`}
                isLoading={false}
                formID={`form-create-project-phase-${projectId}`}
                title={translate('project.edit_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
            >
                <div className="row">
                    <div className={`col-sm-6 col-md-6 col-xs-12`}>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thêm mới giai đoạn trong dự án</legend>
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
                                                id={`create-phase-start-date`}
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
                                                id={`create-phase-start-time`}
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
                                                id={`create-phase-end-date`}
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
                                                id={`create-phase-end-time`}
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
                                            id={`phase-responsible-select-box`}
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
                                            id={`phase-accounatable-select-box`}
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
                                            id={`phase-consulted-select-box`}
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
                                            id={`phase-informed-select-box`}
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
    createPhase: ProjectPhaseActions.createPhase,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PhaseCreateForm));