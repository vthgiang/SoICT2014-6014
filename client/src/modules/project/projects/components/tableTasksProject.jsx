import React, { useState, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, ExportExcel, DeleteNotification, ToolTip } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectTreeTable } from '../components/projectTreeTable.jsx'
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import { ProjectPhaseActions} from '../../project-phase/redux/actions'
import PhaseEditForm from '../../project-phase/components/editPhase.jsx'
import DetailPhase from '../../project-phase/components/detailPhase.jsx'
import { UserActions } from '../../../super-admin/user/redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { getStorage } from '../../../../config';
import { formatTaskStatus, getCurrentProjectDetails, renderProgressBar, renderStatusColor, convertPriorityData, checkIfAbleToCRUDProject, renderLongList, renderProjectTypeText } from './functionHelper';
import { performTaskAction } from '../../../task/task-perform/redux/actions';
import Swal from 'sweetalert2';
import { ModalPerform } from '../../../task/task-perform/component/modalPerform';
import { ModalDetailTask } from '../../../task/task-dashboard/task-personal-dashboard/modalDetailTask';
import { MilestoneEditForm } from '../../project-phase/components/editMilestone';
import DetailMilestone from '../../project-phase/components/detailMilestone';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import moment from 'moment';
import { getTotalTimeSheetLogs } from '../../../task/task-management/component/functionHelpers';
import _cloneDeep from 'lodash/cloneDeep';

