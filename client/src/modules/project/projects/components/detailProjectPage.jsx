import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import TableTasksProject from './tableTasksProject';
import GanttTasksProject from './ganttTasksProject';
import { getStorage } from '../../../../config';
import { checkIfAbleToCRUDProject, getCurrentProjectDetails } from './functionHelper';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import ModalAddTaskSchedule from '../../scheduling-projects/components/modalAddTaskSchedule';
import ProjectEditForm from './editProject';
import moment from 'moment';
import { TaskProjectAddModal } from '../../../task/task-project/component/taskProjectAddModal';
import TabProjectInfo from './tabProjectInfo';
import TabChangeRequestProject from './tabChangeRequestProject';
import { ChangeRequestActions } from '../../change-requests/redux/actions';

const ProjectDetailPage = (props) => {
    const { translate, project, user, tasks } = props;
    const userId = getStorage("userId");
    // const [projectDetail, setProjectDetail] = useState(getCurrentProjectDetails(project));
    let projectDetail = getCurrentProjectDetails(project);
    const currentProjectId = window.location.href.split('?id=')[1];

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "user_all", userId });
        props.getAllUserInAllUnitsOfCompany();
        props.getTasksByProject(currentProjectId);
        props.getListProjectChangeRequestsDispatch(currentProjectId);
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
        await props.getProjectsDispatch({ calledId: "user_all", userId });
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
                    {/* Button chỉnh sửa thông tin dự án */}
                    <button title="Chỉnh sửa thông tin dự án" style={{ paddingTop: 8 }} onClick={handleOpenEditProject}>
                        <span className="material-icons">edit</span>
                    </button>
                    {/* Button refresh thông tin dự án */}
                    <button title="Tải lại thông tin"
                        style={{ paddingTop: 8, marginRight: 8 }}
                        onClick={() => {
                            props.getTasksByProject(currentProjectId);
                            props.getListProjectChangeRequestsDispatch(currentProjectId);
                        }}
                    >
                        <span className="material-icons">refresh</span>
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
                            <TabProjectInfo projectDetail={projectDetail} currentProjectTasks={currentProjectTasks} />
                        </LazyLoadComponent>
                    </div>
                    {/** Yêu cầu thay đổi */}
                    <div className="tab-pane" id="project-details-change-request">
                        <LazyLoadComponent
                            key="TabChangeRequestProject"
                        >
                            <TabChangeRequestProject currentProjectTasks={currentProjectTasks} />
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
                                {
                                    checkIfAbleToCRUDProject({ project, user, currentProjectId }) && currentProjectTasks && currentProjectTasks.length > 0 ? null :
                                        (projectDetail && <ModalAddTaskSchedule projectDetail={projectDetail} onHandleReRender={onHandleReRender} />)
                                }
                                {
                                    checkIfAbleToCRUDProject({ project, user, currentProjectId }) && currentProjectTasks && currentProjectTasks.length === 0 &&
                                    <button type="button" className="btn btn-success pull-right" onClick={onHandleOpenScheduleModal}
                                        title={`Tạo công việc mới bằng file excel`}>
                                        Tạo công việc mới bằng file excel
                                    </button>
                                }
                                {
                                    currentProjectTasks && currentProjectTasks.length > 0 &&
                                    <TaskProjectAddModal onHandleReRender={onHandleReRender} currentProjectTasks={currentProjectTasks} parentTask={parentTask} />
                                }
                                {
                                    currentProjectTasks && currentProjectTasks.length > 0 &&
                                    <button type="button" className="btn btn-success pull-right" onClick={handleOpenCreateTask}
                                        title={`Tạo công việc mới bằng tay`}>
                                        Tạo công việc mới bằng tay
                                    </button>
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
    getListProjectChangeRequestsDispatch: ChangeRequestActions.getListProjectChangeRequestsDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectDetailPage));