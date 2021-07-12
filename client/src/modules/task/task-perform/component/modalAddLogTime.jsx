import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DatePicker, ErrorLabel, TimePicker } from '../../../../common-components';
import TextareaAutosize from 'react-textarea-autosize';
import { formatDate } from '../../../../helpers/formatDate';
import ValidationHelper from '../../../../helpers/validationHelper';
import moment from 'moment';
import { performTaskAction } from '../redux/actions';
import Swal from 'sweetalert2'
import './actionTab.css'
function ModalAddLogTime(props) {
    const [state, setState] = useState({
        addLogTimeDate: formatDate(Date.now()),
    })

    const checkValidateDate = (start, end) => {
        let mStart = moment(start);
        let mEnd = moment(end);
        return mEnd.isAfter(mStart);
    }

    const handleChangeDateAddLog = (value) => {
        const { translate } = props;
        const DateSplit = value.split("-");
        let addLogTimeDate = DateSplit[2] + '-' + DateSplit[1] + '-' + DateSplit[0];

        let { message } = ValidationHelper.validateEmpty(translate, value);
        const checkDateAddLog = checkValidateDate(moment().format('YYYY-MM-DD'), addLogTimeDate);

        if (checkDateAddLog)
            message = "Không được chọn ngày trong tương lai";

        setState({
            ...state,
            addLogTimeDate,
            errorDateAddLog: message,
            checkDateAddLog,
        })
    }


    const saveAddLogTime = () => {
        const { performtasks } = props;
        let { addLogTimeDate, addLogStartTime, addLogEndTime, addLogDescription } = state;
        let startAt, stopAt;
        let { startDate, endDate } = performtasks.task;

        // Định dạng new Date("2021-02-21 09:40 PM") chạy trên chorme ok, chạy trên firefox invalid date
        // nên chuyển thành định dạng new Date("2021/02/21 09:40 PM")
        if (addLogTimeDate && addLogStartTime) {
            startAt = new Date((addLogTimeDate + " " + addLogStartTime).replace(/-/g, '/'));
        }

        if (addLogTimeDate && addLogEndTime) {
            stopAt = new Date((addLogTimeDate + " " + addLogEndTime).replace(/-/g, '/'));
        }

        const timer = {
            employee: localStorage.getItem("userId"),
            addlogStartedAt: startAt,
            addlogDescription: addLogDescription,
            addlogStoppedAt: stopAt,
            taskId: performtasks.task._id,
            autoStopped: 3, // 3: add log timer
        };
        // Check khong cho phép add log timer trong tương lại (thời gian lớn hơn thời điểm hiện tại)
        if (checkValidateDate(new Date(), stopAt)) {
            Swal.fire({
                title: 'Không được chỉ định thời gian kết thúc bấm giờ trong tương lai ',
                type: 'warning',
                confirmButtonColor: '#dd4b39',
                confirmButtonText: "Đóng",
            })
        } else {
            startDate = moment(startDate).format('YYYY-MM-DD');
            startDate = new Date(startDate).getTime();

            endDate = moment(endDate).format('YYYY-MM-DD');
            endDate = new Date(endDate).getTime();

            let checkDateRange = new Date(addLogTimeDate).getTime();

            // check xem thời gian bấm giờ nằm trong khoản thời gian bắt đầu và thời gian kết thúc của công việc
            if (!(checkDateRange >= startDate && checkDateRange <= endDate)) {
                Swal.fire({
                    title: 'Thời gian bấm giờ phải trong khoảng thời gian làm việc',
                    type: 'warning',
                    confirmButtonColor: '#dd4b39',
                    confirmButtonText: "Đóng",
                })
            }
            else {
                // Check thời gian kết thúc phải sau thời gian bắt đầu
                if (!checkValidateDate(startAt, stopAt)) {
                    Swal.fire({
                        title: 'Thời gian kết thúc phải sau thời gian bắt đầu',
                        type: 'warning',
                        confirmButtonColor: '#dd4b39',
                        confirmButtonText: "Đóng",
                    })
                } else {
                    props.stopTimer(performtasks.task._id, timer);
                    setState({
                        ...state,
                        showBoxAddLogTimer: false,
                        addLogDescription: "",
                    })
                }
            }
        }
    }

    const handleChangeDateAddStartTime = (value) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({
            ...state,
            addLogStartTime: value,
            errorStartTimeAddLog: message,
        })
    }

    const handleChangeDateAddEndTime = (value) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({
            ...state,
            addLogEndTime: value,
            errorEndTimeAddLog: message
        })
    }

    const getDefaultValueStartTime = (value) => {
        setState({
            ...state,
            addLogStartTime: value,
        })
    }

    const getDefaultValueEndTime = (value) => {
        setState({
            ...state,
            addLogEndTime: value,
        })
    }

    const handleChangeAddLogDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            addLogDescription: value,
        })
    }

    const isFormValidated = () => {
        const { addLogTimeDate, addLogStartTime, addLogEndTime, checkDateAddLog } = state;
        const { translate } = props;

        if (!ValidationHelper.validateEmpty(translate, addLogTimeDate).status
            || !ValidationHelper.validateEmpty(translate, addLogStartTime).status
            || !ValidationHelper.validateEmpty(translate, addLogEndTime).status || checkDateAddLog)
            return false;
        return true;
    }

    const { errorDateAddLog, errorStartTimeAddLog, errorEndTimeAddLog, addLogStartTime, addLogEndTime } = state;

    return <DialogModal
        size="50"
        modalID={`modal-add-log-time`}
        formID="form-add-log-time"
        title={'New Time Log'}
        func={saveAddLogTime}
        disableSubmit={!isFormValidated()}
    >

        <div className="addlog-box">
            <p style={{ color: "#f96767" }}>(*) Ghi nhật ký thời gian không được phép cho các ngày trong tương lai</p>
            <div>
                <div className={`form-group ${!errorDateAddLog ? "" : "has-error"}`}>
                    <label>Ngày <span className="text-red">*</span></label>
                    <DatePicker
                        id={`addlog-date`}
                        onChange={handleChangeDateAddLog}
                        defaultValue={formatDate(Date.now())}
                    />
                    <ErrorLabel content={errorDateAddLog} />
                </div>
                <div className="row">
                    <div className="col-sm-6 col-md-6">
                        <div className={`form-group ${!errorStartTimeAddLog ? "" : "has-error"}`}>
                            <label>Từ <span className="text-red">*</span></label>
                            <TimePicker
                                id={`addlog-startTime`}
                                value={addLogStartTime}
                                onChange={handleChangeDateAddStartTime}
                                getDefaultValue={getDefaultValueStartTime}
                            />
                            <ErrorLabel content={errorStartTimeAddLog} />
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                        <div className={`form-group ${!errorEndTimeAddLog ? "" : "has-error"}`}>
                            <label>Đến <span className="text-red">*</span></label>
                            <TimePicker
                                id={`addlog-endtime`}
                                value={addLogEndTime}
                                onChange={handleChangeDateAddEndTime}
                                getDefaultValue={getDefaultValueEndTime}
                            />
                            <ErrorLabel content={errorEndTimeAddLog} />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Mô tả</label>
                    <TextareaAutosize
                        style={{ width: '100%', border: '1px solid rgba(70, 68, 68, 0.15)', padding: '5px' }}
                        minRows={3}
                        maxRows={20}
                        onChange={handleChangeAddLogDescription}
                    />
                </div>

            </div>
        </div>
    </DialogModal>
}


function mapStateToProps(state) {
    const { performtasks } = state;
    return { performtasks };
}

const mapDispatchToProps = {
    stopTimer: performTaskAction.stopTimerTask,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalAddLogTime));