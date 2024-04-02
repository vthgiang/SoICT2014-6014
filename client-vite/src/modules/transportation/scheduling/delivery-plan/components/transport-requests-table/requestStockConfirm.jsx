import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar } from "../../../../../../common-components";
import { RequestActions } from '../../../../../production/common-production/request-management/redux/actions';
import CreateTransportRequestForm from "../createTransportRequestForm";
import EditTransportRequestForm from "../editTransportRequest";
import DetailTransportRequestForm from "../detailTransportRequest"

function RequestStockConfirm(props) {
    const { translate, requestManagements } = props;
    const [state, setState] = useState({
        tableId: 'transport-requests-not-confirm-table',
        page: 1,
        limit: 10,
        editRequest: "",
        detailRequest: "",
        idModalDetail: "confirm-transport-page"
    })
    const { tableId, page, limit, editRequest, detailRequest, idModalDetail } = state;

    useEffect(() => {
        props.getAllRequestByCondition({ requestType: 4, page, limit});
    }, [])

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
        props.getAllRequestByCondition({ requestType: 4, page, limit});
    }

    const setLimit = async (limit) => {
        await setState({
            ...state,
            limit: limit,
            page: state.page
        });

        let page = state.page;
        props.getAllRequestByCondition({ requestType: 4, page, limit})
    }

    const handleShowInfoRequest = (request) => {
        setState({
            ...state,
            detailRequest: request,
        });
        window.$(`#modal-detail-transportation-request-${idModalDetail}`).modal('show');
    }

    const handleShowCreateForm = () => {
        window.$(`#modal-create-transportation-request`).modal('show')
    }

    const handleEdit = (request) => {
        setState({
            ...state,
            editRequest: request,
        });
        window.$('#modal-edit-transportation-request').modal('show');
    }

    const handleDelete = (id) => {
        props.editRequest(id, {requestType: -1});
        props.getAllRequestByCondition({
            requestType: 4,
            page: page,
            limit: limit
        })
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
                status: request.status,
                address: request?.supplier.address,
                stock: request.stock,
            }
        })
    }
    var totalPage = ((requestManagements.totalDocs % limit) === 0) ?
        parseInt(requestManagements.totalDocs  / limit) :
        parseInt((requestManagements.totalDocs  / limit) + 1);
    return (
        <div className="qlcv">
            <CreateTransportRequestForm/>
            <EditTransportRequestForm
                editRequest={editRequest ? editRequest : null}
            />
            <DetailTransportRequestForm
                detailRequest={detailRequest ? detailRequest : null}
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
                {/* Button tạo mới yêu cầu vận chuyển */}
                <div className="dropdown pull-right" style={{ marginTop: "5px" }}>
                    <button type="button" className="btn btn-success" aria-expanded="true" title={translate('manage_example.add_title')} style={{ marginLeft: "5px" }} onClick={handleShowCreateForm}>{translate('manage_transportation.orders_table.create_new_order')}</button>
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
                            <th>{translate('manage_transportation.orders_table.status')}</th>
                            <th>{translate('manage_transportation.orders_table.address')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_transportation.orders_table.order_code'),
                                        translate('manage_transportation.orders_table.customer_name'),
                                        translate('manage_transportation.orders_table.estimated_delivery_date'),
                                        translate('manage_transportation.orders_table.status'),
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
                                    <td>
                                        {item?.status == 1 && <span className="">Chờ phê duyệt</span>}
                                        {item?.status == 2 && <span className="text-yellow">Chờ lập lịch</span>}
                                        {(item?.status == 3) && <span className="text-yellow">Đang vận chuyển</span>}
                                        {(item?.status == 4) && <span className="text-green">Đã vận chuyển</span>}
                                        {(item?.status == 5) && <span className="text-red">Vận chuyển thất bại</span>}
                                        {item?.status == 6 && <span className="text-red">Không phê duyệt</span>}
                                    </td>
                                    <td>{item?.address}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowInfoRequest(item)}><i className="material-icons">visibility</i></a>
                                        { item?.status == 1 &&
                                            <>
                                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('manage_example.delete')}
                                                    data={{
                                                        id: item._id,
                                                        info: item.code
                                                    }}
                                                    func={handleDelete}
                                                />
                                            </>
                                        }
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
    const requestManagements = state. requestManagements;
    return { requestManagements }
}

const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
    editRequest: RequestActions.editRequest
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RequestStockConfirm))