import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { QuoteActions } from "../redux/actions";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate } from "../../../../../helpers/formatDate";
import { PaginateBar, DataTableSetting, SelectBox } from "../../../../../common-components";
import QuoteDetailForm from "./quoteDetailForm";
import QuoteCreateForm from "./quoteCreateForm";
import QuoteEditForm from "./quoteEditForm";

class QuoteManageTable extends Component {
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
                text: "Gửi yêu cầu",
            },
            {
                className: "text-warning",
                text: "chờ phản hồi",
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
                        <QuoteDetailForm quoteDetail={quoteDetail} />
                        <QuoteCreateForm />
                        {quoteEdit && <QuoteEditForm quoteEdit={quoteEdit} />}
                        <div className="form-inline">
                            <div className="form-group">
                                <label className="form-control-static">Tìm mã đơn mua</label>
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
                                <label className="form-control-static">Trạng thái đơn</label>
                                <SelectBox
                                    id={`select-filter-status-quote`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        {
                                            value: "Gửi yêu cầu",
                                            text: "Gửi yêu cầu",
                                        },
                                        {
                                            value: "Chờ phản hồi",
                                            text: "Chờ phản hồi",
                                        },
                                        {
                                            value: "Đạt thỏa thuận",
                                            text: "Đạt thỏa thuận",
                                        },
                                        { value: "Hủy đơn", text: "Hủy đơn" },
                                    ]}
                                    onChange={this.handleStatusChange}
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
    const { quotes } = state;
    return { quotes };
}

const mapDispatchToProps = {
    getAllQuotes: QuoteActions.getAllQuotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteManageTable));
