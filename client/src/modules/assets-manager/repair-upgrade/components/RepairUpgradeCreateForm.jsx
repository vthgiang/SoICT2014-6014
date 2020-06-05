import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel } from '../../../../common-components';
import { RepairUpgradeFromValidator } from './RepairUpgradeFromValidator';
import { RepairUpgradeActions } from '../redux/actions';

class RepairUpgradeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            repairNumber: "",
            dateCreate: this.formatDate(Date.now()),
            type: "Sửa chữa",
            code: "",
            // assetName: "",
            reason: "",
            repairDate: this.formatDate(Date.now()),
            completeDate: this.formatDate(Date.now()),
            cost: "",
            status: "Chưa thực hiện",
            assetIndex: ""
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
    validateExitsRepairNumber = (value) => {
        return this.props.repairUpgrade.listRepairUpgrades.some(item => item.repairNumber === value);
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
    handleCodeChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({ assetIndex: e.target.options[selectedIndex].getAttribute('data-key') });
        let value = e.target.value;
        this.validateCode(value, true);
    }
    validateCode = (value, willUpdateState = true) => {
        let msg = RepairUpgradeFromValidator.validateCode(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCode: msg,
                    asset: value,
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
            this.validateRepairNumber(this.state.repairNumber, false) &&
            this.validateDateCreate(this.state.dateCreate, false) &&
            // this.validateCode(this.state.code, false) &&
            this.validateReason(this.state.reason, false) &&
            this.validateRepairDate(this.state.repairDate, false) &&
            this.validateCost(this.state.cost, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        // let newDataToSubmit = {...this.state, company: this.props.auth.user.company._id}
        console.log("this.state", this.state);
        if (this.isFormValidated() && this.validateExitsRepairNumber(this.state.repairNumber) === false) {
            return this.props.createNewRepairUpgrade(this.state);
        }
    };

    render() {
        const { translate, repairUpgrade, assetsManager } = this.props;
        console.log('assetsManager', assetsManager);
        const {
            repairNumber, dateCreate, type, code, assetName, reason, repairDate, completeDate, cost, status,
            errorOnRepairNumber, errorOnDateCreate, errorOnCode, errorOnReason, errorOnRepairDate, errorOnCost
        } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-repairupgrade" button_name="Thêm mới phiếu" title="Thêm mới phiếu sửa chữa - thay thế - nâng cấp" />
                <DialogModal
                    size='75' modalID="modal-create-repairupgrade" isLoading={repairUpgrade.isLoading}
                    formID="form-create-repairupgrade"
                    title="Thêm mới phiếu sửa chữa - thay thế - nâng cấp"
                    func={this.save}
                    disableSubmit={!this.isFormValidated () || this.validateExitsRepairNumber(repairNumber)}
                >
                    <form className="form-group" id="form-create-repairupgrade">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnRepairNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="repairNumber" value={repairNumber} onChange={this.handleRepairNumberChange} autoComplete="off"
                                        placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnRepairNumber} />
                                    <ErrorLabel content={this.validateExitsRepairNumber(repairNumber) ? <span className="text-red">Mã phiếu đã tồn tại</span>  : ''}/>
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                    <ErrorLabel content={errorOnDateCreate} />
                                </div>
                                <div className="form-group">
                                    <label>Phân loại</label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="Sửa chữa">Sửa chữa</option>
                                        <option value="Thay thế">Thay thế</option>
                                        <option value="Nâng cấp">Nâng cấp</option>
                                    </select>
                                </div>

                                {/* <div className={`form-group ${errorOnCode === undefined ? "" : "has-error"}`}> */}
                                <div className="form-group">
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="asset" defaultValue=""
                                        placeholder="Please Select"
                                        onChange={this.handleCodeChange}>
                                        <option value="" disabled>Please Select</option>
                                        {assetsManager.allAsset ? assetsManager.allAsset.map((item, index) => {
                                            return (
                                                <option data-key={index} key={index} value={item.asset._id}>{item.asset.code}</option>
                                            )
                                        }) : null}
                                    </select>
                                    {/* <ErrorLabel content={errorOnCode} /> */}
                                </div>
                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input disabled type="text" className="form-control" name="assetName"
                                        value={this.state.assetIndex !== '' ? assetsManager.allAsset[this.state.assetIndex].asset.assetName : ''} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleReasonChange} autoComplete="off"
                                        placeholder="Nội dung"></textarea>
                                    <ErrorLabel content={errorOnReason} />
                                </div>
                                <div className={`form-group ${errorOnRepairDate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày thực hiện<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_repair_date"
                                        value={repairDate}
                                        onChange={this.handleRepairDateChange}
                                    />
                                    <ErrorLabel content={errorOnRepairDate} />
                                </div>
                                <div className="form-group">
                                    <label>Ngày hoàn thành</label>
                                    <DatePicker
                                        id="create_complete_date"
                                        value={completeDate}
                                        onChange={this.handleCompleteDateChange}
                                    />
                                </div>
                                <div className={`form-group ${errorOnCost === undefined ? "" : "has-error"}`}>
                                    <label>Chi phí (VNĐ)<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleCostChange} autoComplete="off"
                                        placeholder="Chi phí" />
                                    <ErrorLabel content={errorOnCost} />
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                        <option value="Đã thực hiện">Đã thực hiện</option>
                                        <option value="Đang thực hiện">Đang thực hiện</option>
                                        <option value="Chưa thực hiện">Chưa thực hiện</option>
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
    const { repairUpgrade, assetsManager, user } = state;
    return { repairUpgrade, assetsManager, user };
};

const actionCreators = {
    createNewRepairUpgrade: RepairUpgradeActions.createNewRepairUpgrade,
};

const createForm = connect(mapState, actionCreators)(withTranslate(RepairUpgradeCreateForm));
export { createForm as RepairUpgradeCreateForm };
