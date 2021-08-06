import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
//Actions
import { QuoteActions } from "../redux/actions";
import { DiscountActions } from "../../discount/redux/actions";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { RoleActions } from "../../../../super-admin/role/redux/actions";
import { BusinessDepartmentActions } from "../../business-department/redux/actions";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../helpers/formatDate";
//Components
import { PaginateBar, DataTableSetting, SelectMulti, SelectBox, DeleteNotification } from "../../../../../common-components";
import QuoteDetailForm from "./quoteDetailForm";
import QuoteCreateForm from "./quoteCreateForm";
import QuoteEditForm from "./quoteEditForm";
import QuoteApproveForm from "./approveQuote/index";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function QuoteManageTable(props) {

    const TableId = "qoute-manager-table";
    const defaultConfig = { limit: 5 }
    const Limit = getTableConfiguration(TableId, defaultConfig).limit;

    const [state, setState] = useState({
        page: 1,
        limit: Limit,
        code: "",
        status: null,
        currentRole: localStorage.getItem("currentRole"),
        tableId: TableId,
    })


    useEffect(() => {
        const { page, limit, currentRole } = state;
        props.getAllQuotes({ page, limit, currentRole });
        props.getDiscountForOrderValue();
        props.getCustomers({ getAll: true });
        props.getAllBusinessDepartments({ page: 1, limit: 1000 });
    }, [])

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
        props.getAllQuotes(data);
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
        props.getAllQuotes(data);
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
            code: value,
        });
    };

    const handleCustomerSearchChange = (value) => {
        //Tìm kiếm theo khách hàng
        setState({
            ...state,
            customer: value,
        });
    };

    const handleQueryDateChange = (value) => {
        setState({
            ...state,
            queryDate: value[0],
        });
    };

    const handleSubmitSearch = () => {
        let { limit, page, code, status, customer, queryDate, currentRole } = state;
        const data = {
            limit,
            page,
            code,
            status,
            customer,
            queryDate,
            currentRole,
        };
        props.getAllQuotes(data);
    };

    const handleShowDetailInfo = async (quoteDetail) => {
        await props.getQuoteDetail(quoteDetail._id);
        window.$("#modal-detail-quote").modal("show");
    };

    const handleCreate = () => {
        window.$("#modal-add-quote").modal("show");
    };

    const handleEditQuote = async (quoteEdit) => {
        await props.getQuoteDetail(quoteEdit._id);
        window.$("#modal-edit-quote").modal("show");
    };

    const deleteQuote = async (id) => {
        props.deleteQuote(id);
    };

    const checkUserForApprove = (quote) => {
        const { approvers } = quote;
        const userId = localStorage.getItem("userId");
        let checkApprove = approvers.find((element) => element.approver === userId);
        if (checkApprove) {
            return parseInt(checkApprove.status);
            //Trả về trạng thái 1. chưa phê duyệt, 2. Đã phê duyệt, 3. Đã hủy
        }
        return -1;
    };

    const handleShowApprove = async (quote) => {
        await setState({
            ...state,
            quoteApprove: quote,
        });
        window.$("#modal-approve-quote").modal("show");
    };

    let { limit, quoteApprove, tableId } = state;
    const { translate, quotes } = props;
    const { totalPages, page } = quotes;

    let listQuotes = [];
    if (quotes.isLoading === false) {
        listQuotes = quotes.listQuotes;
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
            text: "Đã duyệt",
        },
        {
            className: "text-success",
            text: "Đã chốt đơn",
        },
        {
            className: "text-danger",
            text: "Đã hủy",
        },
    ];

    return (
        <React.Fragment>
            <div className="nav-tabs-custom">
                <div className="box-body qlcv">
                    <QuoteDetailForm />
                    <QuoteCreateForm />
                    <QuoteEditForm />
                    <QuoteApproveForm quoteApprove={quoteApprove} />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn</label>
                            <input
                                type="text"
                                className="form-control"
                                name="code"
                                onChange={handleOrderCodeChange}
                                placeholder="Nhập vào mã đơn"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Khách hàng</label>
                            <SelectMulti
                                id={`selectMulti-filter-customer-quote`}
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
                                id={`selectMulti-filter-status-quote`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    {
                                        value: 1,
                                        text: "Chờ phê duyệt",
                                    },
                                    {
                                        value: 2,
                                        text: "Đã duyệt",
                                    },
                                    {
                                        value: 3,
                                        text: "Đã chốt đơn",
                                    },
                                    {
                                        value: 4,
                                        text: "Hủy đơn",
                                    },
                                ]}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn trạng thái đơn", allSelectedText: "Đã chọn tất cả" }}
                                onChange={handleStatusChange}
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
                                onChange={handleQueryDateChange}
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
                                <th>Ngày có hiệu lực</th>
                                <th>Ngày hết hiệu lực</th>
                                <th>Tổng tiền (vnđ)</th>
                                <th>Trạng thái</th>
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
                            {typeof listQuotes !== "undefined" &&
                                listQuotes.length !== 0 &&
                                listQuotes.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (page - 1) * limit}</td>
                                        <td>{item.code ? item.code : ""}</td>
                                        <td>{item.creator ? item.creator.name : ""}</td>
                                        <td>{item.customer ? item.customer.name : ""}</td>
                                        <td>{item.effectiveDate ? formatDate(item.effectiveDate) : "---"}</td>
                                        <td>{item.expirationDate ? formatDate(item.expirationDate) : "---"}</td>
                                        <td>{item.paymentAmount ? formatCurrency(item.paymentAmount) : "---"}</td>
                                        <td className={dataStatus[item.status].className}>{dataStatus[item.status].text}</td>
                                        <td
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            <a onClick={() => handleShowDetailInfo(item)}>
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            {checkUserForApprove(item) === 1 && item.status === 1 && (
                                                <a
                                                    onClick={() => handleShowApprove(item)}
                                                    className="add text-success"
                                                    style={{ width: "5px" }}
                                                    title="Phê duyệt báo giá"
                                                >
                                                    <i className="material-icons">check_circle_outline</i>
                                                </a>
                                            )}
                                            {item.status === 1 && (
                                                <React.Fragment>
                                                    <a
                                                        onClick={() => handleEditQuote(item)}
                                                        className="edit text-yellow"
                                                        style={{ width: "5px" }}
                                                        title="Sửa đơn"
                                                    >
                                                        <i className="material-icons">edit</i>
                                                    </a>
                                                    <DeleteNotification
                                                        content={"Bạn có chắc chắn muốn xóa báo giá này"}
                                                        data={{
                                                            id: item._id,
                                                            info: item.code,
                                                        }}
                                                        func={() => deleteQuote(item._id)}
                                                    />
                                                </React.Fragment>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {quotes.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                        (typeof listQuotes === "undefined" || listQuotes.length === 0) && (
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
    const { quotes, department, role, auth } = state;
    return { quotes, customers, department, role, auth };
}

const mapDispatchToProps = {
    getAllQuotes: QuoteActions.getAllQuotes,
    getQuoteDetail: QuoteActions.getQuoteDetail,
    deleteQuote: QuoteActions.deleteQuote,
    getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
    getCustomers: CrmCustomerActions.getCustomers,
    getAllBusinessDepartments: BusinessDepartmentActions.getAllBusinessDepartments,
    getAllRoles: RoleActions.get,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteManageTable));
