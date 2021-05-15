import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { AutomaticTaskPointCalculator } from '../../task-perform/component/automaticTaskPointCalculator';
import { checkIsNullUndefined, numberWithCommas } from '../../task-management/component/functionHelpers';

const ModalShowAutoPointInfoProjectMember = (props) => {
    const { task, translate, progress, projectDetail, userId } = props;
    const { budget } = task;

    const data = {
        task,
        progress,
        projectDetail,
        userId,
    }

    const {
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
    } = AutomaticTaskPointCalculator.calcProjectTaskMemberAutoPoint(data, false);

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-automatic-point-info-project-member-${task?._id}`}
                formID={`form-automatic-point-info-project-member-${task?._id}`}
                title={`${translate('task.task_management.calc_form')} cho nhân viên dự án`}
                hasSaveButton={false}
                hasNote={false}
                size={100}
            >
                <div>
                    <p><strong>Các thông số: </strong></p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>progressTask - Tiến độ của nhân viên (%): <strong>{progressTask}%</strong></li>
                        <li>budget - Ngân sách cho nhân viên (VND): <strong>{numberWithCommas(estCost)} VND</strong></li>
                        <li>estDuration - Thời gian ước lượng của nhân viên cho công việc ({translate(`project.unit.${projectDetail?.unitTime}`)}): <strong>{numberWithCommas(estDuration)}</strong></li>
                        <li>realDuration - Thời gian thực tế nhân viên bấm giờ cho công việc ({translate(`project.unit.${projectDetail?.unitTime}`)}): <strong>{numberWithCommas(realDuration)}</strong></li>
                        <li>actualCost - Chi phí thực tế nhân viên sử dụng cho công việc (VND): <strong>{numberWithCommas(actualCost)} VND</strong></li>
                        <li>earnedValue = progressTask * budget - Giá trị thu được từ công việc của nhân viên (VND): <strong>{numberWithCommas(earnedValue)} VND</strong></li>
                        <li>costPerformanceIndex = earnedValue / actualCost - Chỉ số đánh giá chi phí cho công việc: <strong>{costPerformanceIndex.toFixed(2)}</strong></li>
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

const Modal = connect(mapState, null)(withTranslate(ModalShowAutoPointInfoProjectMember));
export { Modal as ModalShowAutoPointInfoProjectMember }


