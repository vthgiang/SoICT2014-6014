import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import { DatePicker } from '../../../../common-components';
import { getStorage } from "../../../../config";

import { CallApiStatus } from '../../../auth/redux/reducers'
import TextareaAutosize from 'react-textarea-autosize';
import { performTaskAction } from './../redux/actions';
import './taskTimesheetLog.css';
class TaskTimesheetLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: '',
            description: ''
        }
        this.sendQuery = false;
    }

    callApi = () => {
        if (!this.called && this.props.auth.calledAPI === CallApiStatus.FINISHED) {
            this.props.getStatusTimer();
            this.called = true;
        }
    }

    componentDidUpdate = () => {
        //Timepicker
        window.$('#timepicker').timepicker({
            showInputs: false
        })
    }
    componentDidMount = () => {
        
        this.callApi();
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        this.callApi(); // Khi logout rồi login vào website (hoặc login mới), chưa gọi API lấy task đang được bấm giờ trong componentDidMount -> Cần gọi lại

        if (nextProps.performtasks && nextProps.performtasks.currentTimer) {
            if (!this.timer) {
                this.timer = setInterval(() => this.setState(state => {
                    return {
                        ...state,
                        time: new Date()
                    }
                }), 1000);
            }
        } else {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }

        return true;
    }

    componentWillUnmount = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    handleStopTimer = (e) => {
        e.stopPropagation();
        const { auth } = this.props;
        this.setState(state => {
            return {
                ...state,
                showModal: auth.user.id
            }
        });
    }
    resumeTimer = () => {
        this.setState(state => {
            return {
                ...state,
                showModal: '',
                description: ''
            }
        });
    }
    stopTimer = async () => {
        const { performtasks, auth } = this.props;

        const timer = {
            startedAt: performtasks.currentTimer.timesheetLogs[0].startedAt,
            description: this.state.description,
            timesheetLog: performtasks.currentTimer.timesheetLogs[0]._id
        };
        await this.props.stopTimer(performtasks.currentTimer._id, timer);
        this.setState(state => {
            return {
                ...state,
                showModal: ""
            }
        });
    }
    handleDateChange = async (value) => {
        console.log(value)
    }
    abc = (value) => {
        console.log(value)
    }
    render() {

        const { translate, performtasks, auth } = this.props;
        const currentTimer = performtasks.currentTimer;
        const a = (this.state.time - currentTimer?.timesheetLogs[0].startedAt > 0) ? this.state.time - currentTimer?.timesheetLogs[0].startedAt : 0
        return (
            <React.Fragment>
                {
                    currentTimer &&
                    <React.Fragment>
                        <div className="timesheet-box">
                            <h4>Bấm giờ công việc</h4>
                            <div>{currentTimer.name} <a href={`/task?taskId=${currentTimer._id}`}><i className="fa fa-arrow-circle-right"></i></a></div>
                            <div className="time">
                                <span>
                                    <i className="fa fa-stop-circle-o fa-lg" style={{ color: "red", cursor: "pointer" }} aria-hidden="true" title="Dừng bấm giờ" onClick={this.handleStopTimer}></i>
                                </span>
                                <span>&nbsp; {moment.utc(a).format('HH:mm:ss')}</span>
                            </div>

                            {this.state.showModal === auth.user.id &&
                                <React.Fragment>
                                    {a > 20000 &&
                                    <React.Fragment>
                                        <DatePicker
                                            id={"Thanh-dep-trai"}
                                            onChange={this.handleDateChange}
                                        />
                                        <div className="bootstrap-timepicker">
                                            <div className="form-group">
                                            <label>Time picker:</label>
                                            <div className="input-group">
                                                <input type="text" id= "timepicker" className="form-control timepicker" onChange= {this.abc}  />
                                                <div className="input-group-addon">
                                                <i className="fa fa-clock-o"></i>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </React.Fragment>    
                                    }
                                    <br />
                                    <label>Mô tả công việc đã làm (*)</label>
                                    <TextareaAutosize
                                        style={{ width: '100%' }}
                                        placeholder={translate("task.task_perform.enter_description")}
                                        minRows={5}
                                        maxRows={20}
                                        onClick={(e) => { e.stopPropagation(); window.$(document).off('focusin.modal'); }}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            this.setState(state => {
                                                return { ...state, description: value }
                                            })
                                        }}
                                    />
                                    <button className="btn btn-primary" style={{ marginRight: 5 }} onClick={this.stopTimer}>Lưu</button>
                                    <button className="btn btn-danger" onClick={this.resumeTimer}>Hủy</button>
                                </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { translate, performtasks, auth } = state;
    return { translate, performtasks, auth };
}

const mapDispatchToProps = {
    getStatusTimer: performTaskAction.getTimerStatusTask,
    stopTimer: performTaskAction.stopTimerTask,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaskTimesheetLog));