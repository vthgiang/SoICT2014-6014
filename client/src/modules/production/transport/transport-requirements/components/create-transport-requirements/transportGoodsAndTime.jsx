import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { TransportGoods } from './transportGoods';
import { TransportTime } from './transportTime';

import { exampleActions } from '../../redux/actions';
import { BillActions } from '../../../../warehouse/bill-management/redux/actions'
import { CrmCustomerActions } from "../../../../../crm/customer/redux/actions";

function TransportGoodsAndTime(props) {
    // const { translate, example, page, perPage } = props;

    // const { exampleName, description, exampleNameError } = state;

    // const isFormValidated = () => {
    //     if (!exampleNameError.status) {
    //         return false;
    //     }
    //     return true;
    // }


    return (
        <React.Fragment>
            {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <fieldset className="scheduler-border" style={{ height: "100%" }}>
                <legend className="scheduler-border">Thông tin kho</legend>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <label>
                                Loại yêu cầu
                                <span className="attention"> * </span>
                            </label>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <label>
                                Phiếu kho
                                <span className="attention"> * </span>
                            </label>
                            
                        </div>
                    </div>
                </div> 
            </fieldset>

            </div> */}
            < TransportGoods />
            < TransportTime />
        </React.Fragment>
    );
}

function mapState(state) {
    // const bills = state.bills.listPaginate;
    // return { bills }
}

const actions = {
    // getBillsByType: BillActions.getBillsByType,
    // getCustomers: CrmCustomerActions.getCustomers,
}

const connectedTransportGoodsAndTime = connect(mapState, actions)(withTranslate(TransportGoodsAndTime));
export { connectedTransportGoodsAndTime as TransportGoodsAndTime };