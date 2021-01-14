import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { PaymentActions } from "../../redux/actions";
import { SalesOrderActions } from "../../../sales-order/redux/actions";
import ValidationHelper from "../../../../../../helpers/validationHelper";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";

class ReceiptVoucherCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };
    }

    getCustomerOptions = () => {
        let options = [];

        const { list } = this.props.customers;
        if (list) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn khách hàng---",
                },
            ];

            let mapOptions = this.props.customers.list.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - " + item.name,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    getSalesOrderOptions = () => {
        let options = [];

        const { salesOrdersForPayment } = this.props.salesOrders;
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

    getBankAccountOptions = () => {
        let options = [];

        const { listBankAccounts } = this.props.bankAccounts;
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

    validateCustomer = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                customerError: msg,
            });
        }

        return msg;
    };

    handleCustomerChange = async (value) => {
        this.setState({
            customer: value[0],
            money: "",
            salesOrder: "title",
            salesOrders: [],
            paymentType: "title",
            bankAccountReceived: "title",
        });

        this.validateCustomer(value[0]);

        //Lấy các đơn hàng chưa thanh toán của khách hàng
        if (value[0] !== "title") {
            await this.props.getSalesOrdersForPayment(value[0], true);
        }
    };

    validatePaymentType = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                paymentTypeError: msg,
            });
        }

        return msg;
    };

    handlePaymentTypeChange = (value) => {
        if (parseInt(value[0]) === 2) {
            //Hình thức chuyển khoản
            this.setState({
                paymentType: value[0],
            });
        } else {
            this.setState({
                paymentType: value[0],
                bankAccountReceived: "",
            });
        }
        this.validatePaymentType(value[0], true);
    };

    validateBankAccountReceived = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                bankAccountReceivedError: msg,
            });
        }

        return msg;
    };

    handleBankAccountReceivedChange = (value) => {
        this.setState({
            bankAccountReceived: value[0],
        });
        this.validateBankAccountReceived(value[0], true);
    };

    validateSalesOrder = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                salesOrderError: msg,
            });
        }

        return msg;
    };

    getMoneyForPayment = (salesOrderId) => {
        const { salesOrdersForPayment } = this.props.salesOrders;
        let salesOrderInfo = salesOrdersForPayment.find((element) => element._id === salesOrderId);

        const { totalMoney, salesOrders, indexEditting } = this.state;
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
    validateCompareTotalMoney = () => {
        const { totalMoney, salesOrders } = this.state;

        let moneyAdded = 0;
        for (let index = 0; index < salesOrders.length; index++) {
            moneyAdded += salesOrders[index].money;
        }

        return parseInt(moneyAdded) === parseInt(totalMoney);
    };

    handleSalesOrderChange = (value) => {
        if (value[0] !== "title") {
            const { salesOrdersForPayment } = this.props.salesOrders;
            let salesOrderInfo = salesOrdersForPayment.find((element) => element._id === value[0]);
            let money = this.getMoneyForPayment(value[0]);
            this.setState({
                //Lưu thông tin tạm thời của sales order vào state
                salesOrder: value[0],
                code: salesOrderInfo.code,
                paymentAmount: salesOrderInfo.paymentAmount,
                paid: salesOrderInfo.paid,
                money,
            });
        } else {
            this.setState({
                salesOrder: value[0],
            });
        }
        this.validateSalesOrder(value[0], true);
    };

    validateMoney = (value, willUpdateState = true) => {
        let { paid, paymentAmount } = this.state;
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) <= 0) {
            msg = "Số tiền phải lớn hơn 0!";
        } else if (parseInt(value) > parseInt(paymentAmount - paid)) {
            msg = "Số tiền thanh toán không được vượt quá dư nợ: " + formatCurrency(paymentAmount - paid);
        }
        if (willUpdateState) {
            this.setState({
                moneyError: msg,
            });
        }

        return msg;
    };

    handleMoneyChange = (e) => {
        let { value } = e.target;
        this.setState({
            money: value,
        });

        this.validateMoney(value, true);
    };

    validateTotalMoney = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) <= 0) {
            msg = "Số tiền phải lớn hơn 0!";
        }
        if (willUpdateState) {
            this.setState({
                totalMoneyError: msg,
            });
        }

        return msg;
    };

    handleTotalMoneyChange = (e) => {
        let { value } = e.target;
        this.setState({
            totalMoney: value,
            salesOrder: "title",
            money: 0,
        });
        this.validateTotalMoney(value, true);
    };

    isSubmitPaymentForSalesOrderValidate = () => {
        let { salesOrder, money } = this.state;
        if (this.validateSalesOrder(salesOrder, false) || this.validateMoney(money, false)) {
            return false;
        }

        return true;
    };

    handleSubmitPaymentForSalesOrder = () => {
        if (this.isSubmitPaymentForSalesOrderValidate) {
            let { salesOrder, money, salesOrders, code, paymentAmount, paid } = this.state;

            let data = {
                salesOrder,
                money,
                code,
                paymentAmount,
                paid,
            };

            salesOrders.push(data);
            this.setState((state) => {
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

    handlePaymentForSalesOrderEdit = async (item, index) => {
        await this.setState({
            editSalesOrder: true,
            indexEditting: index,
            salesOrder: item.salesOrder,
            code: item.code,
            paymentAmount: item.paymentAmount,
            paid: item.paid,
        });

        let money = await this.getMoneyForPayment(item.salesOrder);
        await this.setState({
            money,
        });
    };

    handleSaveEditPaymentForSalesOrder = () => {
        if (this.isSubmitPaymentForSalesOrderValidate) {
            let { salesOrder, money, salesOrders, code, paymentAmount, paid, indexEditting, editSalesOrder } = this.state;

            let data = {
                salesOrder,
                money,
                code,
                paymentAmount,
                paid,
            };

            salesOrders[indexEditting] = data;

            this.setState((state) => {
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

    handleCancelEditPaymentForSalesOrder = () => {
        this.setState((state) => {
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

    handleDeletePaymentForSalesOrder = (item) => {
        let { salesOrders } = this.state;

        let salesOrdersFilter = salesOrders.filter((element) => element.salesOrder !== item.salesOrder);
        this.setState({
            salesOrders: salesOrdersFilter,
        });
    };

    isFormValidated = () => {
        let { customer, paymentType, bankAccountReceived, salesOrders } = this.state;
        if (
            this.validateCustomer(customer, false) ||
            this.validatePaymentType(paymentType, false) ||
            !this.validateCompareTotalMoney() ||
            !salesOrders.length
        ) {
            return false;
        }

        if (parseInt(paymentType) === 2 && this.validateBankAccountReceived(bankAccountReceived, false)) {
            return false;
        }

        return true;
    };

    getSalesOrderForSubmit = async (salesOrders) => {
        let salesOrdersMap = await salesOrders.map((item) => {
            return {
                salesOrder: item.salesOrder,
                money: item.money,
            };
        });

        return salesOrdersMap;
    };

    save = async () => {
        if (this.isFormValidated()) {
            let { customer, paymentType, bankAccountReceived, salesOrders, receiptVoucherCode } = this.state;
            let data = {
                code: receiptVoucherCode,
                customer,
                paymentType,
                bankAccountReceived: bankAccountReceived !== "" ? bankAccountReceived : undefined,
                salesOrders: await this.getSalesOrderForSubmit(salesOrders),
                type: 1, //Phiếu thu tiền bán hàng
            };

            await this.props.createPayment(data);
            await this.setState({
                customer: "title",
                paymentType: "title",
                bankAccountReceived: "",
                salesOrders: [],
                totalMoney: "",
            });
        }
    };

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, receiptVoucherCode: generateCode("RV_") };
        });
    };

    render() {
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
        } = this.state;

        let debt = 0;
        const { salesOrdersForPayment } = this.props.salesOrders;
        if (salesOrdersForPayment && salesOrdersForPayment.length) {
            for (let index = 0; index < salesOrdersForPayment.length; index++) {
                debt += salesOrdersForPayment[index].paymentAmount - salesOrdersForPayment[index].paid;
            }
        }

        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
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
                    msg_faile={"Thêm không thành công"}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
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
                                items={this.getCustomerOptions()}
                                onChange={this.handleCustomerChange}
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
                                onChange={this.handlePaymentTypeChange}
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
                                    items={this.getBankAccountOptions()}
                                    onChange={this.handleBankAccountReceivedChange}
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
                            <input type="number" className="form-control" value={totalMoney} onChange={this.handleTotalMoneyChange} />
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
                                    items={this.getSalesOrderOptions()}
                                    onChange={this.handleSalesOrderChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={salesOrderError} />
                            </div>

                            <div className={`form-group ${!moneyError ? "" : "has-error"}`}>
                                <label>
                                    {"Số tiền thanh toán"}
                                    <span className="attention"> * </span>
                                </label>
                                <input type="number" className="form-control" value={money} onChange={this.handleMoneyChange} disabled={true} />
                                <ErrorLabel content={moneyError} />
                            </div>

                            <div className={"pull-right"} style={{ padding: 10 }}>
                                {editSalesOrder ? (
                                    <React.Fragment>
                                        <button
                                            className="btn btn-success"
                                            onClick={this.handleCancelEditPaymentForSalesOrder}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Hủy chỉnh sửa
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            disabled={!this.isSubmitPaymentForSalesOrderValidate()}
                                            onClick={this.handleSaveEditPaymentForSalesOrder}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Lưu
                                        </button>
                                    </React.Fragment>
                                ) : (
                                    <button
                                        className="btn btn-success"
                                        style={{ marginLeft: "10px" }}
                                        disabled={!this.isSubmitPaymentForSalesOrderValidate()}
                                        onClick={this.handleSubmitPaymentForSalesOrder}
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
                                                            onClick={() => this.handlePaymentForSalesOrderEdit(item, index)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                        <a
                                                            onClick={() => this.handleDeletePaymentForSalesOrder(item)}
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
                                                        return accumulator + currentValue.money;
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
