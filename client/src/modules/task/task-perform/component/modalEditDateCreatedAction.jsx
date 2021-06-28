import React, { useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DateTimeConverter, DatePicker, TimePicker, ErrorLabel, DialogModal } from '../../../../common-components';
import { formatDate, formatToTimeZoneDate } from '../../../../helpers/formatDate';
import { formatTime } from '../../../project/projects/components/functionHelper';
import dayjs from 'dayjs'

function ModalEditDateCreatedAction(props) {
    const [state, setState] = useState({
        id: props.data._id,
        taskId: props.taskId,
        timeCreatedAt: formatTime(props.data.createdAt),
        dateCreatedAt: formatDate(props.data.createdAt),
        errorOnDate: undefined,
        errorOnTime: undefined
    })

    useEffect(() => {
        setState({
            id: props.data._id,
            taskId: props.taskId,
            timeCreatedAt: formatTime(props.data.createdAt),
            dateCreatedAt: formatDate(props.data.createdAt),
            errorOnDate: undefined,
            errorOnTime: undefined
        })
    }, [props.data._id])

    const { id, dateCreatedAt, timeCreatedAt, errorOnDate, errorOnTime } = state

    const isFormValidated = () => {
        const { errorOnDate, errorOnTime } = state
        if (errorOnTime || errorOnDate) {
            return false;
        }
        return true;
    }

    const validateDate = (value, now) => {
        let msg = undefined;
        let valueTimeZoneDate = new Date(formatToTimeZoneDate(value));
        let nowTimeZoneDate = new Date(formatToTimeZoneDate(now));
        if (valueTimeZoneDate.getTime() > nowTimeZoneDate.getTime()) {
            msg = "Ngày chỉnh sửa không được vượt quá hiện tại"
        }
        return msg
    }
    const checkGreaterWithNow = (time1, time2) => {
        let arr1 = time1.split(/:| /)
        let arr2 = time2.split(/:| /)

        if (time1.includes("PM") && time2.includes("AM")) {
            return true
        }
        else if (time1.includes("AM") && time2.includes("PM")) {
            return false
        }
        else {
            if (parseInt(arr1[0]) > parseInt(arr2[0])) {
                return true
            }
            else if (parseInt(arr1[0]) < parseInt(arr2[0])) {
                return false
            }
            else {
                if (parseInt(arr1[1]) > parseInt(arr2[1])) {
                    return true
                }
                if (parseInt(arr1[1]) <= parseInt(arr2[1])) {
                    return false
                }
            }
        }

    }
    const validateTime = (value, now) => {
        let msg = undefined;
        let valueTimeZoneDate = new Date(formatToTimeZoneDate(state.dateCreatedAt));
        let nowTimeZoneDate = new Date(formatToTimeZoneDate(dayjs().format('DD-MM-YYYY')));
        if (valueTimeZoneDate.getTime() == nowTimeZoneDate.getTime()) {
            console.log("0")
            if (checkGreaterWithNow(value, now)) {
                msg = "Thời gian chỉnh sửa không được vượt quá hiện tại"
            }
        }
        return msg
    }
    const handleChangeDateAction = async (value) => {
        let now = dayjs().format('DD-MM-YYYY')
        let now2 = dayjs().format('hh:mm A')
        let errorOnDate = validateDate(value, now)
        let errorOnTime = validateTime(state.timeCreatedAt, now2)
        setState({
            ...state,
            dateCreatedAt: value,
            errorOnDate: errorOnDate,
            errorOnTime: errorOnTime
        })

    }
    const handleChangeTimeAction = (value) => {
        let now = dayjs().format('hh:mm A')
        let msg = validateTime(value, now)
        setState({
            ...state,
            timeCreatedAt: value,
            errorOnTime: msg
        })
    }
    const saveChangeDateCreatedAction = () => {
        props.saveChangeDateCreatedAction(state)
    }
    return (
        <React.Fragment >
            <li><a style={{ cursor: "pointer" }} className="link-black text-sm edit-time" onClick={() => window.$(`#modal-edit-date-created-action${props.data._id}`).modal('show')}>{<DateTimeConverter dateTime={props.data.createdAt} />} <i className="fa fa-pencil"></i></a></li>
            <DialogModal
                size="20"
                modalID={`modal-edit-date-created-action${id}`}
                formID="form-edit-created-date-action"
                title={"Chỉnh sửa thời gian"}
                hasSaveButton={true}
                func={saveChangeDateCreatedAction}
                disableSubmit={!isFormValidated()}
            >
                <div className={`form-group ${!errorOnDate ? "" : "has-error"}`}>
                    <DatePicker
                        id={`change-date-created-action${id}`}
                        onChange={handleChangeDateAction}
                        value={dateCreatedAt}
                    />
                    <ErrorLabel content={errorOnDate} />
                </div>
                <div className={`form-group ${!errorOnTime ? "" : "has-error"}`}>
                    <TimePicker
                        id={`change-time-created-action${id}`}
                        value={timeCreatedAt}
                        onChange={handleChangeTimeAction}
                    />
                    <ErrorLabel content={errorOnTime} />
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

const modalEditDateCreatedAction = connect()(withTranslate(ModalEditDateCreatedAction));
export { modalEditDateCreatedAction as ModalEditDateCreatedAction }