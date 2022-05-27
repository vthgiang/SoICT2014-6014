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
import { formatTaskStatus, getCurrentProjectDetails, renderProgressBar, renderStatusColor } from './functionHelper';
import { performTaskAction } from '../../../task/task-perform/redux/actions';
import Swal from 'sweetalert2';
import { ModalPerform } from '../../../task/task-perform/component/modalPerform';
import moment from 'moment';
import { getTotalTimeSheetLogs } from '../../../task/task-management/component/functionHelpers';
import _cloneDeep from 'lodash/cloneDeep';

const TableTasksProject = (props) => {
    const tableId = "tasks-project-table";
    const [state, setState] = useState({
        taskName: "",
        data: []
        // page: 1,
        // perPage: 6,
    })
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
    const userId = getStorage('userId');
    const { translate, currentProjectTasks, user, project, performtasks, tasks } = props;
    const { taskName, currentTaskId, data } = state;
    let units = []
    if (user) units = user.organizationalUnitsOfUser;

    const totalPage = tasks && Math.ceil(tasks.totalDocs / perPage);

    useEffect(() => {
        props.getTasksByProject(currentProjectId, page, perPage);
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
                    preceedingTask: processPreceedingTasks(currentTasks[n]?.preceedingTasks),
                    responsibleEmployees: currentTasks[n]?.responsibleEmployees?.length > 0 ? <ToolTip dataTooltip={currentTasks[n]?.responsibleEmployees.map(o => o.name)} /> : null,
                    accountableEmployees: currentTasks[n]?.accountableEmployees?.length > 0 ? <ToolTip dataTooltip={currentTasks[n]?.accountableEmployees.map(o => o.name)} /> : null,
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
    }, [performtasks?.isLoading, tasks?.isLoading, user?.isLoading, tasks?.isProjectPaginateLoading])

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

    const setCurrentPage = (pageNumber) => {
        setPage(parseInt(pageNumber));
        props.getTasksByProject(currentProjectId, parseInt(pageNumber), perPage);
    }

    const setLimit = (number) => {
        setPage(1);
        setPerPage(parseInt(number));
        // setState({
        //     ...state,
        //     perPage: parseInt(number),
        //     page: 1
        // });
        props.getTasksByProject(currentProjectId, 1, parseInt(number));
    }

    const handleShowDetailInfo = (id) => {
        setState({
            ...state,
            currentTaskId: id
        })
        window.$(`#modelPerformTask${id}`).modal('show')
    }

    const processPreceedingTasks = (preceedingTasks) => {
        if (!currentProjectTasks || preceedingTasks.length === 0) return '';
        const resultArr = preceedingTasks.map(preceedingTaskItem => {
            return currentProjectTasks.find(item => item._id === preceedingTaskItem.task)?.name;
        })
        return resultArr.join(", ");
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

    let column = [
        { name: translate('task.task_management.col_name'), key: "name" },
        { name: translate('project.task_management.preceedingTask'), key: "preceedingTask" },
        { name: translate('task.task_management.responsible'), key: "responsibleEmployees" },
        { name: translate('task.task_management.accountable'), key: "accountableEmployees" },
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

            <div className="qlcv StyleScrollDiv StyleScrollDiv-y" style={{ maxHeight: '600px' }}>
                <TreeTable
                    behaviour="show-children"
                    tableSetting={true}
                    tableId='list-project-table'
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
//         return prev.tasks.tasksbyproject === next.tasks.tasksbyproject
//     })
// ));