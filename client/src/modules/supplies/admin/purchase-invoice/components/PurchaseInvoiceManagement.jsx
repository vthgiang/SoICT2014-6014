import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DatePicker, DeleteNotification, PaginateBar, SelectMulti, SmartTable, TreeSelect } from '../../../../../common-components';
import { getPropertyOfValue } from '../../../../../helpers/stringMethod';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { AssetTypeActions } from '../../../../asset/admin/asset-type/redux/actions';
import { SuppliesActions } from '../../supplies/redux/actions';
import { PurchaseInvoiceActions } from '../redux/actions';
import { PurchaseInvoiceCreateForm } from './PurchaseInvoiceCreateForm';
import { PurchaseInvoiceDetail } from './PurchaseInvoiceDetail';
import { PurchaseInvoiceEditFormditForm } from './PurchaseInvoiceEditForm';

const getInvoiceName = (listInvoice, idInvoice) => {
    let invoiceName;
    if (listInvoice?.length && idInvoice) {
        for (let i = 0; i < listInvoice.length; i++) {
            if (listInvoice[i]?._id === idInvoice) {
                invoiceName = `${formatDate(listInvoice[i].date)} - ${listInvoice[i].supplies && listInvoice[i].supplies.suppliesName}`;
                break;
            }
        }
    }
    return invoiceName;
}

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

