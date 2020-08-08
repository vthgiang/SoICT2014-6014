import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { HolidayFormValidator } from './combinedContent';

import { DialogModal, DatePicker, ErrorLabel } from '../../../../common-components';

import { HolidayActions } from '../redux/actions';

class HolidayEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    // Bắt sự kiện thay đổi lý do nghỉ
    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState = true) => {
        let msg = HolidayFormValidator.validateDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi thời gian bắt đầu
    handleStartDateChange = (value) => {
        let { errorOnEndDate, endDate } = this.state;
        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = "Thời gian bắt đầu phải trước thời gian kết thúc";
        } else {
            errorOnEndDate = errorOnEndDate === 'Thời gian kết thúc phải sau thời gian bắt đầu' ? undefined : errorOnEndDate
        }
        this.setState({
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    // Bắt sự kiện thay đổi thời gian kết thúc
    handleEndDateChange = (value) => {
        let { startDate, errorOnStartDate } = this.state;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));
        let errorOnEndDate;
        if (d.getTime() > date.getTime()) {
            errorOnEndDate = "Thời gian kết thúc phải sau thời gian bắt đầu";
        } else {
            errorOnStartDate = errorOnStartDate === 'Thời gian bắt đầu phải trước thời gian kết thúc' ? undefined : errorOnStartDate
        }
        this.setState({
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateDescription(this.state.description, false);
        let partStart = this.state.startDate.split('-');
        let startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = this.state.endDate.split('-');
        let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (new Date(startDate).getTime() <= new Date(endDate).getTime()) {
            return result;
        } else return false;
    }

    // Bắt sự kiện submit form
    save = () => {
        let partStart = this.state.startDate.split('-');
        let startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = this.state.endDate.split('-');
        let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (this.isFormValidated()) {
            this.props.updateHoliday(this.state._id, { ...this.state, startDate: startDate, endDate: endDate });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                description: nextProps.description,

                errorOnStartDate: undefined,
                errorOnEndDate: undefined,
                errorOnDescription: undefined,

            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, holiday } = this.props;
        const { startDate, endDate, description, errorOnStartDate, errorOnEndDate, errorOnDescription, _id } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-holiday" isLoading={holiday.isLoading}
                    formID="form-edit-holiday"
                    title="Chỉnh sửa lịch nghỉ"
                    func={this.save}
                    size={50}
                    maxWidth={500}
                >
                    <form className="form-group" id="form-edit-holiday" >
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>Thời gian bắt đầu<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_date${_id}`}
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>Thời gian kết thúc<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_end_date${_id}`}
                                    deleteValue={false}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        <div className={`form-group ${errorOnDescription === undefined ? "" : "has-error"}`}>
                            <label htmlFor="description">Mô tả lịch nghỉ<span className="text-red">&#42;</span></label>
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="description" value={description} onChange={this.handleDescriptionChange}></textarea>
                            <ErrorLabel content={errorOnDescription} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { holiday } = state;
    return { holiday };
};

const actionCreators = {
    updateHoliday: HolidayActions.updateHoliday,
};

const editForm = connect(mapState, actionCreators)(withTranslate(HolidayEditForm));
export { editForm as HolidayEditForm };