import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import { DialogModal } from '../../../../common-components';
import { formatTaskStatus, renderStatusColor, convertPriorityData, checkIfAbleToCRUDProject, renderLongList, renderProjectTypeText } from '../../projects/components/functionHelper';

const DetailMilestone = (props) => {
    const { translate, milestone, milestoneId } = props;

    return (
        <div className="description-box" style={{ lineHeight: 1.5 }}>
            <DialogModal
                modalID={`modal-show-detail-milestone-${milestoneId}`} isLoading={false}
                formID={`form-show-detail-phase${milestoneId}`}
                title={`${translate('project.task_management.milestone_info')} - "${milestone?.name}"`}
                hasSaveButton={false}
                size={75}
                resetOnClose={true}
            >

                <div className="row">
                    {/* Người thiết lập */}
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('task.task_management.creator')}</strong>
                                <div className="col-sm-8">
                                    <span>{milestone?.creator ? milestone?.creator?.name : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Độ ưu tiên */}
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('task.task_management.priority')}</strong>
                                <div className="col-sm-8">
                                    <span>{convertPriorityData(milestone?.priority, translate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    {/* Ngày bắt đầu */}
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('task.task_management.start_date')}</strong>
                                <div className="col-sm-8">
                                    <span>{milestone?.startDate ? moment(milestone?.startDate).format('HH:mm DD/MM/YYYY') : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ngày kết thúc */}
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('task.task_management.end_date')}</strong>
                                <div className="col-sm-8">
                                    <span>{milestone?.endDate ? moment(milestone?.endDate).format('HH:mm DD/MM/YYYY') : null}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Tiến độ */}
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('phase.progress')}</strong>
                                <div className="col-sm-8">
                                    <span>{milestone?.progress ? `${milestone.progress}%` : `0%`}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div className="col-md-6">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <strong className="col-sm-4">{translate('phase.status')}</strong>
                                <div className="col-sm-8">
                                    <span style={{ color: renderStatusColor(milestone) }}>{formatTaskStatus(translate, milestone?.status)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </div>
    )
}

function mapStateToProps(state) {
    const { project } = state;
    return { project }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailMilestone));
