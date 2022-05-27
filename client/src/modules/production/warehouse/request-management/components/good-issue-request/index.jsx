import React, { useState } from 'react';
import { connect } from 'react-redux';
import { formatDate } from '../../../../../../helpers/formatDate';
import { ConfirmNotification, DataTableSetting, DatePicker, PaginateBar, SelectMulti } from "../../../../../../common-components";
import DetailForm from '../common-components/detailForm';
import EditForm from '../common-components/editForm';
import CreateForm from '../common-components/createForm';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

function GoodIssueRequestManagementTable(props) {

    const [state, setState] = useState({
        createdAt: formatDate((new Date()).toISOString()),
        desiredTime: formatDate((new Date()).toISOString()),
    });

    const handleShowDetailRequest = async (request) => {
        await setState({
            ...state,
            requestDetail: request
        });

        window.$('#modal-detail-info-purchasing-request').modal('show');
    }

    const handleEditRequest = async (request) => {
        let listGoods = [];
        listGoods = request.goods.map((good) => {
            return {
                goodId: good.good._id,
                goodObject: good.good,
                quantity: good.quantity
            }
        });

        await setState({
            ...state,
            currentRow: request,
            listGoods: listGoods,
        });
        window.$('#modal-edit-request').modal('show');
    }

    const cancelPurchasingRequest = (request) => {
        const data = {
            status: 3
        }
        props.editRequest(request._id, data);
    }

    const { translate, requestManagements } = props;
    let listRequests = [];
    if (requestManagements.listRequests) {
        listRequests = requestManagements.listRequests
    }
    const { totalPages, page } = requestManagements;
    const { code, createdAt, planCode, desiredTime } = state;

    return (
        <React.Fragment>
            {<DetailForm requestDetail={state.requestDetail} />}
            {
                state.currentRow && state.listGoods &&
                <EditForm
                    requestId={state.currentRow._id}
                    code={state.currentRow.code}
                    desiredTime={state.currentRow.desiredTime}
                    description={state.currentRow.description}
                    listGoods={state.listGoods}
                    stock={state.currentRow.stock._id}
                    status={state.currentRow.status}
                    worksValue={state.currentRow.manufacturingWork._id}
                    approver={state.currentRow.approverInFactory[0].approver._id}
                    stockRequestType={props.stockRequestType}
                />
            }
            <div className="box-body qlcv">
                <CreateForm stockRequestType={props.stockRequestType}/>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('production.request_management.code')}</label>
                        <input type="text" className="form-control" value={code} onChange={props.handleCodeChange} placeholder="PDN202013021223" autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label>{translate('production.request_management.createdAt')}</label>
                        <DatePicker
                            id={`createdAt-purchasing-request`}
                            value={createdAt}
                            onChange={props.handleCreatedAtChange}
                            disabled={false}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label>{translate('production.request_management.status')}</label>
                        <SelectMulti
                            id={`select-status-purchasing-request`}
                            className="form-control select2"
                            multiple="multiple"
                            options={{ nonSelectedText: translate('production.request_management.select_status'), allSelectedText: translate('production.request_management.select_all') }}
                            style={{ width: "100%" }}
                            items={[
                                { value: 1, text: translate('production.request_management.receipt_request_from_order.1.content') },
                                { value: 2, text: translate('production.request_management.receipt_request_from_order.2.content') },
                                { value: 5, text: translate('production.request_management.receipt_request_from_order.5.content') },
                            ]}
                            onChange={props.handleStatusChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('production.request_management.desiredTime')}</label>
                        <DatePicker
                            id={`desiredTime-purchasing-request`}
                            value={desiredTime}
                            onChange={props.handleDesiredTimeChange}
                            disabled={false}
                        />
                    </div>

                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static"></label>
                        <button type="button" className="btn btn-success" title={translate('production.request_management.search')} onClick={props.handleSubmitSearch}>{translate('production.request_management.search')}</button>
                    </div>
                </div>
                <table id="purchasing-request-table" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('production.request_management.index')}</th>
                            <th>{translate('production.request_management.code')}</th>
                            <th>{translate('production.request_management.creator')}</th>
                            <th>{translate('production.request_management.approver')}</th>
                            <th>{translate('production.request_management.createdAt')}</th>
                            <th>{translate('production.request_management.desiredTime')}</th>
                            <th>{translate('production.request_management.status')}</th>
                            <th>{translate('production.request_management.description')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId="purchasing-request-table"
                                    columnArr={[
                                        translate('production.request_management.index'),
                                        translate('production.request_management.code'),
                                        translate('production.request_management.creator'),
                                        translate('production.request_management.approver'),
                                        translate('production.request_management.createdAt'),
                                        translate('production.request_management.desiredTime'),
                                        translate('production.request_management.status'),
                                        translate('production.request_management.description')
                                    ]}
                                    limit={state.limit}
                                    hideColumnOption={true}
                                    setLimit={props.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(listRequests && listRequests.length !== 0) &&
                            listRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{request.code}</td>
                                    <td>{request.creator && request.creator.name}</td>
                                    <td>{request.approverInWarehouse && request.approverInWarehouse[0].approver.name}</td>
                                    <td>{formatDate(request.createdAt)}</td>
                                    <td>{formatDate(request.desiredTime)}</td>
                                    <td style={{ color: request.status <= 5 ? translate(`production.request_management.receipt_request_from_order.${request.status}.color`) : translate(`production.request_management.purchasing_request.${request.status}.color`) }}>{request.status <= 5 ?  translate(`production.request_management.receipt_request_from_order.${request.status}.content`) : translate(`production.request_management.purchasing_request.${request.status}.content`)}</td>
                                    <td>{request.description}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a style={{ width: '5px' }} title={translate('production.request_management.request_detail')} onClick={() => { handleShowDetailRequest(request) }}><i className="material-icons">view_list</i></a>
                                        {
                                            request.status == 1 &&
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('production.request_management.request_edit')} onClick={() => handleEditRequest(request)}><i className="material-icons">edit</i></a>
                                        }
                                        {/*Phê duyệt yêu cầu*/}
                                        {
                                            props.checkRoleApprover(request) && request.status == 1 &&
                                            <ConfirmNotification
                                                icon="question"
                                                title={translate('production.request_management.approved_true')}
                                                content={translate('production.request_management.approved_true') + " " + request.code}
                                                name="check_circle_outline"
                                                className="text-green"
                                                func={() => props.handleFinishedApproval(request)}
                                            />
                                        }
                                        {
                                            request.status == 1 &&
                                            <ConfirmNotification
                                                icon="question"
                                                title={translate('production.request_management.cancel_request')}
                                                content={translate('production.request_management.cancel_request') + " " + request.code}
                                                name="cancel"
                                                className="text-red"
                                                func={() => props.handleCancelRequest(request)}
                                            />
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
                <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={props.setPage} />
            </div>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodIssueRequestManagementTable));
