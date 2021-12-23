import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti, DatePicker, DataTableSetting, PaginateBar, ConfirmNotification } from '../../../../../../common-components';

import BillDetailForm from '../genaral/billDetailForm';
import StockTakeEditForm from './stockTakeEditForm';
import StockTakeCreateForm from './stockTakeCreateForm';
import QualityControlForm from '../genaral/quatityControlForm';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';
function TakeManagement(props) {
    const tableId = "take-management-table";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        limit: limit,
        page: 1,
        group: '4',
        tableId
    })

    const { translate, bills, stocks, user } = props;
    const { listPaginate, totalPages, page } = bills;
    const { listStocks } = stocks;
    const { startDate, endDate, group, currentRow } = state;
    const dataPartner = props.getPartner();

    const handleEdit = async (bill) => {
        await setState({
            ...state,
            currentRow: bill
        })

        window.$('#modal-edit-bill-take').modal('show');
    }

    const findIndexOfStaff = (array, id) => {
        let result = -1;
        array.forEach((element, index) => {
            if (element.staff._id === id) {
                result = index;
            }
        });
        return result;
    }

    const handleFinishedQualityControlStaff = async (bill) => {
        const userId = localStorage.getItem("userId");
        let index = findIndexOfStaff(bill.qualityControlStaffs, userId);
        let qcStatus = bill.qualityControlStaffs[index].status ? bill.qualityControlStaffs.status : "";
        let qcContent = bill.qualityControlStaffs[index].content ? bill.qualityControlStaffs[index].content : "";
        await setState({
            ...state,
            currentControl: bill,
            qcStatus: qcStatus,
            qcContent: qcContent
        })
        window.$('#modal-quality-control-bill').modal('show');
    }

    return (
        <div id="bill-stock-takes">
            <div className="box-body qlcv">
                <StockTakeCreateForm group={group} />
                {
                    state.currentControl &&
                    <QualityControlForm
                        billId={state.currentControl._id}
                        code={state.currentControl.code}
                        status={state.qcStatus}
                        content={state.qcContent}
                    />
                }
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.stock')}</label>
                        <SelectMulti
                            id={`select-multi-stock-take`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listStocks.map((x, index) => { return { value: x._id, text: x.name } })}
                            onChange={props.handleStockChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.creator')}</label>
                        <SelectMulti
                            id={`select-multi-creator-take`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn người tạo", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={user.list.map(x => { return { value: x.id, text: x.name } })}
                            onChange={props.handleCreatorChange}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.code')}</label>
                        <input type="text" className="form-control" name="code" onChange={props.handleCodeChange} placeholder={translate('manage_warehouse.bill_management.code')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.type')}</label>
                        <SelectMulti
                            id={`select-multi-type-take`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: '5', text: translate('manage_warehouse.bill_management.billType.5') },
                                { value: '6', text: translate('manage_warehouse.bill_management.billType.6') },
                            ]}
                            onChange={props.handleTypeChange}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.from_date')}</label>
                        <DatePicker
                            id="book-stock-start-date-take"
                            dateFormat="month-year"
                            value={startDate}
                            onChange={props.handleChangeStartDate}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                        <DatePicker
                            id="book-stock-end-date-take"
                            dateFormat="month-year"
                            value={endDate}
                            onChange={props.handleChangeEndDate}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.status')}</label>
                        <SelectMulti
                            id={`select-multi-status-stock-take`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn trạng thái", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1') },
                                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3') },
                                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') },
                                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5') },
                            ]}
                            onChange={props.handleStatusChange}
                        />
                    </div>
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={props.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                    </div>
                </div>
                <BillDetailForm />
                {
                    currentRow &&
                    <StockTakeEditForm
                        billId={currentRow._id}
                        fromStock={currentRow.fromStock ? currentRow.fromStock._id : null}
                        code={currentRow.code}
                        group={currentRow.group}
                        type={currentRow.type}
                        status={currentRow.status}
                        oldStatus={currentRow.status}
                        users={currentRow.users}
                        approvers={currentRow.approvers ? currentRow.approvers : []}
                        listQualityControlStaffs={currentRow.qualityControlStaffs ? currentRow.qualityControlStaffs : []}
                        responsibles={currentRow.responsibles ? currentRow.responsibles : []}
                        accountables={currentRow.accountables ? currentRow.accountables : []}
                        description={currentRow.description}
                        listGood={currentRow.goods}
                        creator={currentRow.creator ? currentRow.creator._id : ''}
                    />
                }

                <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>{translate('manage_warehouse.bill_management.index')}</th>
                            <th>{translate('manage_warehouse.bill_management.code')}</th>
                            <th>{translate('manage_warehouse.bill_management.type')}</th>
                            <th>{translate('manage_warehouse.bill_management.status')}</th>
                            <th>{translate('manage_warehouse.bill_management.creator')}</th>
                            <th>{translate('manage_warehouse.bill_management.approved')}</th>
                            <th>{translate('manage_warehouse.bill_management.date')}</th>
                            <th>{translate('manage_warehouse.bill_management.stock')}</th>
                            <th>{translate('manage_warehouse.bill_management.description')}</th>
                            <th style={{ width: '120px' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_warehouse.bill_management.index'),
                                        translate('manage_warehouse.bill_management.code'),
                                        translate('manage_warehouse.bill_management.type'),
                                        translate('manage_warehouse.bill_management.status'),
                                        translate('manage_warehouse.bill_management.creator'),
                                        translate('manage_warehouse.bill_management.approved'),
                                        translate('manage_warehouse.bill_management.date'),
                                        translate('manage_warehouse.bill_management.stock'),
                                        translate('manage_warehouse.bill_management.description')
                                    ]}
                                    setLimit={props.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                            listPaginate.map((x, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{x.code}</td>
                                    <td>{translate(`manage_warehouse.bill_management.billType.${x.type}`)}</td>
                                    <td style={{ color: translate(`manage_warehouse.bill_management.bill_color.${x.status}`) }}>{translate(`manage_warehouse.bill_management.bill_status.${x.status}`)}</td>
                                    <td>{x.creator ? x.creator.name : "Creator is deleted"}</td>
                                    <td>{x.approvers ? x.approvers.map((a, key) => { return <p key={key}>{a.approver.name}</p> }) : "approver is deleted"}</td>
                                    <td>{props.formatDate(x.updatedAt)}</td>
                                    <td>{x.fromStock ? x.fromStock.name : "Stock is deleted"}</td>
                                    <td>{x.description}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a onClick={() => props.handleShowDetailInfo(x._id)}><i className="material-icons">view_list</i></a>
                                        {props.checkRoleCanEdit(x) && <a onClick={() => handleEdit(x)} className="text-yellow" ><i className="material-icons">edit</i></a>}
                                        {
                                            props.checkRoleApprovers(x) && x.status === '1' &&
                                            <ConfirmNotification
                                                icon="question"
                                                title={translate('manage_warehouse.bill_management.approved_true')}
                                                content={translate('manage_warehouse.bill_management.approved_true') + " " + x.code}
                                                name="check_circle_outline"
                                                className="text-green"
                                                func={() => props.handleFinishedApproval(x)}
                                            />
                                        }
                                        {
                                            props.checkRoleQualityControlStaffs(x) && x.status === '5' &&
                                            <a onClick={() => handleFinishedQualityControlStaff(x)} className="text-green" ><i className="material-icons">check_circle</i></a>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {bills.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={totalPages} currentPage={page} func={props.setPage} />
            </div>
        </div>
    );
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(TakeManagement));