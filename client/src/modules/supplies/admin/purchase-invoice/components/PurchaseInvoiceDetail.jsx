import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../common-components";
import { InvoiceLogTab } from "../../../base/detail-tab/invoiceLogTab";
import { PurchaseGeneralTab } from "../../../base/detail-tab/purchaseGeneralTab";

function PurchaseInvoiceDetail(props) {
    const [state, setState] = useState({});
    const [prevProps, setPrevProps] = useState({
        _id: null,
    });

    const { translate, purchaseInvoiceReducer } = props;
    const { _id, codeInvoice, supplies, supplier, date, quantity, price, logs } = state;

    if (state._id !== props._id) {
        setState({
            ...state,
            _id: props._id,
            codeInvoice: props.codeInvoice,
            supplies: props.supplies,
            supplier: props.supplier,
            quantity: props.quantity,
            price: props.price,
            date: props.date,
            logs: props.logs
        });
        setPrevProps(props);
    }

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-view-purchase-invoice" isLoading={purchaseInvoiceReducer.isLoading}
                formID="form-view-purchase-invoice"
                title={translate('supplies.general_information.view_purchase_invoice')}
                hasSaveButton={false}
            >
                <div className="nav-tabs-custom">
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('supplies.general_information.invoice_information')} data-toggle="tab" href={`#view_invoice_general${_id}`}>{translate('supplies.general_information.invoice_information')}</a></li>
                        <li><a title={translate('supplies.general_information.invoice_history_information')} data-toggle="tab" href={`#view_history_update${_id}`}>{translate('supplies.general_information.invoice_history_information')}</a></li>
                    </ul>
                    <div className="tab-content">
                        {/* Thông tin chung */}
                        <PurchaseGeneralTab
                            id={`view_invoice_general${_id}`}
                            codeInvoice={codeInvoice}
                            supplier={supplier}
                            supplies={supplies}
                            date={date}
                            price={price}
                            quantity={quantity}
                        />

                        {/* Tài liệu đính kèm */}
                        <InvoiceLogTab
                            id={`view_history_update${_id}`}
                            logs={logs}
                        />
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { purchaseInvoiceReducer } = state;
    return { purchaseInvoiceReducer };
}
const actions = {
    
}


const detailInvoice = connect(mapState, actions)(withTranslate(PurchaseInvoiceDetail));
export { detailInvoice as PurchaseInvoiceDetail };