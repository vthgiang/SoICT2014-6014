import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { RequestActions } from '../../../../../production/common-production/request-management/redux/actions';
import { DatePicker, PaginateBar, SmartTable } from "../../../../../../common-components";
import ConfirmInitRoute from "../confirmInitRoute";
import DetailTransportRequest from "../detailTransportRequest";
import { ShipperActions } from "../../../../shipper/redux/actions";
import CreateTransportRequestForm from "../createTransportRequestForm";
import DeliveryPlanList from "../deliveryPlanList";

function NotTransportRequests(props) {
    const getTableId = "table-manage-not-transport-request";

    // Khởi tạo state
    const [state, setState] = useState({
        page: 1,
        limit: 10,
        tableId: getTableId,
        customerSearchName: "",
        fromDate: "",
        toDate: "",
    })

    const [showModal, setShowModal] = useState(false);
    const { translate, requestManagements, showConfirmBox, isProgress, selectedData, setLimit, setPage,
            handleChangeEstimatedDeliveryDate, handleInitDeliveryPlan, nextStep, totalPage, currentPage } = props;
    const { page, limit, currentRow, currentRowDetail, tableId, customerSearchName, fromDate, toDate, idModalDetail } = state;

    useEffect(() => {
        props.getAllRequestByCondition({ requestType: 4, status: 2, page, limit});
    }, [])

    useEffect(() => {
        setTimeout(() => {
            const checkBoxes = document.querySelectorAll('.smart-table-body input[type="checkbox"]');
            if (checkBoxes) {
                checkBoxes.forEach((checkBox) => {
                    if (selectedData.includes(checkBox.getAttribute("value"))) {
                        console.log("test selected 23232",selectedData);
                        checkBox.checked = true
                    } else {
                        checkBox.checked = false
                    }
                })
            }
        }, 1000)
    }, [requestManagements])

    const handleShowDeliveryPlans = () => {
        window.$(`#modal-create-transportation-request`).modal('show')
        // setShowModal(true);
    }

    const handleChangeCustomerName = (event) => {
        setState({
            ...state,
            customerSearchName: event.target.value
        })
    }

    const handleSubmitSearch = () => {
        props.getAllRequestByCondition({
            fromDate: fromDate,
            toDate: toDate,
            page: 1,
            limit: 10,
            requestType: 4,
            status: 2,
            customerSearchName: customerSearchName ? customerSearchName : ""
        });
    }

    const onSelectedRowsChange = (value) => {
        props.onSelectedRowsChange(value);
    }


    const handleShowDetailInfo = (request) => {
        setState({
            ...state,
            currentRowDetail: request,
        });
        window.$('#modal-detail-transportation-request').modal('show');
    }

    const handleChangeFromDate = (value) => {
        setState({
            ...state,
            fromDate: value
        })
    }

    const handleChangeToDate = (value) => {
        setState({
            ...state,
            toDate: value
        })
    }
    let listRequests = [];

    if (requestManagements?.listRequests?.length > 0) {
        listRequests = requestManagements?.listRequests.map((request) => {
            return {
                _id: request._id,
                code: request.code,
                customerName: request?.supplier?.name,
                // priority: "Tiêu chuẩn",
                estimatedDeliveryDate: request.desiredTime,
                status: "Chưa xử lý",
                address: request?.supplier?.address,
                stock: request.stock,
            }
        })
    }

    return (
        <React.Fragment>  
            <div className="qlcv">
                {
                    isProgress &&
                    <>
                        <p>Đang khởi tạo kế hoạch giao hàng ...</p>
                        <ProgressBar animated now={props.progressPercent ? props.progressPercent : 0} label={`${props.progressPercent ? props.progressPercent : 0}%`} max={100} min={0}/>
                    </>
                }
                <ConfirmInitRoute
                    handleChangeEstimatedDeliveryDate={handleChangeEstimatedDeliveryDate}
                    handleInitDeliveryPlan={handleInitDeliveryPlan}
                />
                <DetailTransportRequest
                    detailRequest={currentRowDetail ? currentRowDetail : null}
                    id="not-transport-page"
                />
                <div className="form-inline">
                    {/* Từ ngày */}
                    <div className="form-group row">
                        <label className="form-control-static">{translate('manage_transportation.orders_table.from_date')}</label>
                        <DatePicker
                            id="purchase-month"
                            dateFormat="month-year-day"
                            value={fromDate}
                            onChange={handleChangeFromDate}
                        />
                    </div>
                    {/* Đến ngày */}
                    <div className="form-group row">
                        <label className="form-control-static" style={{ padding: 0 }}>{translate('manage_transportation.orders_table.to_date')}</label>
                        <DatePicker
                            id="disposal-month"
                            dateFormat="month-year-day"
                            value={toDate}
                            onChange={handleChangeToDate}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    {/* Tìm kiếm */}
                    <div className="form-group row">
                        <label htmlFor="search-customer" className="col-md-2 col-form-label">{translate('manage_transportation.orders_table.search')}</label>
                        <input type="text" className="form-control" name="customer-name" value={customerSearchName} onChange={handleChangeCustomerName} placeholder={translate('manage_transportation.orders_table.customer_search_name')} autoComplete="off" />
                        <button type="button" className="btn btn-success" title={translate('manage_transportation.orders_table.search')} onClick={() => handleSubmitSearch()}>{translate('manage_transportation.orders_table.search')}</button>
                    </div>
                    {/* Buttons option khởi tạo lộ trình */}
                    {
                        selectedData.length > 0 &&
                        <div className="dropdown pull-right" style={{ marginTop: "5px" }}>
                            <button type="button" className="btn btn-info dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_transportation.orders_table.init_route')} >{translate('manage_transportation.orders_table.init_route')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} title={translate('manage_transportation.orders_table.quick_create_title')} onClick={showConfirmBox}>
                                    {translate('manage_transportation.orders_table.quick_create')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} onClick={nextStep} title={translate('manage_transportation.orders_table.setup_create_title')}>
                                    {translate('manage_transportation.orders_table.setup_create')}</a></li>
                            </ul>
                        </div>
                    }
                    {/* Buttons option khởi tạo lộ trình tạm thời */}
                    {
                        selectedData.length >= 0 &&
                        <div className="dropdown pull-right" style={{ marginTop: "5px" }}>
                            <button onClick={handleShowDeliveryPlans} type="button" className="btn btn-info dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_transportation.orders_table.init_route')} >{translate('manage_transportation.orders_table.init_route')}</button>
                            <DeliveryPlanList showModal={showModal} setShowModal={setShowModal} />
                             {/* <CreateTransportRequestForm showModal={showModal} setShowModal={setShowModal} /> */}

                            {/* <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} title={translate('manage_transportation.orders_table.quick_create_title')} onClick={showConfirmBox}>
                                    {translate('manage_transportation.orders_table.quick_create')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} onClick={nextStep} title={translate('manage_transportation.orders_table.setup_create_title')}>
                                    {translate('manage_transportation.orders_table.setup_create')}</a></li>
                            </ul> */}
                        </div>
                    }
                </div>
                <div className="row" style={{marginTop: "10px", marginBottom: "-10px"}}>
                    {
                        selectedData.length > 0 &&
                        <div className="col-md-2">
                            <p>Đã chọn ({selectedData.length}) đơn</p>
                        </div>
                    }
                </div>
                <SmartTable
                    tableId={tableId}
                    columnData={{
                        orderCode: translate('manage_transportation.orders_table.order_code'),
                        customerName: translate('manage_transportation.orders_table.customer_name'),
                        // priority: translate('manage_transportation.orders_table.priority'),
                        estimatedDeliveryDate: translate('manage_transportation.orders_table.estimated_delivery_date'),
                        status: translate('manage_transportation.orders_table.status'),
                        address: translate('manage_transportation.orders_table.address')
                    }}
                    tableHeaderData={{
                        orderCode: <th>{translate('manage_transportation.orders_table.order_code')}</th>,
                        customerName: <th>{translate('manage_transportation.orders_table.customer_name')}</th>,
                        // priority: <th>{translate('manage_transportation.orders_table.priority')}</th>,
                        estimatedDeliveryDate: <th>{translate('manage_transportation.orders_table.estimated_delivery_date')}</th>,
                        status: <th>{translate('manage_transportation.orders_table.status')}</th>,
                        address: <th>{translate('manage_transportation.orders_table.address')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={listRequests?.length > 0 && listRequests.map((item, index) => {
                        return {
                            id: item?._id,
                            orderCode: <td>{item.code ? item.code : ""}</td>,
                            customerName: <td>{item?.customerName}</td>,
                            // priority: <td>{item?.priority}</td>,
                            estimatedDeliveryDate: <td>{item?.estimatedDeliveryDate}</td>,
                            status: <td>{item?.status}</td>,
                            address: <td>{item?.address}</td>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                            </td>
                        }
                    })}
                    dataDependency={listRequests}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                />

                {/* PaginateBar */}
                {requestManagements.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof listRequests === 'undefined' || listRequests.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={currentPage}
                    display={listRequests && listRequests.length !== 0 && listRequests.length}
                    total={requestManagements && requestManagements.totalDocs}
                    func={setPage}
                />
            </div>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    const requestManagements = state. requestManagements;
    return { requestManagements }
}

const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
    getAllFreeShipperSchedule: ShipperActions.getAllFreeShipperSchedule
}

const connectedNotTransportRequests = connect(mapStateToProps, mapDispatchToProps)(withTranslate(NotTransportRequests, CreateTransportRequestForm));
export { connectedNotTransportRequests as NotTransportRequests };