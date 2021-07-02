import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { PaymentActions } from "../../redux/actions";
import { CrmCustomerActions } from "../../../../../crm/customer/redux/actions";
import { BankAccountActions } from "../../../bank-account/redux/actions";

import { formatDate } from "../../../../../../helpers/formatDate";
import { formatCurrency } from "../../../../../../helpers/formatCurrency";
import { PaginateBar, DataTableSetting, SelectMulti } from "../../../../../../common-components";
import ReceiptVoucherCreateForm from "./receiptVoucherCreateForm";
import ReceiptVoucherDetailForm from "./receiptVoucherDetailForm";
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';
class ReceiptVoucherManagementTable extends Component {
    constructor(props) {
        super(props);
        const tableId = "receip-voucher-manager-table";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            page: 1,
            limit: limit,
            type: 1,
            tableId
        };
    }

    componentDidMount() {
        const { page, limit, type } = this.state;
        this.props.getAllPayments({ page, limit, type });
        this.props.getCustomers({getAll:true});
        this.props.getAllBankAccounts({ page: 1, limit: 1000, status: true });
    }

    setPage = async (page) => {
        const { limit, type } = this.state;
        await this.setState({
            page: page,
        });
        const data = {
            limit,
            page: page,
            type,
        };
        this.props.getAllPayments(data);
    };

    setLimit = async (limit) => {
        const { page, type } = this.state;
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page,
            type,
        };
        this.props.getAllPayments(data);
    };

    handleShowDetailPayment = async (payment) => {
        await this.setState({
            paymentDetail: payment,
        });
        window.$("#modal-receipt-voucher-detail").modal("show");
    };

    getPaidForPayment = (item) => {
        let paid = item.salesOrders.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.money);
        }, 0);

        return formatCurrency(paid);
    };

    handleCustomerChange = (value) => {
        //Tìm kiếm theo khách hàng
        this.setState({
            customer: value,
        });
    };

    handleCodeChange = (e) => {
        let { value } = e.target;
        this.setState({
            code: value,
        });
    };

    handleSubmitSearch = () => {
        let { limit, code, page, customer, type } = this.state;
        const data = {
            limit,
            page,
            code,
            customer,
            type,
        };
        this.props.getAllPayments(data);
    };

    render() {
        const { translate } = this.props;
        const { payments } = this.props;
        const { totalPages, page, listPayments } = payments;

        const { paymentDetail, tableId } = this.state;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <ReceiptVoucherCreateForm />
                    {paymentDetail && <ReceiptVoucherDetailForm paymentDetail={paymentDetail} />}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu</label>
                            <input
                                type="text"
                                className="form-control"
                                name="code"
                                onChange={this.handleCodeChange}
                                placeholder="Mã phiếu"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Khách hàng</label>
                            <SelectMulti
                                id={`selectMulti-filter-customer-receipt-voucher`}
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
                                onChange={this.handleCustomerChange}
                            />
                        </div>

                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Lọc" onClick={this.handleSubmitSearch}>
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã phiếu</th>
                                <th>Khách hàng</th>
                                <th>Người nhận thanh toán</th>
                                <th>Số tiền thanh toán</th>
                                <th>Ngày thanh toán</th>
                                <th
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                    }}
                                >
                                    Hành động
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={["STT", "Khách hàng", "Người nhận thanh toán", "Số tiền thanh toán", "Ngày thanh toán"]}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listPayments &&
                                listPayments.length !== 0 &&
                                listPayments.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.code}</td>
                                        <td>{item.customer ? item.customer.name : "---"}</td>
                                        <td>{item.curator ? item.curator.name : "---"}</td>
                                        <td>{this.getPaidForPayment(item)}</td>
                                        <td>{item.paymentAt ? formatDate(item.paymentAt) : "---"}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                style={{ width: "5px" }}
                                                title={"Xem chi tiết"}
                                                onClick={() => {
                                                    this.handleShowDetailPayment(item);
                                                }}
                                            >
                                                <i className="material-icons">view_list</i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {payments.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                            (typeof listPayments === "undefined" || listPayments.length === 0) && (
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
    const { payments } = state;
    return { payments, customers };
}

const mapDispatchToProps = {
    getAllPayments: PaymentActions.getAllPayments,
    getCustomers: CrmCustomerActions.getCustomers,
    getAllBankAccounts: BankAccountActions.getAllBankAccounts,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ReceiptVoucherManagementTable));
