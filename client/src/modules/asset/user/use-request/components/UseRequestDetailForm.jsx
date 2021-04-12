import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox, TimePicker } from '../../../../../common-components';

import { RecommendDistributeActions } from '../redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';

function UseRequestDetailForm (props) {
    const [state, setState] = useState({})
    const [prevProps, setPrevProps] = useState({
        _id : null,
    })

     // Function format dữ liệu Date thành string
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

    if(prevProps._id !== props._id){
        setState(state =>{
            return{ 
                ...state,
                _id: props._id,
                recommendNumber: props.recommendNumber,
                dateCreate: props.dateCreate,
                proponent: props.proponent,
                reqContent: props.reqContent,
                asset: props.asset,
                dateStartUse: props.dateStartUse,
                dateEndUse: props.dateEndUse,
                approver: props.approver,
                status: props.status,
                startTime: props.startTime,
                stopTime: props.stopTime,
                note: props.note,
            }
        })

        setPrevProps(props)
    }


 
    const { _id, id } = props;
    const { translate, recommendDistribute, user, assetsManager, auth } = props;
    const {
        recommendNumber, dateCreate, proponent, asset, reqContent, dateStartUse, dateEndUse,
        errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse, startTime, stopTime
    } = state;
    var assetlist = assetsManager.listAssets;
    var userlist = user.list;
    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`modal-recommenddistribute-detail-${id}`} isLoading={recommendDistribute.isLoading}
                formID="form-edit-recommenddistribute"
                title={'Thông tin chi tiết đăng ký sử dụng'}
                hasSaveButton = {false}    
            >
                {/* Form chỉnh sửa thông tin đăng ký sử dụng tài sản */}
                <form className="form-group" id="form-edit-recommenddistribute">
                    <div className="col-md-12">

                        <div className="col-sm-6">
                            {/* Mã phiếu */}
                            <div className={`form-group ${!errorOnRecommendNumber ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.form_code')}</label>
                                <input type="text" className="form-control" name="recommendNumber" value={recommendNumber}  autoComplete="off" placeholder="Mã phiếu"  disabled/>
                                <ErrorLabel content={errorOnRecommendNumber} />
                            </div>

                            {/* Ngày lập */}
                            <div className={`form-group ${!errorOnDateCreate ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_date${_id}`}
                                    value={formatDate(dateCreate)}
                                    disabled
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
                                <textarea className="form-control" rows="3" name="reqContent" value={reqContent}  autoComplete="off" placeholder="Nội dung đề nghị"></textarea>
                                <ErrorLabel content={errorOnReqContent}  disabled/>
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
                                    value={formatDate(dateStartUse)}
                                    disabled
                                />
                                <TimePicker
                                    id={`time-picker-start${_id}`}
                                    value={startTime}
                                    disabled
                                />
                                <ErrorLabel content={errorOnDateStartUse} />
                            </div>

                            {/* Thời gian đăng ký sử dụng đến ngày */}
                            <div className={`form-group ${!errorOnDateEndUse ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.handover_to_date')}</label>
                                <DatePicker
                                    id={`edit_end_use${_id}`}
                                    value={formatDate(dateEndUse)}
                                    disabled
                                />
                                <TimePicker
                                    id={`time-picker-end${_id}`}
                                    value={stopTime}
                                    disabled
                                />
                                <ErrorLabel content={errorOnDateEndUse} disabled/>
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
};

const displayRecommendDistribute = connect(mapState, actionCreators)(withTranslate(UseRequestDetailForm));
export { displayRecommendDistribute as UseRequestDetailForm };
