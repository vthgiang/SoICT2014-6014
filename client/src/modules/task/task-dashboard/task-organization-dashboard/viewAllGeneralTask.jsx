import React from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import dayjs from 'dayjs';

const ViewAllGeneralTask = (props) => {
    const tasks = props && props.showDetailTask && props.showDetailTask.tasks;
    const unitName = props && props.showDetailTask && props.showDetailTask.nameUnit;
    const type = props && props.showDetailTask && props.showDetailTask.taskType;
    const { translate } = props;
    const taskType = {
        'taskInprocess': translate('task.task_dashboard.all_tasks_inprocess'),
        'taskFinished': translate('task.task_dashboard.all_tasks_finished'),
        'confirmedTask': translate('task.task_dashboard.confirmed_task'),
        'noneUpdateTask': translate('task.task_dashboard.none_update_recently'),
        'intimeTask': translate('task.task_dashboard.intime_task'),
        'delayTask': translate('task.task_dashboard.delay_task'),
        'overdueTask': translate('task.task_dashboard.overdue_task')
    };

    let titleModal;
    if (props && props.showDetailTask && props.showDetailTask.rowIndex === 0) {
        titleModal = type === 'totalTask' ?
            `${translate('task.task_dashboard.all_tasks')}` :
            `${translate('task.task_dashboard.all_tasks')} ${taskType[type]}`;
    } else {
        titleModal = type === 'totalTask' ?
            `${translate('task.task_dashboard.all_tasks')} của ${unitName}`
            :
            `Danh sách công việc ${taskType[type]} của ${unitName} `
    }

    // convert ISODate to String hh:mm AM/PM
    const formatTime = (date) => {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }

    const convertStatus = (status) => {
        const { translate } = props;

        switch (status) {
            case "inprocess": return translate('task.task_management.inprocess');
            case "wait_for_approval": return translate('task.task_management.wait_for_approval');
            case "finished": return translate('task.task_management.finished');
            case "delayed": return translate('task.task_management.delayed');
            case "canceled": return translate('task.task_management.canceled');
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={'modal-view-all-general-task'} isLoading={false}
                formID={`modal-view-all-task-need-to-do`}
                title={titleModal}
                hasSaveButton={false}
                hasNote={false}
            >
                <div id={`modal-view-all-task-need-to-do`}>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                <th>Tên công việc</th>
                                <th>Thời gian thực hiện công việc</th>
                                <th>Trạng thái</th>
                                <th>Tiến độ thực hiện</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasks && tasks.length > 0 && tasks.map((obj, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><a href={`/task?taskId=${obj._id}`} target="_blank">{obj.name}</a></td>
                                        <td>{`${formatTime(obj.startDate)} đến ${formatTime(obj.endDate)}`}</td>
                                        <td>{convertStatus(obj.status)}</td>
                                        <td>{`${obj.progress}%`}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

export default connect(null, null)(withTranslate(ViewAllGeneralTask));