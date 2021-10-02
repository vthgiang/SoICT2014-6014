import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, TimePicker, SelectBox } from '../../../../common-components';
import { AnnualLeaveActions } from '../redux/actions';
import dayjs from 'dayjs';
import { AnnualLeaveFormValidator } from './annualLeaveFormValidator';


const formatDate = (date, monthYear = false) => {
    if (date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    return date;
}

function RequestToChangeAnnualLeave(props) {
    const { id, data } = props;
    const [description, setDescription] = useState("")
    const [state, setState] = useState({

    })

    const { translate, department } = props;

    const editStartTime = useRef('');
    const editEndTime = useRef('');

    const handleChange = (value) => {
        setDescription(value);
    }

    useEffect(() => {
        setState({
            ...state,
            organizationalUnit: data?.organizationalUnit,
            endDate: formatDate(data.endDate),
            startDate: formatDate(data.startDate),
            reason: data.reason,
            type: data.type,
            status: data.status,
            startTime: data.startTime,
            endTime: data.endTime,
            totalHours: data.totalHours ? data.totalHours : "",
            errorOnReason: undefined,
            errorOnStartDate: undefined,
            errorOnEndDate: undefined,
            errorOnTotalHours: undefined,
        })
    }, [id])

    const { endDate, startDate, reason, status, type, startTime, endTime, organizationalUnit, totalHours, errorOnStartDate, errorOnEndDate, errorOnTotalHours, errorOnReason } = state;


    const handleEndDateChange = (value) => {
        const { translate } = props;
        let { startDate, errorOnStartDate } = state;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate && startDate.split('-');
        let d = partStartDate && new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));
        let errorOnEndDate;
        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.start_date_before_end_date');
        } else {
            errorOnStartDate = undefined;
        }

        setState({
            ...state,
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }


    const handleStartDateChange = (value) => {
        const { translate } = props;
        let { errorOnEndDate, endDate } = state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate && endDate.split('-');
        let d = partEndDate && new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('human_resource.start_date_before_end_date');
        } else {
            errorOnEndDate = undefined;
        }

        setState({
            ...state,
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    const handleStartTimeChange = (value) => {
        setState(state => {
            return {
                ...state,
                startTime: value
            }
        });
    }

    const handleEndTimeChange = (value) => {
        setState(state => {
            return {
                ...state,
                endTime: value
            }
        });
    }


    const validateTotalHours = (value, willUpdateState = true) => {
        const { translate } = props;

        let msg = AnnualLeaveFormValidator.validateTotalHour(value, translate)
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnTotalHours: msg,
                    totalHours: value,
                }
            });
        };
        return msg === undefined;
    }


    const handleTotalHoursChange = (e) => {
        let { value } = e.target;
        validateTotalHours(value, true);
    }

    const handleChecked = () => {
        setState({
            ...state,
            type: !state.type,
            endTime: "",
            startTime: "",
            totalHours: ""
        })
    }

    const validateReason = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = AnnualLeaveFormValidator.validateReason(value, translate)
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnReason: msg,
                    reason: value,
                }
            });
        };
        return msg === undefined;
    }


    const handleReasonChange = (e) => {
        let { value } = e.target;
        validateReason(value, true);

    }


    const isFormValidated = () => {
        const { startDate, endDate, reason, type, totalHours } = state;
        let result = validateReason(reason, false) && (type ? validateTotalHours(totalHours, false) : true);
        let partStart = startDate && startDate.split('-');
        let startDateNew = partStart && [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate && endDate.split('-');
        let endDateNew = partEnd && [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
            return result;
        } else return false;
    }

    const save = () => {
        let { startDate, endDate, _id, type, startTime, endTime } = state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (type) {
            if (startTime === "") {
                startTime = editStartTime.current.getValue()
            };
            if (endTime === "") {
                endTime = editEndTime.current.getValue()
            }
        }

        if (isFormValidated()) {
            props.requestToChangeAnnuaLeave(id, {
                type,
                startTime,
                endTime,
                totalHours,
                startDate: startDateNew,
                endDate: endDateNew,
                reason
            })
        }


    }

    const note = <p className="text-left"> <span className="text-red">Thông tin sẽ được gửi thông báo tới người quản lý</span></p>;
    return (
        <DialogModal
            modalID={`modal-request-to-change-annualLeave-${id}`} isLoading={false}
            title={`Yêu cầu sửa đổi thông tin nghỉ phép`}
            hasNote={true}
            note={note}
            func={save}
        >
            <form className="form-group" id="form-edit-sabbtical">
                {/* Đơn vị */}
                <div className="form-group">
                    <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                    <SelectBox
                        id={`edit-annaul-leave-unit`}
                        className="form-control select2"
                        disabled={true}
                        style={{ width: "100%" }}
                        value={organizationalUnit}
                        items={department?.list?.length && department.list.map(y => { return { value: y._id, text: y.name } })}
                    />
                </div>
                <div className="form-group">
                    <input type="checkbox" checked={type} onChange={() => handleChecked()} />
                    <label>{translate('human_resource.annual_leave.type')}</label>
                </div>
                <div className="row">
                    {/* Ngày bắt đầu */}
                    <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                        <label>{translate('human_resource.annual_leave.table.start_date')}<span className="text-red">*</span></label>
                        <DatePicker
                            id={`edit_start_date${data._id}`}
                            deleteValue={false}
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        {type &&
                            < TimePicker
                                id="edit_start_time"
                                ref={editStartTime}
                                value={startTime}
                                onChange={handleStartTimeChange}
                            />
                        }
                        <ErrorLabel content={errorOnStartDate} />
                    </div>
                    {/* Ngày kết thúc */}
                    <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                        <label>{translate('human_resource.annual_leave.table.end_date')}<span className="text-red">*</span></label>
                        <DatePicker
                            id={`edit_end_date${data._id}`}
                            deleteValue={false}
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                        {type &&
                            < TimePicker
                                id="edit_end_time"
                                ref={editEndTime}
                                value={endTime}
                                onChange={handleEndTimeChange}
                            />
                        }
                        <ErrorLabel content={errorOnEndDate} />
                    </div>
                </div>
                {/* Tổng giờ nghỉ */}
                {type &&
                    <div className={`form-group ${errorOnTotalHours && "has-error"}`}>
                        <label>{translate('human_resource.annual_leave.totalHours')} <span className="text-red">*</span></label>
                        <input type="number" className="form-control" value={totalHours} onChange={handleTotalHoursChange} />
                        <ErrorLabel content={errorOnTotalHours} />
                    </div>
                }
                {/* Lý do */}
                <div className={`form-group ${errorOnReason && "has-error"}`}>
                    <label>{translate('human_resource.annual_leave.table.reason')}<span className="text-red">*</span></label>
                    <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" value={reason} onChange={handleReasonChange}></textarea>
                    <ErrorLabel content={errorOnReason} />
                </div>

            </form>
        </DialogModal>
    )
}


function mapState(state) {
    const { department } = state;
    return { department };
};

const actionCreators = {
    requestToChangeAnnuaLeave: AnnualLeaveActions.requestToChangeAnnuaLeave,
};

export default connect(mapState, actionCreators)(withTranslate(RequestToChangeAnnualLeave))