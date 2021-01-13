import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { PaymentActions } from "../../redux/actions";
import { PurchaseOrderActions } from "../../../purchase-order/redux/actions";
import ValidationHelper from "../../../../../../helpers/validationHelper";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";

class PaymentVoucherCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: "",
            purchaseOrders: [],
            purchaseOrder: "",
            money: "",
            paid: "",
            paymentAmount: 0,
            code: "", //Mã sales order
            totalMoney: "",
            indexEditting: -1,
            PaymentVoucherCode: "",
        };
    }

    getSupplierOptions = () => {
        let options = [];

        const { list } = this.props.customers;
        if (list) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn nhà cung cấp---",
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

    getPurchaseOrdersOptions = () => {
        let options = [];

        const { purchaseOrdersForPayment } = this.props.purchaseOrders;
        if (purchaseOrdersForPayment && purchaseOrdersForPayment.length) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn đơn nhập---",
                },
            ];

            let mapOptions = purchaseOrdersForPayment.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - còn nợ: " + formatCurrency(item.paymentAmount - item.paid),
                };
            });

            options = options.concat(mapOptions);
        }

        if (purchaseOrdersForPayment && !purchaseOrdersForPayment.length) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "Không dư nợ nhà cung cấp này",
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
                    text: "---Chọn tài khoản thanh toán---",
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

    validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                supplierError: msg,
            });
        }

        return msg;
    };

    handleSupplierChange = async (value) => {
        this.setState({
            supplier: value[0],
            money: "",
            purchaseOrder: "title",
            purchaseOrders: [],
            paymentType: "title",
            bankAccountReceived: "title",
        });

        this.validateSupplier(value[0]);

        //Lấy các đơn hàng chưa thanh toán của khách hàng
        if (value[0] !== "title") {
            await this.props.getPurchaseOrdersForPayment(value[0], true);
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
                bankAccountPaid: "",
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

    validateBankAccountPartner = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                bbankAccountPartnerError: msg,
            });
        }

        return msg;
    };

    handleBankAccountPartnerChange = (e) => {
        let { value } = e.target;
        this.setState({
            bankAccountPartner: value,
        });
        this.validateBankAccountPartner(value, true);
    };

    validatePurchaseOrder = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                purchaseOrderError: msg,
            });
        }

        return msg;
    };

    getMoneyForPayment = (purchaseOrderId) => {
        const { purchaseOrdersForPayment } = this.props.purchaseOrders;
        let purchaseOrderInfo = purchaseOrdersForPayment.find((element) => element._id === purchaseOrderId);

        const { totalMoney, purchaseOrders, indexEditting } = this.state;
        //Tổng số tiền đã thêm vào đơn

        let moneyAdded = 0;
        for (let index = 0; index < purchaseOrders.length; index++) {
            if (index !== parseInt(indexEditting)) {
                moneyAdded += purchaseOrders[index].money;
            }
        }

        let money = totalMoney - moneyAdded;

        if (parseInt(money) > parseInt(purchaseOrderInfo.paymentAmount - purchaseOrderInfo.paid)) {
            money = purchaseOrderInfo.paymentAmount - purchaseOrderInfo.paid;
        }

        return money;
    };

    //tổng tiền thanh toán phải bằng tổng thanh toán dưới bảng
    validateCompareTotalMoney = () => {
        const { totalMoney, purchaseOrders } = this.state;
        let moneyAdded = 0;
        for (let index = 0; index < purchaseOrders.length; index++) {
            moneyAdded += purchaseOrders[index].money;
        }

        return parseInt(moneyAdded) === parseInt(totalMoney);
    };

    handlePurchaseOrderChange = (value) => {
        if (value[0] !== "title") {
            const { purchaseOrdersForPayment } = this.props.purchaseOrders;
            let purchaseOrderInfo = purchaseOrdersForPayment.find((element) => element._id === value[0]);
            let money = this.getMoneyForPayment(value[0]);
            this.setState({
                //Lưu thông tin tạm thời của sales order vào state
                purchaseOrder: value[0],
                code: purchaseOrderInfo.code,
                paymentAmount: purchaseOrderInfo.paymentAmount,
                paid: purchaseOrderInfo.paid,
                money,
            });
        } else {
            this.setState({
                purchaseOrder: value[0],
            });
        }
        this.validatePurchaseOrder(value[0], true);
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
            purchaseOrder: "title",
            money: 0,
        });
        this.validateTotalMoney(value, true);
    };

    isSubmitPaymentForPurchaseOrderValidate = () => {
        let { purchaseOrder, money } = this.state;
        if (this.validatePurchaseOrder(purchaseOrder, false) || this.validateMoney(money, false)) {
            return false;
        }

        return true;
    };

    handleSubmitPaymentForPurchaseOrder = () => {
        if (this.isSubmitPaymentForPurchaseOrderValidate) {
            let { purchaseOrder, money, purchaseOrders, code, paymentAmount, paid } = this.state;

            let data = {
                purchaseOrder,
                money,
                code,
                paymentAmount,
                paid,
            };

            purchaseOrders.push(data);
            this.setState((state) => {
                return {
                    purchaseOrders,
                    ...state,
                    purchaseOrder: "title",
                    money: "",
                    code: "",
                    paymentAmount: 0,
                    paid: "",
                };
            });
        }
    };

    handlePaymentForPurchaseOrderEdit = async (item, index) => {
        await this.setState({
            editPurchaseOrder: true,
            indexEditting: index,
            purchaseOrder: item.purchaseOrder,
            code: item.code,
            paymentAmount: item.paymentAmount,
            paid: item.paid,
        });

        let money = await this.getMoneyForPayment(item.purchaseOrder);
        await this.setState({
            money,
        });
    };

    handleSaveEditPaymentForPurchaseOrder = () => {
        if (this.isSubmitPaymentForPurchaseOrderValidate) {
            let { purchaseOrder, money, purchaseOrders, code, paymentAmount, paid, indexEditting, editPurchaseOrder } = this.state;

            let data = {
                purchaseOrder,
                money,
                code,
                paymentAmount,
                paid,
            };

            purchaseOrders[indexEditting] = data;

            this.setState((state) => {
                return {
                    ...state,
                    purchaseOrder: "title",
                    purchaseOrders,
                    money: "",
                    code: "",
                    paymentAmount: 0,
                    paid: "",
                    indexEditting: -1,
                    editPurchaseOrder: false,
                };
            });
        }
    };

    handleCancelEditPaymentForPurchaseOrder = () => {
        this.setState((state) => {
            return {
                ...state,
                purchaseOrder: "title",
                money: "",
                code: "",
                paymentAmount: 0,
                paid: "",
                indexEditting: -1,
                editPurchaseOrder: false,
            };
        });
    };

    handleDeletePaymentForPurchaseOrder = (item) => {
        let { purchaseOrders } = this.state;

        let purchaseOrdersFilter = purchaseOrders.filter((element) => element.purchaseOrder !== item.purchaseOrder);
        this.setState({
            purchaseOrders: purchaseOrdersFilter,
        });
    };

    isFormValidated = () => {
        let { supplier, paymentType, bankAccountReceived, bankAccountPartner, purchaseOrders } = this.state;
        if (
            this.validateSupplier(supplier, false) ||
            this.validatePaymentType(paymentType, false) ||
            !this.validateCompareTotalMoney() ||
            !purchaseOrders.length
        ) {
            return false;
        }

        if (
            parseInt(paymentType) === 2 &&
            (this.validateBankAccountReceived(bankAccountReceived, false) || this.validateBankAccountPartner(bankAccountPartner, false))
        ) {
            return false;
        }

        return true;
    };

    getPurchaseOrderForSubmit = async (purchaseOrders) => {
        let purchaseOrdersMap = await purchaseOrders.map((item) => {
            return {
                purchaseOrder: item.purchaseOrder,
                money: item.money,
            };
        });

        return purchaseOrdersMap;
    };

    save = async () => {
        if (this.isFormValidated()) {
            let { supplier, paymentType, bankAccountReceived, bankAccountPartner, purchaseOrders, PaymentVoucherCode } = this.state;
            let data = {
                code: PaymentVoucherCode,
                supplier,
                paymentType,
                bankAccountReceived: bankAccountReceived !== "" ? bankAccountReceived : undefined,
                bankAccountPartner: bankAccountPartner !== "" ? bankAccountPartner : undefined,
                purchaseOrders: await this.getPurchaseOrderForSubmit(purchaseOrders),
                type: 2, //Phiếu chi tiền mua nguyên vật liệu
            };

            await this.props.createPayment(data);
            await this.setState({
                supplier: "title",
                paymentType: "title",
                bankAccountReceived: "title",
                bankAccountPartner: "",
                purchaseOrder: "title",
                purchaseOrders: [],
                totalMoney: "",
            });
        }
    };

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, PaymentVoucherCode: generateCode("PV_") };
        });
    };

    render() {
        let {
            supplier,
            paymentType,
            bankAccountReceived,
            bankAccountPartner,
            purchaseOrder,
            purchaseOrders,
            money,
            PaymentVoucherCode,
            totalMoney,
            supplierError,
            paymentTypeError,
            bankAccountReceivedError,
            bankAccountPartnerError,
            purchaseOrderError,
            editPurchaseOrder,
            moneyError,
            totalMoneyError,
        } = this.state;

        let debt = 0;
        const { purchaseOrdersForPayment } = this.props.purchaseOrders;
        if (purchaseOrdersForPayment && purchaseOrdersForPayment.length) {
            for (let index = 0; index < purchaseOrdersForPayment.length; index++) {
                debt += purchaseOrdersForPayment[index].paymentAmount - purchaseOrdersForPayment[index].paid;
            }
        }

        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-create-payment-voucher`}
                    button_name={"Tạo phiếu chi"}
                    title={"Tạo phiếu chi"}
                />
                <DialogModal
                    modalID={`modal-create-payment-voucher`}
                    isLoading={false}
                    formID={`form-create-payment-voucher`}
                    title={"Tạo phiếu chi"}
                    msg_success={"Thêm thành công"}
                    msg_faile={"Thêm không thành công"}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    <form id={`form-create-payment-voucher`}>
                        <div className={`form-group`}>
                            <label>
                                {"Mã phiếu"}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" value={PaymentVoucherCode} className="form-control" disabled={true} />
                        </div>
                        <div className={`form-group ${!supplierError ? "" : "has-error"}`}>
                            <label>
                                Nhà cung cấp
                                <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-create-payment-voucher-supplier`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={supplier}
                                items={this.getSupplierOptions()}
                                onChange={this.handleSupplierChange}
                                multiple={false}
                            />
                            <ErrorLabel content={supplierError} />
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
                            <React.Fragment>
                                <div className={`form-group ${!bankAccountReceivedError ? "" : "has-error"}`}>
                                    <label>
                                        Tài khoản thanh toán
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
                                <div className={`form-group ${!bankAccountPartnerError ? "" : "has-error"}`}>
                                    <label>
                                        Tài khoản nhận tiền của nhà cung cấp
                                        <span className="attention"> * </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={bankAccountPartner}
                                        onChange={this.handleBankAccountPartnerChange}
                                        placeholder="Ví dụ: 103098892890 - Vietinbank"
                                    />
                                    <ErrorLabel content={bankAccountPartnerError} />
                                </div>
                            </React.Fragment>
                        )}

                        <div className={`form-group`}>
                            <label>{"Dư nợ cần thanh toán"}</label>
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
                            <div className={`form-group ${!purchaseOrderError ? "" : "has-error"}`}>
                                <label>
                                    Đơn hàng còn dư nợ
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-payment-voucher-purchase-order`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={purchaseOrder}
                                    items={this.getPurchaseOrdersOptions()}
                                    onChange={this.handlePurchaseOrderChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={purchaseOrderError} />
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
                                {editPurchaseOrder ? (
                                    <React.Fragment>
                                        <button
                                            className="btn btn-success"
                                            onClick={this.handleCancelEditPaymentForPurchaseOrder}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Hủy chỉnh sửa
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            disabled={!this.isSubmitPaymentForPurchaseOrderValidate()}
                                            onClick={this.handleSaveEditPaymentForPurchaseOrdera}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Lưu
                                        </button>
                                    </React.Fragment>
                                ) : (
                                    <button
                                        className="btn btn-success"
                                        style={{ marginLeft: "10px" }}
                                        disabled={!this.isSubmitPaymentForPurchaseOrderValidate()}
                                        onClick={this.handleSubmitPaymentForPurchaseOrder}
                                    >
                                        {"Thêm"}
                                    </button>
                                )}
                            </div>

                            <table id={`payment-voucher-add-purchase-order`} className="table table-bordered not-sort">
                                <thead>
                                    <tr>
                                        <th title={"STT"}>STT</th>
                                        <th title={"Mã đơn"}>Mã đơn</th>
                                        <th title={"Tổng tiền"}>Tổng tiền</th>
                                        <th title={"Còn dư nợ"}>Tiền dư nợ</th>
                                        <th title={"Số tiền thanh toán"}>Số tiền thanh toán</th>
                                        <th title={"Đơn vị tính"}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.length !== 0 &&
                                        purchaseOrders.map((item, index) => {
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
                                                            onClick={() => this.handlePaymentForPurchaseOrderEdit(item, index)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                        <a
                                                            onClick={() => this.handleDeletePaymentForPurchaseOrder(item)}
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
                                    {purchaseOrders.length !== 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ fontWeight: 600 }}>
                                                <center>Tổng thanh toán</center>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>
                                                {formatCurrency(
                                                    purchaseOrders.reduce((accumulator, currentValue) => {
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
    const { purchaseOrders, bankAccounts } = state;
    const { customers } = state.crm;
    return { customers, purchaseOrders, bankAccounts };
}

const mapDispatchToProps = {
    createPayment: PaymentActions.createPayment,
    getPurchaseOrdersForPayment: PurchaseOrderActions.getPurchaseOrdersForPayment,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PaymentVoucherCreateForm));
