import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { DistributeTransferFromValidator } from './DistributeTransferFromValidator';
// import { DistributeTransferActions } from '../redux/actions';
class DistributeTransferCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distributeNumber: "",
            dateCreate: this.formatDate(Date.now()),
            type: "",
            place: "",
            handoverMan: "",
            receiver: "",
            assetNumber: "",
            reason: "",
            location: "",
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

    //1. Bắt sự kiện thay đổi mã phiếu
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

    //2. Bắt sự kiện thay đổi "Ngày lập"
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

    //3. Bắt sự kiện thay đổi loại phiếu
    handleTypeChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            type: value
        })
    }

    //4. Bắt sự kiện thay đổi "Địa điểm bàn giao"
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

    //5. Bắt sự kiện thay đổi "Người bàn giao"
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

    //6. Bắt sự kiện thay đổi "Người tiếp nhận"
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

    //7. Bắt sự kiện thay đổi "Mã tài sản"
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

    //8. Bắt sự kiện thay đổi "Vị trí tiếp theo của tài sản"
    handleLocationChange = (e) => {
        let value = e.target.value;
        this.validateLocation(value, true);
    }
    validateLocation = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateLocation(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnLocation: msg,
                    location: value,
                }
            });
        }
        return msg === undefined;
    }

    //8. Bắt sự kiện thay đổi "Nội dung"
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
            this.validateHandoverMan(this.state.handoverMan, false) &&
            this.validateReceiver(this.state.receiver, false) &&
            this.validateLocation(this.state.location, false) &&
            this.validateReason(this.state.reason, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            // return this.props.createNewDistributeTransfer(this.state);
        }
    }

    render() {
        const { translate, distributeTransfer } = this.props;
        const { distributeNumber, dateCreate, type, place, assetNumber, handoverMan, receiver, reason, location,
            errorOnDistributeNumber, errorOnDateCreate, errorOnPlace, errorOnAssetNumber, errorOnHandoverMan, errorOnReceiver, errorOnLocation, errorOnReason } = this.state;
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
                                        placeholder="dd-mm-yyyy"
                                    />
                                    <ErrorLabel content={errorOnDateCreate} />
                                </div>
                                <div className="form-group">
                                    <label>Phân loại</label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="distribute">Cấp phát</option>
                                        <option value="transfer">Điều chuyển</option>
                                        <option value="revoke">Thu hồi</option>
                                    </select>
                                </div>
                                <div className={`form-group ${errorOnPlace === undefined ? "" : "has-error"}`}>
                                    <label>Địa điểm bàn giao<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="place" value={place} onChange={this.handlePlaceChange} autoComplete="off" placeholder="Địa điểm bàn giao" />
                                    <ErrorLabel content={errorOnPlace} />
                                </div>
                                <div className={`form-group ${errorOnHandoverMan === undefined ? "" : "has-error"}`}>
                                    <label>Người bàn giao<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="handoverMan" value={handoverMan} onChange={this.handleHandoverManChange} autoComplete="off" placeholder="Người bàn giao" />
                                    <ErrorLabel content={errorOnHandoverMan} />
                                </div>
                                <div className="form-group">
                                    <label>Đơn vị</label>
                                    <input type="text" className="form-control" name="department" />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="position" />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnReceiver === undefined ? "" : "has-error"}`}>
                                    <label>Người tiếp nhận<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="receiver" value={receiver} onChange={this.handleReceiverChange} autoComplete="off" placeholder="Người tiếp nhận" />
                                    <ErrorLabel content={errorOnReceiver} />
                                </div>
                                <div className="form-group">
                                    <label>Đơn vị</label>
                                    <input type="text" className="form-control" name="deparment1" />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ</label>
                                    <input type="text" className="form-control" name="position1" />
                                </div>
                                <div className={`form-group ${errorOnAssetNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="assetNumber" value={assetNumber} onChange={this.handleAssetNumberChange} autoComplete="off" placeholder="Mã tài sản" />
                                    <ErrorLabel content={errorOnAssetNumber} />
                                </div>
                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input type="text" className="form-control" name="assetName" autoComplete="off" placeholder="Tên tài sản" />
                                </div>
                                <div className="form-group">
                                    <label>Vị trí ban đầu của tài sản</label>
                                    <input type="text" className="form-control" name="firstLocation" autoComplete="off" placeholder="Vị trí ban đầu của tài sản" />
                                </div>
                                <div className={`form-group ${errorOnLocation === undefined ? "" : "has-error"}`}>
                                    <label>Vị trí tiếp theo của tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="location" value={location} onChange={this.handleLocationChange} autoComplete="off" placeholder="Vị trí tiếp theo của tài sản" />
                                    <ErrorLabel content={errorOnLocation} />
                                </div>
                            </div>
                            <div className={`form-group col-sm-12 ${errorOnReason === undefined ? "" : "has-error"}`}>
                                <label>Nội dung<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleReasonChange} autoComplete="off" placeholder="Nội dung"></textarea>
                                <ErrorLabel content={errorOnReason} />
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
    // createNewDistributeTransfer: DistributeTransferActions.createNewDistributeTransfer,
};

const createForm = connect(mapState, actionCreators)(withTranslate(DistributeTransferCreateForm));
export { createForm as DistributeTransferCreateForm };
