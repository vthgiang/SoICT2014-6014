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
import { TaskAddModal } from '../../../task/task-management/component/taskAddModal';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { isEqual } from 'lodash';

const TabProjectTasksList = (props) => {
    const { translate, project, user, tasks, currentProjectTasks } = props;
    const userId = getStorage("userId");
    // const [projectDetail, setProjectDetail] = useState(getCurrentProjectDetails(project));
    let projectDetail = getCurrentProjectDetails(project);
    const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
    const parentTask = [];
    const [isTableType, setIsTableType] = useState(true);

    const handleOpenCreateProjectTask = () => {
        window.$(`#addNewProjectTask-undefined`).modal('show');
    }

    const handleOpenCreateTask = () => {
        window.$(`#addNewTask-undefined`).modal('show');
    }

    const onHandleReRender = () => {
        setTimeout(() => {
            window.$('#modal-add-task-schedule').modal('hide');
        }, 10);
        setTimeout(() => {
            props.getTasksByProject({ projectId: currentProjectId });
        }, 1000);
    }

    const onHandleOpenScheduleModal = () => {
        window.$('#modal-add-task-schedule').modal('show')
    }

    console.log('currentProjectTasks', currentProjectTasks)

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
                                props.getTasksByProject({projectId: currentProjectId});
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
                                checkIfAbleToCRUDProject({ project, user, currentProjectId, isInsideProject: true }) && currentProjectTasks && currentProjectTasks.length > 0 ? null :
                                (projectDetail && <ModalAddTaskSchedule projectDetail={projectDetail} onHandleReRender={onHandleReRender} />)
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
                            <>
                                <TaskProjectAddModal onHandleReRender={onHandleReRender} currentProjectTasks={currentProjectTasks} parentTask={parentTask} />
                                <button style={{ display: 'flex', marginTop: 15, marginRight: 10 }} type="button" className="btn btn-success" onClick={handleOpenCreateProjectTask}
                                    title={translate('task_template.add')}>
                                    {translate('task_template.add')}
                                </button>
                            </>
                        }
                    </div>
                </div>

                {isTableType ?
                    <TableTasksProject
                        currentProjectTasks={currentProjectTasks}
                    /> :
                    <GanttTasksProject currentProjectTasks={currentProjectTasks} />}

            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, changeRequest, user, tasks } = state;
    return { project, changeRequest, user, tasks }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getListProjectChangeRequestsDispatch: ChangeRequestActions.getListProjectChangeRequestsDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
    getAllDepartment: DepartmentActions.get,
    getDepartment: UserActions.getDepartmentOfUser,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectTasksList));