import React, { Component } from 'react';
import { connect } from 'react-redux';

import { TaskStatusChart } from './taskStatusChart';
import { DomainOfTaskResultsChart } from './domainOfTaskResultsChart';
import { TasksSchedule } from './tasksSchedule';
import { taskManagementActions } from '../../redux/actions';


class TaskDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "",
        };
    }
    componentDidMount() {
        this.handleLoadDataCalendar();
        this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null, null, null);
        this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getTaskByUser();
    }
    handleLoadDataCalendar = () => {
        window.$(function () {

            // /* initialize the external events
            //  -----------------------------------------------------------------*/
            // function init_events(ele) {
            //   ele.each(function () {

            //     // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            //     // it doesn't need to have a start or end
            //     var eventObject = {
            //       title: window.$.trim(window.$(this).text()) // use the element's text as the event title
            //     }

            //     // store the Event Object in the DOM element so we can get to it later
            //     window.$(this).data('eventObject', eventObject)

            //     // make the event draggable using jQuery UI
            //     // window.$(this).draggable({
            //     //   zIndex        : 1070,
            //     //   revert        : true, // will cause the event to go back to its
            //     //   revertDuration: 0  //  original position after the drag
            //     // })

            //   })
            // }

            // init_events(window.$('#external-events div.external-event'))

            /* initialize the calendar
             -----------------------------------------------------------------*/
            //Date for the calendar events (dummy data)
            var date = new Date()
            var d = date.getDate(),
                m = date.getMonth(),
                y = date.getFullYear()
            window.$('#calendarTask').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                buttonText: {
                    today: 'today',
                    month: 'month',
                    week: 'week',
                    day: 'day'
                },
                //Random default events
                events: [
                    {
                        title: 'Hoàn thành quy trình kiểm thử',
                        start: new Date(y, m, 1),
                        backgroundColor: '#f56954', //red
                        borderColor: '#f56954' //red
                    },
                    {
                        title: 'Long Event',
                        start: new Date(y, m, d - 5),
                        end: new Date(y, m, d - 2),
                        backgroundColor: '#f39c12', //yellow
                        borderColor: '#f39c12' //yellow
                    },
                    {
                        title: 'Meeting',
                        start: new Date(y, m, d, 10, 30),
                        allDay: false,
                        backgroundColor: '#0073b7', //Blue
                        borderColor: '#0073b7' //Blue
                    },
                    {
                        title: 'Lunch',
                        start: new Date(y, m, d, 12, 0),
                        end: new Date(y, m, d, 14, 0),
                        allDay: false,
                        backgroundColor: '#00c0ef', //Info (aqua)
                        borderColor: '#00c0ef' //Info (aqua)
                    },
                    {
                        title: 'Birthday Party',
                        start: new Date(y, m, d + 1, 19, 0),
                        end: new Date(y, m, d + 1, 22, 30),
                        allDay: false,
                        backgroundColor: '#00a65a', //Success (green)
                        borderColor: '#00a65a' //Success (green)
                    },
                    {
                        title: 'Click for Google',
                        start: new Date(y, m, 28),
                        end: new Date(y, m, 29),
                        url: 'http://google.com/',
                        backgroundColor: '#3c8dbc', //Primary (light-blue)
                        borderColor: '#3c8dbc' //Primary (light-blue)
                    }
                ],
                editable: false,
                droppable: false, // this allows things to be dropped onto the calendar !!!
                drop: function (date, allDay) { // this function is called when something is dropped

                    // // retrieve the dropped element's stored Event Object
                    // var originalEventObject = window.$(this).data('eventObject')

                    // // we need to copy it, so that multiple events don't have a reference to the same object
                    // var copiedEventObject = window.$.extend({}, originalEventObject)

                    // // assign it the date that was reported
                    // copiedEventObject.start           = date
                    // copiedEventObject.allDay          = allDay
                    // copiedEventObject.backgroundColor = window.$(this).css('background-color')
                    // copiedEventObject.borderColor     = window.$(this).css('border-color')

                    // // render the event on the calendar
                    // // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    // window.$('#calendarTask').fullCalendar('renderEvent', copiedEventObject, true)

                    // // is the "remove after drop" checkbox checked?
                    // if (window.$('#drop-remove').is(':checked')) {
                    //   // if so, remove the element from the "Draggable Events" list
                    //   window.$(this).remove()
                    // }

                }
            })

            // /* ADDING EVENTS */
            // var currColor = '#3c8dbc' //Red by default
            // //Color chooser button
            // var colorChooser = window.$('#color-chooser-btn')
            // window.$('#color-chooser > li > a').click(function (e) {
            //   e.preventDefault()
            //   //Save color
            //   currColor = window.$(this).css('color')
            //   //Add color effect to button
            //   window.$('#add-new-event').css({ 'background-color': currColor, 'border-color': currColor })
            // })
            // window.$('#add-new-event').click(function (e) {
            //   e.preventDefault()
            //   //Get value and make sure it is not null
            //   var val = window.$('#new-event').val()
            //   if (val.length == 0) {
            //     return
            //   }

            //   //Create events
            //   var event = window.$('<div />')
            //   event.css({
            //     'background-color': currColor,
            //     'border-color'    : currColor,
            //     'color'           : '#fff'
            //   }).addClass('external-event')
            //   event.html(val)
            //   window.$('#external-events').prepend(event)

            //   //Add draggable funtionality
            // //   init_events(event)

            //   //Remove event from text input
            //   window.$('#new-event').val('')
            // })
        })
    }
    generateDataPoints(noOfDps) {
        var xVal = 1, yVal = 100;
        var dps = [];
        for (var i = 0; i < noOfDps; i++) {
            yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
            dps.push({ x: xVal, y: yVal });
            xVal++;
        }
        return dps;
    }
    render() {
        const { tasks } = this.props;
        const options3 = {
            theme: "light2", // "light1", "dark1", "dark2"
            animationEnabled: true,
            zoomEnabled: true,
            exportEnabled: true,
            title: {
                text: "Try Zooming and Panning",
                fontWeight: "normal",
                fontFamily: "tahoma",
                fontSize: 25,
            },
            axisY: {
                includeZero: false
            },
            data: [{
                type: "area",
                dataPoints: this.generateDataPoints(500)
            }]
        }

        var amountResponsibleTask = 0;
        if (tasks && tasks.responsibleTasks) {
            let task = tasks.responsibleTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountResponsibleTask++;

            }
        }
        // Tinh so luong tat ca cac task 
        var amountResponsibleTask = 0;
        if (tasks && tasks.responsibleTasks) {
            let task = tasks.responsibleTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountResponsibleTask++;

            }
        }
        // tính số lượng task mà người này là creator
        var amountTaskCreated = 0;
        if (tasks && tasks.creatorTasks) {
            let task = tasks.creatorTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountTaskCreated++;

            }
        }
        // tính số lượng task mà người này cần phê duyệt
        var amountAccountableTasks = 0;
        if (tasks && tasks.accountableTasks) {
            let task = tasks.accountableTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountAccountableTasks++;
            }
        }
        // tính số lượng task mà người này là người hỗ trợ
        var amountConsultedTasks = 0;
        if (tasks && tasks.consultedTasks) {
            let task = tasks.consultedTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountConsultedTasks++;
            }
        }
        // Tinh tong so luong cong viec co trang thai Inprogess
        var numTask = [];
        var totalTasks = 0;
        if (tasks) {
            let tempObj = {};
            if (tasks.responsibleTasks)
                numTask = numTask.concat(tasks.responsibleTasks);
            if (tasks.creatorTasks)
                numTask = numTask.concat(tasks.creatorTasks);
            if (tasks.accountableTasks)
                numTask = numTask.concat(tasks.accountableTasks);
            if (tasks.consultedTasks)
                numTask = numTask.concat(tasks.consultedTasks);
            let i;
            for (i in numTask) {
                if (numTask[i].status === "Inprocess")
                    tempObj[numTask[i]._id] = numTask[i].name;
            }

            totalTasks = Object.keys(tempObj).length;

        }

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-plus" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Đã tạo</span>
                                <span className="info-box-number">{amountTaskCreated}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-spinner" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Cần thực hiện</span>
                                <span className="info-box-number">{amountResponsibleTask}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-check-square-o" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Cần phê duyệt</span>
                                <span className="info-box-number">{amountAccountableTasks}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix visible-sm-block" />
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-comments-o" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Cần hỗ trợ</span>
                                <span className="info-box-number">{amountConsultedTasks}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Miền kết quả công việc</div>
                            </div>
                            <DomainOfTaskResultsChart />
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Trạng thái công việc</div>
                            </div>
                            <TaskStatusChart />
                        </div>
                    </div>
                </div>

                <div className="row">

                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Công việc quá hạn</div>
                            </div>

                            <div className="box-body" style={{ height: "300px" }}>
                                {
                                    (tasks && tasks.tasksbyuser && tasks.tasksbyuser.expire.length !== 0) ?
                                        <ul className="todo-list">
                                            {
                                                tasks.tasksbyuser.expire.map(item =>
                                                    <li>
                                                        <span className="handle">
                                                            <i className="fa fa-ellipsis-v" />
                                                            <i className="fa fa-ellipsis-v" />
                                                        </span>
                                                        <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank">{item.task.name}</a></span>
                                                        <small className="label label-warning"><i className="fa fa-clock-o" />{item.totalDays} days</small>
                                                    </li>
                                                )
                                            }
                                        </ul> : "Không có công việc quá hạn"
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Công việc sắp hết hạn</div>
                            </div>
                            <div className="box-body" style={{ height: "300px" }}>
                                {
                                    (tasks && tasks.tasksbyuser && tasks.tasksbyuser.deadlineincoming.length !== 0) ?
                                        <ul className="todo-list">
                                            {
                                                tasks.tasksbyuser.deadlineincoming.map(item =>
                                                    <li>
                                                        <span className="handle">
                                                            <i className="fa fa-ellipsis-v" />
                                                            <i className="fa fa-ellipsis-v" />
                                                        </span>
                                                        <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank" />{item.task.name}</span>
                                                        <small className="label label-info"><i className="fa fa-clock-o" />{item.totalDays} days</small>
                                                    </li>
                                                )
                                            }
                                        </ul> : "Không có công việc nào sắp hết hạn"
                                }
                            </div>

                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Lịch công việc chi tiết</div>
                            </div>
                            <TasksSchedule />
                        </div>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}
function mapState(state) {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {
    getAllTaskByRole: taskManagementActions.getAllTaskByRole,
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getTaskByUser: taskManagementActions.getTasksByUser,

};
const connectedTaskDashboard = connect(mapState, actionCreators)(TaskDashboard);
export { connectedTaskDashboard as TaskDashboard };