const TableTasksProject = (props) => {
    const tableId = "tasks-project-table";
    const defaultConfig = { limit: 5, hiddenColumns: ['2','5','6','10'] };
    const limit = getTableConfiguration(tableId, defaultConfig).limit;
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
        taskType: ['task', 'phase', 'milestone'],
        currentTaskId: '',
        currentPhaseId: '',
        currentPhase: {},
        currentMilestoneId: '',
        currentMilestone: {},
    })
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(limit || defaultConfig.limit);
    const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
    const userId = getStorage('userId');
    const { translate, currentProjectTasks, user, project, performtasks, tasks, projectPhase, currentProjectPhase,
        currentProjectMilestone, projectDetail } = props;
    const { status, name, priority, startDate, endDate, responsibleEmployees, accountableEmployees, currentMilestone, currentMilestoneId,
        creatorEmployees, taskType, preceedingTasks, data, currentTaskId, currentPhaseId, currentPhase } = state;
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

    // useEffect(() => {
    //     window.$(`#modelPerformTask${currentTaskId}`).modal('show')
    // }, [currentTaskId])

    // Khi có thay đổi công việc trong dự án cpm thì cập nhật lại
    useEffect(() => {
        let data = [];
        if (!tasks?.isLoading && !user?.isLoading && !performtasks?.isLoading && !tasks?.isProjectPaginateLoading 
            && !projectPhase.isLoading) {
            let currentTasks = _cloneDeep(tasks.tasks); // Sao chép ra mảng mới
            let phases = _cloneDeep(projectPhase?.phases);
            let milestones = _cloneDeep(projectPhase?.milestones)
            if (taskType.includes('task')) {
                phases = processProjectPhase(currentTasks);
                milestones = processProjectMilestone(currentTasks);
            }
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
                    startDate: moment(currentTasks[n]?.startDate).format('HH:mm DD/MM/YYYY') || '',
                    endDate: moment(currentTasks[n]?.endDate).format('HH:mm DD/MM/YYYY') || '',
                    actualEndDate: currentTasks[n]?.actualEndDate && moment(currentTasks[n]?.actualEndDate).format('HH:mm DD/MM/YYYY') || '',
                    timesheetLogs: getTotalTimeSheetLogs(currentTasks[n]?.timesheetLogs),
                    progress: renderProgressBar(currentTasks[n]?.progress, currentTasks[n]),
                    parent: currentTasks[n].taskPhase ? currentTasks[n].taskPhase : null,
                    type: 'task',
                    action: ["edit", "view"]
                }

                // Kiểm tra xem người dùng có quyền bấm giờ
                if (currentTasks[n].responsibleEmployees && currentTasks[n].responsibleEmployees.find(e => e._id === userId) || currentTasks[n].accountableEmployees && currentTasks[n].accountableEmployees.find(e => e._id === userId)) {
                    data[n] = { ...data[n], action: ["edit", "view", "startTimer"] }
                }
            }

            for (let m in phases) {
                phases[m]= {
                    ...phases[m],
                    rawData: phases[m],
                    name: phases[m]?.name,
                    priority: null,
                    preceedingTask: null,
                    responsibleEmployees: null,
                    accountableEmployees: null,
                    creatorEmployees: phases[m].creator ? phases[m].creator.name : null,
                    status: <div style={{ color: renderStatusColor(phases[m]) }}>{formatTaskStatus(translate, phases[m]?.status)}</div>,
                    startDate: moment(phases[m]?.startDate).format('HH:mm DD/MM/YYYY') || '',
                    endDate: moment(phases[m]?.endDate).format('HH:mm DD/MM/YYYY') || '',
                    actualEndDate: phases[m]?.actualEndDate && moment(phases[m]?.actualEndDate).format('HH:mm DD/MM/YYYY') || '',
                    timesheetLogs: null,
                    progress: renderProgressBar(phases[m]?.progress, phases[m]),
                    parent: null,
                    type: 'phase',
                    action: ["view"],
                }

                if(checkIfAbleToCRUDProject({ project, user, currentProjectId })) {
                    phases[m] = { ...phases[m], action: ["view", "edit", "delete"] }
                }

                data.push(phases[m]);
            }

            for (let k in milestones) {
                milestones[k]= {
                    ...milestones[k],
                    rawData: milestones[k],
                    name: milestones[k]?.name,
                    priority: convertPriorityData(milestones[k].priority, translate),
                    preceedingTask: processPreceedingTasks(milestones[k]?.preceedingTasks),
                    responsibleEmployees: milestones[k]?.responsibleEmployees?.length > 0 ? <ToolTip dataTooltip={milestones[k]?.responsibleEmployees.map(o => o.name)} /> : null,
                    accountableEmployees: milestones[k]?.accountableEmployees?.length > 0 ? <ToolTip dataTooltip={milestones[k]?.accountableEmployees.map(o => o.name)} /> : null,
                    creatorEmployees: milestones[k].creator ? milestones[k].creator.name : null,
                    status: <div style={{ color: renderStatusColor(milestones[k]) }}>{formatTaskStatus(translate, milestones[k]?.status)}</div>,
                    startDate: moment(milestones[k]?.startDate).format('HH:mm DD/MM/YYYY') || '',
                    endDate: moment(milestones[k]?.endDate).format('HH:mm DD/MM/YYYY') || '',
                    actualEndDate: milestones[k]?.actualEndDate && moment(milestones[k]?.actualEndDate).format('HH:mm DD/MM/YYYY') || '',
                    timesheetLogs: null,
                    progress: renderProgressBar(milestones[k]?.progress, milestones[k]),
                    parent: milestones[k].projectPhase ? milestones[k].projectPhase : null,
                    type: 'milestone',
                    action: ["view"],
                }

                if(checkIfAbleToCRUDProject({ project, user, currentProjectId })) {
                    milestones[k] = { ...milestones[k], action: ["view", "edit", "delete"] }
                }

                else if (milestones[k].accountableEmployees && milestones[k].accountableEmployees.filter(o => o._id === userId).length > 0) {
                    milestones[k] = { ...milestones[k], action: ["view", "edit"] }
                }

                data.push(milestones[k]);
            }

            setState({
                ...state,
                data: data
            })
        }
    }, [performtasks?.isLoading, projectPhase?.isLoading, tasks?.isLoading, user?.isLoading, tasks?.isProjectPaginateLoading, JSON.stringify(props?.tasks?.tasksByProjectPaginate),
         JSON.stringify(props?.project?.data?.list), JSON.stringify(projectPhase?.phases), JSON.stringify(tasks?.tasks), taskType, JSON.stringify(projectPhase.milestones)]);

    // Khi gọi hàm lấy toàn bộ công việc, cập nhật lại bảng
    // useEffect(() => {
    //     let data = [];
    //     if (!tasks?.isLoading && ! projectPhase.isLoading) {
    //         let currentTasks = _cloneDeep(tasks.tasks); // Sao chép ra mảng mới
    //         let currentTaskIds = currentTasks.map(task => {
    //             return task._id;
    //         })
    //         currentTasks = tasks.tasksByProject.filter(item => currentTaskIds.includes(item._id)) ;
    //         let phases = _cloneDeep(projectPhase.phases);
    //         if (taskType.includes('task')) {
    //             phases = processProjectPhase(currentTasks);
    //         }
    //         for (let n in currentTasks) {

    //             data[n] = {
    //                 ...currentTasks[n],
    //                 rawData: currentTasks[n],
    //                 name: currentTasks[n]?.name,
    //                 priority: convertPriorityData(currentTasks[n].priority, translate),
    //                 preceedingTask: processPreceedingTasks(currentTasks[n]?.preceedingTasks),
    //                 responsibleEmployees: currentTasks[n]?.responsibleEmployees?.length > 0 ? <ToolTip dataTooltip={currentTasks[n]?.responsibleEmployees.map(o => o.name)} /> : null,
    //                 accountableEmployees: currentTasks[n]?.accountableEmployees?.length > 0 ? <ToolTip dataTooltip={currentTasks[n]?.accountableEmployees.map(o => o.name)} /> : null,
    //                 creatorEmployees: currentTasks[n].creator ? currentTasks[n].creator.name : null,
    //                 status: <div style={{ color: renderStatusColor(currentTasks[n]) }}>{formatTaskStatus(translate, currentTasks[n]?.status)}</div>,
    //                 startDate: moment(currentTasks[n]?.startDate).format('HH:mm DD/MM/YYYY') || '',
    //                 endDate: moment(currentTasks[n]?.endDate).format('HH:mm DD/MM/YYYY') || '',
    //                 actualEndDate: currentTasks[n]?.actualEndDate && moment(currentTasks[n]?.actualEndDate).format('HH:mm DD/MM/YYYY') || '',
    //                 timesheetLogs: getTotalTimeSheetLogs(currentTasks[n]?.timesheetLogs),
    //                 progress: renderProgressBar(currentTasks[n]?.progress, currentTasks[n]),
    //                 parent: currentTasks[n].taskPhase ? currentTasks[n].taskPhase : null,
    //                 type: 'task',
    //                 action: ["edit"]
    //             }

    //             // Kiểm tra xem người dùng có quyền bấm giờ
    //             if (currentTasks[n].responsibleEmployees && currentTasks[n].responsibleEmployees.find(e => e._id === userId) || currentTasks[n].accountableEmployees && currentTasks[n].accountableEmployees.find(e => e._id === userId)) {
    //                 data[n] = { ...data[n], action: ["edit", "startTimer"] }
    //             }
    //         }

    //         for (let m in phases) {
    //             phases[m]= {
    //                 ...phases[m],
    //                 rawData: phases[m],
    //                 name: phases[m]?.name,
    //                 priority: null,
    //                 preceedingTask: null,
    //                 responsibleEmployees: null,
    //                 accountableEmployees: null,
    //                 creatorEmployees: phases[m].creator ? phases[m].creator.name : null,
    //                 status: <div style={{ color: renderStatusColor(phases[m]) }}>{formatTaskStatus(translate, phases[m]?.status)}</div>,
    //                 startDate: moment(phases[m]?.startDate).format('HH:mm DD/MM/YYYY') || '',
    //                 endDate: moment(phases[m]?.endDate).format('HH:mm DD/MM/YYYY') || '',
    //                 actualEndDate: phases[m]?.actualEndDate && moment(phases[m]?.actualEndDate).format('HH:mm DD/MM/YYYY') || '',
    //                 timesheetLogs: null,
    //                 progress: renderProgressBar(phases[m]?.progress, phases[m]),
    //                 parent: null,
    //                 type: 'phase',
    //                 action: ["view"],
    //             }

    //             if(checkIfAbleToCRUDProject({ project, user, currentProjectId })) {
    //                 phases[m] = { ...phases[m], action: ["view", "edit", "delete"] }
    //             }

    //             data.push(phases[m]);
    //         }

    //         setState({
    //             ...state,
    //             data: data
    //         })
    //     }
    // }, [JSON.stringify(tasks.tasksByProject), tasks.isLoading, projectPhase.isLoading])


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

    // Kiểm tra những phase nào có ít nhất 1 công việc trong bảng
    const processProjectPhase = (taskList) => {
        let result = []
        if (!currentProjectPhase || currentProjectPhase?.length === 0 || taskList?.length === 0 || !taskList) result = [] ;
        else result = currentProjectPhase?.filter(phase => taskList.find(task => task.taskPhase === phase._id));
        return result
    }

    // Kiểm tra những milestone có công việc tiền nhiệm ở trong bảng
    const processProjectMilestone = (taskList) => {
        let listTaskId = taskList.map(task => {
            return task._id;
        })
        let result = []
        if (!currentProjectMilestone || currentProjectMilestone?.length === 0 || taskList?.length === 0 || !taskList) result = [] ;
        else result = currentProjectMilestone?.filter(milestone => milestone.preceedingTasks.find(taskItem => listTaskId.includes(taskItem.task)));
        return result
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
            status: value,
        });
    }

    const handleSelectPriority = (value) => {
        setState({
            ...state,
            priority: value
        });
    }

    const handleSelectTaskType = (value) => {
        setState({
            ...state,
            taskType: value
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
        setState(state => {
            return {
                ...state,
                currentTaskId: id
            }
        })

        setTimeout(() => {
            // window.$(`#modelPerformTask${currentTaskId}`).modal('show')
            window.$(`#modelPerformTask${id}`).modal('show')
        }, 500);
    }

    const handleViewTaskInfo = (id) => {
        if (currentTaskId !== id ) props.getTaskById(id);
        setState(state => {
            return {
                ...state,
                currentTaskId: id
            }
        })

        setTimeout(() => {
            // window.$(`#modelPerformTask${currentTaskId}`).modal('show')
            window.$(`#modal-detail-task-Employee`).modal('show');
        }, 500);
    }

    // Xem thông tin giai đoạn
    const handleViewPhaseInfo = (id) => {
        setState(state => {
            return {
                ...state,
                currentPhaseId: id,
                currentPhase: currentProjectPhase.find(phase => phase._id === id),
            }
        })

        setTimeout(() => {
            // window.$(`#modelPerformTask${currentTaskId}`).modal('show')
            window.$(`#modal-show-detail-phase-${id}`).modal('show')
        }, 500);
    }

    // Xoá 1 giai đoạn
    const handleDeletePhase = (id) => {
        // Hàm xóa một giai đoạn theo id
        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa giai đoạn đã chọn?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: props.translate('general.no'),
            confirmButtonText: props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.deletePhaseById(id);
            }
        })  
    }

    // Sửa thông tin giai đoạn
    const handleEditPhase = (id) => {
        setState(state => {
            return {
                ...state,
                currentPhaseId: id,
                currentPhase: currentProjectPhase.find(phase => phase._id === id),
            }
        })

        setTimeout(() => {
            // window.$(`#modelPerformTask${currentTaskId}`).modal('show')
            window.$(`#modal-edit-phase-${id}`).modal('show')
        }, 500);
    }

    // Sửa thông tin cột mốc
    const handleViewMilestone = (id) => {
        setState(state => {
            return {
                ...state,
                currentMilestoneId: id,
                currentMilestone: currentProjectMilestone.find(milestone => milestone._id === id),
            }
        })

        setTimeout(() => {
            // window.$(`#modelPerformTask${currentTaskId}`).modal('show')
            window.$(`#modal-show-detail-milestone-${id}`).modal('show')
        }, 500);
    }

    // Xem thông tin cột mốc
    const handleEditMilestone = (id) => {
        setState(state => {
            return {
                ...state,
                currentMilestoneId: id,
                currentMilestone: currentProjectMilestone.find(milestone => milestone._id === id),
            }
        })

        setTimeout(() => {
            // window.$(`#modelPerformTask${currentTaskId}`).modal('show')
            window.$(`#modal-edit-milestone-${id}`).modal('show')
        }, 500);
    }

    // Xoá 1 cột mốc
    const handleDeleteMilestone = (id) => {
        // Hàm xóa một cột mốc theo id
        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa cột mốc đã chọn?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: props.translate('general.no'),
            confirmButtonText: props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.deleteMilestoneById(id);
            }
        })  
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
            {<ModalDetailTask action={'Employee'} task={props.tasks.task} />}
            {
                currentTaskId && <ModalPerform
                    units={units}
                    id={currentTaskId}
                />
            }

            {
                currentPhaseId && <PhaseEditForm
                    phaseEdit={currentPhase}
                    phaseEditId={currentPhaseId}
                    currentProjectTasks={currentProjectTasks}
                    currentProjectMilestone={currentProjectMilestone}
                />
            }

            {
                currentPhaseId && <DetailPhase
                    phaseId={currentPhaseId}
                    currentProjectTasks={currentProjectTasks}
                    projectDetail={projectDetail}
                    projectDetailId={projectDetail._id}
                    phase={currentPhase}
                />
            }

            {
                currentMilestoneId && <MilestoneEditForm
                    milestoneEdit={currentMilestone}
                    milestoneEditId={currentMilestoneId}
                    currentProjectTasks={currentProjectTasks}
                    currentProjectPhase={currentProjectPhase}
                />
            }

            {
                currentMilestoneId && <DetailMilestone
                    milestoneId={currentMilestoneId}
                    currentProjectTasks={currentProjectTasks}
                    projectDetail={projectDetail}
                    projectDetailId={projectDetail._id}
                    milestone={currentMilestone}
                />
            }

            <div className="box">
                <div className="box-body qlcv">
                    <div style={{ height: "40px", display: 'flex', justifyContent: 'space-between' }}>
                        {/* Lọc */}
                        <div>
                            <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} onClick={() => { window.$('#tasks-project-filter').slideToggle() }}><i className="fa fa-filter"></i>{translate('general.filter')}</button>
                        </div>

                    </div>

                    {/* Lọc công việc theo các tiêu chí */}
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

                        {/* Loại công việc */}
                        <div className="form-group">
                            <label>{translate('project.task_management.type')}</label>
                            <SelectMulti id="multiSelectType" defaultValue={[
                                translate('project.task_management.task'),
                                translate('project.task_management.phase'),
                                translate('project.task_management.milestone'),
                            ]}
                                value={taskType}
                                items={[
                                    { value: "task", text: translate('project.task_management.task') },
                                    { value: "phase", text: translate('project.task_management.phase') },
                                    { value: "milestone", text: translate('project.task_management.milestone') },
                                ]}
                                onChange={handleSelectTaskType}
                                options={{ nonSelectedText: translate('project.task_management.select_type'), allSelectedText: translate('project.task_management.select_all_type') }}>
                            </SelectMulti>
                        </div>

                        <div className="form-row" >
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={() => handleUpdateData()}>{translate('project.search')}</button>
                        </div>

                    </div>

                    {/* Danh sách công việc */}
                    <div className="qlcv StyleScrollDiv StyleScrollDiv-y" style={{ maxHeight: '600px' }}>
                        <ProjectTreeTable
                            behaviour="show-children"
                            tableSetting={true}
                            tableId={tableId}
                            viewWhenClickName={true}
                            column={column}
                            data={data.filter(task => state.taskType.includes(task.type))}
                            onSetNumberOfRowsPerPage={setLimit}
                            titleAction={{
                                edit: translate('task.task_management.action_edit'),
                                startTimer: translate('task.task_management.action_start_timer'),
                            }}
                            funcEditTask={handleShowDetailInfo}
                            funcViewTask={handleViewTaskInfo}
                            funcEditPhase={handleEditPhase}
                            funcStartTimer={startTimer}
                            funcViewPhase={handleViewPhaseInfo}
                            funcDeletePhase={handleDeletePhase}
                            funcEditMilestone={handleEditMilestone}
                            funcViewMilestone={handleViewMilestone}
                            funcDeleteMilestone={handleDeleteMilestone}
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
    const { project, user, tasks, performtasks, projectPhase } = state;
    return { project, user, tasks, performtasks, projectPhase }
}

const mapDispatchToProps = {
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
    getAllPhaseByProject: ProjectPhaseActions.getAllPhaseByProject,
    getTaskById: performTaskAction.getTaskById,
    deletePhaseById: ProjectPhaseActions.deletePhase,
    deleteMilestoneById: ProjectPhaseActions.deleteMilestone,
    deleteTaskById: taskManagementActions._delete,
    startTimer: performTaskAction.startTimerTask,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TableTasksProject));
// export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(
//     memo(TableTasksProject, (prev, next) => {
//         return prev.tasks.tasksByProject === next.tasks.tasksByProject
//     })
// ));