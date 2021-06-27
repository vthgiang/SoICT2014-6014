import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

function TransportDetailNewOne(props) {
    const {curentTransportRequirementDetail} = props
    
    const [state, setState] = useState({
        fromAddress: "",
        toAddress: "",
    })

    useEffect(() => {
        if (curentTransportRequirementDetail && curentTransportRequirementDetail.length !==0 ){
            setState({
                ...state,
                toAddress: curentTransportRequirementDetail.toAddress,
                fromAddress: curentTransportRequirementDetail.fromAddress,
                detail1: curentTransportRequirementDetail.detail1,
                detail2: curentTransportRequirementDetail.detail2,
            })
        }
    }, [curentTransportRequirementDetail])


    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{padding: "0px"}}>
                <p><strong>{"Địa điểm nhận hàng: "} &emsp; </strong> {state.fromAddress}</p>
                <p><strong>{"Chi tiết: "} &emsp; </strong> {state.detail1}</p>
                <p><strong>{"Địa điểm giao hàng: "} &emsp; </strong> {state.toAddress}</p>
                <p><strong>{"Chi tiết: "} &emsp; </strong> {state.detail2}</p>
            {/* <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                <fieldset className="scheduler-border" style={{ height: "100%" }}>
                    <legend className="scheduler-border">Thông tin bên gửi</legend>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div className={`form-group`}>
                                <strong>
                                    Khách hàng:&emsp;
                                </strong>
                                ""
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                            <div className="form-group">
                                <strong>
                                    Tên khách hàng:&emsp;
                                </strong>
                                ""
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className={`form-group`}>
                            <strong>
                                Số điện thoại:&emsp;
                            </strong>
                            "123"
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <div className="form-group">
                            <strong>
                                Email:&emsp;
                            </strong>
                            "s@a"
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <strong>
                                Địa chỉ khách hàng:&emsp;
                            </strong>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <strong>
                                Địa chỉ giao hàng:&emsp;
                            </strong>
                            {state.fromAddress}
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
                                <strong>
                                    Khách hàng:&emsp;
                                </strong>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                            <div className="form-group">
                                <strong>
                                    Tên khách hàng:&emsp;
                                </strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className={`form-group`}>
                            <strong>
                                Số điện thoại:&emsp;
                            </strong> 
                    
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <div className="form-group">
                            <strong>
                                Email:&emsp;
                            </strong>
                             
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <strong>
                                Địa chỉ khách hàng:&emsp;
                            </strong>
                            
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <strong>
                                Địa chỉ nhận hàng:&emsp;
                            </strong> 
                            {state.toAddress}
                        </div>
                    </div>                        
                </fieldset>
                
            </div> */}

        </div>
    );
}

function mapState(state) {
    return {  }
}

const actions = {
}

const connectedTransportDetailNewOne = connect(mapState, actions)(withTranslate(TransportDetailNewOne));
export { connectedTransportDetailNewOne as TransportDetailNewOne };