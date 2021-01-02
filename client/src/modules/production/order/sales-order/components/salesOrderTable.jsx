import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { QuoteActions } from "../../quote/redux/actions";
import { DiscountActions } from "../../discount/redux/actions";
import { CrmCustomerActions } from "../../../../crm/customer/redux/actions";
import { DepartmentActions } from "../../../../super-admin/organizational-unit/redux/actions";
import { RoleActions } from "../../../../super-admin/role/redux/actions";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../helpers/formatDate";
import { PaginateBar, DataTableSetting, SelectMulti, SelectBox, DeleteNotification } from "../../../../../common-components";
// import QuoteDetailForm from "./quoteDetailForm";
// import QuoteCreateForm from "./quoteCreateForm";
// import QuoteEditForm from "./quoteEditForm";

class SalesOrderTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: "",
            status: null,
            quoteDetail: {},
        };
    }

    componentDidMount = () => {
        const { page, limit } = this.state;
        this.props.getAllQuotes({ page, limit });
        this.props.getDiscountForOrderValue();
        this.props.getCustomers();
        this.props.getAllDepartments();
        this.props.getAllRoles();
    };

    setPage = async (page) => {
        await this.setState({
            page: page,
        });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getAllQuotes(data);
    };

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page: this.state.page,
        };
        this.props.getAllQuotes(data);
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
        this.props.getAllQuotes(data);
    };

    handleShowDetailInfo = (data) => {
        this.setState((state) => {
            return {
                ...state,
                quoteDetail: data,
            };
        });
        window.$("#modal-detail-quote").modal("show");
    };

    handleCreate = () => {
        window.$("#modal-add-quote").modal("show");
    };

    handleEditQuote = async (quoteEdit) => {
        console.log("quoteEdit", quoteEdit);
        await this.setState((state) => {
            return {
                ...state,
                quoteEdit,
            };
        });
        window.$("#modal-edit-quote").modal("show");
    };

    deleteQuote = async (id) => {
        this.props.deleteQuote(id);
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
        let { limit, quoteDetail, quoteEdit } = this.state;
        const { translate, quotes } = this.props;
        const { totalPages, page } = quotes;

        let listQuotes = [];
        if (quotes.isLoading === false) {
            listQuotes = quotes.listQuotes;
        }

        const dataStatus = [
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

        const { department, role, auth } = this.props;

        console.log("auth", auth);

        return (
            <React.Fragment>
                <div className="nav-tabs-custom">
                    <div className="box-body qlcv">
                        {/* <QuoteDetailForm quoteDetail={quoteDetail} />
                        <QuoteCreateForm />
                        {quoteEdit && <QuoteEditForm quoteEdit={quoteEdit} />} */}
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
                                    id={`selectMulti-filter-customer-quote`}
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
                                    id={`selectMulti-filter-status-quote`}
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
                        <table id={`quote-table`} className="table table-striped table-bordered table-hover" style={{ marginTop: 20 }}>
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
                                                        onClick={() => this.handleEditQuote(item)}
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
                                                        func={() => this.deleteQuote(item._id)}
                                                    />
                                                </td>
                                            )}
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
                        <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    const { quotes, department, role, auth } = state;
    return { quotes, customers, department, role, auth };
}

const mapDispatchToProps = {
    getAllQuotes: QuoteActions.getAllQuotes,
    deleteQuote: QuoteActions.deleteQuote,
    getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
    getCustomers: CrmCustomerActions.getCustomers,
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderTable));
