import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { formatDate } from "../../../../../helpers/formatDate"
import { DialogModal, ErrorLabel } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { transportRequirementsActions } from "../../transport-requirements/redux/actions";
import { transportPlanActions } from "../redux/actions"


function TransportPlanChosenEdit(props) {
    let {allTransportPlans, currentRequirement, currentTransportPlan} = props;
    const handleSelectPlan = (id) => {
        props.editTransportRequirement(currentRequirement._id, { transportPlan: id});
        props.getDetailTransportPlan(id);
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-example-hooks`} isLoading={false}
                formID={`form-edit-example-hooks`}
                title={'manage_example.edit_title'}
                // disableSubmit={!isFormValidated}
                // func={save}
                size={50}
                maxWidth={500}
            >
                <table id={"123"} className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                                    <th>{"Điểm nhận hàng"}</th>
                                    <th>{"Điểm giao hàng"}</th>
                                </tr>
                            </thead>
                            <tbody>                                
                                {
                                    currentRequirement && 
                                    <tr key={1}>
                                        <td>{"Giao hàng"}</td>
                                        <td>{currentRequirement.fromAddress}</td>
                                        <td>{currentRequirement.toAddress}</td>                                        
                                    </tr>
                                }
                    </tbody>
                        </table>

                <form id={`form-edit-example-hooks`}>
                <table id={"6666"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Mã kế hoạch"}</th>
                            <th>{"Thời gian bắt đầu"}</th>
                            <th>{"Thời gian kết thúc"}</th>
                            <th>{"Hành động"}</th>
                        </tr>
                    </thead>
                    <tbody>                                
                    {
                        (allTransportPlans && allTransportPlans.length !==0) &&
                        allTransportPlans.map((item, index) => (
                                item && 
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.code}</td>
                                    <td>{formatDate(item.startTime)}</td>
                                    <td>{formatDate(item.endTime)}</td>
                                    <td>
                                        <a className="text-green"
                                            onClick={() => handleSelectPlan(item._id)}
                                            ><i className="material-icons">add_comment</i></a>
                                    </td>
                                </tr>
                            )
                        )
                    }
                    </tbody>
                </table>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    console.log(state);
    const { currentTransportPlan } = state.transportPlan;
    return { currentTransportPlan }
}

const actions = {
    editTransportRequirement: transportRequirementsActions.editTransportRequirement,
    getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
}

const connectedTransportPlanChosenEdit = connect(mapState, actions)(withTranslate(TransportPlanChosenEdit));
export { connectedTransportPlanChosenEdit as TransportPlanChosenEdit };