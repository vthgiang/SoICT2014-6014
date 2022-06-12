import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { AutomaticTaskPointCalculator } from '../../task-perform/component/automaticTaskPointCalculator';
import { checkIsNullUndefined, numberWithCommas } from '../../task-management/component/functionHelpers';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { convertUserIdToUserName, MILISECS_TO_DAYS } from '../../../project/projects/components/functionHelper';

const ModalShowAutoPointInfoProjectMember = (props) => {
    const { task, translate, progress, projectDetail, userId, currentMemberActualCost, user } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    console.log('currentMemberActualCost', currentMemberActualCost)

    const data = {
        task,
        progress,
        projectDetail,
        userId,
        currentMemberActualCost,
    }

    const {
        usedDuration,
        totalDuration,
        schedulePerformanceIndex,
        actionsHasRating,
        sumRatingOfPassedActions,
        sumRatingOfAllActions,
        estimateNormalMemberCost,
        actualCost,
        costPerformanceIndex,
        totalTimeLogs,
        sumTimeDistributionPoint,
        sumMaxTimeDistributionPoint,
        memberTimePoint,
        memberQualityPoint,
        memberCostPoint,
        memberTimedistributionPoint,
        autoMemberPoint,
    } = AutomaticTaskPointCalculator.calcProjectMemberPoint(data, false);

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-automatic-point-info-project-member-${task?._id}-${userId}`}
                formID={`form-automatic-point-info-project-member-${task?._id}-${userId}`}
                title={`${translate('task.task_management.calc_form')} cho thành viên ${convertUserIdToUserName(listUsers, userId)}`}
                hasSaveButton={false}
                hasNote={false}
                size={100}
            >
                <div>
                    <p><strong>Công thức: </strong>memberTimePoint + memberQualityPoint + memberCostPoint + memberTimedistributionPoint</p>
                    <p><strong>Trong đó: </strong></p>
                    <p><strong>memberTimePoint: </strong>Điểm quy đổi SPI * timeWeight = (progress / 100) / (usedDuration / totalDuration) * timeWeight</p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>progress - Tiến độ của công việc (1 - 100): <strong>{progress}</strong></li>
                        <li>usedDuration - Tổng thời gian từ khi bắt đầu task đến bây giờ (milliseconds):
                            <strong>{numberWithCommas(usedDuration)}</strong> = <strong>{numberWithCommas(usedDuration / MILISECS_TO_DAYS)} (ngày)</strong>
                        </li>
                        <li>totalDuration - Tổng thời gian từ khi bắt đầu task đến dự kiến kết thúc (milliseconds):
                            <strong>{numberWithCommas(totalDuration)}</strong> = <strong>{numberWithCommas(totalDuration / MILISECS_TO_DAYS)} (ngày)</strong>
                        </li>
                        <li>SPI - Chỉ số hiệu năng tiến độ: (progress / 100) / (usedDuration / totalDuration) = <strong>{schedulePerformanceIndex}</strong></li>
                        <li>Điểm quy đổi SPI <span style={{ color: 'red' }}>*(Bảng quy đổi ở mục "Công thức quy đổi")</span>: <strong>{AutomaticTaskPointCalculator.convertIndexPointToNormalPoint(schedulePerformanceIndex)}</strong></li>
                        <li>timeWeight - trọng số thời gian: <strong>{task?.memberWeight?.timeWeight || '0.25'}</strong></li>
                        <li>memberTimePoint: <strong>{memberTimePoint}</strong></li>
                    </ul>
                    <p><strong>memberQualityPoint </strong>= [(sumRatingOfPassedActions / sumRatingOfAllActions) * 100] * qualityWeight</p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>sumRatingOfPassedActions - Tổng đánh giá những hoạt động đạt yêu cầu: <strong>{sumRatingOfPassedActions}</strong></li>
                        <li>sumRatingOfAllActions - Tổng đánh giá tất cả những hoạt động: <strong>{sumRatingOfAllActions}</strong></li>
                        <li>qualityWeight - trọng số chất lượng: <strong>{task?.memberWeight?.qualityWeight || '0.25'}</strong></li>
                        <li>memberQualityPoint: <strong>{memberQualityPoint}</strong></li>
                    </ul>
                    <p><strong>memberCostPoint: </strong>Điểm quy đổi CPI * costWeight = [(progress / 100) * estimateNormalMemberCost / actualCost] * costWeight</p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>progress - Tiến độ của công việc (1 - 100): <strong>{progress}</strong></li>
                        <li>estimateNormalMemberCost - Tổng chi phí ước lượng cho thành viên (VND): <strong>{numberWithCommas(estimateNormalMemberCost)}</strong></li>
                        <li>actualCost - Tổng chi phí thực cho thành viên (VND): <strong>{numberWithCommas(actualCost)}</strong></li>
                        <li>CPI - Chỉ số hiệu năng chi phí: (progress / 100) * estimateNormalMemberCost / actualCost = <strong>{costPerformanceIndex}</strong></li>
                        <li>Điểm quy đổi CPI <span style={{ color: 'red' }}>*(Bảng quy đổi ở mục "Công thức quy đổi")</span>: <strong>{AutomaticTaskPointCalculator.convertIndexPointToNormalPoint(costPerformanceIndex)}</strong></li>
                        <li>costWeight - trọng số chi phí: <strong>{task?.memberWeight?.costWeight || '0.25'}</strong></li>
                        <li>memberCostPoint: <strong>{memberCostPoint}</strong></li>
                    </ul>
                    <p><strong>memberTimedistributionPoint </strong>= [(sumTimeDistributionPoint / sumMaxTimeDistributionPoint) * 100] * timedistributionWeight</p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>sumTimeDistributionPoint - Tổng điểm thành viên bấm giờ hợp lệ cho task: <strong>{numberWithCommas(sumTimeDistributionPoint)}</strong></li>
                        <li>sumMaxTimeDistributionPoint - Tổng điểm thành viên bấm giờ cho task: <strong>{numberWithCommas(sumMaxTimeDistributionPoint)}</strong></li>
                        <li>timedistributionWeight - trọng số phân bố thời gian: <strong>{task?.memberWeight?.timedistributionWeight || '0.25'}</strong></li>
                        <li>memberTimedistributionPoint : <strong>{numberWithCommas(memberTimedistributionPoint)}</strong></li>
                    </ul>
                    <div>
                        <p><strong>Công thức quy đổi: </strong></p>
                        <ul style={{ lineHeight: 2.3 }}>
                            <li>{translate('project.eval.undefined')}</li>
                            <li>{translate('project.eval.level1')}</li>
                            <li>{translate('project.eval.level2')}</li>
                            <li>{translate('project.eval.level3')}</li>
                            <li>{translate('project.eval.level4')}</li>
                            <li>{translate('project.eval.level5')}</li>
                            <li>{translate('project.eval.level6')}</li>
                        </ul>
                    </div>
                    <p><strong>Kết quả hiện tại: </strong> {memberTimePoint} + {memberQualityPoint} + {memberCostPoint} + {memberTimedistributionPoint} = {autoMemberPoint}</p>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks, user } = state;
    return { tasks, user };
}

const Modal = connect(mapState, null)(withTranslate(ModalShowAutoPointInfoProjectMember));
export { Modal as ModalShowAutoPointInfoProjectMember }


