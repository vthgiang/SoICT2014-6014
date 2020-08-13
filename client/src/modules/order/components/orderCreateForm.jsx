import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import {
  DialogModal,
  ButtonModal,
  ErrorLabel,
} from "../../../common-components";

import { orderActions } from "../redux/actions";
import { orderFormValidator } from "./orderFormValidator";

class OrderCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      quantity: null,
      amount: null,
    };
  }

  /**
   * Bắt sự kiện nhập vào mã đơn hàng
   * @param {*} e
   */
  handleOrderCodeChange = (e) => {
    const value = e.target.value;
    this.validateOrderCode(value, true);
  };

  /**
   * Bắt sự kiện nhập vào số lượng hàng hóa
   * @param {*} e
   */
  handleOrderQuantityChange = (e) => {
    const value = e.target.value;
    this.validateOrderQuantity(value, true);
  };

  /**
   * Bắt sự kiện nhập vào tổng tiền
   * @param {*} e
   */
  handleOrderAmountChange = (e) => {
    const value = e.target.value;
    this.validateOrderAmount(value, true);
  };

  /**
   * Kiểm tra định dạng đầu vào cho mã đơn hàng
   * @param {*} value
   * @param {*} willUpdateState
   */
  validateOrderCode = (value, willUpdateState = true) => {
    let msg = orderFormValidator.validateOrderCode(value);

    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          errorOnOrderCode: msg,
          code: value,
        };
      });
    }
    return msg === undefined;
  };

  /**
   * Kiểm tra định dạng đầu vào cho số lượng hàng hóa
   * @param {*} value
   * @param {*} willUpdateState
   */
  validateOrderQuantity = (value, willUpdateState = true) => {
    let msg = orderFormValidator.validateOrderQuantity(value);

    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          errorOnOrderQuantity: msg,
          quantity: value,
        };
      });
    }
    return msg === undefined;
  };

  /**
   * Kiểm tra định dạng đầu vào cho tổng tiền đơn hàng
   * @param {*} value
   * @param {*} willUpdateState
   */
  validateOrderAmount = (value, willUpdateState = true) => {
    let msg = orderFormValidator.validateOrderAmount(value);

    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          errorOnOrderAmount: msg,
          amount: value,
        };
      });
    }
    return msg === undefined;
  };

  /**
   * Kiểm tra định dạng đầu vào toàn bộ các trường
   */
  isFormValidated = () => {
    const { code, quantity, amount } = this.state;

    let allFieldValidations =
      this.validateOrderCode(code, false) &&
      this.validateOrderQuantity(quantity, false) &&
      this.validateOrderAmount(amount, false);

    return allFieldValidations;
  };

  save = () => {
    const { code, quantity, amount } = this.state;
    const { createNewOrder } = this.props;

    if (this.isFormValidated()) {
      createNewOrder({ code, quantity, amount });

      this.setState({
        code: "",
        quantity: null,
        amount: null,
      });
    }
  };

  render() {
    const { translate, order } = this.props;
    const {
      errorOnOrderCode,
      errorOnOrderQuantity,
      errorOnOrderAmount,
      code,
      quantity,
      amount,
    } = this.state;
    return (
      <React.Fragment>
        <ButtonModal
          modalID="modal-create-order"
          button_name={translate("manage_order.add_order")}
          title={translate("manage_order.add_new_title")}
        />

        <DialogModal
          modalID="modal-create-order"
          isLoading={order.isLoading}
          formID="form-create-order"
          title={translate("manage_order.add_title")}
          msg_success={translate("manage_order.add_success")}
          msg_faile={translate("manage_order.add_failure")}
          func={this.save}
          disableSubmit={!this.isFormValidated()}
          size={50}
          maxWidth={500}
        >
          <form
            id="form-create-order"
            onSubmit={() => this.save(translate("manage_order.add_success"))}
          >
            <div
              className={`form-group ${!errorOnOrderCode ? "" : "has-error"}`}
            >
              <label>
                {translate("manage_order.code")}
                <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={code}
                onChange={this.handleOrderCodeChange}
                placeholder={`${translate("manage_order.code_placeholder")}`}
              />
              <ErrorLabel content={errorOnOrderCode} />
            </div>

            <div
              className={`form-group ${
                !errorOnOrderQuantity ? "" : "has-error"
              }`}
            >
              <label>
                {translate("manage_order.quantity")}
                <span className="text-red">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={this.handleOrderQuantityChange}
              />
              <ErrorLabel content={errorOnOrderQuantity} />
            </div>

            <div
              className={`form-group ${!errorOnOrderAmount ? "" : "has-error"}`}
            >
              <label>
                {translate("manage_order.amount")}
                <span className="text-red">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={this.handleOrderAmountChange}
              />
              <ErrorLabel content={errorOnOrderAmount} />
            </div>
          </form>
        </DialogModal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { order } = state;
  return { order };
}

const mapDispatchToProps = {
  createNewOrder: orderActions.createNewOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslate(OrderCreateForm));
