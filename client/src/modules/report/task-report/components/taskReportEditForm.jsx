import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TaskReportActions } from '../redux/actions';
import { taskReportFormValidator } from './taskReportFormValidator';
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../common-components';

class TaskReportEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
    * Hàm validate input NameTaskReport
    * @param {*} value 
    * @param {*} willUpdateState 
    */
    validateNameTaskReport = (value, willUpdateState = true) => {
        let msg = taskReportFormValidator.validateNameTaskReport(value)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameTaskReport: msg,
                    nameTaskReport: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
    * Hàm bắt sự kiên thay đổi input NameTaskReport
    * @param {*} e 
    */
    handleNameReportChange = (e) => {
        let value = e.target.value;
        this.validateNameTaskReport(value, true);
    }


    /**
    * Hàm kiểm tra validate cho input mô tả báo cáo
    * @param {*} value 
    * @param {*} willUpdateState 
    */
    validateDescriptionTaskReport = (value, willUpdateState = true) => {
        let msg = taskReportFormValidator.validateDescriptionTaskReport(value)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescriptiontTaskReport: msg,
                    descriptionTaskReport: value,
                }
            });
        }
        return msg === undefined;
    }


    /**
    * Bắt sự kiện thay đổi cho ô input mô tả báo cáo
    * @param {*} e 
    */
    handleDesReportChange = (e) => {
        let value = e.target.value;
        this.validateDescriptionTaskReport(value, true);
    }


    /**
     * Hàm kiểm tra đã validate chưa
     */
    isFormValidated = () => {
        let result =
            this.validateNameTaskReport(this.state.nameTaskReport, false) &&
            this.validateDescriptionTaskReport(this.state.descriptionTaskReport, false);
        return result;
    }

    /**
    * Hàm xử lý khi ấn lưu
    */
    save = () => {
        if (this.isFormValidated()) {
            this.props.editTaskReport(this.state._id, this.state);
        }
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                nameTaskReport: nextProps.nameTaskReport,
                descriptionTaskReport: nextProps.descriptionTaskReport,
                errorOnDescriptiontTaskReport: undefined,
                errorOnNameTaskReport: undefined,
            }
        } else {
            return null;
        }
    }
    render() {
        const { reports, translate } = this.props;
        const { errorOnNameTaskReport, errorOnDescriptiontTaskReport, descriptionTaskReport, nameTaskReport } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-report" isLoading={reports.isLoading}
                    formID="form-edit-report"
                    title="Chỉnh sửa báo cáo"
                    func={this.save}
                    size={50}
                    maxWidth={500}
                >
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group" id="form-create-task-report" >
                                <div className={`form-group ${!errorOnNameTaskReport ? "" : "has-error"}`}>
                                    <label>{translate('report_manager.name')}
                                        <span className="text-red">*</span>
                                    </label>
                                    <input type="text" className="form-control" onChange={this.handleNameTaskReportChange} />
                                    <ErrorLabel content={errorOnNameTaskReport} />
                                </div>
                                <div className={`form-group ${!errorOnDescriptiontTaskReport ? "" : "has-error"}`}>
                                    <label htmlFor="Descriptionreport">{translate('report_manager.description')}
                                        <span className="text-red">*</span>
                                    </label>
                                    <textarea rows={2} type="text" className="form-control" id="Descriptionreport" name="description" onChange={this.handleDesTaskReportChange} />
                                    <ErrorLabel content={errorOnDescriptiontTaskReport} />
                                </div>
                                <div className="form-group">
                                    <label>Mẫu công việc
                                        <span className="text-red">*</span>
                                    </label>
                                    <SelectBox
                                        id="responsible-select-box"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            [
                                                { value: '', text: 'Mẫu báo cáo thu nợ' },
                                                { value: '', text: 'Mẫu báo cáo tổng thu chi tháng 7' },
                                            ]
                                        }
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group `}>
                                    <label className="control-label">Đặc thù công việc</label>
                                    <SelectBox
                                        id={`select-status`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            [
                                                { value: "responsible", text: 'Tất cả' },
                                                { value: "accountable", text: 'Đã hoàn thành' },
                                                { value: "consulted", text: 'Đang thực hiện' },
                                            ]
                                        }
                                        onChange={this.handleRoleChange}
                                        multiple={false}
                                    />
                                </div>


                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Người thực hiện</label>
                                <SelectBox
                                    id="responsible-select-box"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '', text: 'Nguyễn Thị Thủy' },
                                            { value: '', text: 'Ứng Thị Tuyến' },
                                        ]
                                    }
                                    multiple={false}
                                />
                            </div>

                            <div className={`form-group`}>
                                <label className="control-label">Người phê duyệt</label>
                                <SelectBox
                                    id="accountable-select-box"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        [
                                            { value: '', text: 'Nguyễn Thị thủy' },
                                            { value: '', text: 'Nguyễn Lệ Nhi' },
                                        ]
                                    }
                                    multiple={false}
                                />
                            </div>

                            <div className="form-group">
                                <label>Từ tháng:</label>
                                <DatePicker
                                    id="start_date"
                                    // value={startDate}
                                    // onChange={this.handleStartDateChange}
                                    dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <label>Đến tháng:</label>
                                <DatePicker
                                    id="end_date"
                                    // value={endDate}
                                    // onChange={this.handleEndDateChange}
                                    dateFormat="month-year"
                                />
                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const actionCreators = {
    editTaskReport: TaskReportActions.editTaskReport,
};
const editReport = connect(mapState, actionCreators)(withTranslate(TaskReportEditForm));

export { editReport as TaskReportEditForm };