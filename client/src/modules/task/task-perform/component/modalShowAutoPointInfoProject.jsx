import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import moment from 'moment'
import { numberWithCommas } from '../../task-management/component/functionHelpers';

const ModalShowAutoPointInfoProject = (props) => {
    const { task, translate, progress, evaluatingMonth, date, time } = props;
    const { budget } = task;

    const data = {
        task,
        progress: task.progress,
        evaluatingMonth,
        date,
        time
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
    } = AutomaticTaskPointCalculator.calcProjectAutoPoint(data, false);

    return (
        <React.Fragment>
            <DialogModal
                size="50"
                modalID={`modal-automatic-point-info-project`}
                formID="form-automatic-point-info"
                title={translate('task.task_management.calc_form')}
                hasSaveButton={false}
                hasNote={false}
            >
                <div>
                    <p><strong>Các thông số: </strong></p>
                    <ul style={{ lineHeight: 2.3 }}>
                        <li>progressTask - Tiến độ của công việc (%): <strong>{progressTask}%</strong></li>
                        <li>budget - Ngân sách cho công việc (VND): <strong>{numberWithCommas(budget)} VND</strong></li>
                        <li>estDuration - Thời gian ước lượng cho công việc (ngày): <strong>{numberWithCommas(estDuration)} ngày</strong></li>
                        <li>estCost - Chi phí ước lượng cho công việc (VND): <strong>{numberWithCommas(estCost)} VND</strong></li>
                        <li>realDuration - Thời gian thực tế bấm giờ cho công việc (ngày): <strong>{numberWithCommas(realDuration)} ngày</strong></li>
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
                        <li>Điểm hiện tại: <strong>{autoCalPointProject || 'Chưa tính được'}</strong></li>
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

const modalShowAutoPointInfo = connect(mapState, null)(withTranslate(ModalShowAutoPointInfoProject));
export { modalShowAutoPointInfo as ModalShowAutoPointInfoProject }


