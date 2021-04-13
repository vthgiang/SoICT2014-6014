import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../helpers/validationHelper';

import { transportPlanActions } from '../redux/actions'

function TransportPlanCreateForm(props) {

    return (
        <React.Fragment>
            
        </React.Fragment>
    );
}

function mapState(state) {
    // const example = state.example1;
    // return { example }
    
    // const bills = state.bills.listPaginate;
    // const listAllGoods = state.goods.listALLGoods;
    // return { bills }
}

const actions = {
    createTransportPlan: transportPlanActions.createTransportPlan,
}

const connectedTransportPlanCreateForm = connect(mapState, actions)(withTranslate(TransportPlanCreateForm));
export { connectedTransportPlanCreateForm as TransportPlanCreateForm };