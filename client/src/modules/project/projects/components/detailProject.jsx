import React from 'react';
import { connect } from 'react-redux';
import { LazyLoadComponent, forceCheckOrVisible, DialogModal } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../redux/actions';
import { formatDate, formatFullDate } from '../../../../helpers/formatDate';
import TableTasksProject from './tableTasksProject';
import GanttTasksProject from './ganttTasksProject';
import KanbanTasksProject from './kanbanTasksProject';
import CpmTasksProject from './cpmTasksProject';
import moment from 'moment';
import { getEndDateOfProject, renderProjectTypeText } from './functionHelper';
import DetailContent from './detailContent';

const ProjectDetailForm = (props) => {
    const { translate, projectDetail, projectDetailId, currentProjectTasks } = props;

    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} /> */}
            <DialogModal
                modalID={`modal-detail-project-${projectDetail?._id}`} isLoading={false}
                formID={`form-detail-project-${projectDetail?._id}`}
                title={projectDetail ? projectDetail?.name : null}
                size={75}
                hasSaveButton={false}
            >
                <DetailContent
                    projectDetailId={projectDetail && projectDetail._id}
                    projectDetail={projectDetail}
                    currentProjectTasks={currentProjectTasks}
                />
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const project = state.project;
    return { project }
}

const mapDispatchToProps = {
    editProjectDispatch: ProjectActions.editProjectDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectDetailForm));
