import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment'
import { getStorage } from '../../../config';

import ToolbarGantt from './toolbarGantt';
import './gantt.css';

function ProjectGantt(props) {
    const { translate } = props;
    const { ganttId, zoom, line, onZoomChange, unit, ganttData } = props;
    const [dataProcessor, setDataProcessor] = useState(null);
    const [lang, setLang] = useState(getStorage('lang'))
    const [gantt, setGantt] = useState(window.initializationGantt());

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
                    resize: true,
                    width: '*',
                },
                {
                    name: 'responsible',
                    label: 'Người thực hiện',
                    resize: true,
                    width: '*',
                },
                {
                    name: 'customDuration',
                    label: `Thời lượng (${zoom})`,
                    align: 'center',
                    resize: true,
                    width: '*',
                }
            ]
            gantt.config.xml_date = "%Y-%m-%d %H:%i";

            // Màu sắc cho công việc
            gantt.templates.task_class = function (start, end, task) {
                switch (task.process) {
                    case 0:
                        return "delay";
                    case 1:
                        return "intime";
                    case 2:
                        return "notAchive";
                    default: return "none";
                }
            };

            // Thêm và custom tooltip
            gantt.plugins({
                tooltip: true,
                marker: true,
                // critical_path: true,
            });
            gantt.templates.tooltip_text = function (start, end, task) {
                return `<b>${translate('task.task_dashboard.task_name')}:</b> ${task.taskName} 
                    <br/>
                    <b>${translate('task.task_dashboard.start_date')}:</b> ${moment(start).format("DD-MM-YYYY hh:mm A")} 
                    <br/>
                    <b>${translate('task.task_dashboard.end_date')}:</b> ${moment(end).format("DD-MM-YYYY hh:mm A")}
                    <br/>
                    <b>Tiến độ:</b> ${Number(task.progress) * 100}%`;
            };

            gantt.attachEvent("onTaskDblClick", (id, mode) => {
                props.attachEvent(id);
            });
            // gantt.config.highlight_critical_path = true;
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

            // Thêm marker thời gian hiện tại
            const dateToStr = gantt.date.date_to_str(gantt.config.task_date);
            const markerId = gantt.addMarker({
                start_date: new Date(),
                css: "today",
                text: "Now",
                title: dateToStr(new Date())
            });
            gantt.getMarker(markerId);
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
                width: '*',
            },
            {
                name: 'responsible',
                label: 'Người thực hiện',
                resize: true,
                width: '*',
            },
            {
                name: 'customDuration',
                label: `Thời lượng (${zoom})`,
                align: 'center',
                resize: true,
                width: '*',
            }
        ]
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

    let heightCalc = line ? (line * 50 + 80) : 80;
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