import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import TableTasksProject from './tableTasksProject';
import GanttTasksProject from './ganttTasksProject';
import KanbanTasksProject from './kanbanTasksProject';
import CpmTasksProject from './cpmTasksProject';
import { getStorage } from '../../../../config';
import { TaskAddModal } from '../../../task/task-management/component/taskAddModal';
import { checkIfAbleToCRUDProject, getCurrentProjectDetails } from './functionHelper';
import { taskManagementActions } from '../../../task/task-management/redux/actions';

const ProjectDetailPage = (props) => {
    const { translate, project, user, tasks } = props;
    const userId = getStorage("userId");
    const projectDetail = getCurrentProjectDetails(project);
    const currentProjectId = window.location.href.split('?id=')[1];

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all", userId });
        props.getAllUserInAllUnitsOfCompany();
        props.getTasksByProject(currentProjectId)
    }, [])

    const handleOpenCreateTask = () => {
        window.$(`#addNewProjectTask-undefined`).modal('show');
    }

    const currentProjectTasks = tasks?.tasksbyproject;
    const parentTask = [];

    return (
        <div>
            <TaskAddModal isProjectForm={true} currentProjectTasks={currentProjectTasks} parentTask={parentTask} />
            <div className="description-box" style={{ lineHeight: 1.5 }}>
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
                                    <span>{projectDetail ? formatDate(projectDetail?.startDate) : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.endDate')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail ? formatDate(projectDetail?.endDate) : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.estimatedCost')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail && projectDetail?.estimatedCost ? projectDetail?.estimatedCost : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
                </div>

                <div className="row">
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
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.unitTime')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail && projectDetail?.unitTime ? projectDetail?.unitTime : null}</span>
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
                </div>
            </div>

            <div className="nav-tabs-custom">
                <div style={{ flexDirection: 'row', display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    {/* Danh sách công việc dự án */}
                    <h3>{translate('project.list_tasks')}</h3>
                    {/* Button thêm mới */}
                    {checkIfAbleToCRUDProject({ project, user, currentProjectId }) &&
                        <div className="dropdown pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true"
                                onClick={handleOpenCreateTask} title={translate('project.add_btn_task')}>
                                {translate('project.add_btn_task')}
                            </button>
                        </div>}
                </div>
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#project-tasks-table" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Bảng</a></li>
                    <li><a href="#project-tasks-gantt" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Gantt</a></li>
                    <li><a href="#project-tasks-kanban" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Kanban</a></li>
                    <li><a href="#project-tasks-cpm" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>CPM</a></li>
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
                            <GanttTasksProject />
                        </LazyLoadComponent>
                    </div>

                    {/** Kanban công việc */}
                    <div className="tab-pane" id="project-tasks-kanban">
                        <LazyLoadComponent
                            key="KanbanTasksProject"
                        >
                            <KanbanTasksProject />
                        </LazyLoadComponent>
                    </div>

                    {/** CPM công việc */}
                    <div className="tab-pane" id="project-tasks-cpm">
                        <LazyLoadComponent
                            key="CPMTasksProject"
                        >
                            <CpmTasksProject />
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