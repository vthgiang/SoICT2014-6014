import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ErrorLabel, DatePicker } from '../../../../common-components';
import { RecommendProcureFromValidator } from './RecommendProcureFromValidator';
// import { RecommendProcureActions } from '../redux/actions';
class RecommendProcureEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.save = this.save.bind(this);
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
            this.validateEquipment(this.state.equipment, false) &&
            this.validateTotal(this.state.total, false) &&
            this.validateUnit(this.state.unit, false);
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            // return this.props.updateRecommendProcure(this.state._id, this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                department: nextProps.department,
                position: nextProps.position,
                equipment: nextProps.equipment,
                supplier: nextProps.supplier,
                total: nextProps.total,
                unit: nextProps.unit,
                estimatePrice: nextProps.estimatePrice,
                approver: nextProps.approver,
                position1: nextProps.position1,
                status: nextProps.status,
                note: nextProps.note,
                errorOnEquipment: undefined,
                errorOnTotal: undefined,
                errorOnUnit: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, recommendProcure } = this.props;
        const { recommendNumber, dateCreate, proponent, department, position, equipment, supplier, total, unit, estimatePrice, approver, position1, status, note,
                errorOnEquipment, errorOnTotal, errorOnUnit } = this.state;
        return (
            <React.Fragment>
                <ModalDialog
                    size='75' modalID="modal-edit-recommendprocure" isLoading={recommendProcure.isLoading}
                    formID="form-edit-recommendprocure"
                    title="Chỉnh sửa thông tin phiếu đề nghị mua sắm thiết bị"
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('sabbatical.edit_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-recommendprocure">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Người đề nghị<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="proponent" value={proponent} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Đơn vị</label>
                                    <input type="text" className="form-control" name="department" value={department} disabled  />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="position"  value={position} disabled/>
                                </div>
                                <div className={`form-group ${errorOnEquipment === undefined ? "" : "has-error"}`}>
                                    <label>Thiết bị đề nghị mua<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="equipment" value={equipment} onChange={this.handleEquipmentChange}></textarea>
                                    <ErrorLabel content={errorOnEquipment} />
                                </div>
                                <div className="form-group">
                                    <label>Nhà cung cấp<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={this.handleSupplierChange} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                        <label>Số lượng<span className="text-red">*</span></label>
                                        <input type="number" className="form-control" name="total" value={total} onChange={this.handleTotalChange} />
                                        <ErrorLabel content={errorOnTotal} />
                                </div>
                                <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                    <label>Đơn vị tính<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                    <ErrorLabel content={errorOnUnit} />
                                </div>
                                <div className="form-group">
                                    <label>Giá trị dự tính:</label>
                                    <input style={{ display: "inline", width: "93%" }} type="number" className="form-control" name="estimatePrice" value={ estimatePrice } onChange={this.handleEstimatePriceChange} />
                                    <label style={{ height: 34, display: "inline", width: "5%"}}>  VNĐ</label>
                                </div>
                                <div className="form-group">
                                    <label>Người phê duyệt</label>
                                    <input type="text" className="form-control" name="approver" value={approver} disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="position1" value={position1} disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <input type="text" className="form-control" name="status" defaultValue="Chờ phê duyệt" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <input type="text" className="form-control" name="note" value={note} disabled/>
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
    // updateRecommendProcure: RecommendProcureActions.updateRecommendProcure,
};

const editRecommendProcure = connect(mapState, actionCreators)(withTranslate(RecommendProcureEditForm));
export { editRecommendProcure as RecommendProcureEditForm };