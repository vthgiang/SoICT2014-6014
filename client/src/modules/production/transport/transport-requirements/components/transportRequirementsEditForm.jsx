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
import { TransportNewOne} from './create-transport-requirements/transportNewOne';
import { TransportGoods } from './create-transport-requirements/transportGoods';
import { TransportTime } from './create-transport-requirements/transportTime';

import { LocateTransportRequirement } from './edit-transport-requirement/locateTransportRequirement'

import { exampleActions } from '../redux/actions';

import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { GoodActions} from '../../../common-production/good-management/redux/actions';
import { transportRequirementsActions } from '../redux/actions'
import { getGeocode } from '../../transportHelper/getGeocodeGoong'

function TransportRequirementsEditForm(props) {
    
    let {curentTransportRequirementDetail} = props;
    
    const requirements = [
        {
            value: "1",
            text: "Giao hàng",
            billType: "3",
            billGroup: "2",
        },
        {
            value: "2",
            text: "Trả hàng",
            billType: "5",
            billGroup: "3",
        },
        {
            value: "3",
            text: "Chuyển thành phẩm tới kho",
            billType: "1",
            billGroup: "1",
        },
        {
            value: "4",
            text: "Giao nguyên vật liệu",
            billType: "4",
            billGroup: "2"
        },
        {
            value: "5",
            text: "Khác",
        }
    ];
    // Khởi tạo state
    const [state, setState] = useState({
        value: "5",
        billGroup: "2",
        billType: "3"
    })

    /**
     * state chứa thông tin submit
     */
    const [requirementsForm, setRequirementsForm] = useState({
        goods: [],
        timeRequests: [],
    });


    const [billId, setBillId] = useState({
        id: "",
    });


    const [importGoodsDetails, setImportGoodsDetails] = useState({
        addressStock: "",
        nameStock: ""
    })

    const [goodsTransport, setGoodsTransport] = useState([])

    const [goodDetails, setGoodDetails] = useState({
        good: [],
    })
    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = async () => {
        //     if (isFormValidated() && exampleName) {
        //         props.createExample([{ exampleName, description }]);
        //         props.getExamples({
        //             exampleName: "",
        //             page: page,
        //             perPage: perPage
        //         });
        //     }
        // const {payload, volume} = getTotalPayloadVolume(requirementsForm.goods);
        /**
         * Khi tạo mới yêu cầu vận chuyển, đồng thời lấy tọa độ geocode {Lat, Lng} lưu vào db
         */
        console.log(requirementsForm, " 2123");
    }

     useEffect(() => {
        props.getCustomers();
        props.getBillsByType({ page:1, limit:30, group: parseInt(state.billGroup), managementLocation: localStorage.getItem("currentRole") });
    },[state])

    useEffect(() => {
        console.log(curentTransportRequirementDetail, " curentTransportRequirementDetail");
        if (curentTransportRequirementDetail){
            setRequirementsForm(curentTransportRequirementDetail);
        }
    }, [curentTransportRequirementDetail])

    useEffect(() => {
        console.log(requirementsForm);
    }, [requirementsForm])

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
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="list-transport-plan">
                        {/* <LazyLoadComponent
                        > */}
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
                                    />
                                )
                            }
                            {
                                state.value === "2" && (
                                    < TransportReturn
                                    />
                                )
                            }
                            {
                                state.value === "3" && (
                                    < TransportImportGoods
                                        nameStock = {importGoodsDetails.nameStock}
                                        addressStock ={importGoodsDetails.addressStock}
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
                            />
                                {/* </LazyLoadComponent> */}
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
                        </div>
                    </div>
                    
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
}

const actions = {
    getBillsByType: BillActions.getBillsByType,
    getCustomers: CrmCustomerActions.getCustomers,
    createTransportRequirement: transportRequirementsActions.createTransportRequirement,
}

const connectedTransportRequirementsEditForm = connect(mapState, actions)(withTranslate(TransportRequirementsEditForm));
export { connectedTransportRequirementsEditForm as TransportRequirementsEditForm };