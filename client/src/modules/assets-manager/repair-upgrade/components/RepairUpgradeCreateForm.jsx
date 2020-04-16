import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { RepairUpgradeFromValidator } from './RepairUpgradeFromValidator';
// import { RepairUpgradeActions } from '../redux/actions';
class RepairUpgradeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            repairNumber: "",
            dateCreate: this.formatDate(Date.now()),
            type: "",
            assetNumber: "",
            // assetName: "",
            reason: "",
            repairDate: this.formatDate(Date.now()),
            completeDate: this.formatDate(Date.now()),
            cost: "",
            status: "",
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
    handleRepairNumberChange = (e) => {
        let value = e.target.value;
        this.validateRepairNumber(value, true);
    }
    validateRepairNumber = (value, willUpdateState = true) => {
        let msg = RepairUpgradeFromValidator.validateRepairNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnRepairNumber: msg,
                    repairNumber: value,
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

        // Bắt sự kiện thay đổi trạng thái đơn xin nghỉ phép
        handleTypeChange = (e) => {
            let value = e.target.value;
            this.setState({
                ...this.state,
                type: value
            })
        }

    // Bắt sự kiện thay đổi "Mã tài sản"
    handleAssetNumberChange = (e) => {
        let value = e.target.value;
        this.validateAssetNumber(value, true);
    }
    validateAssetNumber = (value, willUpdateState = true) => {
        let msg = RepairUpgradeFromValidator.validateAssetNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnAssetNumber: msg,
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

    // Bắt sự kiện thay đổi "Nội dung"
    handleReasonChange = (e) => {
        let value = e.target.value;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        let msg = RepairUpgradeFromValidator.validateReason(value, this.props.translate)
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
        const { translate, repairUpgrade } = this.props;
        const { repairNumber, dateCreate, type, assetNumber, assetName, reason, repairDate, completeDate, cost, status,
                errorOnRepairNumber, errorOnAssetNumber, errorOnReason, errorOnCost } = this.state;
        return (
            <React.Fragment>
                <ModalButton modalID="modal-create-repairupgrade" button_name="Thêm mới phiếu" title="Thêm mới phiếu sửa chữa - thay thế - nâng cấp" />
                <ModalDialog
                    size='75' modalID="modal-create-repairupgrade" isLoading={repairUpgrade.isLoading}
                    formID="form-create-repairupgrade"
                    title="Thêm mới phiếu sửa chữa - thay thế - nâng cấp"
                    msg_success={translate('modal.add_success')}
                    msg_faile={translate('modal.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-repairupgrade">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnRepairNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="repairNumber" value={repairNumber} onChange={this.handleRepairNumberChange} autoComplete="off" placeholder="Mã phiếu" />
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
                                    <label>Phân loại<span className="text-red">*</span></label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="repair">Sửa chữa</option>
                                        <option value="substitute">Thay thế</option>
                                        <option value="upgrade">Nâng cấp</option>
                                    </select>
                                </div>
                                
                                <div className={`form-group ${errorOnAssetNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="assetNumber" value={assetNumber} onChange={this.handleAssetNumberChange} autoComplete="off" placeholder="Mã tài sản" />
                                    {/* <textarea className="form-control" rows="3" style={{ height: 34 }} name="equipment" value={equipment} onChange={this.handleAssetNumberChange} autoComplete="off" placeholder="Thiết bị đề nghị mua"></textarea> */}
                                    <ErrorLabel content={errorOnAssetNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input type="text" className="form-control" name="assetName" />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleAssetNumberChange} autoComplete="off" placeholder="Nội dung"></textarea>
                                    <ErrorLabel content={errorOnReason} />
                                </div>
                                <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                    <label>{translate('sabbatical.start_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
                                        value={startDate}
                                        onChange={this.handleStartDateChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('sabbatical.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
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
    // createNewRepairUpgrade: RepairUpgradeActions.createNewRepairUpgrade,
};

const createForm = connect(mapState, actionCreators)(withTranslate(RepairUpgradeCreateForm));
export { createForm as RepairUpgradeCreateForm };
