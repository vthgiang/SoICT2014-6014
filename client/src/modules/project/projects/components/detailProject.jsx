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
                <div>
                    <div className="description-box" style={{ lineHeight: 1.5 }}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('project.detail_link')}</strong>
                                        <a className="col-sm-8" href={`/project/project-details?id=${projectDetail?._id}`} target="_blank">
                                            {projectDetail ? projectDetail?.name : null}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Hình thức quản lý dự án</strong>
                                        <div className="col-sm-8">
                                            {projectDetail ? translate(renderProjectTypeText(projectDetail?.projectType)) : null}
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
                                            <span>{projectDetail ? moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY') : null}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('project.endDate')}</strong>
                                        <div className="col-sm-8">
                                            <span>{currentProjectTasks ? moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY') : null}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
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
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('project.unitTime')}</strong>
                                        <div className="col-sm-8">
                                            <span>{projectDetail && projectDetail?.unitTime ? translate(`project.unit.${projectDetail?.unitTime}`) : null}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
