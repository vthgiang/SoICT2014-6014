import React, { Component, useEffect, useState } from "react";
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

function ReceiptVoucherManagementTable(props) {

    const TableId = "receip-voucher-manager-table";
    const defaultConfig = { limit: 5 }
    const Limit = getTableConfiguration(TableId, defaultConfig).limit;

    const [state, setState] = useState({
        page: 1,
        limit: Limit,
        type: 1,
        tableId: TableId,
    })

    useEffect(() => {
        const { page, limit, type } = state;
        props.getAllPayments({ page, limit, type });
        props.getCustomers({ getAll: true });
        props.getAllBankAccounts({ page: 1, limit: 1000, status: true });
    }, [])

    const setPage = async (page) => {
        const { limit, type } = state;
        await setState({
            page: page,
        });
        const data = {
            limit,
            page: page,
            type,
        };
        props.getAllPayments(data);
    };

    const setLimit = async (limit) => {
        const { page, type } = state;
        await setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page,
            type,
        };
        props.getAllPayments(data);
    };

    const handleShowDetailPayment = async (payment) => {
        await setState({
            paymentDetail: payment,
        });
        window.$("#modal-receipt-voucher-detail").modal("show");
    };

    const getPaidForPayment = (item) => {
        let paid = item.salesOrders.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue.money);
        }, 0);

        return formatCurrency(paid);
    };

    const handleCustomerChange = (value) => {
        //Tìm kiếm theo khách hàng
        setState({
            ...state,
            customer: value,
        });
    };

    const handleCodeChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            code: value,
        });
    };

    const handleSubmitSearch = () => {
        let { limit, code, page, customer, type } = state;
        const data = {
            limit,
            page,
            code,
            customer,
            type,
        };
        props.getAllPayments(data);
    };

    const { translate } = props;
    const { payments } = props;
    const { totalPages, page, listPayments } = payments;

    const { paymentDetail, tableId } = state;
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
                            onChange={handleCodeChange}
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
                            onChange={handleCustomerChange}
                        />
                    </div>

                    <div className="form-group">
                        <button type="button" className="btn btn-success" title="Lọc" onClick={handleSubmitSearch}>
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
                                    setLimit={setLimit}
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
                                    <td>{getPaidForPayment(item)}</td>
                                    <td>{item.paymentAt ? formatDate(item.paymentAt) : "---"}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a
                                            style={{ width: "5px" }}
                                            title={"Xem chi tiết"}
                                            onClick={() => {
                                                handleShowDetailPayment(item);
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
                <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage} />
            </div>
        </React.Fragment>
    );
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
