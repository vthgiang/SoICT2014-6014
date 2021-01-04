import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { SalesOrderActions } from "../redux/actions";
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import { DialogModal, SelectBox, ErrorLabel } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import SalesOrderCreateGood from "./createSalesOrder/salesOrderCreateGood";
import SalesOrderCreateInfo from "./createSalesOrder/salesOrderCreateInfo";
import SalesOrderCreatePayment from "./createSalesOrder/salesOrderCreatePayment";
import SlasOfGoodDetail from "./createSalesOrder/viewDetailOnCreate/slasOfGoodDetail";
import DiscountOfGoodDetail from "./createSalesOrder/viewDetailOnCreate/discountOfGoodDetail";

class SalesOrderCreateFormFromQuote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: generateCode("SALES_ORDER_"),
        };
    }

    getQuoteOptions = () => {
        let options = [];

        const { quotesToMakeOrder } = this.props.quotes;
        if (quotesToMakeOrder) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn báo giá---",
                },
            ];

            let mapOptions = quotesToMakeOrder.map((item) => {
                return {
                    value: item._id,
                    text: item.code,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    validateQuote = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được bỏ trống!";
        } else if (value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    quoteError: msg,
                };
            });
        }
        return msg;
    };

    handleQuoteChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                quote: value[0],
            };
        });

        this.validateQuote(value[0], true);
    };

    validatePriority = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (value === "title") {
            msg = "Giá trị không được để trống";
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    priorityError: msg,
                };
            });
        }
        return msg;
    };

    handlePriorityChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                priority: value[0],
            };
        });
        this.validatePriority(value[0], true);
    };

    isFormValidated = () => {
        let { priority, quote } = this.state;

        if (this.validateQuote(quote, false) || this.validatePriority(priority, false)) {
            return false;
        } else {
            return true;
        }
    };

    save = async () => {
        if (this.isFormValidated()) {
            let { priority, code, quote } = this.state;

            const { quotesToMakeOrder } = this.props.quotes;
            let quoteInfo = quotesToMakeOrder.find((element) => element._id === quote);

            let data = {
                code,
                quote,
                priority,
                customer: quoteInfo.customer,
                customerPhone: quoteInfo.customerPhone,
                customerAddress: quoteInfo.customerAddress,
                customerRepresent: quoteInfo.customerRepresent,
                customerEmail: quoteInfo.customerEmail,
                goods: quoteInfo.goods,
                discounts: quoteInfo.discounts,
                shippingFee: quoteInfo.shippingFee,
                deliveryTime: quoteInfo.deliveryTime,
                coin: quoteInfo.coin,
                paymentAmount: quoteInfo.paymentAmount,
                note: quoteInfo.note,
            };

            await this.props.createNewSalesOrder(data);

            this.setState((state) => {
                return {
                    ...state,
                    priority: "",
                    code: "",
                    quote: "",
                };
            });
        }
    };

    render() {
        const { quote, priority, code } = this.state;
        const { quoteError, priorityError } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-add-sales-order-from-quote`}
                    isLoading={false}
                    formID={`form-add-sales-order-from-quote`}
                    title={"Đơn hàng mới"}
                    msg_success={"Thêm đơn thành công"}
                    msg_faile={"Thêm đơn không thành công"}
                    size="50"
                    style={{ backgroundColor: "green" }}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                >
                    <div className="form-group">
                        <label>
                            Mã đơn
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" className="form-control" value={code} disabled={true} />
                    </div>
                    <div className={`form-group ${!quoteError ? "" : "has-error"}`}>
                        <label>
                            Mã báo giá
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-create-sales-order-from-quote`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={quote}
                            items={this.getQuoteOptions()}
                            onChange={this.handleQuoteChange}
                            multiple={false}
                        />
                        <ErrorLabel content={quoteError} />
                    </div>

                    <div className={`form-group ${!priorityError ? "" : "has-error"}`}>
                        <label>
                            Độ ưu tiên
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-create-sales-order-priority-from-quote`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={priority}
                            items={[
                                { value: "title", text: "---Chọn độ ưu tiên---" },
                                { value: 1, text: "Thấp" },
                                { value: 2, text: "Trung bình" },
                                { value: 3, text: "Cao" },
                                { value: 4, text: "Đặc biệt" },
                            ]}
                            onChange={this.handlePriorityChange}
                            multiple={false}
                        />
                        <ErrorLabel content={priorityError} />
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { quotes } = state;
    return { quotes };
}

const mapDispatchToProps = {
    createNewSalesOrder: SalesOrderActions.createNewSalesOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderCreateFormFromQuote));
