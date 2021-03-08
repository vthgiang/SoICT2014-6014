import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, TimePicker, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';

import { RecommendDistributeActions } from '../redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';

import ValidationHelper from '../../../../../helpers/validationHelper';

class UseRequestEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            stopTime: null,
        };
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [day, month, year].join('-');
    }
    // Bắt sự kiện thay đổi mã phiếu
    handleRecommendNumberChange = (e) => {
        let value = e.target.value;
        this.validateRecommendNumber(value, true);
    }
    validateRecommendNumber = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnRecommendNumber: message,
                    recommendNumber: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCreate: message,
                    dateCreate: value,
                }
            });
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi người đề nghị
     */
    handleProponentChange = (value) => {
        this.setState({
            ...this.state,
            proponent: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Nội dung đề nghị"
    handleReqContentChange = (e) => {
        let value = e.target.value;
        this.validateReqContent(value, true);
    }
    validateReqContent = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReqContent: message,
                    reqContent: value,
                }
            });
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng từ ngày"
    handleDateStartUseChange = (value) => {
        this.validateDateStartUse(value, true);
    }
    validateDateStartUse = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateStartUse: message,
                    dateStartUse: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng đến ngày"
    handleDateEndUseChange = (value) => {
        this.validateDateEndUse(value, true);
    }
    validateDateEndUse = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateEndUse: message,
                    dateEndUse: value,
                }
            });
        }
        return message === undefined;
    }

    handleStartTimeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                startTime: value
            }
        });

    }

    handleStopTimeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                stopTime: value
            }
        });

    }
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateDateCreate(this.state.dateCreate, false) &&
            this.validateReqContent(this.state.reqContent, false) &&
            this.validateDateStartUse(this.state.dateCreate, false)

        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            return this.props.updateRecommendDistribute(this.state._id, this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            let startTime, stopTime;
            if (nextProps.asset.typeRegisterForUse == 2) {
                let dateStartUse = new Date(nextProps.dateStartUse),
                    dateEndUse = new Date(nextProps.dateEndUse)
                let hourStart = dateStartUse.getHours(),
                    minutesStart = dateStartUse.getMinutes(),
                    hourEnd = dateEndUse.getHours(),
                    minutesEnd = dateEndUse.getMinutes();
                if (hourStart < 10) {
                    hourStart = '0' + hourStart;
                }

                if (hourEnd < 10) {
                    hourEnd = '0' + hourEnd;
                }


                startTime = [hourStart, minutesStart].join(":")
                stopTime = [hourEnd, minutesEnd].join(":")
            }
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                reqContent: nextProps.reqContent,
                asset: nextProps.asset,
                dateStartUse: nextProps.dateStartUse,
                dateEndUse: nextProps.dateEndUse,
                startTime: nextProps.asset.typeRegisterForUse == 2 ? startTime : null,
                stopTime: nextProps.asset.typeRegisterForUse == 2 ? stopTime : null,
                approver: nextProps.approver,
                status: nextProps.status,
                note: nextProps.note,
                errorOnRecommendNumber: undefined,
                errorOnDateCreate: undefined,
                errorOnReqContent: undefined,
                errorOnDateStartUse: undefined,
                errorOnDateEndUse: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { _id } = this.props;
        const { translate, recommendDistribute, user, assetsManager, auth } = this.props;
        const {
            recommendNumber, dateCreate, proponent, asset, reqContent, dateStartUse, dateEndUse,
            errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse,
            errorOnDateEndUse, startTime, stopTime, status, note
        } = this.state;

        var assetlist = assetsManager.listAssets;
        var userlist = user.list;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-recommenddistribute" isLoading={recommendDistribute.isLoading}
                    formID="form-edit-recommenddistribute"
                    title={translate('asset.asset_info.edit_usage_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin đăng ký sử dụng tài sản */}
                    <form className="form-group" id="form-edit-recommenddistribute">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group ${!errorOnRecommendNumber ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnRecommendNumber} />
                                </div>

                                {/* Ngày lập */}
                                <div className={`form-group ${!errorOnDateCreate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_date${_id}`}
                                        value={this.formatDate(dateCreate)}
                                        onChange={this.handleDateCreateChange}
                                    />
                                    <ErrorLabel content={errorOnDateCreate} />
                                </div>

                                {/* Người đề nghị */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.usage.proponent')}</label>
                                    <div>
                                        <div id="proponentBox">
                                            <SelectBox
                                                id={`proponent${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleProponentChange}
                                                value={proponent ? proponent._id : null}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Nội dung đề nghị */}
                                <div className={`form-group ${!errorOnReqContent ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" name="reqContent" value={reqContent} onChange={this.handleReqContentChange} autoComplete="off" placeholder="Nội dung đề nghị"></textarea>
                                    <ErrorLabel content={errorOnReqContent} />
                                </div>

                                {/* Ghi chú */}
                                <div className="form-group">
                                    <label>{translate('asset.usage.note')}</label>
                                    <textarea className="form-control" rows="3" name="note" value={note} onChange={this.handleNoteChange} disabled></textarea>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Tài sản */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.asset')}</label>
                                    <div>
                                        <div id="assetUBox">
                                            <SelectBox
                                                id={`asset${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={assetlist.map(x => {
                                                    return { value: x._id, text: x.code + " - " + x.assetName }
                                                })}
                                                onChange={this.handleAssetChange}
                                                value={asset ? asset._id : null}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thời gian đăng ký sử dụng từ ngày */}
                                <div className={`form-group ${!errorOnDateStartUse ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_use${_id}`}
                                        value={this.formatDate(dateStartUse)}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                    {this.props.asset.typeRegisterForUse == 2 &&
                                        <TimePicker
                                            id={`time-picker-start`}
                                            onChange={this.handleStartTimeChange}
                                            value={startTime}
                                        // getDefaultValue = {this.getDefaultStartValue}
                                        />
                                    }
                                    <ErrorLabel content={errorOnDateStartUse} />
                                </div>

                                {/* Thời gian đăng ký sử dụng đến ngày */}
                                <div className={`form-group ${!errorOnDateEndUse ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.handover_to_date')}</label>
                                    <DatePicker
                                        id={`edit_end_use${_id}`}
                                        value={this.formatDate(dateEndUse)}
                                        onChange={this.handleDateEndUseChange}
                                    />
                                    {this.props.asset.typeRegisterForUse == 2 &&
                                        <TimePicker
                                            id={`time-picker-end`}
                                            onChange={this.handleStopTimeChange}
                                            value={stopTime}
                                        // getDefaultValue = {this.getDefaultEndValue}
                                        />
                                    }
                                    <ErrorLabel content={errorOnDateEndUse} />
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}</label>
                                    <SelectBox
                                        id={`status${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={[
                                            { value: 'approved', text: translate('asset.usage.approved') },
                                            { value: 'waiting_for_approval', text: translate('asset.usage.waiting_approval') },
                                            { value: 'disapproved', text: translate('asset.usage.not_approved') },
                                        ]}
                                        disabled
                                    />
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
    const { recommendDistribute, auth, user, assetsManager } = state;
    return { recommendDistribute, auth, user, assetsManager };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,
};

const editRecommendDistribute = connect(mapState, actionCreators)(withTranslate(UseRequestEditForm));
export { editRecommendDistribute as UseRequestEditForm };
