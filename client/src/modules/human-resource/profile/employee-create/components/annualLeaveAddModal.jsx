import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, TimePicker, ButtonModal, SelectBox } from '../../../../../common-components';

import { AnnualLeaveFormValidator } from '../../../annual-leave/components/combinedContent';

function AnnualLeaveAddModal(props) {

    /**
     * Function format ngày hiện tại thành dạnh dd-mm-yyyy
     * @param {*} date : Ngày cần format
     */
    const formatDate = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('-');
        }
        return date;

    }

    const [state, setState] = useState({
        organizationalUnit: "",
        totalHours: "",
        startDate: formatDate(Date.now()),
        endDate: formatDate(Date.now()),
        type: false,
        startTime: '',
        endTime: '',
        status: "approved",
        reason: "",
    });

    const createEndTime = useRef('');
    const createStartTime = useRef('');

    const { translate, employeesInfo } = props;

    const { id } = props;

    const { startDate, endDate, reason, status, organizationalUnit, errorOnOrganizationalUnit,
        errorOnReason, errorOnStartDate, errorOnEndDate, totalHours, errorOnTotalHours, type } = state;

    let organizationalUnits = employeesInfo.organizationalUnits;


    /** Function bắt sự kiện thay đổi đơn vị */
    const handleOrganizationalUnitChange = (value) => {
        validateOrganizationalUnit(value[0], true);
    }

    const validateOrganizationalUnit = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = AnnualLeaveFormValidator.validateEmployeeNumber(value, translate);
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnOrganizationalUnit: msg,
                    organizationalUnit: value,
                }
            })
        }
        return msg === undefined;
    }

    /** Bắt sự kiện chọn xin nghi theo giờ */
    const handleChecked = () => {
        setState(state => {
            return {
                ...state,
                type: !state.type,
                endTime: "",
                startTime: "",
                totalHours: ""
            }
        })
    }

    /**
     * Bắt sự kiện thay đổi giờ bắt đầu
     * @param {*} value : Giá trị giờ bắt đầu
     */
    const handleStartTimeChange = (value) => {
        setState(state => {
            return {
                ...state,
                startTime: value
            }
        });
    }

    /**
     * Bắt sự kiện thay đổi giờ kết thúc
     * @param {*} value : Giá trị giờ kết thúc
     */
    const handleEndTimeChange = (value) => {
        setState(state => {
            return {
                ...state,
                endTime: value
            }
        });
    }


    /**
     * Bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value : Giá trị ngày bắt đầu
     */
    const handleStartDateChange = (value) => {
        const { translate } = props;
        let { errorOnEndDate, endDate } = state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('human_resource.start_date_before_end_date');
        } else {
            errorOnEndDate = undefined;
        }

        setState(state => {
            return {
                ...state,
                startDate: value,
                errorOnStartDate: errorOnStartDate,
                errorOnEndDate: errorOnEndDate
            }
        })
    }

    /**
     * Bắt sự kiện thay đổi ngày kết thúc
     * @param {*} value : Giá trị ngày kết thúc
     */
    const handleEndDateChange = (value) => {
        const { translate } = props;
        let { startDate, errorOnStartDate } = state;

        let errorOnEndDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.end_date_after_start_date');
        } else {
            errorOnStartDate = undefined;
        }

        setState(state => {
            return {
                ...state,
                endDate: value,
                errorOnStartDate: errorOnStartDate,
                errorOnEndDate: errorOnEndDate
            }
        })
    }

    /** Bắt sự kiện thay đổi tổng số giờ nghỉ phép */
    const handleTotalHoursChange = (e) => {
        let { value } = e.target;
        validateTotalHours(value, true);
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
            })
        };
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi lý do xin nghỉ phép */
    const handleReasonChange = (e) => {
        let { value } = e.target;
        validateReason(value, true);
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
            })
        };
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi trạng thái đơn xin nghỉ phép */
    const handleStatusChange = (e) => {
        let { value } = e.target;
        setState(state => {
            return {
                ...state,
                status: value
            }
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { organizationalUnit, reason, startDate, endDate, type, totalHours } = state;
        let result = validateReason(reason, false) && (type ? validateTotalHours(totalHours, false) : true);
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
            return result;
        } else return false;
    }

    /** Bắt sự kiện submit form */
    const save = async () => {
        const { id } = props;
        let { startDate, endDate, type, startTime, endTime } = state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        if (type) {
            if (startTime === "") {
                startTime = createEndTime.current.getValue()
            };
            if (endTime === "") {
                endTime = createStartTime.current.getValue()
            }
        }

        if (isFormValidated()) {
            return props.handleChange({ ...state, startTime: startTime, endTime: endTime, startDate: startDateNew, endDate: endDateNew });
        }
    }

    return (
        <React.Fragment>
            <ButtonModal modalID={`modal-create-sabbatical-${id}`} button_name={translate('modal.create')} title={translate('human_resource.annual_leave.add_annual_leave_title')} />
            <DialogModal
                size='50' modalID={`modal-create-sabbatical-${id}`} isLoading={false}
                formID={`form-create-sabbatical-${id}`}
                title={translate('human_resource.annual_leave.add_annual_leave_title')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-create-sabbatical-${id}`}>
                    {/* Đơn vị */}
                    <div className={`form-group ${errorOnOrganizationalUnit && "has-error"}`}>
                        <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`create-annual-leave-unit${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={organizationalUnit}
                            items={organizationalUnits?.map(y => { return { value: y._id, text: y.name } }).concat([{ value: "", text: translate('human_resource.non_unit') }])}
                            onChange={handleOrganizationalUnitChange}
                        />
                        <ErrorLabel content={errorOnOrganizationalUnit} />
                    </div>
                    <div className="form-group">
                        <input type="checkbox" onChange={() => handleChecked()} />
                        <label>{translate('human_resource.annual_leave.type')}</label>
                    </div>
                    <div className="row">
                        {/* Ngày bắt đầu*/}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                            <label>{translate('human_resource.annual_leave.table.start_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`create_start_date${id}`}
                                deleteValue={false}
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                            {type &&
                                < TimePicker
                                    id={`create_start_time${id}`}
                                    ref={createStartTime}
                                    // getDefaultValue={getDefaultStartTime}
                                    onChange={handleStartTimeChange}
                                />
                            }
                            <ErrorLabel content={errorOnStartDate} />
                        </div>
                        {/* Ngày kết thúc*/}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                            <label>{translate('human_resource.annual_leave.table.end_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`create_end_date${id}`}
                                deleteValue={false}
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                            {type &&
                                < TimePicker
                                    id={`create_end_time${id}`}
                                    ref={createEndTime}
                                    // getDefaultValue={getDefaultEndTime}
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
                        <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" value={reason} onChange={handleReasonChange} placeholder="Enter ..." autoComplete="off"></textarea>
                        <ErrorLabel content={errorOnReason} />
                    </div>
                    {/* Trạng thái */}
                    <div className="form-group">
                        <label>{translate('human_resource.status')}<span className="text-red">*</span></label>
                        <select className="form-control" value={status} name="status" onChange={handleStatusChange}>
                            <option value="approved">{translate('human_resource.annual_leave.status.approved')}</option>
                            <option value="waiting_for_approval">{translate('human_resource.annual_leave.status.waiting_for_approval')}</option>
                            <option value="disapproved">{translate('human_resource.annual_leave.status.disapproved')}</option>
                        </select>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
};

const addModal = connect(mapState, null)(withTranslate(AnnualLeaveAddModal));
export { addModal as AnnualLeaveAddModal };
