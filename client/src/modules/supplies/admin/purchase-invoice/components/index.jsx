import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PurchaseInvoiceManagement } from './PurchaseInvoiceManagement';

function ManagePurchaseInvoice(props) {
    return (
        <React.Fragment>
            <PurchaseInvoiceManagement>

            </PurchaseInvoiceManagement>
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(ManagePurchaseInvoice)); 