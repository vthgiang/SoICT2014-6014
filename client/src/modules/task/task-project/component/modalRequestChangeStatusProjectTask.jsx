import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import moment from 'moment';

import { DialogModal, QuillEditor, SelectBox } from '../../../../common-components';
import { performTaskAction } from '../../task-perform/redux/actions';
import { EvaluateByResponsibleEmployeeProject } from './evaluateByResponsibleEmployeeProject';
import { EvaluateByAccountableEmployeeProject } from './evaluateByAccountableEmployeeProject';
import { getStorage } from '../../../../config';
import { getCurrentProjectDetails, getRecursiveRelevantTasks, isUserInCurrentTask } from '../../../project/projects/components/functionHelper';
import { ChangeRequestActions } from '../../../project/change-requests/redux/actions';

function ModalRequestChangeStatusProjectTask(props) {
    const { id, role, task, translate, currentProjectTasks, project } = props;
    const [currentStatus, setCurrentStatus] = useState(task?.status);
    const projectDetail = getCurrentProjectDetails(project, task.taskProject);
    const fakeStatusList = [
        {text: 'Đang thực hiện', value: 'inprocess'},
        {text: 'Bị hoãn', value: 'delayed'},
        {text: 'Bị huỷ', value: 'canceled'},
    ]

    const save = async () => {
        console.log('currentStatus', currentStatus)
        const currentProjectTasksFormatPreceedingTasks = currentProjectTasks.map((taskItem) => {
            return {
                ...taskItem,
                preceedingTasks: taskItem.preceedingTasks.map((taskItemPreItem) => {
                    return taskItemPreItem.task
                })
            }
        })
        const taskFormatted = {
            ...task,
            preceedingTasks: task.preceedingTasks.map((taskItemPreItem) => {
                return taskItemPreItem.task
            })
        }
        // Hàm đệ quy để lấy tất cả những tasks có liên quan tới task hiện tại
        const allTasksNodeRelationArr = getRecursiveRelevantTasks(currentProjectTasksFormatPreceedingTasks, taskFormatted);
        console.log('allTasksNodeRelationArr', allTasksNodeRelationArr)
        allTasksNodeRelationArr.unshift({
            ...task,
            preceedingTasks: task.preceedingTasks.map((preItem) => preItem.task._id),
        });
        const allTasksNodeRelationFormattedArr = allTasksNodeRelationArr;

        const newAffectedTasksList = allTasksNodeRelationFormattedArr.map((nodeItem) => {
            if (String(nodeItem._id) === task._id) {
                return {
                    task: nodeItem._id,
                    old: {
                        status: task.status,
                    },
                    new: {
                        status: currentStatus,
                    },
                }
            }
            return {
                task: nodeItem._id,
                old: undefined,
                new: undefined,
            }
        });
        console.log('newAffectedTasksList', newAffectedTasksList);
        await props.createProjectChangeRequestDispatch({
            creator: getStorage('userId'),
            name: `Cập nhật trạng thái công việc "${task?.name}"`,
            description: `Cập nhật trạng thái công việc "${task?.name}"`,
            requestStatus: 1,
            type: 'update_status_task',
            taskProject: projectDetail?._id,
            affectedTasksList: newAffectedTasksList,
        })
    }

    const isSaveDisabled = useCallback(
        () => {
            return (currentStatus === task?.status);
        },
        [currentStatus],
    )

    useEffect(() => {
        console.log(currentStatus)
    }, [currentStatus])

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-request-change-currentStatus-project-task-${id}`} isLoading={false}
                title={`Yêu cầu hoãn huỷ công việc`}
                hasNote={false}
                size={50}
                func={save}
                disableSubmit={isSaveDisabled()}
            >
                <div className="box">
                    <div className="box-body qlcv">
                        <div className={`form-group`}>
                            <label>Chuyển trạng thái công việc sang</label>
                            <SelectBox
                                id={`select-current-status-project-task-type`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={fakeStatusList}
                                onChange={(e) => setCurrentStatus(e[0])}
                                value={currentStatus}
                                multiple={false}
                            />
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks, user, project } = state;
    return { tasks, user, project };

}
const mapDispatchToProps = {
    createProjectChangeRequestDispatch: ChangeRequestActions.createProjectChangeRequestDispatch,
}

const connectedChangeStatusTask = connect(mapState, mapDispatchToProps)(withTranslate(ModalRequestChangeStatusProjectTask))
export { connectedChangeStatusTask as ModalRequestChangeStatusProjectTask }