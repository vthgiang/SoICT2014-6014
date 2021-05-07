import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { AutomaticTaskPointCalculator } from '../../task-perform/component/automaticTaskPointCalculator';
import moment from 'moment'
import { checkIsNullUndefined, numberWithCommas } from '../../task-management/component/functionHelpers';

const ModalShowAutoPointInfoProjectTask = (props) => {
    const { task, translate, progress, projectDetail } = props;
    const { budget } = task;

    const data = {
        task,
        progress,
        projectDetail,
    }

    const {
        estimateAssetCost,
        estCost,
        estDuration,
        realCost,
        realDuration,
        progressTask,
        earnedValue,
        plannedValue,
        actualCost,
        costPerformanceIndex,
        autoCalPointProject,
    } = AutomaticTaskPointCalculator.calcProjectAutoPoint(data, false);

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
                    <p><strong>Các thông số: </strong></p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>progressTask - Tiến độ của công việc (%): <strong>{progressTask}%</strong></li>
                        <li>budget - Ngân sách cho công việc (VND): <strong>{numberWithCommas(estCost)} VND</strong></li>
                        <li>estDuration - Thời gian ước lượng cho công việc ({translate(`project.unit.${projectDetail?.unitTime}`)}): <strong>{numberWithCommas(estDuration)} ngày</strong></li>
                        <li>realDuration - Thời gian thực tế bấm giờ cho công việc ({translate(`project.unit.${projectDetail?.unitTime}`)}): <strong>{numberWithCommas(realDuration)} ngày</strong></li>
                        <li>assetCost - Chi phí tài sản (VND): <strong>{numberWithCommas(estimateAssetCost)} VND</strong></li>
                        <li>actualCost - Chi phí thực tế cho công việc (VND): <strong>{numberWithCommas(actualCost)} VND</strong></li>
                        <li>earnedValue = progressTask * budget - Giá trị thu được từ công việc (VND): <strong>{numberWithCommas(earnedValue)} VND</strong></li>
                        <li>costPerformanceIndex = earnedValue / actualCost - Chỉ số đánh giá chi phí cho công việc: <strong>{costPerformanceIndex.toFixed(2)}</strong></li>
                    </ul>
                    <p><strong>{translate('task.task_management.calc_formula')}: </strong>
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
                    <p><strong>Kết quả hiện tại: </strong></p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>costPerformanceIndex hiện tại: <strong>{costPerformanceIndex}</strong></li>
                        <li>Điểm hiện tại: <strong>{checkIsNullUndefined(autoCalPointProject) ? 'Chưa tính được' : autoCalPointProject}</strong></li>
                    </ul>
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


