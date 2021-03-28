import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

function TransportGeneralInfoShip(props) {

    const [transportInfo, setTransportInfo] = useState({
        billId: props.billId,
        fromAddress: "",
    })

    // useEffect(() => {
    //     const bill = props.billList.filter(r => r._id === props.billId)[0];
    //     console.log(bill);
    //     // if (bill.fromStock){
    //     //     setTransportInfo({
    //     //         ...transportInfo,
    //     //         fromAddress: bill.fromStock.address
    //     //     });
    //     // }
    // }, [transportInfo])

    useEffect(() => {
        console.log(props);
    })

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
                                        <input type="text" className="form-control" disabled={false} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <label>
                                            Người tạo phiếu <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={false} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ kho hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" disabled={false} value={transportInfo.fromAddress}/>
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
                                        <input type="text" className="form-control" disabled={false} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <label>
                                            Tên khách hàng <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={false} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group`}>
                                    <label>
                                        Số điện thoại
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control"/>
                            
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                <div className="form-group">
                                    <label>
                                        Email <span className="attention"> </span>
                                    </label>
                                    <input type="text" className="form-control" disabled={false} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ nhận hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" />
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