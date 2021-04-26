import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import { ProjectGantt } from '../../../../common-components/src/gantt/projectGantt';
import { getDurationDaysWithoutSatSun } from './functionHelper';

const GanttTasksProject = (props) => {
    const currentProjectId = window.location.href.split('?id=')[1];
    const { translate, currentProjectTasks, user, project } = props;
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
        let count = { delay: 0, intime: 0, notAchived: 0 };
        // console.log('currentProjectTasks', currentProjectTasks)
        if (currentProjectTasks && currentProjectTasks.length > 0) {
            for (let taskItem of currentProjectTasks) {
                let start = moment(taskItem.startDate);
                let end = moment(taskItem.endDate);
                let now = moment(new Date());
                let duration = 0;
                if (currentMode === 'days') {
                    duration = getDurationDaysWithoutSatSun(taskItem.startDate, taskItem.endDate)
                } else if (currentMode === 'hours') {
                    duration = getDurationDaysWithoutSatSun(taskItem.startDate, taskItem.endDate, 'hours')
                } else {
                    duration = end.diff(start, currentMode);
                }
                if (duration == 0) duration = 1;
                let process = 0;

                // Tô màu công việc
                if (taskItem.status != "inprocess") {
                    process = 3;
                }
                else if (now > end) {
                    process = 2; // Quá hạn
                    count.notAchived++;
                }
                else {
                    let processDay = Math.floor(taskItem.progress * duration / 100);
                    let uptonow = now.diff(start, currentMode);

                    if (uptonow > processDay) {
                        process = 0; // Trễ hạn
                        count.delay++;
                    }
                    else if (uptonow <= processDay) {
                        process = 1; // Đúng hạn
                        count.intime++;
                    }
                }
                data.push({
                    id: taskItem._id,
                    text: taskItem.status == "inprocess" ? `${taskItem.name} - ${taskItem.progress}%` : taskItem.name,
                    taskName: `${taskItem.name}`,
                    responsible: `${taskItem.responsibleEmployees.map(resItem => resItem.name).join(', ')}`,
                    customDuration: duration,
                    start_date: moment(taskItem.startDate).format("YYYY-MM-DD HH:mm"),
                    end_date: moment(taskItem.endDate).format("YYYY-MM-DD HH:mm"),
                    progress: taskItem.status === "inprocess" ? taskItem.progress / 100 : 0,
                    process,
                    parent: '0',
                })

                // Nếu task có các task tiền nhiệm thì tạo link
                if (taskItem.preceedingTasks && taskItem.preceedingTasks.length > 0) {
                    for (let preceedingItem of taskItem.preceedingTasks) {
                        links.push({
                            id: linkId,
                            source: preceedingItem.task,
                            target: taskItem._id,
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
            count,
            line,
            links,
        };
    }

    return (
        <React.Fragment>
            <div style={{ marginTop: '20px' }}>
                <>
                    <ProjectGantt
                        ganttData={dataTask}
                        zoom={currentZoom}
                        status={taskStatus}
                        line={dataTask.line}
                        onZoomChange={handleZoomChange}
                    />
                    <div className="form-inline" style={{ textAlign: 'center' }}>
                        <div className="form-group">
                            <div id="in-time"></div>
                            <label id="label-for-calendar">{translate('task.task_management.in_time')}({dataTask.count && dataTask.count.intime ? dataTask.count.intime : 0})</label>
                        </div>
                        <div className="form-group">
                            <div id="delay"></div>
                            <label id="label-for-calendar">{translate('task.task_management.delayed_time')}({dataTask.count && dataTask.count.delay ? dataTask.count.delay : 0})</label>
                        </div>
                        <div className="form-group">
                            <div id="not-achieved"></div>
                            <label id="label-for-calendar">{translate('task.task_management.not_achieved')}({dataTask.count && dataTask.count.notAchived ? dataTask.count.notAchived : 0})</label>
                        </div>
                    </div>
                </>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GanttTasksProject));