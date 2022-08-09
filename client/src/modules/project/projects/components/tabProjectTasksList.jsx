import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../redux/actions';
import { ProjectPhaseActions } from '../../project-phase/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions';
import TableTasksProject from './tableTasksProject';
import GanttTasksProject from './ganttTasksProject';
import { getStorage } from '../../../../config';
import { checkIfAbleToCRUDProject, getCurrentProjectDetails } from './functionHelper';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import ModalAddTaskSchedule from '../../scheduling-projects/components/modalAddTaskSchedule';
import ProjectEditForm from './editProject';
import PhaseCreateForm from '../../project-phase/components/createPhase';
import {MilestoneCreateForm} from '../../project-phase/components/createMilestone';
import moment from 'moment';
import { TaskProjectAddModal } from '../../../task/task-project/component/taskProjectAddModal';
import TabProjectInfo from './tabProjectInfo';
import TabChangeRequestProject from './tabChangeRequestProject';
import { ChangeRequestActions } from '../../change-requests/redux/actions';
import { TaskAddModal } from '../../../task/task-management/component/taskAddModal';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { isEqual } from 'lodash';

const TabProjectTasksList = (props) => {
    const { translate, project, user, tasks, currentProjectTasks, currentProjectPhase, currentProjectMilestone } = props;
    const userId = getStorage("userId");
    // const [projectDetail, setProjectDetail] = useState(getCurrentProjectDetails(project));
    let projectDetail = getCurrentProjectDetails(project);
    const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
    const parentTask = [];
    const [isTableType, setIsTableType] = useState(true);

    const handleOpenCreateProjectTask = () => {
        window.$(`#addNewProjectTask-undefined`).modal('show');
    }

    const handleOpenCreateProjectPhase = () => {
        window.$(`#modal-create-project-phase-${currentProjectId}`).modal('show');
    }

    const handleOpenCreateProjectMilestone = () => {
        window.$(`#modal-create-project-milestone-${currentProjectId}`).modal('show');
    }

    const handleOpenCreateTask = () => {
        window.$(`#addNewTask-undefined`).modal('show');
    }

    const onHandleReRender = () => {
        setTimeout(() => {
            window.$('#modal-add-task-schedule').modal('hide');
        }, 10);
        setTimeout(() => {
            props.getAllTasksByProject(currentProjectId);
            props.getAllPhaseByProject(currentProjectId);
            props.getAllMilestoneByProject(currentProjectId);
        }, 1000);
    }

    const onHandleOpenScheduleModal = () => {
        window.$('#modal-add-task-schedule').modal('show')
    }

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div className="box-tools" style={{ marginLeft: 10 }}>
                        <div className="btn-group">
                            <button type="button" className={`btn btn-xs ${isTableType ? 'btn-danger' : "active"}`} onClick={() => setIsTableType(true)}>Bảng</button>
                            <button type="button" className={`btn btn-xs ${isTableType ? "active" : "btn-danger"}`} onClick={() => {
                                // props.getTasksByProject(currentProjectId);
                                // props.getTasksByProject(currentProjectId, 1, 6);
                                setIsTableType(false);
                            }}>Biểu đồ Gantt</button>
                        </div>
                    </div>
                    <div style={{ flexDirection: 'row', display: 'flex' }}>

                        {/* Button refresh danh sách tasks */}
                        <button style={{ paddingTop: 5, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', marginTop: 15, marginRight: 10 }}
                            onClick={() => {
                                props.getAllTasksByProject(currentProjectId);
                                props.getAllPhaseByProject(currentProjectId);
                                props.getAllMilestoneByProject(currentProjectId);
                            }}
                        >
                            <span className="material-icons">refresh</span>
                        </button>

                        {/* Button thêm mới */}
                        {
                            projectDetail?.projectType === 1 &&
                            <TaskAddModal onHandleReRender={onHandleReRender} projectId={projectDetail._id} />
                        }
                        {
                            projectDetail?.projectType === 1 &&
                            <button style={{ display: 'flex', marginTop: 15, marginRight: 10 }} type="button" className="btn btn-success" onClick={handleOpenCreateTask}
                                title={translate('task_template.add')}>
                                {translate('task_template.add')}
                            </button>
                        }
                        {
                            projectDetail?.projectType === 2 &&
                            checkIfAbleToCRUDProject({ project, user, currentProjectId, isInsideProject: true }) && currentProjectTasks && currentProjectTasks.length === 0 &&
                            projectDetail && <ModalAddTaskSchedule projectDetail={projectDetail} onHandleReRender={onHandleReRender} />
                        }
                        {
                            projectDetail?.projectType === 2 &&
                            checkIfAbleToCRUDProject({ project, user, currentProjectId, isInsideProject: true }) && currentProjectTasks && currentProjectTasks.length === 0 &&
                            <button style={{ display: 'flex', marginTop: 15, marginRight: 10 }} type="button" className="btn btn-success" onClick={onHandleOpenScheduleModal}
                                title={translate('task_template.import')}>
                                {translate('task_template.import')}
                            </button>
                        }
                        {
                            projectDetail?.projectType === 2 &&
                            currentProjectTasks && currentProjectTasks.length > 0 &&
                            <div>
                                <PhaseCreateForm currentProjectTasks={currentProjectTasks} projectId={currentProjectId} />
                                <TaskProjectAddModal onHandleReRender={onHandleReRender} currentProjectTasks={currentProjectTasks} currentProjectPhase={currentProjectPhase} parentTask={parentTask} />
                                <MilestoneCreateForm currentProjectTasks={currentProjectTasks} projectId={currentProjectId} currentProjectPhase={currentProjectPhase} />
                                <div className="dropdown">
                                    <button type="button" style={{ display: 'flex', marginTop: 15, marginRight: 10 }} className="btn btn-success dropdown-toggler" data-toggle="dropdown" aria-expanded="true" title='Thêm'>{translate('task_template.add')}</button>
                                    {
                                        checkIfAbleToCRUDProject({ project, user, currentProjectId, isInsideProject: true }) ?
                                            <ul className="dropdown-menu pull-right">
                                                <li><a href="#" title={translate('project.task_management.add_task')} onClick={handleOpenCreateProjectTask}>{translate('project.task_management.add_task')}</a></li>
                                                <li><a href="#" title={translate('project.task_management.add_phase')} onClick={handleOpenCreateProjectPhase}>{translate('project.task_management.add_phase')}</a></li>
                                                <li><a href="#" title={translate('project.task_management.add_milestone')} onClick={handleOpenCreateProjectMilestone}>{translate('project.task_management.add_milestone')}</a></li> 
                                            </ul>
                                            : <ul className="dropdown-menu pull-right">
                                                <li><a href="#" title={translate('project.task_management.add_task')} onClick={handleOpenCreateProjectTask}>{translate('project.task_management.add_task')}</a></li>
                                            </ul>

                                    }

                                </div>

                            </div>
                        }
                    </div>
                </div>

                {isTableType ?
                    <TableTasksProject
                        currentProjectTasks={currentProjectTasks}
                        currentProjectPhase={currentProjectPhase}
                        projectDetail={projectDetail}
                        currentProjectMilestone={currentProjectMilestone}
                    /> :
                    <GanttTasksProject 
                        currentProjectTasks={currentProjectTasks} 
                        currentProjectPhase={currentProjectPhase} 
                        projectDetail={projectDetail} 
                        currentProjectMilestone={currentProjectMilestone}
                    />}

            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, changeRequest, user, tasks, projectPhase } = state;
    return { project, changeRequest, user, tasks, projectPhase }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getListProjectChangeRequestsDispatch: ChangeRequestActions.getListProjectChangeRequestsDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllTasksByProject: taskManagementActions.getAllTasksByProject,
    getAllPhaseByProject: ProjectPhaseActions.getAllPhaseByProject,
    getAllMilestoneByProject: ProjectPhaseActions.getAllMilestoneByProject,
    getAllDepartment: DepartmentActions.get,
    getDepartment: UserActions.getDepartmentOfUser,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectTasksList));