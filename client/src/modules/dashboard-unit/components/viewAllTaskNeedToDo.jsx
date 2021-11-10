import React from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

const ViewAllTaskNeedToDo = (props) => {

    let taskNeedTodo = props.chartData;

    taskNeedTodo = taskNeedTodo?.length > 0 && taskNeedTodo.reduce((groups, item) => {
        if (item?.organizationalUnit?.name) {
            groups[item.organizationalUnit.name] = [...groups[item.organizationalUnit.name] || [], item];
        }

        return groups;
    }, []);

    let unit = null, taskNeedTodoUnit = [];
    if (props.clickNeedTodoChart) {
        unit = props.clickNeedTodoChart;
        taskNeedTodoUnit = taskNeedTodo[unit]
    }
    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={'modal-view-all-task-need-to-do'} isLoading={false}
                formID={`modal-view-all-task-need-to-do`}
                title={`Danh sách các công việc cần làm - ${props.clickNeedTodoChart && props.clickNeedTodoChart.name ? props.clickNeedTodoChart.name : ""}`}
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
                                taskNeedTodoUnit?.length > 0 && taskNeedTodoUnit.map((obj, index) => (
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

export default connect(null, null)(withTranslate(ViewAllTaskNeedToDo));