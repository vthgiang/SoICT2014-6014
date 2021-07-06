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