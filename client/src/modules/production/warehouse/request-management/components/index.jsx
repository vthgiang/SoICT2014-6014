import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import GoodReceiptRequestManagementTable from './good-receipt-request/index';
import GoodIssueRequestManagementTable from './good-issue-request/index';
import GoodReturnRequestManagementTable from './good-return-request/index';
import GoodTakeRequestManagementTable from './good-take-request/index';
import { RequestActions } from '../../../common-production/request-management/redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { StockActions } from "../../../warehouse/stock-management/redux/actions";
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { LazyLoadComponent } from '../../../../../common-components/index';

function RequestManagement(props) {

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: 5,
        requestType: 3,
        type: 1,
        createdAt: '',
        desiredTime: '',
        code: '',
        status: null,
        requestFrom: 'stock',
    });

    useEffect(() => {
        props.getAllRequestByCondition(state);
        props.getAllGoodsByType({ type: 'material' });
        props.getUser();
        props.getAllStocks();
        props.getAllDepartments();
    }, []);

    const handleCodeChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            code: value
        });
    }

    const handleCreatedAtChange = (value) => {
        setState({
            ...state,
            createdAt: value
        })
    }

    const handleDesiredTimeChange = (value) => {
        if (value === '') {
            value = null;
        }
        setState({
            ...state,
            desiredTime: value
        })
    }

    const handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        }
        setState({
            ...state,
            status: value
        })
    }

    const handleSubmitSearch = () => {
        setState({
            ...state,
            page: 1
        });
        const data = {
            limit: state.limit,
            page: state.page,
            createdAt: state.createdAt,
            desiredTime: state.desiredTime,
            code: state.code,
            status: state.status
        }
        props.getAllRequestByCondition(data);
    }

    const checkRoleApprover = (request) => {
        const { approverInWarehouse } = request;
        const userId = localStorage.getItem("userId");
        let approverIds = approverInWarehouse.map(x => x.approver._id);
        if (approverIds.includes(userId) && approverInWarehouse[approverIds.indexOf(userId)].approvedTime === null) {
            return true;
        }
        return false
    }

    const handleFinishedApproval = (request) => {
        const userId = localStorage.getItem("userId");
        const data = {
            approverIdInWarehouse: userId
        }
        props.editRequest(request._id, data);
    }

    const handleCancelRequest = (request) => {
        const data = {
            status: 5
        }
        props.editRequest(request._id, data);
    }

    const setLimit = async (limit) => {
        await setState({
            ...state,
            limit: limit,
            page: state.page
        });

        let page = state.page;
        props.getAllRequestByCondition({ page, limit })
    }

    const setPage = async (page) => {
        await setState({
            ...state,
            limit: state.limit,
            page: page
        });
        let limit = state.limit;
        props.getAllRequestByCondition({ page, limit });

    }

    const handleGoodReceiptRequest = async () => {
        const requestType = 3;
        const type = 1;
        const requestFrom = 'stock';
        await setState({
            ...state,
            type: type,
            requestType: requestType,
        })
        await props.getAllRequestByCondition({ type, requestType, requestFrom });
    };

    const handleGoodIssueRequest = async () => {
        const requestType = 3;
        const type = 2;
        const requestFrom = 'stock';
        await setState({
            ...state,
            type: type,
            requestType: requestType
        })
        await props.getAllRequestByCondition({ type, requestType, requestFrom });
    };

    const handleGoodReturnRequest = async () => {
        const requestType = 3;
        const type = 3;
        const requestFrom = 'stock';
        await setState({
            ...state,
            type: type,
            requestType: requestType
        })
        await props.getAllRequestByCondition({ type, requestType, requestFrom });
    };

    const handleGoodTakeRequest = async () => {
        const requestType = 3;
        const type = 4;
        const requestFrom = 'stock';
        await setState({
            ...state,
            type: type,
            requestType: requestType
        })
        await props.getAllRequestByCondition({ type, requestType, requestFrom });
    };

    const { translate } = props;
    const { requestType, type } = state;

    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a href="#good-receipt-request" data-toggle="tab" onClick={() => handleGoodReceiptRequest()}>{translate('production.request_management.receipt_request')}</a></li>
                <li><a href="#good-issue-request" data-toggle="tab" onClick={() => handleGoodIssueRequest()}>{translate('production.request_management.issue_request')}</a></li>
                <li><a href="#good-return-request" data-toggle="tab" onClick={() => handleGoodReturnRequest()}>{translate('production.request_management.good_return_request')}</a></li>
                <li><a href="#good-take-request" data-toggle="tab" onClick={() => handleGoodTakeRequest()}>{translate('production.request_management.good_take_request')}</a></li>
            </ul>
            <div className="tab-content">
                <div className="tab-pane active" id="good-receipt-request">
                    {requestType === 3 && type === 1 &&
                        <LazyLoadComponent>
                            <GoodReceiptRequestManagementTable
                                setPage={setPage}
                                setLimit={setLimit}
                                checkRoleApprover={checkRoleApprover}
                                handleFinishedApproval={handleFinishedApproval}
                                handleCancelRequest={handleCancelRequest}
                                handleCodeChange={handleCodeChange}
                                handleCreatedAtChange={handleCreatedAtChange}
                                handleDesiredTimeChange={handleDesiredTimeChange}
                                handleStatusChange={handleStatusChange}
                                handleSubmitSearch={handleSubmitSearch}
                                stockRequestType={type}
                            />
                        </LazyLoadComponent>
                    }
                </div>
                <div className="tab-pane" id="good-issue-request">
                    {requestType === 3 && type === 2 &&
                        <LazyLoadComponent>
                            <GoodIssueRequestManagementTable
                                setPage={setPage}
                                setLimit={setLimit}
                                checkRoleApprover={checkRoleApprover}
                                handleFinishedApproval={handleFinishedApproval}
                                handleCancelRequest={handleCancelRequest}
                                handleCodeChange={handleCodeChange}
                                handleCreatedAtChange={handleCreatedAtChange}
                                handleDesiredTimeChange={handleDesiredTimeChange}
                                handleStatusChange={handleStatusChange}
                                handleSubmitSearch={handleSubmitSearch}
                                stockRequestType={type}
                            />
                        </LazyLoadComponent>
                    }
                </div>
                <div className="tab-pane" id="good-return-request">
                    {requestType === 3 && type === 3 &&
                        <LazyLoadComponent>
                            <GoodReturnRequestManagementTable
                                setPage={setPage}
                                setLimit={setLimit}
                                checkRoleApprover={checkRoleApprover}
                                handleFinishedApproval={handleFinishedApproval}
                                handleCancelRequest={handleCancelRequest}
                                handleCodeChange={handleCodeChange}
                                handleCreatedAtChange={handleCreatedAtChange}
                                handleDesiredTimeChange={handleDesiredTimeChange}
                                handleStatusChange={handleStatusChange}
                                handleSubmitSearch={handleSubmitSearch}
                                stockRequestType={type}
                            />
                        </LazyLoadComponent>
                    }
                </div>
                <div className="tab-pane" id="good-take-request">
                    {requestType === 3 && type === 4 &&
                        <LazyLoadComponent>
                            <GoodTakeRequestManagementTable
                                setPage={setPage}
                                setLimit={setLimit}
                                checkRoleApprover={checkRoleApprover}
                                handleFinishedApproval={handleFinishedApproval}
                                handleCancelRequest={handleCancelRequest}
                                handleCodeChange={handleCodeChange}
                                handleCreatedAtChange={handleCreatedAtChange}
                                handleDesiredTimeChange={handleDesiredTimeChange}
                                handleStatusChange={handleStatusChange}
                                handleSubmitSearch={handleSubmitSearch}
                                stockRequestType={type}
                            />
                        </LazyLoadComponent>
                    }
                </div>
            </div>
        </div>
    );
}
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
    editRequest: RequestActions.editRequest,
    getUser: UserActions.get,
    getAllStocks: StockActions.getAllStocks,
    editRequest: RequestActions.editRequest,
    getAllDepartments: DepartmentActions.get,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RequestManagement));
