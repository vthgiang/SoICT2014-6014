import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { PaymentActions } from "../../redux/actions";
import { PurchaseOrderActions } from "../../../purchase-order/redux/actions";
import ValidationHelper from "../../../../../../helpers/validationHelper";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";

function PaymentVoucherCreateForm(props) {

    const [state, setState] = useState({
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
    })

    const getSupplierOptions = () => {
        let options = [];

        const { list } = props.customers;
        if (list) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn nhà cung cấp---",
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

    const getPurchaseOrdersOptions = () => {
        let options = [];

        const { purchaseOrdersForPayment } = props.purchaseOrders;
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

    const getBankAccountOptions = () => {
        let options = [];

        const { listBankAccounts } = props.bankAccounts;
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

    const validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                supplierError: msg,
            });
        }

        return msg;
    };

    const handleSupplierChange = async (value) => {
        setState({
            ...state,
            supplier: value[0],
            money: "",
            purchaseOrder: "title",
            purchaseOrders: [],
            paymentType: "title",
            bankAccountReceived: "title",
        });

        validateSupplier(value[0]);

        //Lấy các đơn hàng chưa thanh toán của khách hàng
        if (value[0] !== "title") {
            await props.getPurchaseOrdersForPayment(value[0], true);
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
                bankAccountPaid: "",
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

    const validateBankAccountPartner = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                bbankAccountPartnerError: msg,
            });
        }

        return msg;
    };

    const handleBankAccountPartnerChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            bankAccountPartner: value,
        });
        validateBankAccountPartner(value, true);
    };

    const validatePurchaseOrder = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                purchaseOrderError: msg,
            });
        }

        return msg;
    };

    const getMoneyForPayment = (purchaseOrderId) => {
        const { purchaseOrdersForPayment } = props.purchaseOrders;
        let purchaseOrderInfo = purchaseOrdersForPayment.find((element) => element._id === purchaseOrderId);

        const { totalMoney, purchaseOrders, indexEditting } = state;
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
    const validateCompareTotalMoney = () => {
        const { totalMoney, purchaseOrders } = state;
        let moneyAdded = 0;
        for (let index = 0; index < purchaseOrders.length; index++) {
            moneyAdded += purchaseOrders[index].money;
        }

        return parseInt(moneyAdded) === parseInt(totalMoney);
    };

    const handlePurchaseOrderChange = (value) => {
        if (value[0] !== "title") {
            const { purchaseOrdersForPayment } = props.purchaseOrders;
            let purchaseOrderInfo = purchaseOrdersForPayment.find((element) => element._id === value[0]);
            let money = getMoneyForPayment(value[0]);
            setState({
                ...state,
                //Lưu thông tin tạm thời của sales order vào state
                purchaseOrder: value[0],
                code: purchaseOrderInfo.code,
                paymentAmount: purchaseOrderInfo.paymentAmount,
                paid: purchaseOrderInfo.paid,
                money,
            });
        } else {
            setState({
                ...state,
                purchaseOrder: value[0],
            });
        }
        validatePurchaseOrder(value[0], true);
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
        console.log(state.money);
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
            purchaseOrder: "title",
            money: 0,
        });
        validateTotalMoney(value, true);
    };

    const isSubmitPaymentForPurchaseOrderValidate = () => {
        let { purchaseOrder, money } = state;
        if (validatePurchaseOrder(purchaseOrder, false) || validateMoney(money, false)) {
            return false;
        }

        return true;
    };

    const handleSubmitPaymentForPurchaseOrder = () => {
        if (isSubmitPaymentForPurchaseOrderValidate) {
            let { purchaseOrder, money, purchaseOrders, code, paymentAmount, paid } = state;

            let data = {
                purchaseOrder,
                money,
                code,
                paymentAmount,
                paid,
            };

            purchaseOrders.push(data);
            setState((state) => {
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

    const handlePaymentForPurchaseOrderEdit = async (item, index) => {
        await setState({
            ...state,
            editPurchaseOrder: true,
            indexEditting: index,
            purchaseOrder: item.purchaseOrder,
            code: item.code,
            paymentAmount: item.paymentAmount,
            paid: item.paid,
        });

        let money = await getMoneyForPayment(item.purchaseOrder);
        await setState({
            ...state,
            money,
        });
    };

    const handleSaveEditPaymentForPurchaseOrder = () => {
        if (isSubmitPaymentForPurchaseOrderValidate) {
            let { purchaseOrder, money, purchaseOrders, code, paymentAmount, paid, indexEditting, editPurchaseOrder } = state;

            let data = {
                purchaseOrder,
                money,
                code,
                paymentAmount,
                paid,
            };

            purchaseOrders[indexEditting] = data;

            setState((state) => {
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

    const handleCancelEditPaymentForPurchaseOrder = () => {
        setState((state) => {
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

    const handleDeletePaymentForPurchaseOrder = (item) => {
        let { purchaseOrders } = state;

        let purchaseOrdersFilter = purchaseOrders.filter((element) => element.purchaseOrder !== item.purchaseOrder);
        setState({
            ...state,
            purchaseOrders: purchaseOrdersFilter,
        });
    };

    const isFormValidated = () => {
        let { supplier, paymentType, bankAccountReceived, bankAccountPartner, purchaseOrders } = state;
        if (
            validateSupplier(supplier, false) ||
            validatePaymentType(paymentType, false) ||
            !validateCompareTotalMoney() ||
            !purchaseOrders.length
        ) {
            return false;
        }

        if (
            parseInt(paymentType) === 2 &&
            (validateBankAccountReceived(bankAccountReceived, false) || validateBankAccountPartner(bankAccountPartner, false))
        ) {
            return false;
        }

        return true;
    };

    const getPurchaseOrderForSubmit = async (purchaseOrders) => {
        let purchaseOrdersMap = await purchaseOrders.map((item) => {
            return {
                purchaseOrder: item.purchaseOrder,
                money: item.money,
            };
        });

        return purchaseOrdersMap;
    };

    const save = async () => {
        if (isFormValidated()) {
            let { supplier, paymentType, bankAccountReceived, bankAccountPartner, purchaseOrders, PaymentVoucherCode } = state;
            // console.log({ supplier, paymentType, bankAccountReceived, bankAccountPartner, purchaseOrders, PaymentVoucherCode } );
            let data = {
                code: PaymentVoucherCode,
                supplier,
                paymentType,
                bankAccountReceived: bankAccountReceived !== "" ? bankAccountReceived : undefined,
                bankAccountPartner: bankAccountPartner !== "" ? bankAccountPartner : undefined,
                purchaseOrders: await getPurchaseOrderForSubmit(purchaseOrders),
                type: 2, //Phiếu chi tiền mua nguyên vật liệu
            };

            await props.createPayment(data);
            await setState({
                ...state,
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

    const handleClickCreateCode = () => {
        setState((state) => {
            return { ...state, PaymentVoucherCode: generateCode("PV_") };
        });
    };

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
    } = state;

    let debt = 0;
    const { purchaseOrdersForPayment } = props.purchaseOrders;
    if (purchaseOrdersForPayment && purchaseOrdersForPayment.length) {
        for (let index = 0; index < purchaseOrdersForPayment.length; index++) {
            debt += purchaseOrdersForPayment[index].paymentAmount - purchaseOrdersForPayment[index].paid;
        }
    }

    return (
        <React.Fragment>
            <ButtonModal
                onButtonCallBack={handleClickCreateCode}
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
                disableSubmit={!isFormValidated()}
                func={save}
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
                            items={getSupplierOptions()}
                            onChange={handleSupplierChange}
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
                            onChange={handlePaymentTypeChange}
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
                                    items={getBankAccountOptions()}
                                    onChange={handleBankAccountReceivedChange}
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
                                    onChange={handleBankAccountPartnerChange}
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
                        <input type="number" className="form-control" value={totalMoney} onChange={handleTotalMoneyChange} />
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
                                items={getPurchaseOrdersOptions()}
                                onChange={handlePurchaseOrderChange}
                                multiple={false}
                            />
                            <ErrorLabel content={purchaseOrderError} />
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
                            {editPurchaseOrder ? (
                                <React.Fragment>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleCancelEditPaymentForPurchaseOrder}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Hủy chỉnh sửa
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        disabled={!isSubmitPaymentForPurchaseOrderValidate()}
                                        onClick={handleSaveEditPaymentForPurchaseOrder}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Lưu
                                    </button>
                                </React.Fragment>
                            ) : (
                                <button
                                    className="btn btn-success"
                                    style={{ marginLeft: "10px" }}
                                    disabled={!isSubmitPaymentForPurchaseOrderValidate()}
                                    onClick={handleSubmitPaymentForPurchaseOrder}
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
                                                        onClick={() => handlePaymentForPurchaseOrderEdit(item, index)}
                                                    >
                                                        <i className="material-icons">edit</i>
                                                    </a>
                                                    <a
                                                        onClick={() => handleDeletePaymentForPurchaseOrder(item)}
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
    const { purchaseOrders, bankAccounts } = state;
    const { customers } = state.crm;
    return { customers, purchaseOrders, bankAccounts };
}

const mapDispatchToProps = {
    createPayment: PaymentActions.createPayment,
    getPurchaseOrdersForPayment: PurchaseOrderActions.getPurchaseOrdersForPayment,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PaymentVoucherCreateForm));
