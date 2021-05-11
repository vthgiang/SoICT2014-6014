import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

function TransportGeneralInfoShip(props) {

    let {currentBill, callBackGeneralInfo} = props

    const [formValue, setFormValue] = useState({
        stockCode: "",
        billCreator: "",
        stockAddress: "",
        customerCode: "",
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerAddress: "",
    })
    // const [transportInfo, setTransportInfo] = useState({
    //     // billId: props.billId,
    //     curBill: props.curBill,
    // })
    // const [address, setAddress] = useState("");
    // useEffect(() => {
    //     if (props.curBill){
    //         if (props.curBill.receiver){
    //             if (props.curBill.receiver.address){
    //                 setAddress(props.curBill.receiver.address)
    //             }
    //         }
    //     }
    // }, [transportInfo])

    // useEffect(() => {
    //     console.log(props);
    // })
    useEffect(() => {
        if (currentBill){
            setFormValue({
                stockCode: currentBill.fromStock?.code,
                billCreator: currentBill.creator?.name,
                stockAddress: currentBill.fromStock?.address,
                customerCode: currentBill.customer?.code,
                customerName: currentBill.customer?.name,
                customerPhone: currentBill.customer?.mobilephoneNumber,
                customerEmail: currentBill.customer?.email,
                customerAddress: currentBill.customer?.address,
            })
        }
        console.log(currentBill, " llllllllllllll")
    }, [currentBill])

    useEffect(() => {
        if (formValue){
            let data = {
                customer1AddressTransport: formValue.stockAddress,
                customer2AddressTransport: formValue.customerAddress,
            }
            callBackGeneralInfo(data);
        }
    }, [formValue])

    return (
        <React.Fragment>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                            <legend className="scheduler-border">Thông tin kho</legend>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group`}>
                                        <label>
                                            Kho
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" 
                                            className="form-control" 
                                            disabled={true} 
                                            value={formValue.stockCode}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <label>
                                            Người tạo phiếu <span className="attention"> </span>
                                        </label>
                                        <input type="text" 
                                            className="form-control" 
                                            disabled={true} 
                                            value={formValue.billCreator}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ kho hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" disabled={true}
                                        value={formValue.stockAddress}
                                    />
                                </div>
                            </div>

                            
                        </fieldset>
                      
                    </div>

                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                            <legend className="scheduler-border">Thông tin khách hàng</legend>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group`}>
                                        <label>
                                            Khách hàng
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={true} 
                                                value={formValue.customerCode}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <label>
                                            Tên khách hàng <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={true} 
                                            value={formValue.customerName}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group`}>
                                    <label>
                                        Số điện thoại
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control"
                                        value={formValue.customerPhone}
                                        disabled={true}
                                    />                            
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                <div className="form-group">
                                    <label>
                                        Email <span className="attention"> </span>
                                    </label>
                                    <input type="text" className="form-control" disabled={true} 
                                        value={formValue.customerEmail}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ nhận hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" 
                                        value={formValue.customerAddress}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </fieldset>
                      
                    </div>
                </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const example = state.example1;
    return { example }
}

const actions = {
    // createExample: exampleActions.createExample,
    // getExamples: exampleActions.getExamples,
}

const connectedTransportGeneralInfoShip = connect(mapState, actions)(withTranslate(TransportGeneralInfoShip));
export { connectedTransportGeneralInfoShip as TransportGeneralInfoShip };