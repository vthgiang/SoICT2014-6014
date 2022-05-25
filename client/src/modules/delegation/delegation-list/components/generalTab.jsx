import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import dayjs from "dayjs";
import { formatStatus } from './functionHelper';

function GeneralTab(props) {
    const [state, setState] = useState({
        delegationID: undefined,

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

    const formatTime = (date) => {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }

    console.log(state)

    const colorfyDelegationStatus = (status) => {
        const { translate } = props;
        let statusColor = "";
        switch (status) {
            case "pending":
                statusColor = "#db8b0b";
                break;
            case "declined":
                statusColor = "#e86969";
                break;
            case "confirmed":
                statusColor = "#31b337";
                break;
            case "revoked":
                statusColor = "#385898";
                break;
            case "activated":
                statusColor = "#31b337";
                break;
            default:
                statusColor = "#385898";
        }

        return (

            <span style={{ color: statusColor }}>{formatStatus(translate, status)}</span>

        )

    }


    const { translate } = props;
    const { delegationName, description, delegator, delegatee, delegatePrivileges, delegateType, delegateRole, delegateTasks, status, allPrivileges, startDate, endDate, revokedDate, revokeReason } = state;

    return (
        <div id={props.id} className="tab-pane active">
            <div class="row">
                {/* Mã ủy quyền */}
                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12`}>
                    <label>{translate('manage_delegation.delegationName')}:</label>
                    <span> {delegationName}</span>
                </div>

                {/* Mô tả */}
                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12`}>
                    <label>{translate('manage_delegation.description')}:</label>
                    <span> {description}</span>
                </div>
            </div>
            <div class="row">
                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12`}>
                    <label>{translate('manage_delegation.delegate_role')}:</label>
                    <span> {delegateRole?.name}</span>
                </div>

                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12`}>
                    <label>{translate('manage_delegation.delegate_receiver')}:</label>
                    <span> {delegatee?.name}</span>
                </div>
            </div>

            <div class="row">
                <div className={`form-group col-lg-12 col-md-12 col-ms-12 col-xs-12`}>
                    <label>{translate('manage_delegation.delegation_period')}:</label>
                    <span> {formatTime(startDate)} - {endDate ? formatTime(endDate) : (revokedDate ? formatTime(revokedDate) : translate("manage_delegation.end_date_tbd"))}</span>
                </div>
            </div>

            <div class="row">
                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12`}>
                    <label>{translate('manage_delegation.delegateStatus')}:</label>
                    <span> {colorfyDelegationStatus(status)}</span>
                </div>
                {revokeReason &&
                    <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12`}>
                        <label>{translate('manage_delegation.revoke_reason')}:</label>
                        <span> {revokeReason}</span>
                    </div>
                }
            </div>
            {delegatePrivileges &&
                <div class="row">
                    <div className={`form-group col-lg-12 col-md-12 col-ms-12 col-xs-12`}>
                        <label>{translate('manage_delegation.delegation_allowed_links')}:</label>
                        <table className="table table-hover table-bordered detail-policy-attribute-table not-sort">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}><label>{translate('manage_link.url')}</label></th>
                                    <th style={{ width: '30%' }}><label>{translate('manage_link.category')}</label></th>
                                    <th style={{ width: '30%', textAlign: 'left' }}><label>{translate('manage_link.description')}</label></th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    (!delegatePrivileges || delegatePrivileges.length <= 0) ? null :
                                        delegatePrivileges.map((pri, index) => {
                                            return <tr key={index}>
                                                <td>
                                                    {pri.resourceId?.url}
                                                </td>

                                                <td>
                                                    {pri.resourceId?.category}
                                                </td>
                                                <td style={{ textAlign: 'left' }}>
                                                    {pri.resourceId?.description}
                                                </td>
                                            </tr>
                                        })
                                }


                            </tbody>
                        </table>
                    </div>

                </div>
            }

        </div>
    );
};

function mapState(state) {
    const { delegation } = state;
    return { delegation };
};

const actionCreators = {

};
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab));
export { generalTab as GeneralTab };
