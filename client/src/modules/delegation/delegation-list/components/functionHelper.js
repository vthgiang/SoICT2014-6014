import React from 'react';

export const formatStatus = (translate, data) => {
    if (data === "pending") return translate('manage_delegation.pending');
    else if (data === "declined") return translate('manage_delegation.declined');
    else if (data === "confirmed") return translate('manage_delegation.confirmed');
    else if (data === "revoked") return translate('manage_delegation.revoked');
    else if (data === "activated") return translate('manage_delegation.activated');
    else if (data === "wait_confirm") return translate('manage_delegation.wait_confirm');
}

export const colorfyDelegationStatus = (status, translate) => {
    let statusColor = "";
    switch (status) {
        case "pending":
            statusColor = "#db8b0b";
            break;
        case "revoked":
            statusColor = "#e34724";
            break;
        case "activated":
            statusColor = "#31b337";
            break;
        default:
            statusColor = "#4b76cd";
    }

    return (

        <span style={{ color: statusColor }}>{formatStatus(translate, status)}</span>

    )

}

export const formatLog = (translate, data) => {
    if (data === "edit") return translate('manage_delegation.log_activity_tab.edit');
    else if (data === "reject") return translate('manage_delegation.log_activity_tab.reject');
    else if (data === "confirm") return translate('manage_delegation.log_activity_tab.confirm');
    else if (data === "revoke") return translate('manage_delegation.log_activity_tab.revoke');
    else if (data === "create") return translate('manage_delegation.log_activity_tab.create');
    else if (data === "page_access") return translate('manage_delegation.log_activity_tab.page_access');
    else if (data === "login") return translate('manage_delegation.log_activity_tab.login');
    else if (data === "logout") return translate('manage_delegation.log_activity_tab.logout');
    else if (data === "activate") return translate('manage_delegation.log_activity_tab.activate');
    else if (data === "switch_delegate_role") return translate('manage_delegation.log_activity_tab.switch_delegate_role');

}

export const colorfyLog = (status, translate) => {
    let statusColor = "";
    switch (status) {
        case "edit":
            statusColor = "#db8b0b";
            break;
        case "revoke":
        case "reject":
            statusColor = "#e34724";
            break;
        case "create":
        case "confirm":
        case "activate":
            statusColor = "#31b337";
            break;
        default:
            statusColor = "#4b76cd";
    }

    return (

        <span style={{ color: statusColor, fontWeight: 600 }}>{formatLog(translate, status)}</span>

    )

}