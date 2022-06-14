import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Gantt } from '../../../../../../common-components';

function GanttCalendar(props) {
    const DEFAULT_INFOSEARCH = {
        taskStatus: ["inprocess"]
    }

    const [state, setState] = useState({
        currentZoom: props.translate('system_admin.system_setting.backup.date'),
        infoSearch: Object.assign({}, DEFAULT_INFOSEARCH),
        dataCalendar: {},
        unit: true,
        counter: 0,
    })

    function convertTime12To24(time) {
        var hours   = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM    = time.match(/\s(.*)$/)[1];
        if (AMPM === "PM" && hours < 12) hours = hours + 12;
        if (AMPM === "AM" && hours === 12) hours = hours - 12;
        var sHours   = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return (sHours + ":" + sMinutes);
    }

    /*Lịch*/
    const handleZoomChange = (zoom) => {
        setState({
            ...state,
            currentZoom: zoom
        });
    }


    const findFullUserInfor = (value) => {
        const { user } = props;
        let array = [];
        value.forEach(item => {
            let userFind = user.list.find(element => element._id === item)
            if (userFind) {
                array.push({
                    id: userFind._id,
                    name: userFind.name,
                    email: userFind.email,
                })
            }
        })
        return array;
    }

    if (props.counter !== state.counter) {
        let formatData = [];
        if (props.dataChart && props.dataChart.length > 0) {
            let dataCalendar = props.dataChart;
            dataCalendar.forEach((item) => {
                let itemStaffs = findFullUserInfor(item.workAssignmentStaffs);
                itemStaffs.forEach((itemStaff) => {
                    formatData.push({
                        id: itemStaff.name,
                        text: item.nameField,
                        role: itemStaff.name,
                        start_date: null,
                        duration: null,
                        render: 'spilit',
                        process: 1,
                    });
                    formatData.push({
                        id: itemStaff.name + '-' + itemStaff.id,
                        parent: itemStaff.name,
                        process: 1,
                        progress: 0,
                        text: item.nameField,
                        start_date: item.startDate.split("-").reverse().join("-") + ' ' + convertTime12To24(item.startTime),
                        end_date: item.endDate.split("-").reverse().join("-") + ' ' + convertTime12To24(item.endTime),
                    })
                });
            })
            if (formatData.length > 0) {
                let arr1 = [];
                let counter = 0;
                let arrCounter = [];
                let formatDataUniqe = getUnique(formatData, 'id');
                for (let i = 0; i < formatDataUniqe.length; i = i + 2) {
                    counter = 0;
                    for (let j = 0; j < formatData.length; j = j + 2) {
                        if (formatData[j].id === formatDataUniqe[i].id) {
                            counter++;
                            arr1.push(formatData[j]);
                            arr1.push(formatData[j + 1]);
                            arrCounter.push(counter);
                        }
                    }
                }
                for (let i = 0; i < arr1.length; i = i + 2) {
                    arr1[i].id = arr1[i].id + "-" + (arrCounter[i / 2] - 1);
                    if (arrCounter[i / 2] >= 2)
                        arr1[i].role = "";

                }
                for (let i = 1; i < arr1.length; i = i + 2) {
                    arr1[i].parent = arr1[i].parent + "-" + (arrCounter[(i - 1) / 2] - 1);
                    arr1[i].id = arr1[i].id + "-" + (arrCounter[(i - 1) / 2] - 1);
                }
                setState({
                    ...state,
                    dataCalendar: {
                        ...state.dataCalendar,
                        countAllTask: {
                            delay: 0,
                            intime: arr1.length / 2,
                            notAchived: 0,
                        },
                        dataAllTask: {
                            ...state.dataCalendar.dataAllTask,
                            data: arr1
                        },
                        lineAllTask: arr1.length / 2
                    },
                    counter: props.counter
                })
            }
        }
    }

    function getUnique(arr, index) {

        const unique = arr
            .map(e => e[index])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }

    const { currentZoom, dataCalendar, infoSearch, unit } = state
    return (
        <React.Fragment>
            <div className="gantt qlcv" >
                {
                    dataCalendar && dataCalendar.dataAllTask && dataCalendar.dataAllTask.data &&
                    <Gantt
                        ganttId="gantt-chart"
                        ganttData={dataCalendar?.dataAllTask}
                        zoom={currentZoom}
                        status={infoSearch.taskStatus}
                        count={dataCalendar?.countAllTask}
                        line={dataCalendar?.lineAllTask}
                        unit={unit}
                        onZoomChange={handleZoomChange}
                    />
                }
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GanttCalendar));
