import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {DatePicker, DialogModal, ErrorLabel} from '../../../../common-components';
import {DistributeTransferFromValidator} from '../../distribute-transfer/components/DistributeTransferFromValidator';

class ModalEditDistribute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userManagerIndex:"",
            userHandloverManIndex:"",
            userReceiveIndex:""
        };
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

    handleManagerChange = (e) => {
        let value = e.target.value;
        this.validateManager(value, true);
    }
    validateManager = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateManager(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnManager: msg,
                    manager: value,
                }
            });
        }
        return msg === undefined;
    }

    handleManagerChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({userManagerIndex: e.target.options[selectedIndex].getAttribute('data-key1')});
        let value = e.target.value;
        this.validateManager(value, true);
    }
    validateManager = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateManager(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnManager: msg,
                    manager: value,
                }
            });
        }
        return msg === undefined;
    }

    //5. Bắt sự kiện thay đổi "Người bàn giao"
    handleHandoverManChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({userHandloverManIndex: e.target.options[selectedIndex].getAttribute('data-key1')});
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
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({userReceiveIndex: e.target.options[selectedIndex].getAttribute('data-key1')});
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
        this.validateDateStartUse(value, true);
    }
    validateDateStartUse = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateDateStartUse(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateStartUse: msg,
                    dateStartUse: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Thời gian sử dụng đến ngày"
    handleDateEndUseChange = (value) => {
        this.validateDateEndUse(value, true);
    }
    validateDateEndUse = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateDateEndUse(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateEndUse: msg,
                    dateEndUse: value,
                }
            });
        }
        return msg === undefined;
    }

    //7. Bắt sự kiện thay đổi "Vị trí ban đầu của tài sản"
    handleNowLocationChange = (e) => {
        let value = e.target.value;
        this.validateNowLocation(value, true);
    }
    validateNowLocation = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateNowLocation(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNowLocation: msg,
                    nowLocation: value,
                }
            });
        }
        return msg === undefined;
    }

    //7. Bắt sự kiện thay đổi "Vị trí tiếp theo của tài sản"
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
            this.validatePlace(this.state.place, false) &&
            // this.validateHandoverMan(this.state.handoverMan, false) &&
            // this.validateReceiver(this.state.receiver, false) &&
            this.validateNextLocation(this.state.nextLocation, false) &&
            this.validateReason(this.state.reason, false)
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
                _id: nextProps._id,
                index: nextProps.index,
                distributeNumber: nextProps.distributeNumber,
                dateCreate: nextProps.dateCreate,
                type: nextProps.type,
                place: nextProps.place,
                manager: nextProps.manager,
                positionManager: nextProps.positionManager,
                handoverMan: nextProps.handoverMan,
                positionHandoverMan: nextProps.positionHandoverMan,
                receiver: nextProps.receiver,
                positionReceiver: nextProps.positionReceiver,
                dateStartUse: nextProps.dateStartUse,
                dateEndUse: nextProps.dateEndUse,
                nowLocation: nextProps.nowLocation,
                nextLocation: nextProps.nextLocation,
                reason: nextProps.reason,
                errorOnDistributeNumber: undefined,
                errorOnDateCreate: undefined,
                errorOnPlace: undefined,
                errorOnHandoverMan: undefined,
                errorOnReceiver: undefined,
                errorOnNextLocation: undefined,
                errorOnReason: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const {translate, id, user,asset} = this.props;
        const {
            distributeNumber, dateCreate, type, place, manager, positionManager, handoverMan, positionHandoverMan, receiver, positionReceiver, reason, dateStartUse, dateEndUse, nowLocation, nextLocation,
            errorOnDistributeNumber, errorOnDateCreate, errorOnPlace, errorOnHandoverMan, errorOnReceiver, errorOnNextLocation, errorOnReason
        } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID={`modal-edit-distributetransfer-${id}`} isLoading={false}
                    formID={`form-edit-distributetransfer-${id}`}
                    title="Chỉnh sửa phiếu cấp phát - điều chuyển - thu hồi"
                    // msg_success={translate('modal.add_success')}
                    // msg_faile={translate('modal.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-distributetransfer-${id}`}>
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnDistributeNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="distributeNumber" value={distributeNumber} onChange={this.handleDistributeNumberChange} autoComplete="off"
                                           placeholder="Mã phiếu"/>
                                    <ErrorLabel content={errorOnDistributeNumber}/>
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_create_date1${id}`}
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                    <ErrorLabel content={errorOnDateCreate}/>
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
                                    <input type="text" className="form-control" name="place" value={place} onChange={this.handlePlaceChange} autoComplete="off" placeholder="Địa điểm bàn giao"/>
                                    <ErrorLabel content={errorOnPlace}/>
                                </div>
                                <div className={`form-group`}>
                                    <label>Người quản lý<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="manager"
                                            defaultValue={!this.props.asset.manager ? '' : this.props.asset.manager._id}
                                            placeholder="Please Select"
                                            onChange={this.handleManagerChange}
                                            disabled>
                                        <option value="" disabled>Please Select</option>
                                        {user.list.length ? user.list.map((item, index) => {
                                            return (
                                                <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                            )
                                        }) : null}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ người quản lý</label>
                                    <input disabled type="text" className="form-control" name="positionManager"
                                           value={!Object.keys(this.props.asset.manager).length ? '' : this.props.asset.manager.position.name}/>
                                </div>
                                {/* <div className={`form-group ${errorOnHandoverMan === undefined ? "" : "has-error"}`}> */}
                                <div className={`form-group`}>
                                    <label>Người Bàn Giao<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="handoverMan"
                                            defaultValue={!Object.keys(this.props.asset.person).length ? '' : this.props.asset.person._id}
                                            placeholder="Please Select"
                                            onChange={this.handleHandoverManChange}>
                                        <option value="" disabled>Please Select</option>
                                        {user.list.length ? user.list.map((item, index) => {
                                            return (
                                                <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                            )
                                        }) : null}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ người bàn giao</label>
                                    <input disabled type="text" className="form-control" name="positionHandoverMan"
                                           value={this.state.userHandloverManIndex !== '' && user.list[this.state.userHandloverManIndex].roles.length ? user.list[this.state.userHandloverManIndex].roles[0].roleId.name : this.props.asset.person.position.name}/>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* <div className={`form-group ${errorOnReceiver === undefined ? "" : "has-error"}`}> */}
                                <div className="form-group">
                                    <label>Người tiếp nhận<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="receiver"
                                            value={this.state.receiver ? this.state.receiver : ''}
                                            placeholder="Please Select"
                                            onChange={this.handleReceiverChange}>
                                        <option value="" disabled>Please Select</option>
                                        {user.list.length ? user.list.map((item, index) => {
                                            return (
                                                <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                            )
                                        }) : null}

                                    </select>

                                </div>
                                <div className="form-group">
                                    <label>Chức vụ người tiếp nhận</label>
                                    <input disabled type="text" className="form-control" name="positionReceiver"
                                           value={this.state.userReceiveIndex !== '' && user.list[this.state.userReceiveIndex].roles.length ? user.list[this.state.userReceiveIndex].roles[0].roleId.name : this.state.receiver && user.list.filter(item=>item._id === this.state.receiver).pop().roles.length ? user.list.filter(item=>item._id === this.state.receiver).pop().roles[0].roleId.name : ''}/>
                                </div>
                                <div className="form-group">
                                    <label>Thời gian sử dụng từ ngày</label>
                                    <DatePicker
                                        id="edit_start_use"
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Thời gian sử dụng đến ngày</label>
                                    <DatePicker
                                        id="edit_end_use"
                                        value={dateEndUse}
                                        onChange={this.handleDateEndUseChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Vị trí ban đầu của tài sản</label>
                                    <input type="text" className="form-control" name="nowLocation" value={nowLocation} autoComplete="off" placeholder="Vị trí ban đầu của tài sản" disabled/>
                                </div>
                                <div className={`form-group ${errorOnNextLocation === undefined ? "" : "has-error"}`}>
                                    <label>Vị trí tiếp theo của tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="location" value={nextLocation} onChange={this.handleNextLocationChange} autoComplete="off"
                                           placeholder="Vị trí tiếp theo của tài sản"/>
                                    <ErrorLabel content={errorOnNextLocation}/>
                                </div>
                                <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{height: 34}} name="reason" value={reason} onChange={this.handleReasonChange} autoComplete="off"
                                              placeholder="Nội dung"></textarea>
                                    <ErrorLabel content={errorOnReason}/>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};


const editDistribute = connect((state) => ({assetsManager: state.assetsManager, user: state.user}), null)(withTranslate(ModalEditDistribute));
export {editDistribute as ModalEditDistribute};
