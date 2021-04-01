import React from 'react';
import { useSelector } from 'react-redux';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../../redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import TableTasksProject from './tableTasksProject';
import GanttTasksProject from './ganttTasksProject';
import KanbanTasksProject from './kanbanTasksProject';
import CpmTasksProject from './cpmTasksProject';

const ProjectDetailForm = (props) => {
    const { translate } = props;
    const currentId = window.location.href.toString().split('id=')[1];
    const { project } = useSelector(state => state);
    const projectDetail = project?.data?.list?.filter(item => item._id === currentId)?.[0];
    console.log(projectDetail?.projectManager)
    console.log(projectDetail?.projectMembers)

    return (
        <div>
            <div className="description-box" style={{ lineHeight: 1.5 }}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.name')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail ? projectDetail.fullName : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.code')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail ? projectDetail.codeName : null}</span>
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
                                    <span>{projectDetail ? formatDate(projectDetail.startDate) : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.endDate')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail ? formatDate(projectDetail.estimatedEndDate) : null}</span>
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
                                    <span>{projectDetail && projectDetail.estimatedCost ? projectDetail.estimatedCost : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.manager')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail && projectDetail.projectManager ? projectDetail.projectManager.map(o => o.name).join(", ") : null}</span>
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
                                    <span>{projectDetail && projectDetail.unitCost ? projectDetail.unitCost : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('project.unitTime')}</strong>
                                <div className="col-sm-8">
                                    <span>{projectDetail && projectDetail.unitTime ? projectDetail.unitTime : null}</span>
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
                                    <span>{projectDetail && projectDetail.projectMembers ? projectDetail.projectMembers.map(o => o.name).join(", ") : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="nav-tabs-custom">
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
                            <TableTasksProject />
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
    const project = state.project;
    return { project }
}

const mapDispatchToProps = {
    editProjectDispatch: ProjectActions.editProjectDispatch,
    getProjectDetailsDispatch: ProjectActions.getProjectDetailsDispatch,
}
// export default connect(null, mapDispatchToProps)(withTranslate(ProjectDetailForm));
export default withTranslate(ProjectDetailForm);