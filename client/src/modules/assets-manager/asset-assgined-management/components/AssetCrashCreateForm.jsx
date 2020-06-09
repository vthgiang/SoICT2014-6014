import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel } from '../../../../common-components';
import { AssetCrashFromValidator } from './AssetCrashFromValidator';
import { AssetCrashActions } from '../redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';
// import { string2literal } from '../utils/format_data';

class AssetCrashCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            asset: "",
            code: "",
            assetType: "",
            type: "Hỏng hóc", //phân loại: 1. Hỏng hóc, 2. báo mất
            annunciator: "", //người báo cáo
            reportDate: this.formatDate(Date.now()), // ngày báo cáo
            detectionDate: this.formatDate(Date.now()), // ngày phát hiện
            reason: "",
            assetIndex: "",
            userAnnunciatorIndex: ""
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

    // Bắt sự kiện thay đổi "Mã tài sản"
    handleCodeChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({ assetIndex: e.target.options[selectedIndex].getAttribute('data-key') });
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
        this.setState({ userAnnunciatorIndex: e.target.options[selectedIndex].getAttribute('data-key1') });
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

    // Bắt sự kiện thay đổi "Ngày thực hiện"
    handleRepairDateChange = (value) => {
        this.validateRepairDate(value, true);
    }
    validateRepairDate = (value, willUpdateState = true) => {
        let msg = AssetCrashFromValidator.validateRepairDate(value, this.props.translate)
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

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateReportDate(this.state.reportDate, false) &&
            this.validateDetectionDate(this.state.detectionDate, false) &&
            // this.validateCode(this.state.asset, false) &&
            this.validateReason(this.state.reason, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        // let newDataToSubmit = {...this.state, company: this.props.auth.user.company._id}
        console.log("this.state", this.state);
        let dataToSubmit = { ...this.state, annunciator: this.props.asset.person._id, asset: this.props.asset._id };
        let newDataToUpdateAsset = {
            status: this.state.type
        };
        if (this.isFormValidated()) {
            return this.props.createAssetCrash(dataToSubmit)
                .then(({ response }) => {
                    if (response.status === 200) {
                        this.props.updateAsset(this.state.asset, newDataToUpdateAsset);
                    }
                });
        }
    };

    render() {
        const { translate, assetCrash, assetsManager, user, asset } = this.props;
        console.log('asset', asset);
        const {
            code, assetName, type, annunciator, reportDate, detectionDate, reason,
            errorOnCode, errorOnReportDate, errorOnDetectionDate, errorOnAnnunciator, errorOnReason
        } = this.state;
        return (
            <React.Fragment>
                {/* <ButtonModal modalID="modal-create-assetcrash" button_name="Báo cáo sự cố tài sản" title="Báo cáo sự cố tài sản" /> */}
                <DialogModal
                    size='75' modalID="modal-create-assetcrash"
                    formID="form-create-assetcrash"
                    title="Báo cáo sự cố tài sản"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-assetcrash">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                {/* <div className={`form-group ${errorOnCode === undefined ? "" : "has-error"}`}> */}
                                {/* <div className={`form-group `}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <select
                                        id="drops1"
                                        className="form-control"
                                        name="asset"
                                        defaultValue={asset._id}
                                        placeholder="Please Select"
                                        disabled>
                                        <option value="" disabled>Please Select</option>
                                        {assetsManager.allAsset ? assetsManager.allAsset.map((item, index) => {
                                            return (
                                                <option data-key={index} key={index} value={item.asset._id}>{item.asset.code}</option>
                                            )
                                        }) : null}
                                    </select>
                                </div> */}

                                <div className="form-group">
                                    <label>Mã tài sản</label>
                                    <input disabled type="text" className="form-control" name="code"
                                        value={asset.code} />
                                </div>

                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input disabled type="text" className="form-control" name="assetName"
                                        value={asset.assetName} />
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
                                        id="create_report_date"
                                        value={reportDate}
                                        onChange={this.handleReportDateChange}
                                    />
                                    <ErrorLabel content={errorOnReportDate} />
                                </div>

                                {/* <div className={`form-group ${errorOnCode === undefined ? "" : "has-error"}`}> */}
                            </div>

                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Người báo cáo<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="annunciator"
                                        defaultValue={asset.person._id}
                                        placeholder="Please Select"
                                        disabled
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
                                        value={asset.person.name} />
                                </div>

                                <div className={`form-group ${errorOnDetectionDate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày phát hiện sự cố<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_detection_date"
                                        value={detectionDate}
                                        onChange={this.handleDetectionDateChange}
                                    />
                                    <ErrorLabel content={errorOnDetectionDate} />
                                </div>

                                <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reason" value={reason} onChange={this.handleReasonChange} autoComplete="off"
                                        placeholder="Nội dung"></textarea>
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
    const { assetCrash, assetsManager, user } = state;
    return { assetCrash, assetsManager, user };
};

const actionCreators = {
    createAssetCrash: AssetCrashActions.createAssetCrash,
    updateAsset: AssetManagerActions.updateInformationAsset,
};

const createForm = connect(mapState, actionCreators)(withTranslate(AssetCrashCreateForm));
export { createForm as AssetCrashCreateForm };