function PurchaseInvoiceManagement(props) {
    const tableId_constructor = "table-purchase-invoice-management";
    const defaultConfig = { limit: 5 };
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        codeInvoice: "",
        supplies: "",
        getAll: true,
        date: null,
        supplier: "",
        page: 0,
        limit: limit_constructor,
    });

    const [selectedData, setSelectedData] = useState();
    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const { purchaseInvoiceReducer, suppliesReducer, translate, user, } = props;
    const { page, limit, tableId, currentRow, currentRowEdit, codeInvoice, supplies, date, supplier, } = state;

    useEffect(() => {
        props.searchPurchaseInvoice(state);
        props.searchSupplies(state);

    }, []);

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
        });
        props.searchPurchaseInvoice({ ...state, limit: parseInt(number) });
    }
    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * state.limit;
        await setState({
            ...state,
            page: parseInt(page),
        });

        props.searchPurchaseInvoice({ ...state, page: parseInt(page) });
    }

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

    //tìm kiếm theo mã vật tư
    const handleCodeInvoiceChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    };

    const handleSupplierNameChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    }

    // Function lưu giá trị loại tài sản vào state khi thay đổi
    const handleSuppliesChange = (value) => {
        if (value.length === 0) {
            value = null
        }
        setState({
            ...state,
            supplies: value
        })
    }


    // Function lưu giá trị tháng vào state khi thay đổi
    const handleDateChange = async (value) => {
        if (!value) {
            value = null
        }

        await setState({
            ...state,
            date: value
        });
    }

    // Bắt sự kiện tìm kiếm
    const handleSubmitSearch = async () => {
        await setState({
            ...state,
            page: 0,
        });
        props.searchPurchaseInvoice({ page: 0, ...state });
    }

    const handleDeleteAnInvoice = (id) => {
        props.deletePurchaseInvoices({
            ids: [id]
        });
    }

    const handleDeleteOptions = () => {
        const shortTitle = `<h4 style="color: red"><div>${translate('supplies.invoice_management.delete_info')} "${selectedData?.length && selectedData.length === 1 ? getInvoiceName(props.purchaseInvoiceReducer?.listPurchaseInvoice, selectedData[0]) : ""}" ?</div></h4>`;
        const longTitle = `<h4 style="color: red"><div>Xóa thông tin ${selectedData?.length > 1 ? selectedData.length : ""} hóa đơn ?</div></h4>`;

        Swal.fire({
            html: selectedData?.length === 1 ? shortTitle : longTitle,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && selectedData.length > 0) {
                props.deleteAllocations({
                    ids: selectedData
                });
            }
        })

    }

    // Bắt sự kiện click xem thông tin hóa đơn
    const handleView = async (value) => {
        await setState({
            ...state,
            currentRow: value
        });
        window.$('#modal-view-purchase-invoice').modal('show');
    }
    // Bắt sự kiện click sửa thông tin hóa đơn
    const handleEdit = async (value) => {
        await setState({
            ...state,
            currentRowEdit: value
        });
        window.$('#modal-edit-purchase-invoice').modal('show');
    }

    const getSupplies = () => {
        let { suppliesReducer } = props;
        let listSupplies = suppliesReducer && suppliesReducer.listSupplies;
        let suppliesArr = [];

        listSupplies.map(item => {
            suppliesArr.push({
                value: item._id,
                text: item.suppliesName
            })
        })

        return suppliesArr;
    }

    let suppliesArr = getSupplies();
    let suppliesList = suppliesReducer.listSupplies;
    var pageTotal = ((purchaseInvoiceReducer.totalList % limit) === 0) ?
        parseInt(purchaseInvoiceReducer.totalList / limit) :
        parseInt((purchaseInvoiceReducer.totalList / limit) + 1);
    var currentPage = parseInt((page / limit) + 1);

    return (
        <div className="box">
            <div className="box-body qlcv">
                {/* Thêm hóa đơn mới */}
                <div className="dropdown pull-right">
                    <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('menu.add_purchase_invoice')} >{translate('menu.add_purchase_invoice')}</button>
                    <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                        <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-purchase-invoice').modal('show')}>{translate('menu.add_purchase_invoice')}</a></li>
                    </ul>
                </div>
                <PurchaseInvoiceCreateForm />

                {/* Tìm kiếm */}
                <div className="form-inline">
                    {/* Mã hóa đơn */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('supplies.invoice_management.codeInvoice')}</label>
                        <input type="text" className="form-control" name="codeInvoice" onChange={handleCodeInvoiceChange} placeholder={translate('supplies.invoice_management.codeInvoice')} autoComplete="off" />
                    </div>

                    {/* Nhà cung cấp */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('supplies.invoice_management.supplier')}</label>
                        <input type="text" className="form-control" name="supplier" onChange={handleSupplierNameChange} placeholder={translate('supplies.invoice_management.supplier')} autoComplete="off" />
                    </div>
                </div>
                <div className="form-inline">
                    {/* Tên vật tư */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('supplies.invoice_management.supplies')}</label>
                        <SelectMulti
                            id={`suppliesInPurchaseInvoice`}
                            multiple="multiple"
                            options={{ nonSelectedText: translate('supplies.general_information.select_supplies'), allSelectedText: translate('supplies.general_information.select_all_supplies') }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={suppliesArr}
                            onChange={handleSuppliesChange}
                        />
                    </div>

                    {/* Ngày Thanh lý */}
                    <div className="form-group">
                        <label className="form-control-static" style={{ padding: 0 }}>{translate('supplies.invoice_management.date')}</label>
                        <DatePicker
                            id="disposal-month"
                            dateFormat="month-year"
                            value={date}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    {/* Nút tìm kiếm */}
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('supplies.general_information.search')} onClick={handleSubmitSearch}>{translate('supplies.general_information.search')}</button>
                    </div>
                    {selectedData?.length > 0 && <button type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDeleteOptions()}>{translate("general.delete_option")}</button>}
                </div>

                {/* Bảng thông tin vật tư */}
                <SmartTable
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_example.index'),
                        codeInvoice: translate('supplies.invoice_management.codeInvoice'),
                        date: translate('supplies.invoice_management.date'),
                        supplies: translate('supplies.invoice_management.supplies'),
                        supplier: translate('supplies.invoice_management.supplier'),
                        quantity: translate('supplies.invoice_management.quantity'),
                        price: translate('supplies.invoice_management.price'),
                    }}
                    tableHeaderData={{
                        index: <th>{translate('manage_example.index')}</th>,
                        codeInvoice: <th>{translate('supplies.invoice_management.codeInvoice')}</th>,
                        date: <th>{translate('supplies.invoice_management.date')}</th>,
                        supplies: <th>{translate('supplies.invoice_management.supplies')}</th>,
                        supplier: <th>{translate('supplies.invoice_management.supplier')}</th>,
                        quantity: <th>{translate('supplies.invoice_management.quantity')}</th>,
                        price: <th>{translate('supplies.invoice_management.price')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={purchaseInvoiceReducer.listPurchaseInvoice?.length > 0 && purchaseInvoiceReducer.listPurchaseInvoice.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>,
                            codeInvoice: <td>{item.codeInvoice}</td>,
                            date: <td>{formatDate(item.date)}</td>,
                            supplies: <td>{getPropertyOfValue(item.supplies, 'suppliesName', false, suppliesList)}</td>,
                            supplier: <td>{item.supplier}</td>,
                            quantity: <td>{item.quantity}</td>,
                            price: <th>{item.price}</th>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleView(item)}><i className="material-icons">visibility</i></a>
                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('supplies.general_information.delete_purchase_invoice')}
                                    data={{
                                        id: item._id,
                                        info: item.codeInvoice
                                    }}
                                    func={handleDeleteAnInvoice}
                                />
                            </td>
                        }
                    })}
                    dataDependency={purchaseInvoiceReducer.listPurchaseInvoice}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                />

                {purchaseInvoiceReducer.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!purchaseInvoiceReducer.listPurchaseInvoice || purchaseInvoiceReducer.listPurchaseInvoice.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar
                    display={purchaseInvoiceReducer.listPurchaseInvoice ? purchaseInvoiceReducer.listPurchaseInvoice.length : null}
                    total={purchaseInvoiceReducer.totalList ? purchaseInvoiceReducer.totalList : null}
                    pageTotal={pageTotal ? pageTotal : 0}
                    currentPage={currentPage}
                    func={setPage}
                />
            </div>
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

            {
                currentRowEdit &&
                <PurchaseInvoiceEditFormditForm
                    id={currentRowEdit.id}
                    _id={currentRowEdit._id}
                    codeInvoice={currentRowEdit.codeInvoice}
                    supplies={getPropertyOfValue(currentRowEdit.supplies, '_id', true, suppliesList)}
                    supplier={currentRowEdit.supplier}
                    quantity={currentRowEdit.quantity}
                    price={currentRowEdit.price}
                    date={currentRowEdit.date}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { purchaseInvoiceReducer, suppliesReducer, user, auth } = state;
    return { purchaseInvoiceReducer, suppliesReducer, user, auth };
};

const actionCreators = {
    searchSupplies: SuppliesActions.searchSupplies,
    searchPurchaseInvoice: PurchaseInvoiceActions.searchPurchaseInvoice,
    deletePurchaseInvoices: PurchaseInvoiceActions.deletePurchaseInvoices,
};

const connectPurchaseInvoiceManagement = connect(mapState, actionCreators)(withTranslate(PurchaseInvoiceManagement));
export { connectPurchaseInvoiceManagement as PurchaseInvoiceManagement };