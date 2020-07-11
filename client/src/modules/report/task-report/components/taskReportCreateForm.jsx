import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskReportActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel }  from '../../../../common-components';
import { taskReportFormValidator } from './taskReportFormValidator';

class TaskReportCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameTaskReport : '',
            descriptionTaskReport : '',
        }
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
     * Hàm bắt sự kiên thay đổi input NameTaskReport
     * @param {*} e 
     */
    handleNameTaskReportChange = (e) => {
        let value = e.target.value;
        this.validateNameTaskReport(value, true);
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
    handleDesTaskReportChange = (e) => {
        let value = e.target.value;
        this.validateDescriptionTaskReport(value, true);
    }  

    /**
     * Hàm xử lý khi ấn lưu
     */
    save = () => {
        if (this.isFormValidated()) {
            this.props.createTaskReport(this.state);

        }
    }

    render() {
        const { translate, reports } = this.props;
        const { errorOnNameTaskReport, errorOnDescriptiontTaskReport } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-task-report" button_name="Thêm mới" title="Thêm mới báo cáo" />
                <DialogModal
                    modalID="modal-create-task-report" isLoading= { reports.isLoading }
                    formID="form-create-task-report"
                    title="Thêm mới báo cáo"
                    func= { this.save }
                    size= {50}
                    maxWidth= {500}
                    disableSubmit= { !this.isFormValidated() }
                >
                    <form className="form-group" id="form-create-task-report" >
                        <div className={`form-group ${ !errorOnNameTaskReport ? "" : "has-error" }`}>
                            <label>{ translate('report_manager.name') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange = {this.handleNameTaskReportChange}/>
                            <ErrorLabel content={errorOnNameTaskReport}/>
                        </div>
                        <div className={`form-group ${ !errorOnDescriptiontTaskReport ? "" : "has-error" }`}>
                            <label>{ translate('report_manager.description') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange = {this.handleDesTaskReportChange}/>
                            <ErrorLabel content={errorOnDescriptiontTaskReport}/>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}
const mapState = state => state;
const actionCreators = {
    createTaskReport: TaskReportActions.createTaskReport,
}
const createForm = connect(mapState, actionCreators)(withTranslate(TaskReportCreateForm));

export { createForm as TaskReportCreateForm };
