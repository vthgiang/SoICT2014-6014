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
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = HolidayFormValidator.validateStartDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi thời gian kết thúc
    handleEndDateChange = (value) => {
        this.validateEndDate(value, true);
    }
    validateEndDate = (value, willUpdateState = true) => {
        let msg = HolidayFormValidator.validateEndDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEndDate: msg,
                    endDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateStartDate(this.state.startDate, false) && this.validateEndDate(this.state.endDate, false) &&
            this.validateDescription(this.state.description, false);
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            this.props.updateHoliday(this.state._id, this.state);
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
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>Thời gian kết thúc<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_end_date${_id}`}
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