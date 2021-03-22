import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

const ViewAllTaskUrgent = (props) => {
    let taskUrgent = props.data;

    taskUrgent = taskUrgent.reduce((groups, item) => {
        if (item?.organizationalUnit?.name) {
            groups[item.organizationalUnit.name] = [...groups[item.organizationalUnit.name] || [], item];
        }

        return groups;
    }, []);

    let unit = null, taskUrgentUnit = [];
    if (props.clickUrgentChart) {
        unit = props.clickUrgentChart.id;
        taskUrgentUnit = taskUrgent[unit]
    }


    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={'modal-view-all-task-urgent'} isLoading={false}
                formID={`modal-view-all-task-urgent`}
                title={`Danh sách các công việc khẩn cấp - ${props.clickUrgentChart && props.clickUrgentChart.name ? props.clickUrgentChart.name : ""}`}
                hasSaveButton={false}
                hasNote={false}
            >
                <form className="form-group" id={`modal-view-all-task-urgent`}>
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
                                taskUrgentUnit?.length > 0 && taskUrgentUnit.map((obj, index) => (
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

export default connect(null, null)(withTranslate(ViewAllTaskUrgent));