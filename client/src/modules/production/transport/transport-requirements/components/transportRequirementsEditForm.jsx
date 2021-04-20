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

import { LocateAndPlan } from './edit-transport-requirement/locateAndPlan'

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

    const [billDetail, setBillDetail] = useState({})

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
        const {payload, volume} = getTotalPayloadVolume(requirementsForm.goods);
        /**
         * Khi tạo mới yêu cầu vận chuyển, đồng thời lấy tọa độ geocode {Lat, Lng} lưu vào db
         */
        let fromLat, fromLng;
        let toLat, toLng;
        if (requirementsForm.info.customer1AddressTransport){
            await getGeocode(requirementsForm.info.customer1AddressTransport).then(
                (value) => {
                    fromLat = value.lat;
                    fromLng = value.lng;
                }
            );
        }
        if (requirementsForm.info.customer2AddressTransport){
            await getGeocode(requirementsForm.info.customer2AddressTransport).then(
                (value) => {
                    toLat = value.lat;
                    toLng = value.lng;
                }
            );
        }

        let data = {
            status: 1,
            code: requirementsForm.code,
            type: state.value, 
            fromAddress: requirementsForm.info.customer1AddressTransport ? requirementsForm.info.customer1AddressTransport : "",
            toAddress: requirementsForm.info.customer2AddressTransport ? requirementsForm.info.customer2AddressTransport : [],
            goods : formatGoodsForSubmit(requirementsForm.goods),
            payload: payload,
            volume: volume,
            timeRequests: formatTimeForSubmit(requirementsForm.timeRequests),
            fromLat: fromLat,
            fromLng: fromLng,
            toLat: toLat,
            toLng: toLng,
        }
        props.createTransportRequirement(data)
    }


    /**
     * chuẩn hóa dữ liệu goods để lưu vào db
     */
    const formatGoodsForSubmit = (goods) => {
        let goodMap = goods.map((item) => {
            return {
                good: item._id,
                quantity: item.quantity,
                volume: item.volume,
                payload: item.payload,
            };
        });
        return goodMap;
    }

    const getTotalPayloadVolume = (goods) => {
        let payload = 0;
        let volume = 0;
        if (goods && goods.length !==0) {
            goods.map((good) => {
                payload+=Number(good.payload);
                volume+=Number(good.volume)
            })
        }
        return {payload, volume};
    }

    /**
     * chuẩn hóa dữ liệu time request để lưu vào db
     */
    const formatTimeForSubmit = (time) => {
        let timeMap = time.map((item) => {
            return {
                timeRequest: formatToTimeZoneDate(item.time),
                description: item.detail,
            }
        })
        return timeMap;
    }

    const handleTypeRequirementChange = (value) => {        
        const requirement = requirements.filter(r => r.value === value[0]);
        if (value[0] !== "0") {
            setState({
                ...state,
                value: value[0],
                billGroup: requirement[0].billGroup,
                billType: requirement[0].billType,
            });
        }
    }

    const getBills = () => {
        let listBills = [
            {
                value: "0",
                text: "Chọn phiếu",
            },
        ];
        const listAllBills = props.bills;        
        if (listAllBills) {
            listAllBills.map((item) => {
                listBills.push({
                    value: item._id,
                    text: item.code,
                });
            });
        }
        return listBills;
    }

    useEffect(() => {
        props.getCustomers();
        props.getBillsByType({ page:1, limit:30, group: parseInt(state.billGroup), managementLocation: localStorage.getItem("currentRole") });
    },[state])

    // useEffect(() => {
    //     const getGoods = async () => {
    //         props.getAllGoods();
    //     }
    //     getGoods();
    // }, [state, billId])

    useEffect(() => {
        console.log(curentTransportRequirementDetail, " curentTransportRequirementDetail");
    }, [curentTransportRequirementDetail])

    const handleTypeBillChange = (value) => {
        console.log(value[0]);
        if (value[0] !== "0") {
            setBillId({
                ...billId,
                id: value[0],
            });
        }
    }

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

    const handleClickCreateCode = () => {
        setRequirementsForm({
            ...requirementsForm,
            code: generateCode("YCVC"),
        })
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-example-hooks" 
                isLoading={false}
                formID="modal-edit-example-hooks"
                title={'manage_transport.add_requirements'}
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
                    <li><a href="#list-arrange-plan" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Tọa độ và kế hoạch"}</a></li>
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
                                        value={curentTransportRequirementDetail?.code}
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
                                    <LocateAndPlan 
                                    curentTransportRequirementDetail={curentTransportRequirementDetail}
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