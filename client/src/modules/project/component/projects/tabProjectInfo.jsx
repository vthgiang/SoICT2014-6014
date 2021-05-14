import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import 'c3/c3.css';
import { getEndDateOfProject, renderItemLabelContent } from './functionHelper';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';

const TabProjectInfo = (props) => {
    const { translate, projectDetail, project, currentProjectTasks } = props;
    const currentChangeRequestsList = project && project.changeRequests;
    const currentChangeRequestsListNeedApprove = currentChangeRequestsList.filter(item => item.requestStatus === 1)

    return (
        <React.Fragment>
            <div className="box">
                <div className="description-box">
                    <div>
                        <strong>Thời điểm kết thúc dự kiến - ban đầu:</strong>
                        <a>{moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY')}</a>
                    </div>
                    <div>
                        <strong>Thời điểm kết thúc dự kiến - hiện tại:</strong>
                        <a>{projectDetail?.endDateRequest && moment(projectDetail?.endDateRequest).format('HH:mm DD/MM/YYYY')}</a>
                    </div>
                    <div>
                        <strong>Chi phí ước lượng dự kiến - ban đầu:</strong>
                        <a>{numberWithCommas(projectDetail?.budget)} VND</a>
                    </div>
                    <div>
                        <strong>Chi phí ước lượng dự kiến - hiện tại:</strong>
                        <a>{projectDetail?.budget && numberWithCommas(projectDetail?.budgetChangeRequest)} VND</a>
                    </div>
                </div>
                {
                    currentChangeRequestsListNeedApprove && currentChangeRequestsListNeedApprove.length > 0
                    &&
                    <div className="description-box warning">
                        <h4>Cảnh báo</h4>
                        <div>
                            <strong>Số yêu cầu thay đổi cần được phê duyệt:</strong>
                            <a>{currentChangeRequestsListNeedApprove.length}</a>
                        </div>
                    </div>
                }
                <div className="box-body qlcv">
                    <div className="row">
                        {renderItemLabelContent(translate('project.name'), projectDetail ? projectDetail?.name : null)}
                        {renderItemLabelContent(translate('project.code'), projectDetail ? projectDetail?.code : null)}
                    </div>

                    <div className="row">
                        {renderItemLabelContent(translate('project.startDate'), projectDetail ? moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY') : null)}
                        {renderItemLabelContent(translate('project.endDate'), currentProjectTasks ? moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY') : null)}
                    </div>

                    <div className="row">
                        {renderItemLabelContent(translate('project.manager'), projectDetail && projectDetail?.projectManager ? projectDetail?.projectManager.map(o => o.name).join(", ") : null)}
                        {renderItemLabelContent(translate('project.unitCost'), projectDetail?.unitCost ? projectDetail?.unitCost : null)}
                    </div>

                    <div className="row">
                        {renderItemLabelContent(translate('project.member'), projectDetail && projectDetail?.responsibleEmployees ? projectDetail?.responsibleEmployees.map(o => o.name).join(", ") : null)}
                        {renderItemLabelContent(translate('project.unitTime'), projectDetail && projectDetail?.unitTime ? translate(`project.unit.${projectDetail?.unitTime}`) : null)}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const project = state.project;
    return { project }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectInfo));