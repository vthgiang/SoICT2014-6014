import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ErrorLabel, DatePicker } from '../../../../common-components';
import { BuyRequestFormValidator } from './BuyRequestFromValidator';
// import { BuyRequestActions } from '../redux/actions';
class BuyRequestEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.save = this.save.bind(this);
    }
    // Bắt sự kiện thay đổi ngày lập
    handleCreateDateChange = (value) => {
        this.setState({
            ...this.state,
            createDate: value
        })
    }

    // Bắt sự kiện thay đổi lý do xin nghỉ phép
    handleReasonChange = (e) => {
        let value = e.target.value;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        let msg = BuyRequestFormValidator.validateReason(value, this.props.translate)
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

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateReason(this.state.reason, false);
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            // return this.props.updateBuyRequest(this.state._id, this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                reqNumber: nextProps.employeeNumber,
                createDate: nextProps.createDate,
                startDate: nextProps.startDate,
                reason: nextProps.reason,
                status: nextProps.status,
                errorOnReason: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, buyRequest } = this.props;
        const { employeeNumber, createDate, endDate, reason, status, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ModalDialog
                    size='75' modalID="modal-edit-buyrequest" isLoading={buyRequest.isLoading}
                    formID="form-edit-buyrequest"
                    title="Chỉnh sửa thông tin phiếu đề nghị mua sắm thiết bị"
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('sabbatical.edit_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-buyrequest">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_start_date"
                                        value={createDate}
                                        onChange={this.handleCreateDateChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Người đề nghị<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Đơn vị</label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} />
                                </div>
                                <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleReasonChange}></textarea>
                                    <ErrorLabel content={errorOnReason} />
                                </div>
                                <div className="form-group">
                                    <label>Nhà cung cấp<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Số lượng</label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Đơn vị tính</label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Giá trị dự tính:</label>
                                    <input style={{ display: "inline", width: "80%" }} type="number" className="form-control" name="costsCourse" onChange={this.handleChange} autoComplete="off" />
                                    <label style={{ height: 34, display: "inline", width: "20%" }}>Giá trị dự tính:</label>
                                </div>
                                <div className="form-group">
                                    <label>Người phê duyệt</label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="reqNumber" value={employeeNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled />
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
    const { buyRequest } = state;
    return { buyRequest };
};

const actionCreators = {
    // updateBuyRequest: BuyRequestActions.updateBuyRequest,
};

const editBuyRequest = connect(mapState, actionCreators)(withTranslate(BuyRequestEditForm));
export { editBuyRequest as BuyRequestEditForm };