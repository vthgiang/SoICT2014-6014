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
import ModalAddTaskSchedule from '../scheduling-projects/modalAddTaskSchedule';
import ProjectEditForm from './editProject';
import moment from 'moment';
import { TaskProjectAddModal } from '../../../task/task-project/component/taskProjectAddModal';
import TabProjectInfo from './tabProjectInfo';
import TabChangeRequestProject from './tabChangeRequestProject';

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
        setTimeout(() => {
            window.$('#modal-add-task-schedule').modal('hide');
        }, 10);
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
        // console.log('project', project)
        projectDetail = getCurrentProjectDetails(project);
    }

    return (
        <div>
            <div className="description-box" style={{ lineHeight: 1.5 }}>
                {/* Button để edit project */}
                <div className="dropdown pull-right">
                    <ProjectEditForm
                        currentProjectTasks={currentProjectTasks}
                        projectEditId={projectDetail && currentProjectId}
                        projectEdit={projectDetail}
                        handleAfterCreateProject={handleAfterCreateProject}
                    />
                    <button style={{ paddingTop: 8 }} onClick={handleOpenEditProject}>
                        <span className="material-icons">edit</span>
                    </button>
                </div>
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#project-details-info" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Thông tin dự án</a></li>
                    <li><a href="#project-details-change-request" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Yêu cầu thay đổi</a></li>
                </ul>
                <div className="tab-content">
                    {/** Thông tin dự án */}
                    <div className="tab-pane active" id="project-details-info">
                        <LazyLoadComponent
                            key="TabProjectInfo"
                        >
                            <TabProjectInfo projectDetail={projectDetail} />
                        </LazyLoadComponent>
                    </div>
                    {/** Yêu cầu thay đổi */}
                    <div className="tab-pane" id="project-details-change-request">
                        <LazyLoadComponent
                            key="TabChangeRequestProject"
                        >
                            <TabChangeRequestProject />
                        </LazyLoadComponent>
                    </div>

                </div>
            </div>

            <div className="box">
                <div className="box-body qlcv">
                    <div className="nav-tabs-custom">
                        <div style={{ flexDirection: 'row', display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            {/* Danh sách công việc dự án */}
                            <h3>{translate('project.list_tasks')}</h3>
                            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'flex-end' }}>
                                {/* Button refresh danh sách tasks */}
                                <div className="pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                                    <button title="Tải lại danh sách công việc" type="button" className="pull-right"
                                        style={{ display: 'flex', height: 35, justifyContent: 'center', alignItems: 'center' }}
                                        onClick={() => props.getTasksByProject(currentProjectId)}
                                    >
                                        <span className="material-icons">refresh</span>
                                    </button>
                                </div>
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
                                    </div>
                                }
                            </div>
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