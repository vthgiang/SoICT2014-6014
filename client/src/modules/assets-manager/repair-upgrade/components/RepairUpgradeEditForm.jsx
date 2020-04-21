import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { RepairUpgradeFromValidator } from './RepairUpgradeFromValidator';
// import { RepairUpgradeActions } from '../redux/actions';
class RepairUpgradeEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.save = this.save.bind(this);
    }
    
    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let msg = RepairUpgradeFromValidator.validateDateCreate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCreate: msg,
                    dateCreate: value,
                }
            });
        }
        return msg === undefined;
    }

        // Bắt sự kiện thay đổi loại phiếu
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
                    assetNumber: value,
                }
            });
        }
        return msg === undefined;
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

    // Bắt sự kiện thay đổi "Ngày thực hiện"
    handleRepairDateChange = (value) => {
        this.validateRepairDate(value, true);
    }
    validateRepairDate = (value, willUpdateState = true) => {
        let msg = RepairUpgradeFromValidator.validateRepairDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnRepairDate: msg,
                    repairDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày hoàn thành"
    handleCompleteDateChange = (value) => {
        this.setState({
            ...this.state,
            completeDate: value
        })
    }

    // Bắt sự kiện thay đổi "Chi phí"
    handleCostChange = (e) => {
        let value = e.target.value;
        this.validateCost(value, true);
    }
    validateCost = (value, willUpdateState = true) => {
        let msg = RepairUpgradeFromValidator.validateCost(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCost: msg,
                    cost: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Trạng thái phiếu"
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
            this.validateDateCreate(this.state.dateCreate, false) &&
            this.validateAssetNumber(this.state.assetNumber, false) &&
            this.validateReason(this.state.reason, false) &&
            this.validateRepairDate(this.state.repairDate, false) &&
            this.validateCost(this.state.cost, false)
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            // return this.props.updateRepairUpgrade(this.state._id, this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                repairNumber: nextProps.repairNumber,
                dateCreate: nextProps.dateCreate,
                type: nextProps.type,
                assetNumber: nextProps.assetNumber,
                assetName: nextProps.assetName,
                reason: nextProps.reason,
                repairDate: nextProps.repairDate,
                completeDate: nextProps.completeDate,
                cost: nextProps.cost,
                status: nextProps.status,
                errorOnDateCreate: undefined,
                errorOnAssetNumber: undefined,
                errorOnReason: undefined,
                errorOnRepairDate: undefined,
                errorOnCost: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, repairUpgrade } = this.props;
        const { repairNumber, dateCreate, type, assetNumber, assetName, reason, repairDate, completeDate, cost,  status,
                errorOnDateCreate, errorOnAssetNumber, errorOnReason, errorOnRepairDate, errorOnCost } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-edit-repairupgrade" isLoading={repairUpgrade.isLoading}
                    formID="form-edit-repairupgrade"
                    title="Chỉnh sửa thông tin phiếu sửa chữa - nâng cấp - thay thế"
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('sabbatical.edit_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-repairupgrade">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="repairNumber" value={repairNumber} disabled/>
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                        placeholder="dd-mm-yyyy"
                                    />
                                    <ErrorLabel content={errorOnDateCreate} />
                                </div>
                                <div className="form-group">
                                    <label>Phân loại</label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="repair">Sửa chữa</option>
                                        <option value="substitute">Thay thế</option>
                                        <option value="upgrade">Nâng cấp</option>
                                    </select>
                                </div>
                                
                                <div className={`form-group ${errorOnAssetNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="assetNumber" value={assetNumber} onChange={this.handleAssetNumberChange} autoComplete="off" placeholder="Mã tài sản" />
                                    <ErrorLabel content={errorOnAssetNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input type="text" className="form-control" name="assetName" disabled/>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleReasonChange} autoComplete="off" placeholder="Nội dung"></textarea>
                                    <ErrorLabel content={errorOnReason} />
                                </div>
                                <div className={`form-group ${errorOnRepairDate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày thực hiện<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_repair_date"
                                        value={repairDate}
                                        onChange={this.handleRepairDateChange}
                                        placeholder="dd-mm-yyyy"
                                    />
                                    <ErrorLabel content={errorOnRepairDate} />
                                </div>
                                <div className="form-group">
                                    <label>Ngày hoàn thành</label>
                                    <DatePicker
                                        id="edit_complete_date"
                                        value={completeDate}
                                        onChange={this.handleCompleteDateChange}
                                        placeholder="dd-mm-yyyy"
                                    />
                                </div>
                                <div className={`form-group ${errorOnCost === undefined ? "" : "has-error"}`}>
                                    <label>Chi phí<span className="text-red">*</span></label>
                                    <input style={{ display: "inline", width: "93%" }} type="number" className="form-control" name="cost" value={ cost } onChange={this.handleCostChange} autoComplete="off" placeholder="Chi phí" />
                                    <label style={{ height: 34, display: "inline", width: "5%"}}>  VNĐ</label>
                                    <ErrorLabel content={errorOnCost} />
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                        <option value="complete">Đã thực hiện</option>
                                        <option value="processing">Đang thực hiện</option>
                                        <option value="plan">Chưa thực hiện</option>
                                    </select>
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
    const { repairUpgrade } = state;
    return { repairUpgrade };
};

const actionCreators = {
    // updateRepairUpgrade: RepairUpgradeActions.updateRepairUpgrade,
};

const editRepairUpgrade = connect(mapState, actionCreators)(withTranslate(RepairUpgradeEditForm));
export { editRepairUpgrade as RepairUpgradeEditForm };