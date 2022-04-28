import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

function PurchaseGeneralTab(props) {

    const [state, setState] = useState({
    })

    const [prevProps, setPrevProps] = useState({
        id: null
    })

    if (prevProps.id !== props.id) {
        setState({
            ...state,
            id: props.id,
            codeInvoice: props.codeInvoice,
            date: props.date,
            quantity: props.quantity,
            supplies: props.supplies,
            supplier: props.supplier,
            price: props.price,
        })
        setPrevProps(props)
    }

    const { id, translate, purchaseInvoiceReducer } = props;

    const {
        codeInvoice, date, quantity, price, supplies, supplier,
    } = state;

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }
    return (
        <div id={id} className="tab-pane active">
            <div className="box-body" >
                <div className="row" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                    {/* Thông tin cơ bản */}
                    <div className="col-md-6">
                        {/* Mã hóa đơn */}
                        <div className="form-group">
                            <strong>{translate('supplies.invoice_management.codeInvoice')}&emsp; </strong>
                            {codeInvoice}
                        </div>

                        {/* Tên vật tư */}
                        <div className="form-group">
                            <strong>{translate('supplies.invoice_management.supplies')}&emsp; </strong>
                            {supplies && supplies.suppliesName}
                        </div>
                        {/* Ngày mua */}
                        <div className="form-group">
                            <strong>{translate('supplies.invoice_management.date')}&emsp; </strong>
                            {formatDate(date)}
                        </div>
                    </div>
                    <div className="col-md-6">
                        {/* So luong mua */}
                        <div className="form-group">
                            <strong>{translate('supplies.invoice_management.quantity')}&emsp; </strong>
                            {quantity}
                        </div>
                        {/* Gia tien */}
                        <div className="form-group">
                            <strong>{translate('supplies.invoice_management.price')}&emsp; </strong>
                            {price + '(VND)'}
                        </div>
                        {/* Nha cung cap */}
                        <div className="form-group">
                            <strong>{translate('supplies.invoice_management.supplier')}&emsp; </strong>
                            {supplier}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapState(state) {
    const { purchaseInvoiceReducer } = state;
    return { purchaseInvoiceReducer };
}
const actions = {

}
const invoiceGeneralTab = connect(mapState, actions)(withTranslate(PurchaseGeneralTab));
export { invoiceGeneralTab as PurchaseGeneralTab };