import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

function LogActivityTab(props) {
    const [state, setState] = useState({
        delegationName: "",
        description: "",
    })

    // setState từ props mới
    useEffect(() => {
        if (props.delegationID !== state.delegationID) {
            setState({
                ...state,
                delegationID: props.delegationID,
                delegationName: props.delegationName,
                description: props.description,
                delegator: props.delegator,
                delegatee: props.delegatee,
                delegatePrivileges: props.delegatePrivileges,
                delegateType: props.delegateType,
                delegateRole: props.delegateRole,
                delegateTasks: props.delegateTasks,
                status: props.status,
                allPrivileges: props.allPrivileges,
                startDate: props.startDate,
                endDate: props.endDate,
                revokedDate: props.revokedDate,
                revokeReason: props.revokeReason
            })
        }
    }, [props.delegationID])



    const { translate } = props;
    const { delegationName, description } = state;

    return (
        <div id={props.id} className="tab-pane">
            {/* Tên ví dụ */}
            <div className={`form-group`}>
                <label>{translate('manage_delegation.delegationName')}:</label>
                <span> {delegationName}</span>
            </div>

            {/* Mô tả ví dụ */}
            <div className={`form-group`}>
                <label>{translate('manage_delegation.description')}:</label>
                <span> {description}</span>
            </div>
        </div>
    );
};

function mapState(state) {
    const { delegation } = state;
    return { delegation };
};

const actionCreators = {

};
const logActivityTab = connect(mapState, actionCreators)(withTranslate(LogActivityTab));
export { logActivityTab as LogActivityTab };
