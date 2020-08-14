import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SlimScroll } from '../../../../common-components';

import { TimesheetsActions } from '../redux/actions';

class TimesheetsEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * Function bắt sự kiện thay đổi chấm công nhân viên (checkbox)
     * @param {*} workSession : Dữ liệu ca chấm công
     * @param {*} index : Số thứ tự công thay đổi
     */
    handleCheckBoxChange = (workSession, index) => {
        let { workSession1, workSession2 } = this.state;
        if (workSession === "workSession1") {
            workSession1[index] = !workSession1[index];
            this.setState({
                workSession1: workSession1
            })
        } else {
            workSession2[index] = !workSession2[index];
            this.setState({
                workSession2: workSession2
            })
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                employeeNumber: nextProps.employeeNumber,
                month: nextProps.month,
                workSession1: nextProps.workSession1,
                workSession2: nextProps.workSession2,
                allDayOfMonth: nextProps.allDayOfMonth,
            }
        } else {
            return null;
        }
    }

    /** Function bắt sự kiện lưu bảng chấm công */
    save = () => {
        const { month, _id } = this.state;
        let partMonth = month.split('-');
        let monthNew = [partMonth[1], partMonth[0]].join('-');
        this.props.updateTimesheets(_id, { ...this.state, month: monthNew });
    }

    render() {
        const { timesheets, translate } = this.props;

        const { _id, errorOnEmployeeNumber, errorOnMonthSalary, month, employeeNumber, allDayOfMonth, workSession1, workSession2 } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-timesheets" isLoading={timesheets.isLoading}
                    formID="form-edit-timesheets"
                    title={translate('human_resource.timesheets.edit_timesheets')}
                    func={this.save}
                    disableSubmit={false}
                >
                    <form className="form-group" id="form-edit-timesheets">
                        {/* Mã số nhân viên*/}
                        <div className={`form-group ${errorOnEmployeeNumber && "has-error"}`}>
                            <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled />
                            <ErrorLabel content={errorOnEmployeeNumber} />
                        </div>
                        {/* Tháng */}
                        <div className={`form-group ${errorOnMonthSalary && "has-error"}`}>
                            <label>{translate('human_resource.month')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`edit_month${_id}`}
                                dateFormat="month-year"
                                value={month}
                                onChange={this.handleMonthChange}
                                disabled={true}
                            />
                            <ErrorLabel content={errorOnMonthSalary} />
                        </div>
                        {/* Công các ngày trong tháng */}
                        <div className="form-group" id="edit-croll-table">
                            <label>{translate('human_resource.timesheets.work_date_in_month')}</label>
                            <table id="edit-timesheets" className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th style={{ width: 100 }}>{translate('human_resource.timesheets.shift_work')}</th>
                                        {allDayOfMonth.map((x, index) => (
                                            <th key={index}>{x.day}&nbsp; {x.date}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{translate('human_resource.timesheets.shifts1')}</td>
                                        {allDayOfMonth.map((x, index) => (
                                            <th key={index}>
                                                <div className="checkbox" style={{ textAlign: 'center' }}>
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('workSession1', index)}
                                                        style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }} checked={workSession1[index]} />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td>{translate('human_resource.timesheets.shifts2')}</td>
                                        {allDayOfMonth.map((x, index) => (
                                            <th key={index}>
                                                <div className="checkbox" style={{ textAlign: 'center' }}>
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('workSession2', index)}
                                                        style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }} checked={workSession2[index]} />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                            <SlimScroll outerComponentId='edit-croll-table' innerComponentId='edit-timesheets' innerComponentWidth={1500} activate={true} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { timesheets } = state;
    return { timesheets };
};

const actionCreators = {
    updateTimesheets: TimesheetsActions.updateTimesheets,
};

const editForm = connect(mapState, actionCreators)(withTranslate(TimesheetsEditForm));
export { editForm as TimesheetsEditForm };