import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

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

import { exampleActions } from '../redux/actions';

import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { GoodActions} from '../../../common-production/good-management/redux/actions';
import { transportRequirementsActions } from '../redux/actions'
import { getGeocode } from '../../transportHelper/getGeocodeGoong'

function TransportRequirementsCreateForm(props) {

    // const { translate, example, page, perPage } = props;
    // const { exampleName, description, exampleNameError } = state1;

    // /**
    //  * Hàm dùng để kiểm tra xem form đã được validate hay chưa
    //  */
    // const isFormValidated = () => {
    //     if (!exampleNameError.status) {
    //         return false;
    //     }
    //     return true;
    // }


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

    const { translate, example, page, perPage } = props;

    const { exampleName, description, exampleNameError } = state;

    const isFormValidated = () => {
        if (!exampleNameError.status) {
            return false;
        }
        return true;
    }
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

    const handleTypeBillChange = (value) => {
        console.log(value[0]);
        if (value[0] !== "0") {
            setBillId({
                ...billId,
                id: value[0],
            });
        }
    }

    useEffect(() => {
        let currentBill = props.bills.filter(r => r._id === billId.id);
        setBillDetail({
            ...billDetail,
            currentBill: currentBill[0]
        })
        
    }, [billId])

    useEffect(() => {
        let nameStock = "", 
            addressStock = "", 
            goods=[];
        if (state.value==="3" && billId.id !==""){
            if (billDetail.currentBill) {
                if (billDetail.currentBill.fromStock){
                    nameStock = billDetail.currentBill.fromStock.name;
                    addressStock = billDetail.currentBill.fromStock.address;
                }
                if (billDetail.currentBill.goods){
                    goods = billDetail.currentBill.goods;
                }
            }
            setImportGoodsDetails({
                ...importGoodsDetails,
                nameStock: nameStock,
                addressStock: addressStock,
            })
            setGoodsTransport(goods)
        }

    }, [billDetail]);

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
            <ButtonModal
                    onButtonCallBack={handleClickCreateCode}
                    modalID={"modal-create-transport-requirements"}
                    button_name={"Yêu cầu vận chuyển mới"}
                    title={"Yêu cầu vận chuyển mới"}
            />
            <DialogModal
                modalID="modal-create-transport-requirements" 
                isLoading={false}
                formID="form-create-transport-requirements"
                title={translate('manage_transport.add_requirements')}
                // msg_success={translate('manage_example.add_success')}
                // msg_faile={translate('manage_example.add_fail')}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
            >
                <form id="form-create-transport-requirements" 
                // onSubmit={() => save(translate('manage_example.add_success'))}
                >
                  
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
                                        value={requirementsForm.code}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        Loại yêu cầu
                                        <span className="attention"> * </span>
                                    </label>
                                    <SelectBox
                                        id={`select-type-requirement`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={"5"}
                                        items={requirements}
                                        onChange={handleTypeRequirementChange}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                {
                                    state.value !== "5" &&
                                    <div className={`form-group`}>
                                        <label>
                                            Phiếu kho
                                            <span className="attention"> * </span>
                                        </label>
                                        <SelectBox
                                            id={`select-bills`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={"0"}
                                            items={getBills()}
                                            onChange={handleTypeBillChange}
                                            multiple={false}
                                        />
                                    </div>
                                }
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
                        goods = {goodsTransport}
                        callBackState = {callBackGoodsInfo}
                    />
                    < TransportTime 
                        callBackState = {callBackTimeInfo}
                    />
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    // const example = state.example1;
    // return { example }  
    console.log(state, " day la state");    
    const bills = state.bills.listPaginate;
    // const listAllGoods = state.goods.listALLGoods;
    return { bills }
}

const actions = {
    getBillsByType: BillActions.getBillsByType,
    getCustomers: CrmCustomerActions.getCustomers,
    createTransportRequirement: transportRequirementsActions.createTransportRequirement,
}

const connectedTransportRequirementsCreateForm = connect(mapState, actions)(withTranslate(TransportRequirementsCreateForm));
export { connectedTransportRequirementsCreateForm as TransportRequirementsCreateForm };