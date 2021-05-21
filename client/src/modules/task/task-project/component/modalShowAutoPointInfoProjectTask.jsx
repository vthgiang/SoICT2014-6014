import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { AutomaticTaskPointCalculator } from '../../task-perform/component/automaticTaskPointCalculator';
import moment from 'moment'
import { checkIsNullUndefined, numberWithCommas } from '../../task-management/component/functionHelpers';

const ModalShowAutoPointInfoProjectTask = (props) => {
    const { task, translate, progress, projectDetail, currentTaskActualCost } = props;

    const data = {
        task,
        progress,
        projectDetail,
        currentTaskActualCost,
    }

    const {
        usedDuration,
        totalDuration,
        schedulePerformanceIndex,
        actionsHasRating,
        sumRatingOfPassedActions,
        sumRatingOfAllActions,
        estimateNormalCost,
        actualCost,
        costPerformanceIndex,
        totalTimeLogs,
        taskTimePoint,
        taskQualityPoint,
        taskCostPoint,
        taskDilligencePoint,
        autoTaskPoint,
    } = AutomaticTaskPointCalculator.calcProjectTaskPoint(data, false);

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-automatic-point-info-project-task-${task?._id}`}
                formID={`form-automatic-point-info-project-task-${task?._id}`}
                title={`${translate('task.task_management.calc_form')} cho công việc`}
                hasSaveButton={false}
                hasNote={false}
                size={100}
            >
                <div>
                    <p><strong>Công thức: </strong>taskTimePoint + taskQualityPoint + taskCostPoint + taskDilligencePoint</p>
                    <p><strong>Trong đó: </strong></p>
                    <p><strong>taskTimePoint: </strong>Điểm quy đổi SPI * timeWeight = (progress / 100) / (usedDuration / totalDuration) * timeWeight</p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>progress - Tiến độ của công việc (1 - 100): <strong>{progress}</strong></li>
                        <li>usedDuration - Tổng thời gian từ khi bắt đầu task đến bây giờ (milliseconds): <strong>{numberWithCommas(usedDuration)}</strong></li>
                        <li>totalDuration - Tổng thời gian từ khi bắt đầu task đến dự kiến kết thúc (milliseconds): <strong>{numberWithCommas(totalDuration)}</strong></li>
                        <li>SPI - Chỉ số hiệu năng tiến độ: (progress / 100) / (usedDuration / totalDuration) = <strong>{schedulePerformanceIndex}</strong></li>
                        <li>Điểm quy đổi SPI <span style={{ color: 'red' }}>*(Bảng quy đổi ở mục cuối cùng)</span>: <strong>{AutomaticTaskPointCalculator.convertIndexPointToNormalPoint(schedulePerformanceIndex)}</strong></li>
                        <li>timeWeight - trọng số thời gian: <strong>{task.timeWeight || '0.25'}</strong></li>
                        <li>taskTimePoint: <strong>{taskTimePoint}</strong></li>
                    </ul>
                    <p><strong>taskQualityPoint </strong>= [(sumRatingOfPassedActions / sumRatingOfAllActions) * 100] * qualityWeight</p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>sumRatingOfPassedActions - Tổng đánh giá những hoạt động đạt yêu cầu: <strong>{sumRatingOfPassedActions}</strong></li>
                        <li>sumRatingOfAllActions - Tổng đánh giá tất cả những hoạt động: <strong>{sumRatingOfAllActions}</strong></li>
                        <li>qualityWeight - trọng số chất lượng: <strong>{task.qualityWeight || '0.25'}</strong></li>
                        <li>taskQualityPoint: <strong>{taskQualityPoint}</strong></li>
                    </ul>
                    <p><strong>taskCostPoint: </strong>Điểm quy đổi CPI * costWeight = [(progress / 100) * estimateNormalCost / actualCost] * costWeight</p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>progress - Tiến độ của công việc (1 - 100): <strong>{progress}</strong></li>
                        <li>estimateNormalCost - Tổng chi phí ước lượng cho task (VND): <strong>{numberWithCommas(estimateNormalCost)}</strong></li>
                        <li>actualCost - Tổng chi phí thực cho task (VND): <strong>{numberWithCommas(actualCost)}</strong></li>
                        <li>CPI - Chỉ số hiệu năng chi phí: (progress / 100) * estimateNormalCost / actualCost = <strong>{costPerformanceIndex}</strong></li>
                        <li>Điểm quy đổi CPI <span style={{ color: 'red' }}>*(Bảng quy đổi ở mục cuối cùng)</span>: <strong>{AutomaticTaskPointCalculator.convertIndexPointToNormalPoint(costPerformanceIndex)}</strong></li>
                        <li>costWeight - trọng số chi phí: <strong>{task.costWeight || '0.25'}</strong></li>
                        <li>taskCostPoint: <strong>{taskCostPoint}</strong></li>
                    </ul>
                    <p><strong>taskDilligencePoint </strong>= [(totalTimeLogs / totalDuration) * 100] * dilligenceWeight</p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>totalTimeLogs - Tổng thời gian bấm giờ của task (milliseconds): <strong>{numberWithCommas(totalTimeLogs)}</strong></li>
                        <li>totalDuration - Tổng thời gian từ khi bắt đầu task đến dự kiến kết thúc (milliseconds): <strong>{numberWithCommas(totalDuration)}</strong></li>
                        <li>dilligenceWeight - trọng số chuyên cần: <strong>{task.dilligenceWeight || '0.25'}</strong></li>
                        <li>taskDilligencePoint <span style={{ color: 'red' }}>*(Nếu điểm lớn hơn 100 thì công thức sẽ lấy 100)</span>: <strong>{taskDilligencePoint}</strong></li>
                    </ul>
                    <p><strong>Công thức quy đổi: </strong>
                        <ul style={{ lineHeight: 2.3 }}>
                            <li>{translate('project.eval.undefined')}</li>
                            <li>{translate('project.eval.level1')}</li>
                            <li>{translate('project.eval.level2')}</li>
                            <li>{translate('project.eval.level3')}</li>
                            <li>{translate('project.eval.level4')}</li>
                            <li>{translate('project.eval.level5')}</li>
                            <li>{translate('project.eval.level6')}</li>
                        </ul>
                    </p>
                    <p><strong>Kết quả hiện tại: </strong> {taskTimePoint} + {taskQualityPoint} + {taskCostPoint} + {taskDilligencePoint} = {autoTaskPoint}</p>
                </div>

            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const modalShowAutoPointInfoProjectTask = connect(mapState, null)(withTranslate(ModalShowAutoPointInfoProjectTask));
export { modalShowAutoPointInfoProjectTask as ModalShowAutoPointInfoProjectTask }


