import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { PaymentActions } from "../../redux/actions";
import { SalesOrderActions } from "../../../sales-order/redux/actions";
import ValidationHelper from "../../../../../../helpers/validationHelper";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";

function ReceiptVoucherCreateForm(props) {

    const [state, setState] = useState({
        customer: "",
        salesOrders: [],
        salesOrder: "",
        money: "",
        paid: "",
        paymentAmount: 0,
        code: "", //Mã sales order
        totalMoney: "",
        indexEditting: -1,
        receiptVoucherCode: "",
    })

    const getCustomerOptions = () => {
        let options = [];

        const { list } = props.customers;
        if (list) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn khách hàng---",
                },
            ];

            let mapOptions = props.customers.list.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - " + item.name,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    const getSalesOrderOptions = () => {
        let options = [];

        const { salesOrdersForPayment } = props.salesOrders;
        if (salesOrdersForPayment && salesOrdersForPayment.length) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn đơn hàng---",
                },
            ];

            let mapOptions = salesOrdersForPayment.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - dư nợ: " + formatCurrency(item.paymentAmount - item.paid),
                };
            });

            options = options.concat(mapOptions);
        }

        if (salesOrdersForPayment && !salesOrdersForPayment.length) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "Khách hàng không còn dư nợ",
                },
            ];
        }

        return options;
    };

    const getBankAccountOptions = () => {
        let options = [];

        const { listBankAccounts } = props.bankAccounts;
        if (listBankAccounts) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn tài khoản ngân hàng---",
                },
            ];

            let mapOptions = listBankAccounts.map((item) => {
                return {
                    value: item._id,
                    text: item.account + " - " + item.bankAcronym + " - " + item.owner,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    const validateCustomer = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                customerError: msg,
            });
        }

        return msg;
    };

    const handleCustomerChange = async (value) => {
        setState({
            ...state,
            customer: value[0],
            money: "",
            salesOrder: "title",
            salesOrders: [],
            paymentType: "title",
            bankAccountReceived: "title",
        });

        validateCustomer(value[0]);

        //Lấy các đơn hàng chưa thanh toán của khách hàng
        if (value[0] !== "title") {
            await props.getSalesOrdersForPayment(value[0], true);
        }
    };

    const validatePaymentType = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                paymentTypeError: msg,
            });
        }

        return msg;
    };

    const handlePaymentTypeChange = (value) => {
        if (parseInt(value[0]) === 2) {
            //Hình thức chuyển khoản
            setState({
                ...state,
                paymentType: value[0],
            });
        } else {
            setState({
                ...state,
                paymentType: value[0],
                bankAccountReceived: "",
            });
        }
        validatePaymentType(value[0], true);
    };

    const validateBankAccountReceived = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                bankAccountReceivedError: msg,
            });
        }

        return msg;
    };

    const handleBankAccountReceivedChange = (value) => {
        setState({
            ...state,
            bankAccountReceived: value[0],
        });
        validateBankAccountReceived(value[0], true);
    };

    const validateSalesOrder = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                salesOrderError: msg,
            });
        }

        return msg;
    };

    const getMoneyForPayment = (salesOrderId) => {
        const { salesOrdersForPayment } = props.salesOrders;
        let salesOrderInfo = salesOrdersForPayment.find((element) => element._id === salesOrderId);

        const { totalMoney, salesOrders, indexEditting } = state;
        //Tổng số tiền đã thêm vào đơn

        let moneyAdded = 0;
        for (let index = 0; index < salesOrders.length; index++) {
            if (index !== parseInt(indexEditting)) {
                moneyAdded += salesOrders[index].money;
            }
        }

        let money = totalMoney - moneyAdded;

        if (parseInt(money) > parseInt(salesOrderInfo.paymentAmount - salesOrderInfo.paid)) {
            money = salesOrderInfo.paymentAmount - salesOrderInfo.paid;
        }

        return money;
    };

    //tổng tiền thanh toán phải bằng tổng thanh toán dưới bảng
    const validateCompareTotalMoney = () => {
        const { totalMoney, salesOrders } = state;

        let moneyAdded = 0;
        for (let index = 0; index < salesOrders.length; index++) {
            moneyAdded += salesOrders[index].money;
        }

        return parseInt(moneyAdded) === parseInt(totalMoney);
    };

    const handleSalesOrderChange = (value) => {
        if (value[0] !== "title") {
            const { salesOrdersForPayment } = props.salesOrders;
            let salesOrderInfo = salesOrdersForPayment.find((element) => element._id === value[0]);
            let money = getMoneyForPayment(value[0]);
            setState({
                ...state,
                //Lưu thông tin tạm thời của sales order vào state
                salesOrder: value[0],
                code: salesOrderInfo.code,
                paymentAmount: salesOrderInfo.paymentAmount,
                paid: salesOrderInfo.paid,
                money,
            });
        } else {
            setState({
                ...state,
                salesOrder: value[0],
            });
        }
        validateSalesOrder(value[0], true);
    };

    const validateMoney = (value, willUpdateState = true) => {
        let { paid, paymentAmount } = state;
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) <= 0) {
            msg = "Số tiền phải lớn hơn 0!";
        } else if (parseInt(value) > parseInt(paymentAmount - paid)) {
            msg = "Số tiền thanh toán không được vượt quá dư nợ: " + formatCurrency(paymentAmount - paid);
        }
        if (willUpdateState) {
            setState({
                ...state,
                moneyError: msg,
            });
        }

        return msg;
    };

    const handleMoneyChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            money: value,
        });

        validateMoney(value, true);
    };

    const validateTotalMoney = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) <= 0) {
            msg = "Số tiền phải lớn hơn 0!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                totalMoneyError: msg,
            });
        }

        return msg;
    };

    const handleTotalMoneyChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            totalMoney: value,
            salesOrder: "title",
            money: 0,
        });
        validateTotalMoney(value, true);
    };

    const isSubmitPaymentForSalesOrderValidate = () => {
        let { salesOrder, money } = state;
        if (validateSalesOrder(salesOrder, false) || validateMoney(money, false)) {
            return false;
        }

        return true;
    };

    const handleSubmitPaymentForSalesOrder = () => {
        if (isSubmitPaymentForSalesOrderValidate) {
            let { salesOrder, money, salesOrders, code, paymentAmount, paid } = state;

            let data = {
                salesOrder,
                money,
                code,
                paymentAmount,
                paid,
            };

            salesOrders.push(data);
            setState((state) => {
                return {
                    ...state,
                    salesOrders,
                    salesOrder: "title",
                    money: "",
                    code: "",
                    paymentAmount: 0,
                    paid: "",
                };
            });
        }
    };

    const handlePaymentForSalesOrderEdit = async (item, index) => {
        await setState({
            ...state,
            editSalesOrder: true,
            indexEditting: index,
            salesOrder: item.salesOrder,
            code: item.code,
            paymentAmount: item.paymentAmount,
            paid: item.paid,
        });

        let money = await getMoneyForPayment(item.salesOrder);
        await setState({
            ...state,
            money,
        });
    };

    const handleSaveEditPaymentForSalesOrder = () => {
        if (isSubmitPaymentForSalesOrderValidate) {
            let { salesOrder, money, salesOrders, code, paymentAmount, paid, indexEditting, editSalesOrder } = state;

            let data = {
                salesOrder,
                money,
                code,
                paymentAmount,
                paid,
            };

            salesOrders[indexEditting] = data;

            setState((state) => {
                return {
                    ...state,
                    salesOrder: "title",
                    money: "",
                    code: "",
                    paymentAmount: 0,
                    paid: "",
                    indexEditting: -1,
                    editSalesOrder: false,
                };
            });
        }
    };

    const handleCancelEditPaymentForSalesOrder = () => {
        setState((state) => {
            return {
                ...state,
                salesOrder: "title",
                money: "",
                code: "",
                paymentAmount: 0,
                paid: "",
                indexEditting: -1,
                editSalesOrder: false,
            };
        });
    };

    const handleDeletePaymentForSalesOrder = (item) => {
        let { salesOrders } = state;

        let salesOrdersFilter = salesOrders.filter((element) => element.salesOrder !== item.salesOrder);
        setState({
            ...state,
            salesOrders: salesOrdersFilter,
        });
    };

    const isFormValidated = () => {
        let { customer, paymentType, bankAccountReceived, salesOrders } = state;
        if (
            validateCustomer(customer, false) ||
            validatePaymentType(paymentType, false) ||
            !validateCompareTotalMoney() ||
            !salesOrders.length
        ) {
            return false;
        }

        if (parseInt(paymentType) === 2 && validateBankAccountReceived(bankAccountReceived, false)) {
            return false;
        }

        return true;
    };

    const getSalesOrderForSubmit = async (salesOrders) => {
        let salesOrdersMap = await salesOrders.map((item) => {
            return {
                salesOrder: item.salesOrder,
                money: item.money,
            };
        });

        return salesOrdersMap;
    };

    const save = async () => {
        if (isFormValidated()) {
            let { customer, paymentType, bankAccountReceived, salesOrders, receiptVoucherCode } = state;
            console.log({ customer, paymentType, bankAccountReceived, salesOrders, receiptVoucherCode });
            let data = {
                code: receiptVoucherCode,
                customer,
                paymentType,
                bankAccountReceived: bankAccountReceived !== "" ? bankAccountReceived : undefined,
                salesOrders: await getSalesOrderForSubmit(salesOrders),
                type: 1, //Phiếu thu tiền bán hàng
            };

            await props.createPayment(data);
            await setState({
                ...state,
                customer: "title",
                paymentType: "title",
                bankAccountReceived: "",
                salesOrders: [],
                totalMoney: "",
            });
        }
    };

    const handleClickCreateCode = () => {
        setState((state) => {
            return { ...state, receiptVoucherCode: generateCode("RV_") };
        });
    };

    let {
        customer,
        paymentType,
        bankAccountReceived,
        salesOrder,
        money,
        totalMoney,
        receiptVoucherCode,
        customerError,
        paymentTypeError,
        bankAccountReceivedError,
        salesOrderError,
        salesOrders,
        editSalesOrder,
        moneyError,
        totalMoneyError,
    } = state;

    let debt = 0;
    const { salesOrdersForPayment } = props.salesOrders;
    if (salesOrdersForPayment && salesOrdersForPayment.length) {
        for (let index = 0; index < salesOrdersForPayment.length; index++) {
            debt += salesOrdersForPayment[index].paymentAmount - salesOrdersForPayment[index].paid;
        }
    }

    return (
        <React.Fragment>
            <ButtonModal
                onButtonCallBack={handleClickCreateCode}
                modalID={`modal-create-receipt-voucher`}
                button_name={"Tạo phiếu thu"}
                title={"Tạo phiếu thu"}
            />
            <DialogModal
                modalID={`modal-create-receipt-voucher`}
                isLoading={false}
                formID={`form-create-receipt-voucher`}
                title={"Tạo phiếu thu"}
                msg_success={"Thêm thành công"}
                msg_failure={"Thêm không thành công"}
                disableSubmit={!isFormValidated()}
                func={save}
                size="50"
                style={{ backgroundColor: "green" }}
            >
                <form id={`form-create-receipt-voucher`}>
                    <div className={`form-group`}>
                        <label>
                            {"Mã phiếu"}
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" value={receiptVoucherCode} className="form-control" disabled={true} />
                    </div>
                    <div className={`form-group ${!customerError ? "" : "has-error"}`}>
                        <label>
                            Khách hàng
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-receipt-voucher-customer`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={customer}
                            items={getCustomerOptions()}
                            onChange={handleCustomerChange}
                            multiple={false}
                        />
                        <ErrorLabel content={customerError} />
                    </div>
                    <div className={`form-group ${!paymentTypeError ? "" : "has-error"}`}>
                        <label>
                            Phương thức thanh toán
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-receipt-voucher-payment-type`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={paymentType}
                            items={[
                                {
                                    value: "title",
                                    text: "---Chọn phương thức thanh toán---",
                                },
                                {
                                    value: 1,
                                    text: "Tiền mặt",
                                },
                                {
                                    value: 2,
                                    text: "Chuyển khoản",
                                },
                            ]}
                            onChange={handlePaymentTypeChange}
                            multiple={false}
                        />
                        <ErrorLabel content={paymentTypeError} />
                    </div>
                    {parseInt(paymentType) === 2 && (
                        <div className={`form-group ${!bankAccountReceivedError ? "" : "has-error"}`}>
                            <label>
                                Tài khoản thụ hưởng
                                <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select--receipt-voucher-bank-account`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={bankAccountReceived}
                                items={getBankAccountOptions()}
                                onChange={handleBankAccountReceivedChange}
                                multiple={false}
                            />
                            <ErrorLabel content={bankAccountReceivedError} />
                        </div>
                    )}

                    <div className={`form-group`}>
                        <label>{"Tổng dư nợ của khách hàng"}</label>
                        <input type="text" className="form-control" value={formatCurrency(debt)} disabled={true} />
                    </div>

                    <div className={`form-group ${!totalMoneyError ? "" : "has-error"}`}>
                        <label>
                            {"Tổng tiền thanh toán"}
                            <span className="attention"> * </span>
                        </label>
                        <input type="number" className="form-control" value={totalMoney} onChange={handleTotalMoneyChange} />
                        <ErrorLabel content={totalMoneyError} />
                    </div>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Thanh toán cho từng đơn</legend>
                        <div className={`form-group ${!salesOrderError ? "" : "has-error"}`}>
                            <label>
                                Đơn hàng còn dư nợ
                                <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-receipt-voucher-sales-order`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={salesOrder}
                                items={getSalesOrderOptions()}
                                onChange={handleSalesOrderChange}
                                multiple={false}
                            />
                            <ErrorLabel content={salesOrderError} />
                        </div>

                        <div className={`form-group ${!moneyError ? "" : "has-error"}`}>
                            <label>
                                {"Số tiền thanh toán"}
                                <span className="attention"> * </span>
                            </label>
                            <input type="number" className="form-control" value={money} onChange={handleMoneyChange} disabled={true} />
                            <ErrorLabel content={moneyError} />
                        </div>

                        <div className={"pull-right"} style={{ padding: 10 }}>
                            {editSalesOrder ? (
                                <React.Fragment>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleCancelEditPaymentForSalesOrder}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Hủy chỉnh sửa
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        disabled={!isSubmitPaymentForSalesOrderValidate()}
                                        onClick={handleSaveEditPaymentForSalesOrder}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Lưu
                                    </button>
                                </React.Fragment>
                            ) : (
                                <button
                                    className="btn btn-success"
                                    style={{ marginLeft: "10px" }}
                                    disabled={!isSubmitPaymentForSalesOrderValidate()}
                                    onClick={handleSubmitPaymentForSalesOrder}
                                >
                                    {"Thêm"}
                                </button>
                            )}
                        </div>

                        <table id={`receipt-voucher-add-sales-order`} className="table table-bordered not-sort">
                            <thead>
                                <tr>
                                    <th title={"STT"}>STT</th>
                                    <th title={"Mã đơn"}>Mã đơn</th>
                                    <th title={"Tổng tiền"}>Tổng tiền</th>
                                    <th title={"Còn"}>Tiền dư nợ</th>
                                    <th title={"Số tiền thanh toán"}>Số tiền thanh toán</th>
                                    <th title={"Đơn vị tính"}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesOrders.length !== 0 &&
                                    salesOrders.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.code}</td>
                                                <td>{item.paymentAmount ? formatCurrency(item.paymentAmount) : ""}</td>
                                                <td>{item.paymentAmount - item.paid ? formatCurrency(item.paymentAmount - item.paid) : ""}</td>
                                                <td style={{ fontWeight: 600 }}>{item.money ? formatCurrency(item.money) : ""}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <a
                                                        href="#abc"
                                                        className="edit"
                                                        title="Sửa"
                                                        onClick={() => handlePaymentForSalesOrderEdit(item, index)}
                                                    >
                                                        <i className="material-icons">edit</i>
                                                    </a>
                                                    <a
                                                        onClick={() => handleDeletePaymentForSalesOrder(item)}
                                                        className="delete text-red"
                                                        style={{ width: "5px" }}
                                                        title={"Xóa"}
                                                    >
                                                        <i className="material-icons">delete</i>
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                {salesOrders.length !== 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ fontWeight: 600 }}>
                                            <center>Tổng thanh toán</center>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {formatCurrency(
                                                salesOrders.reduce((accumulator, currentValue) => {
                                                    return accumulator + parseInt(currentValue.money);
                                                }, 0)
                                            )}
                                        </td>
                                        <td></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </fieldset>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { salesOrders, bankAccounts } = state;
    const { customers } = state.crm;
    return { customers, salesOrders, bankAccounts };
}

const mapDispatchToProps = {
    createPayment: PaymentActions.createPayment,
    getSalesOrdersForPayment: SalesOrderActions.getSalesOrdersForPayment,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ReceiptVoucherCreateForm));
