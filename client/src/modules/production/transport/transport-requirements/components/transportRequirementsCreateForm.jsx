import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

import { formatToTimeZoneDate } from '../../../../../helpers/formatDate'
import ValidationHelper from '../../../../../helpers/validationHelper';
import {generateCode} from '../../../../../helpers/generateCode'

import { TransportGeneralInfoShip } from './create-transport-requirements/transportGeneralInfoShip';
import { TransportReturn } from './create-transport-requirements/transportReturn';
import { TransportImportGoods } from './create-transport-requirements/transportImportGoods';
import { TransportMaterial } from './create-transport-requirements/transportMaterial';
import { TransportNewOne} from './create-transport-requirements/transportNewOne';
import { TransportGoods } from './create-transport-requirements/transportGoods';
import { TransportTime } from './create-transport-requirements/transportTime';


import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { GoodActions} from '../../../common-production/good-management/redux/actions';
import { transportRequirementsActions } from '../redux/actions'
import { transportDepartmentActions } from '../../transport-department/redux/actions'
import { getListTypeRequirement, getValueTypeRequirement, getTypeRequirement } from '../../transportHelper/getTextFromValue'
import { getGeocode } from '../../transportHelper/getGeocodeGoong'

function TransportRequirementsCreateForm(props) {

    const {bills, transportDepartment, billFromStockModules} = props
    const requirements=getListTypeRequirement();

    useEffect(() => {
        console.log(billFromStockModules,"billFromStockModules");
        if (billFromStockModules){
            handleClickCreateCode();
            setCurrentBill({bill: billFromStockModules, id: billFromStockModules._id});
            setState({
                ...state,
                billGroup: billFromStockModules.group,
                billType: billFromStockModules.type,
                value: getValueTypeRequirement(billFromStockModules.group, billFromStockModules.type),
            })
        }
    }, [billFromStockModules])

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
        approver: "title"
    });

    const [listBills, setListBills] = useState([])

    // Bill hien tai: {id: id cua bill, bill: Object bill}
    const [currentBill, setCurrentBill] = useState({
        id: "0",
    })

    //
    const [approverList, setApproverList] = useState([
        {
            value: "title",
            text: "--Chọn người phê duyệt--"
        }
    ])

    // const [importGoodsDetails, setImportGoodsDetails] = useState({
    //     addressStock: "",
    //     nameStock: ""
    // })

    const [goodsTransport, setGoodsTransport] = useState([])

    // const [goodDetails, setGoodDetails] = useState({
    //     good: [],
    // })

    const { translate} = props;

    const isFormValidated = () => {
        if (state.value && requirementsForm.code && requirementsForm.info?.customer1AddressTransport &&  requirementsForm.info?.customer2AddressTransport
            && requirementsForm.goods && requirementsForm.goods.length !==0
            && requirementsForm.approver && requirementsForm.department){
                return true;
            }
        return false;
        
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
        console.log(requirementsForm.goods, " good")
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
            approver: requirementsForm.approver,
            department: requirementsForm.department,
        }
        if (state.value !== "5"){
            data.bill = currentBill.id;
        }
        if (state.value === "5"){
            data.detail1 = requirementsForm.info?.newOneDetail1;
            data.detail2 = requirementsForm.info?.newOneDetail2;
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
        if (time && time.length!==0){
            let timeMap = time.map((item) => {
                return {
                    timeRequest: formatToTimeZoneDate(item.time),
                    description: item.detail,
                }
            })
            return timeMap;
        }
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
        let listBillsSelectBox = [
            {
                value: "0",
                text: "Chọn phiếu",
            },
        ];
        if (listBills && listBills.length!==0){
            listBills.map(item => {
                listBillsSelectBox.push({
                    value: item._id,
                    text: item.code,
                })
            })
        }
        return listBillsSelectBox;
    }

    useEffect(() => {
        // // props.getCustomers();
        // // props.getBillsByType({ page:1, limit:30, group: parseInt(state.billGroup), managementLocation: localStorage.getItem("currentRole") });
        // console.log(state, " okkkkkkkkkkkk")
        if(!billFromStockModules)props.getBillsByType({ group: parseInt(state.billGroup), managementLocation: localStorage.getItem("currentRole") });
    },[state])

    const handleTypeBillChange = (value) => {
        // console.log(value[0]);
        if (value[0] !== "0") {
            // setBillId({
            //     ...billId,
            //     id: value[0],
            // });
            let curBill = listBills.filter(r => String(r._id) === value[0]);
            if (curBill && curBill.length!==0){
                setCurrentBill({
                    id: value[0],
                    bill: curBill[0]
                })
            }
        }
        else {
            setCurrentBill({
                id: value[0],
            })
        }
    }

    const handleApproverChange = (value) => {
        let list = [...approverList];
        let res = list.filter(r => String(r.value) === String(value[0]));
        if (res && res.length !==0){
            setRequirementsForm({
                ...requirementsForm,
                approver: value[0],
                department: res[0].department,
            })
        }
    }

    useEffect(() => {
        props.getAllTransportDepartments();
        // props.getUserByRole({currentUserId: localStorage.getItem('userId'), role: 1})
    }, [])

    useEffect(() => {
        // console.log(transportDepartment, " transportDepartment")
        // let newApproverList = [...approverList];
        // if (transportDepartment && transportDepartment.lists && transportDepartment.lists.length!==0){
        //     // role vận chuyển === 2
        //     let lists = transportDepartment.lists.filter(r => String(r.role) === "2") 
        //         console.log(lists, " unit")
        //         if (lists && lists.length !==0){
        //             lists.map(item =>{
        //                 if (item.organizationalUnit){
        //                     let organizationalUnit = item.organizationalUnit;
        //                     organizationalUnit.managers && organizationalUnit.managers.length !==0
        //                     && organizationalUnit.managers.map(managers => {
        //                         managers.users && managers.users.length !== 0
        //                         && managers.users.map(users => {
        //                             if (users.userId){
        //                                 if (users.userId._id){
        //                                     let check = newApproverList.filter(r =>
        //                                             String(r.value) ===  String(users.userId._id)
        //                                         )
        //                                     if (!(check && check.length!==0)){
        //                                         newApproverList.push({
        //                                             value: users.userId._id,
        //                                             text: users.userId.name
        //                                         })
        //                                     }
        //                                 }
        //                             }
        //                         })
        //                     })
        //                 }
        //             })
        //         } 
        // }
        // setApproverList(newApproverList)
        let newApproverList = [{
            value: "title",
            text: "--Chọn người phê duyệt--"
        }]
        // console.log(transportDepartment, " opopopo")
        if (transportDepartment && transportDepartment.lists && transportDepartment.lists.length!==0){
            transportDepartment.lists.map(item => {

                let listRoleApproverOrganizationalUnit = item.type.filter(r => Number(r.roleTransport) === 1);
                
                if (listRoleApproverOrganizationalUnit && listRoleApproverOrganizationalUnit.length !==0){
                    listRoleApproverOrganizationalUnit.map(organization => {
                        
                        if (organization.roleOrganizationalUnit && organization.roleOrganizationalUnit.length !==0){
                            organization.roleOrganizationalUnit.map(roleOrganizationalUnit => {
                                
                                if (roleOrganizationalUnit.users && roleOrganizationalUnit.users.length !== 0){
                                    roleOrganizationalUnit.users.map(user => {
                                        
                                        newApproverList.push({
                                            value: user.userId?._id,
                                            text: user.userId.name + " - " + roleOrganizationalUnit.name + " - " + item.organizationalUnit?.name,
                                            department: item._id, 
                                            roleOrganizationalUnit: roleOrganizationalUnit._id,
                                        })
                                    })
                                }       
                                
                            })
                        }
                        
                    })
                }

            })
        }
        // console.log(newApproverList, " ok");
        // if (transportDepartment && transportDepartment.listUser && transportDepartment.listUser.length!==0){
        //     let listUser = transportDepartment.listUser.filter(r=>Number(r.role) === 1);
        //     if (listUser && listUser.length!==0 && listUser[0].list && listUser[0].list.length!==0){
        //         listUser[0].list.map(userId => {
        //             newApproverList.push({
        //                 value: userId._id,
        //                 text: userId.name
        //             })
        //         })
        //     }
        // }
        setApproverList(newApproverList)
    }, [transportDepartment])

    useEffect(() => {
        if (bills && bills.listBills){
            let lists = bills.listBills.filter(r => 
                (String(r.type) === String(state.billType) 
                && String(r.group)===String(state.billGroup)))
            setListBills(lists)
        }
    }, [bills])

    useEffect(() => {
        if (currentBill && currentBill.bill && currentBill.bill.goods && currentBill.bill.goods.length!==0){
            let listGood = [];
            currentBill.bill.goods.map(item => {
                if (item.good){
                    listGood.push(item);
                }
            })
            setGoodsTransport(listGood)
        }
    }, [currentBill])

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
            // ...requirementsForm,
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
                title={translate('manage_transport.transportRequirement.add_requirements')}
                // msg_success={translate('manage_transport.add_success')}
                // msg_faile={translate('manage_transport.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
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
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        Người phê duyệt
                                    </label>
                                    <SelectBox
                                        id={`select-approver`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={requirementsForm.approver}
                                        items={approverList}
                                        onChange={handleApproverChange}
                                        multiple={false}
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
                                    {
                                        !billFromStockModules
                                        &&
                                        <SelectBox
                                            id={`select-type-requirement`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={state.value}
                                            items={requirements}
                                            onChange={handleTypeRequirementChange}
                                            multiple={false}
                                        />
                                    }
                                    {
                                        billFromStockModules
                                        &&
                                        <input type="text" className="form-control" disabled={true} 
                                            value={getTypeRequirement(state.value)}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                {
                                    state.value !== "5" && !billFromStockModules
                                    &&
                                    <div className={`form-group`}>
                                        <label>
                                            Phiếu kho
                                            <span className="attention"> * </span>
                                        </label>
                                        <SelectBox
                                            id={`select-bills`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={currentBill.id}
                                            items={getBills()}
                                            onChange={handleTypeBillChange}
                                            multiple={false}
                                        />
                                    </div>
                                }
                                {
                                    billFromStockModules
                                    &&
                                    <div className={`form-group`}>
                                        <label>
                                            Phiếu kho
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={true} 
                                            value={currentBill?.bill?.code}
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
    const {bills, transportDepartment} = state;
    return { bills, transportDepartment }
}

const actions = {
    getBillsByType: BillActions.getBillsByType,
    getCustomers: CrmCustomerActions.getCustomers,
    createTransportRequirement: transportRequirementsActions.createTransportRequirement,
    getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
    getUserByRole: transportDepartmentActions.getUserByRole,
}

const connectedTransportRequirementsCreateForm = connect(mapState, actions)(withTranslate(TransportRequirementsCreateForm));
export { connectedTransportRequirementsCreateForm as TransportRequirementsCreateForm };