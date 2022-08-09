import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment'
import { getStorage } from '../../../config';

import ToolbarGantt from './toolbarGantt';
import './projectGantt.css';
import { numberWithCommas } from '../../../modules/task/task-management/component/functionHelpers';

const BAR_HEIGHT = 16

function ProjectGantt(props) {
    const { translate } = props;
    const { ganttId, zoom, line, onZoomChange, unit, ganttData } = props;
    const [dataProcessor, setDataProcessor] = useState(null);
    const [lang, setLang] = useState(getStorage('lang'))
    const [gantt, setGantt] = useState(window.initializationGantt());
    
    const draw_planned = (task) => {
        if (task.planned_start && task.planned_end) {
            var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
            var el = document.createElement('div');
            el.className = 'baseline';
            el.style.left = sizes.left + 'px';
            el.style.width = sizes.width + 'px';
            el.style.top = sizes.top + gantt.config.bar_height + 13 + 'px';
            return el;
        }
        return false;
    }

    const renderTaskName = (task) => {
        if (task.type === 'task') {
            return "<div class='text-primary'>" + task.taskName + "</div>";
        }
        if (task.type === 'milestone') {
            return "<div class='text-warning'>" + task.taskName + "</div>";
        }
        if (task.type === 'project') {
            return "<div style='font-weight: bold;'>" + task.taskName + "</div>";
        }
    }

    useEffect(() => {
        initZoom(gantt);

        // Config biểu đồ
        if (gantt) {
            gantt.config.drag_move = false;
            gantt.config.drag_multiple = false;
            gantt.config.drag_progress = false;
            gantt.config.drag_resize = false;
            gantt.config.autosize = true;
            gantt.config.details_on_dblclick = false;
            gantt.config.columns = [
                {
                    name: 'taskName',
                    label: 'Tên công việc',
                    tree: true,
                    resize: true,
                    width: '*',
                    template: renderTaskName,
                },
                // {
                //     name: 'responsible',
                //     label: 'Người thực hiện',
                //     resize: true,
                //     width: '*',
                // },
                {
                    name: 'customDuration',
                    label: `Thời lượng (${zoom})`,
                    align: 'center',
                    resize: true,
                    width: '*',
                }
            ]
            gantt.config.xml_date = "%Y-%m-%d %H:%i";

            gantt.config.task_height = BAR_HEIGHT;
            gantt.config.bar_height = BAR_HEIGHT;
            gantt.config.row_height = 42;
            gantt.locale.labels.baseline_enable_button = 'Set';
            gantt.locale.labels.baseline_disable_button = 'Remove';
            gantt.config.lightbox.sections = [
                { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
                { name: "time", map_to: "auto", type: "duration" },
                {
                    name: "baseline",
                    map_to: { start_date: "planned_start", end_date: "planned_end" },
                    button: true,
                    type: "duration_optional"
                }
            ];
            gantt.config.lightbox.project_sections= [
                {name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
                { name: "time", map_to: "auto", type: "duration" },
                {
                    name: "baseline",
                    map_to: { start_date: "planned_start", end_date: "planned_end" },
                    button: true,
                    type: "duration_optional"
                }
            ];
            
            gantt.locale.labels.section_baseline = "Planned";
            // Adding baseline display
            gantt.addTaskLayer(task => draw_planned(task));

            // Màu sắc cho công việc
            gantt.templates.task_class = function (start, end, task) {
                if (task.planned_end) {
                    var classes = ['has-baseline'];
                    if (end.getTime() > task.planned_end.getTime()) {
                        classes.push('overdue');
                    }
                    if (end.getTime() == start.getTime()) {
                        classes.push('notStart');
                    }
                    switch (task.process) {
                        case -1:
                            classes.push('baseline_item');
                            break;
                        case 0:
                            classes.push('delay');
                            break;
                        case 1:
                            classes.push('intime');
                            break;
                        case 2:
                            classes.push('notAchive');
                            break;
                        default:
                            classes.push('none');
                            break;
                    }
                    return classes.join(' ');
                }
            };

            // Thêm và custom tooltip
            gantt.plugins({
                tooltip: true,
                marker: true,
                // critical_path: true,
            });
            gantt.templates.tooltip_text = function (start, end, task) {
                return `${task.type === 'task'
                        ? `<b>${translate('task.task_dashboard.task_name')}:</b>`: task.type === 'project' 
                        ? `<b>${translate('project.task_management.phase')}:</b>`: task.type === 'milestone'
                        ? `<b>${translate('project.task_management.milestone')}:</b>`: ''}</b> ${task.taskName}</b>
                        <br/>
                        <b>Thời điểm bắt đầu dự kiến:</b> ${moment(task.planned_start).format("DD-MM-YYYY hh:mm A")} 
                        <br/>
                        <b>Thời điểm kết thúc dự kiến:</b> ${moment(task.planned_end).format("DD-MM-YYYY hh:mm A")}
                        <br/>
                        <b>Thời điểm bắt đầu thực tế:</b> ${moment(task.start_date).format("DD-MM-YYYY hh:mm A")}
                        <br/>
                        ${task.status === 'finished'
                        ? `<b>Thời điểm kết thúc thực tế:</b> ${moment(task.end_date).format("DD-MM-YYYY hh:mm A")}
                        <br/>`
                        : ``}
                        <b>Trạng thái :</b> ${task.status}
                        <br/>
                        <b>Tiến độ:</b> ${numberWithCommas(Number(task.progress) * 100)}%`;
            };

            // Hiển thị text quá hạn bao nhiêu ngày
            gantt.templates.rightside_text = function (start, end, task) {
                if (task.planned_end && task.type !== "milestone") {
                    if (end.getTime() > task.planned_end.getTime()) {
                        var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
                        var text = "<b>Quá hạn: " + overdue + " ngày</b>";
                        return text;
                    }
                }
                // console.log(Date.parse(task.actualEndDate));
                else if (task.planned_end && task.type === "milestone") {
                    if (Date.parse(task.actualEndDate) > task.planned_end.getTime()) {
                        var overdue = Math.ceil(Math.abs((Date.parse(task.actualEndDate) - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
                        var text = "<b>Quá hạn: " + overdue + " ngày</b>";
                        return text;
                    }
                } 
            };

            gantt.attachEvent("onTaskLoading", function (task) {
                task.planned_start = gantt.date.parseDate(task.planned_start, "xml_date");
                task.planned_end = gantt.date.parseDate(task.planned_end, "xml_date");
                return true;
            });

            gantt.attachEvent("onTaskDblClick", (id, e) => {
                props.attachEvent(id);
                console.log(e)
            });
            gantt.eachTask(function(task){
                task.$open = true;
            });
            gantt.render();
        }

        return () => {
            if (dataProcessor) {
                dataProcessor.destructor();
                setDataProcessor(null);
            }
        }
    }, [])

    useEffect(() => {
        if (gantt) {
            gantt.clearAll();
            gantt.init(`project-gantt-${ganttId}`);
            gantt.parse(ganttData);
            // Add lại layer baseline dự án khi re-render component
            gantt.addTaskLayer(task => draw_planned(task));

            // Thêm marker thời gian hiện tại
            const dateToStr = gantt.date.date_to_str(gantt.config.task_date);
            const markerId = gantt.addMarker({
                start_date: new Date(),
                css: "today",
                text: "Now",
                title: dateToStr(new Date())
            });
            gantt.getMarker(markerId);
            gantt.eachTask(function(task){
                task.$open = true;
            });
            gantt.render();
            
        }

        // Focus vào ngày hiện tại
        let date = new Date();
        let date_x = gantt.posFromDate(date);
        let scroll_to = Math.max(date_x - gantt.config.task_scroll_offset, 0);
        gantt.scrollTo(scroll_to);

        setZoom(gantt, zoom);
    })

    useEffect(() => {
        gantt.config.columns = [
            {
                name: 'taskName',
                label: 'Tên công việc',
                resize: true,
                tree: true,
                width: '*',
                template: renderTaskName,
            },
            // {
            //     name: 'responsible',
            //     label: 'Người thực hiện',
            //     resize: true,
            //     width: '*',
            // },
            {
                name: 'customDuration',
                label: `Thời lượng (${zoom})`,
                align: 'center',
                resize: true,
                width: '*',
            }
        ]
        gantt.eachTask(function(task){
            task.$open = true;
        });
        gantt.render();
    }, [zoom])

    const initZoom = (gantt) => {
        gantt.ext.zoom.init({
            levels: [
                {
                    name: translate('system_admin.system_setting.backup.hour'),
                    scale_height: 60,
                    min_column_width: 30,
                    scales: [
                        { unit: 'day', step: 1, format: '%d %M' },
                        { unit: 'hour', step: 1, format: '%H' }
                    ]
                },
                {
                    name: translate('system_admin.system_setting.backup.date'),
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                        { unit: 'week', step: 1, format: '# %W' },
                        { unit: 'day', step: 1, format: '%d %M' }
                    ]
                },
                {
                    name: translate('system_admin.system_setting.backup.week'),
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                        { unit: "month", step: 1, format: '%F' },
                        { unit: 'week', step: 1, format: 'Tuần %W' }
                    ]
                },
                {
                    name: translate('system_admin.system_setting.backup.month'),
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                        { unit: "year", step: 1, format: '%Y' },
                        { unit: "month", step: 1, format: '%F' }
                    ]
                }
            ]
        });
    }

    const setZoom = (gantt, value) => {
        let level = gantt?.ext?.zoom?.getLevels();
        if (level?.length > 0) {
            level = level.map(item => item?.name);
        }
        if (gantt?.ext?.zoom && level.includes(value)) {
            gantt.ext.zoom.setLevel(value);
        }
    }

    let heightCalc = line ? (line * 50) : 80;
    return (
        <React.Fragment>
            <ToolbarGantt
                zoom={zoom}
                onZoomChange={onZoomChange}
            />
            <div className="gantt-container"
                id={`project-gantt-${ganttId}`}
                style={{
                    width: '100%',
                    height: heightCalc
                }}
            />
        </React.Fragment>
    );
}

function mapState(state) {
    const { } = state;
    return {}
}
const actions = {
}
const ganttConnected = connect(mapState, actions)(withTranslate(ProjectGantt))
export { ganttConnected as ProjectGantt }