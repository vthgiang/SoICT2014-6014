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
import TabProjectTasksList from './tabProjectTasksList';

const ProjectDetailPage = (props) => {
    const { translate, project, user, tasks } = props;
    const userId = getStorage("userId");
    // const [projectDetail, setProjectDetail] = useState(getCurrentProjectDetails(project));
    let projectDetail = getCurrentProjectDetails(project);
    const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all" });
        props.getProjectsDispatch({ calledId: "user_all", userId });
        props.getAllDepartment();
        props.getDepartment();
        props.getAllUserInAllUnitsOfCompany();
        props.getTasksByProject(currentProjectId);
        props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId });
    }, [])

    const currentProjectTasks = tasks?.tasksbyproject;

    const handleAfterCreateProject = async () => {
        await props.getProjectsDispatch({ calledId: "user_all", userId });
        await props.getTasksByProject(currentProjectId);
        await props.getTasksByProject(currentProjectId, 1, 6);
        projectDetail = getCurrentProjectDetails(project);
        await props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId });
    }

    return (
        <div className="box">


            <ul className="nav nav-tabs">
                <li className="active"><a href="#project-details-info" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Thông tin dự án</a></li>
                <li><a href="#project-tasks-list" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Danh sách công việc dự án</a></li>
                <li><a href="#project-details-change-request" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Yêu cầu thay đổi phát sinh dự án</a></li>
            </ul>
            <div className="tab-content">
                {/** Thông tin dự án */}
                <div className="tab-pane active" id="project-details-info">
                    <LazyLoadComponent
                        key="TabProjectInfo"
                    >
                        <TabProjectInfo
                            currentProjectId={currentProjectId}
                            projectDetail={projectDetail}
                            currentProjectTasks={currentProjectTasks}
                            handleAfterCreateProject={handleAfterCreateProject}
                        />
                    </LazyLoadComponent>
                </div>
                {/** Danh sách công việc dự án */}
                <div className="tab-pane" id="project-tasks-list">
                    <LazyLoadComponent
                        key="TabProjectTasksList"
                    >
                        <TabProjectTasksList projectDetail={projectDetail} currentProjectTasks={currentProjectTasks} />
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
        </div >
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
    getAllDepartment: DepartmentActions.get,
    getDepartment: UserActions.getDepartmentOfUser,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectDetailPage));