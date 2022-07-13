import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import { convertUserIdToUserName } from '../../../../project/projects/components/functionHelper';
import { TaskGantt } from '../../../../../common-components/src/gantt/taskGantt';
import { UserActions } from '../../../../super-admin/user/redux/actions';

const ViewTaskInGantt = (props) => {
    const { translate, taskList, allEmployee } = props;
    const [currentZoom, setCurrentZoom] = useState(translate('system_admin.system_setting.backup.date'));
    const [dataTask, setDataTask] = useState({
        data: [],
        links: [],
        count: 0,
        line: 0,
    });
    const taskStatus = ["inprocess"];
    const handleZoomChange = (zoom) => {
        setCurrentZoom(zoom);
        setDataTask(getDataTask(zoom));
    }
    const attachEvent = (id) => {
        if (!RegExp(/baseline/g).test(String(id))) {
            props.getTaskById(id);
            window.$(`#modal-detail-task-Employee`).modal('show');
        }
    }

    useEffect(() => {
        setDataTask(getDataTask());
    }, [])

    const getDataTask = (zoom = currentZoom) => {
        // Dựa vào currentZoom để tính toán duration theo giờ, ngày, tuần, tháng
        let currentMode = '';
        switch (zoom) {
            case translate('system_admin.system_setting.backup.hour'): {
                currentMode = 'hours';
                break;
            }
            case translate('system_admin.system_setting.backup.date'): {
                currentMode = 'days';
                break;
            }
            case translate('system_admin.system_setting.backup.week'): {
                currentMode = 'weeks';
                break;
            }
            case translate('system_admin.system_setting.backup.month'): {
                currentMode = 'months';
                break;
            }
            default: {
                break;
            }
        }
        let data = [], links = [], linkId = 0, line = 0;
        let taskWithTime = [];
        if (taskList && taskList.length > 0) {
            for (let taskItem of taskList) {
                let start = moment(new Date());
                let end = moment(start).add(Number(taskItem.estimateTime), taskItem.unitOfTime).toDate();
                let now = moment(new Date());

                if (taskItem.preceedingTasks && taskItem.preceedingTasks.length > 0) {
                    let preceedingTaskArr = taskItem.preceedingTasks?.map(x => x.trim()) ?? [];

                    let preTasks = taskWithTime.filter(x => preceedingTaskArr.indexOf(String(x.code.trim())) !== -1);
                    preTasks.sort((a, b) => {
                        console.log(a.end, b.end);
                        return -moment(a.end).diff(moment(b.end));
                    })
                    if (preTasks[0]?.end) {
                        start = preTasks[0]?.end;
                        end = moment(start).add(Number(taskItem.estimateTime), taskItem.unitOfTime).toDate();
                    }
                }

                taskWithTime.push({
                    ...taskItem,
                    start: start,
                    end: end
                })
            }
        }
        if (taskWithTime && taskWithTime.length > 0) {
            for (let taskItem of taskWithTime) {
                data.push({
                    id: taskItem.code,
                    text: taskItem.taskName,
                    estimateTime: taskItem.estimateTime,
                    taskName: `${taskItem.taskName}`,
                    // responsible: `${taskItem.responsibleEmployees.map(resItem => convertUserIdToUserName( , resItem.name)).join(', ')}`,
                    start_date: moment(taskItem.start).format("YYYY-MM-DD HH:mm"),
                    end_date: moment(taskItem.end).format("YYYY-MM-DD HH:mm"),
                });

                // Nếu task có các task tiền nhiệm thì tạo link
                if (taskItem.preceedingTasks && taskItem.preceedingTasks.length > 0) {
                    // let preceedingTaskArr = taskItem.preceedingTasks.split(',').map(x => x.trim());
                    let preceedingTaskArr = taskItem.preceedingTasks?.map(x => x.trim()) ?? [];
                    for (let preceedingItem of preceedingTaskArr) {
                        links.push({
                            id: linkId,
                            source: preceedingItem,
                            target: taskItem.code,
                            type: '0',
                        })
                        linkId++;
                    }

                }
            }
            line = data.length;
        }
        return {
            data,
            // count,
            line,
            links,
        };
    }

    return (
        <React.Fragment>
            <div style={{ marginTop: '0px' }}>
                <>
                    <TaskGantt
                        ganttData={dataTask}
                        zoom={currentZoom}
                        line={dataTask.line}
                        onZoomChange={handleZoomChange}
                    // attachEvent={attachEvent}
                    />
                </>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user, tasks } = state;
    return { project, user, tasks }
}

const mapDispatchToProps = {
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}
const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(ViewTaskInGantt));
export { connectedComponent as ViewTaskInGantt }