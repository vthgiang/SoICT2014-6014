import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { SuppliesActions } from '../../supplies/redux/actions';
import { PurchaseInvoiceActions } from '../redux/actions';

function PurchaseInvoiceEditForm(props) {
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

    // Khởi tạo state
    const [state, setState] = useState({

    })

    useEffect(() => {
        props.searchSupplies(getAll);
    }, []);

    const { id, translate, purchaseInvoiceReducer, suppliesReducer } = props;
    const { _id, codeInvoice, supplies, date, supplier, quantity, price,
        errorOnSupplies, errorOnCoceInvoice, errorOnSupplier, errorOnQuantity, errorOnDate, errorOnPrice,
    } = state;

    // setState từ props mới
    const [prevProps, setPrevProps] = useState({
        id: null
    })

    if (prevProps.id !== props.id) {
        setState(state => {
            return {
                ...state,
                _id: props._id,
                id: props.id,
                index: props.index,
                codeInvoice: props.codeInvoice,
                supplier: props.supplier,
                supplies: props.supplies,
                date: props.date,
                quantity: props.quantity,
                price: props.price,

                errorOnCoceInvoice: undefined,
                errorOnSupplier: undefined,
                errorOnQuantity: undefined,
                errorOnDate: undefined,
                errorOnPrice: undefined,
                errorOnSupplies: undefined,
            }
        })
        setPrevProps(props)
    }

    // Bắt sự kiện thay đổi mã hóa đơn
    const handleCodeInvoiceChange = (e) => {
        const { value } = e.target;
        validateCodeInvoice(value, true);

    }
    const validateCodeInvoice = async (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            await setState({
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
    const validateDate = async (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            await setState({
                ...state,
                errorOnDate: message,
                date: value
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "vật tư mua"
    const handleSuppliesChange = (e) => {
        let value = e[0] !== 'null' ? e[0] : null;
        validateSupplies(value, true);
    }
    const validateSupplies = async (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            await setState({
                ...state,
                errorOnSupplies: message,
                supplies: value,
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Nhà cung cấp"
    const handleSupplierChange = (e) => {
        const { value } = e.target;
        validateSupplier(value);
    }
    const validateSupplier = async (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            await setState({
                ...state,
                supplier: value,
                errorOnSupplier: message,
            })
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Số lượng"
    const handleQuantityChange = async (e) => {
        let value = e.target.value;
        validateQuantity(value, true);
    }
    const validateQuantity = async (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            await setState({
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
    const validatePrice = async (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            await setState({
                ...state,
                price: value,
                errorOnPrice: message
            })
        }
        return message === undefined;
    }


    // function kiểm tra các trường bắt buộc phải nhập
    const validatorInput = (value) => {
        if (value !== undefined && value !== null && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        const { codeInvoice, supplies, quantity, supplier, date, price } = state;
        let result = validatorInput(supplies) &&
            validatorInput(codeInvoice) &&
            validateQuantity(quantity, false) &&
            validatePrice(price, false) &&
            validatorInput(date) &&
            validatorInput(supplier);
        return result;
    }


    // Bắt sự kiện submit form
    const save = () => {
        let { date, codeInvoice, supplies, supplier, quantity, price } = state;
        let dataToSubmit = {
            codeInvoice: codeInvoice,
            supplies: supplies,
            supplier: supplier,
            quantity: quantity,
            price: price,
            date: date
        }
        return props.updatePurchaseInvoice(id, dataToSubmit);
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

    let suppliesList = getSupplies();

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-purchase-invoice`} isLoading={purchaseInvoiceReducer.isLoading}
                formID={`form-edit-purchase-invoice`}
                title={translate('supplies.general_information.edit_purchase_invoice')}
                disableSubmit={!isFormValidated()}
                func={save}
                size={50}
                maxWidth={500}
            >
                <form className="form-group" id="form-edit-purchase-invoice">
                    <div className="col-md-12">
                        <div className="col-sm-6">
                            {/* Mã hóa đơn */}
                            <div className={`form-group ${errorOnCoceInvoice === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.invoice_management.codeInvoice')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="codeInvoice" value={codeInvoice} onChange={handleCodeInvoiceChange} autoComplete="off"
                                    placeholder="Mã hóa đơn" />
                                <ErrorLabel content={errorOnCoceInvoice} />
                            </div>

                            {/* Ngày mua */}
                            <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.invoice_management.date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_date${id}`}
                                    value={date ? formatDate(date) : ''}
                                    onChange={handleDateChange}
                                />
                                <ErrorLabel content={errorOnDate} />
                            </div>

                            {/* vật tư mua */}
                            <div className={`form-group ${errorOnSupplies === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.invoice_management.supplies')}<span className="text-red">*</span></label>
                                <div>
                                    <div id={`suppliesBox-${id}`}>
                                        <SelectBox
                                            id={`suppliesSelectBox-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={suppliesReducer.listSupplies.map(x => { return { value: x.id, text: x.code + " - " + x.suppliesName } })}
                                            onChange={handleSuppliesChange}
                                            value={supplies}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <ErrorLabel content={errorOnSupplies} />
                            </div>
                        </div>

                        <div className="col-sm-6">
                            {/* Nhà cung cấp */}
                            <div className={`form-group ${errorOnSupplier === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.invoice_management.supplier')} <span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="supplier" value={supplier}
                                    onChange={handleSupplierChange} autoComplete="off" placeholder="Nhà cung cấp" />
                                <ErrorLabel content={errorOnSupplier} />
                            </div>

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
}

function mapState(state) {
    const { purchaseInvoiceReducer, suppliesReducer, user, auth } = state;
    return { purchaseInvoiceReducer, suppliesReducer, user, auth };
};

const actionCreators = {
    searchSupplies: SuppliesActions.searchSupplies,
    updatePurchaseInvoice: PurchaseInvoiceActions.updatePurchaseInvoice,
};

const connectedPurchaseInvoiceEditForm = connect(mapState, actionCreators)(withTranslate(PurchaseInvoiceEditForm));
export { connectedPurchaseInvoiceEditForm as PurchaseInvoiceEditFormditForm };