import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PurchaseInvoiceDetail } from '../../admin/purchase-invoice/components/PurchaseInvoiceDetail';

function PurchaseInvoiceTab(props) {
    const [state, setState] = useState({
    });
    const [prevProps, setPrevProps] = useState({
        id: null
    })

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
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

    // Bắt sự kiện click xem thông tin hóa đơn
    const handleView = async (value) => {
        await setState({
            ...state,
            currentRow: value
        });
        window.$('#modal-view-purchase-invoice').modal('show');
    }

    if (prevProps.id !== props.id) {
        setState({
            ...state,
            id: props.id,
        })
        setPrevProps(props)
    }

    const { id } = props;
    const { translate, suppliesReducer } = props;
    const { currentRow } = state;

    return (
        <div id={id} className="tab-pane">
            <div className="box-body qlcv">
                {/* Bảng hoa don */}
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "13%" }}>{translate('supplies.invoice_management.codeInvoice')}</th>
                            <th style={{ width: "18%" }}>{translate('supplies.invoice_management.date')}</th>
                            <th style={{ width: "18%" }}>{translate('supplies.invoice_management.supplier')}</th>
                            <th style={{ width: "18%" }}>{translate('supplies.invoice_management.quantity')}</th>
                            <th style={{ width: "18%" }}>{translate('supplies.invoice_management.price')}</th>
                            <th style={{ width: '15%', textAlign: 'center' }}>{translate('table.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(suppliesReducer.listPurchaseInvoice && suppliesReducer.listPurchaseInvoice.length !== 0) &&
                            suppliesReducer.listPurchaseInvoice.map((x, index) => (
                                <tr key={index}>
                                    <td>{x.codeInvoice}</td>
                                    <td>{x.date ? formatDate(x.date) : ''}</td>
                                    <td>{x.supplier}</td>
                                    <td>{x.quantity}</td>
                                    <td>{x.price}</td>
                                    <td>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleView(x)}>
                                            <i className="material-icons">visibility</i></a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    (!suppliesReducer.listPurchaseInvoice || suppliesReducer.listPurchaseInvoice.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                {/* </fieldset> */}
                {/* Form xem thông tin hóa đơn */}
                {
                    currentRow &&
                    <PurchaseInvoiceDetail
                        _id={currentRow._id}
                        codeInvoice={currentRow.codeInvoice}
                        supplies={currentRow.supplies}
                        supplier={currentRow.supplier}
                        quantity={currentRow.quantity}
                        price={currentRow.price}
                        date={currentRow.date}
                        logs={currentRow.logs}
                    />
                }
            </div>
        </div>
    );
};

function mapState(state) {
    const { suppliesReducer } = state;
    return { suppliesReducer };
}
const actions = {

}

const purchaseInvoiceTab = connect(mapState, actions)(withTranslate(PurchaseInvoiceTab));

export { purchaseInvoiceTab as PurchaseInvoiceTab };
