import React from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';

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

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={'modal-view-all-general-task'} isLoading={false}
                formID={`modal-view-all-task-need-to-do`}
                title={titleModal}
                hasSaveButton={false}
                hasNote={false}
            >
                <form className="form-group" id={`modal-view-all-task-need-to-do`}>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                <th>Tên công việc</th>
                                <th>Link chi tiết tới công việc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasks && tasks.length > 0 && tasks.map((obj, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{obj.name}</td>
                                        <td><a href={`/task?taskId=${obj._id}`} target="_blank">Xem chi tiết</a></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

export default connect(null, null)(withTranslate(ViewAllGeneralTask));