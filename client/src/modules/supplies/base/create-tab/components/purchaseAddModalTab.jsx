import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components';

import { generateCode } from "../../../../../helpers/generateCode";
import ValidationHelper from '../../../../../helpers/validationHelper';
import { SuppliesActions } from '../../../admin/supplies/redux/actions';

function PurchaseAddModal(props) {
    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    const formatDate = (date) => {
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

        return [day, month, year].join('-');
    }
    const getAll = true;
    const [state, setState] = useState({
        codeInvoice: "",
        date: formatDate(Date.now()),
        supplier: "",
        quantity: 0,
        price: 0,
    })

    const regenerateCode = () => {
        let code = generateCode("DNMS");
        setState((state) => ({
            ...state,
            codeInvoice: code,
        }));
    }

    const { id } = props;
    const { _id, translate, user, auth, } = props;
    const {
        codeInvoice, date, supplier, quantity, price,
        errorOnCoceInvoice, errorOnSupplier, errorOnQuantity, errorOnDate, errorOnPrice,
    } = state;

    // Bắt sự kiện thay đổi mã hóa đơn
    const handleCodeInvoiceChange = (e) => {
        const { value } = e.target;
        validateCodeInvoice(value, true);

    }
    const validateCodeInvoice = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                codeInvoice: value,
                errorOnCoceInvoice: message
            })
        }
        return message === undefined;
    }


    // Bắt sự kiện thay đổi "Ngày mua"
    const handleDateChange = (value) => {
        validateDate(value, true);
    }
    const validateDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                errorOnDate: message,
                date: value
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Nhà cung cấp"
    const handleSupplierChange = (e) => {
        const { value } = e.target;
        validateSupplier(value);
    }
    const validateSupplier = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                supplier: value,
                errorOnSupplier: message,
            })
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Số lượng"
    const handleQuantityChange = (e) => {
        let value = e.target.value;
        validateQuantity(value, true);
    }
    const validateQuantity = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                errorOnQuantity: message,
                quantity: value,
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Giá trị dự tính"
    const handlePriceChange = (e) => {
        let value = e.target.value;
        validatePrice(value, true);
    }
    const validatePrice = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                price: value,
                errorOnPrice: message
            })
        }
        return message === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        const { codeInvoice, quantity, supplier, date, price } = state;
        let result = validateCodeInvoice(codeInvoice, false) &&
            validateQuantity(quantity, false) &&
            validatePrice(price, false) &&
            validateDate(date, false) &&
            validateSupplier(supplier, false);
        return result;
    }


    // Bắt sự kiện submit form
    const save = () => {
        let { date, codeInvoice, supplier, quantity, price } = state;
        let dateData = date.split("-");
        let dataToSubmit = {
            codeInvoice: codeInvoice,
            supplier: supplier,
            quantity: quantity,
            price: price,
            date: new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)
        }
        if (isFormValidated()) {
            return props.handleChange(dataToSubmit);
        }
    }

    return (
        <React.Fragment>
            {/* Button thêm mới hoa don */}
            <ButtonModal modalID={`modal-create-invoice-${id}`} button_name={translate('asset.general_information.add')} title={translate('supplies.general_information.add_purchase_invoice')} />

            <DialogModal
                size='75' modalID={`modal-create-invoice-${id}`} isLoading={false}
                formID={`form-create-invoice-${id}`}
                title={translate('asset.asset_info.add_maintenance_card')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm mới hoa don */}
                <form className="form-group" id={`form-create-invoice-${id}`}>
                    <div className="col-md-12">
                        <div className="col-sm-6">
                            {/* Mã hóa đơn */}
                            <div className={`form-group`}>
                                <label>{translate('supplies.invoice_management.codeInvoice')}<span className="text-red">*</span></label>
                                <a style={{ cursor: "pointer" }} title={translate('asset.asset_lot.generate_asset_lot_code')}><i className="fa fa-plus-square" style={{ color: "#28A745", marginLeft: 5 }}
                                    onClick={regenerateCode} /><span onClick={regenerateCode}>{translate('asset.asset_lot.generate_asset_lot_code')}</span></a>
                                <input type="text" className="form-control" name="codeInvoice" value={codeInvoice} onChange={handleCodeInvoiceChange} autoComplete="off"
                                    placeholder="Mã hóa đơn" />
                                <ErrorLabel content={errorOnCoceInvoice} />
                            </div>

                            {/* Ngày mua */}
                            <div className="form-group">
                                <label>{translate('supplies.invoice_management.date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_date"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                                <ErrorLabel content={errorOnDate} />
                            </div>
                            {/* Nhà cung cấp */}
                            <div className={`form-group ${errorOnSupplier === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.invoice_management.supplier')} <span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="supplier" value={supplier}
                                    onChange={handleSupplierChange} autoComplete="off" placeholder="Nhà cung cấp" />
                                <ErrorLabel content={errorOnSupplier} />
                            </div>
                        </div>

                        <div className="col-sm-6">
                            {/* Giá */}
                            <div className={`form-group ${errorOnPrice === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.invoice_management.price')} (VNĐ)<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="total" value={price} min="1"
                                    onChange={handlePriceChange} autoComplete="off" placeholder="Giá" />
                                <ErrorLabel content={errorOnPrice} />
                            </div>

                            {/* Số lượng */}
                            <div className={`form-group ${errorOnQuantity === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.invoice_management.quantity')} <span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="quantity" min="1" value={quantity}
                                    onChange={handleQuantityChange} autoComplete="off" placeholder="Số lượng" />
                                <ErrorLabel content={errorOnQuantity} />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { auth, user, suppliesReducer } = state;
    return { auth, user, suppliesReducer };
};

const actionCreators = {
    searchSupplies: SuppliesActions.searchSupplies,
};

const addInvoiceModal = connect(mapState, actionCreators)(withTranslate(PurchaseAddModal));
export { addInvoiceModal as PurchaseAddModal };
