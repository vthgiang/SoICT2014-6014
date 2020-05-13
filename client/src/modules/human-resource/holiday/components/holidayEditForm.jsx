import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DatePicker, ErrorLabel } from '../../../../common-components';

import { HolidayActions } from '../redux/actions';

class HolidayEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    

    handleChange = (e) => {
        const { value } = e.target;
        this.setState({
            reason: value
        })
    }

    handleStartDateChange = (value) => {
        this.setState({
            startDate: value
        })
    }
    handleEndDateChange = (value) => {
        this.setState({
            endDate: value
        })
    }
    save = () => {
        this.props.updateHoliday(this.state._id, this.state);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                reason: nextProps.reason,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, holiday } = this.props;
        const { startDate, endDate, reason } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-holiday" isLoading={holiday.isLoading}
                    formID="form-edit-holiday"
                    title="Chỉnh sửa lịch nghỉ"
                    func={this.save}
                    disableSubmit={false}
                    size={50}
                    maxWidth={500}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-holiday" >
                        <div className="row">
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Thời gian bắt đầu<span className="text-red">*</span></label>
                                <DatePicker
                                    id="edit_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Thời gian kết thúc<span className="text-red">*</span></label>
                                <DatePicker
                                    id="edit_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="reason">Mô tả lịch nghỉ<span className="text-red">&#42;</span></label>
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" value={reason} onChange={this.handleChange}></textarea>
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