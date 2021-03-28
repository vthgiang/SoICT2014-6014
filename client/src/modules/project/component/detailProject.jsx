import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect } from '../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import { formatDate } from '../../../helpers/formatDate';

const ProjectDetailForm = (props) => {
    const { projectDetail, translate } = props;
    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} /> */}
            <DialogModal
                modalID="modal-detail-project" isLoading={false}
                formID="form-detail-project"
                title={translate('project.detail_title')}
                size={75}
                hasNote={false}
            >
                <div className="description-box" style={{ lineHeight: 1.5 }}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('project.code')}</strong>
                                    <div className="col-sm-8">
                                        <span>{projectDetail ? projectDetail.code : null}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('project.name')}</strong>
                                    <div className="col-sm-8">
                                        <span>{projectDetail ? projectDetail.name : null}</span>
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
                                        <span>{projectDetail ? formatDate(projectDetail.endDate) : null}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('project.parent')}</strong>
                                    <div className="col-sm-8">
                                        <span>{projectDetail && projectDetail.parent ? projectDetail.parent.name : null}</span>
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
    editProject: ProjectActions.editProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectDetailForm));