import React, { useState, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, ExportExcel, DeleteNotification, ToolTip } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { getStorage } from '../../../../config';
import { formatTaskStatus, getCurrentProjectDetails, renderProgressBar, renderStatusColor, convertPriorityData } from './functionHelper';
import { performTaskAction } from '../../../task/task-perform/redux/actions';
import Swal from 'sweetalert2';
import { ModalPerform } from '../../../task/task-perform/component/modalPerform';
import moment from 'moment';
import { getTotalTimeSheetLogs } from '../../../task/task-management/component/functionHelpers';
import _cloneDeep from 'lodash/cloneDeep';

const TableTasksProject = (props) => {
    const tableId = "tasks-project-table";
    const [state, setState] = useState({
        status: [],
        name: null,
        priority: null,
        startDate: null,
        endDate: null,
        responsibleEmployees: null,
        accountableEmployees: null,
        creatorEmployees: null,
        preceedingTasks: null,
        data: [],
        currentTaskId: '',
    })
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
    const userId = getStorage('userId');
    const { translate, currentProjectTasks, user, project, performtasks, tasks } = props;
    const { status, name, priority, startDate, endDate, responsibleEmployees, accountableEmployees, creatorEmployees, preceedingTasks, data, currentTaskId } = state;
    let units = []
    if (user) units = user.organizationalUnitsOfUser;

    const totalPage = tasks && Math.ceil(tasks.totalDocs / perPage);

    useEffect(() => {
        let data = {
            status: [],
            name: null,
            priority: null,
            startDate: null,
            endDate: null,
            responsibleEmployees: null,
            accountableEmployees: null,
            creatorEmployees: null,
            preceedingTasks: null,
            projectId: currentProjectId,
            page: 1,
            perPage: perPage,
        }
        props.getTasksByProject(data);
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    useEffect(() => {
        if (currentTaskId) {
            window.$(`#modelPerformTask${currentTaskId}`).modal('show')
        }
    }, [currentTaskId])

    useEffect(() => {
        let data = [];
        if (!tasks?.isLoading && !user?.isLoading && !performtasks?.isLoading && !tasks?.isProjectPaginateLoading) {
            let currentTasks = _cloneDeep(tasks.tasks); // Sao chép ra mảng mới
            for (let n in currentTasks) {

                data[n] = {
                    ...currentTasks[n],
                    rawData: currentTasks[n],
                    name: currentTasks[n]?.name,
                    priority: convertPriorityData(currentTasks[n].priority, translate),
                    preceedingTask: processPreceedingTasks(currentTasks[n]?.preceedingTasks),
                    responsibleEmployees: currentTasks[n]?.responsibleEmployees?.length > 0 ? <ToolTip dataTooltip={currentTasks[n]?.responsibleEmployees.map(o => o.name)} /> : null,
                    accountableEmployees: currentTasks[n]?.accountableEmployees?.length > 0 ? <ToolTip dataTooltip={currentTasks[n]?.accountableEmployees.map(o => o.name)} /> : null,
                    creatorEmployees: currentTasks[n].creator ? currentTasks[n].creator.name : null,
                    status: <div style={{ color: renderStatusColor(currentTasks[n]) }}>{formatTaskStatus(translate, currentTasks[n]?.status)}</div>,
                    startDate: moment(currentTasks[n]?.startDate).format('HH:mm DD/MM/YYYY'),
                    endDate: moment(currentTasks[n]?.endDate).format('HH:mm DD/MM/YYYY'),
                    actualEndDate: currentTasks[n]?.actualEndDate && moment(currentTasks[n]?.actualEndDate).format('HH:mm DD/MM/YYYY'),
                    timesheetLogs: getTotalTimeSheetLogs(currentTasks[n]?.timesheetLogs),
                    progress: renderProgressBar(currentTasks[n]?.progress, currentTasks[n]),
                    action: ["view"]
                }

                // Kiểm tra xem người dùng có quyền bấm giờ
                if (currentTasks[n].responsibleEmployees && currentTasks[n].responsibleEmployees.find(e => e._id === userId) || currentTasks[n].accountableEmployees && currentTasks[n].accountableEmployees.find(e => e._id === userId)) {
                    data[n] = { ...data[n], action: ["edit", "startTimer"] }
                }
            }

            setState({
                ...state,
                data: data
            })
        }
        console.log(data);
    }, [performtasks?.isLoading, tasks?.isLoading, user?.isLoading, tasks?.isProjectPaginateLoading, JSON.stringify(props?.tasks?.tasks), JSON.stringify(props?.project?.data?.list)])

    // const handleChangeProjectName = (e) => {
    //     const { value } = e.target;
    //     setState({
    //         ...state,
    //         taskName: value
    //     });
    // }

    // const handleSubmitSearch = () => {
    //     props.getExamples({
    //         taskName,
    //         perPage,
    //         page: 1
    //     });
    //     setState({
    //         ...state,
    //         page: 1
    //     });
    // }

    const processPreceedingTasks = (preceedingTasks) => {
        if (!currentProjectTasks || preceedingTasks?.length === 0) return '';
        const resultArr = preceedingTasks?.map(preceedingTaskItem => {
            return currentProjectTasks.find(item => item._id === preceedingTaskItem.task)?.name;
        })
        return <ToolTip dataTooltip={resultArr} />;
    }

    const handleChangeName = (e) => {
        let name = e.target.value;
        if (name === '') {
            name = null;
        }

        setState({
            ...state,
            name
        });
    }

    const handleChangePreceedingTasks = (e) => {
        let preceedingTasksName = e.target.value;
        if (preceedingTasksName === '') {
            preceedingTasksName = null;
        }

        setState({
            ...state,
            preceedingTasks: preceedingTasksName
        });
    }

    const handleSelectStatus = (value) => {
        setState({
            ...state,
            status: value
        });
    }

    const handleSelectPriority = (value) => {
        setState({
            ...state,
            priority: value
        });
    }

    const handleChangeStartDate = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState(state => {
            return {
                ...state,
                startDate: month
            }
        });
    }

    const handleChangeEndDate = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState(state => {
            return {
                ...state,
                endDate: month
            }
        });
    }

    const handleChangeResponsibleEmployees = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            responsibleEmployees: value,
        })
    }

    const handleChangeAccountableEmployees = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            accountableEmployees: value,
        })
    }

    const handleChangeCreatorEmployees = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            creatorEmployees: value,
        })
    }

    const setCurrentPage = (pageNumber) => {
        let data = {
            status: status,
            name: name,
            priority: priority,
            startDate: startDate,
            endDate: endDate,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            creatorEmployees: creatorEmployees,
            preceedingTasks: preceedingTasks,
            projectId: currentProjectId,
            page: parseInt(pageNumber),
            perPage: perPage,
        }

        setPage(parseInt(pageNumber));
        props.getTasksByProject(data);
    }

    const setLimit = (number) => {
        let data = {
            status: status,
            name: name,
            priority: priority,
            startDate: startDate,
            endDate: endDate,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            creatorEmployees: creatorEmployees,
            preceedingTasks: preceedingTasks,
            projectId: currentProjectId,
            page: page,
            perPage: parseInt(number),
        }

        setPerPage(parseInt(number));
        // setState({
        //     ...state,
        //     perPage: parseInt(number),
        //     page: 1
        // });
        props.getTasksByProject(data);
    }

    // Xem thông tin công việc
    const handleShowDetailInfo = (id) => {
        setState({
            ...state,
            currentTaskId: id
        })
        window.$(`#modelPerformTask${id}`).modal('show')
    }

    const handleUpdateData = () => {
        let startMonth, endMonth;
        if (startDate && endDate) {
            startMonth = new Date(startDate);
            endMonth = new Date(endDate);
        }

        if (startMonth && endMonth && startMonth.getTime() > endMonth.getTime()) {
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            let data = {
                status: status,
                name: name,
                priority: priority,
                startDate: startDate,
                endDate: endDate,
                responsibleEmployees: responsibleEmployees,
                accountableEmployees: accountableEmployees,
                creatorEmployees: creatorEmployees,
                preceedingTasks: preceedingTasks,
                projectId: currentProjectId,
                page: page,
                perPage: perPage,
            }

            props.getTasksByProject(data);
        }

        setPage(1);
    }

    const startTimer = async (taskId, overrideTSLog = 'no') => {
        let timer = {
            creator: userId,
            overrideTSLog
        };
        props.startTimer(taskId, timer).catch(err => {
            let warning = Array.isArray(err.response.data.messages) ? err.response.data.messages : [err.response.data.messages];
            if (warning[0] === 'time_overlapping') {
                Swal.fire({
                    title: `Bạn đã hẹn tắt bấm giờ cho công việc [ ${warning[1]} ]`,
                    html: `<h4 class="text-red">Lưu lại những giờ đã bấm được cho công việc [ ${warning[1]} ] và bấm giờ công việc mới</h4>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Bấm giờ mới',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let timer = {
                            creator: userId,
                            overrideTSLog: 'yes'
                        };
                        this.props.startTimer(taskId, timer)
                    }
                })
            }
        })
    }

    // const renderTimerButton = (taskItem) => {
    //     const resArrFlatten = taskItem?.responsibleEmployees.map(o => String(o.id))
    //     const accArrFlatten = taskItem?.accountableEmployees.map(o => String(o.id))
    //     if (resArrFlatten.includes(String(userId)) || accArrFlatten.includes(String(userId))) {
    //         return <a
    //             style={{ cursor: 'pointer' }}
    //             onClick={() => !performtasks.currentTimer && startTimer(taskItem._id)}
    //             className={`timer ${performtasks.currentTimer ? performtasks.currentTimer._id === taskItem._id ? 'text-orange' : 'text-gray' : 'text-black'}`}
    //         >
    //             <i className="material-icons">timer</i>
    //         </a>
    //         // return <a className="timer text-yellow" style={{ width: '5px' }} onClick={() => handleShowDetailInfo(taskItem?._id)}>
    //         //     <i className="material-icons">timer</i>
    //         // </a>
    //     }
    //     return null;
    // }

    // Khởi tạo danh sách các cột
    let column = [
        { name: translate('task.task_management.col_name'), key: "name" },
        { name: translate('task.task_management.col_priority'), key: "priority" },
        { name: translate('project.task_management.preceedingTask'), key: "preceedingTask" },
        { name: translate('task.task_management.responsible'), key: "responsibleEmployees" },
        { name: translate('task.task_management.accountable'), key: "accountableEmployees" },
        { name: translate('task.task_management.creator'), key: "creatorEmployees" },
        { name: translate('task.task_management.col_status'), key: "status" },
        { name: translate('project.col_start_time'), key: "startDate" },
        { name: translate('project.col_expected_end_time'), key: "endDate" },
        { name: translate('task.task_management.col_actual_end_date'), key: "actualEndDate" },
        { name: translate('task.task_management.col_timesheet_log'), key: "timesheetLogs" },
        { name: translate('task.task_management.col_progress'), key: "progress" },
    ];

    return (
        <React.Fragment>
            {
                currentTaskId && <ModalPerform
                    units={units}
                    id={currentTaskId}
                />
            }

            <div className="box">
                <div className="box-body qlcv">
                    <div style={{ height: "40px", display: 'flex', justifyContent: 'space-between' }}>
                        {/* Lọc */}
                        <div>
                            <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} onClick={() => { window.$('#tasks-project-filter').slideToggle() }}><i className="fa fa-filter"></i> Lọc</button>
                        </div>

                    </div>

                    <div id="tasks-project-filter" className="form-inline" style={{ display: 'none' }}>

                        {/* Tên công việc */}
                        <div className="form-group">
                            <label>{translate('task.task_management.name')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange={(e) => handleChangeName(e)} />
                        </div>

                        {/* Tên công việc tiền nhiệm */}
                        <div className="form-group">
                            <label>{translate('project.task_management.preceedingTask')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange={(e) => handleChangePreceedingTasks(e)} />
                        </div>

                        {/* Trạng thái công việc */}
                        <div className="form-group">
                            <label>{translate('task.task_management.status')}</label>
                            <SelectMulti id="multiSelectStatus"
                                value={status}
                                items={[
                                    { value: "inprocess", text: translate('task.task_management.inprocess') },
                                    { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                    { value: "finished", text: translate('task.task_management.finished') },
                                    { value: "delayed", text: translate('task.task_management.delayed') },
                                    { value: "canceled", text: translate('task.task_management.canceled') },
                                ]}
                                onChange={handleSelectStatus}
                                options={{ nonSelectedText: translate('task.task_management.select_status'), allSelectedText: translate('task.task_management.select_all_status') }}>
                            </SelectMulti>
                        </div>

                        {/* Độ ưu tiên công việc */}
                        <div className="form-group">
                            <label>{translate('task.task_management.priority')}</label>
                            <SelectMulti id="multiSelectPriority" defaultValue={[
                                translate('task.task_management.urgent'),
                                translate('task.task_management.high'),
                                translate('task.task_management.standard'),
                                translate('task.task_management.average'),
                                translate('task.task_management.low'),
                            ]}
                                items={[
                                    { value: "5", text: translate('task.task_management.urgent') },
                                    { value: "4", text: translate('task.task_management.high') },
                                    { value: "3", text: translate('task.task_management.standard') },
                                    { value: "2", text: translate('task.task_management.average') },
                                    { value: "1", text: translate('task.task_management.low') },
                                ]}
                                onChange={handleSelectPriority}
                                options={{ nonSelectedText: translate('task.task_management.select_priority'), allSelectedText: translate('task.task_management.select_all_priority') }}>
                            </SelectMulti>
                        </div>

                        {/* Người thực hiện */}
                        <div className="form-group">
                            <label>{translate('task.task_management.responsible')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeResponsibleEmployees(e)} />
                        </div>

                        {/* Người phê duyệt */}
                        <div className="form-group">
                            <label>{translate('task.task_management.accountable')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeAccountableEmployees(e)} />
                        </div>

                        {/* Người thiết lập */}
                        <div className="form-group">
                            <label>{translate('task.task_management.creator')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeCreatorEmployees(e)} />
                        </div>

                        {/* Ngày bắt đầu */}
                        <div className="form-group">
                            <label>{translate('project.col_start_time')}</label>
                            <DatePicker
                                id="start-date"
                                dateFormat="month-year"
                                value={""}
                                onChange={handleChangeStartDate}
                                disabled={false}
                            />
                        </div>

                        {/* Ngày kết thúc */}
                        <div className="form-group">
                            <label>{translate('project.col_expected_end_time')}</label>
                            <DatePicker
                                id="end-date"
                                dateFormat="month-year"
                                value={""}
                                onChange={handleChangeEndDate}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={() => handleUpdateData()}>{translate('project.search')}</button>
                        </div>

                    </div>

                    {/* Danh sách công việc */}
                    <div className="qlcv StyleScrollDiv StyleScrollDiv-y" style={{ maxHeight: '600px' }}>
                        <TreeTable
                            behaviour="show-children"
                            tableSetting={true}
                            tableId='list-task-project-table'
                            viewWhenClickName={true}
                            column={column}
                            data={data}
                            onSetNumberOfRowsPerPage={setLimit}
                            titleAction={{
                                edit: translate('task.task_management.action_edit'),
                                startTimer: translate('task.task_management.action_start_timer'),
                            }}
                            funcEdit={handleShowDetailInfo}
                            funcStartTimer={startTimer}
                        />
                    </div>

                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={data && data.length !== 0 && data.length}
                        total={tasks && tasks.totalDocs}
                        func={setCurrentPage}
                    />


                </div>
            </div>


        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user, tasks, performtasks } = state;
    return { project, user, tasks, performtasks }
}

const mapDispatchToProps = {
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
    deleteTaskById: taskManagementActions._delete,
    startTimer: performTaskAction.startTimerTask,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TableTasksProject));
// export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(
//     memo(TableTasksProject, (prev, next) => {
//         return prev.tasks.tasksByProject === next.tasks.tasksByProject
//     })
// ));