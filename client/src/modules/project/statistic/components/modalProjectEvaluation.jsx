import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, forceCheckOrVisible } from '../../../../common-components'
import { ProjectGantt } from '../../../../common-components/src/gantt/projectGantt';
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import moment from 'moment';
import { getStorage } from '../../../../config';
import TabEvalProject from './tabEvalProject';
import TabEvalProjectTasks from './tabEvalProjectTasks';
import TabEvalProjectMember from './tabEvalProjectMember';
import TabEvalSelf from './tabEvalSelf';
import { StatisticActions } from '../../statistic/redux/actions';
import { checkIfAbleToCRUDProject, getCurrentProjectDetails } from '../../projects/components/functionHelper';

const ModalProjectEvaluation = (props) => {
    const { projectDetailId, projectDetail, translate, project, tasks, user, projectStatistic } = props;
    const userId = getStorage("userId");
    const [currentProjectId, setCurrentProjectId] = useState('');
    const currentTasks = tasks?.tasksbyproject;
    const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "user_all", userId });
        props.getAllUserInAllUnitsOfCompany();
        props.getTasksByProject(projectDetailId || projectDetail?._id)
        props.getListTasksEvalDispatch(currentProjectId, currentMonth.format());
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [currentProjectId, currentMonth])

    if (projectDetailId != currentProjectId) {
        setCurrentProjectId(projectDetailId);
    }

    const handleChangeMonth = (value) => {
        setIsLoading(true);
        setCurrentMonth(moment(value, 'MM-YYYY'));
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-project-eval-${projectDetailId || projectDetail?._id}`} isLoading={false}
                formID={`form-show-project-eval-${projectDetailId || projectDetail?._id}`}
                title={`Thống kê đánh giá dự án "${projectDetail?.name}"`}
                hasSaveButton={false}
                size={100}
                resetOnClose={true}
            >
                {
                    getCurrentProjectDetails(project, projectDetail?._id)?.projectType === 2 ?
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#eval-project" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Thống kê đánh giá dự án</a></li>
                                <li><a href="#eval-project-tasks" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Thống kê đánh giá công việc</a></li>
                                {
                                    checkIfAbleToCRUDProject({ project, user, currentProjectId, isInsideProject: true }) &&
                                    <li><a href="#eval-project-members" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Thống kê đánh giá thành viên</a></li>
                                }
                                <li><a href="#eval-self" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Thống kê đánh giá cá nhân</a></li>
                            </ul>
                            <div className="tab-content">
                                {/** Thống kê dự án */}
                                {
                                    <div className="tab-pane active" id="eval-project">
                                        <TabEvalProject
                                            projectDetail={projectDetail}
                                            projectDetailId={projectDetailId}
                                            currentTasks={currentTasks}
                                            listTasksEval={projectStatistic.listTasksEval}
                                            currentMonth={currentMonth}
                                            handleChangeMonth={handleChangeMonth} />
                                    </div>
                                }
                                {/** Thống kê điểm số công việc theo tháng */}
                                {
                                    <div className="tab-pane" id="eval-project-tasks">
                                        <TabEvalProjectTasks
                                            projectDetail={projectDetail}
                                            projectDetailId={projectDetailId}
                                            currentTasks={currentTasks}
                                            listTasksEval={projectStatistic.listTasksEval}
                                            currentMonth={currentMonth}
                                            handleChangeMonth={handleChangeMonth}
                                            isLoading={isLoading} />
                                    </div>
                                }
                                {/** Tab Đánh giá thành viên dự án */}
                                {
                                    checkIfAbleToCRUDProject({ project, user, currentProjectId, isInsideProject: true }) &&
                                    <div className="tab-pane" id="eval-project-members">
                                        <TabEvalProjectMember
                                            currentTasks={currentTasks}
                                            currentMonth={currentMonth}
                                            listTasksEval={projectStatistic.listTasksEval}
                                            handleChangeMonth={handleChangeMonth}
                                            projectDetail={projectDetail}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                }
                                {/** Tab Đánh giá cá nhân */}
                                <div className="tab-pane" id="eval-self">
                                    <TabEvalSelf
                                        currentTasks={currentTasks}
                                        currentMonth={currentMonth}
                                        listTasksEval={projectStatistic.listTasksEval}
                                        handleChangeMonth={handleChangeMonth}
                                        projectDetail={projectDetail}
                                        userId={userId}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                        :
                        <div>Dự án không ràng buộc không dùng được chức năng này!</div>
                }
            </DialogModal>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    const { project, user, tasks, projectStatistic } = state;
    return { project, user, tasks, projectStatistic }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
    getListTasksEvalDispatch: StatisticActions.getListTasksEvalDispatch,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalProjectEvaluation));
