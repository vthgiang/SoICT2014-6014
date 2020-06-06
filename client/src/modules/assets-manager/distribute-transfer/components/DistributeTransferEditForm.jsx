import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {DatePicker, DialogModal, ErrorLabel} from '../../../../common-components';
import {DistributeTransferFromValidator} from './DistributeTransferFromValidator';
import {DistributeTransferActions} from '../redux/actions';
import {AssetManagerActions} from '../../asset-manager/redux/actions';
import {string2literal} from '../utils/format_data';

class DistributeTransferEditForm extends Component {
    constructor(props) {
        super(props);
        this.managerInput = React.createRef();
        this.nowLocationInput = React.createRef();
        this.handoverManInput = React.createRef();
        this.state = {
            assetIndex: "",
            userReceiveIndex: "",
            userHandoverManIndex: ""
        };
    }

    //Bắt sự kiện thay đổi mã phiếu
    handleDistributeNumberChange = (e) => {
        console.log(e.target.value);
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

    //Bắt sự kiện thay đổi "Người bàn giao"
    handleHandoverManChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({userHandoverManIndex: e.target.options[selectedIndex].getAttribute('data-key1')});
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

    //Bắt sự kiện thay đổi "Mã tài sản"
    handleCodeChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({userHandoverManIndex: "", assetIndex: e.target.options[selectedIndex].getAttribute('data-key')});
        let value = e.target.value;
        this.validateCode(value, true);
    }
    validateCode = (value, willUpdateState = true) => {
        let msg = DistributeTransferFromValidator.validateCode(value, this.props.translate)
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
            this.validateCode(this.state.code, false) &&
            this.validatePlace(this.state.place, false) &&
            this.validateNextLocation(this.state.nextLocation, false) &&
            this.validateReason(this.state.reason, false)
        return result;
    }

    save = () => {
        let newDataToSubmit = {
            ...this.state,
            nowLocation: this.nowLocationInput.current.value,
            manager: this.managerInput.current.value,
            handoverMan: string2literal(this.handoverManInput.current.value)
        };
        let newDataToUpdateAsset = {
            person: this.state.receiver,
            dateStartUse: this.state.dateStartUse,
            dateEndUse: this.state.dateEndUse,
            location: this.state.nextLocation
        };
        console.log('newDataToSubmit', newDataToSubmit);
        if (this.isFormValidated()) {
            return this.props.updateDistributeTransfer(this.state._id, newDataToSubmit)
            .then(({response}) => {
                if (response.data.success) {
                    this.props.updateAsset(this.state.assetId, newDataToUpdateAsset);
                }
            });
        }
    };

