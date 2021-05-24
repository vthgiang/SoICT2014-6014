import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, ExportExcel, DeleteNotification } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { getStorage } from '../../../../config';
import { getCurrentProjectDetails } from './functionHelper';
import { performTaskAction } from '../../../task/task-perform/redux/actions';
import Swal from 'sweetalert2';
import { ModalPerform } from '../../../task/task-perform/component/modalPerform';
import moment from 'moment';
import { getTotalTimeSheetLogs } from '../../../task/task-management/component/functionHelpers';

const TableTasksProject = (props) => {
    const [state, setState] = useState({
        taskName: "",
        page: 1,
        limit: 5,
        currentTaskId: null,
    })
    const currentProjectId = window.location.href.split('?id=')[1];
    const userId = getStorage('userId');
    const { translate, currentProjectTasks, user, project, performtasks } = props;
    const { page, limit, taskName, currentTaskId } = state;
    let units = []
    if (user) units = user.organizationalUnitsOfUser;

    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    const formatTaskStatus = (translate, status) => {
        switch (status) {
            case "inprocess":
                return translate('task.task_management.inprocess');
            case "wait_for_approval":
                return translate('task.task_management.wait_for_approval');
            case "finished":
                return translate('task.task_management.finished');
            case "delayed":
                return translate('task.task_management.delayed');
            case "canceled":
                return translate('task.task_management.canceled');
            case "requested_to_close":
                return translate('task.task_management.requested_to_close');
        }
    }

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
    //         limit,
    //         page: 1
    //     });
    //     setState({
    //         ...state,
    //         page: 1
    //     });
    // }

    // const setPage = (pageNumber) => {
    //     setState({
    //         ...state,
    //         page: parseInt(pageNumber)
    //     });

    //     props.getProjectsDispatch({
    //         callId: "paginate",
    //         taskName,
    //         limit,
    //         page: parseInt(pageNumber)
    //     });
    // }

    // const setLimit = (number) => {
    //     setState({
    //         ...state,
    //         limit: parseInt(number),
    //         page: 1
    //     });
    //     props.getTasksByProject({
    //         taskName,
    //         limit: parseInt(number),
    //         page: 1
    //     });
    // }

    const handleDelete = async (id) => {
        // props.deleteProjectDispatch(id);
        // props.getProjectsDispatch({
        //     taskName,
        //     limit,
        //     page: project && project.lists && project.lists.length === 1 ? page - 1 : page
        // });
        await props.deleteTaskById(id);
        await props.getTasksByProject(currentProjectId);
    }

    const handleShowDetailInfo = (id) => {
        setState({
            currentTaskId: id
        })
        setTimeout(() => {
            window.$(`#modelPerformTask${id}`).modal('show');
        }, 10);
    }

    const processPreceedingTasks = (preceedingTasks) => {
        if (preceedingTasks.length === 0) return '';
        const resultArr = preceedingTasks.map(preceedingTaskItem => {
            return currentProjectTasks.find(item => item._id === preceedingTaskItem.task)?.name;
        })
        return resultArr.join(", ");
    }
    // let lists = [];
    // if (project) {
    //     lists = project.data.paginate
    // }

    // const totalPage = project && project.data.totalPage;

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

            <table id="project-table" className="table table-striped table-bordered table-hover">
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
                                tableId="example-table"
                                columnArr={[
                                    translate('manage_example.index'),
                                    translate('manage_example.exampleName'),
                                    translate('manage_example.description'),
                                    "Mã số",
                                ]}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(currentProjectTasks && currentProjectTasks.length !== 0) &&
                        currentProjectTasks.map((taskItem, index) => (
                            <tr key={index}>
                                <td>{taskItem?.name}</td>
                                <td>{processPreceedingTasks(taskItem?.preceedingTasks)}</td>
                                <td>{taskItem?.responsibleEmployees.map(o => o.name).join(", ")}</td>
                                <td>{taskItem?.accountableEmployees?.map(o => o.name).join(", ")}</td>
                                <td>{formatTaskStatus(translate, taskItem?.status)}</td>
                                <td>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                <td>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                <td>{taskItem?.actualEndDate && moment(taskItem?.actualEndDate).format('HH:mm DD/MM/YYYY')}</td>
                                <td>{getTotalTimeSheetLogs(taskItem?.timesheetLogs)}</td>
                                <td>{taskItem?.progress}%</td>
                                <td style={{ textAlign: "center" }}>
                                    <a className="edit text-yellow" style={{ width: '5px' }} onClick={() => handleShowDetailInfo(taskItem?._id)}><i className="material-icons">edit</i></a>
                                    {renderTimerButton(taskItem)}
                                    {/* <DeleteNotification
                                        content={translate('task.task_management.action_delete')}
                                        data={{
                                            id: taskItem?._id,
                                            info: taskItem?.name
                                        }}
                                        func={handleDelete}
                                    /> */}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
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