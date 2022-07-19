import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import 'c3/c3.css';
import { getEndDateOfProject, renderItemLabelContent, renderProjectTypeText } from './functionHelper';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import ProjectEditForm from './editProject';
import { ChangeRequestActions } from '../../change-requests/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

const TabProjectInfo = (props) => {
    const { translate, projectDetail, project, currentProjectTasks, changeRequest, currentProjectId, handleAfterCreateProject } = props;
    const currentChangeRequestsList = changeRequest && changeRequest.changeRequests;
    const currentChangeRequestsListNeedApprove = currentChangeRequestsList?.filter(item => item.requestStatus === 1);

    const handleOpenEditProject = () => {
        setTimeout(() => {
            window.$(`#modal-edit-project-${currentProjectId}`).modal('show')
        }, 10);
    }

    return (
        <React.Fragment>
            <ProjectEditForm
                currentProjectTasks={currentProjectTasks}
                projectEditId={projectDetail && currentProjectId}
                projectEdit={projectDetail}
                handleAfterCreateProject={handleAfterCreateProject}
            />
            <div className="description-box without-border">
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <h3 ><strong>{projectDetail?.name}</strong></h3>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>

                        {/* Button chỉnh sửa thông tin dự án */}
                        <button
                            title="Chỉnh sửa thông tin dự án" style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                            onClick={handleOpenEditProject}>
                            <span style={{ marginTop: 5 }} className="material-icons">edit</span>
                        </button>

                        {/* Button refresh thông tin dự án */}
                        <button
                            title="Tải lại thông tin"
                            style={{ marginRight: 8, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                            onClick={() => {
                                props.getAllTasksByProject(currentProjectId);
                                props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId, calledId: 'get_all' });
                            }}
                        >
                            <span style={{ marginTop: 5 }} className="material-icons">refresh</span>
                        </button>
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
                <h4><strong>Thông số baseline</strong></h4>
                <div><strong>Thời điểm kết thúc dự kiến - ban đầu:   </strong>
                    {moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY')}
                </div>
                {
                    projectDetail?.endDateRequest &&
                    <div><strong>Thời điểm kết thúc dự kiến - hiện tại: {'  '}</strong>
                        {moment(projectDetail?.endDateRequest).format('HH:mm DD/MM/YYYY')}
                    </div>
                }
                {
                    projectDetail?.budget &&
                    <div><strong>Chi phí ước lượng dự kiến - ban đầu: {'  '}</strong>
                        {numberWithCommas(projectDetail?.budget)} VND
                    </div>
                }
                {
                    projectDetail?.budgetChangeRequest &&
                    <div><strong>Chi phí ước lượng dự kiến - hiện tại: {'  '}</strong>
                        {numberWithCommas(projectDetail?.budgetChangeRequest)} VND
                    </div>
                }

                <h4 style={{ marginTop: 10 }}><strong>Thông tin chung</strong></h4>

                <div><strong>{translate('project.projectType')}: {'  '}</strong>
                    {projectDetail ? translate(renderProjectTypeText(projectDetail?.projectType)) : null}
                </div>

                <div><strong>{translate('project.startDate')}: {'  '}</strong>
                    {projectDetail ? moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY') : null}
                </div>

                <div><strong>{translate('project.endDate')}: {'  '}</strong>
                    {currentProjectTasks ? moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY') : null}
                </div>

                <div><strong>{translate('project.unitCost')}: {'  '}</strong>
                    {projectDetail?.unitCost ? projectDetail?.unitCost : null}
                </div>

                <div><strong>{translate('project.unitTime')}: {'  '}</strong>
                    {projectDetail && projectDetail?.unitTime ? translate(`project.unit.${projectDetail?.unitTime}`) : null}
                </div>

                <h4 style={{ marginTop: 10 }}><strong>Vai trò</strong></h4>

                <div><strong>{translate('project.manager')}: {'  '}</strong>
                    {projectDetail && projectDetail?.projectManager ? projectDetail?.projectManager.map(o => o.name).join(", ") : null}
                </div>

                <div><strong>{translate('project.member')}: {'  '}</strong>
                    {projectDetail && projectDetail?.responsibleEmployees ? projectDetail?.responsibleEmployees.map(o => o.name).join(", ") : null}
                </div>

            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, changeRequest } = state;
    return { project, changeRequest }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getListProjectChangeRequestsDispatch: ChangeRequestActions.getListProjectChangeRequestsDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllTasksByProject: taskManagementActions.getAllTasksByProject,
    getAllDepartment: DepartmentActions.get,
    getDepartment: UserActions.getDepartmentOfUser,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectInfo));