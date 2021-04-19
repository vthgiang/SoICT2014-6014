import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, forceCheckOrVisible } from '../../../../common-components'
import { ProjectGantt } from '../../../../common-components/src/gantt/projectGantt';
import { ProjectActions } from '../../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import moment from 'moment';
import { getStorage } from '../../../../config';
import { getCurrentProjectDetails } from '../projects/functionHelper';
import TabEvalProject from './tabEvalProject';
import TabEvalProjectMember from './tabEvalProjectMember';

const ModalProjectEvaluation = (props) => {
    const { projectDetailId, projectDetail, translate, project, tasks } = props;
    const userId = getStorage("userId");
    const [currentProjectId, setCurrentProjectId] = useState('');
    const currentTasks = tasks?.tasksbyproject;
    const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all", userId });
        props.getAllUserInAllUnitsOfCompany();
        props.getTasksByProject(projectDetailId || projectDetail?._id)
        props.getListTasksEvalDispatch(currentProjectId, currentMonth.format());
    }, [currentProjectId, currentMonth])

    if (projectDetailId != currentProjectId) {
        setCurrentProjectId(projectDetailId);
    }

    const handleChangeMonth = (value) => {
        setCurrentMonth(moment(value, 'MM-YYYY'));
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-project-eval-${projectDetailId || projectDetail?._id}`} isLoading={false}
                formID={`form-show-project-eval-${projectDetailId || projectDetail?._id}`}
                title={`Chi tiết đánh giá dự án ${projectDetail?.name}`}
                hasSaveButton={false}
                size={100}
                resetOnClose={true}
            >
                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#eval-project" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Đánh giá dự án</a></li>
                        <li><a href="#eval-project-members" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Đánh giá thành viên dự án</a></li>
                        <li><a href="#eval-self" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Đánh giá cá nhân</a></li>
                    </ul>
                    <div className="tab-content">
                        {/** Tab Đánh giá dự án */}
                        <div className="tab-pane active" id="eval-project">
                            <TabEvalProject currentTasks={currentTasks} listTasksEval={project.listTasksEval} currentMonth={currentMonth} handleChangeMonth={handleChangeMonth} />
                        </div>
                        {/** Tab Đánh giá thành viên dự án */}
                        <div className="tab-pane" id="eval-project-members">
                            <TabEvalProjectMember currentTasks={currentTasks} />
                        </div>
                        {/** Tab Đánh giá cá nhân */}
                        {/* <div className="tab-pane" id="eval-self">
                            <div>Đánh giá cá nhân</div>
                        </div> */}
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
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
    getListTasksEvalDispatch: ProjectActions.getListTasksEvalDispatch,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalProjectEvaluation));
