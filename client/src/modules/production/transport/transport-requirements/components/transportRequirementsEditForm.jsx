import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { forceCheckOrVisible, formatDate, LazyLoadComponent } from '../../../../../common-components';
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate'
import ValidationHelper from '../../../../../helpers/validationHelper';
import {generateCode} from '../../../../../helpers/generateCode'

import { TransportGeneralInfo } from './create-transport-requirements/transportGeneralInfo';
import { TransportRequirementsViewDetails } from './transportRequirementsViewDetails';
import { TransportGeneralInfoShip } from './create-transport-requirements/transportGeneralInfoShip';
import { TransportReturn } from './create-transport-requirements/transportReturn';
import { TransportImportGoods } from './create-transport-requirements/transportImportGoods';
import { TransportMaterial } from './create-transport-requirements/transportMaterial';
import { TransportNewOne} from './edit-transport-requirement/transportNewOne';
// import { TransportGoods } from './edit-transport-requirement/transportGoods';
import { TransportGoods } from './create-transport-requirements/transportGoods';
import { TransportTime } from './edit-transport-requirement/transportTime';
// import { TransportTime } from './create-transport-requirements/transportTime';

import { LocateTransportRequirement } from './edit-transport-requirement/locateTransportRequirement'

import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { GoodActions} from '../../../common-production/good-management/redux/actions';
import { transportRequirementsActions } from '../redux/actions'
import { getGeocode } from '../../transportHelper/getGeocodeGoong'

