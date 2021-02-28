import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment'

import ToolbarGantt from './toolbarGantt';
import './gantt.css';

class Gantt extends Component {
    constructor(props) {
        super(props);

        const gantt = window.initializationGantt();

        this.state = {
            gantt: gantt
        }

        this.initZoom();
    }

    dataProcessor = null;

    initZoom() { 
        const { translate } = this.props;
        const { gantt } = this.state;

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

    setZoom(value) {
        const { gantt } = this.state;
        
        if (gantt?.ext?.zoom) {
            gantt.ext.zoom.setLevel(value);
        }
    }

    initGanttDataProcessor() {
    }

    shouldComponentUpdate(nextProps) {
        const { ganttId } = this.props;
        const { gantt } = this.state;

        if (gantt) {
            gantt.clearAll();
            gantt.init(`gantt-${ganttId}`);
            this.initGanttDataProcessor();
            gantt.parse(this.props.ganttData);
    
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

        return true;
    }

    componentDidMount() {
        const { unit, translate } = this.props;
        const { gantt } = this.state;

        // Config biểu đồ
        if (gantt) {
            gantt.config.drag_move = false;
            gantt.config.drag_multiple = false;
            gantt.config.drag_progress = false;
            gantt.config.drag_resize = false;
            gantt.config.links = false;
            gantt.config.details_on_dblclick = false;
            gantt.config.columns = [{ name: 'role', label: unit ? translate('task.task_management.responsible') : translate('task.task_management.role'), align: "center", resize: true, width: 120 }]
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
                marker: true
            });
            gantt.templates.tooltip_text = function (start, end, task) {
                return `<b>${translate('task.task_dashboard.task_name')}:</b> ${task.text} 
                    <br/>
                    <b>${translate('task.task_dashboard.start_date')}:</b> ${moment(start).format('DD-MM-YYYY')} 
                    <br/>
                    <b>${translate('task.task_dashboard.end_date')}:</b> ${moment(end).format('DD-MM-YYYY')}`;
            };
    
            gantt.attachEvent("onTaskDblClick", (id, mode) => {
                this.props.attachEvent(id);
            });
        }
    }

    componentWillUnmount() {
        if (this.dataProcessor) {
            this.dataProcessor.destructor();
            this.dataProcessor = null;
        }
    }

    render() {
        const { ganttId, zoom, line, onZoomChange } = this.props;
        let heightCalc = line ? (line * 35 + 80) : 80;
        this.setZoom(zoom);

        return (
            <React.Fragment>
                <ToolbarGantt
                    zoom={zoom}
                    onZoomChange={onZoomChange}
                />
                <div className="gantt-container"
                    id={`gantt-${ganttId}`}
                    style={{ width: '100%', height: heightCalc }}
                />
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const {  } = state;
    return {  }
}
const actions = {
}
const ganttConnected = connect(mapState, actions)(withTranslate(Gantt))
export { ganttConnected as Gantt }