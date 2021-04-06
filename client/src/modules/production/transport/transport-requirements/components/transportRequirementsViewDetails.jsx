import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../helpers/validationHelper';

import { exampleActions } from '../redux/actions';

function TransportRequirementsViewDetails(props) {
    // const { translate, example, page, perPage } = props;

    // const { exampleName, description, exampleNameError } = state;

    // const isFormValidated = () => {
    //     if (!exampleNameError.status) {
    //         return false;
    //     }
    //     return true;
    // }


        return (

            // <DialogModal
            //     modalID={`modal-detail-info-example-hooks`}
            //     title={"fff"}
            //     formID={`form-detail-example-hooks`}
            //     size={50}
            //     maxWidth={500}
            //     hasSaveButton={false}
            //     hasNote={false}
            // >
                <form id={`form-detail-example-hooks`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group`}>
                        <label>{"translate"}:</label>
                        <span> {"exampleName"}</span>
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{"translate"}:</label>
                        <span> {"description"}</span>
                    </div>
                </form>
            // </DialogModal>
        

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