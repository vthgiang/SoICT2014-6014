export const formatStatus = (translate, data) => {
    if (data === "pending") return translate('manage_delegation.pending');
    else if (data === "declined") return translate('manage_delegation.declined');
    else if (data === "confirmed") return translate('manage_delegation.confirmed');
    else if (data === "revoked") return translate('manage_delegation.revoked');
    else if (data === "activated") return translate('manage_delegation.activated');
}