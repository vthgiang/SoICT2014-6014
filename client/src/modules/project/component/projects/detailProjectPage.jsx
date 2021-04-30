import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { formatFullDate } from '../../../../helpers/formatDate';
import TableTasksProject from './tableTasksProject';
import GanttTasksProject from './ganttTasksProject';
import KanbanTasksProject from './kanbanTasksProject';
import CpmTasksProject from './cpmTasksProject';
import { getStorage } from '../../../../config';
import { TaskAddModal } from '../../../task/task-management/component/taskAddModal';
import { checkIfAbleToCRUDProject, getCurrentProjectDetails } from './functionHelper';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { TaskProjectAddModal } from '../../../task/task-management/component/taskProjectAddModal';
import ModalAddTaskSchedule from '../scheduling-projects/modalAddTaskSchedule';
import ProjectEditForm from './editProject';
import moment from 'moment';

const ProjectDetailPage = (props) => {
    const { translate, project, user, tasks } = props;
    const userId = getStorage("userId");
    // const [projectDetail, setProjectDetail] = useState(getCurrentProjectDetails(project));
    let projectDetail = getCurrentProjectDetails(project);
    const currentProjectId = window.location.href.split('?id=')[1];

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all", userId });
        props.getAllUserInAllUnitsOfCompany();
        props.getTasksByProject(currentProjectId);
    }, [])

    const handleOpenCreateTask = () => {
        window.$(`#addNewProjectTask-undefined`).modal('show');
    }

    const currentProjectTasks = tasks?.tasksbyproject;
    const parentTask = [];

    const onHandleReRender = () => {
        window.$('#modal-add-task-schedule').modal('hide');
        setTimeout(() => {
            props.getTasksByProject(currentProjectId);
        }, 1000);
    }

    const onHandleOpenScheduleModal = () => {
        window.$('#modal-add-task-schedule').modal('show')
    }

    const handleOpenEditProject = () => {
        setTimeout(() => {
            window.$(`#modal-edit-project-${currentProjectId}`).modal('show')
        }, 10);
    }

    const handleAfterCreateProject = async () => {
        await props.getProjectsDispatch({ calledId: "all", userId });
        await props.getTasksByProject(currentProjectId);
        console.log('project', project)
        projectDetail = getCurrentProjectDetails(project);
    }

    return (
        <div>
            <div className="description-box" style={{ lineHeight: 1.5 }}>
                {/* Button để edit project */}
                <div className="dropdown pull-right">
                    <ProjectEditForm
                        projectEditId={projectDetail && currentProjectId}
                        projectEdit={projectDetail}
                        handleAfterCreateProject={handleAfterCreateProject}
                    />
                    <button style={{paddingTop: 8}} onClick={handleOpenEditProject}>
                        <span className="material-icons">edit</span>
                    </button>
                </div>
                <h3 style={{ marginBottom: 15 }}>Thông số dự án</h3>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.name')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail ? projectDetail?.name : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.code')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail ? projectDetail?.code : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.startDate')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail ? moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY') : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.endDate')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail ? moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY') : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.manager')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail && projectDetail?.projectManager ? projectDetail?.projectManager.map(o => o.name).join(", ") : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.unitCost')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail && projectDetail?.unitCost ? projectDetail?.unitCost : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.member')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail && projectDetail?.responsibleEmployees ? projectDetail?.responsibleEmployees.map(o => o.name).join(", ") : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.unitTime')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail && projectDetail?.unitTime ? translate(`project.unit.${projectDetail?.unitTime}`) : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="nav-tabs-custom">
                <div style={{ flexDirection: 'row', display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    {/* Danh sách công việc dự án */}
                    <h3>{translate('project.list_tasks')}</h3>
                    {/* Button thêm mới */}
                    {checkIfAbleToCRUDProject({ project, user, currentProjectId }) &&
                        <div className="dropdown pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                            {currentProjectTasks && currentProjectTasks.length > 0 ? null : <ModalAddTaskSchedule projectDetail={projectDetail} onHandleReRender={onHandleReRender} />}
                            {currentProjectTasks && currentProjectTasks.length > 0
                                &&
                                <TaskProjectAddModal onHandleReRender={onHandleReRender} currentProjectTasks={currentProjectTasks} parentTask={parentTask} />}

                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true"
                                title={translate('project.add_btn_task')}>
                                {translate('project.add_btn_task')}
                            </button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                {
                                    currentProjectTasks && currentProjectTasks.length === 0
                                    &&
                                    <li><a style={{ cursor: 'pointer' }} onClick={onHandleOpenScheduleModal} title={translate('project.add_btn_scheduling')}>
                                        {translate('project.add_btn_scheduling')}</a></li>
                                }
                                {
                                    currentProjectTasks && currentProjectTasks.length === 0 ? null :
                                        <li><a style={{ cursor: 'pointer' }} onClick={handleOpenCreateTask} title={translate('project.add_btn_normal')}>
                                            {translate('project.add_btn_normal')}</a></li>
                                }

                            </ul>
                        </div>}
                </div>
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#project-tasks-table" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Bảng</a></li>
                    <li><a href="#project-tasks-gantt" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Gantt</a></li>
                </ul>
                <div className="tab-content">

                    {/** Table công việc */}
                    <div className="tab-pane active" id="project-tasks-table">
                        <LazyLoadComponent
                            key="TableTasksProject"
                        >
                            <TableTasksProject currentProjectTasks={currentProjectTasks} />
                        </LazyLoadComponent>
                    </div>

                    {/** Gantt công việc */}
                    <div className="tab-pane" id="project-tasks-gantt">
                        <LazyLoadComponent
                            key="GanttTasksProject"
                        >
                            <GanttTasksProject currentProjectTasks={currentProjectTasks} />
                        </LazyLoadComponent>
                    </div>

                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { project, user, tasks } = state;
    return { project, user, tasks }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectDetailPage));