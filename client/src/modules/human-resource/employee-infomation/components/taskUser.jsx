import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { taskManagementService } from "../../../task/task-management/redux/services";
import { formatPriority, getTotalTimeSheetLogs, formatStatus } from "../../../task/task-management/component/functionHelpers.js"
import { taskManagementActions } from "../../../task/task-management/redux/actions";
import Swal from 'sweetalert2';
import { SelectMulti, forceCheckOrVisible } from '../../../../common-components';
function areEqual(prevProps, nextProps) {
    if (prevProps.user._id === nextProps.user._id && prevProps.search === nextProps.search ){
        return true
    } else {
        return false
    }
}
function TaskUser(props) {
    const [taskResponsible, setTaskResponsible] = useState()
    const [nameTask, setNameTask] = useState(" thực hiện ")
    const [taskAccountable, setTaskAccountable] = useState()
    const [taskConsulted, setTaskConsulted] = useState()
    const [taskInformed, setTaskInformed] = useState()
    const [taskCreator, setTaskCreator] = useState()
    const [resultShow, setResultShow] = useState(false)
    const [status, setStatus] = useState([1, 0, 0, 0, 0])
    const [updateDelete, setUpdateDelete] = useState(0)
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
    }, [props.user._id, props.startDate, props.endDate,updateDelete])
    const handChangeStatus = (index) => {
        let name 
        switch (index) {
            case 0:
                name="thực hiện"
                break
            case 1:
                name="phê duyệt"
                break
            case 2:
                name="tư vấn"
                break
            case 3:
                name="quan sát"
                break
            case 4:
                name="đã tạo"
                break
        }
        let data = [0, 0, 0, 0, 0]
        data[index] = 1
        handleNameTask(name)
        setStatus(data)
    }
    const handleNameTask = (taskName) => {
        setNameTask(taskName)
    }
    const handleDelete = async (id,name) => {
        const { tasks, translate } = props;
            Swal.fire({
                title: `Bạn có chắc chắn muốn xóa công việc "${name}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: translate('general.no'),
                confirmButtonText: translate('general.yes'),
            }).then(async (result) => {
                if (result.value) {
                    await props.deleteTaskById(id);
                    await setUpdateDelete(updateDelete+1)
                }
            })

    }
    const showData = (data) => {
        let result = null
        if (data.length !== 0) {
            result = data.map((x, index) => {
                console.log(x);
                return (
                    <tr key={index}>
                        <td>{x.name}</td>
                        <td>{x.project || null}</td>
                        <td>{formatPriority(translate, x.priority)}</td>
                        <td>{formatStatus(translate, x.status)}</td>
                        <td>{x.progress ? x.progress + "%" : "0%"}</td>
                        <td>{getTotalTimeSheetLogs(x.timesheetLogs)}</td>
                        <td>
                        <a style={{ cursor: 'pointer' }} onClick={() =>handleDelete(x._id,x.name)} className="delete" title={translate('task.task_management.action_delete')}>
                        <i className="material-icons"></i>
                    </a></td>
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
    const handleNavTabs = (value,id) => {
        if (value) {
            handChangeStatus(id)
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }
    return (
        <div className="nav-tabs-custom">
        <ul className="nav nav-tabs">
                <li className="active"><a href="#taskResponsible" data-toggle="tab" onClick={() => handleNavTabs(true,0)}>Công việc thực hiện : {taskResponsible ? taskResponsible.totalCount : 0}</a></li>
                <li><a href="#taskAccountable" data-toggle="tab" onClick={() => handleNavTabs(true,1)}>Công việc phê duyệt : {taskAccountable ? taskAccountable.totalCount : 0}</a></li>
                <li><a href="#taskConsulted" data-toggle="tab" onClick={() => handleNavTabs(true,2)}>Công việc tư vấn : {taskConsulted ? taskConsulted.totalCount : 0}</a></li>
                <li><a href="#taskInformed" data-toggle="tab" onClick={() => handleNavTabs(true,3)}>Công việc quan sát : {taskInformed ? taskInformed.totalCount : 0}</a></li>
                <li><a href="#taskCreator" data-toggle="tab" onClick={() => handleNavTabs(true,4)}>Công việc đã tạo : {taskCreator ? taskCreator.tasks.length : 0}</a></li>
            </ul>
            <div className="row">
                <div className="col-xs-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div class="title">Công việc {nameTask}</div>
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
                                    <th >{translate('table.action')}</th>
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
                    </div>
                </div>
            </div>
            {!resultShow && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
        </div>


    )
}
function mapState(state) {
    const { } = state;

    return {}
}

const mapDispatchToProps = {
    deleteTaskById: taskManagementActions._delete,
}



export default connect(mapState, mapDispatchToProps)(withTranslate(React.memo(TaskUser,areEqual)));