import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { taskManagementService } from "../../../task/task-management/redux/services";
import { formatPriority, getTotalTimeSheetLogs, formatStatus } from "../../../task/task-management/component/functionHelpers.js"

function TaskUser(props) {
    const [taskResponsible, setTaskResponsible] = useState()
    const [taskAccountable, setTaskAccountable] = useState()
    const [taskConsulted, setTaskConsulted] = useState()
    const [taskInformed, setTaskInformed] = useState()
    const [taskCreator, setTaskCreator] = useState()
    const [resultShow, setResultShow] = useState(false)
    const [status, setStatus] = useState([1, 0, 0, 0, 0])
    const { translate } = props
    useEffect(() => {
        if (props.startDate) {
            taskManagementService.getResponsibleTaskByUser(props.unitId, null, null, null, null, null, null, props.startDate, props.endDate, null, null, null, props.user._id)
                .then(res => {
                    let data = res.data.content
                    setTaskResponsible(data)
                })
            taskManagementService.getAccountableTaskByUser(props.unitId, null, null, null, null, null, null, props.startDate, props.endDate, null, null, null, props.user._id)
                .then(res => {
                    let data = res.data.content
                    setTaskAccountable(data)
                })
            taskManagementService.getConsultedTaskByUser(props.unitId, null, null, null, null, null, null, props.startDate, props.endDate, null, null, null, props.user._id)
                .then(res => {
                    let data = res.data.content
                    setTaskConsulted(data)
                })
            taskManagementService.getInformedTaskByUser(props.unitId, null, null, null, null, null, null, props.startDate, props.endDate, null, null, null, props.user._id)
                .then(res => {
                    let data = res.data.content
                    setTaskInformed(data)
                })
            taskManagementService.getCreatorTaskByUser(props.unitId, null, null, null, null, null, null, props.startDate, props.endDate, null, null, null, props.user._id)
                .then(res => {
                    let data = res.data.content
                    setTaskCreator(data)
                })
        }
    }, [props.user._id, props.startDate, props.endDate])
    const handChangeStatus = (index) => {
        switch (index) {
            case 0:
                props.changeTask(" thực hiện")
                break
            case 1:
                props.changeTask(" phê duyệt")
                break
            case 2:
                props.changeTask(" tư vấn")
                break
            case 3:
                props.changeTask("quan sát")
                break
            case 4:
                props.changeTask(" đã tạo")
                break
        }
        let data = [0, 0, 0, 0, 0]
        data[index] = 1
        setStatus(data)
    }
    const showData = (data) => {
        let result = null
        if (data.length !== 0) {
            result = data.map((x, index) => {
                return (
                    <tr key={index}>
                        <td>{x.name}</td>
                        <td>{x.project || null}</td>
                        <td>{formatPriority(translate, x.priority)}</td>
                        <td>{formatStatus(translate, x.status)}</td>
                        <td>{x.progress ? x.progress + "%" : "0%"}</td>
                        <td>{getTotalTimeSheetLogs(x.timesheetLogs)}</td>
                    </tr>
                )
            })
            if (!resultShow) {
                setResultShow(true)
            }
        } else {
            if (resultShow) {
                setResultShow(false)
            }
        }
        return result
    }
    return (
        <div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={() => handChangeStatus(0)} >
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person
                </span>
                        <span style={{ fontWeight: 'bold' }}>{props.user.name || null} thực hiện</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number">{taskResponsible ? taskResponsible.totalCount : 0}</span>
                </div>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={() => handChangeStatus(1)}>
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person
                </span>
                        <span style={{ fontWeight: 'bold' }}>{props.user.name || null} phê duyệt</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number">{taskAccountable ? taskAccountable.totalCount : 0}</span>
                </div>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={() => handChangeStatus(2)}>
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person
                </span>
                        <span style={{ fontWeight: 'bold' }}>{props.user.name || null} tư vấn</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number">{taskConsulted ? taskConsulted.totalCount : 0}</span>
                </div>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={() => handChangeStatus(3)}>
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person_search
                </span>
                        <span style={{ fontWeight: 'bold' }}>{props.user.name || null} quan sát</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number">{taskInformed ? taskInformed.totalCount : 0}</span>
                </div>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={() => handChangeStatus(4)}>
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person_add
                </span>
                        <span style={{ fontWeight: 'bold' }}>{props.user.name || null} đã tạo</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number">{taskCreator ? taskCreator.tasks.length : 0}</span>
                </div>
            </div>
            <table className="table table-striped table-bordered table-hover box-body">
                <thead>
                    <tr>
                        <th>{translate('task.task_management.col_name')}</th>
                        <th>{translate('task.task_management.col_project')}</th>
                        <th>{translate('task.task_management.col_priority')}</th>
                        <th>{translate('task.task_management.col_status')}</th>
                        <th>{translate('task.task_management.col_progress')}</th>
                        <th>{translate('task.task_management.col_logged_time')}</th>
                    </tr>
                </thead>
                <tbody>
                    {taskResponsible && status[0] === 1 &&
                        showData(taskResponsible.tasks)
                    }


                    {taskAccountable && status[1] === 1 &&
                        showData(taskAccountable.tasks)
                    }

                    {taskConsulted && status[2] === 1 &&
                        showData(taskConsulted.tasks)
                    }

                    {taskInformed && status[3] === 1 &&
                        showData(taskInformed.tasks)
                    }

                    {taskCreator && status[4] === 1 &&
                        showData(taskCreator.tasks)
                    }
                </tbody>
            </table>
            {!resultShow && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
        </div>

    )
}
function mapState(state) {
    const { } = state;

    return {}
}

const mapDispatchToProps = {

}



export default connect(mapState, mapDispatchToProps)(withTranslate(TaskUser));