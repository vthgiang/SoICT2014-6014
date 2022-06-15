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