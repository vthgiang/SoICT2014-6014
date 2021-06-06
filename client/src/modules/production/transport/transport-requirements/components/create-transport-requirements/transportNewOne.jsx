import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

function TransportNewOne(props) {

    const { callBackGeneralInfo, curentTransportRequirementDetail} = props;

    const [formInfo, setFormInfo] = useState({
        customer1: "",
        customer1Name: "",
        customer1Phone: "",
        customer1Email: "",
        customer1Address: "",
        customer1AddressTransport: "",
        newOneDetail1: "",
        

        customer2: "",
        customer2Name: "",
        customer2Phone: "",
        customer2Email: "",
        customer2Address: "",
        customer2AddressTransport: "",
        newOneDetail2: "",
    });

    const handleCustomer1Change = (e) => {
        setFormInfo({
            ...formInfo,
            customer1: e.target.value,
        })
    }
    const handleCustomer1NameChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer1Name: e.target.value,
        })
    }
    const handleCustomer1PhoneChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer1Phone: e.target.value,
        })
    }
    const handleCustomer1EmailChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer1Email: e.target.value,
        })
    }     
    const handleCustomer1AddressChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer1Address: e.target.value,
        })
    }
    const handleCustomer1AddressTransportChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer1AddressTransport: e.target.value,
        })
    }
    const handlecustomer1DetailChange = (e) => {
        setFormInfo({
            ...formInfo,
            newOneDetail1: e.target.value,
        })
    }
    const handleCustomer2Change = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer2: e.target.value,
        })
    }
    const handleCustomer2NameChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer2Name: e.target.value,
        })
    }
    const handleCustomer2PhoneChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer2Phone: e.target.value,
        })
    }
    const handleCustomer2EmailChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer2Email: e.target.value,
        })
    }     
    const handleCustomer2AddressChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer2Address: e.target.value,
        })
    }
    const handleCustomer2AddressTransportChange = (e) => {
        setFormInfo({
            ...formInfo,
            customer2AddressTransport: e.target.value,
        })
    }
    const handlecustomer2DetailChange = (e) => {
        setFormInfo({
            ...formInfo,
            newOneDetail2: e.target.value,
        })
    }
    
    useEffect(() => {
        if (curentTransportRequirementDetail){
            setFormInfo({
                ...formInfo,
                customer1AddressTransport: curentTransportRequirementDetail.fromAddress,
                customer2AddressTransport: curentTransportRequirementDetail.toAddress,
            })
        }
    }, [curentTransportRequirementDetail])

    useEffect(() => {
        callBackGeneralInfo(formInfo);
    }, [formInfo])


    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 0}}>
                <fieldset className="scheduler-border" style={{ height: "100%" }}>
                    <legend className="scheduler-border">Thông tin gửi</legend>
                    {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                    </div> */}
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Địa chỉ giao hàng
                                <span className="attention"> * </span>
                            </label>
                            <textarea type="text" className="form-control"
                                value={formInfo.customer1AddressTransport}
                                onChange={handleCustomer1AddressTransportChange}
                            />
                        </div>
                    </div>  
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Chi tiết
                            </label>
                            <textarea type="text" className="form-control"
                                value={formInfo.newOneDetail1}
                                onChange={handlecustomer1DetailChange}
                            />
                        </div>
                    </div>                      
                </fieldset>
                
            </div>

            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 0}}>
                <fieldset className="scheduler-border" style={{ height: "100%" }}>
                    <legend className="scheduler-border">Thông tin nhận</legend>
                    {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                    </div> */}
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Địa chỉ nhận hàng
                                <span className="attention"> * </span>
                            </label>
                            <textarea type="text" className="form-control"
                                value={formInfo.customer2AddressTransport}
                                onChange={handleCustomer2AddressTransportChange}
                            />
                        </div>
                    </div>       
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Chi tiết
                            </label>
                            <textarea type="text" className="form-control"
                                value={formInfo.newOneDetail2}
                                onChange={handlecustomer2DetailChange}
                            />
                        </div>
                    </div>                    
                </fieldset>

            </div>

        </div>
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

const connectedTransportNewOne = connect(mapState, actions)(withTranslate(TransportNewOne));
export { connectedTransportNewOne as TransportNewOne };