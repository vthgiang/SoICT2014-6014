import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { RecommendProcureFromValidator } from './RecommendProcureFromValidator';
// import { RecommendProcureActions } from '../redux/actions';
class RecommendProcureCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            createDate: this.formatDate(Date.now()),
            // endDate: this.formatDate(Date.now()),
            // status: "pass",
            reason: "",
        };
    }
    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    // Bắt sự kiện thay đổi mã nhân viên
    handleMSNVChange = (e) => {
        let value = e.target.value;
        this.validateEmployeeNumber(value, true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateEmployeeNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEmployeeNumber: msg,
                    employeeNumber: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi ngày bắt đầu
    handleCreateDateChange = (value) => {
        this.setState({
            ...this.state,
            startDate: value
        })
    }

    // // Bắt sự kiện thay đổi ngày kết thúc
    // handleEndDateChange = (value) => {
    //     this.setState({
    //         ...this.state,
    //         endDate: value
    //     })
    // }

    // Bắt sự kiện thay đổi lý do xin nghỉ phép
    handleReasonChange = (e) => {
        let value = e.target.value;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateReason(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReason: msg,
                    reason: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi trạng thái đơn xin nghỉ phép
    handleStatusChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateEmployeeNumber(this.state.employeeNumber, false) &&
            this.validateReason(this.state.reason, false);
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.createNewRecommendProcure(this.state);
        }
    }

    render() {
        const { translate, recommendProcure } = this.props;
        const { employeeNumber, createDate, endDate, reason, status, errorOnEmployeeNumber, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ModalButton modalID="modal-create-recommendprocure" button_name="Thêm mới phiếu" title="Thêm mới phiếu đề nghị" />
                <ModalDialog
                    size='75' modalID="modal-create-recommendprocure" isLoading={recommendProcure.isLoading}
                    formID="form-create-recommendprocure"
                    title="Thêm mới phiếu đề nghị mua sắm thiết bị"
                    msg_success={translate('modal.add_success')}
                    msg_faile={translate('modal.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-recommendprocure">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnEmployeeNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={employeeNumber} onChange={this.handleMSNVChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnEmployeeNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
                                        value={createDate}
                                        onChange={this.handleCreateDateChange}
                                        placeholder="dd-mm-yyyy"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Người đề nghị<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="reqNumber" />
                                </div>
                                <div className="form-group">
                                    <label>Đơn vị</label>
                                    <input type="text" className="form-control" name="reqNumber" />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="reqNumber" />
                                </div>
                                <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Thiết bị đề nghị mua<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleReasonChange}></textarea>
                                    <ErrorLabel content={errorOnReason} />
                                </div>
                                <div className="form-group">
                                    <label>Nhà cung cấp<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="reqNumber" />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Số lượng<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="reqNumber" />
                                </div>
                                <div className="form-group">
                                    <label>Đơn vị tính<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="reqNumber" />
                                </div>
                                <div className="form-group">
                                    <label>Giá trị dự tính:</label>
                                    <input style={{ display: "inline", width: "93%" }} type="number" className="form-control" name="costsCourse" onChange={this.handleChange} autoComplete="off" />
                                    <label style={{ height: 34, display: "inline", width: "5%"}}>  VNĐ</label>
                                </div>
                                <div className="form-group">
                                    <label>Người phê duyệt</label>
                                    <input type="text" className="form-control" name="reqNumber" />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="reqNumber" />
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <input type="text" className="form-control" name="employeeNumber" defaultValue="Chờ phê duyệt" disabled />
                                </div>
                            </div>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { recommendProcure } = state;
    return { recommendProcure };
};

const actionCreators = {
    // createNewRecommendProcure: RecommendProcureActions.createNewRecommendProcure,
};

const createForm = connect(mapState, actionCreators)(withTranslate(RecommendProcureCreateForm));
export { createForm as RecommendProcureCreateForm };
