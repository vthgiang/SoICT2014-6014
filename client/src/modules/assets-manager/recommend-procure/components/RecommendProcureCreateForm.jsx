import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { RecommendProcureFromValidator } from './RecommendProcureFromValidator';
// import { RecommendProcureActions } from '../redux/actions';
class RecommendProcureCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            dateCreate: this.formatDate(Date.now()),
            proponent: "",
            department: "",
            position: "",
            equipment: "",
            supplier: "",
            total: "",
            unit: "",
            estimatePrice: "",
            approver: "",
            position1: "",
            status: "",
            note: "",
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

    // Bắt sự kiện thay đổi mã phiếu
    handleMSNVChange = (e) => {
        let value = e.target.value;
        this.validateRecommendNumber(value, true);
    }
    validateRecommendNumber = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateRecommendNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnRecommendNumber: msg,
                    recommendNumber: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.setState({
            ...this.state,
            dateCreate: value
        })
    }

    // Bắt sự kiện thay đổi "Thiết bị đề nghị mua"
    handleEquipmentChange = (e) => {
        let value = e.target.value;
        this.validateEquipment(value, true);
    }
    validateEquipment = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateEquipment(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEquipment: msg,
                    equipment: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Nhà cung cấp"
    handleSupplierChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            supplier: value
        })
    }

    // Bắt sự kiện thay đổi "Số lượng"
    handleTotalChange = (e) => {
        let value = e.target.value;
        this.validateTotal(value, true);
    }
    validateTotal = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateTotal(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTotal: msg,
                    total: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Đơn vị tính"
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateUnit(value, true);
    }
    validateUnit = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateUnit(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    unit: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Giá trị dự tính"
    handleEstimatePriceChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            estimatePrice: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateRecommendNumber(this.state.recommendNumber, false) &&
            this.validateEquipment(this.state.equipment, false) &&
            this.validateTotal(this.state.total, false) &&
            this.validateUnit(this.state.unit, false);
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            // return this.props.createNewRecommendProcure(this.state);
        }
    }

    render() {
        const { translate, recommendProcure } = this.props;
        const { recommendNumber, dateCreate, equipment, supplier, total, unit, estimatePrice,
                errorOnRecommendNumber, errorOnEquipment, errorOnTotal, errorOnUnit } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-recommendprocure" button_name="Thêm mới phiếu" title="Thêm mới phiếu đề nghị" />
                <DialogModal
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
                                <div className={`form-group ${errorOnRecommendNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleMSNVChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnRecommendNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                        placeholder="dd-mm-yyyy"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Người đề nghị<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="proponent" />
                                </div>
                                <div className="form-group">
                                    <label>Đơn vị</label>
                                    <input type="text" className="form-control" name="department" />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="position" />
                                </div>
                                <div className={`form-group ${errorOnEquipment === undefined ? "" : "has-error"}`}>
                                    <label>Thiết bị đề nghị mua<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="equipment" value={equipment} onChange={this.handleEquipmentChange} autoComplete="off" placeholder="Thiết bị đề nghị mua"></textarea>
                                    <ErrorLabel content={errorOnEquipment} />
                                </div>
                                <div className="form-group">
                                    <label>Nhà cung cấp</label>
                                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={this.handleSupplierChange} autoComplete="off" placeholder="Nhà cung cấp" />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                    <label>Số lượng<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="total" value={total} onChange={this.handleTotalChange} autoComplete="off" placeholder="Số lượng" />
                                    <ErrorLabel content={errorOnTotal} />
                                </div>
                                <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                    <label>Đơn vị tính<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                    <ErrorLabel content={errorOnUnit} />
                                </div>
                                <div className="form-group">
                                    <label>Giá trị dự tính:</label>
                                    <input style={{ display: "inline", width: "93%" }} type="number" className="form-control" name="estimatePrice" value={ estimatePrice } onChange={this.handleEstimatePriceChange} autoComplete="off" placeholder="Giá trị dự tính" />
                                    <label style={{ height: 34, display: "inline", width: "5%"}}>  VNĐ</label>
                                </div>
                                <div className="form-group">
                                    <label>Người phê duyệt</label>
                                    <input type="text" className="form-control" name="approver" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="position1" disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <input type="text" className="form-control" name="status" defaultValue="Chờ phê duyệt" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <input type="text" className="form-control" name="note" disabled/>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
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
