import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import { DatePicker, TimePicker, ErrorLabel } from '../../../../common-components';
import { getStorage } from "../../../../config";

import { CallApiStatus } from '../../../auth/redux/reducers'
import TextareaAutosize from 'react-textarea-autosize';
import { performTaskAction } from './../redux/actions';
import './taskTimesheetLog.css';
import Swal from 'sweetalert2'
class TaskTimesheetLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: getStorage("userId"),
            time: new Date(),
            showModal: '',
            description: '',
            showEndDate: false,
            disabled: false,
            endDate: this.formatDate(Date.now()),
            dateStop: this.formatDate(Date.now()),
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
        this.setState({ showEndDate: false });
        this.callApi();
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        this.callApi(); // Khi logout rồi login vào website (hoặc login mới), chưa gọi API lấy task đang được bấm giờ trong componentDidMount -> Cần gọi lại

        if (nextProps.performtasks && nextProps.performtasks.currentTimer) {
            if (!this.timer) {
                this.setState({ showEndDate: false });
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

    checkValidateDate = (start, end) => {
        let mStart = moment(start);
        let mEnd = moment(end);
        return mEnd.isAfter(mStart);
    }

    stopTimer = async () => {
        const { performtasks } = this.props;
        let stoppedAt = new Date(); // mặc định lấy thời điểm hiện tại
        let autoStopped = 1;
        let check = true;
        if (this.state.showEndDate) {
            if (this.state.dateStop && this.state.timeStop) {
                stoppedAt = new Date((this.state.dateStop + " " + this.state.timeStop).replace(/-/g, '/'));
                if (!this.checkValidateDate(new Date(), stoppedAt)) {
                    check = false;
                    Swal.fire({
                        title: 'Chức năng chỉ cho phép hẹn tắt bấm giờ trong tương lai',
                        type: 'warning',
                        confirmButtonColor: '#dd4b39',
                        confirmButtonText: "Đóng",
                    })
                }
                autoStopped = 2;
            }
        }
        const timer = {
            employee: getStorage("userId"),
            startedAt: performtasks.currentTimer.timesheetLogs[0].startedAt,
            description: this.state.description,
            timesheetLog: performtasks.currentTimer.timesheetLogs[0]._id,
            stoppedAt,
            autoStopped
        };
        if (check) {
            await this.props.stopTimer(performtasks.currentTimer._id, timer);
            this.setState(state => {
                return {
                    ...state,
                    showModal: ""
                }
            });
        }

    }

    getDefaultValue = (value) => {
        this.setState({ timeStop: value });
    }
    handleDateChange = async (value) => {
        let a = value.split('-');
        let dateStop = a[2] + '-' + a[1] + '-' + a[0];
        await this.setState(state => {
            return {
                ...state,
                dateStop: dateStop
            }
        });
        // this.validateTime()
    }

    handleTimeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                timeStop: value
            }
        });
        // this.validateTime()

    }

    validateTime = () => {
        if (this.state.timeStop && this.state.dateStop) {
            const { performtasks } = this.props;
            var startedAt = performtasks.currentTimer?.timesheetLogs[0]?.startedAt
            var stoppedAt = this.state.dateStop + " " + this.state.timeStop
            var isoDate = new Date(stoppedAt).toISOString();
            var milisec = new Date(isoDate).getTime();
            if (milisec < startedAt) {
                this.setState({
                    disabled: true,
                    errorOnEndDate: "Thời điểm kết thúc phải sau khi bắt đầu bấm giờ"
                });
            } else {
                this.setState({
                    disabled: false,
                    errorOnEndDate: undefined
                });
            }

            //Check thời gian kết thúc không được gian lận
            // if(milisec - Date.now() > 300000) {
            //     this.setState({
            //         disabled: true,
            //         errorOnEndDate: "Thời điểm kết thúc không được vượt quá hiện tại"
            //     });
            // }
        }
    }

    endDate = (event) => {
        this.setState({
            showEndDate: event.target.checked
        });
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }
    formatDate1 = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [day, month, year].join('-');
    }

    getDiffTime = (time1, time2) => {
        if (!time1 || !time2) return 0;
        let timer1 = new Date(time1);
        let timer2 = new Date(time2);
        let diff = timer1.getTime() - timer2.getTime();

        return diff;
    }

    showTiming = (time) => {
        if (time <= 0) {
            return '__:__:__'
        } else {
            return moment.utc(time).format('HH:mm:ss')
        }
    }

    render() {

        const { translate, performtasks, auth } = this.props;
        const { showEndDate, disabled, errorOnEndDate, currentUser, time } = this.state
        const currentTimer = performtasks.currentTimer;
        const a = this.getDiffTime(this.state.time, currentTimer?.timesheetLogs[0].startedAt);

        return (
            <React.Fragment>
                {
                    currentTimer &&
                    <React.Fragment>
                        <div className="timesheet-box" id={currentUser} >
                            <div className="time">
                                <span>
                                    <i className="fa fa-stop-circle-o fa-lg" style={{ color: "red", cursor: "pointer" }} aria-hidden="true" title="Dừng bấm giờ" onClick={this.handleStopTimer}></i>
                                </span>
                                <span>&nbsp; {this.showTiming(a)}</span>
                                <a style={{ position: 'absolute', right: '10px' }} href={`/task?taskId=${currentTimer._id}`}><i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                            {this.state.showModal === auth.user.id &&
                                <React.Fragment>
                                    <h4 style={{ marginTop: '10px' }}>{currentTimer.name}</h4>
                                    <form>
                                        <input type="checkbox" id="stoppedAt" name="stoppedAt" onChange={this.endDate} />
                                        <label htmlFor="stoppedAt">&nbsp;Tự chọn ngày giờ kết thúc công việc</label>
                                    </form>

                                    {showEndDate &&
                                        <div className={`form-group ${!errorOnEndDate ? "" : "has-error"}`}>
                                            <ErrorLabel content={errorOnEndDate} />
                                            <DatePicker
                                                id={`date-picker-${currentTimer._id}`}
                                                onChange={this.handleDateChange}
                                                defaultValue={this.formatDate1(Date.now())}
                                            />
                                            <TimePicker
                                                id={`time-picker-${currentTimer._id}`}
                                                onChange={this.handleTimeChange}
                                                getDefaultValue={this.getDefaultValue}
                                            />
                                        </div>
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
                                    <button className="btn btn-primary" style={{ marginRight: 5 }} disabled={disabled} onClick={this.stopTimer}>Lưu</button>
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