function TransportRequirementsEditForm(props) {
    
    let {curentTransportRequirementDetail, editTransportRequirement} = props;
    // Khởi tạo state
    const [state, setState] = useState({
        value: "5"
    })

    /**
     * state chứa thông tin submit
     */
    const [requirementsForm, setRequirementsForm] = useState({
        goods: [],
        timeRequests: [],
    });
    const [currentBill, setCurrentBill] = useState({
        id: "0",
    })

    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = async () => {
        /**
         * Khi tạo mới yêu cầu vận chuyển, đồng thời lấy tọa độ geocode {Lat, Lng} lưu vào db
         */
        let timeRequest = [];
        if(requirementsForm.timeRequests && requirementsForm.timeRequests.length!==0){
            requirementsForm.timeRequests.map(item => {
                timeRequest.push({
                    timeRequest: formatToTimeZoneDate(item.time),
                    description: item.detail,
                })
            })
        }
        let totalPayload=0, totalVolume=0;
        let listGoods = [] // Chuẩn hóa good => _id => good
        if (requirementsForm.goods && requirementsForm.goods.length!==0 ){
            requirementsForm.goods.map(item => {
                if (item){
                    listGoods.push({
                        payload: item.payload,
                        quantity: item.quantity,
                        volume: item.volume,
                        good: item.good?._id,
                    })

                    totalPayload+=item.payload;
                    totalVolume+=item.volume;
                }
            })
        }        
        let data ={
            volume: totalVolume,
            payload: totalPayload,
            goods: listGoods,
            timeRequests: timeRequest,
            fromAddress: requirementsForm.fromAddress,
            toAddress: requirementsForm.toAddress,
            geocode: requirementsForm.geocode,
        };
        editTransportRequirement(curentTransportRequirementDetail._id, data);
    }

    // Khởi tạo giá trị ban đầu
    useEffect(() => {
        if (curentTransportRequirementDetail){
            setRequirementsForm(curentTransportRequirementDetail);
            setState({
                ...state,
                value: String(curentTransportRequirementDetail.type),
            });
            if (curentTransportRequirementDetail.bill){
                setCurrentBill({bill: curentTransportRequirementDetail.bill, id: curentTransportRequirementDetail.bill._id});
            }
        }
    }, [curentTransportRequirementDetail])

    /**
     * Hàm lấy dữ liệu hàng hóa từ component con
     */
    const callBackGoodsInfo = (value) => {
        setRequirementsForm({
            ...requirementsForm,
            goods: value,
        })
    }

    /**
     * Hàm lấy dữ liệu thông tin khách hàng từ component con
     */
    const callBackGeneralInfo = (value) => {
        setRequirementsForm({
            ...requirementsForm,
            info: value,
        })
    }

    /**
     * Hàm lấy dữ liệu thông tin thời gian mong muốn của khách hàng từ component con
     */
    const callBackTimeInfo = (value) => {
        setRequirementsForm({
            ...requirementsForm,
            timeRequests: value,
        })
    }
    /**
     * Lấy dữ liệu về tọa độ và địa chỉ điểm giao nhận
     * {
     *  fromAddress: 
     *  fromLat:
     *  fromLng:
     *  to...
     * }
     * @param {*} value 
     */
    const callBackLocate = (value) => {
        if(value){
            setRequirementsForm({
                ...requirementsForm,
                fromAddress: value.fromAddress,
                toAddress: value.toAddress,
                geocode: {
                    fromAddress: {
                        lat: value.fromLat,
                        lng: value.fromLng,
                    },
                    toAddress: {
                        lat: value.toLat,
                        lng: value.toLng,
                    },
                }
            })
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-example-hooks" 
                isLoading={false}
                formID="modal-edit-example-hooks"
                title={'Chỉnh sửa yêu cầu vận chuyển'}
                // msg_success={translate('manage_example.add_success')}
                // msg_faile={translate('manage_example.add_fail')}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
            >
                <form id="modal-edit-example-hooks" 
                // onSubmit={() => save(translate('manage_example.add_success'))}
                >
                
                    <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#list-transport-plan" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Thông tin chung"}</a></li>
                    <li><a href="#list-arrange-plan" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Địa chỉ điểm giao và nhận hàng"}</a></li>
                    {/* <li><a href="#list-arrange-plan2" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Kế hoạch vận chuyển"}</a></li> */}
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="list-transport-plan">
                        {/* <LazyLoadComponent
                        > */}
                        
            <div className="box-body qlcv">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Thông tin chung</legend>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        Mã yêu cầu vận chuyển
                                    </label>
                                    <input type="text" className="form-control" disabled={true} 
                                        value={requirementsForm?.code}
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                            </div>
                            {
                        state.value === "1" && ( 
                            <TransportGeneralInfoShip 
                                // billId = {billInfo.value}
                                // curBill = {billDetail.curBill}   
                                currentBill = {currentBill?.bill}
                                callBackGeneralInfo={callBackGeneralInfo}
                            />
                        )
                    }
                            {
                                state.value === "2" && (
                                    < TransportReturn
                                        currentBill = {currentBill?.bill}
                                        callBackGeneralInfo={callBackGeneralInfo}
                                    />
                                )
                            }
                            {
                                state.value === "3" && (
                                    < TransportImportGoods
                                        currentBill = {currentBill?.bill}
                                        callBackGeneralInfo={callBackGeneralInfo}
                                        // nameStock = {importGoodsDetails.nameStock}
                                        // addressStock ={importGoodsDetails.addressStock}
                                    />
                                )
                            }
                            {
                                state.value === "4" && (
                                    < TransportMaterial
                                    />
                                )
                            }
                            {
                                state.value === "5" && (
                                    < TransportNewOne
                                        callBackGeneralInfo = {callBackGeneralInfo}
                                        curentTransportRequirementDetail={curentTransportRequirementDetail}
                                    />
                                )
                            }
                            < TransportGoods 
                                goods = {curentTransportRequirementDetail?.goods}
                                callBackState = {callBackGoodsInfo}
                            />
                            < TransportTime 
                                callBackState = {callBackTimeInfo}
                                timeRequested = {curentTransportRequirementDetail?.timeRequests}
                                componentId={"edit-time"}
                            />
                                {/* </LazyLoadComponent> */}
                            </div>
                            </div>
                            <div className="tab-pane" id="list-arrange-plan">
                                <LazyLoadComponent
                                >
                                    <LocateTransportRequirement 
                                        curentTransportRequirementDetail={curentTransportRequirementDetail}
                                        callBackLocate={callBackLocate}
                                    />
                                </LazyLoadComponent>
                            </div>
                            {/* <div className="tab-pane" id="list-arrange-plan2">
                                <LazyLoadComponent
                                > */}
                                    {/* <LocateTransportRequirement 
                                        curentTransportRequirementDetail={curentTransportRequirementDetail}
                                        callBackLocate={callBackLocate}
                                    /> */}
                                {/* </LazyLoadComponent>
                            </div> */}
                        </div>
                    </div>
                    
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    return {}
}

const actions = {
    getBillsByType: BillActions.getBillsByType,
    // getCustomers: CrmCustomerActions.getCustomers,
}

const connectedTransportRequirementsEditForm = connect(mapState, actions)(withTranslate(TransportRequirementsEditForm));
export { connectedTransportRequirementsEditForm as TransportRequirementsEditForm };