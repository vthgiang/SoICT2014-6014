import React, { useState, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, ExportExcel, DeleteNotification } from '../../../../common-components';
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

const TableTasksProject = (props) => {
    const tableId = "tasks-project-table";
    const [state, setState] = useState({
        taskName: "",
        // page: 1,
        // perPage: 6,
        currentTaskId: '',
    })
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
    const userId = getStorage('userId');
    const { translate, currentProjectTasks, user, project, performtasks, tasks } = props;
    const { taskName, currentTaskId } = state;
    let units = []
    if (user) units = user.organizationalUnitsOfUser;

    useEffect(() => {
        props.getTasksByProject(currentProjectId, page, perPage);
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    useEffect(() => {
        window.$(`#modelPerformTask${currentTaskId}`).modal('show')
    }, [currentTaskId])

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
        setState(state => {
            return{
                ...state,
            currentTaskId: id
            }
        })
    }

    const processPreceedingTasks = (preceedingTasks) => {
        if (!currentProjectTasks || preceedingTasks.length === 0) return '';
        const resultArr = preceedingTasks.map(preceedingTaskItem => {
            return currentProjectTasks.find(item => item._id === preceedingTaskItem.task)?.name;
        })
        return resultArr.join(", ");
    }
    let lists = [];
    if (tasks) {
        lists = tasks.tasksbyprojectpaginate
    }

    const totalPage = tasks && Math.ceil(tasks.totalDocs / perPage);

    const funcStartTimer = async (taskId, overrideTSLog = 'no') => {
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

    const renderTimerButton = (taskItem) => {
        const resArrFlatten = taskItem?.responsibleEmployees.map(o => String(o.id))
        const accArrFlatten = taskItem?.accountableEmployees.map(o => String(o.id))
        if (resArrFlatten.includes(String(userId)) || accArrFlatten.includes(String(userId))) {
            return <a
                style={{ cursor: 'pointer' }}
                onClick={() => !performtasks.currentTimer && funcStartTimer(taskItem._id)}
                className={`timer ${performtasks.currentTimer ? performtasks.currentTimer._id === taskItem._id ? 'text-orange' : 'text-gray' : 'text-black'}`}
            >
                <i className="material-icons">timer</i>
            </a>
            // return <a className="timer text-yellow" style={{ width: '5px' }} onClick={() => handleShowDetailInfo(taskItem?._id)}>
            //     <i className="material-icons">timer</i>
            // </a>
        }
        return null;
    }

    return (
        <React.Fragment>
            {
                currentTaskId ? <ModalPerform
                    units={units}
                    id={currentTaskId}
                /> : null
            }

            <table id={tableId} className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>{translate('task.task_management.col_name')}</th>
                        <th>{translate('project.task_management.preceedingTask')}</th>
                        <th>{translate('task.task_management.responsible')}</th>
                        <th>{translate('task.task_management.accountable')}</th>
                        <th>{translate('task.task_management.col_status')}</th>
                        <th>Thời điểm bắt đầu</th>
                        <th>Thời điểm kết thúc dự kiến</th>
                        <th>Thời điểm kết thúc thực tế</th>
                        <th>Tổng thời gian bấm giờ</th>
                        <th>{translate('task.task_management.col_progress')}</th>
                        <th style={{ width: "120px", textAlign: "center" }}>
                            {translate('table.action')}
                            <DataTableSetting
                                tableId={tableId}
                                columnArr={[
                                    translate('task.task_management.col_name'),
                                    translate('project.task_management.preceedingTask'),
                                    translate('task.task_management.responsible'),
                                    translate('task.task_management.accountable'),
                                    translate('task.task_management.col_status'),
                                    'Thời điểm bắt đầu',
                                    'Thời điểm kết thúc dự kiến',
                                    'Thời điểm kết thúc thực tế',
                                    'Thời điểm bấm giờ',
                                    translate('task.task_management.col_progress'),
                                ]}
                                setLimit={setLimit}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(lists && lists.length !== 0) &&
                        lists.map((taskItem, index) => (
                            <tr key={index}>
                                <td style={{ color: '#385898' }}>{taskItem?.name}</td>
                                <td style={{ maxWidth: 350 }}>{processPreceedingTasks(taskItem?.preceedingTasks)}</td>
                                <td>{taskItem?.responsibleEmployees.map(o => o.name).join(", ")}</td>
                                <td>{taskItem?.accountableEmployees?.map(o => o.name).join(", ")}</td>
                                <td style={{ color: renderStatusColor(taskItem) }}>{formatTaskStatus(translate, taskItem?.status)}</td>
                                <td>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                <td>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                <td>{taskItem?.actualEndDate && moment(taskItem?.actualEndDate).format('HH:mm DD/MM/YYYY')}</td>
                                <td>{getTotalTimeSheetLogs(taskItem?.timesheetLogs)}</td>
                                <td>{renderProgressBar(taskItem?.progress, taskItem)}</td>
                                {/* <td>{taskItem?.progress}%</td> */}
                                <td style={{ textAlign: "center" }}>
                                    <a className="edit text-yellow" style={{ width: '5px' }} onClick={() => handleShowDetailInfo(taskItem?._id)}><i className="material-icons">edit</i></a>
                                    {renderTimerButton(taskItem)}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {/* PaginateBar */}
            {tasks && tasks.isProjectPaginateLoading ?
                <div className="table-info-panel">{translate('confirm.loading')}</div> :
                (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            <PaginateBar
                pageTotal={totalPage ? totalPage : 0}
                currentPage={page}
                display={lists && lists.length !== 0 && lists.length}
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