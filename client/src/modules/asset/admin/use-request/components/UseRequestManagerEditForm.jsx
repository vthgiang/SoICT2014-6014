import React, { Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, TimePicker, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';

import { UseRequestActions } from '../../../admin/use-request/redux/actions'
import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { AssetManagerActions } from '../../asset-information/redux/actions';

import ValidationHelper from '../../../../../helpers/validationHelper';

function UseRequestManagerEditForm(props) {
    const [state, setState] =  useState({
        status: "waiting_approval",
        managedBy: props.employeeId ? props.employeeId : ''
    })
    const [prevProps, setPrevProps] = useState({
        _id: null
    })

    if (prevProps._id !== props._id) {
        let startDate, endDate, startTime, stopTime;
        let partStart = new Date(props.dateStartUse);
        let partStop = new Date(props.dateEndUse);

        if (props.asset && props.asset.typeRegisterForUse == 2) {
            let hourStart, hourEnd, minutesStart, minutesEnd;
            if (partStart.getHours() < 10) {
                hourStart = "0" + partStart.getHours()
            } else {
                hourStart = partStart.getHours()
            }

            if (partStart.getMinutes() < 10) {
                minutesStart = "0" + partStart.getMinutes()
            } else {
                minutesStart = partStart.getMinutes()
            }

            if (partStop.getHours() < 10) {
                hourEnd = "0" + partStop.getHours()
            } else {
                hourEnd = partStop.getHours()
            }

            if (partStop.getMinutes() < 10) {
                minutesEnd = "0" + partStop.getMinutes()
            } else {
                minutesEnd = partStop.getMinutes()
            }

            startTime = [hourStart, minutesStart].join(':');
            startDate = [partStart.getDate(), (partStart.getMonth() + 1), partStart.getFullYear()].join('-');
            stopTime = [hourEnd, minutesEnd].join(':');
            endDate = [partStop.getDate(), (partStop.getMonth() + 1), partStop.getFullYear()].join('-');
        } else {
            if (props.dateStartUse) {
                startDate = [partStart.getDate(), (partStart.getMonth() + 1), partStart.getFullYear()].join('-');
            } else {
                startDate = null;
            }

            if (props.dateEndUse) {
                endDate = [partStop.getDate(), (partStop.getMonth() + 1), partStop.getFullYear()].join('-');
            } else {
                endDate = null;
            }
        }
        setState(state =>{
            return{
                ...state,
                _id: props._id,
                recommendNumber: props.recommendNumber,
                dateCreate: props.dateCreate,
                proponent: props.proponent,
                reqContent: props.reqContent,
                asset: props.asset,
                dateStartUse: startDate,
                dateEndUse: endDate,
                startTime: props.asset && props.asset.typeRegisterForUse == 2 ? startTime : null,
                stopTime: props.asset && props.asset.typeRegisterForUse == 2 ? stopTime : null,
                approver: props.approver,
                status: props.status,
                note: props.note,
                errorOnRecommendNumber: undefined,
                errorOnDateCreate: undefined,
                errorOnReqContent: undefined,
                errorOnDateStartUse: undefined,
                errorOnDateEndUse: undefined,
            }
        })
        setPrevProps(props)
            
    }
    

    useEffect(() => {
        if(state.status == "approved")
            setState(state =>{
                return{
                    ...state,
                    createUsage: true
                }
            })
    }, [state.status])

    const { _id } = props;
    const { translate, recommendDistribute, user, assetsManager, auth } = props;
    const {
        recommendNumber, dateCreate, proponent, reqContent, asset, dateStartUse, dateEndUse, approver, status, note, startTime, stopTime,
        errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse, typeRegisterForUse
    } = state;

    var assetlist = assetsManager.listAssets;
    var userlist = user.list;


    
    const formatDate = (date, monthYear = false) => {
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

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    // Bắt sự kiện thay đổi mã phiếu
    const handleRecommendNumberChange = (e) => {
        let value = e.target.value;
        validateRecommendNumber(value, true);
    }
    const validateRecommendNumber = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleDateCreateChange = (value) => {
        validateDateCreate(value, true);
    }
    const validateDateCreate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);
        // let partCreate = value.split('-');
        // let dateCreate = [partCreate[2], partCreate[1], partCreate[0]].join('-');
        if (willUpdateState) {
            setState(state => {
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
    const handleProponentChange = (value) => {
        setState(state =>{
            return {
                ...state,
                proponent: value[0]
            }
        });
    }

    // Bắt sự kiện thay đổi "Nội dung đề nghị"
    const handleReqContentChange = (e) => {
        let value = e.target.value;
        validateReqContent(value, true);
    }
    const validateReqContent = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleAssetChange = (value) => {
        setState(state =>{
            return {
                ...state,
                asset: value[0]
            }
        });
    }

    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng từ ngày"
    const handleDateStartUseChange = (value) => {
        validateDateStartUse(value, true);
    }
    const validateDateStartUse = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleDateEndUseChange = (value) => {
        validateDateEndUse(value, true);
    }
    const validateDateEndUse = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnDateEndUse: message,
                    dateEndUse: value,
                }
            });
        }
        return message === undefined;
    }

    //Bắt sự kiện thay đổi "Người phê duyệt"
    const handleApproverChange = (value) => {
        setState({
            ...state,
            approver: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Trạng thái"
    const handleStatusChange = (value) => {
        setState(state =>{
            return {
                ...state,
                status: value[0]
            }
        })
    }

    // Bắt sự kiện thay đổi "Ghi chú"
    const handleNoteChange = (e) => {
        let value = e.target.value;
        validateNote(value, true);
    }
    const validateNote = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnReason: message,
                    note: value,
                }
            });
        }
        return message === undefined;
    }

    const handleStartTimeChange = (value) => {
        setState(state => {
            return {
                ...state,
                startTime: value
            }
        });
    }


    const handleStopTimeChange = (value) => {
        setState(state => {
            return {
                ...state,
                stopTime: value
            }
        });
    }
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let result = validateDateCreate(state.dateCreate, false) &&
            validateReqContent(state.reqContent, false) &&
            validateDateStartUse(state.dateCreate, false)

        return result;
    }

    const save = () => {
        let { managedBy, createUsage } = state

        let dataToSubmit = { ...state, approver: props.auth.user._id };
        if (isFormValidated()) {
            let data = {
                status: dataToSubmit.status,
                recommendNumber: dataToSubmit.recommendNumber,
                dateCreate: dataToSubmit.dateCreate,
                proponent: dataToSubmit.proponent._id, // Người đề nghị
                reqContent: dataToSubmit.reqContent, // Người đề nghị
                asset: dataToSubmit.asset ? dataToSubmit.asset._id : undefined,
                dateStartUse: dataToSubmit.dateStartUse,
                dateEndUse: dataToSubmit.dateEndUse,
                approver: dataToSubmit.approver, // Người phê duyệt
                note: dataToSubmit.note,
                stopTime: dataToSubmit.stopTime,
                startTime: dataToSubmit.startTime
            }
            if (createUsage == true && dataToSubmit.asset) {
                let checkCreateUsage = false;
                for (let i in dataToSubmit.asset.usageLogs) {
                    if (dataToSubmit.asset.usageLogs[i].assetUseRequest && dataToSubmit.asset.usageLogs[i].assetUseRequest == state._id) {
                        checkCreateUsage = true
                    }
                }
                if (checkCreateUsage === false) {

                    let dateStartUse, dateEndUse;
                    if (dataToSubmit.dateStartUse) {
                        let start = dataToSubmit.dateStartUse.split("-");
                        if (dataToSubmit.startTime) {
                            dateStartUse = start[2] + "-" + start[1] + "-" + start[0] + " " + dataToSubmit.startTime
                        } else {
                            dateStartUse = start[2] + "-" + start[1] + "-" + start[0]
                        }
                    }
                    if (dataToSubmit.dateEndUse) {
                        let end = dataToSubmit.dateEndUse.split("-");
                        if (dataToSubmit.stopTime) {
                            dateEndUse = end[2] + "-" + end[1] + "-" + end[0] + " " + dataToSubmit.stopTime
                        } else {
                            dateEndUse = end[2] + "-" + end[1] + "-" + end[0]
                        }
                    }

                    let newUsage = {
                        usedByUser: dataToSubmit.proponent._id,
                        usedByOrganizationalUnit: null,
                        startDate: dateStartUse,
                        endDate: dateEndUse,
                        assetUseRequest: state._id,
                        description: dataToSubmit.note

                    }

                    let usageLogs = dataToSubmit.asset.usageLogs
                    usageLogs.push(newUsage)
                    let createNewUsage = {
                        usageLogs: usageLogs,
                        status: "in_use",
                        assignedToUser: newUsage.usedByUser,
                        assignedToOrganizationalUnit: undefined,
                    }
                    props.createUsage(dataToSubmit.asset._id, createNewUsage)
                }
            }
            return props.updateRecommendDistribute(state._id, data, managedBy);
        }
    }


    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-edit-recommenddistributemanage" isLoading={recommendDistribute.isLoading}
                formID="form-edit-recommenddistributemanage"
                title={translate('asset.asset_info.edit_usage_info')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form cập nhật phiếu đăng ký sử dụng tài sản */}
                <form className="form-group" id="form-edit-recommenddistribute">
                    <div className="col-md-12">

                        <div className="col-sm-6">
                            {/* Mã phiếu */}
                            <div className={`form-group ${!errorOnRecommendNumber ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.form_code')}</label>
                                <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={handleRecommendNumberChange} autoComplete="off" placeholder={translate('asset.general_information.form_code')} />
                                <ErrorLabel content={errorOnRecommendNumber} />
                            </div>

                            {/* Ngày lập */}
                            <div className={`form-group ${!errorOnDateCreate ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_date${_id}`}
                                    value={formatDate(dateCreate)}
                                    onChange={handleDateCreateChange}
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
                                            onChange={handleProponentChange}
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
                                <textarea className="form-control" rows="3" name="reqContent" value={reqContent} onChange={handleReqContentChange} autoComplete="off" placeholder={translate('asset.general_information.content')} ></textarea>
                                <ErrorLabel content={errorOnReqContent} />
                            </div>

                            {/* Tài sản */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.asset')}</label>
                                <div>
                                    <div id="edit_asset">
                                        <SelectBox
                                            id={`edit_asset${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => {
                                                return { value: x.id, text: x.code + " - " + x.assetName }
                                            })}
                                            onChange={handleAssetChange}
                                            value={asset ? asset.id : null}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            {/* Thời gian đăng ký sử dụng từ ngày */}
                            <div className={`form-group ${!errorOnDateStartUse ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_use`}
                                    value={dateStartUse}
                                    onChange={handleDateStartUseChange}
                                />
                                {asset && asset.typeRegisterForUse == 2 &&
                                    < TimePicker
                                        id={`edit_start_time_use${_id}`}
                                        ref={`edit_start_time_use${_id}`}
                                        value={startTime}
                                        onChange={handleStartTimeChange}
                                    />
                                }

                                <ErrorLabel content={errorOnDateStartUse} />
                            </div>

                            {/* Thời gian đăng ký sử dụng đến ngày */}
                            <div className={`form-group ${!errorOnDateEndUse ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.handover_to_date')}</label>
                                <DatePicker
                                    id={`edit_end_use`}
                                    value={dateEndUse}
                                    onChange={handleDateEndUseChange}
                                />
                                {
                                    asset && asset.typeRegisterForUse == 2 &&
                                    < TimePicker
                                        id={`edit_stop_time_use${_id}`}
                                        value={stopTime}
                                        onChange={handleStopTimeChange}
                                    />
                                }
                                <ErrorLabel content={errorOnDateEndUse} />
                            </div>

                            {/* Người phê duyệt */}
                            <div className={`form-group`}>
                                <label>{translate('asset.usage.accountable')}</label>
                                <div>
                                    <div id="approver">
                                        <SelectBox
                                            id={`approver${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => {
                                                return { value: x._id, text: x.name + " - " + x.email }
                                            })}
                                            onChange={handleApproverChange}
                                            value={approver ? approver._id : null}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
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
                                    onChange={handleStatusChange}
                                />
                            </div>

                            {/* Ghi chú */}
                            <div className="form-group">
                                <label>{translate('asset.usage.note')}</label>
                                <textarea className="form-control" rows="3" name="note" value={note} onChange={handleNoteChange}></textarea>
                            </div>

                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { recommendDistribute, auth, user, assetsManager } = state;
    return { recommendDistribute, auth, user, assetsManager };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,
    createUsage: UseRequestActions.createUsage,
};

const editUseRequestManager = connect(mapState, actionCreators)(withTranslate(UseRequestManagerEditForm));
export { editUseRequestManager as UseRequestEditForm };
