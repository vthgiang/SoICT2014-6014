import React, { Component } from 'react';
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DialogModal, ButtonModal, ErrorLabel } from "../../../../common-components";


class PurchaseOrderCreateForm extends Component {
  constructor(props) {
      super(props);
      this.state = {

      }
  }
  
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
    )
  }
}

export default connect(null, null)(withTranslate(PurchaseOrderCreateForm));