import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../helpers/validationHelper';

import {TransportDetailNewOne} from './detail-transport-requirement/transportDetailNewOne'
import {TransportDetailGoods} from './detail-transport-requirement/transportDetailGoods'

import { exampleActions } from '../redux/actions';

function TransportRequirementsViewDetails(props) {
    // const { translate, example, page, perPage } = props;
    const {curentTransportRequirementDetail} = props;

    // const { exampleName, description, exampleNameError } = state;

    // const isFormValidated = () => {
    //     if (!exampleNameError.status) {
    //         return false;
    //     }
    //     return true;
    // }
    useEffect(() => {
        console.log(curentTransportRequirementDetail)
  
    }, [curentTransportRequirementDetail])

        return (

            <DialogModal
                modalID={`modal-detail-info-example-hooks`}
                title={"Chi tiết yêu cầu vận chuyển"}
                formID={`form-detail-transport-requirement`}
                size={100}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-transport-requirement`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group`}>
                        {/* <label>{"translate"}:</label>
                        <span> {"exampleName"}</span> */}
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        {/* <label>{"translate"}:</label>
                        <span> {"description"}</span> */}
                    </div>
                    <TransportDetailNewOne 
                        curentTransportRequirementDetail = {curentTransportRequirementDetail}
                    />
                    <TransportDetailGoods
                        listGoodsChosen = {curentTransportRequirementDetail?.goods}
                    />
                </form>
            </DialogModal>
        

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

const connectedTransportRequirementsViewDetails = connect(mapState, actions)(withTranslate(TransportRequirementsViewDetails));
export { connectedTransportRequirementsViewDetails as TransportRequirementsViewDetails };