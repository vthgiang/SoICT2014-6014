import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DatePicker, PaginateBar } from "../../../../../../common-components";
import { RequestActions } from '../../../../../production/common-production/request-management/redux/actions';
import DetailTransportRequest from "../detailTransportRequest";

function TransportingRequests(props) {
    const { translate, requestManagements } = props;
    const [state, setState] = useState({
        tableId: 'transporting-requests-table',
        page: 1,
        limit: 10,
        currentRowDetail: "",
        idModalDetail: "transporting-page"
    })
    const { tableId, page, limit, currentRowDetail, idModalDetail } = state;

    useEffect(() => {
    }, []);

    // Tìm kiếm theo tên khách hàng
    const handleSubmitSearch = () => {

    }
    const handleChangeCustomerName = (event) => {
        setState({
            ...state,
            customerSearchName: event.target.value
        })
    }

    const setPage = async (page) => {
        await setState({
            ...state,
            limit: state.limit,
            page: page
        });
        let limit = state.limit;
        props.getAllRequestByCondition({ requestType: 4, status: 3 , page, limit});
    }

    const setLimit = async (limit) => {
        await setState({
            ...state,
            limit: limit,
            page: state.page
        });

        let page = state.page;
        props.getAllRequestByCondition({ requestType: 4, status: 3 , page, limit})
    }

    const handleShowDetailInfo = (request) => {
        setState({
            ...state,
            currentRowDetail: request,
        });
        window.$(`#modal-detail-transportation-request-${idModalDetail}`).modal('show');
    }

    let listRequests = [];

    if (requestManagements) {
        listRequests = requestManagements.listRequests.map((request) => {
            return {
                _id: request._id,
                code: request.code,
                customerName: request?.supplier.name,
                // priority: "Tiêu chuẩn",
                estimatedDeliveryDate: request.desiredTime,
                status: "Chưa xử lý",
                address: request?.supplier.address,
                stock: request.stock,
            }
        })
    }
    let totalPage = ((requestManagements.totalDocs % limit) === 0) ?
        parseInt(requestManagements.totalDocs  / limit) :
        parseInt((requestManagements.totalDocs  / limit) + 1);
    return (
        <div className="qlcv">
            <DetailTransportRequest
                detailRequest={currentRowDetail ? currentRowDetail : null}
                id={idModalDetail}
            />
            <div className="form-inline">
                {/* Từ ngày */}
                <div className="form-group row">
                    <label className="form-control-static">{translate('manage_transportation.orders_table.from_date')}</label>
                    <DatePicker
                        id="purchase-month"
                        dateFormat="month-year-day"
                    />
                </div>
                {/* Đến ngày */}
                <div className="form-group row">
                    <label className="form-control-static" style={{ padding: 0 }}>{translate('manage_transportation.orders_table.to_date')}</label>
                    <DatePicker
                        id="disposal-month"
                        dateFormat="month-year-day"
                    />
                </div>
            </div>
            <div className="form-inline">
                {/* Tìm kiếm */}
                <div className="form-group row">
                    <label htmlFor="search-customer" className="col-md-2 col-form-label">{translate('manage_transportation.orders_table.search')}</label>
                    <input type="text" className="form-control" name="customer-name" onChange={handleChangeCustomerName} placeholder={translate('manage_transportation.orders_table.customer_search_name')}/>
                    <button type="button" className="btn btn-success" title={translate('manage_transportation.orders_table.search')} onClick={handleSubmitSearch}>{translate('manage_transportation.orders_table.search')}</button>
                </div>
            </div>
            <div className="box-body">
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('manage_transportation.orders_table.order_code')}</th>
                            <th>{translate('manage_transportation.orders_table.customer_name')}</th>
                            <th>{translate('manage_transportation.orders_table.estimated_delivery_date')}</th>
                            {/* <th>{translate('manage_transportation.orders_table.status')}</th> */}
                            <th>{translate('manage_transportation.orders_table.address')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_transportation.orders_table.order_code'),
                                        translate('manage_transportation.orders_table.customer_name'),
                                        translate('manage_transportation.orders_table.estimated_delivery_date'),
                                        // translate('manage_transportation.orders_table.status'),
                                        translate('manage_transportation.orders_table.address')
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listRequests?.length > 0 &&
                            listRequests.map((item, index) => (
                                <tr key={index+1}>
                                    <td>{item.code ? item.code : ""}</td>
                                    <td>{item?.customerName}</td>
                                    <td>{item?.estimatedDeliveryDate}</td>
                                    {/* <td>{item?.status}</td> */}
                                    <td>{item?.address}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {requestManagements.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof listRequests === 'undefined' || listRequests.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    func={setPage}
                    display={listRequests && listRequests.length !== 0 && listRequests.length}
                    total={requestManagements ? requestManagements.totalDocs : 0}
                />
            </div>
        </div>
    );
}
function mapStateToProps(state) {
    const requestManagements = state.requestManagements;
    return { requestManagements }
}

const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TransportingRequests))