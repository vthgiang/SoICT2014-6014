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
import TimeLine from "react-gantt-timeline";

const ModalDetailReport = (props) => {
    const { projectDetailId, projectDetail, translate, project, tasks } = props;
    const userId = getStorage("userId");
    const [currentProjectId, setCurrentProjectId] = useState('');
    const currentTasks = tasks?.tasksbyproject;

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all", userId });
        props.getAllUserInAllUnitsOfCompany();
        props.getTasksByProject(projectDetailId || projectDetail?._id)
    }, [currentProjectId])

    if (projectDetailId != currentProjectId) {
        setCurrentProjectId(projectDetailId);
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-detail-report-${projectDetailId || projectDetail?._id}`} isLoading={false}
                formID={`form-show-detail-report-${projectDetailId || projectDetail?._id}`}
                title={translate('project.report.title')}
                hasSave={false}
                size={100}
                resetOnClose={true}
            >
                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#project-report-time" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Báo cáo tiến độ</a></li>
                        <li><a href="#project-report-cost" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Báo cáo chi phí</a></li>
                    </ul>
                    <div className="tab-content">
                        {/** Tab báo cáo chi phí */}
                        <div className="tab-pane" id="project-report-cost">
                            <div>Đây là tab báo cáo chi phí</div>
                        </div>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalDetailReport));
