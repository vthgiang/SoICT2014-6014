import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { DistributeTransferFromValidator } from './DistributeTransferFromValidator';
import { DistributeTransferActions } from '../redux/actions';
class DistributeTransferCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distributeNumber: "",
            dateCreate: this.formatDate(Date.now()),
            type: "Cấp phát",
            place: "",
            handoverMan: "", // người bàn giao
            receiver: "", // người tiếp nhận
            assetNumber: "", // mã tài sản
            reason: "",
            nowLocation: "",
            nextLocation: "", 
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

    //Bắt sự kiện thay đổi mã phiếu
    handleDistributeNumberChange = (e) => {
        let value = e.target.value;
        this.validateDistributeNumber(value, true);
    }
    validateDistributeNumber = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateDistributeNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDistributeNumber: msg,
                    distributeNumber: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateDateCreate(value, this.props.translate)
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

    //Bắt sự kiện thay đổi loại phiếu
    handleTypeChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            type: value
        })
    }

    //Bắt sự kiện thay đổi "Địa điểm bàn giao"
    handlePlaceChange = (e) => {
        let value = e.target.value;
        this.validatePlace(value, true);
    }
    validatePlace = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validatePlace(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPlace: msg,
                    place: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Người quản lý"
    handleManagerChange = (e) => {
        let value = e.target.value;
        this.validateHandoverMan(value, true);
    }
    validateHandoverMan = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateHandoverMan(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnHandoverMan: msg,
                    manager: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Người bàn giao"
    handleHandoverManChange = (e) => {
        let value = e.target.value;
        this.validateHandoverMan(value, true);
    }
    validateHandoverMan = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateHandoverMan(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnHandoverMan: msg,
                    handoverMan: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Người tiếp nhận"
    handleReceiverChange = (e) => {
        let value = e.target.value;
        this.validateReceiver(value, true);
    }
    validateReceiver = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateReceiver(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReceiver: msg,
                    receiver: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Thời gian sử dụng từ ngày"
    handleDateStartUseChange = (value) => {
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateDateCreate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCreate: msg,
                    dateStartUse: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Thời gian sử dụng đến ngày"
    handleDateEndUseChange = (value) => {
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateDateCreate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCreate: msg,
                    dateEndUse: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Mã tài sản"
    handleAssetNumberChange = (e) => {
        let value = e.target.value;
        this.validateAssetNumber(value, true);
    }
    validateAssetNumber = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateAssetNumber(value, this.props.translate)
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

    //Bắt sự kiện thay đổi "Vị trí tiếp theo của tài sản"
    handleNextLocationChange = (e) => {
        let value = e.target.value;
        this.validateNextLocation(value, true);
    }
    validateNextLocation = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateNextLocation(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNextLocation: msg,
                    nextLocation: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Nội dung"
    handleReasonChange = (e) => {
        let value = e.target.value;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateReason(value, this.props.translate)
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
        let result =
            this.validateDistributeNumber(this.state.distributeNumber, false) &&
            this.validateDateCreate(this.state.dateCreate, false) &&
            this.validateAssetNumber(this.state.assetNumber, false) &&
            this.validatePlace(this.state.place, false) &&
            this.validateNextLocation(this.state.nextLocation, false) &&
            this.validateReason(this.state.reason, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.createNewDistributeTransfer(this.state);
        }
    }

    render() {
        const { translate, distributeTransfer } = this.props;
        const { distributeNumber, dateCreate, type, place, assetNumber, assetName, manager, positionManager, 
                handoverMan, positionHandoverMan, receiver, positionReceiver, dateStartUse, dateEndUse, reason, nowLocation, nextLocation,
                errorOnDistributeNumber, errorOnDateCreate, errorOnPlace, errorOnAssetNumber, errorOnHandoverMan, errorOnReceiver, errorOnNextLocation, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-distributetransfer" button_name="Thêm mới phiếu" title="Thêm mới phiếu cấp phát - điều chuyển - thu hồi" />
                <DialogModal
                    size='75' modalID="modal-create-distributetransfer" isLoading={distributeTransfer.isLoading}
                    formID="form-create-distributetransfer"
                    title="Thêm mới phiếu cấp phát - điều chuyển - thu hồi"
                    msg_success={translate('modal.add_success')}
                    msg_faile={translate('modal.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-distributetransfer">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnDistributeNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="distributeNumber" value={distributeNumber} onChange={this.handleDistributeNumberChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnDistributeNumber} />
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
                                        <option value="Cấp phát">Cấp phát</option>
                                        <option value="Điều chuyển">Điều chuyển</option>
                                        <option value="Thu hồi">Thu hồi</option>
                                    </select>
                                </div>

                                <div className={`form-group ${errorOnPlace === undefined ? "" : "has-error"}`}>
                                    <label>Địa điểm bàn giao<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="place" value={place} onChange={this.handlePlaceChange} autoComplete="off" placeholder="Địa điểm bàn giao" />
                                    <ErrorLabel content={errorOnPlace} />
                                </div>

                                <div className={`form-group ${errorOnAssetNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="assetNumber" value={assetNumber} onChange={this.handleAssetNumberChange} autoComplete="off" placeholder="Mã tài sản" />
                                </div>

                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input type="text" className="form-control" name="assetName" value={assetName} autoComplete="off" placeholder="Tên tài sản" />
                                </div>

                                <div className="form-group">
                                    <label>Vị trí ban đầu của tài sản</label>
                                    <input type="text" className="form-control" name="nowLocation" value={nowLocation} autoComplete="off" placeholder="Vị trí ban đầu của tài sản" />
                                </div>

                                <div className="form-group">
                                    <label>Người quản lý tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="manager" value={manager} onChange={this.handleManagerChange} autoComplete="off" placeholder="Người quản lý tài sản" />
                                </div>

                                <div className="form-group">
                                    <label>Chức vụ người quản lý</label>
                                    <input type="text" className="form-control" name="positionManager" value={positionManager} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Người bàn giao<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="handoverMan" value={handoverMan} onChange={this.handleHandoverManChange} autoComplete="off" placeholder="Người bàn giao" />
                                </div>
                                
                                <div className="form-group">
                                    <label>Chức vụ người bàn giao</label>
                                    <input type="text" className="form-control" name="positionHandoverMan" value={positionHandoverMan} />
                                </div>

                                <div className="form-group">
                                    <label>Người tiếp nhận<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="receiver" value={receiver} onChange={this.handleReceiverChange} autoComplete="off" placeholder="Người tiếp nhận" />
                                </div>

                                <div className="form-group">
                                    <label>Chức vụ người tiếp nhận</label>
                                    <input type="text" className="form-control" name="positionReceiver" value={positionReceiver} />
                                </div>

                                <div className="form-group">
                                    <label>Thời gian sử dụng từ ngày</label>
                                    <DatePicker
                                        id="create_start_use"
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Thời gian sử dụng đến ngày</label>
                                    <DatePicker
                                        id="create_end_use"
                                        value={dateEndUse}
                                        onChange={this.handleDateEndUseChange}
                                    />
                                </div>

                                <div className={`form-group ${errorOnNextLocation === undefined ? "" : "has-error"}`}>
                                    <label>Vị trí tiếp theo của tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="nextLocation" value={nextLocation} onChange={this.handleNextLocationChange} autoComplete="off" placeholder="Vị trí tiếp theo của tài sản" />
                                    <ErrorLabel content={errorOnNextLocation} />
                                </div>

                                <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleReasonChange} autoComplete="off" placeholder="Nội dung"></textarea>
                                    <ErrorLabel content={errorOnReason} />
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
    const { distributeTransfer } = state;
    return { distributeTransfer };
};

const actionCreators = {
    createNewDistributeTransfer: DistributeTransferActions.createNewDistributeTransfer,
};

const createForm = connect(mapState, actionCreators)(withTranslate(DistributeTransferCreateForm));
export { createForm as DistributeTransferCreateForm };
