import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal, ErrorLabel } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';


function TransportPlanChosenEdit(props) {
    let {allTransportPlans} = props;

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
                                    {/* <td>{item.code}</td>
                                    <td>{item.x.startTime}</td>
                                    <td>{item.x.endTime}</td> */}
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
    // const example = state.example1;
    // return { example }
}

const actions = {
    // editExample: exampleActions.editExample
}

const connectedTransportPlanChosenEdit = connect(mapState, actions)(withTranslate(TransportPlanChosenEdit));
export { connectedTransportPlanChosenEdit as TransportPlanChosenEdit };