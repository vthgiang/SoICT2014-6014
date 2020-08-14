import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, ErrorLabel } from "../../../common-components";

import { orderActions } from "../redux/actions";

import { orderFormValidator } from "./orderFormValidator";

class OrderEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //Lấy thông tin chuyển đổi trạng thái cập nhật
  componentWillReceiveProps(nextProps) {
    if (nextProps.code) {
      this.setState({
        code: nextProps.code,
        quantity: nextProps.quantity,
        amount: nextProps.amount,
        errorOnOrderCode: undefined,
        errorOnOrderQuantity: undefined,
        errorOnOrderAmount: undefined,
      });
    }
  }

  //Lấy thông tin đơn hàng rồi đưa vào state
  componentWillMount = () => {
    if (!this.state.code) {
      this.setState({
        code: this.props.code,
        quantity: this.props.quantity,
        amount: this.props.amount,
        errorOnOrderCode: undefined,
        errorOnOrderQuantity: undefined,
        errorOnOrderAmount: undefined,
      });
    }
  };

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

    const changeFileldValidate =
      code.trim() !== this.props.code.trim() ||
      parseInt(quantity) !== this.props.quantity ||
      parseInt(amount) !== this.props.amount; //Phải có ít nhất 1 trường thay đổi giá trị

    let allFieldValidations =
      this.validateOrderCode(code, false) &&
      this.validateOrderQuantity(quantity, false) &&
      this.validateOrderAmount(amount, false) &&
      changeFileldValidate;

    return allFieldValidations;
  };

  save = () => {
    const { code, quantity, amount } = this.state;
    //props from store
    const { editOrder } = this.props;

    //Props from parent component
    const { idOrderEdit } = this.props;

    if (this.isFormValidated()) {
      editOrder(idOrderEdit, { code, quantity, amount });
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
        <DialogModal
          modalID={`modal-edit-order`}
          isLoading={order.isLoading}
          formID={`form-edit-order`}
          title={translate("manage_order.edit_title")}
          disableSubmit={!this.isFormValidated()}
          func={this.save}
          size={50}
          maxWidth={500}
        >
          <form id={`form-edit-order`}>
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
  editOrder: orderActions.editOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslate(OrderEditForm));
