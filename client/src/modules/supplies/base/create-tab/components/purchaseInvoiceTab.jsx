import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PurchaseAddModal, PurchaseEditModal } from './combinedContent';

function PurchaseInvoiceTab(props) {
    const [state, setState] = useState({
        purchaseInvoice: []
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

    // Bắt sự kiện click edit phiếu
    const handleEdit = async (value, index) => {
        await setState({
            ...state,
            currentRow: { ...value, index: index }
        });
        window.$(`#modal-edit-invoice-editPurchaseInvoice${index}`).modal('show');
    }

    // Function thêm thông tin bảo trì
    const handleAddPurchaseInvoice = async (data) => {
        let { purchaseInvoice } = state;
        if (purchaseInvoice === undefined) {
            purchaseInvoice = [];
        }
        const values = [...purchaseInvoice, {
            ...data
        }]

        await setState({
            ...state,
            purchaseInvoice: values
        })
        props.handleAddPurchaseInvoice(values, data)
    }

    // Function chỉnh sửa thông tin bảo trì
    const handleEditPurchaseInvoice = async (data) => {
        let { purchaseInvoice } = state;
        if (purchaseInvoice === undefined) {
            purchaseInvoice = [];
        }
        purchaseInvoice[data.index] = data;
        await setState({
            ...state,
            purchaseInvoice: purchaseInvoice
        });
        props.handleEditPurchaseInvoice(purchaseInvoice, data)
    }

    // Function bắt sự kiện xoá thông tin bảo trì
    const handleDeletePurchaseInvoice = async (index) => {
        let { purchaseInvoice } = state;
        if (purchaseInvoice === undefined) {
            purchaseInvoice = [];
        } var data = purchaseInvoice[index];
        purchaseInvoice.splice(index, 1);
        await setState({
            ...state,
            purchaseInvoice: [...purchaseInvoice]
        })
        props.handleDeletePurchaseInvoice([...purchaseInvoice], data)
    }

    if (prevProps.id !== props.id) {
        setState({
            ...state,
            id: props.id,
            purchaseInvoice: props.purchaseInvoice,
        })
        setPrevProps(props)
    }

    const { id } = props;
    const { translate } = props;
    const { purchaseInvoice, currentRow } = state;

    var formater = new Intl.NumberFormat();

    return (
        <div id={id} className="tab-pane">
            <div className="box-body qlcv">

                {/* Form thêm thông tin bảo trì */}
                <PurchaseAddModal
                    handleChange={handleAddPurchaseInvoice}
                    id={`addPurchaseInvoice${id}`}
                />

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
                        {(purchaseInvoice && purchaseInvoice.length !== 0) &&
                            purchaseInvoice.map((x, index) => (
                                <tr key={index}>
                                    <td>{x.codeInvoice}</td>
                                    <td>{x.date ? formatDate(x.date) : ''}</td>
                                    <td>{x.supplier}</td>
                                    <td>{x.quantity}</td>
                                    <td>{x.price}</td>
                                    <td>
                                        <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('supplies.general_information.add_purchase_invoice')}><i
                                            className="material-icons">edit</i></a>
                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeletePurchaseInvoice(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    (!purchaseInvoice || purchaseInvoice.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                {/* </fieldset> */}
            </div>

            {/* Form chỉnh sửa phiếu bảo trì */}
            {
                currentRow &&
                <PurchaseEditModal
                    id={`editPurchaseInvoice${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    codeInvoice={currentRow.codeInvoice}
                    date={currentRow.date}
                    supplier={currentRow.supplier}
                    quantity={currentRow.quantity}
                    price={currentRow.price}
                    handleChange={handleEditPurchaseInvoice}
                />
            }
        </div>
    );
};


const purchaseInvoiceTab = connect(null, null)(withTranslate(PurchaseInvoiceTab));

export { purchaseInvoiceTab as PurchaseInvoiceTab };
