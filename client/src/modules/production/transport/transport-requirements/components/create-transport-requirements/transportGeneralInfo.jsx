import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { TransportGeneralInfoShip } from './transportGeneralInfoShip';
import { TransportReturn } from './transportReturn';
import { TransportImportGoods } from './transportImportGoods';
import { TransportMaterial } from './transportMaterial';
import { TransportNewOne} from './transportNewOne';
import { TransportGoods } from './transportGoods';

import { exampleActions } from '../../redux/actions';
import { BillActions } from '../../../../warehouse/bill-management/redux/actions'
import { CrmCustomerActions } from "../../../../../crm/customer/redux/actions";

function TransportGeneralInfo(props) {
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
        value: "1",
        billGroup: "2",
        billType: "3"
    })
    const [billId, setBillId] = useState({
        id: "",
    });

    const [billDetail, setBillDetail] = useState({})

    const [importGoodsDetails, setImportGoodsDetails] = useState({
        addressStock: "",
        nameStock: ""
    })
    // const { translate, example, page, perPage } = props;

    const { exampleName, description, exampleNameError } = state;

    const isFormValidated = () => {
        if (!exampleNameError.status) {
            return false;
        }
        return true;
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

    useEffect(() => {
        props.getCustomers();
        props.getBillsByType({ page:1, limit:30, group: parseInt(state.billGroup), managementLocation: localStorage.getItem("currentRole") });
    },[state])

    const handleTypeBillChange = (value) => {
        console.log(value[0]);
        // if (value[0] !== "0") {
        //     setBillId({
        //         ...billId,
        //         id: value[0],
        //     });
        // }
    }

    useEffect(() => {
        let currentBill = props.bills.filter(r => r._id === billId.id);
        setBillDetail({
            ...billDetail,
            currentBill: currentBill[0]
        })
    }, [billId])

    useEffect(() => {
        if (state.value==="3" && billId.id !==""){
            if (billDetail.currentBill) {
                if (billDetail.currentBill.fromStock){
                    setImportGoodsDetails({
                        ...importGoodsDetails,
                        nameStock: billDetail.currentBill.fromStock.name,
                        addressStock: billDetail.currentBill.fromStock.address,
                    })
                }
            }
        }
        else {
            setImportGoodsDetails({
                ...importGoodsDetails,
                addressStock: "",
                nameStock: "",
            })
        }
    }, [billDetail]);

    return (
        <React.Fragment>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <fieldset className="scheduler-border" style={{ height: "100%" }}>
                <legend className="scheduler-border">Thông tin kho</legend>
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
                                value={"0"}
                                items={requirements}
                                onChange={handleTypeRequirementChange}
                                multiple={false}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
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
                                items={
                                    [{value: "0", text: "Chọn phiếu"}].concat(
                                    props.bills
                                    ? props.bills
                                        .map((bill) => {
                                            return {
                                                value: bill._id,
                                                text: bill.code,
                                            };
                                        })
                                    : [])}
                                onChange={handleTypeBillChange}
                                multiple={false}
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
                    />
                )
            }
            < TransportGoods />
        </React.Fragment>
    );
}

function mapState(state) {
    const bills = state.bills.listPaginate;
    return { bills }
}

const actions = {
    getBillsByType: BillActions.getBillsByType,
    getCustomers: CrmCustomerActions.getCustomers,
}

const connectedTransportGeneralInfo = connect(mapState, actions)(withTranslate(TransportGeneralInfo));
export { connectedTransportGeneralInfo as TransportGeneralInfo };