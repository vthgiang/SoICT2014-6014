import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { PaymentActions } from "../../redux/actions";
import { SalesOrderActions } from "../../../sales-order/redux/actions";
import ValidationHelper from "../../../../../../helpers/validationHelper";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from "../../../../../../common-components";

class ReceiptVoucherCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: "",
            salesOrders: [],
            salesOrder: "",
            money: "",
        };
    }

    isFormValidated = () => {
        let { translate } = this.props;
        let { account, owner, bankName, bankAcronym } = this.state;
        if (
            ValidationHelper.validateName(translate, account, 4, 255).message ||
            ValidationHelper.validateName(translate, bankName, 4, 255).message ||
            ValidationHelper.validateName(translate, bankAcronym, 1, 255).message ||
            ValidationHelper.validateName(translate, owner, 2, 255).message
        ) {
            return false;
        }
        return true;
    };

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
            amount: "",
            salesOrder: "title",
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

    handleSalesOrderChange = (value) => {
        this.setState({
            salesOrder: value[0],
        });
        this.validateSalesOrder(value[0], true);
    };

    validateAmount = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) <= 0) {
            msg = "Số tiền phải lớn hơn 0!";
        }
        if (willUpdateState) {
            this.setState({
                amountError: msg,
            });
        }

        return msg;
    };

    handleAmountChange = (e) => {
        let { value } = e.target;
        this.setState({
            amount: value,
        });

        this.validateAmount(value, true);
    };

    isSubmitPaymentForSalesOrderValidate = () => {
        let { salesOrder, amount } = this.state;
        if (this.validateSalesOrder(salesOrder, false) || this.validateAmount(amount, false)) {
            return false;
        }

        return true;
    };

    handleSubmitPaymentForSalesOrder = () => {
        if (this.isSubmitPaymentForSalesOrderValidate) {
            let { salesOrder, amount, salesOrders } = this.state;
            const { salesOrdersForPayment } = this.props.salesOrders;
            let salesOrderInfo = salesOrdersForPayment.find((element) => element._id === salesOrder);

            let data = {
                salesOrder,
                amount,
                paymentAmount: salesOrderInfo.paymentAmount,
                paid: salesOrderInfo.paid,
            };

            salesOrders.push(data);
            this.setState((state) => {
                return {
                    ...state,
                    salesOrder: "title",
                    amount: "",
                };
            });
        }
    };

    save = async () => {
        if (this.isFormValidated()) {
            let { account, owner, bankName, bankAcronym, status } = this.state;
            let data = {
                account,
                owner,
                bankName,
                bankAcronym,
                status,
            };
            await this.props.createPayment(data);
            await this.setState({
                account: "",
                owner: "",
                bankName: "",
                bankAcronym: "",
                status: false,
            });
        }
    };

    render() {
        let {
            customer,
            paymentType,
            bankAccountReceived,
            salesOrder,
            amount,
            customerError,
            paymentTypeError,
            bankAccountReceivedError,
            salesOrderError,
            salesOrders,
            editSalesOrder,
            amountError,
        } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-receipt-voucher`} button_name={"Tạo phiếu thu"} title={"Tạo phiếu thu"} />
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
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Các đơn hàng thanh toán</legend>
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

                            <div className={`form-group ${!amountError ? "" : "has-error"}`}>
                                <label>
                                    {"Số tiền thanh toán"}
                                    <span className="attention"> * </span>
                                </label>
                                <input type="number" className="form-control" value={amount} onChange={this.handleAmountChange} />
                                <ErrorLabel content={amountError} />
                            </div>

                            <div className={"pull-right"} style={{ padding: 10 }}>
                                {editSalesOrder ? (
                                    <React.Fragment>
                                        <button
                                            className="btn btn-success"
                                            // onClick={this.handleCancelEditGoodTaxCollection}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Hủy chỉnh sửa
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            // disabled={!this.isGoodsValidated()}
                                            // onClick={this.handleSaveEditGoodTaxCollection}
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
                                        <th title={"Số lượng tồn kho"}>Thanh toán</th>
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
                                                    <td>{item.paymentAmount}</td>
                                                    <td>{item.paymentAmount - item.paid}</td>
                                                    <td>{item.money}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <a
                                                            href="#abc"
                                                            className="edit"
                                                            title="Sửa"
                                                            // onClick={() => this.handleEditGoodsTaxCollection(item, index)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                        <a
                                                            // onClick={() => this.handleDeleteGoodsTaxCollection(item)}
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
