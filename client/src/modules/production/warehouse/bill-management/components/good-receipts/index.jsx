import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti, DatePicker, DataTableSetting, PaginateBar } from '../../../../../../common-components';
import BillDetailForm from '../genaral/billDetailForm';
import GoodReceiptCreateFormModal from './goodReceiptCreateFormModal';
import { BillActions } from '../../redux/actions';
import QualityControlForm from '../genaral/quatityControlForm';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';
import Swal from "sweetalert2";
import { UserGuideCreateBillReceipt } from '../genaral/config.js';
import "../bill.css";
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import GoodReceiptWorkFlowModal from './goodReceiptWorkFlowModal';

function ReceiptManagement(props) {

    const tableId = "receipt-management-table";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        limit: limit,
        page: 1,
        group: '1',
        tableId,
        actionAddLots: '1', // 1: edit bill, 2: add lot in index screen, 3: add lot to damaged goods in detail screen
    })

    useEffect(() => {
        props.getAllRequestByCondition({ requestType: 3, type: 1, requestFrom: 'stock' });
    }, [])

    const showFilePreview = (data) => {
        const link = process.env.REACT_APP_SERVER + data[0].url;
        Swal.fire({
            html: ` 
            <h4>${data[0].pageName}</h4>
            <div style="margin:0px;padding:0px;overflow:hidden">
               <iframe  frameborder="0" style="overflow:hidden;height:90vh;width:100%" height="100vh" width="100%"
                        src= ${link}
                    />
            </div>`,
            width: "100%",
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: true,
            focusConfirm: false,

        })
    }

    const handleShowWorkFlowModal = (bill) => {
        setState({
            ...state,
            billInfor: bill,
        })
        window.$('#good-receipt-work-flow-modal').modal('show');
    }

    const handleSearchByStatus = (status) => {
        props.handleSearchByStatus(status);
    }

    const handleClickCreateFromRequest = () => {
        setState({
            ...state,
            createType: 2,
        });
        window.$('#modal-create-new-receipt-bill').modal('show');
    }

    const handleClickCreateDirectly = () => {
        setState({
            ...state,
            createType: 1,
        });
        window.$('#modal-create-new-receipt-bill').modal('show');
    }

    const { translate, bills, stocks, user, lots } = props;
    const { listPaginate, totalPages, page, listBillByGroup } = bills;
    const { listStocks } = stocks;
    const { startDate, endDate, group, currentRow, actionAddLots, createType, billInfor } = state;
    const dataPartner = props.getPartner();
    console.log(listPaginate);
    return (
        <div id="bill-good-receipts">
            <div className="box-body qlcv">
                <GoodReceiptCreateFormModal createType={createType} />
                {billInfor &&
                    <GoodReceiptWorkFlowModal billId={billInfor._id} billInfor={billInfor} />}
                {
                    state.currentControl &&
                    <QualityControlForm
                        billId={state.currentControl._id}
                        code={state.currentControl.code}
                        status={state.qcStatus}
                        content={state.qcContent}
                        listGoods={state.currentControl.goods}
                    />
                }
                <div className="form-inline">
                    <div className="dropdown pull-right" style={{ marginTop: 5 }}>
                        <button
                            type="button"
                            className="btn btn-success dropdown-toggle pull-right"
                            data-toggle="dropdown"
                            aria-expanded="true"
                            title={"Thêm mới phiếu nhập kho"}>{"Thêm mới"}</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: "pointer" }} title={`Tạo trực tiếp`} onClick={handleClickCreateDirectly}>{"Tạo trực tiếp"}</a></li>
                            <li><a style={{ cursor: "pointer" }} title={`Tạo từ yêu cầu`} onClick={handleClickCreateFromRequest}>{"Tạo từ yêu cầu nhập kho"}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.stock')}</label>
                        <SelectMulti
                            id={`select-multi-stock-receipt`}
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
                            id={`select-multi-creator-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn người tạo", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={user.list.map(x => { return { value: x.id, text: x.name } })}
                            onChange={props.handleCreatorChange}
                        />
                    </div>
                    <a href="#show-detail" onClick={() => showFilePreview(UserGuideCreateBillReceipt)}>
                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px', fontSize: '20px' }} />
                    </a>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.code')}</label>
                        <input type="text" className="form-control" name="code" onChange={props.handleCodeChange} placeholder={translate('manage_warehouse.bill_management.code')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.type')}</label>
                        <SelectMulti
                            id={`select-multi-type-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: '1', text: translate('manage_warehouse.bill_management.goodReceiptBillType.1') },
                                { value: '2', text: translate('manage_warehouse.bill_management.goodReceiptBillType.2') },
                                { value: '3', text: translate('manage_warehouse.bill_management.goodReceiptBillType.3') }
                            ]}
                            onChange={props.handleTypeChange}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.from_date')}</label>
                        <DatePicker
                            id="book-stock-start-date-receipt"
                            dateFormat="month-year"
                            value={startDate}
                            onChange={props.handleChangeStartDate}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                        <DatePicker
                            id="book-stock-end-date-receipt"
                            dateFormat="month-year"
                            value={endDate}
                            onChange={props.handleChangeEndDate}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{group === '1' ? translate('manage_warehouse.bill_management.supplier') : group === '2' ? translate('manage_warehouse.bill_management.customer') : group === '5' ? translate('manage_warehouse.bill_management.receipt_stock') : translate('manage_warehouse.bill_management.partner')}</label>
                        <SelectMulti
                            id={`select-multi-partner-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn đối tác", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={dataPartner}
                            onChange={props.handlePartnerChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bill_management.status')}</label>
                        <SelectMulti
                            id={`select-multi-status-book-receipt`}
                            multiple="multiple"
                            options={{ nonSelectedText: "Chọn trạng thái", allSelectedText: "Chọn tất cả" }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1') },
                                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                            ]}
                            onChange={props.handleStatusChange}
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={props.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                    </div>
                </div>
                <div className="box-body row" style={{ display: 'flex', width: "70%", marginLeft: "5%" }}>
                    <ul className="todo-list">
                        <li>
                            <span className="text" style={{ cursor: "pointer" }}><a onClick={() => handleSearchByStatus('1')}>Số lượng phiếu chờ phê duyệt</a></span>
                            <span className="label label-info" style={{ fontSize: '11px' }}>{listBillByGroup.filter(item => item.status === '1').length} Phiếu</span>
                        </li>
                        <li>
                            <span className="text" style={{ cursor: "pointer" }}><a onClick={() => handleSearchByStatus('2')}>Số lượng phiếu chờ thực hiện </a></span>
                            <span className="label label-warning" style={{ fontSize: '11px' }}>{listBillByGroup.filter(item => item.status === '2').length} Phiếu</span>
                        </li>
                    </ul>
                    <ul className="todo-list" style={{ marginLeft: "20px" }}>
                        <li>
                            <span className="text" style={{ cursor: "pointer" }}><a onClick={() => handleSearchByStatus('3')}>Số lượng phiếu chờ kiểm định chất lượng</a></span>
                            <span className="label label-info" style={{ fontSize: '11px' }}>{listBillByGroup.filter(item => item.status === '3').length} Phiếu</span>
                        </li>
                        <li>
                            <span className="text" style={{ cursor: "pointer" }}><a onClick={() => handleSearchByStatus('5')}>Số lượng phiếu đã hoàn thành </a></span>
                            <span className="label label-warning" style={{ fontSize: '11px' }}>{listBillByGroup.filter(item => item.status === '5').length} Phiếu</span>
                        </li>
                    </ul>
                </div>
                <BillDetailForm />
                <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>{translate('manage_warehouse.bill_management.index')}</th>
                            <th>{translate('manage_warehouse.bill_management.code')}</th>
                            <th>{translate('manage_warehouse.bill_management.status')}</th>
                            <th>{translate('manage_warehouse.bill_management.creator')}</th>
                            <th>{translate('manage_warehouse.bill_management.date')}</th>
                            <th>{translate('manage_warehouse.bill_management.stock')}</th>
                            <th style={{ width: '120px' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_warehouse.bill_management.index'),
                                        translate('manage_warehouse.bill_management.code'),
                                        translate('manage_warehouse.bill_management.status'),
                                        translate('manage_warehouse.bill_management.creator'),
                                        translate('manage_warehouse.bill_management.date'),
                                        translate('manage_warehouse.bill_management.stock'),
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
                                    <td style={{
                                        color: translate(`manage_warehouse.bill_management.bill_color.${x.status}`),
                                        whiteSpace: 'pre-wrap'
                                    }}>{translate(`manage_warehouse.bill_management.bill_status.${x.status}`)}</td>
                                    <td>{x.creator ? x.creator.name : "Creator is deleted"}</td>
                                    <td>{props.formatDate(x.updatedAt)}</td>
                                    <td>{x.fromStock ? x.fromStock.name : "Stock is deleted"}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        {/*show detail */}{
                                            // props.checkRoleCanViewDetail(x) &&
                                            <a onClick={() => props.handleShowDetailInfo(x._id)}><i className="material-icons">view_list</i></a>
                                        }
                                        {/*Thực hiện công việc */}
                                        {x.status === '1' && 
                                        // props.checkRolePerformWork(x) &&
                                            <a
                                                className="text-violet"
                                                title={translate('manage_warehouse.inventory_management.add_lot')}
                                                onClick={() => handleShowWorkFlowModal(x)}
                                            ><i className="material-icons">assignment_turned_in</i>
                                            </a>
                                        }
                                        {/*Chuyển phiếu sang trạng thái đã hủy*/}
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
        </div >
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editBill: BillActions.editBill,
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ReceiptManagement));
