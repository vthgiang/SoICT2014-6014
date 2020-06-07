import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {ButtonModal, DatePicker, DialogModal, ErrorLabel} from '../../../../common-components';
import {AssetCrashFromValidator} from './AssetCrashFromValidator';
import {AssetManagerActions} from '../../asset-manager/redux/actions';
import {AssetCrashActions} from '../redux/actions';
// import { string2literal } from '../utils/format_data';

class AssetCrashEditForm extends Component {
    constructor(props) {
        super(props);
        // this.annunciatorInput = React.createRef();
        this.annunciatorInput = React.createRef();
        this.assetIdInput = React.createRef();
        this.state = {
            assetIndex: "",
            userAnnunciatorIndex: ""
        };
    }


    // Bắt sự kiện thay đổi "Mã tài sản"
    handleCodeChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({assetIndex: e.target.options[selectedIndex].getAttribute('data-key')});
        let value = e.target.value;
        this.validateCode(value, true);
    }
    validateCode = (value, willUpdateState = true) => {
        let msg = AssetCrashFromValidator.validateCode(value, this.props.translate)
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

    //Bắt sự kiện thay đổi "Người báo cáo"
    handleAnnunciatorChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({userAnnunciatorIndex: e.target.options[selectedIndex].getAttribute('data-key1')});
        let value = e.target.value;
        this.validateAnnunciator(value, true);
    }
    validateAnnunciator = (value, willUpdateState = true) => {
        let msg = AssetCrashFromValidator.validateAnnunciator(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnAnnunciator: msg,
                    annunciator: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày báo cáo"
    handleReportDateChange = (value) => {
        this.validateReportDate(value, true);
    }
    validateReportDate = (value, willUpdateState = true) => {
        let msg = AssetCrashFromValidator.validateReportDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReportDate: msg,
                    reportDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày phát hiện sự cố"
    handleDetectionDateChange = (value) => {
        this.validateDetectionDate(value, true);
    }
    validateDetectionDate = (value, willUpdateState = true) => {
        let msg = AssetCrashFromValidator.validateDetectionDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDetectionDate: msg,
                    detectionDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi phân loại
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
        let msg = AssetCrashFromValidator.validateReason(value, this.props.translate)
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
            // this.validateRepairNumber(this.state.repairNumber, false) &&
            this.validateReportDate(this.state.reportDate, false) &&
            this.validateDetectionDate(this.state.detectionDate, false) &&
            // this.validateCode(this.state.asset, false) &&
            this.validateReason(this.state.reason, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        // let newDataToSubmit = {...this.state, company: this.props.auth.user.company._id}
        let newDataToUpdateAsset = {
            status: this.state.type
        };
        console.log("this.state", this.state);
        if (this.isFormValidated()) {
            return this.props.updateAssetCrash(this.state._id, {...this.state, annunciator: this.annunciatorInput.current.value, asset: this.assetIdInput.current.value})
            .then(({response}) => {
                if (response.data.success) {
                    this.props.updateAsset(this.state.assetId, newDataToUpdateAsset);
                }
            });
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('nextProps,',nextProps);
        console.log(prevState);
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                code: nextProps.code,
                asset: nextProps.assetId,
                assetId: nextProps.assetId,
                assetName: nextProps.assetName,
                type: nextProps.type,
                annunciator: nextProps.annunciator,
                reportDate: nextProps.reportDate,
                detectionDate: nextProps.detectionDate,
                reason: nextProps.reason,
                errorOnCode: undefined,
                errorOnReportDate: undefined,
                errorOnDetectionDate: undefined,
                errorOnAnnunciator: undefined,
                errorOnReason: undefined

            }
        } else {
            return null;
        }

    }

    render() {
        const {translate, assetCrash, assetsManager, user, auth,asset} = this.props;
        console.log('assetsManager', assetsManager);
        const {
            code, assetName, type, annunciator, reportDate, detectionDate, reason,
            errorOnCode, errorOnReportDate, errorOnDetectionDate, errorOnAnnunciator, errorOnReason, assetId
        } = this.state;
        console.log('detectionDate',detectionDate);
        return (
            <React.Fragment>
                {/* <ButtonModal modalID="modal-create-assetcrash" button_name="Báo cáo sự cố tài sản" title="Báo cáo sự cố tài sản" /> */}
                <DialogModal
                    size='75' modalID="modal-edit-assetcrash"
                    formID="form-edit-assetcrash"
                    title="Chỉnh sửa báo cáo sự cố tài sản"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-assetcrash">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                {/* <div className={`form-group ${errorOnCode === undefined ? "" : "has-error"}`}> */}
                                <div className={`form-group `}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <select
                                        id="drops1"
                                        className="form-control"
                                        name="asset"
                                        value={asset._id}
                                        placeholder="Please Select"
                                        disabled
                                        ref={this.assetIdInput}
                                    >
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
                                    <input disabled type="text" className="form-control" name="assetName"
                                           value={this.state.assetIndex !== '' ? assetsManager.allAsset[this.state.assetIndex].asset.assetName : assetName ? assetName : ''}/>
                                </div>

                                <div className="form-group">
                                    <label>Phân loại</label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="Hỏng hóc">Báo hỏng</option>
                                        <option value="Mất">Báo mất</option>
                                    </select>
                                </div>

                                <div className={`form-group ${errorOnReportDate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày báo cáo<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_report_date"
                                        value={reportDate}
                                        onChange={this.handleReportDateChange}
                                    />
                                    <ErrorLabel content={errorOnReportDate}/>
                                </div>
                                .

                                {/* <div className={`form-group ${errorOnCode === undefined ? "" : "has-error"}`}> */}
                            </div>

                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Người báo cáo<span className="text-red">*</span></label>
                                    <select id="drops2" className="form-control" name="annunciator"
                                            value={annunciator}
                                            placeholder="Please Select"
                                            disabled
                                            ref={this.annunciatorInput}
                                    >
                                        <option value="" disabled>Please Select</option>
                                        {user.list.length ? user.list.map((item, index) => {
                                            return (
                                                <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                            )
                                        }) : null}

                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Chức vụ người báo cáo</label>
                                    <input disabled type="text" className="form-control" name="positionAnnunciator"
                                           value={auth.user.roles[0].roleId.name}/>
                                </div>

                                <div className={`form-group ${errorOnDetectionDate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày phát hiện sự cố<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_detection_date"
                                        value={detectionDate}
                                        onChange={this.handleDetectionDateChange}
                                    />
                                    <ErrorLabel content={errorOnDetectionDate}/>
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
    const {assetCrash, assetsManager, auth, user} = state;
    return {assetCrash, assetsManager, auth, user};
};

const actionCreators = {
    updateAssetCrash: AssetCrashActions.updateAssetCrash,
    updateAsset: AssetManagerActions.updateInformationAsset,
};

const editForm = connect(mapState, actionCreators)(withTranslate(AssetCrashEditForm));
export {editForm as AssetCrashEditForm};
