import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { LazyLoadComponent } from "../../../../../../common-components";
import { RequestActions } from '../../../../../production/common-production/request-management/redux/actions';
import { NotTransportRequests } from "./notTransportRequests";
import RequestStockConfirm from "./requestStockConfirm";
import TransportingRequests from "./transportingRequests";
import FailureTransportRequests from "./failureTransportRequests";
import SuccessTransportRequests from "./successTransportRequests";

function RequestTransportTable(props) {
    const getTableId = "table-manage-problem-assumption";
    const {nextStep, requestManagements, translate, isProgress, handleInitDeliveryPlan, handleChangeEstimatedDeliveryDate} = props;

    // Khởi tạo state
    const [state, setState] = useState({
        page: 1,
        tableId: getTableId,
        selectedData: [],
        limit: 10,
        desiredTime: "",
        type: 1,
        customerSearchName: "",
    })

    const { page, selectedData, limit, type } = state;
    const { progressPercent } = props;

    useEffect(() => {
        props.handleChangeSelectedRequest(selectedData)
    }, [selectedData]);

    // handle onClick checkbox
    const onSelectedRowsChange = (value) => {
        setState({
            ...state,
            selectedData: value
        })
    }

    const showConfirmBox = () => {
        window.$(`#modal-confirm-create-route`).modal('show');
    }

    const setPage = async (page) => {

        await setState({
            ...state,
            limit: state.limit,
            page: page,
        });
        let limit = state.limit;
        props.getAllRequestByCondition({ requestType: 4, status: 2 , page, limit });
    }

    const setLimit = async (limit) => {
        await setState({
            ...state,
            limit: limit,
            page: state.page
        });

        let page = state.page;
        props.getAllRequestByCondition({ requestType: 4, status: 2 , page, limit })
    }

    const handleNotTransportRequests =  async () => {
        const requestType = 4, status = 2;
        await setState({
            ...state,
            type: 1,
        })
        await props.getAllRequestByCondition({ requestType, status, page, limit });
    };

    const handleRequestStockConfirm =  async () => {
        const requestType = 4;
        await setState({
            ...state,
            type: 0,
        })
        await props.getAllRequestByCondition({ requestType, page, limit });
    };


    const handleTransportingRequests =  async () => {
        const requestType = 4, status = 3;
        await setState({
            ...state,
            type: 2,
        })
        await props.getAllRequestByCondition({ requestType, status, page, limit });
    };


    const handleFailureTransportRequests =  async () => {
        const requestType = 4, status = 5;
        await setState({
            ...state,
            type: 4,
        })
        await props.getAllRequestByCondition({ requestType, status, page, limit });
    };

    const handleSuccessTransportRequests =  async () => {
        const requestType = 4, status = 4;
        await setState({
            ...state,
            type: 3,
        })
        await props.getAllRequestByCondition({ requestType, status, page, limit });
    };

    var totalPage = ((requestManagements.totalDocs % limit) === 0) ?
        parseInt(requestManagements.totalDocs  / limit) :
        parseInt((requestManagements.totalDocs  / limit) + 1);
    // var currentPage = parseInt((page / limit) + 1);

    return (
        <React.Fragment>
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li ><a href="#request-stock-confirm-tab" data-toggle="tab" onClick={() => handleRequestStockConfirm()}><i className="fa fa-tasks" aria-hidden="true"></i> {translate('manage_transportation.orders_table.request_stock_confirm')}</a></li>
                            <li className="active"><a href="#not-transport-tab" data-toggle="tab" onClick={() => handleNotTransportRequests()}><i className="fa fa-calendar" aria-hidden="true"></i> {translate('manage_transportation.orders_table.not_transport_requests_tab')}</a></li>
                            <li><a href="#transporting-tab" data-toggle="tab" onClick={() => handleTransportingRequests()}><i className="fa fa-telegram text-yellow" aria-hidden="true"></i> {translate('manage_transportation.orders_table.transporting_requests_tab')}</a></li>
                            <li><a href="#success-transport-tab" data-toggle="tab" onClick={() => handleSuccessTransportRequests()}><i className="fa fa-check-square-o text-green" aria-hidden="true"></i> {translate('manage_transportation.orders_table.success_transport_requests_tab')}</a></li>
                            <li><a href="#failure-transport-tab" data-toggle="tab" onClick={() => handleFailureTransportRequests()}><i className="fa fa-exclamation-circle text-red"></i>  {translate('manage_transportation.orders_table.failure_transport_requests_tab')}</a></li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane" id="request-stock-confirm-tab">
                                {type === 0 &&
                                    <LazyLoadComponent>
                                        <RequestStockConfirm/>
                                    </LazyLoadComponent>
                                }
                            </div>
                            <div className="tab-pane active" id="not-transport-tab">
                                {type === 1 &&
                                    <LazyLoadComponent>
                                        <NotTransportRequests
                                            setPage={setPage}
                                            setLimit={setLimit}
                                            totalPage={totalPage}
                                            currentPage={page}
                                            selectedData={selectedData}
                                            onSelectedRowsChange={onSelectedRowsChange}
                                            isProgress={isProgress}
                                            showConfirmBox={showConfirmBox}
                                            nextStep={nextStep}
                                            handleInitDeliveryPlan={handleInitDeliveryPlan}
                                            handleChangeEstimatedDeliveryDate={handleChangeEstimatedDeliveryDate}
                                            progressPercent={progressPercent}
                                        />
                                    </LazyLoadComponent>
                                }
                            </div>
                            <div className="tab-pane" id="transporting-tab">
                                {type === 2 &&
                                    <LazyLoadComponent>
                                        <TransportingRequests
                                        />
                                    </LazyLoadComponent>
                                }
                            </div>
                            <div className="tab-pane" id="success-transport-tab">
                                {type === 3 &&
                                    <LazyLoadComponent>
                                        <SuccessTransportRequests
                                        />
                                    </LazyLoadComponent>
                                }
                            </div>
                            <div className="tab-pane" id="failure-transport-tab">
                                {type === 4 &&
                                    <LazyLoadComponent>
                                        <FailureTransportRequests
                                        />
                                    </LazyLoadComponent>
                                }
                            </div>
                        </div>
                    </div>
                </div>
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
}

const connectedRequestTransportTable = connect(mapStateToProps, mapDispatchToProps)(withTranslate(RequestTransportTable));
export { connectedRequestTransportTable as RequestTransportTable };