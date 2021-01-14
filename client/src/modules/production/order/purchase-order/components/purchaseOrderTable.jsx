import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
//Actions
import { PurchaseOrderActions } from "../redux/actions";
import { purchasingRequestActions } from "../../../manufacturing/purchasing-request/redux/actions";
import { StockActions } from "../../../warehouse/stock-management/redux/actions";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { BillActions } from "../../../warehouse/bill-management/redux/actions";
import { PaymentActions } from "../../payment/redux/actions";
//helpers
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../helpers/formatDate";
import { generateCode } from "../../../../../helpers/generateCode";
//Component
import { PaginateBar, DataTableSetting, SelectMulti, SelectBox } from "../../../../../common-components";

import PurchaseOrderCreateFormDirectly from "./purchaseOrderCreateFormDirectly";
import PurchaseOrderCreateFormFromPurchasingRequest from "./purchaseOrderCreateFormFromPurchasingRequest";
import PurchaseDetailForm from "./purchaseOrderDetailForm";
import PurchaseOrderEditForm from "./purchaseOrderEditForm";
import GoodReceiptCreateForm from "../../../warehouse/bill-management/components/good-receipts/goodReceiptCreateForm";
import BillDetailForm from "../../../warehouse/bill-management/components/genaral/billDetailForm";
class PurchaseOrderTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 1,
            code: "",
            status: "",
        };
    }

    componentDidMount() {
        const { page, limit } = this.state;
        this.props.getAllPurchaseOrders({ page, limit });
        this.props.getAllStocks();
        this.props.getCustomers();
        this.props.getUser();
        this.props.getAllGoodsByType({ type: "material" });
    }

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, codeCreate: generateCode("PO_") };
        });
    };

    createDirectly = () => {
        window.$("#modal-add-purchase-order-directly").modal("show");
    };

    createFromPurchasingRequest = () => {
        this.props.getAllPurchasingRequests({ status: 1 });
        window.$("#modal-add-purchase-order-from-puchasing-request").modal("show");
    };

    setPage = async (page) => {
        const { limit } = this.state;
        await this.setState({
            page: page,
        });
        const data = {
            limit,
            page: page,
        };
        this.props.getAllPurchaseOrders(data);
    };

    setLimit = async (limit) => {
        const { page } = this.state;
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page,
        };
        this.props.getAllPurchaseOrders(data);
    };

    reloadPurchaseOrderTable = () => {
        const { page, limit, code, status, supplier } = this.state;
        const data = {
            limit,
            page,
            code,
            status,
            supplier,
        };
        this.props.getAllPurchaseOrders(data);
    };

    handleCodeChange = (e) => {
        const { value } = e.target;
        this.setState({
            code: value,
        });
    };

    handleStatusChange = (value) => {
        this.setState({
            status: value,
        });
    };

    handleSupplierChange = (value) => {
        this.setState({
            supplier: value,
        });
    };

    handleSubmitSearch = () => {
        const { page, limit, code, status, supplier } = this.state;
        const data = {
            limit,
            page,
            code,
            status,
            supplier,
        };
        this.props.getAllPurchaseOrders(data);
    };

    handleShowDetail = async (data) => {
        await this.props.getPaymentForOrder({ orderId: data._id, orderType: 2 });
        await this.setState({
            purchaseOrderDetail: data,
        });
        window.$("#modal-detail-purchase-order").modal("show");
    };

    handleEdit = async (data) => {
        await this.setState({
            purchaseOrderEdit: data,
        });
        window.$("#modal-edit-purchase-order").modal("show");
    };

    handleAddBill = async (purchaseOrderAddBill) => {
        await this.setState((state) => {
            return {
                ...state,
                purchaseOrderAddBill,
                billCode: generateCode("BIRE"),
            };
        });
        window.$("#modal-create-bill-receipt").modal("show");
    };

    handleShowBillDetail = async (billId) => {
        await this.props.getDetailBill(billId);
        window.$("#modal-detail-bill").modal("show");
    };

    render() {
        const { code, status, codeCreate, purchaseOrderEdit, purchaseOrderDetail, purchaseOrderAddBill, billCode } = this.state;

        const { translate, purchaseOrders } = this.props;
        const { totalPages, page, listPurchaseOrders } = purchaseOrders;
        const statusConvert = [
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
                text: "Đã phê duyệt",
            },
            {
                className: "text-success",
                text: "Đã nhập kho",
            },
            {
                className: "text-danger",
                text: "Đã hủy",
            },
        ];
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/*Chọn cách thêm đơn mua nguyên vật liệu*/}
                        {/* Button dropdown thêm mới đơn mua nguyên vật liệu */}
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button
                                type="button"
                                className="btn btn-success dropdown-toggle pull-right"
                                data-toggle="dropdown"
                                aria-expanded="true"
                                title={"Thêm mới đơn mu nguyên vật liệu"}
                                onClick={this.handleClickCreateCode}
                            >
                                Thêm đơn
                            </button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li>
                                    <a style={{ cursor: "pointer" }} title={`Tạo từ báo giá`} onClick={this.createFromPurchasingRequest}>
                                        Thêm từ đơn đề nghị
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
                    <PurchaseOrderCreateFormDirectly code={codeCreate} />
                    <PurchaseOrderCreateFormFromPurchasingRequest code={codeCreate} />
                    {purchaseOrderDetail && <PurchaseDetailForm purchaseOrderDetail={purchaseOrderDetail} />}
                    {purchaseOrderEdit && <PurchaseOrderEditForm purchaseOrderEdit={purchaseOrderEdit} />}
                    <GoodReceiptCreateForm
                        purchaseOrderAddBill={purchaseOrderAddBill}
                        createdSource={"purchaseOrder"}
                        billCode={billCode}
                        modalName={`Lập phiếu yêu cầu nhập kho cho đơn hàng: ${purchaseOrderAddBill ? purchaseOrderAddBill.code : ""}`}
                        reloadPurchaseOrderTable={this.reloadPurchaseOrderTable}
                        group={"1"}
                    />
                    <BillDetailForm />

                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn</label>
                            <input
                                type="text"
                                className="form-control"
                                value={code}
                                onChange={this.handleCodeChange}
                                placeholder="Mã đơn"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Trạng thái đơn</label>
                            <SelectBox
                                id={`select-filter-status-material-purchase-order`}
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
                                        text: "Đã nhập kho",
                                    },
                                    {
                                        value: 4,
                                        text: "Đã hủy",
                                    },
                                ]}
                                onChange={this.handleStatusChange}
                                value={status}
                                multiple={true}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Nhà cung cấp</label>
                            <SelectMulti
                                id={`selectMulti-filter-suppliet-purchase-order`}
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
                                options={{ nonSelectedText: "Chọn nhà cung cấp", allSelectedText: "Đã chọn tất cả" }}
                                onChange={this.handleSupplierChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Lọc" onClick={this.handleSubmitSearch}>
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <table id="order-table" className="table table-striped table-bordered table-hover" style={{ marginTop: 20 }}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn</th>
                                <th>Trạng thái</th>
                                <th>Tổng tiền</th>
                                <th>Nhà cung cấp</th>
                                <th>Người tạo</th>
                                <th>Ngày tạo</th>
                                <th
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                    }}
                                >
                                    {translate("table.action")}
                                    <DataTableSetting
                                        tableId="manufacturing-works-table"
                                        columnArr={["STT", "Mã đơn", "Trạng thái", "Người tạo", "Tổng tiền"]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listPurchaseOrders.length !== 0 &&
                                listPurchaseOrders.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.code}</td>
                                        <td className={item.status ? statusConvert[item.status].className : ""}>
                                            {item.status ? statusConvert[item.status].text : ""}
                                        </td>
                                        <td>{item.paymentAmount ? formatCurrency(item.paymentAmount) : ""}</td>
                                        <td>{item.supplier ? item.supplier.name : ""}</td>
                                        <td>{item.creator ? item.creator.name : ""}</td>
                                        <td>{item.createdAt ? formatDate(item.createdAt) : ""}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleShowDetail(item)}>
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            <a
                                                onClick={() => this.handleEdit(item)}
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
                                                    title="Yêu cầu nhập kho nguyên vật liệu"
                                                >
                                                    <i className="material-icons">add</i>
                                                </a>
                                            ) : (
                                                <a
                                                    onClick={() => this.handleShowBillDetail(item.bill)}
                                                    className="add text-success"
                                                    style={{ width: "5px" }}
                                                    title="Yêu cầu nhập kho nguyên vật liệu"
                                                >
                                                    <i className="material-icons">remove_red_eye</i>
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {purchaseOrders.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                        (typeof listPurchaseOrders === "undefined" || listPurchaseOrders.length === 0) && (
                            <div className="table-info-panel">{translate("confirm.no_data")}</div>
                        )
                    )}
                    <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    const { purchaseOrders } = state;
    return { purchaseOrders, customers };
}

const mapDispatchToProps = {
    getAllPurchaseOrders: PurchaseOrderActions.getAllPurchaseOrders,
    getAllPurchasingRequests: purchasingRequestActions.getAllPurchasingRequests,
    getAllStocks: StockActions.getAllStocks,
    getCustomers: CrmCustomerActions.getCustomers,
    getUser: UserActions.get,
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    getDetailBill: BillActions.getDetailBill,
    getPaymentForOrder: PaymentActions.getPaymentForOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderTable));
