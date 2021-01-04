import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
//Actions
import { SalesOrderActions } from "../redux/actions";
import { DiscountActions } from "../../discount/redux/actions";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { DepartmentActions } from "../../../../super-admin/organizational-unit/redux/actions";
import { RoleActions } from "../../../../super-admin/role/redux/actions";
import { QuoteActions } from "../../quote/redux/actions";
//Helper Function
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../helpers/formatDate";
import { generateCode } from "../../../../../helpers/generateCode";
//Components Import
import { PaginateBar, DataTableSetting, SelectMulti, SelectBox, DeleteNotification } from "../../../../../common-components";
import SalesOrderDetailForm from "./salesOrderDetailForm";
import SalesOrderCreateForm from "./salesOrderCreateForm";
import SalesOrderCreateFormFromQuote from "./salesOrderCreateFormFromQuote";
import SalesOrderEditForm from "./salesOrderEditForm";

class SalesOrderTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: "",
            status: null,
            salesOrderDetail: {},
        };
    }

    componentDidMount = () => {
        const { page, limit } = this.state;
        this.props.getAllSalesOrders({ page, limit });
        this.props.getDiscountForOrderValue();
        this.props.getCustomers();
        this.props.getAllDepartments();
        this.props.getAllRoles();
        this.props.getQuotesToMakeOrder();
    };

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, code: generateCode("SALES_ORDER_") };
        });
    };

    setPage = async (page) => {
        await this.setState({
            page: page,
        });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getAllSalesOrders(data);
    };

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page: this.state.page,
        };
        this.props.getAllSalesOrders(data);
    };

    handleStatusChange = (value) => {
        this.setState({
            status: value,
        });
    };

    handleOrderCodeChange = (e) => {
        let { value } = e.target;
        this.setState({
            code: value,
        });
    };

    handleCustomerSearchChange = (value) => {
        //Tìm kiếm theo khách hàng
        this.setState({
            customer: value,
        });
    };
    handleQueryDateChange = (value) => {
        this.setState({
            queryDate: value[0],
        });
    };

    handleSubmitSearch = () => {
        let { limit, page, code, status, customer, queryDate } = this.state;
        const data = {
            limit,
            page,
            code,
            status,
            customer,
            queryDate,
        };
        this.props.getAllSalesOrders(data);
    };

    handleShowDetailInfo = (data) => {
        this.setState((state) => {
            return {
                ...state,
                salesOrderDetail: data,
            };
        });
        window.$("#modal-detail-sales-order").modal("show");
    };

    handleCreate = () => {
        window.$("#modal-add-sales-order").modal("show");
    };

    handleEditSalesOrder = async (salesOrderEdit) => {
        await this.setState((state) => {
            return {
                ...state,
                salesOrderEdit,
            };
        });
        window.$("#modal-edit-sales-order").modal("show");
    };

    createDirectly = () => {
        window.$("#modal-add-sales-order").modal("show");
    };

    createFromQuote = () => {
        window.$("#modal-add-sales-order-from-quote").modal("show");
    };

    // checkHasComponent = (name) => {
    //     let { auth } = this.props;
    //     let result = false;
    //     auth.components.forEach(component => {
    //         if (component.name === name) result = true;
    //     });

    //     return result;
    // }

    render() {
        let { limit, salesOrderDetail, salesOrderEdit, code } = this.state;
        const { translate, salesOrders } = this.props;
        const { totalPages, page } = salesOrders;

        let listSalesOrders = [];
        if (salesOrders.isLoading === false) {
            listSalesOrders = salesOrders.listSalesOrders;
        }

        console.log("listSalesOrders", listSalesOrders);

        const dataStatus = [
            {
                className: "text-primary",
                text: "no status",
            },
            {
                className: "text-primary",
                text: "Chờ phê duyệt",
            },
            {
                className: "text-warning",
                text: "Yêu cầu sản xuất",
            },
            {
                className: "text-success",
                text: "Sẵn hàng trong kho",
            },
            {
                className: "text-danger",
                text: "Đã hủy",
            },
        ];

        const dataPriority = [
            {
                className: "text-primary",
                text: "default",
            },
            {
                className: "text-muted",
                text: "Thấp",
            },
            {
                className: "text-primary",
                text: "Trung bình",
            },
            {
                className: "text-success",
                text: "Cao",
            },
            {
                className: "text-danger",
                text: "Đặc biệt",
            },
        ];

        const { department, role, auth } = this.props;

        console.log("auth", auth);

        return (
            <React.Fragment>
                <div className="nav-tabs-custom">
                    <div className="box-body qlcv">
                        <div className="form-inline">
                            {/*Chọn cách thêm đơn hàng*/}
                            {/* Button dropdown thêm mới đơn bán hàng */}
                            <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                                <button
                                    type="button"
                                    className="btn btn-success dropdown-toggle pull-right"
                                    data-toggle="dropdown"
                                    aria-expanded="true"
                                    title={"Đơn hàng mới"}
                                    onClick={this.handleClickCreateCode}
                                >
                                    Thêm đơn hàng
                                </button>
                                <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                    <li>
                                        <a style={{ cursor: "pointer" }} title={`Tạo từ báo giá`} onClick={this.createFromQuote}>
                                            Thêm từ báo giá
                                        </a>
                                    </li>
                                    <li>
                                        <a style={{ cursor: "pointer" }} title={`Tạo trực tiếp`} onClick={this.createDirectly}>
                                            Thêm trực tiếp
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <SalesOrderCreateForm code={code} />
                        <SalesOrderCreateFormFromQuote code={code} />
                        <SalesOrderDetailForm salesOrderDetail={salesOrderDetail} />
                        {salesOrderEdit && <SalesOrderEditForm salesOrderEdit={salesOrderEdit} />}
                        <div className="form-inline">
                            <div className="form-group">
                                <label className="form-control-static">Mã đơn</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    onChange={this.handleOrderCodeChange}
                                    placeholder="Nhập vào mã đơn"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">Khách hàng</label>
                                <SelectMulti
                                    id={`selectMulti-filter-customer-sales-order`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        this.props.customers.list
                                            ? this.props.customers.list.map((customerItem) => {
                                                  return {
                                                      value: customerItem._id,
                                                      text: customerItem.name,
                                                  };
                                              })
                                            : []
                                    }
                                    multiple="multiple"
                                    options={{ nonSelectedText: "Chọn khách hàng", allSelectedText: "Đã chọn tất cả" }}
                                    onChange={this.handleCustomerSearchChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">Trạng thái đơn</label>

                                <SelectMulti
                                    id={`selectMulti-filter-status-sales-order`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        {
                                            value: 0,
                                            text: "Chờ phê duyệt",
                                        },
                                        {
                                            value: 1,
                                            text: "Đã duyệt",
                                        },
                                        {
                                            value: 2,
                                            text: "Đã chốt đơn",
                                        },
                                        {
                                            value: 3,
                                            text: "Hủy đơn",
                                        },
                                    ]}
                                    multiple="multiple"
                                    options={{ nonSelectedText: "Chọn trạng thái đơn", allSelectedText: "Đã chọn tất cả" }}
                                    onChange={this.handleStatusChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">Thời hạn áp dụng</label>
                                <SelectBox
                                    id={`select-filter-status-discounts`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: "effective", text: "Đang hiệu lực" },
                                        { value: "expire", text: "Đã quá hạn" },
                                        { value: "all", text: "Tất cả" },
                                    ]}
                                    onChange={this.handleQueryDateChange}
                                />
                            </div>

                            <div className="form-group">
                                <button type="button" className="btn btn-success" title="Lọc" onClick={this.handleSubmitSearch}>
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                        <table id={`sales-order-table`} className="table table-striped table-bordered table-hover" style={{ marginTop: 20 }}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã đơn</th>
                                    <th>Người tạo</th>
                                    <th>Khách hàng</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Độ ưu tiên</th>
                                    <th>T/g giao hàng dự kiến</th>
                                    <th
                                        style={{
                                            width: "120px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {translate("table.action")}
                                        <DataTableSetting
                                            tableId="manufacturing-works-table"
                                            columnArr={[
                                                "Số thứ tự",
                                                "Mã đơn",
                                                "Người tạo",
                                                "Khách hàng",
                                                "Ngày có hiệu lực",
                                                "Ngày hết hiệu lực",
                                                "Tổng tiền (vnđ)",
                                                "Trạng thái",
                                            ]}
                                            limit={this.state.limit}
                                            hideColumnOption={true}
                                            setLimit={this.setLimit}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {typeof listSalesOrders !== "undefined" &&
                                    listSalesOrders.length !== 0 &&
                                    listSalesOrders.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1 + (page - 1) * limit}</td>
                                            <td>{item.code ? item.code : ""}</td>
                                            <td>{item.creator ? item.creator.name : ""}</td>
                                            <td>{item.customer ? item.customer.name : ""}</td>
                                            <td>{item.paymentAmount ? formatCurrency(item.paymentAmount) : "---"}</td>
                                            <td className={dataStatus[item.status].className}>{dataStatus[item.status].text}</td>
                                            <td className={dataPriority[item.priority].className}>{dataPriority[item.priority].text}</td>
                                            <td>{item.deliveryTime ? formatDate(item.deliveryTime) : "---"}</td>
                                            {item.status === -1 ? (
                                                <td>
                                                    <a onClick={this.handleCreate}>
                                                        <i className="fa fa-plus-square text-primary"></i>
                                                    </a>
                                                </td>
                                            ) : (
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <a onClick={() => this.handleShowDetailInfo(item)}>
                                                        <i className="material-icons">view_list</i>
                                                    </a>
                                                    <a
                                                        onClick={() => this.handleEditSalesOrder(item)}
                                                        className="edit text-yellow"
                                                        style={{ width: "5px" }}
                                                        title="Sửa đơn"
                                                    >
                                                        <i className="material-icons">edit</i>
                                                    </a>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {salesOrders.isLoading ? (
                            <div className="table-info-panel">{translate("confirm.loading")}</div>
                        ) : (
                            (typeof listSalesOrders === "undefined" || listSalesOrders.length === 0) && (
                                <div className="table-info-panel">{translate("confirm.no_data")}</div>
                            )
                        )}
                        <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    const { salesOrders, department, role, auth } = state;
    return { salesOrders, customers, department, role, auth };
}

const mapDispatchToProps = {
    getAllSalesOrders: SalesOrderActions.getAllSalesOrders,
    getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
    getCustomers: CrmCustomerActions.getCustomers,
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
    getQuotesToMakeOrder: QuoteActions.getQuotesToMakeOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderTable));
