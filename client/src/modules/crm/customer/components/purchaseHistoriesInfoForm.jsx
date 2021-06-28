import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, SelectBox, SelectMulti } from '../../../../common-components';
import { PaymentActions } from '../../../production/order/payment/redux/actions';
import SalesOrderDetailForm from '../../../production/order/sales-order/components/salesOrderDetailForm';
import { SalesOrderActions } from '../../../production/order/sales-order/redux/actions';
import { formatFunction } from '../../common';
import OrderInfoForm from './orderInfoForm';

function PurchaseHistoriesInfoForm(props) {



    const dataStatus = [
        {
            value: 0,
            className: "text-primary",
            text: "Chưa có trạng thái",
        },
        {
            value: 1,
            className: "text-primary",
            text: "Chờ phê duyệt",
        },
        {
            value: 2,
            className: "text-success",
            text: "Đã phê duyệt",
        },
        {
            value: 3,
            className: "text-warning",
            text: "Yêu cầu sản xuất",
        },
        {
            value: 4,
            className: "text-warning",
            text: "Đã lập kế hoạch sản xuất",
        },
        {
            value: 5,
            className: "text-dark",
            text: "Đã yêu cầu xuất kho",
        },
        {
            value: 6,
            className: "text-secondary",
            text: "Đang giao hàng",
        },
        {
            value: 7,
            className: "text-success",
            text: "Đã giao hàng",
        },
        {
            value: 8,
            className: "text-danger",
            text: "Đã hủy",
        },
    ];


    const { translate, salesOrders, customerId } = props;
    const { listSalesOrders } = salesOrders;
    const { id } = props;
    const [modalID, setModalID] = useState(1);
    const [searchState, setSearchState] = useState({


    });
    const handleSearchByStatus = async (value) => {
        const newState = { ...searchState, status: value };
        await setSearchState(newState);
    }
    const handleSearchByCode = async (e) => {
        const value = e.target.value;
        const newState = { ...searchState, code: value };
        await setSearchState(newState);
    }
    const search = async () => {
        console.log('STATE', searchState)
        props.getAllSalesOrders({
            ...searchState,
            limit: 10,
            page: 1,
            customer: customerId,
            currentRole: localStorage.getItem('currentRole'),
            getAll:true
        });
    }
    const handleShowDetailInfo = async (salesOrder) => {
        await props.getPaymentForOrder({ orderId: salesOrder._id, orderType: 1 });
        await props.getSalesOrderDetail(salesOrder._id);
        window.$(`#modal-detail-sales-order-${modalID}`).modal("show");
    };
    console.log(salesOrders)
    return (
        <div className="tab-pane purchaseHistories" id={id}>
            <div className="box">
                <div className="box-body qlcv">
                    {/* xem chi tiet don hang */}
                    <SalesOrderDetailForm modalID={modalID} />
                    {/* search form */}
                    <div className="form-inline" style={{ marginBottom: '2px' }}>
                        <div className="form-group unitSearch">
                            <label>{'Trạng thái đơn hàng'}</label>
                            {

                                <SelectMulti id="multiSelectUnit12"
                                    items={dataStatus}
                                    onChange={handleSearchByStatus}
                                    options={{ nonSelectedText: "--Chọn--", allSelectedText: translate(`task.task_management.select_all_department`) }}
                                >
                                </SelectMulti>

                            }
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Mã đơn hàng</label>
                            <input className="form-control" type="text" name="customerCode" onChange={handleSearchByCode} />
                        </div>
                        <div className="form-group" >
                            <button type="button" className="btn btn-success"
                                onClick={search}
                            >{'Tìm kiếm'}</button>
                        </div>
                    </div>

                    <table className="table table-hover table-striped table-bordered" id={1} style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>

                                <th>{'Mã đơn hàng'}</th>
                                <th>{'Ngày đặt đơn'}</th>
                                <th>{'Giá trị đơn hàng'}</th>
                                <th>{'Trạng thái'}</th>
                                <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnArr={[
                                            "Mã đơn hàng",
                                            "Ngày đặt đơn",
                                            "Giá trị đơn hàng",
                                            "Trạng thái",
                                        ]}
                                    />
                                </th>

                            </tr>
                        </thead>
                        <tbody>

                            {listSalesOrders && listSalesOrders.map((item) => (
                                <tr>
                                    <td>{item.code}</td>
                                    <td>{formatFunction.formatDate(item.createdAt)}</td>
                                    <td>{item.paymentAmount}</td>
                                    <td className={dataStatus[item.status].className}>{dataStatus[item.status].text}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a className="text-green" onClick={() => handleShowDetailInfo(item)}  ><i className="material-icons">visibility</i></a>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
const mapDispatchToProps = {
    getAllSalesOrders: SalesOrderActions.getAllSalesOrders,
    getAllSalesOrders: SalesOrderActions.getAllSalesOrders,
    getPaymentForOrder: PaymentActions.getPaymentForOrder,
    getSalesOrderDetail: SalesOrderActions.getSalesOrderDetail,

}
function mapStateToProps(state) {
    const { crm, salesOrders } = state;
    return { crm, salesOrders };
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseHistoriesInfoForm));