    returnPositionHandoverMan = () => {
        const {assetsManager, user} = this.props;
        let value = "";
        if (this.state.assetIndex !== '' && this.state.userHandoverManIndex === '' && Object.keys(assetsManager.allAsset[this.state.assetIndex].asset.person).length && Object.keys(assetsManager.allAsset[this.state.assetIndex].asset.person.position).length) {
            value = assetsManager.allAsset[this.state.assetIndex].asset.person.position.name;
        } else if (this.state.userHandoverManIndex !== '' && user.list[this.state.userHandoverManIndex].roles.length) {
            value = user.list[this.state.userHandoverManIndex].roles[0].roleId.name;
        }
        return value;
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                distributeNumber: nextProps.distributeNumber,
                dateCreate: nextProps.dateCreate,
                type: nextProps.type,
                place: nextProps.place,
                code: nextProps.code,
                asset: nextProps.assetId,
                assetId: nextProps.assetId,
                assetName: nextProps.assetName,
                nowLocation: nextProps.nowLocation,
                manager: nextProps.manager,
                positionManager: nextProps.positionManager,
                handoverMan: nextProps.handoverMan,
                positionHandoverMan: nextProps.positionHandoverMan,
                receiver: nextProps.receiver,
                positionReceiver: nextProps.positionReceiver,
                dateStartUse: nextProps.dateStartUse,
                dateEndUse: nextProps.dateEndUse,
                nextLocation: nextProps.nextLocation,
                reason: nextProps.reason,
                errorOnDateCreate: undefined,
                errorOnPlace: undefined,
                errorOnHandoverMan: undefined,
                errorOnReceiver: undefined,
                errorOnCode: undefined,
                errorOnNextLocation: undefined,
                errorOnReason: undefined,
            }
        } else {
            return null;
        }

    }

    returnValueHandoverManPosition = () => {
        const {assetsManager, user} = this.props;
        let value = "";
        if (this.state.assetIndex !== '' && this.state.userHandoverManIndex === '' && Object.keys(assetsManager.allAsset[this.state.assetIndex].asset.person).length && Object.keys(assetsManager.allAsset[this.state.assetIndex].asset.person.position).length) {
            value = assetsManager.allAsset[this.state.assetIndex].asset.person.position.name;
        } else if (this.state.userHandoverManIndex !== '' && user.list[this.state.userHandoverManIndex].roles.length) {
            value = user.list[this.state.userHandoverManIndex].roles[0].roleId.name;
        } else if (this.state.assetId !== '' && this.state.assetIndex === '' && Object.keys(assetsManager.allAsset.filter(item => item.asset._id === this.state.assetId).pop().asset.person).length) {
            value = this.props.assetsManager.allAsset.filter(item => item.asset._id === this.state.assetId).pop().asset.person.position.name;
        }
        return value;
    }

    render() {
        const {translate, distributeTransfer, assetsManager, user} = this.props;
        console.log('assetsManager',assetsManager);
        const {
            distributeNumber, dateCreate, type, place, code, assetName, manager, positionManager,
            handoverMan, positionHandoverMan, receiver, positionReceiver, dateStartUse, dateEndUse, reason, nowLocation, nextLocation,
            errorOnDistributeNumber, errorOnDateCreate, errorOnPlace, errorOnCode,
            errorOnHandoverMan, errorOnReceiver, errorOnNextLocation, errorOnReason, assetId,
        } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-edit-distributetransfer" isLoading={distributeTransfer.isLoading}
                    formID="form-edit-distributetransfer"
                    title="Chỉnh sửa thông tin phiếu cấp phát - điều chuyển - thu hồi"
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('sabbatical.edit_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-distributetransfer">
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
                                        id="edit_start_date"
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

                                <div className={`form-group ${errorOnCode === undefined ? "" : "has-error"}`}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="asset" defaultValue={assetId}
                                            placeholder="Please Select"
                                            onChange={this.handleCodeChange}>
                                        <option value="" disabled>Please Select</option>
                                        {assetsManager.allAsset ? assetsManager.allAsset.map((item, index) => {
                                            return (
                                                <option data-key={index} key={index} value={item.asset._id}>{item.asset.code}</option>
                                            )
                                        }) : null}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input type="text" className="form-control" name="assetName"
                                           disabled
                                           value={this.state.assetIndex !== '' ? assetsManager.allAsset[this.state.assetIndex].asset.assetName : assetName ? assetName : ''}
                                           autoComplete="off" placeholder="Tên tài sản"/>
                                </div>

                                <div className="form-group">
                                    <label>Vị trí ban đầu của tài sản</label>
                                    <input disabled type="text" className="form-control" name="nowLocation"
                                           ref={this.nowLocationInput}
                                           value={this.state.assetIndex !== '' ? assetsManager.allAsset[this.state.assetIndex].asset.location : nowLocation ? nowLocation : ''} autoComplete="off"
                                           placeholder="Vị trí ban đầu của tài sản"/>
                                </div>

                                <div className="form-group">
                                    <label>Người quản lý tài sản<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="manager" disabled
                                            value={this.state.assetIndex !== '' ? assetsManager.allAsset[this.state.assetIndex].asset.manager._id : assetId !== '' ? assetsManager.allAsset.filter(item => item.asset._id === assetId).pop().asset.manager._id : ''}
                                            ref={this.managerInput}>
                                        <option
                                            value={this.state.assetIndex !== '' ? assetsManager.allAsset[this.state.assetIndex].asset.manager._id : assetId !== '' ? assetsManager.allAsset.filter(item => item.asset._id === assetId).pop().asset.manager._id : ''}>{this.state.assetIndex !== '' ? assetsManager.allAsset[this.state.assetIndex].asset.manager.name : assetId !== '' ? assetsManager.allAsset.filter(item => item.asset._id === assetId).pop().asset.manager.name : ''}</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Chức vụ người quản lý</label>
                                    <input disabled type="text" className="form-control" name="positionManager"
                                           value={this.state.assetIndex !== '' ? assetsManager.allAsset[this.state.assetIndex].asset.manager.position.name : assetId !== '' ? assetsManager.allAsset.filter(item => item.asset._id === assetId).pop().asset.manager.position.name : ''}/>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Người bàn giao<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="handoverMan"
                                            value={this.state.assetIndex !== '' && this.state.userHandoverManIndex === '' && Object.keys(assetsManager.allAsset[this.state.assetIndex].asset.person).length ? assetsManager.allAsset[this.state.assetIndex].asset.person._id : this.state.handoverMan}
                                            ref={this.handoverManInput}
                                            onChange={this.handleHandoverManChange}>
                                        <option value="" disabled>Please Select</option>
                                        {user.list.length ? user.list.map((item, index) => {
                                            return (
                                                <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                            )
                                        }) : null}
                                        {/*<option*/}
                                        {/*    value={this.state.assetIndex !== '' && Object.keys(assetsManager.allAsset[this.state.assetIndex].asset.person).length ? assetsManager.allAsset[this.state.assetIndex].asset.person._id : 'null'}>{this.state.assetIndex !== '' && Object.keys(assetsManager.allAsset[this.state.assetIndex].asset.person).length ? assetsManager.allAsset[this.state.assetIndex].asset.person.name : ''}</option>*/}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Chức vụ người bàn giao</label>
                                    <input type="text" disabled className="form-control" name="positionHandoverMan" value={this.returnValueHandoverManPosition()}/>
                                </div>

                                <div className="form-group">
                                    <label>Người tiếp nhận<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="receiver"
                                            value={receiver}
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
                                           value={this.state.userReceiveIndex !== '' && user.list[this.state.userReceiveIndex].roles.length ? user.list[this.state.userReceiveIndex].roles[0].roleId.name : (receiver !== '' && this.state.userReceiveIndex === '' && user.list.filter(user => user._id === receiver).pop().roles.length) ? user.list.filter(user => user._id === receiver).pop().roles[0].roleId.name : ''}/>
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

                                <div className={`form-group ${errorOnNextLocation === undefined ? "" : "has-error"}`}>
                                    <label>Vị trí tiếp theo của tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="nextLocation" value={nextLocation} onChange={this.handleNextLocationChange} autoComplete="off"
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

function mapState(state) {
    const {distributeTransfer, assetsManager, user} = state;
    return {distributeTransfer, assetsManager, user};
};

const actionCreators = {
    updateDistributeTransfer: DistributeTransferActions.updateDistributeTransfer,
    updateAsset: AssetManagerActions.updateInformationAsset,
};

const editDistributeTransfer = connect(mapState, actionCreators)(withTranslate(DistributeTransferEditForm));
export {editDistributeTransfer as DistributeTransferEditForm};
