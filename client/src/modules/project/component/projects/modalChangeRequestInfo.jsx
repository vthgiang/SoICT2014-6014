import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { LazyLoadComponent, forceCheckOrVisible, DialogModal } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../../redux/actions';
import { convertDepartmentIdToDepartmentName, convertUserIdToUserName, getEndDateOfProject, getEstimateCostOfProject, getListDepartments, getNewTasksListAfterCR, MILISECS_TO_DAYS, MILISECS_TO_HOURS, processAffectedTasksChangeRequest, processDataTasksStartEnd, renderItemLabelContent } from './functionHelper';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import moment from 'moment';
import { isArraysEqual } from '@fullcalendar/common';

const ModalChangeRequestInfo = (props) => {
    const { translate, project, projectDetail, user, changeRequest, changeRequestId, currentProjectTasks } = props;
    const [currentChangeRequestId, setCurrentChangeRequestId] = useState(changeRequestId || changeRequest?._id);
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : [];
    if (currentChangeRequestId !== changeRequestId) {
        setCurrentChangeRequestId(changeRequestId);
    }

    // console.log('changeRequest', changeRequest)

    const renderStatus = (statusValue) => {
        switch (statusValue) {
            case 0: return 'Chưa yêu cầu';
            case 1: return 'Đang yêu cầu';
            case 2: return 'Bị từ chối';
            case 3: return 'Được phê duyệt';
            default: return 'Chưa yêu cầu';
        }
    }

    const getTaskName = (currentProjectTasks, taskId) => {
        return currentProjectTasks?.find((taskItem) => String(taskItem._id) === taskId)?.name;
    }

    // const newTasksListAfterCR = projectDetail && currentProjectTasks && changeRequest?.currentTask
    //     ? getNewTasksListAfterCR(projectDetail, currentProjectTasks, changeRequest.currentTask)
    //     : currentProjectTasks;

    const renderTextColor = useCallback(
        (condition) => {
            if (condition) return { color: 'green' };
            return { color: 'red' };
        },
        [changeRequest],
    )

    const originEndDate = moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY');
    const oldEndDate = moment(projectDetail?.endDateRequest).format('HH:mm DD/MM/YYYY');
    const newEndDate = moment(changeRequest?.baseline?.newEndDate).format('HH:mm DD/MM/YYYY');
    const originCost = numberWithCommas(projectDetail?.budget);
    const oldCost = numberWithCommas(projectDetail?.budgetChangeRequest);
    const newCost = numberWithCommas(changeRequest?.baseline?.newCost);

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-change-request-info-${changeRequest?._id || changeRequestId}`} isLoading={false}
                formID={`modal-change-request-info-${changeRequest?._id || changeRequestId}`}
                title={`Thông tin chi tiết yêu cầu thay đổi ${changeRequest?.name}`}
                size={75}
                hasSaveButton={false}
            >
                <div>
                    <div className="box">
                        <div className="box-body qlcv">
                            <h3><strong>Thông tin chi tiết yêu cầu thay đổi</strong></h3>
                            <div className="row">
                                {renderItemLabelContent('Tên yêu cầu', changeRequest?.name)}
                                {renderItemLabelContent('Người tạo yêu cầu', changeRequest?.creator?.name)}
                            </div>
                            <div className="row">
                                {renderItemLabelContent('Thời gian tạo yêu cầu', moment(changeRequest?.createdAt).format('HH:mm DD/MM/YYYY'))}
                                {renderItemLabelContent('Trạng thái', renderStatus(changeRequest?.requestStatus))}
                            </div>
                            <div className="row">
                                {renderItemLabelContent('Mô tả yêu cầu', changeRequest?.description)}
                            </div>
                        </div>
                    </div>
                    <div className="box">
                        <div className="box-body qlcv">
                            <h3><strong>Thay đổi về baseline dự án</strong></h3>
                            <table id="project-table" className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Trường baseline</th>
                                        <th>Dự kiến ban đầu</th>
                                        {changeRequest?.requestStatus === 1 && <th>Hiện tại</th>}
                                        <th>Sau khi phê duyệt yêu cầu này</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Thời điểm kết thúc</td>
                                        <td>{originEndDate}</td>
                                        {changeRequest?.requestStatus === 1 &&
                                            <td style={renderTextColor(moment(originEndDate, 'HH:mm DD/MM/YYYY').isSameOrAfter(moment(oldEndDate, 'HH:mm DD/MM/YYYY')))}>{oldEndDate}</td>
                                        }
                                        <td style={renderTextColor(moment(originEndDate, 'HH:mm DD/MM/YYYY').isSameOrAfter(moment(newEndDate, 'HH:mm DD/MM/YYYY')))}>{newEndDate}</td>

                                    </tr>
                                    <tr>
                                        <td>Chi phí ước lượng</td>
                                        <td>{originCost} VND</td>
                                        {changeRequest?.requestStatus === 1 &&
                                            <td style={renderTextColor(Number(String(originCost).replace(/,/g, '')) >= Number(String(oldCost).replace(/,/g, '')))}>{oldCost} VND</td>
                                        }
                                        <td style={renderTextColor(Number(String(originCost).replace(/,/g, '')) >= Number(String(newCost).replace(/,/g, '')))}>{newCost} VND</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="box">
                        <div className="box-body qlcv">
                            <h3><strong>Danh sách các công việc bị ảnh hưởng</strong></h3>
                            <table id="salary-members-table" className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Tên công việc</th>
                                        <th>Loại thay đổi</th>
                                        <th>Tên trường thay đổi</th>
                                        <th>Giá trị cũ</th>
                                        <th>Giá trị mới</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        changeRequest?.affectedTasksList &&
                                        changeRequest?.affectedTasksList?.map((affectedItem, affectedIndex) => {
                                            return (
                                                <>
                                                    <tr style={{ backgroundColor: '#f1f1f1' }}>
                                                        <td>{affectedItem?.new?.name}</td>
                                                        <td>{affectedItem?.task ? 'Chỉnh sửa' : 'Thêm mới'}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    {
                                                        (affectedItem?.old?.preceedingTasks && affectedItem?.old?.preceedingTasks?.length > 0
                                                            || affectedItem?.new?.preceedingTasks && affectedItem?.new?.preceedingTasks?.length > 0) &&
                                                        !isArraysEqual(
                                                            affectedItem?.old?.preceedingTasks?.map((preItem) => getTaskName(currentProjectTasks, preItem.task)).join(', '),
                                                            affectedItem?.new?.preceedingTasks?.map((preItem) => getTaskName(currentProjectTasks, preItem.task)).join(', ')
                                                        ) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Công việc tiền nhiệm</td>
                                                            <td>{affectedItem?.old?.preceedingTasks && affectedItem?.old?.preceedingTasks?.map((preItem) => getTaskName(currentProjectTasks, preItem.task)).join(', ')}</td>
                                                            <td>{affectedItem?.new?.preceedingTasks?.map((preItem) => getTaskName(currentProjectTasks, preItem.task)).join(', ')}</td>
                                                        </tr>
                                                    }
                                                    {
                                                        (affectedItem?.old?.estimateNormalTime || affectedItem?.new?.estimateNormalTime) &&
                                                        Number(affectedItem?.old?.estimateNormalTime) !== Number(affectedItem?.new?.estimateNormalTime) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Thời gian ước lượng ({translate(`project.unit.${projectDetail?.unitTime}`)})</td>
                                                            <td>{affectedItem?.old?.estimateNormalTime && Number(affectedItem?.old?.estimateNormalTime) / (projectDetail?.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS)}</td>
                                                            <td>{Number(affectedItem?.new?.estimateNormalTime) / (projectDetail?.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS)}</td>
                                                        </tr>
                                                    }
                                                    {
                                                        (affectedItem?.old?.startDate || affectedItem?.new?.startDate) &&
                                                        (!moment(affectedItem?.old?.startDate).isSame(moment(affectedItem?.new?.startDate))) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Thời điểm bắt đầu</td>
                                                            <td>{affectedItem?.old?.startDate && moment(affectedItem?.old?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                            <td>{moment(affectedItem?.new?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                        </tr>
                                                    }
                                                    {
                                                        (affectedItem?.old?.endDate || affectedItem?.new?.endDate) &&
                                                        (!moment(affectedItem?.old?.endDate).isSame(moment(affectedItem?.new?.endDate))) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Thời điểm kết thúc</td>
                                                            <td>{affectedItem?.old?.endDate && moment(affectedItem?.old?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                            <td>{moment(affectedItem?.new?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                        </tr>
                                                    }
                                                    {/* {
                                                        (affectedItem?.old?.estimateOptimisticTime || affectedItem?.new?.estimateOptimisticTime) &&
                                                        Number(affectedItem?.old?.estimateOptimisticTime) !== Number(affectedItem?.new?.estimateOptimisticTime) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Thời gian thoả hiệp ({translate(`project.unit.${projectDetail?.unitTime}`)})</td>
                                                            <td>{affectedItem?.old?.estimateOptimisticTime && Number(affectedItem?.old?.estimateOptimisticTime) / (projectDetail?.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS)}</td>
                                                            <td>{Number(affectedItem?.new?.estimateOptimisticTime) / (projectDetail?.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS)}</td>
                                                        </tr>
                                                    } */}
                                                    {
                                                        (affectedItem?.old?.estimateNormalCost || affectedItem?.new?.estimateNormalCost) &&
                                                        Number(affectedItem?.old?.estimateNormalCost) !== Number(affectedItem?.new?.estimateNormalCost) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Chi phí ước lượng (VND)</td>
                                                            <td>{affectedItem?.old?.estimateNormalCost && numberWithCommas(Number(affectedItem?.old?.estimateNormalCost))}</td>
                                                            <td>{numberWithCommas(Number(affectedItem?.new?.estimateNormalCost))}</td>
                                                        </tr>
                                                    }
                                                    {/* {
                                                        (affectedItem?.old?.estimateMaxCost || affectedItem?.new?.estimateMaxCost) &&
                                                        Number(affectedItem?.old?.estimateMaxCost) !== Number(affectedItem?.new?.estimateMaxCost) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Chi phí thoả hiệp (VND)</td>
                                                            <td>{affectedItem?.old?.estimateMaxCost && numberWithCommas(Number(affectedItem?.old?.estimateMaxCost))}</td>
                                                            <td>{numberWithCommas(Number(affectedItem?.new?.estimateMaxCost))}</td>
                                                        </tr>
                                                    } */}
                                                    {
                                                        (affectedItem?.old?.responsibleEmployees || affectedItem?.new?.responsibleEmployees) &&
                                                        !isArraysEqual(affectedItem?.old?.responsibleEmployees, affectedItem?.new?.responsibleEmployees) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Người thực hiện</td>
                                                            <td>{affectedItem?.old?.responsibleEmployees && affectedItem?.old?.responsibleEmployees?.map((resItem) => convertUserIdToUserName(listUsers, resItem)).join(', ')}</td>
                                                            <td>{affectedItem?.new?.responsibleEmployees?.map((resItem) => convertUserIdToUserName(listUsers, resItem)).join(', ')}</td>
                                                        </tr>
                                                    }
                                                    {
                                                        (affectedItem?.old?.accountableEmployees || affectedItem?.new?.accountableEmployees) &&
                                                        !isArraysEqual(affectedItem?.old?.accountableEmployees, affectedItem?.new?.accountableEmployees) &&
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td>Người phê duyệt</td>
                                                            <td>{affectedItem?.old?.accountableEmployees && affectedItem?.old?.accountableEmployees?.map((accItem) => convertUserIdToUserName(listUsers, accItem)).join(', ')}</td>
                                                            <td>{affectedItem?.new?.accountableEmployees?.map((accItem) => convertUserIdToUserName(listUsers, accItem)).join(', ')}</td>
                                                        </tr>
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user, tasks } = state;
    return { project, user, tasks }
}

const mapDispatchToProps = {
    editProjectDispatch: ProjectActions.editProjectDispatch,
    getSalaryMembersDispatch: ProjectActions.getSalaryMembersDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalChangeRequestInfo));
