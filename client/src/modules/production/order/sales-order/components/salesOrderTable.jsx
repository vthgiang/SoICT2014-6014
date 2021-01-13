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
import { PaymentActions } from "../../payment/redux/actions";

import { BillActions } from "../../../warehouse/bill-management/redux/actions";
import { StockActions } from "../../../warehouse/stock-management/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
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
import GoodIssueCreateForm from "../../../warehouse/bill-management/components/good-issues/goodIssueCreateForm";
import BillDetailForm from "../../../warehouse/bill-management/components/genaral/billDetailForm";

class SalesOrderTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            page: 1,
            limit: 5,
            code: "",
            status: null,
            salesOrderDetail: {},
        };
    }

    componentDidMount = () => {
        const { page, limit, currentRole } = this.state;
        this.props.getAllSalesOrders({ page, limit });
        this.props.getDiscountForOrderValue();
        this.props.getCustomers();
        this.props.getAllDepartments();
        this.props.getAllRoles();

        //Create bill
        this.props.getAllStocks({ managementLocation: currentRole });
        this.props.getUser();
        this.props.getGoodsByType({ type: "product" });
    };

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, code: generateCode("SO_") };
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

    handleSubmitSearch = () => {
        let { limit, page, code, status, customer } = this.state;
        const data = {
            limit,
            page,
            code,
            status,
            customer,
        };
        this.props.getAllSalesOrders(data);
    };

    handleShowDetailInfo = async (data) => {
        await this.props.getPaymentForOrder({ orderId: data._id, orderType: 1 });
        await this.setState((state) => {
            return {
                ...state,
                salesOrderDetail: data,
            };
        });
        await window.$("#modal-detail-sales-order").modal("show");
    };

    reloadSalesOrderTable = () => {
        let { limit, page, code, status, customer } = this.state;
        const data = {
            limit,
            page,
            code,
            status,
            customer,
        };
        this.props.getAllSalesOrders(data);
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

    handleAddBill = async (salesOrderAddBill) => {
        await this.setState((state) => {
            return {
                ...state,
                salesOrderAddBill,
                billCode: generateCode("BIIS"),
            };
        });
        window.$("#modal-create-bill-issue").modal("show");
    };

    handleShowBillDetail = async (billId) => {
        await this.props.getDetailBill(billId);
        window.$("#modal-detail-bill").modal("show");
    };

    createDirectly = () => {
        window.$("#modal-add-sales-order").modal("show");
    };

    createFromQuote = () => {
        this.props.getQuotesToMakeOrder();

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
        let { limit, salesOrderDetail, salesOrderEdit, code, salesOrderAddBill, billCode } = this.state;
        const { translate, salesOrders } = this.props;
        const { totalPages, page } = salesOrders;

        let listSalesOrders = [];
        if (salesOrders.isLoading === false) {
            listSalesOrders = salesOrders.listSalesOrders;
        }

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
                className: "text-dark",
                text: "Yêu cầu xuất kho",
            },
            {
                className: "text-secondary",
                text: "Đang giao hàng",
            },
            {
                className: "text-success",
                text: "Đã giao hàng",
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
                        <GoodIssueCreateForm
                            salesOrderAddBill={salesOrderAddBill}
                            createdSource={"salesOrder"}
                            billCode={billCode}
                            modalName={`Lập phiếu yêu cầu xuất kho cho đơn hàng: ${salesOrderAddBill ? salesOrderAddBill.code : ""}`}
                            reloadSalesOrderTable={this.reloadSalesOrderTable}
                            group={"2"}
                        />
                        <BillDetailForm />
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
                                            value: 1,
                                            text: "Chờ phê duyệt",
                                        },
                                        {
                                            value: 2,
                                            text: "Yêu cầu sản xuất",
                                        },
                                        {
                                            value: 3,
                                            text: "Yêu cầu xuất kho",
                                        },
                                        {
                                            value: 4,
                                            text: "Đang giao hàng",
                                        },
                                        {
                                            value: 5,
                                            text: "Đã giao hàng",
                                        },
                                        {
                                            value: 6,
                                            text: "Hủy đơn",
                                        },
                                    ]}
                                    multiple="multiple"
                                    options={{ nonSelectedText: "Chọn trạng thái đơn", allSelectedText: "Đã chọn tất cả" }}
                                    onChange={this.handleStatusChange}
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
                                                    {!item.bill ? (
                                                        <a
                                                            onClick={() => this.handleAddBill(item)}
                                                            className="add text-success"
                                                            style={{ width: "5px" }}
                                                            title="Yêu cầu xuất kho"
                                                        >
                                                            <i className="material-icons">add</i>
                                                        </a>
                                                    ) : (
                                                        <a
                                                            onClick={() => this.handleShowBillDetail(item.bill)}
                                                            className="add text-success"
                                                            style={{ width: "5px" }}
                                                            title="Yêu cầu xuất kho"
                                                        >
                                                            <i className="material-icons">remove_red_eye</i>
                                                        </a>
                                                    )}
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
    getPaymentForOrder: PaymentActions.getPaymentForOrder,
    getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
    getCustomers: CrmCustomerActions.getCustomers,
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
    getQuotesToMakeOrder: QuoteActions.getQuotesToMakeOrder,

    getBillsByType: BillActions.getBillsByType,
    getDetailBill: BillActions.getDetailBill,
    getAllStocks: StockActions.getAllStocks,
    getUser: UserActions.get,
    getGoodsByType: GoodActions.getGoodsByType,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderTable));
