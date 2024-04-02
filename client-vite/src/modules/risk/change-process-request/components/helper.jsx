import React from 'react'
export const getStatusStr = (translate, status, detail) => {
    let statusStr = ""
    // let icon = ""
    if (status == 'wait_for_approve') statusStr = translate('manage_change_process.wait_for_approve')
    if (status == 'canceled') statusStr = translate('manage_change_process.canceled')
    if (status == 'finished') statusStr = translate('manage_change_process.finished')
    if(detail == false) return statusStr
    let icon = "fa fa-check-circle";
    let color = "#088A08"
    // let statusStr =  translate('task.task_management.inprocess')

    if (status == "wait_for_approval"||status == "wait_for_approve") {
        color = "#FF8000"
        icon = "fa fa-arrow-circle-up"
        // statusStr =  translate('task.task_management.wait_for_approval');
    }
    if (status == "canceled"||status == "cancel") {
        color = "#6E6E6E"
        icon = "fa fa-window-close";
        // statusStr = translate('task.task_management.canceled');
    }

    if (status == "finished") {
        icon = "fa fa-check-circle"
        // color="#0101DF"
        // statusStr = translate('task.task_management.finished');
    }
    if (detail) {
        return <React.Fragment>
            <p style={{ color: color, textAlign: 'center' }}>

                <i className={icon} />


                <span>{statusStr}</span>

            </p>
        </React.Fragment>
    }
    return <React.Fragment><div style={{ color: color, textAlign: 'center' }}>
        <div className="row">
            <i className={icon} />
        </div>
        <div>
            <p className="row">{statusStr}</p>
        </div>
    </div>
    </React.Fragment>
}