import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { orderActions } from "../redux/actions";
import { UserActions } from "../../super-admin/user/redux/actions";
import OrderCreateForm from "./orderCreateForm";
import OrderEditForm from "./orderEditForm";

import {
  PaginateBar,
  DataTableSetting,
  DeleteNotification,
} from "../../../common-components";

class ManageOrderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      quantity: null,
      amount: null,
      page: 0,
      limit: 5,
    };
  }

  componentDidMount() {
    let { code, page, limit } = this.state;

    this.props.getAllOrders({ code, page, limit });
  }

  setLimit = async (limitNumber) => {
    let { code, page } = this.state;
    let { getAllOrders } = this.props;

    await this.setState({
      limit: parseInt(limitNumber),
    });

    getAllOrders({ code, page, limit: limitNumber });
  };

  setPage = async (pageNumber) => {
    let { code, limit } = this.state;
    let { getAllOrders } = this.props;

    const currentPage = (pageNumber - 1) * this.state.limit;

    await this.setState({
      page: parseInt(currentPage),
    });

    getAllOrders({ code, page: currentPage, limit });
  };

  handleEdit = async (order) => {
    await this.setState((state) => {
      return {
        ...state,
        orderEditState: order,
      };
    });
    window.$("#modal-edit-order").modal("show");
  };

  handleOrderCodeChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmitSearch = () => {
    let { code, page, limit } = this.state;
    const { getAllOrders } = this.props;

    getAllOrders({ code, page, limit });
  };

  render() {
    const { order, translate } = this.props;
    const { limit } = this.state;

    let list = "";
    let totalPages = 0;

    if (order.list) {
      list = order.list.data;
      totalPages =
        order.list.totalList % limit === 0
          ? parseInt(order.list.totalList / limit)
          : parseInt(order.list.totalList / limit + 1);
    }
    let page = parseInt(this.state.page / limit + 1);

    return (
      <React.Fragment>
        {this.state.orderEditState && (
          <OrderEditForm
            idOrderEdit={this.state.orderEditState._id}
            code={this.state.orderEditState.code}
            quantity={this.state.orderEditState.quantity}
            amount={this.state.orderEditState.amount}
          />
        )}
        <div className="box-body qlcv">
          <OrderCreateForm />

          <div className="form-inline">
            <div className="form-group">
              <label className="form-control-static">
                {translate("manage_order.code")}
              </label>
              <input
                type="text"
                className="form-control"
                name="code"
                onChange={this.handleOrderCodeChange}
                placeholder={translate("manage_order.code")}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn btn-success"
                title="Tìm kiếm"
                onClick={this.handleSubmitSearch}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
          <table
            id="order-table"
            className="table table-striped table-bordered table-hover"
          >
            <thead>
              <tr>
                <th>{translate("manage_order.index")}</th>
                <th>{translate("manage_order.code")}</th>
                <th>{translate("manage_order.quantity")}</th>
                <th>{translate("manage_order.amount")}</th>
                <th style={{ width: "120px", textAlign: "center" }}>
                  {translate("table.action")}
                  <DataTableSetting
                    tableId="order-table"
                    columnArr={[
                      translate("manage_order.index"),
                      translate("manage_order.code"),
                      translate("manage_order.quantity"),
                      translate("manage_order.amount"),
                    ]}
                    limit={limit}
                    setLimit={this.setLimit}
                    hideColumnOption={true}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof list !== "undefined" &&
                list.length !== 0 &&
                list.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (page - 1) * limit}</td>
                    <td>{item.code}</td>
                    <td>{item.quantity}</td>
                    <td>{item.amount}</td>
                    <td style={{ textAlign: "center" }}>
                      <a
                        onClick={() => this.handleEdit(item)}
                        className="edit text-yellow"
                        style={{ width: "5px" }}
                        title={translate("manage_order.edit_order")}
                      >
                        <i className="material-icons">edit</i>
                      </a>
                      <DeleteNotification
                        content={translate("manage_order.delete_order")}
                        data={{
                          id: item._id,
                          info: item.code,
                        }}
                        func={this.props.deleteOrder}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {order.isLoading ? (
            <div className="table-info-panel">
              {translate("confirm.loading")}
            </div>
          ) : (
            (typeof list === "undefined" || list.length === 0) && (
              <div className="table-info-panel">
                {translate("confirm.no_data")}
              </div>
            )
          )}
          <PaginateBar
            pageTotal={totalPages ? totalPages : 0}
            currentPage={page}
            func={this.setPage}
          />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { order } = state;
  return { order };
}

const mapDispatchToProps = {
  getAllOrders: orderActions.getAllOrders,
  createNewOrder: orderActions.createNewOrder,
  deleteOrder: orderActions.deleteOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslate(ManageOrderTable));
