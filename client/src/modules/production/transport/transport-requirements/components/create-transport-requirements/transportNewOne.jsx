import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

function TransportNewOne(props) {

    const { callBackGeneralInfo } = props;

    const [formInfo, setFormInfo] = useState({
        customer1: "",
        customer1Name: "",
        customer1Phone: "",
        customer1Email: "",
        customer1Address: "",
        customer1AddressTransport: "",

        customer2: "",
        customer2Name: "",
        customer2Phone: "",
        customer2Email: "",
        customer2Address: "",
        customer2AddressTransport: "",
    });

    const handleCustomer1Change = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer1: e.target.value,
        })
    }
    const handleCustomer1NameChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer1Name: e.target.value,
        })
    }
    const handleCustomer1PhoneChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer1Phone: e.target.value,
        })
    }
    const handleCustomer1EmailChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer1Email: e.target.value,
        })
    }     
    const handleCustomer1AddressChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer1Address: e.target.value,
        })
    }
    const handleCustomer1AddressTransportChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer1AddressTransport: e.target.value,
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
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer2Phone: e.target.value,
        })
    }
    const handleCustomer2EmailChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer2Email: e.target.value,
        })
    }     
    const handleCustomer2AddressChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer2Address: e.target.value,
        })
    }
    const handleCustomer2AddressTransportChange = (e) => {
        console.log(e.target.value);
        setFormInfo({
            ...formInfo,
            customer2AddressTransport: e.target.value,
        })
    }
    
    useEffect(() => {
        callBackGeneralInfo(formInfo);
    }, [formInfo])

    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                <fieldset className="scheduler-border" style={{ height: "100%" }}>
                    <legend className="scheduler-border">Thông tin bên gửi</legend>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div className={`form-group`}>
                                <label>
                                    Khách hàng
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" disabled={false} 
                                        // value={address}
                                    onChange={handleCustomer1Change}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                            <div className="form-group">
                                <label>
                                    Tên khách hàng <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" disabled={false} 
                                    onChange={handleCustomer1NameChange}
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
                                onChange={handleCustomer1PhoneChange}
                            />
                    
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <div className="form-group">
                            <label>
                                Email <span className="attention"> </span>
                            </label>
                            <input type="text" className="form-control" disabled={false} 
                                onChange={handleCustomer1EmailChange}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Địa chỉ khách hàng
                                <span className="attention"> * </span>
                            </label>
                            <textarea type="text" className="form-control" 
                                onChange={handleCustomer1AddressChange}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Địa chỉ giao hàng
                                <span className="attention"> * </span>
                            </label>
                            <textarea type="text" className="form-control"
                                onChange={handleCustomer1AddressTransportChange}
                            />
                        </div>
                    </div>                        
                </fieldset>
                
            </div>

            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                <fieldset className="scheduler-border" style={{ height: "100%" }}>
                    <legend className="scheduler-border">Thông tin bên nhận</legend>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div className={`form-group`}>
                                <label>
                                    Khách hàng
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" disabled={false} 
                                        // value={address}
                                    onChange={handleCustomer2Change}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                            <div className="form-group">
                                <label>
                                    Tên khách hàng <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" disabled={false} 
                                    onChange={handleCustomer2NameChange}
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
                                onChange={handleCustomer2PhoneChange}
                            />
                    
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <div className="form-group">
                            <label>
                                Email <span className="attention"> </span>
                            </label>
                            <input type="text" className="form-control" disabled={false} 
                                onChange={handleCustomer2EmailChange}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Địa chỉ khách hàng
                                <span className="attention"> * </span>
                            </label>
                            <textarea type="text" className="form-control" 
                                onChange={handleCustomer2AddressChange}
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
                                onChange={handleCustomer2AddressTransportChange}
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