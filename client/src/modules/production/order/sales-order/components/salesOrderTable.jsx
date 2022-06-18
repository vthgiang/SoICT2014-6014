import React, { Component, useEffect, useState } from "react";
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
import { BusinessDepartmentActions } from "../../business-department/redux/actions";

import { BillActions } from "../../../warehouse/bill-management/redux/actions";
import { StockActions } from "../../../warehouse/stock-management/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { LotActions } from "../../../warehouse/inventory-management/redux/actions";

//Helper Function
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../helpers/formatDate";
import { generateCode } from "../../../../../helpers/generateCode";
//Components Import
import { PaginateBar, DataTableSetting, SelectMulti, SelectBox, DeleteNotification, ConfirmNotification } from "../../../../../common-components";
import SalesOrderDetailForm from "./salesOrderDetailForm";
import SalesOrderCreateForm from "./salesOrderCreateForm";
import SalesOrderCreateFormFromQuote from "./salesOrderCreateFormFromQuote";
import SalesOrderEditForm from "./salesOrderEditForm";
// import GoodIssueCreateForm from "../../../warehouse/bill-management/components/good-issues/goodIssueCreateForm";
import BillDetailForm from "../../../warehouse/bill-management/components/genaral/billDetailForm";
import SalesOrderApproveForm from "./approveSalesOrder";
import SalesOrderEditAfterApproveForm from "./editAfterApprove/salesOrderEditAfterApproveForm";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function SalesOrderTable(props) {

    const TableId = "sale-order-table";
    const defaultConfig = { limit: 5 }
    const Limit = getTableConfiguration(TableId, defaultConfig).limit;

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: Limit,
        code: "",
        status: null,
        salesOrderDetail: {},
        detailModalId: 1,
        tableId: TableId,
    })

    useEffect(() => {
        const { page, limit, currentRole } = state;
        props.getAllSalesOrders({ page, limit, currentRole });
        props.getDiscountForOrderValue();
        props.getCustomers({ getAll: true });
        props.getAllBusinessDepartments({ page: 1, limit: 1000 });

        props.getAllStocks({ managementLocation: currentRole });
        props.getUser();
        props.getGoodsByType({ type: "product" });
    }, [])

    const handleClickCreateCode = () => {
        setState((state) => {
            return { ...state, code: generateCode("SO_") };
        });
    };

    const setPage = async (page) => {
        await setState({
            ...state,
            page: page,
        });
        const data = {
            limit: state.limit,
            page: page,
            currentRole: state.currentRole,
        };
        props.getAllSalesOrders(data);
    };

    const setLimit = async (limit) => {
        await setState({
            ...state,
            limit: limit,
        });
        const data = {
            limit: limit,
            page: state.page,
            currentRole: state.currentRole,
        };
        props.getAllSalesOrders(data);
    };

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value,
        });
    };

    const handleOrderCodeChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            codeQuery: value,
        });
    };

    const handleCustomerSearchChange = (value) => {
        //Tìm kiếm theo khách hàng
        setState({
            ...state,
            customer: value,
        });
    };

    const handleSubmitSearch = () => {
        let { limit, page, codeQuery, status, customer } = state;
        const data = {
            limit,
            page,
            code: codeQuery,
            status,
            customer,
            currentRole: state.currentRole,
        };
        props.getAllSalesOrders(data);
    };

    const handleShowDetailInfo = async (salesOrder) => {
        const { detailModalId } = state;
        await props.getPaymentForOrder({ orderId: salesOrder._id, orderType: 1 });
        await props.getSalesOrderDetail(salesOrder._id);
        await window.$(`#modal-detail-sales-order-${detailModalId}`).modal("show");
    };

    const reloadSalesOrderTable = () => {
        let { limit, page, codeQuery, status, customer, currentRole } = state;
        const data = {
            limit,
            page,
            code: codeQuery,
            status,
            customer,
            currentRole,
        };
        props.getAllSalesOrders(data);
    };

    const handleEditSalesOrder = async (salesOrderEdit) => {
        await props.getSalesOrderDetail(salesOrderEdit._id);
        window.$("#modal-edit-sales-order").modal("show");
    };

    const handleEditSalesOrderAfterApprove = async (salesOrderEdit) => {
        let goodIds = [];
        if (salesOrderEdit) {
            goodIds = salesOrderEdit.goods.map((good) => good.good._id);
        }
        //Lấy số lượng tồn kho
        await props.getInventoryByGoodIds({ array: goodIds });
        await setState({
            ...state,
            salesOrderEditAfterApprove: salesOrderEdit,
        });
        window.$("#modal-edit-sales-order-after-aprrove").modal("show");
    };

    const setEditSalesOrderAfterApproveState = async (data) => {
        await setState({
            ...state,
            salesOrderEditAfterApprove: data,
        });
    };

    const handleAddBill = async (salesOrderAddBill) => {
        await setState((state) => {
            return {
                ...state,
                salesOrderAddBill,
                billCode: generateCode("BIIS"),
            };
        });
        window.$("#modal-create-bill-issue").modal("show");
    };

    const handleShowBillDetail = async (billId) => {
        await props.getDetailBill(billId);
        window.$("#modal-detail-bill").modal("show");
    };

    const createDirectly = () => {
        window.$("#modal-add-sales-order").modal("show");
    };

    const createFromQuote = () => {
        const { currentRole } = state;
        props.getQuotesToMakeOrder({ currentRole });
        window.$("#modal-add-sales-order-from-quote").modal("show");
    };

    const checkUserForApprove = (salesOrder) => {
        const { approvers } = salesOrder;
        const userId = localStorage.getItem("userId");
        let checkApprove = approvers.find((element) => element.approver === userId);
        if (checkApprove) {
            return parseInt(checkApprove.status);
            //Trả về trạng thái 1. chưa phê duyệt, 2. Đã phê duyệt, 3. Đã hủy
        }
        return -1;
    };

    const handleShowApprove = async (salesOrder) => {
        await setState({
            ...state,
            salesOrderApprove: salesOrder,
        });
        window.$("#modal-approve-sales-order").modal("show");
    };

    const checkHasComponent = (name) => {
        let { auth } = props;
        let result = false;
        auth.components.forEach((component) => {
            if (component.name === name) result = true;
        });

        return result;
    };

    let { limit, code, salesOrderAddBill, billCode, detailModalId, salesOrderApprove, salesOrderEditAfterApprove, tableId } = state;
    const { translate, salesOrders } = props;
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
            className: "text-success",
            text: "Đã phê duyệt",
        },
        {
            className: "text-warning",
            text: "Yêu cầu sản xuất",
        },
        {
            className: "text-warning",
            text: "Đã lập kế hoạch sản xuất",
        },
        {
            className: "text-dark",
            text: "Đã yêu cầu xuất kho",
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

    return (
        <React.Fragment>
            <div className="nav-tabs-custom">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/*Chọn cách thêm đơn hàng*/}
                        {/* Button dropdown thêm mới đơn bán hàng */}
                        <div className="dropdown pull-right" style={{ marginTop: 5 }}>
                            <button
                                type="button"
                                className="btn btn-success dropdown-toggle pull-right"
                                data-toggle="dropdown"
                                aria-expanded="true"
                                title={"Đơn hàng mới"}
                                onClick={handleClickCreateCode}
                            >
                                Thêm đơn hàng
                            </button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li>
                                    <a style={{ cursor: "pointer" }} title={`Tạo từ báo giá`} onClick={createFromQuote}>
                                        Thêm từ báo giá
                                    </a>
                                </li>
                                <li>
                                    <a style={{ cursor: "pointer" }} title={`Tạo trực tiếp`} onClick={createDirectly}>
                                        Thêm trực tiếp
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <SalesOrderCreateForm code={code} />
                    <SalesOrderCreateFormFromQuote code={code} />
                    <SalesOrderDetailForm modalID={detailModalId} />
                    {/* <GoodIssueCreateForm
                        salesOrderAddBill={salesOrderAddBill}
                        createdSource={"salesOrder"}
                        billCode={billCode}
                        modalName={`Lập phiếu yêu cầu xuất kho cho đơn hàng: ${salesOrderAddBill ? salesOrderAddBill.code : ""}`}
                        reloadSalesOrderTable={reloadSalesOrderTable}
                        group={"2"}
                    /> */}
                    <BillDetailForm />
                    <SalesOrderEditForm />
                    {salesOrderEditAfterApprove && (
                        <SalesOrderEditAfterApproveForm
                            salesOrderEditAfterApprove={salesOrderEditAfterApprove}
                            setEditSalesOrderAfterApproveState={(data) => setEditSalesOrderAfterApproveState(data)}
                        />
                    )}
                    <SalesOrderApproveForm salesOrderApprove={salesOrderApprove} />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn</label>
                            <input
                                type="text"
                                className="form-control"
                                name="codeQuery"
                                onChange={handleOrderCodeChange}
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
                                    props.customers.list
                                        ? props.customers.list.map((customerItem) => {
                                            return {
                                                value: customerItem._id,
                                                text: customerItem.name,
                                            };
                                        })
                                        : []
                                }
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn khách hàng", allSelectedText: "Đã chọn tất cả" }}
                                onChange={handleCustomerSearchChange}
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
                                        text: "Đã phê duyệt",
                                    },
                                    {
                                        value: 3,
                                        text: "Yêu cầu sản xuất",
                                    },
                                    {
                                        value: 4,
                                        text: "Đã lập kế hoạch sản xuất",
                                    },
                                    {
                                        value: 5,
                                        text: "Đã yêu cầu xuất kho",
                                    },
                                    {
                                        value: 6,
                                        text: "Đang giao hàng",
                                    },
                                    {
                                        value: 7,
                                        text: "Đã giao hàng",
                                    },
                                    {
                                        value: 8,
                                        text: "Hủy đơn",
                                    },
                                ]}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn trạng thái đơn", allSelectedText: "Đã chọn tất cả" }}
                                onChange={handleStatusChange}
                            />
                        </div>

                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Lọc" onClick={handleSubmitSearch}>
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: 20 }}>
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
                                        tableId={tableId}
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
                                        setLimit={setLimit}
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
                                        <td
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            <a onClick={() => handleShowDetailInfo(item)}>
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            {/* Chỉ được sửa khi đơn hàng chưa phê duyệt */}
                                            {item.status === 1 && (
                                                <a
                                                    onClick={() => handleEditSalesOrder(item)}
                                                    className="edit text-yellow"
                                                    style={{ width: "5px" }}
                                                    title="Sửa đơn"
                                                >
                                                    <i className="material-icons">edit</i>
                                                </a>
                                            )}
                                            {/* Sửa đơn sau khi đã phê duyệt */}
                                            {item.status !== 1 && item.status !== 8 && item.status !== 7 && (
                                                <a
                                                    onClick={() => handleEditSalesOrderAfterApprove(item)}
                                                    className="edit text-yellow"
                                                    style={{ width: "5px" }}
                                                    title="Sửa đơn"
                                                >
                                                    <i className="material-icons">edit</i>
                                                </a>
                                            )}
                                            {!item.bill && item.status !== 1 && checkUserForApprove(item) === 2 && item.status !== 8 && (
                                                <a
                                                    onClick={() => handleAddBill(item)}
                                                    className="add text-success"
                                                    style={{ width: "5px" }}
                                                    title="Yêu cầu xuất kho"
                                                >
                                                    <i className="material-icons">add</i>
                                                </a>
                                            )}
                                            {item.bill && item.status !== 1 && item.status !== 8 && (
                                                <a
                                                    onClick={() => handleShowBillDetail(item.bill)}
                                                    className="add text-success"
                                                    style={{ width: "5px" }}
                                                    title="Yêu cầu xuất kho"
                                                >
                                                    <i className="material-icons">remove_red_eye</i>
                                                </a>
                                            )}
                                            {checkUserForApprove(item) === 1 && item.status === 1 && (
                                                <a
                                                    onClick={() => handleShowApprove(item)}
                                                    className="add text-success"
                                                    style={{ width: "5px" }}
                                                    title="Phê duyệt đơn"
                                                >
                                                    <i className="material-icons">check_circle_outline</i>
                                                </a>
                                            )}
                                        </td>
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
                    <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage} />
                </div>
            </div>
        </React.Fragment>
    );
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
    getSalesOrderDetail: SalesOrderActions.getSalesOrderDetail,
    getAllBusinessDepartments: BusinessDepartmentActions.getAllBusinessDepartments,

    getBillsByType: BillActions.getBillsByType,
    getDetailBill: BillActions.getDetailBill,
    getAllStocks: StockActions.getAllStocks,
    getUser: UserActions.get,
    getGoodsByType: GoodActions.getGoodsByType,
    getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderTable));
