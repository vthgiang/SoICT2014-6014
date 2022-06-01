import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs'
import { withTranslate } from 'react-redux-multilingual';

import { performTaskAction } from '../../../../../task/task-perform/redux/actions';

import { Gantt } from '../../../../../../common-components';

let infoSearch = {
    taskStatus: ["inprocess"]
}
function GanttCalendar(props) {
    const DEFAULT_INFOSEARCH = {
        taskStatus: ["inprocess"]
    }

    const DEFAULT_DATA_CALENDAR = {
        countAllTask: {
            delay: 0,
            intime: 0,
            notAchived: 0,
        },
        dataAllTask: [],
        lineAllTask: 0,
    }

    const [state, setState] = useState({
        currentZoom: props.translate('system_admin.system_setting.backup.date'),
        messages: [],
        taskStatus: ["inprocess"],
        infoSearch: Object.assign({}, DEFAULT_INFOSEARCH),
        dataCalendar: Object.assign({}, DEFAULT_DATA_CALENDAR),
        unit: true,
    })


    /*Lịch*/

    const handleZoomChange = (zoom) => {
        setState({
            ...state,
            currentZoom: zoom
        });
    }

    const { translate, dataCalendar, unit, tasks } = props
    const { taskDashboardCharts } = tasks
    const { currentZoom } = state

    const count = dataCalendar?.countAllTask;
    const task = tasks && tasks.task;

    console.log("dataCalendar", dataCalendar);
    console.log("infoSearch", infoSearch);
    console.log("unit", unit);

    return (
        <React.Fragment>
            <div className="gantt qlcv" >
                {/* <Gantt
                    ganttId="gantt-chart"
                    ganttData={dataCalendar?.dataAllTask}
                    zoom={currentZoom}
                    status={infoSearch.taskStatus}
                    count={dataCalendar?.countAllTask}
                    line={dataCalendar?.lineAllTask}
                    unit={unit}
                    onZoomChange={handleZoomChange}
                    attachEvent={attachEvent}
                /> */}

                <Gantt
                    ganttId="gantt-chart"
                    ganttData={''}
                    zoom={currentZoom}
                    status={''}
                    count={''}
                    line={''}
                    unit={''}
                    onZoomChange={handleZoomChange}
                // attachEvent={attachEvent}
                />
            </div>

        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { tasks } = state;
    return { tasks }
}
const mapDispatchToProps = {
    getTaskById: performTaskAction.getTaskById,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GanttCalendar));
