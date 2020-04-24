import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { RepairUpgradeFromValidator } from '../../repair-upgrade/components/RepairUpgradeFromValidator';
class ModalEditRepair extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            this.validateRepairNumber(this.state.repairNumber, false) &&
            this.validateDateCreate(this.state.dateCreate, false) &&
            this.validateReason(this.state.reason, false) &&
            this.validateRepairDate(this.state.repairDate, false) &&
            this.validateCost(this.state.cost, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                index: nextProps.index,
                repairNumber: nextProps.number,
                dateCreate: nextProps.dateCreate,
                type: nextProps.type,
                reason: nextProps.reason,
                repairDate: nextProps.repairDate,
                completeDate: nextProps.completeDate,
                cost: nextProps.cost,
                status: nextProps.status,
                errorOnRepairNumber: undefined,
                errorOnDateCreate: undefined,
                errorOnReason: undefined,
                errorOnRepairDate: undefined,
                errorOnCost: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, id } = this.props;
        const { repairNumber, dateCreate, type, reason, repairDate, completeDate, cost, status,
                errorOnRepairNumber, errorOnDateCreate, errorOnReason, errorOnRepairDate, errorOnCost } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-repairupgrade-${id}`} isLoading={false}
                    formID={`form-edit-repairupgrade-${id}`}
                    title="Chỉnh sửa phiếu sửa chữa - thay thế - nâng cấp"
                    // msg_success={translate('modal.add_success')}
                    // msg_faile={translate('modal.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-repairupgrade-${id}`}>
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnRepairNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="repairNumber" value={repairNumber} onChange={this.handleRepairNumberChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnRepairNumber} />
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_create_date${id}`}
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
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
                                 <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleReasonChange} autoComplete="off" placeholder="Nội dung"></textarea>
                                    <ErrorLabel content={errorOnReason} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                               
                                <div className={`form-group ${errorOnRepairDate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày thực hiện<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_repair_date${id}`}
                                        value={repairDate}
                                        onChange={this.handleRepairDateChange}
                                    />
                                    <ErrorLabel content={errorOnRepairDate} />
                                </div>
                                <div className="form-group">
                                    <label>Ngày hoàn thành</label>
                                    <DatePicker
                                        id={`edit_complete_date${id}`}
                                        value={completeDate}
                                        onChange={this.handleCompleteDateChange}
                                    />
                                </div>
                                <div className={`form-group ${errorOnCost === undefined ? "" : "has-error"}`}>
                                    <label>Chi phí<span className="text-red">*</span></label>
                                    <input style={{ display: "inline", width: "88%" }} type="number" className="form-control" name="cost" value={ cost } onChange={this.handleCostChange} autoComplete="off" placeholder="Chi phí" />
                                    <label style={{ height: 34, display: "inline", width: "5%"}}>&nbsp; VNĐ</label>
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


const editRepair = connect(null, null)(withTranslate(ModalEditRepair));
export { editRepair as ModalEditRepair };
